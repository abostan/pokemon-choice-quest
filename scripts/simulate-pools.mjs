// Simulatore statistico dei pool di bivi/Pokémon (pre-postgame e post-game),
// per scovare a tavolino gli stessi problemi di bilanciamento che altrimenti
// emergono solo dopo ore di gioco reale (bivi che dominano o non compaiono
// mai, pool con troppo poche specie, tasso leggendario/Shiny fuori dalle
// attese, specie del Pokédex mai raggiungibili) — nato da tre segnalazioni
// reali di un giocatore (ROADMAP.md Fase 12) e dal bisogno di verificarle
// su larga scala invece che a occhio.
//
// Come analyze-run-log.mjs e simulate-flow.mjs, riusa sempre la logica/i
// dati REALI del gioco, mai una copia scollegabile:
//   - computeExploreSeed/computePostgameSeed/pickWeightedIds/pickTopIds
//     (engine/explorePicker.js) per la selezione dei bivi mostrati;
//   - EXPLORE_SPECIAL_WEIGHTS (data/exploreOptions.js) per i pesi reali;
//   - resolvePostgameExplore (engine/gameStateTransitions.js) per il roll
//     leggendario ambientale del post-game (Fase 10/12, già puro);
//   - SHINY_RATE_MODES (engine/settings.js) per il tasso Shiny reale;
//   - i pool per zona (data/exploreZonePools.js, estratti da
//     ExploreSceneContainer.js apposta per questo script);
//   - EVOLUTIONS (data/evolutions.js) e NATIONAL_DEX_REGIONS
//     (data/nationalDex.js, estratto da PokedexModal.js) per la Sezione D.
// L'unica parte "nuova" è il giocatore simulato che sceglie un bivio a caso
// tra quelli mostrati: la risoluzione a valle (pool -> specie, tiro Shiny)
// passa sempre dalle stesse funzioni/dati pure del gioco vero.
//
// Simboli: ✅ dentro i limiti attesi — ⚠️ fuori dai limiti, da controllare
//          — ℹ️ informativo (piccolo per design o campione insufficiente,
//          non un problema).
//
// Uso: node scripts/simulate-pools.mjs [round]   (default 400 round a sezione)

import { GENERATIONS, getExplorationTier } from "../src/data/generations.js";
import { computeExploreSeed, computePostgameSeed, pickWeightedIds, pickTopIds } from "../src/engine/explorePicker.js";
import { EXPLORE_SPECIAL_WEIGHTS } from "../src/data/exploreOptions.js";
import { resolvePostgameExplore } from "../src/engine/gameStateTransitions.js";
import { SHINY_RATE_MODES } from "../src/engine/settings.js";
import { EVOLUTIONS } from "../src/data/evolutions.js";
import { TOTAL_POKEMON_COUNT, NATIONAL_DEX_REGIONS } from "../src/data/nationalDex.js";
import {
  FIRE_POOLS_BY_REGION,
  GHOST_POOLS_BY_REGION,
  ICE_POOLS_BY_REGION,
  FIGHTING_POOLS_BY_REGION,
  EGG_POOLS_BY_REGION,
  FOSSIL_POOLS_BY_REGION,
  SAFARI_POOLS_BY_REGION,
  NPC_TRADE_POOL,
  POSTGAME_FIRE_POOL,
  POSTGAME_GHOST_POOL,
  POSTGAME_ICE_POOL,
  POSTGAME_FIGHTING_POOL,
  POSTGAME_SAFARI_POOL,
  POSTGAME_FOSSIL_POOL,
  POSTGAME_TRADE_POOL,
  POSTGAME_EGG_POOL,
  POSTGAME_ULTRA_POOL,
  CASINO_JACKPOT_POOL,
} from "../src/data/exploreZonePools.js";

