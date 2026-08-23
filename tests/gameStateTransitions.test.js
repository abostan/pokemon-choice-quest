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

// Il Rivale è un array di stage (ricompare più volte, vedi ROADMAP.md Fase 7):
// stage0 su afterGymIndex 0, stage1 su afterGymIndex 2, il villainBoss su 3
// (distinti tra loro, altrimenti un test collide con l'altro). gymLeaders a
// 4 slot per lasciare l'indice 1 libero da qualunque evento.
const fakeGenWithEvents = {
  id: "testgen",
  gymLeaders: [{}, {}, {}, {}],
  rival: [{ afterGymIndex: 0 }, { afterGymIndex: 2 }],
  villainBoss: { afterGymIndex: 3 },
};

test("resolveAfterGymBattle - nessun evento, palestre rimanenti => explore", () => {
  const result = resolveAfterGymBattle({ gymIndex: 1, rivalDone: 0, villainBossDone: false }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "explore", patch: { gymIndex: 2 } });
});

test("resolveAfterGymBattle - primo stage del rivale sul suo afterGymIndex => rivalBattle", () => {
  const result = resolveAfterGymBattle({ gymIndex: 0, rivalDone: 0, villainBossDone: false }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "rivalBattle", patch: { gymIndex: 1 } });
});

test("resolveAfterGymBattle - regressione: dopo il primo stage, il secondo scatta al SUO afterGymIndex (il Rivale ricompare)", () => {
  const result = resolveAfterGymBattle({ gymIndex: 2, rivalDone: 1, villainBossDone: false }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "rivalBattle", patch: { gymIndex: 3 } });
});

test("resolveAfterGymBattle - boss sul suo afterGymIndex (tutti gli stage del rivale fatti) => villainBossBattle", () => {
  const result = resolveAfterGymBattle({ gymIndex: 3, rivalDone: 2, villainBossDone: false }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "villainBossBattle", patch: { gymIndex: 4 } });
});

test("resolveAfterGymBattle - regressione: con tutti gli stage del rivale già fatti, non scatta mai più (anche su un afterGymIndex che un tempo combaciava)", () => {
  const result = resolveAfterGymBattle({ gymIndex: 0, rivalDone: 2, villainBossDone: false }, fakeGenWithEvents);
  assert.strictEqual(result.phase, "explore");
});

test("resolveAfterGymBattle - ultima palestra, tutti gli eventi fatti => eliteBattle", () => {
  const result = resolveAfterGymBattle({ gymIndex: 3, rivalDone: 2, villainBossDone: true }, fakeGenWithEvents);
  assert.deepStrictEqual(result, { phase: "eliteBattle", patch: { gymIndex: 4, eliteIndex: 0 } });
});

test("resolveAfterGymBattle - se rivale e boss cadono sullo stesso afterGymIndex, vince il rivale", () => {
  const genBothSameIndex = { id: "x", gymLeaders: [{}, {}], rival: [{ afterGymIndex: 0 }], villainBoss: { afterGymIndex: 0 } };
  const result = resolveAfterGymBattle({ gymIndex: 0, rivalDone: 0, villainBossDone: false }, genBothSameIndex);
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

test("resolveNextGeneration - archivia le medaglie della regione appena completata in badgesByGeneration, preservando quelle già archiviate", () => {
  const result = resolveNextGeneration({
    generationId: "johto",
    completedGensCount: 1,
    badges: ["Medaglia Zanfiro", "Medaglia Nebbia"],
    badgesByGeneration: { kanto: ["Medaglia Roccia"] },
  });
  assert.deepStrictEqual(result.patch.badgesByGeneration, {
    kanto: ["Medaglia Roccia"],
    johto: ["Medaglia Zanfiro", "Medaglia Nebbia"],
  });
});

test("resolveNextGeneration - archivia anche nel ramo ultima regione (Paldea -> postgame), non solo quando esiste una regione successiva", () => {
  const result = resolveNextGeneration({
    generationId: "paldea",
    completedGensCount: GENERATIONS.length - 1,
    badges: ["Titolo di Campione di Paldea"],
    badgesByGeneration: { kanto: ["Medaglia Roccia"] },
  });
  assert.strictEqual(result.phase, "postgame");
  assert.deepStrictEqual(result.patch.badgesByGeneration, {
    kanto: ["Medaglia Roccia"],
    paldea: ["Titolo di Campione di Paldea"],
  });
});

// --- resolvePostgameExplore ------------------------------------------------

const ALL_LEGENDARIES = GENERATIONS.flatMap((gen) => gen.legendaries || []);

test("resolvePostgameExplore - rng basso => incontro leggendario, pescato dal pool di TUTTE le regioni", () => {
  const state = { caughtLegendaries: [], postgameRound: 0 };
  const result = resolvePostgameExplore(state, () => 0.01);
  assert.strictEqual(result.phase, "legendaryEncounter");
  assert.strictEqual(result.patch.pendingEncounterIsLegendary, true);
  assert.ok(ALL_LEGENDARIES.includes(result.patch.pendingEncounterPool[0]));
});

test("resolvePostgameExplore - regressione: un leggendario di una regione diversa da quella corrente può comparire", () => {
  // Prima del fix il pool era ristretto a `generation.legendaries` (la
  // singola regione fissa in cui ci si trova in post-game) — un giocatore
  // che ha già catturato tutti i leggendari della propria regione non
  // vedeva mai comparire quelli delle altre 8. Qui simuliamo "ho già
  // catturato tutti i leggendari di Kanto": deve restare disponibile
  // almeno un leggendario di un'altra regione (es. Johto).
  const kanto = GENERATIONS.find((g) => g.id === "kanto");
  const johto = GENERATIONS.find((g) => g.id === "johto");
  const state = { caughtLegendaries: [...kanto.legendaries], postgameRound: 0 };
  const result = resolvePostgameExplore(state, () => 0.01);
  assert.strictEqual(result.phase, "legendaryEncounter");
  assert.ok(!kanto.legendaries.includes(result.patch.pendingEncounterPool[0]), "non deve ripescare un leggendario di Kanto già catturato");
  assert.ok(
    ALL_LEGENDARIES.filter((id) => !kanto.legendaries.includes(id)).includes(result.patch.pendingEncounterPool[0])
  );
});

test("resolvePostgameExplore - rng alto => normale esplorazione post-game", () => {
  const state = { caughtLegendaries: [], postgameRound: 0 };
  const result = resolvePostgameExplore(state, () => 0.5);
  assert.deepStrictEqual(result, { phase: "postgameExplore", patch: {} });
});

test("resolvePostgameExplore - tutti i leggendari di tutte le regioni già catturati => mai un incontro, anche con rng basso", () => {
  const state = { caughtLegendaries: [...ALL_LEGENDARIES], postgameRound: 0 };
  const result = resolvePostgameExplore(state, () => 0.01);
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
