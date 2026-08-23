import test from "node:test";
import assert from "node:assert";

import { GENERATIONS } from "../src/data/generations.js";
import {
  computeIsPostgame,
  computeDifficultyMultiplier,
  computeScaledPower,
  resolveAfterGymBattle,
  resolveAfterEliteBattle,
  resolveNextGeneration,
  resolvePostgameExplore,
  resolveNuzlockeLoss,
} from "../src/engine/gameStateTransitions.js";

// --- computeIsPostgame -------------------------------------------------

test("computeIsPostgame - regressione: completedGensCount=8 su Paldea (ultima regione) resta false", () => {
  // Il bug reale (Fase 8/10 di ROADMAP.md): un `8` hardcoded invece di
  // GENERATIONS.length faceva scattare il post-game appena raggiunta l'ultima
  // regione, saltando le sue 8 palestre. GENERATIONS.length oggi vale 9.
  const paldea = GENERATIONS.find((g) => g.id === "paldea");
  const state = { completedGensCount: 8, gymIndex: 0, phase: "explore" };
  assert.strictEqual(computeIsPostgame(state, paldea), false);
});

test("computeIsPostgame - true quando completedGensCount raggiunge GENERATIONS.length", () => {
  const paldea = GENERATIONS.find((g) => g.id === "paldea");
  const state = { completedGensCount: GENERATIONS.length, gymIndex: 0, phase: "explore" };
  assert.strictEqual(computeIsPostgame(state, paldea), true);
});

test("computeIsPostgame - true se gymIndex supera le palestre della regione corrente", () => {
  const kanto = GENERATIONS.find((g) => g.id === "kanto");
  const state = { completedGensCount: 0, gymIndex: kanto.gymLeaders.length, phase: "explore" };
  assert.strictEqual(computeIsPostgame(state, kanto), true);
});

test("computeIsPostgame - true su fasi con prefisso postgame/champions/tournament", () => {
  const base = { completedGensCount: 0, gymIndex: 0 };
  assert.strictEqual(computeIsPostgame({ ...base, phase: "postgameExplore" }, null), true);
  assert.strictEqual(computeIsPostgame({ ...base, phase: "championsRound1" }, null), true);
  assert.strictEqual(computeIsPostgame({ ...base, phase: "tournamentBracket" }, null), true);
  assert.strictEqual(computeIsPostgame({ ...base, phase: "explore" }, null), false);
});

// --- computeDifficultyMultiplier / computeScaledPower -------------------

test("computeDifficultyMultiplier - cresce con le regioni completate e in Nuzlocke", () => {
  assert.strictEqual(computeDifficultyMultiplier({ completedGensCount: 0, isNuzlocke: false }), 1.0);
  assert.ok(Math.abs(computeDifficultyMultiplier({ completedGensCount: 2, isNuzlocke: false }) - 1.3) < 1e-9);
  assert.ok(Math.abs(computeDifficultyMultiplier({ completedGensCount: 0, isNuzlocke: true }) - 1.1) < 1e-9);
});

test("computeScaledPower - applica il moltiplicatore arrotondando", () => {
  const state = { completedGensCount: 2, isNuzlocke: false }; // x1.3
  assert.strictEqual(computeScaledPower(100, state), 130);
});

// --- resolveAfterGymBattle -----------------------------------------------

const fakeGenWithEvents = {
  id: "testgen",
  gymLeaders: [{}, {}, {}],
  rival: { afterGymIndex: 1 },
  villainBoss: { afterGymIndex: 2 },
};

test("resolveAfterGymBattle - nessun evento, palestre rimanenti => explore", () => {
  const result = resolveAfterGymBattle({ gymIndex: 0, rivalDone: false, villainBossDone: false }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "explore", patch: { gymIndex: 1 } });
});

test("resolveAfterGymBattle - rivale sul suo afterGymIndex => rivalBattle", () => {
  const result = resolveAfterGymBattle({ gymIndex: 1, rivalDone: false, villainBossDone: false }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "rivalBattle", patch: { gymIndex: 2 } });
});

test("resolveAfterGymBattle - boss sul suo afterGymIndex (rivale già fatto) => villainBossBattle", () => {
  const result = resolveAfterGymBattle({ gymIndex: 2, rivalDone: true, villainBossDone: false }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "villainBossBattle", patch: { gymIndex: 3 } });
});

test("resolveAfterGymBattle - ultima palestra, tutti gli eventi fatti => eliteBattle", () => {
  const result = resolveAfterGymBattle({ gymIndex: 2, rivalDone: true, villainBossDone: true }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "eliteBattle", patch: { gymIndex: 3, eliteIndex: 0 } });
});

test("resolveAfterGymBattle - se rivale e boss cadono sullo stesso afterGymIndex, vince il rivale", () => {
  const genBothSameIndex = { id: "x", gymLeaders: [{}, {}], rival: { afterGymIndex: 0 }, villainBoss: { afterGymIndex: 0 } };
  const result = resolveAfterGymBattle({ gymIndex: 0, rivalDone: false, villainBossDone: false }, genBothSameIndex);
  assert.strictEqual(result.phase, "rivalBattle");
});

// --- resolveAfterEliteBattle -----------------------------------------------

const fakeGenWithEliteFour = { eliteFour: [{}, {}, {}, {}] };

test("resolveAfterEliteBattle - membri rimanenti => passa al prossimo membro", () => {
  const result = resolveAfterEliteBattle({ eliteIndex: 0 }, fakeGenWithEliteFour);
  assert.deepStrictEqual(result, { phase: "eliteBattle", patch: { eliteIndex: 1 } });
});

