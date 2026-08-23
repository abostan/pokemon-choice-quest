import test from "node:test";
import assert from "node:assert";

import { getPokemonNature, computeNatureMultiplier, NATURES } from "../src/data/natures.js";
import { computeTeamPower } from "../src/engine/battleLogic.js";

test("natures - getPokemonNature è deterministico (stesso id => sempre la stessa Natura)", () => {
  const a = getPokemonNature(25);
  const b = getPokemonNature(25);
  assert.strictEqual(a.name, b.name);
});

test("natures - copre tutte e 3 le fasce su un range di id", () => {
  const tiers = new Set();
  for (let id = 1; id <= NATURES.length; id++) {
    tiers.add(getPokemonNature(id).tier);
  }
  assert.deepStrictEqual(tiers, new Set(["positive", "neutral", "negative"]));
});

test("natures - computeNatureMultiplier: +10% positive, 0% neutral, -10% negative", () => {
  assert.strictEqual(computeNatureMultiplier({ tier: "positive" }), 1.10);
  assert.strictEqual(computeNatureMultiplier({ tier: "neutral" }), 1.0);
  assert.strictEqual(computeNatureMultiplier({ tier: "negative" }), 0.90);
  assert.strictEqual(computeNatureMultiplier(null), 1.0);
});

test("natures - computeNatureMultiplier: fascia sconosciuta ricade su 0% (nessun bonus/malus)", () => {
  assert.strictEqual(computeNatureMultiplier({ tier: "fascia-inventata" }), 1.0);
});

test("natures - getPokemonNature: id assente/0 ricade sulla prima Natura della lista", () => {
  assert.strictEqual(getPokemonNature(0).name, NATURES[0].name);
  assert.strictEqual(getPokemonNature(undefined).name, NATURES[0].name);
  assert.strictEqual(getPokemonNature(null).name, NATURES[0].name);
});

test("battleLogic - computeTeamPower incorpora la Natura per Pokémon (una squadra con nature positive supera la stessa squadra con nature negative)", () => {
  // Trova un id di ogni fascia entro il range NATURES.length per un confronto pulito
  let positiveId = null;
  let negativeId = null;
  for (let id = 1; id <= NATURES.length; id++) {
    const tier = getPokemonNature(id).tier;
    if (tier === "positive" && positiveId === null) positiveId = id;
    if (tier === "negative" && negativeId === null) negativeId = id;
  }
  const positiveTeam = [{ id: positiveId, level: 50 }];
  const negativeTeam = [{ id: negativeId, level: 50 }];
  assert.ok(computeTeamPower(positiveTeam) > computeTeamPower(negativeTeam));
});
