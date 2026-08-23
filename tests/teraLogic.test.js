import test from "node:test";
import assert from "node:assert";

import { computeTeraEffect } from "../src/engine/typeMatchup.js";

test("computeTeraEffect - nessun tipo Tera => neutro senza messaggio", () => {
  const result = computeTeraEffect(null, "Roccia");
  assert.strictEqual(result.multiplier, 1.0);
  assert.strictEqual(result.status, "neutral");
  assert.strictEqual(result.message, "");
});

test("computeTeraEffect - tipo Tera Super Efficace contro l'avversario => +35%", () => {
  // Fuoco è Super Efficace contro Erba
  const result = computeTeraEffect("Fuoco", "Erba");
  assert.strictEqual(result.multiplier, 1.35);
  assert.strictEqual(result.status, "super");
});

test("computeTeraEffect - avversario Super Efficace contro il tipo Tera => +10% (svantaggio attenuato)", () => {
  // Acqua è Super Efficace contro Fuoco => tipo Tera Fuoco è svantaggiato
  const result = computeTeraEffect("Fuoco", "Acqua");
  assert.strictEqual(result.multiplier, 1.10);
  assert.strictEqual(result.status, "weak");
});

test("computeTeraEffect - nessun vantaggio/svantaggio => +25% caso base", () => {
  const result = computeTeraEffect("Normale", "Psico");
  assert.strictEqual(result.multiplier, 1.25);
  assert.strictEqual(result.status, "neutral");
});

test("computeTeraEffect - tipo avversario assente (es. bivio senza tipo rilevato) => +25% caso base", () => {
  const result = computeTeraEffect("Drago", "");
  assert.strictEqual(result.multiplier, 1.25);
  assert.strictEqual(result.status, "neutral");
});
