import test from "node:test";
import assert from "node:assert";

import {
  computeTeamPower,
  computeWinChance,
  computeCaptureChance,
  computeStatMultiplier,
  computeFatigueMultiplier,
  clampLevel,
  clamp,
} from "../src/engine/battleLogic.js";

import { computeVictoryScore, RANKS } from "../src/engine/scoreLogic.js";
import { computeTypeEffectiveness } from "../src/engine/typeMatchup.js";
import { sanitizeGameState } from "../src/engine/saveSanitizer.js";
import { pickSignatureMove } from "../src/data/movePicker.js";

test("battleLogic - computeTeamPower", () => {
  const team = [
    { id: 1, level: 10 },
    { id: 4, level: 20 },
  ];
  // Nessuna statsById => moltiplicatore statistiche neutro 1.0 per ognuno.
  // Id 1 e 4 hanno entrambi Natura "positive" (+10%, vedi data/natures.js):
  // (10*1.1) + (20*1.1) + (2*2) = 11 + 22 + 4 = 37
  const power = computeTeamPower(team);
  assert.strictEqual(power, 37);
});

test("battleLogic - computeStatMultiplier: nella media 1.0, forte/debole entro i limiti 0.7..1.4", () => {
  assert.strictEqual(computeStatMultiplier(430), 1.0); // esattamente la media di riferimento
  assert.strictEqual(computeStatMultiplier(0), 1.0); // dato mancante/non ancora caricato => neutro
  assert.strictEqual(computeStatMultiplier(undefined), 1.0);
  assert.ok(computeStatMultiplier(680) > 1.0 && computeStatMultiplier(680) <= 1.4); // es. Mewtwo
  assert.strictEqual(computeStatMultiplier(2000), 1.4); // clampato al massimo
  assert.ok(computeStatMultiplier(200) < 1.0 && computeStatMultiplier(200) >= 0.7); // es. Magikarp
  assert.strictEqual(computeStatMultiplier(1), 0.7); // clampato al minimo
});

test("battleLogic - computeTeamPower con statsById: specie forti pesano di più di quelle nella media", () => {
  const team = [
    { id: 1, level: 50 },
    { id: 2, level: 50 },
  ];
  const averagePower = computeTeamPower(team, { 1: 430, 2: 430 });
  const strongPower = computeTeamPower(team, { 1: 680, 2: 680 }); // squadra di "legendari"
  const weakPower = computeTeamPower(team, { 1: 200, 2: 200 }); // squadra di Magikarp
  assert.ok(strongPower > averagePower);
  assert.ok(weakPower < averagePower);
  // Con statsById assente il risultato deve combaciare con la squadra "nella media"
  assert.strictEqual(computeTeamPower(team), averagePower);
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
  assert.strictEqual(legChance, 0.10);

  const legFoodChance = computeCaptureChance("food", 0.5, true, false);
  assert.strictEqual(legFoodChance, 0.12);

  const legSereneChance = computeCaptureChance("ball", 0.5, true, true);
  assert.ok(Math.abs(legSereneChance - 0.15) < 1e-9);
});

test("battleLogic - computeCaptureChance con Pallina Esca (+8%, dimezzato sui leggendari)", () => {
  const withoutLure = computeCaptureChance("ball", 0.5, false, false, false);
  const withLure = computeCaptureChance("ball", 0.5, false, false, true);
  assert.ok(Math.abs(withLure - (withoutLure + 0.08)) < 1e-9);

  const legWithoutLure = computeCaptureChance("ball", 0.5, true, false, false);
  const legWithLure = computeCaptureChance("ball", 0.5, true, false, true);
  assert.ok(Math.abs(legWithLure - (legWithoutLure + 0.04)) < 1e-9, "sui leggendari il bonus è dimezzato, come Leggiadria");

  // Master Ball resta garanzia 100% indipendentemente dalla Pallina Esca
  assert.strictEqual(computeCaptureChance("masterball", 0.5, false, false, true), 1.0);
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

test("saveSanitizer - teamFatigued è preservato dal salvataggio (a differenza di activeMega/activeTerastal, non è un toggle solo di battaglia)", () => {
  assert.strictEqual(sanitizeGameState({ teamFatigued: true }).teamFatigued, true);
  assert.strictEqual(sanitizeGameState({ teamFatigued: false }).teamFatigued, false);
  assert.strictEqual(sanitizeGameState({}).teamFatigued, false);
});

test("battleLogic - computeFatigueMultiplier: -10% se affaticata, neutro altrimenti", () => {
  assert.strictEqual(computeFatigueMultiplier(true), 0.90);
  assert.strictEqual(computeFatigueMultiplier(false), 1.0);
});

test("movePicker - pickSignatureMove sceglie la mossa level-up al livello più alto", () => {
  // Forma semi-reale ridotta della risposta PokeAPI per pokemon.moves
  const moves = [
    { move: { name: "scratch", url: "u1" }, version_group_details: [{ level_learned_at: 1, move_learn_method: { name: "level-up" } }] },
    { move: { name: "flamethrower", url: "u2" }, version_group_details: [{ level_learned_at: 46, move_learn_method: { name: "level-up" } }] },
    { move: { name: "flare-blitz", url: "u3" }, version_group_details: [{ level_learned_at: 66, move_learn_method: { name: "level-up" } }] },
    // Mossa insegnabile solo via smeriglio/TM, non level-up: non deve mai vincere anche se "level" fittizio è alto
    { move: { name: "solar-beam", url: "u4" }, version_group_details: [{ level_learned_at: 0, move_learn_method: { name: "machine" } }] },
  ];
  const result = pickSignatureMove(moves);
  assert.deepStrictEqual(result, { name: "flare-blitz", url: "u3" });
});

test("movePicker - pickSignatureMove: nessuna mossa level-up o input non valido => null", () => {
  assert.strictEqual(pickSignatureMove([]), null);
  assert.strictEqual(pickSignatureMove(null), null);
  assert.strictEqual(pickSignatureMove(undefined), null);
  const onlyMachine = [
    { move: { name: "solar-beam", url: "u4" }, version_group_details: [{ level_learned_at: 0, move_learn_method: { name: "machine" } }] },
  ];
  assert.strictEqual(pickSignatureMove(onlyMachine), null);
});
