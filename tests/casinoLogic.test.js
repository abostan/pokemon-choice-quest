import test from "node:test";
import assert from "node:assert";

import { rollCasinoOutcome, CASINO_STAKES } from "../src/engine/casinoLogic.js";

test("casinoLogic - rollCasinoOutcome è puro e rispetta le soglie di probabilità", () => {
  assert.deepStrictEqual(rollCasinoOutcome(10, () => 0), { tier: "jackpot", coinsDelta: 30 });
  assert.deepStrictEqual(rollCasinoOutcome(10, () => 0.24999), { tier: "jackpot", coinsDelta: 30 });
  assert.deepStrictEqual(rollCasinoOutcome(10, () => 0.25), { tier: "mid", coinsDelta: 5 });
  assert.deepStrictEqual(rollCasinoOutcome(10, () => 0.64999), { tier: "mid", coinsDelta: 5 });
  assert.deepStrictEqual(rollCasinoOutcome(10, () => 0.65), { tier: "loss", coinsDelta: -10 });
  assert.deepStrictEqual(rollCasinoOutcome(10, () => 0.99999), { tier: "loss", coinsDelta: -10 });
});

test("casinoLogic - il payout scala linearmente con la puntata", () => {
  for (const stake of CASINO_STAKES) {
    assert.strictEqual(rollCasinoOutcome(stake, () => 0).coinsDelta, stake * 3);
    assert.strictEqual(rollCasinoOutcome(stake, () => 0.5).coinsDelta, Math.round(stake * 0.5));
    assert.strictEqual(rollCasinoOutcome(stake, () => 0.9).coinsDelta, -stake);
  }
});

test("casinoLogic - non chiama mai Math.random se viene passato un rng esplicito", () => {
  const originalRandom = Math.random;
  Math.random = () => {
    throw new Error("rollCasinoOutcome non deve chiamare Math.random quando riceve un rng esplicito");
  };
  try {
    rollCasinoOutcome(10, () => 0.5);
  } finally {
    Math.random = originalRandom;
  }
});