// PRNG seedato (mulberry32), stesso usato in tests/explorePicker.test.js:
// pilota SOLO lo scenario simulato (quale bivio "sceglie" il giocatore
// simulato, quale specie esce da un pool, se un incontro è Shiny) — mai la
// logica di gioco stessa, che resta sempre quella reale importata sopra.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickFrom(pool, rng) {
  return pool[Math.floor(rng() * pool.length)];
}

// Replica esatta della selezione del leggendario pre-postgame in
// ExploreSceneContainer.js ("legendary".onSelect): preferisce uno non ancora
// catturato, altrimenti ripesca dall'intero pool regionale.
function pickPrePostgameLegendary(generation, caughtLegendaries, rng) {
  const legendaries = generation.legendaries || [150];
  const uncaptured = legendaries.filter((id) => !caughtLegendaries.includes(id));
  return uncaptured.length > 0 ? pickFrom(uncaptured, rng) : pickFrom(legendaries, rng);
}

const ROUNDS = Number(process.argv[2]) || 400;
const DOMINATION_PCT = 60;
const SMALL_POOL_THRESHOLD = 5;
const REGION_REACHABILITY_WARN_PCT = 75; // Sezione D: sotto questa % raggiungibile, una regione merita attenzione

const ALL_IDS = Object.keys(EXPLORE_SPECIAL_WEIGHTS);
const WEIGHTED_ITEMS = ALL_IDS.map((id) => ({ id, weight: EXPLORE_SPECIAL_WEIGHTS[id] }));

// Id del pool speciale post-game (ExploreSceneContainer.js,
// "postgameSpecialPool"): pickTopIds usa solo l'identità degli id (hash-sort),
// non i loro dati — va tenuto in sync manualmente se in futuro si
// aggiunge/rimuove un'opzione post-game.
const POSTGAME_SPECIAL_IDS = [
  "ultraWormhole", "redBoss", "championsTournament", "safariZone", "fossilRevival",
  "npcTrade", "wanderingMerchant", "casinoGameCorner", "weatherCondition",
  "fireZone", "ghostZone", "iceZone", "fightingZone", "pokecenterMarket",
  "searchItems", "mysteryEgg", "enemyTeam", "fish", "cave", "trainer",
];

const PRE_POSTGAME_ZONE_POOLS = {
  fireZone: (region) => FIRE_POOLS_BY_REGION[region] || [37, 58, 100],
  ghostZone: (region) => GHOST_POOLS_BY_REGION[region] || [92, 63, 35],
  iceZone: (region) => ICE_POOLS_BY_REGION[region] || [124, 131, 220],
  fightingZone: (region) => FIGHTING_POOLS_BY_REGION[region] || [66, 56, 106],
  mysteryEgg: (region) => EGG_POOLS_BY_REGION[region] || [133, 175, 447],
  fossilRevival: (region) => FOSSIL_POOLS_BY_REGION[region] || [138, 140, 142, 345, 347],
  safariZone: (region) => SAFARI_POOLS_BY_REGION[region] || [123, 127, 128, 115, 147],
  npcTrade: () => NPC_TRADE_POOL,
};
// Zone la cui pool pre-postgame è per-regione (usate per segnalare quali
// regioni ricadono sul fallback generico invece di avere un pool proprio).
const REGION_KEYED_ZONES = {
  fireZone: FIRE_POOLS_BY_REGION,
  ghostZone: GHOST_POOLS_BY_REGION,
  iceZone: ICE_POOLS_BY_REGION,
  fightingZone: FIGHTING_POOLS_BY_REGION,
  mysteryEgg: EGG_POOLS_BY_REGION,
  fossilRevival: FOSSIL_POOLS_BY_REGION,
  safariZone: SAFARI_POOLS_BY_REGION,
};

