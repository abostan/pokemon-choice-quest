// Test di regressione per il motore dei bivi di esplorazione
// (src/engine/explorePicker.js) e per la probabilità di cattura dei
// leggendari (src/engine/battleLogic.js).
//
// Nascono da un bug reale osservato in gioco: il seed dei bivi dipendeva
// solo da gymIndex/badges, che restano fissi per l'intera durata di una
// palestra, facendo ripetere lo stesso identico terzetto di opzioni ad ogni
// visita — con il risultato che l'incontro leggendario appariva molto più
// spesso di altre opzioni, mai viste in un'intera run (vedi ANALISI_TECNICA.md
// e la cronologia della conversazione che ha introdotto questo file).
//
// Questi test simulano intere run (più generazioni, decine di bivi) per
// verificare che: 1) tutte le opzioni compaiano prima o poi, 2) nessuna
// domini o sparisca, 3) il leggendario resti raro, 4) l'algoritmo sia
// puro/deterministico (nessun Math.random nascosto che potrebbe reintrodurre
// il loop di re-render instabile citato nel codice), 5) la cattura dei
// leggendari resti effettivamente difficile.
//
// Vanno rieseguiti (e aggiornati se il bilanciamento cambia consapevolmente)
// ogni volta che si tocca ExploreSceneContainer.js, explorePicker.js,
// data/exploreOptions.js o battleLogic.js.

import test from "node:test";
import assert from "node:assert";

import {
  computeExploreSeed,
  computePostgameSeed,
  pickWeightedIds,
  pickTopIds,
} from "../src/engine/explorePicker.js";
import { EXPLORE_SPECIAL_WEIGHTS } from "../src/data/exploreOptions.js";
import { computeCaptureChance, rollCapture } from "../src/engine/battleLogic.js";

const ALL_IDS = Object.keys(EXPLORE_SPECIAL_WEIGHTS);
const WEIGHTED_ITEMS = ALL_IDS.map((id) => ({ id, weight: EXPLORE_SPECIAL_WEIGHTS[id] }));

// PRNG seedato (mulberry32) usato SOLO per generare scenari di test
// riproducibili (es. quanto avanza choicesCount tra un bivio e l'altro in
// una run realistica) — mai per l'algoritmo dei bivi stesso, che deve
// restare puro.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simula una run: `stageCount` bivi successivi, con choicesCount che avanza
 * di una quantità variabile (ma riproducibile) tra un bivio e l'altro, come
 * accade davvero in gioco (ogni goTo() intermedio la incrementa).
 */
function simulateRun(stageCount, rngSeed = 1) {
  const rng = mulberry32(rngSeed);
  const stages = [];
  let choicesCount = 0;
  for (let i = 0; i < stageCount; i++) {
    const gymIndex = i % 8;
    const badgesCount = gymIndex;
    choicesCount += 2 + Math.floor(rng() * 6); // 2..7 transizioni intermedie plausibili
    const seed = computeExploreSeed({ gymIndex, badgesCount, choicesCount });
    stages.push(pickWeightedIds(WEIGHTED_ITEMS, seed, 6));
  }
  return stages;
}

test("explorePicker - pickWeightedIds è puro e deterministico", () => {
  const seed = computeExploreSeed({ gymIndex: 3, badgesCount: 3, choicesCount: 17 });
  const a = pickWeightedIds(WEIGHTED_ITEMS, seed, 6);
  const b = pickWeightedIds(WEIGHTED_ITEMS, seed, 6);
  assert.deepStrictEqual(a, b, "stesso seed deve dare sempre lo stesso risultato");
});

test("explorePicker - non chiama mai Math.random (niente non-determinismo nascosto)", () => {
  const original = Math.random;
  Math.random = () => { throw new Error("Math.random() non deve essere chiamato dal picker"); };
  try {
    const seed = computeExploreSeed({ gymIndex: 5, badgesCount: 5, choicesCount: 42 });
    pickWeightedIds(WEIGHTED_ITEMS, seed, 6);
    pickTopIds(ALL_IDS, computePostgameSeed({ postgameRound: 3 }), 4);
  } finally {
    Math.random = original;
  }
});

test("explorePicker - pickWeightedIds rispetta la forma attesa del risultato", () => {
  for (let choicesCount = 0; choicesCount < 40; choicesCount++) {
    const seed = computeExploreSeed({ gymIndex: 0, badgesCount: 0, choicesCount });
    const picked = pickWeightedIds(WEIGHTED_ITEMS, seed, 6);
    assert.strictEqual(picked.length, 6, `deve restituire esattamente 6 opzioni (choicesCount=${choicesCount})`);
    assert.strictEqual(new Set(picked).size, 6, "nessun id duplicato");
    for (const id of picked) {
      assert.ok(ALL_IDS.includes(id), `id sconosciuto restituito: ${id}`);
    }
  }
});

