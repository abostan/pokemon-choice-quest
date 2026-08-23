import test from "node:test";
import assert from "node:assert";

import {
  computeTeamPower,
  computeWinChance,
  computeCaptureChance,
  clampLevel,
  clamp,
} from "../src/engine/battleLogic.js";

import { computeVictoryScore, RANKS } from "../src/engine/scoreLogic.js";
import { computeTypeEffectiveness } from "../src/engine/typeMatchup.js";
import { sanitizeGameState } from "../src/engine/saveSanitizer.js";

test("battleLogic - computeTeamPower", () => {
  const team = [
    { id: 1, level: 10 },
    { id: 4, level: 20 },
  ];
  // 10 + 20 + (2 * 2) = 34
  const power = computeTeamPower(team);
  assert.strictEqual(power, 34);
});

test("battleLogic - computeWinChance bounds", () => {
  const chanceVeryWeak = computeWinChance(10, 100, "balanced", []);
  assert.strictEqual(chanceVeryWeak, 0.08);

  const chanceVeryStrong = computeWinChance(500, 10, "balanced", []);
  assert.strictEqual(chanceVeryStrong, 0.92);
});

test("battleLogic - computeCaptureChance masterball & legendary", () => {
  const mbChance = computeCaptureChance("masterball");
  assert.strictEqual(mbChance, 1.0);

  const legChance = computeCaptureChance("ball", 0.5, true, false);
  assert.strictEqual(legChance, 0.15);

  const legFoodChance = computeCaptureChance("food", 0.5, true, false);
  assert.strictEqual(legFoodChance, 0.18);
});

test("battleLogic - clampLevel", () => {
  assert.strictEqual(clampLevel(0), 1);
  assert.strictEqual(clampLevel(50), 50);
  assert.strictEqual(clampLevel(150), 100);
});

test("scoreLogic - computeVictoryScore calculations and ranks", () => {
  const state = {
    team: [{ id: 1, level: 50, isShiny: true }],
    badges: ["Medaglia Roccia", "Medaglia Corrente"],
    pokedexRun: { 1: { seen: true, caught: true }, 4: { seen: true, caught: true } },
    isNuzlocke: true,
    completedGensCount: 1,
  };

  // badgePoints = 2 * 500 = 1000
  // teamLevelsPoints = 50 * 50 = 2500
  // pokedexPoints = 2 * 100 = 200
  // shinyPoints = 1 * 1500 = 1500
  // subtotal = 5200
  // nuzlockeMult = 1.5
  // genMult = 1.2
  // totalScore = Math.round(5200 * 1.5 * 1.2) = 9360 -> Rank B (min 8000)
  const score = computeVictoryScore(state);
  assert.strictEqual(score.totalScore, 9360);
  assert.strictEqual(score.rank.code, "B");
});

test("typeMatchup - computeTypeEffectiveness", () => {
  const team = [{ id: 1 }, { id: 4 }]; // Bulbasaur (Erba/Veleno), Charmander (Fuoco)
  const effWater = computeTypeEffectiveness(team, "Roccia");
  assert.ok(effWater.multiplier >= 1.0);
});

test("saveSanitizer - sanitizeGameState cleans corrupt data", () => {
  const corruptInput = {
    phase: 12345, // invalid type
    team: "not an array",
    coins: -50,
    gymIndex: NaN,
  };

  const clean = sanitizeGameState(corruptInput);
  assert.strictEqual(clean.phase, "generationSelect");
  assert.deepStrictEqual(clean.team, []);
  assert.strictEqual(clean.coins, 0);
  assert.strictEqual(clean.gymIndex, 0);
});