const POSTGAME_ZONE_POOLS = {
  ultraWormhole: POSTGAME_ULTRA_POOL,
  safariZone: POSTGAME_SAFARI_POOL,
  fossilRevival: POSTGAME_FOSSIL_POOL,
  npcTrade: POSTGAME_TRADE_POOL,
  fireZone: POSTGAME_FIRE_POOL,
  ghostZone: POSTGAME_GHOST_POOL,
  iceZone: POSTGAME_ICE_POOL,
  fightingZone: POSTGAME_FIGHTING_POOL,
  mysteryEgg: POSTGAME_EGG_POOL,
};

const warnings = [];
function warn(section, text) {
  warnings.push(`[${section}] ${text}`);
  console.log(`  ⚠️  ${text}`);
}

console.log(`Simulazione pool bivi/Pokémon — ${ROUNDS} round per sezione\n`);

// ============================================================
// SEZIONE A — Frequenza dei bivi
// ============================================================
console.log("=".repeat(70));
console.log("🔀 SEZIONE A — Frequenza dei bivi mostrati");
console.log("=".repeat(70));

function simulateExploreCrossroads(rounds, rngSeed) {
  const rng = mulberry32(rngSeed);
  const stages = [];
  let choicesCount = 0;
  for (let i = 0; i < rounds; i++) {
    const gymIndex = i % 8;
    const badgesCount = gymIndex;
    choicesCount += 2 + Math.floor(rng() * 6);
    const seed = computeExploreSeed({ gymIndex, badgesCount, choicesCount });
    stages.push(pickWeightedIds(WEIGHTED_ITEMS, seed, 6));
  }
  return stages;
}

console.log(`\n--- Pre-postgame ("explore", ${ROUNDS} bivi simulati, pesi indipendenti dalla regione) ---`);
{
  const stages = simulateExploreCrossroads(ROUNDS, 1);
  const shownCount = Object.fromEntries(ALL_IDS.map((id) => [id, 0]));
  for (const picked of stages) picked.forEach((id) => shownCount[id]++);

  for (const id of [...ALL_IDS].sort((a, b) => shownCount[b] - shownCount[a])) {
    const pct = (shownCount[id] / ROUNDS) * 100;
    let marker = "✅";
    if (pct > DOMINATION_PCT) {
      warn("bivi-pre", `"${id}" mostrata nel ${pct.toFixed(0)}% dei bivi pre-postgame — domina la rotazione`);
      marker = "⚠️";
    } else if (shownCount[id] === 0) {
      warn("bivi-pre", `"${id}" non è mai comparsa in ${ROUNDS} bivi pre-postgame`);
      marker = "⚠️";
    }
    console.log(`  ${marker} ${id.padEnd(20)} ${String(shownCount[id]).padStart(5)}/${ROUNDS} (${pct.toFixed(0)}%)`);
  }
}

console.log(`\n--- Post-game ("postgameExplore", ${ROUNDS} round simulati) ---`);
{
  const shownCount = Object.fromEntries(POSTGAME_SPECIAL_IDS.map((id) => [id, 0]));
  for (let round = 0; round < ROUNDS; round++) {
    const seed = computePostgameSeed({ postgameRound: round });
    const picked = pickTopIds(POSTGAME_SPECIAL_IDS, seed, 6);
    picked.forEach((id) => shownCount[id]++);
  }
  for (const id of [...POSTGAME_SPECIAL_IDS].sort((a, b) => shownCount[b] - shownCount[a])) {
    const pct = (shownCount[id] / ROUNDS) * 100;
    let marker = "✅";
    if (pct > DOMINATION_PCT) {
      warn("bivi-post", `"${id}" mostrata nel ${pct.toFixed(0)}% dei bivi post-game — domina la rotazione`);
      marker = "⚠️";
    } else if (shownCount[id] === 0) {
      warn("bivi-post", `"${id}" non è mai comparsa in ${ROUNDS} bivi post-game`);
      marker = "⚠️";
    }
    console.log(`  ${marker} ${id.padEnd(20)} ${String(shownCount[id]).padStart(5)}/${ROUNDS} (${pct.toFixed(0)}%)`);
  }
}

