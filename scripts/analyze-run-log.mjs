// Analizza uno o più log esportati da src/engine/runRecorder.js (in
// automatico da server.mjs in logs/, o a mano con pcqRunLog.download()) e
// stampa un report con un VERDETTO esplicito per ogni controllo — non solo
// numeri da confrontare a occhio — così un'anomalia salta all'occhio invece
// di dover ricordare quali soglie sono "normali".
//
// Simboli:
//   ⚠️  qualcosa fuori dai limiti attesi — vale la pena controllare
//   ℹ️  campione troppo piccolo per un verdetto affidabile (informativo, non un errore)
//   (nessun simbolo) dentro i limiti attesi
//
// Le soglie ricalcano quelle già validate in tests/explorePicker.test.js:
// se lì un limite cambia consapevolmente, aggiornalo anche qui.
//
// Uso:
//   node scripts/analyze-run-log.mjs                        (analizza tutto logs/*.json)
//   node scripts/analyze-run-log.mjs file1.json file2.json   (file specifici)

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXPLORE_SPECIAL_WEIGHTS } from "../src/data/exploreOptions.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const LOGS_DIR = path.join(ROOT, "logs");

// "grass"/"train"/"chaosRoulette" sono bivi fissi mostrati SEMPRE per
// design (non fanno parte della rotazione pesata) — non ha senso segnalarli
// come "dominanti". Il controllo di dominazione si applica solo alle
// opzioni davvero soggette a probabilità (EXPLORE_SPECIAL_WEIGHTS).
const ROTATING_IDS = new Set(Object.keys(EXPLORE_SPECIAL_WEIGHTS));

// Soglie: stessi numeri usati (o coerenti) con tests/explorePicker.test.js.
const MIN_CROSSROADS_FOR_COVERAGE = 15; // sotto questa soglia, "mai vista" è normale rumore statistico
const DOMINATION_PCT = 60;              // un'opzione mostrata oltre questa % domina la rotazione
const LEGENDARY_MAX_PCT = 35;           // l'incontro leggendario non dovrebbe superare questa frequenza
const MAX_IDENTICAL_STREAK = 2;         // stesso bivio ripetuto identico oltre questo = probabile regressione
const MIN_SAMPLES_FOR_RATE_CHECK = 6;   // sotto, il tasso osservato è troppo rumoroso per un verdetto
const DEVIATION_WARN_PP = 20;           // scarto (in punti percentuali) osservato/teorico oltre cui avvisare

const warnings = [];
function warn(section, text) {
  warnings.push(`[${section}] ${text}`);
}

let paths = process.argv.slice(2);
if (paths.length === 0) {
  try {
    paths = readdirSync(LOGS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(LOGS_DIR, f));
  } catch {
    paths = [];
  }
  if (paths.length === 0) {
    console.error(`Nessun log trovato in ${LOGS_DIR} e nessun file passato come argomento.`);
    console.error("Uso: node scripts/analyze-run-log.mjs [file1.json file2.json ...]");
    process.exit(1);
  }
  console.log(`Nessun file specificato — analizzo tutti i log in ${LOGS_DIR}:`);
  paths.forEach((p) => console.log(`  ${path.basename(p)}`));
  console.log("");
}

const events = paths.flatMap((p) => {
  const raw = JSON.parse(readFileSync(p, "utf-8"));
  if (!Array.isArray(raw)) throw new Error(`${p} non contiene un array di eventi valido`);
  return raw;
});
events.sort((a, b) => a.t - b.t);

console.log(`Eventi caricati: ${events.length} da ${paths.length} file`);
console.log(`Simboli: ⚠️ = fuori dai limiti attesi, controlla — ℹ️ = campione troppo piccolo, ignora\n`);

// --- 1. Bivi: quanto spesso ogni opzione viene mostrata vs scelta ---
const crossroads = events.filter((e) => e.type === "crossroad_shown");
const choices = events.filter((e) => e.type === "choice_made");

const shownCount = {};
for (const c of crossroads) {
  for (const id of c.ids) shownCount[id] = (shownCount[id] || 0) + 1;
}
const pickedCount = {};
for (const c of choices) {
  pickedCount[c.id] = (pickedCount[c.id] || 0) + 1;
}

console.log(`=== Bivi (${crossroads.length} mostrati, ${choices.length} scelte fatte) ===`);
const allIds = Object.keys(shownCount).sort((a, b) => shownCount[b] - shownCount[a]);
for (const id of allIds) {
  const shown = shownCount[id];
  const shownPct = (shown / crossroads.length) * 100;
  const picked = pickedCount[id] || 0;
  const enoughSamples = crossroads.length >= MIN_CROSSROADS_FOR_COVERAGE;
  let flagged = false;
  if (enoughSamples && ROTATING_IDS.has(id) && shownPct > DOMINATION_PCT) {
    warn("bivi", `"${id}" mostrata nel ${shownPct.toFixed(0)}% dei bivi — domina la rotazione`);
    flagged = true;
  } else if (enoughSamples && id === "legendary" && shownPct > LEGENDARY_MAX_PCT) {
    warn("bivi", `"legendary" mostrata nel ${shownPct.toFixed(0)}% dei bivi — sopra la soglia attesa (${LEGENDARY_MAX_PCT}%)`);
    flagged = true;
  }
  console.log(`  ${flagged ? "⚠️ " : "   "}${id.padEnd(20)} mostrato in ${shown}/${crossroads.length} bivi (${shownPct.toFixed(0)}%) — scelto ${picked} volte`);
}
if (crossroads.length >= MIN_CROSSROADS_FOR_COVERAGE) {
  // Nota: qui vediamo solo le opzioni mostrate ALMENO una volta (sono le uniche
  // chiavi di shownCount). Se un'opzione nota non compare mai in questo elenco
  // su un campione già abbastanza grande, è un segnale — ma per confermarlo
  // servirebbe la lista completa delle opzioni configurate (vedi invece
  // tests/explorePicker.test.js, che la conosce e verifica la copertura totale).
  console.log(`  (campione ≥ ${MIN_CROSSROADS_FOR_COVERAGE}: se un'opzione che ti aspetti non è in lista sopra, non è mai apparsa)`);
} else {
  console.log(`  ℹ️  campione piccolo (${crossroads.length} < ${MIN_CROSSROADS_FOR_COVERAGE}): normale che alcune opzioni non siano ancora apparse`);
}

