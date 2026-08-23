// getHighScore()/saveHighScore() erano mai esercitate finora perché usano
// localStorage, assente nel runtime di test Node. computeVictoryScore() ha
// invece un solo caso in tests/engine.test.js (Nuzlocke attivo, Grado B) —
// qui si aggiungono i rami mai presi: stato nullo/vuoto, i confini esatti
// dei 4 Gradi, isNuzlocke disattivo, bonus generazioni e Shiny isolati.

import test from "node:test";
import assert from "node:assert";

import { getHighScore, saveHighScore, computeVictoryScore } from "../src/engine/scoreLogic.js";
import { installLocalStorageStub, withThrowingLocalStorage } from "./helpers/localStorageStub.js";

const storage = installLocalStorageStub();

test("getHighScore - 0 se non c'è ancora nessun record salvato", () => {
  storage.clear();
  assert.strictEqual(getHighScore(), 0);
});

test("getHighScore - legge il valore salvato in precedenza", () => {
  storage.clear();
  storage.setItem("pcq_high_score", "9360");
  assert.strictEqual(getHighScore(), 9360);
});

test("getHighScore - localStorage non disponibile => 0, nessuna eccezione propagata", () => {
  withThrowingLocalStorage(() => {
    assert.strictEqual(getHighScore(), 0);
  });
});

test("saveHighScore - nuovo record: salva e restituisce true", () => {
  storage.clear();
  const saved = saveHighScore(5000);
  assert.strictEqual(saved, true);
  assert.strictEqual(getHighScore(), 5000);
});

test("saveHighScore - punteggio non superiore al record: non salva, restituisce false", () => {
  storage.clear();
  storage.setItem("pcq_high_score", "9000");
  const saved = saveHighScore(8000);
  assert.strictEqual(saved, false);
  assert.strictEqual(getHighScore(), 9000, "il vecchio record non deve essere sovrascritto");
});

test("saveHighScore - punteggio uguale al record: non è un nuovo record, resta false", () => {
  storage.clear();
  storage.setItem("pcq_high_score", "9000");
  assert.strictEqual(saveHighScore(9000), false);
});

test("saveHighScore - localStorage non disponibile => false, nessuna eccezione propagata", () => {
  withThrowingLocalStorage(() => {
    assert.strictEqual(saveHighScore(9999), false);
  });
});

// --- computeVictoryScore: rami mai presi in tests/engine.test.js ---------

test("computeVictoryScore - state nullo/mancante => punteggio zero, Grado C", () => {
  for (const input of [null, undefined]) {
    const score = computeVictoryScore(input);
    assert.strictEqual(score.totalScore, 0);
    assert.strictEqual(score.rank.code, "C");
    assert.deepStrictEqual(score.breakdown, {});
  }
});

test("computeVictoryScore - stato vuoto: tutti i campi opzionali ricadono sui default", () => {
  const score = computeVictoryScore({});
  assert.strictEqual(score.totalScore, 0);
  assert.strictEqual(score.rank.code, "C");
  assert.strictEqual(score.breakdown.nuzlockeMult, 1.0);
  assert.strictEqual(score.breakdown.genMult, 1.0);
  assert.strictEqual(score.breakdown.badgesCount, 0);
  assert.strictEqual(score.breakdown.caughtCount, 0);
  assert.strictEqual(score.breakdown.shinyCount, 0);
});

test("computeVictoryScore - Grado C: nessuna soglia raggiunta (nessun if/else-if soddisfatto)", () => {
  const score = computeVictoryScore({ team: [{ level: 10 }] }); // 10*50 = 500
  assert.strictEqual(score.totalScore, 500);
  assert.strictEqual(score.rank.code, "C");
});

test("computeVictoryScore - Grado B esattamente al confine (8000)", () => {
  const score = computeVictoryScore({ team: [{ level: 40 }, { level: 40 }, { level: 40 }, { level: 40 }] }); // 160*50
  assert.strictEqual(score.totalScore, 8000);
  assert.strictEqual(score.rank.code, "B");
});

test("computeVictoryScore - Grado A esattamente al confine (15000)", () => {
  const score = computeVictoryScore({ team: [{ level: 100 }, { level: 100 }, { level: 100 }] }); // 300*50
  assert.strictEqual(score.totalScore, 15000);
  assert.strictEqual(score.rank.code, "A");
});

test("computeVictoryScore - Grado S esattamente al confine (25000)", () => {
  const score = computeVictoryScore({ team: Array.from({ length: 10 }, () => ({ level: 50 })) }); // 500*50
  assert.strictEqual(score.totalScore, 25000);
  assert.strictEqual(score.rank.code, "S");
});

test("computeVictoryScore - isNuzlocke false => nessun moltiplicatore +50%", () => {
  const withoutNuzlocke = computeVictoryScore({ team: [{ level: 40 }], isNuzlocke: false });
  const withNuzlocke = computeVictoryScore({ team: [{ level: 40 }], isNuzlocke: true });
  assert.strictEqual(withoutNuzlocke.breakdown.nuzlockeMult, 1.0);
  assert.strictEqual(withNuzlocke.breakdown.nuzlockeMult, 1.5);
  assert.strictEqual(withNuzlocke.totalScore, Math.round(withoutNuzlocke.totalScore * 1.5));
});

test("computeVictoryScore - +20% per regione completata, per ciascuna generazione extra", () => {
  const base = computeVictoryScore({ team: [{ level: 40 }], completedGensCount: 0 });
  const twoGens = computeVictoryScore({ team: [{ level: 40 }], completedGensCount: 2 });
  assert.strictEqual(base.breakdown.genMult, 1.0);
  assert.strictEqual(twoGens.breakdown.genMult, 1.4);
  assert.strictEqual(twoGens.totalScore, Math.round(base.totalScore * 1.4));
});

test("computeVictoryScore - solo i Pokémon Shiny in squadra contano nel bonus", () => {
  const noShiny = computeVictoryScore({ team: [{ level: 10, isShiny: false }, { level: 10 }] });
  const oneShiny = computeVictoryScore({ team: [{ level: 10, isShiny: true }, { level: 10 }] });
  assert.strictEqual(noShiny.breakdown.shinyPoints, 0);
  assert.strictEqual(oneShiny.breakdown.shinyPoints, 1500);
  assert.strictEqual(oneShiny.totalScore, noShiny.totalScore + 1500);
});