// ============================================================
// SEZIONE B — Dimensione dei pool Pokémon per zona
// ============================================================
console.log("\n" + "=".repeat(70));
console.log("🐾 SEZIONE B — Pool Pokémon per zona (dimensione reale, non campionata:");
console.log("             sono array statici, il conteggio esatto è più utile di una stima)");
console.log("=".repeat(70));

console.log("\n--- Pre-postgame (per regione) ---");
for (const generation of GENERATIONS) {
  const tier0 = generation.explorationTiers[0];
  const rows = [
    ["grass", tier0.grass.length],
    ["fishing", tier0.fishing.length],
    ["cave", tier0.cave.length],
    ["legendary", (generation.legendaries || []).length],
  ];
  for (const [zoneId, poolFn] of Object.entries(PRE_POSTGAME_ZONE_POOLS)) {
    const pool = poolFn(generation.id);
    const usesFallback = REGION_KEYED_ZONES[zoneId] && !REGION_KEYED_ZONES[zoneId][generation.id];
    rows.push([zoneId + (usesFallback ? " (fallback!)" : ""), pool.length]);
  }
  console.log(`\n  ${generation.name}:`);
  for (const [label, size] of rows) {
    const isLegendaryRow = label.includes("legendary");
    const tooSmall = !isLegendaryRow && size < SMALL_POOL_THRESHOLD;
    if (tooSmall) warn("pool-pre", `${generation.name}/${label}: solo ${size} specie nel pool`);
    const marker = isLegendaryRow ? "ℹ️ " : tooSmall ? "⚠️ " : "✅ ";
    console.log(`    ${marker}${label.padEnd(22)} ${size} specie`);
  }
}
const fallbackZones = Object.entries(REGION_KEYED_ZONES).filter(([, byRegion]) =>
  GENERATIONS.some((g) => !byRegion[g.id])
);
if (fallbackZones.length > 0) {
  console.log("\n  Regioni senza pool dedicato (usano il fallback generico Kanto-based):");
  for (const [zoneId, byRegion] of fallbackZones) {
    const missing = GENERATIONS.filter((g) => !byRegion[g.id]).map((g) => g.name);
    warn("pool-pre", `"${zoneId}" non ha un pool dedicato per: ${missing.join(", ")}`);
    console.log(`    ⚠️  ${zoneId}: ${missing.join(", ")}`);
  }
} else {
  console.log("\n  ✅ Tutte le 9 regioni hanno un pool dedicato su ogni zona a tema.");
}

console.log("\n--- Post-game (pool fissi, multi-generazione) ---");
{
  const rows = Object.entries(POSTGAME_ZONE_POOLS).map(([id, pool]) => [id, pool.length]);
  const ALL_LEGENDARIES = GENERATIONS.flatMap((gen) => gen.legendaries || []);
  rows.push(["legendary (roll ambientale)", ALL_LEGENDARIES.length]);
  for (const [label, size] of rows) {
    const isLegendaryRow = label.startsWith("legendary");
    const tooSmall = !isLegendaryRow && size < SMALL_POOL_THRESHOLD;
    if (tooSmall) warn("pool-post", `postgame/${label}: solo ${size} specie nel pool`);
    const marker = isLegendaryRow ? "ℹ️ " : tooSmall ? "⚠️ " : "✅ ";
    console.log(`    ${marker}${label.padEnd(28)} ${size} specie`);
  }
}

// ============================================================
// SEZIONE C — Sessione simulata aggregata
// ============================================================
console.log("\n" + "=".repeat(70));
console.log("🎮 SEZIONE C — Sessione simulata aggregata (giocatore che sceglie a caso");
console.log("             tra i bivi mostrati, per stimare cosa vede in una run tipica)");
console.log("=".repeat(70));