test("resolveAfterEliteBattle - ultimo membro sconfitto => sfida al Campione", () => {
  const result = resolveAfterEliteBattle({ eliteIndex: 3 }, fakeGenWithEliteFour);
  assert.deepStrictEqual(result, { phase: "championBattle", patch: {} });
});

test("resolveAfterEliteBattle - eliteFour assente/malformato ricade sul default di 4 membri", () => {
  const result = resolveAfterEliteBattle({ eliteIndex: 3 }, {});
  assert.strictEqual(result.phase, "championBattle");
});

// --- resolveNextGeneration ------------------------------------------------

test("resolveNextGeneration - regione intermedia => nextGenSelect, isGrandMaster false", () => {
  const result = resolveNextGeneration({ generationId: "kanto", completedGensCount: 0 });
  assert.strictEqual(result.phase, "nextGenSelect");
  assert.strictEqual(result.patch.nextGenId, "johto");
  assert.strictEqual(result.patch.completedGensCount, 1);
  assert.strictEqual(result.isGrandMaster, false);
});

test("resolveNextGeneration - ultima regione con conteggio insufficiente => postgame, isGrandMaster false", () => {
  const result = resolveNextGeneration({ generationId: "paldea", completedGensCount: 3 });
  assert.strictEqual(result.phase, "postgame");
  assert.strictEqual(result.patch.completedGensCount, 4);
  assert.strictEqual(result.isGrandMaster, false);
});

test("resolveNextGeneration - ultima regione, conteggio raggiunge GENERATIONS.length => isGrandMaster true", () => {
  const result = resolveNextGeneration({ generationId: "paldea", completedGensCount: GENERATIONS.length - 1 });
  assert.strictEqual(result.phase, "postgame");
  assert.strictEqual(result.patch.completedGensCount, GENERATIONS.length);
  assert.strictEqual(result.isGrandMaster, true);
});

// --- resolvePostgameExplore ------------------------------------------------

const fakeGenWithLegendaries = { legendaries: [901, 902, 903] };

test("resolvePostgameExplore - rng basso => incontro leggendario", () => {
  const state = { caughtLegendaries: [], postgameRound: 0 };
  const result = resolvePostgameExplore(state, fakeGenWithLegendaries, () => 0.01);
  assert.strictEqual(result.phase, "legendaryEncounter");
  assert.strictEqual(result.patch.pendingEncounterIsLegendary, true);
  assert.ok(fakeGenWithLegendaries.legendaries.includes(result.patch.pendingEncounterPool[0]));
});

test("resolvePostgameExplore - rng alto => normale esplorazione post-game", () => {
  const state = { caughtLegendaries: [], postgameRound: 0 };
  const result = resolvePostgameExplore(state, fakeGenWithLegendaries, () => 0.5);
  assert.deepStrictEqual(result, { phase: "postgameExplore", patch: {} });
});

test("resolvePostgameExplore - tutti i leggendari già catturati => mai un incontro, anche con rng basso", () => {
  const state = { caughtLegendaries: [901, 902, 903], postgameRound: 0 };
  const result = resolvePostgameExplore(state, fakeGenWithLegendaries, () => 0.01);
  assert.strictEqual(result.phase, "postgameExplore");
});

// --- resolveNuzlockeLoss ------------------------------------------------

test("resolveNuzlockeLoss - squadra vuota => nessuna modifica (stesso oggetto)", () => {
  const state = { team: [], box: [], isNuzlocke: true, teamFatigued: false };
  assert.strictEqual(resolveNuzlockeLoss(state), state);
});

test("resolveNuzlockeLoss - fuori Nuzlocke => solo teamFatigued, team/box invariati", () => {
  const state = { team: [{ id: 1, level: 5 }], box: [], isNuzlocke: false, teamFatigued: false };
  const result = resolveNuzlockeLoss(state);
  assert.strictEqual(result.teamFatigued, true);
  assert.strictEqual(result.team, state.team);
  assert.strictEqual(result.box, state.box);
});

test("resolveNuzlockeLoss - Nuzlocke, ultimo Pokémon sviene e nessun sostituto sano => nuzlockeGameOver", () => {
  const state = { team: [{ id: 1, level: 5 }], box: [], isNuzlocke: true, teamFatigued: false };
  const result = resolveNuzlockeLoss(state);
  assert.strictEqual(result.phase, "nuzlockeGameOver");
  assert.strictEqual(result.team.length, 0);
  assert.strictEqual(result.box.length, 1);
  assert.strictEqual(result.box[0].isFainted, true);
});

test("resolveNuzlockeLoss - Nuzlocke, squadra svuotata ma box ha un sostituto sano => apre il Box invece di terminare", () => {
  const state = {
    team: [{ id: 1, level: 5 }],
    box: [{ id: 2, level: 5, isFainted: false }],
    isNuzlocke: true,
    teamFatigued: false,
    boxModalOpen: false,
  };
  const result = resolveNuzlockeLoss(state);
  assert.notStrictEqual(result.phase, "nuzlockeGameOver");
  assert.strictEqual(result.boxModalOpen, true);
  assert.strictEqual(result.team.length, 0);
  assert.strictEqual(result.box.length, 2);
});

test("resolveNuzlockeLoss - Nuzlocke, restano altri Pokémon in squadra => nessun game over, box non forzato ad aprirsi", () => {
  const state = {
    team: [{ id: 1, level: 5 }, { id: 2, level: 5 }],
    box: [],
    isNuzlocke: true,
    teamFatigued: false,
    boxModalOpen: false,
  };
  const result = resolveNuzlockeLoss(state);
  assert.strictEqual(result.team.length, 1);
  assert.strictEqual(result.box.length, 1);
  assert.strictEqual(result.boxModalOpen, false);
});
