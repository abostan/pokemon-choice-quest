// computeTeraEffect() è già ben coperta in tests/teraLogic.test.js.
// computeTypeEffectiveness() invece aveva un solo caso in tests/engine.test.js
// (Bulbasaur/Charmander vs Roccia), che essendo già "super effective" esce
// dalla funzione al primo return: tutto il resto del corpo (guardia sui
// parametri mancanti, ramo "weak", fallback "neutral") non veniva mai
// eseguito da nessun test.

import test from "node:test";
import assert from "node:assert";

import { computeTypeEffectiveness } from "../src/engine/typeMatchup.js";

test("computeTypeEffectiveness - parametri mancanti => neutro senza messaggio", () => {
  assert.deepStrictEqual(computeTypeEffectiveness([], "Roccia"), { multiplier: 1.0, status: "neutral", message: "" });
  assert.deepStrictEqual(computeTypeEffectiveness(null, "Roccia"), { multiplier: 1.0, status: "neutral", message: "" });
  assert.deepStrictEqual(computeTypeEffectiveness([{ id: 1 }], ""), { multiplier: 1.0, status: "neutral", message: "" });
});

test("computeTypeEffectiveness - svantaggio di tipo (-10%) se almeno metà della squadra è debole", () => {
  // Charmander (Fuoco) non è Super Efficace contro Acqua, ma Acqua lo è contro Fuoco.
  const result = computeTypeEffectiveness([{ id: 4 }], "Acqua");
  assert.strictEqual(result.multiplier, 0.90);
  assert.strictEqual(result.status, "weak");
  assert.ok(result.message.includes("Svantaggio"));
});

test("computeTypeEffectiveness - nessun vantaggio né svantaggio => neutro (fallback finale)", () => {
  // Bulbasaur (Erba) non è Super Efficace contro Spettro, e Spettro non lo è contro Erba.
  const result = computeTypeEffectiveness([{ id: 1 }], "Spettro");
  assert.strictEqual(result.multiplier, 1.0);
  assert.strictEqual(result.status, "neutral");
  assert.strictEqual(result.message, "");
});

test("computeTypeEffectiveness - il match di tipo funziona anche per sottostringa (es. titoli regionali tipo 'Roccia Galar')", () => {
  // Geodude (id 74) è di tipo Roccia; "Roccia Galar" non è una chiave esatta
  // di TYPE_SUPER_EFFECTIVE ma la include come sottostringa.
  const result = computeTypeEffectiveness([{ id: 74 }], "Roccia Galar");
  assert.strictEqual(result.status, "super");
  assert.strictEqual(result.multiplier, 1.15);
});

test("computeTypeEffectiveness - vantaggio di tipo (+15%) se almeno un tipo in squadra è Super Efficace", () => {
  const result = computeTypeEffectiveness([{ id: 1 }, { id: 4 }], "Roccia"); // Erba è Super Efficace contro Roccia
  assert.strictEqual(result.multiplier, 1.15);
  assert.strictEqual(result.status, "super");
  assert.ok(result.message.includes("Erba"));
});