function reportAggregate(label, stats) {
  const legendaryPct = stats.roundsWithEncounter > 0 ? (stats.legendaryEncounters / stats.roundsWithEncounter) * 100 : 0;
  const shinyPct = stats.roundsWithEncounter > 0 ? (stats.shinyCount / stats.roundsWithEncounter) * 100 : 0;
  const normalEncounters = stats.roundsWithEncounter - stats.legendaryEncounters;
  const theoreticalShiny =
    stats.roundsWithEncounter > 0
      ? ((normalEncounters * SHINY_RATE_MODES.default.normal + stats.legendaryEncounters * SHINY_RATE_MODES.default.legendary) /
          stats.roundsWithEncounter) *
        100
      : 0;
  const shinyOff = Math.abs(shinyPct - theoreticalShiny) > 3 && stats.roundsWithEncounter >= 200;
  if (shinyOff) {
    warn("sessione", `${label}: tasso Shiny osservato (${shinyPct.toFixed(2)}%) lontano dal teorico (${theoreticalShiny.toFixed(2)}%)`);
  }
  console.log(`\n  ${shinyOff ? "⚠️ " : "✅ "}${label}:`);
  console.log(`    specie uniche incontrate: ${stats.uniqueSpecies.size} (su ${stats.roundsWithEncounter} incontri, ${stats.totalRounds} round)`);
  console.log(`    incontri leggendari: ${stats.legendaryEncounters} (${legendaryPct.toFixed(1)}% degli incontri)`);
  console.log(`    Shiny osservati: ${stats.shinyCount} (${shinyPct.toFixed(2)}% osservato vs ${theoreticalShiny.toFixed(2)}% teorico)`);
}

console.log("\n--- Pre-postgame, per regione ---");
for (const generation of GENERATIONS) {
  const rng = mulberry32(42 + generation.id.length);
  const stats = { uniqueSpecies: new Set(), totalRounds: ROUNDS, roundsWithEncounter: 0, legendaryEncounters: 0, shinyCount: 0 };
  const caughtLegendaries = [];
  let choicesCount = 0;

  for (let i = 0; i < ROUNDS; i++) {
    const gymIndex = i % 8;
    const badgesCount = gymIndex;
    choicesCount += 2 + Math.floor(rng() * 6);
    const seed = computeExploreSeed({ gymIndex, badgesCount, choicesCount });
    const rotating = pickWeightedIds(WEIGHTED_ITEMS, seed, 6);
    const options = [...rotating, "grass"];
    const chosen = pickFrom(options, rng);

    const tier = getExplorationTier(generation, gymIndex);
    const useAltGrass = gymIndex % 2 === 1;

    let speciesId = null;
    let isLegendary = false;
    if (chosen === "grass") {
      speciesId = pickFrom(useAltGrass ? tier.grass2 : tier.grass, rng);
    } else if (chosen === "fish") {
      speciesId = pickFrom(tier.fishing, rng);
    } else if (chosen === "cave") {
      speciesId = pickFrom(tier.cave, rng);
    } else if (chosen === "legendary") {
      speciesId = pickPrePostgameLegendary(generation, caughtLegendaries, rng);
      isLegendary = true;
      caughtLegendaries.push(speciesId); // approssimazione: si assume la cattura per diversificare i round successivi
    } else if (PRE_POSTGAME_ZONE_POOLS[chosen]) {
      speciesId = pickFrom(PRE_POSTGAME_ZONE_POOLS[chosen](generation.id), rng);
    }

    if (speciesId != null) {
      stats.roundsWithEncounter++;
      stats.uniqueSpecies.add(speciesId);
      if (isLegendary) stats.legendaryEncounters++;
      const shinyChance = isLegendary ? SHINY_RATE_MODES.default.legendary : SHINY_RATE_MODES.default.normal;
      if (rng() < shinyChance) stats.shinyCount++;
    }
  }
  reportAggregate(generation.name, stats);
}