// --- 2. Delta di choicesCount + ripetizioni identiche tra bivi "explore" successivi ---
const explore = crossroads.filter((c) => c.phase === "explore" && c.seedInputs?.choicesCount != null);
const deltas = [];
for (let i = 1; i < explore.length; i++) {
  deltas.push(explore[i].seedInputs.choicesCount - explore[i - 1].seedInputs.choicesCount);
}
if (deltas.length > 0) {
  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  console.log(`\n=== Delta choicesCount tra bivi "explore" successivi (${deltas.length} campioni) ===`);
  console.log(`  min=${Math.min(...deltas)} max=${Math.max(...deltas)} media=${avg.toFixed(1)} (i test assumono un range 2..7)`);

  let maxStreak = 1, streak = 1;
  for (let i = 1; i < explore.length; i++) {
    const same = JSON.stringify(explore[i].ids) === JSON.stringify(explore[i - 1].ids);
    streak = same ? streak + 1 : 1;
    maxStreak = Math.max(maxStreak, streak);
  }
  if (maxStreak > MAX_IDENTICAL_STREAK) {
    warn("delta", `stesso bivio ripetuto identico ${maxStreak} volte di fila — possibile regressione del bug storico (vedi ANALISI_TECNICA.md)`);
    console.log(`  ⚠️  stesso bivio ripetuto identico ${maxStreak} volte di fila — possibile regressione`);
  } else {
    console.log(`  ripetizioni identiche consecutive: massimo ${maxStreak} (soglia ${MAX_IDENTICAL_STREAK}) — ok`);
  }
}

// --- 3. Catture ---
const captures = events.filter((e) => e.type === "capture_attempt");
if (captures.length > 0) {
  console.log(`\n=== Catture (${captures.length} tentativi) ===`);
  const groups = {};
  for (const c of captures) {
    const key = `${c.method}${c.isLegendary ? " [leggendario]" : ""}`;
    if (!groups[key]) groups[key] = { attempts: 0, success: 0, chanceSum: 0 };
    groups[key].attempts++;
    if (c.success) groups[key].success++;
    groups[key].chanceSum += c.chance;
  }
  for (const [key, g] of Object.entries(groups)) {
    const observed = (g.success / g.attempts) * 100;
    const theoretical = (g.chanceSum / g.attempts) * 100;
    const line = `  ${key.padEnd(24)} ${g.success}/${g.attempts} riuscite — osservato ${observed.toFixed(0)}% vs teorico ${theoretical.toFixed(0)}%`;
    const gap = Math.abs(observed - theoretical);
    if (g.attempts < MIN_SAMPLES_FOR_RATE_CHECK) {
      console.log(`ℹ️ ${line}  (campione < ${MIN_SAMPLES_FOR_RATE_CHECK}, indicativo)`);
    } else if (gap > DEVIATION_WARN_PP) {
      warn("catture", `"${key}" scarto di ${gap.toFixed(0)}pp tra osservato e teorico`);
      console.log(`⚠️ ${line}`);
    } else {
      console.log(`   ${line}`);
    }
  }
}

// --- 4. Battaglie ---
const battles = events.filter((e) => e.type === "battle");
if (battles.length > 0) {
  console.log(`\n=== Battaglie (${battles.length}) ===`);
  const groups = {};
  for (const b of battles) {
    if (!groups[b.tactic]) groups[b.tactic] = { fights: 0, wins: 0, chanceSum: 0 };
    groups[b.tactic].fights++;
    if (b.won) groups[b.tactic].wins++;
    groups[b.tactic].chanceSum += b.winChance;
  }
  for (const [tactic, g] of Object.entries(groups)) {
    const observed = (g.wins / g.fights) * 100;
    const theoretical = (g.chanceSum / g.fights) * 100;
    const line = `  ${tactic.padEnd(12)} ${g.wins}/${g.fights} vinte — osservato ${observed.toFixed(0)}% vs teorico ${theoretical.toFixed(0)}%`;
    const gap = Math.abs(observed - theoretical);
    if (g.fights < MIN_SAMPLES_FOR_RATE_CHECK) {
      console.log(`ℹ️ ${line}  (campione < ${MIN_SAMPLES_FOR_RATE_CHECK}, indicativo)`);
    } else if (gap > DEVIATION_WARN_PP) {
      warn("battaglie", `tattica "${tactic}" scarto di ${gap.toFixed(0)}pp tra osservato e teorico`);
      console.log(`⚠️ ${line}`);
    } else {
      console.log(`   ${line}`);
    }
  }
}

// --- Riepilogo finale ---
console.log("\n" + "-".repeat(60));
if (warnings.length === 0) {
  console.log("✅ Nessuna anomalia rilevata sui controlli disponibili.");
} else {
  console.log(`⚠️  ${warnings.length} cosa/e da controllare:`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