test("explorePicker - una run lunga copre tutte le opzioni (nessuna irraggiungibile)", () => {
  const stages = simulateRun(120, 7);
  const seen = new Set();
  for (const picked of stages) picked.forEach((id) => seen.add(id));

  const missing = ALL_IDS.filter((id) => !seen.has(id));
  assert.deepStrictEqual(missing, [], `opzioni mai apparse in 120 bivi: ${missing.join(", ")}`);
});

test("explorePicker - nessuna opzione domina la rotazione", () => {
  const stages = simulateRun(120, 7);
  const counts = Object.fromEntries(ALL_IDS.map((id) => [id, 0]));
  for (const picked of stages) picked.forEach((id) => counts[id]++);

  for (const id of ALL_IDS) {
    const share = counts[id] / stages.length;
    assert.ok(share < 0.6, `"${id}" appare nel ${(share * 100).toFixed(0)}% dei bivi (troppo dominante)`);
  }
});

test("explorePicker - l'incontro leggendario resta raro rispetto alle altre opzioni", () => {
  const stages = simulateRun(200, 11);
  const counts = Object.fromEntries(ALL_IDS.map((id) => [id, 0]));
  for (const picked of stages) picked.forEach((id) => counts[id]++);

  const legendaryShare = counts.legendary / stages.length;
  assert.ok(legendaryShare < 0.35, `"legendary" appare nel ${(legendaryShare * 100).toFixed(0)}% dei bivi (troppo frequente)`);

  // Il peso configurato per "legendary" deve restare il più basso della tabella:
  // se in futuro qualcuno lo alza distrattamente, questo test lo segnala.
  const minWeight = Math.min(...Object.values(EXPLORE_SPECIAL_WEIGHTS));
  assert.strictEqual(EXPLORE_SPECIAL_WEIGHTS.legendary, minWeight, "\"legendary\" deve avere il peso più basso della tabella");
});

test("explorePicker - lo stesso bivio non si ripete identico per troppe visite di fila (guardia sul bug storico)", () => {
  const stages = simulateRun(120, 3);
  let maxStreak = 1;
  let streak = 1;
  for (let i = 1; i < stages.length; i++) {
    const same = stages[i].join(",") === stages[i - 1].join(",");
    streak = same ? streak + 1 : 1;
    maxStreak = Math.max(maxStreak, streak);
  }
  assert.ok(maxStreak <= 2, `stesso bivio ripetuto identico ${maxStreak} volte di fila (atteso <= 2)`);
});

test("explorePicker - pickTopIds (pool post-game) è puro e copre tutte le opzioni su molti round", () => {
  const seenIds = new Set();
  let prevPicked = null;
  let maxStreak = 1;
  let streak = 1;
  for (let round = 0; round < 60; round++) {
    const seed = computePostgameSeed({ postgameRound: round });
    const picked = pickTopIds(ALL_IDS, seed, 4);
    assert.strictEqual(picked.length, 4);
    picked.forEach((id) => seenIds.add(id));

    const key = picked.join(",");
    const same = prevPicked === key;
    streak = same ? streak + 1 : 1;
    maxStreak = Math.max(maxStreak, streak);
    prevPicked = key;

    // Purezza: stesso round -> stesso risultato
    assert.deepStrictEqual(pickTopIds(ALL_IDS, seed, 4), picked);
  }
  assert.ok(seenIds.size >= ALL_IDS.length * 0.8, "il pool post-game dovrebbe coprire la maggior parte delle opzioni su 60 round");
  assert.ok(maxStreak <= 2, `pool post-game ripetuto identico ${maxStreak} round di fila (atteso <= 2)`);
});

test("battleLogic - cattura leggendari: Master Ball garantita, resto statisticamente raro", () => {
  assert.strictEqual(computeCaptureChance("masterball", 0.5, true, false), 1.0, "Master Ball deve garantire sempre la cattura di un leggendario");

  const chance = computeCaptureChance("ball", 0.5, true, false);
  assert.ok(chance <= 0.20, `probabilità cattura leggendario con Poké Ball troppo alta: ${chance}`);

  // Monte Carlo con RNG seedato (riproducibile): la frequenza empirica di
  // cattura su molti tentativi deve restare vicina alla probabilità teorica,
  // altrimenti computeCaptureChance/rollCapture si sono disallineati.
  const rng = mulberry32(99);
  const trials = 20000;
  let caught = 0;
  for (let i = 0; i < trials; i++) {
    if (rollCapture(chance, rng)) caught++;
  }
  const empirical = caught / trials;
  assert.ok(
    Math.abs(empirical - chance) < 0.02,
    `frequenza empirica di cattura (${empirical.toFixed(3)}) troppo lontana dalla probabilità teorica (${chance})`
  );
});