console.log("\n--- Post-game (regione di riferimento per grass/fish/cave: l'ultima, come a fine run) ---");
{
  const lastGeneration = GENERATIONS[GENERATIONS.length - 1];
  const lastTier = lastGeneration.explorationTiers[lastGeneration.explorationTiers.length - 1];
  const rng = mulberry32(777);
  const stats = { uniqueSpecies: new Set(), totalRounds: ROUNDS, roundsWithEncounter: 0, legendaryEncounters: 0, shinyCount: 0 };
  const caughtLegendaries = [];
  let ambientFires = 0;

  for (let round = 0; round < ROUNDS; round++) {
    // Roll ambientale (resolvePostgameExplore, Fase 10/12): può dirottare il
    // round su un incontro leggendario PRIMA che il bivio venga mostrato,
    // esattamente come nel gioco vero (update() lo intercetta ad ogni
    // transizione verso "postgameExplore").
    const ambient = resolvePostgameExplore({ caughtLegendaries, postgameRound: round }, rng);
    if (ambient.phase === "legendaryEncounter") {
      ambientFires++;
      const legendaryId = ambient.patch.pendingEncounterPool[0];
      stats.roundsWithEncounter++;
      stats.uniqueSpecies.add(legendaryId);
      stats.legendaryEncounters++;
      caughtLegendaries.push(legendaryId); // stessa approssimazione del ramo pre-postgame
      if (rng() < SHINY_RATE_MODES.default.legendary) stats.shinyCount++;
      continue;
    }

    const seed = computePostgameSeed({ postgameRound: round });
    const rotating = pickTopIds(POSTGAME_SPECIAL_IDS, seed, 6);
    const options = [...rotating, "grass"];
    const chosen = pickFrom(options, rng);

    let speciesId = null;
    if (chosen === "grass") {
      speciesId = pickFrom(lastTier.grass, rng);
    } else if (chosen === "fish") {
      speciesId = pickFrom(lastTier.fishing, rng);
    } else if (chosen === "cave") {
      speciesId = pickFrom(lastTier.cave, rng);
    } else if (chosen === "ultraWormhole") {
      speciesId = pickFrom(POSTGAME_ULTRA_POOL, rng);
    } else if (POSTGAME_ZONE_POOLS[chosen]) {
      speciesId = pickFrom(POSTGAME_ZONE_POOLS[chosen], rng);
    }

    if (speciesId != null) {
      stats.roundsWithEncounter++;
      stats.uniqueSpecies.add(speciesId);
      const shinyChance = SHINY_RATE_MODES.default.normal;
      if (rng() < shinyChance) stats.shinyCount++;
    }
  }
  console.log(`\n  ℹ️  roll ambientale leggendario scattato in ${ambientFires}/${ROUNDS} round (${((ambientFires / ROUNDS) * 100).toFixed(1)}%)`);
  reportAggregate("Post-game", stats);
}

// ============================================================
// SEZIONE D — Raggiungibilità del Pokédex nazionale
// ============================================================
console.log("\n" + "=".repeat(70));
console.log("📖 SEZIONE D — Raggiungibilità del Pokédex nazionale");
console.log("             (cattura diretta da un pool + chiusura sulle evoluzioni note)");
console.log("=".repeat(70));

function computeReachableSpecies() {
  const seeds = new Set();
  for (const gen of GENERATIONS) {
    (gen.starterIds || []).forEach((id) => seeds.add(id));
    (gen.legendaries || []).forEach((id) => seeds.add(id));
    for (const tier of gen.explorationTiers) {
      ["grass", "grass2", "fishing", "cave"].forEach((key) => (tier[key] || []).forEach((id) => seeds.add(id)));
    }
    Object.values(PRE_POSTGAME_ZONE_POOLS).forEach((poolFn) => poolFn(gen.id).forEach((id) => seeds.add(id)));
  }
  Object.values(POSTGAME_ZONE_POOLS).forEach((pool) => pool.forEach((id) => seeds.add(id)));
  NPC_TRADE_POOL.forEach((id) => seeds.add(id));
  CASINO_JACKPOT_POOL.forEach((id) => seeds.add(id));

  // Chiusura transitiva: un Pokémon è raggiungibile anche solo attraverso
  // l'evoluzione di una specie già catturabile (data/evolutions.js).
  const reachable = new Set(seeds);
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of reachable) {
      const evo = EVOLUTIONS[id];
      if (evo && evo.evolvesTo !== id && !reachable.has(evo.evolvesTo)) {
        reachable.add(evo.evolvesTo);
        changed = true;
      }
      // Eevee (133) è l'unica evoluzione "a bivio reale" del gioco
      // (checkEvolution() in evolutions.js sceglie Espeon/Umbreon in base
      // all'ora reale invece di un evolvesTo fisso) — la tabella statica
      // punta solo a Espeon (196), quindi Umbreon (197) va aggiunto qui a
      // mano per non segnalarlo come "mai raggiungibile" per errore.
      if (id === "133" || id === 133) {
        if (!reachable.has(196)) { reachable.add(196); changed = true; }
        if (!reachable.has(197)) { reachable.add(197); changed = true; }
      }
    }
  }
  return { seeds, reachable };
}

{
  const { seeds, reachable } = computeReachableSpecies();
  const totalPct = (reachable.size / TOTAL_POKEMON_COUNT) * 100;
  console.log(`\n  ℹ️  ${seeds.size} specie catturabili direttamente da un pool/leggendario/starter/jackpot;`);
  console.log(`      +${reachable.size - seeds.size} raggiungibili solo tramite evoluzione da una di queste.`);
  console.log(`\n  Totale: ${reachable.size}/${TOTAL_POKEMON_COUNT} specie del Pokédex nazionale raggiungibili (${totalPct.toFixed(1)}%)`);
  console.log(`  (il resto richiederebbe scambio/eventi come nei giochi originali — qui non implementati,`);
  console.log(`   quindi un valore ben sotto il 100% è atteso: la scala di questo numero, non il 100%, è la cosa da monitorare)`);

  const regionStats = NATIONAL_DEX_REGIONS.filter((r) => r.id !== "all").map((region) => {
    let total = 0, reached = 0;
    for (let id = region.start; id <= region.end; id++) {
      total++;
      if (reachable.has(id)) reached++;
    }
    return { region, total, reached, pct: (reached / total) * 100 };
  });
  const avgPct = regionStats.reduce((sum, r) => sum + r.pct, 0) / regionStats.length;

  console.log("\n  Per regione:");
  for (const { region, total, reached, pct } of regionStats) {
    // Soglia assoluta (non più relativa alla media): con distribuzioni
    // realistiche come quella osservata la prima volta (71%-96%, media
    // ~85%) una soglia "sotto la metà della media" non scattava mai — non
    // era mai stata pensata per essere davvero raggiungibile, solo per non
    // dare falsi allarmi quando la Sezione D era nuova. Corretto dopo
    // conferma esplicita dell'utente.
    const outlier = pct < REGION_REACHABILITY_WARN_PCT;
    if (outlier) warn("pokedex", `${region.name}: solo ${pct.toFixed(1)}% raggiungibile (sotto la soglia del ${REGION_REACHABILITY_WARN_PCT}%, media delle regioni ${avgPct.toFixed(1)}%)`);
    const marker = outlier ? "⚠️ " : "ℹ️ ";
    console.log(`    ${marker}${region.name.padEnd(20)} ${String(reached).padStart(4)}/${total} (${pct.toFixed(1)}%)`);
  }
}

// --- Riepilogo finale ---
console.log("\n" + "-".repeat(70));
if (warnings.length === 0) {
  console.log("✅ Nessuna anomalia rilevata sui controlli disponibili.");
} else {
  console.log(`⚠️  ${warnings.length} cosa/e da controllare:`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
