// Copertura per-ramo di sanitizeGameState() — nato dal coverage report
// nativo (ROADMAP.md Fase 10): il modulo aveva 100% linee ma solo ~19%
// branch, cioè quasi nessuno dei singoli fallback per-campo era mai
// esercitato, solo il caso "tutto valido" e "tutto invalido insieme"
// (tests/engine.test.js). Proprio questo modulo protegge dalla stessa
// classe di bug del crash storico `nextGenId` (v8.6): un campo nuovo non
// aggiunto qui, o un ramo di fallback mai testato, può restare invisibile
// finché non lo scopre un giocatore reale.

import test from "node:test";
import assert from "node:assert";

import { sanitizeGameState } from "../src/engine/saveSanitizer.js";

test("sanitizeGameState - input non-oggetto => null", () => {
  assert.strictEqual(sanitizeGameState(null), null);
  assert.strictEqual(sanitizeGameState(undefined), null);
  assert.strictEqual(sanitizeGameState("not an object"), null);
  assert.strictEqual(sanitizeGameState(42), null);
});

test("sanitizeGameState - phase: stringa valida passa, altrimenti generationSelect", () => {
  assert.strictEqual(sanitizeGameState({ phase: "explore" }).phase, "explore");
  assert.strictEqual(sanitizeGameState({ phase: 123 }).phase, "generationSelect");
  assert.strictEqual(sanitizeGameState({}).phase, "generationSelect");
});

test("sanitizeGameState - generationId/nextGenId: stringa valida passa, altrimenti null", () => {
  // nextGenId in particolare: il campo del crash storico documentato in v8.6
  // (perso al salvataggio perché non era ancora nella whitelist).
  const clean = sanitizeGameState({ generationId: "kanto", nextGenId: "johto" });
  assert.strictEqual(clean.generationId, "kanto");
  assert.strictEqual(clean.nextGenId, "johto");

  const dirty = sanitizeGameState({ generationId: 5, nextGenId: {} });
  assert.strictEqual(dirty.generationId, null);
  assert.strictEqual(dirty.nextGenId, null);

  assert.strictEqual(sanitizeGameState({}).generationId, null);
  assert.strictEqual(sanitizeGameState({}).nextGenId, null);
});

test("sanitizeGameState - gymIndex/eliteIndex: numero valido clampato a >=0, altrimenti 0", () => {
  assert.strictEqual(sanitizeGameState({ gymIndex: 5 }).gymIndex, 5);
  assert.strictEqual(sanitizeGameState({ gymIndex: -3 }).gymIndex, 0, "un negativo va clampato a 0, non passato così com'è");
  assert.strictEqual(sanitizeGameState({ gymIndex: NaN }).gymIndex, 0);
  assert.strictEqual(sanitizeGameState({ gymIndex: "3" }).gymIndex, 0);
  assert.strictEqual(sanitizeGameState({}).gymIndex, 0);

  assert.strictEqual(sanitizeGameState({ eliteIndex: 2 }).eliteIndex, 2);
  assert.strictEqual(sanitizeGameState({ eliteIndex: -1 }).eliteIndex, 0);
  assert.strictEqual(sanitizeGameState({ eliteIndex: NaN }).eliteIndex, 0);
});

test("sanitizeGameState - rivalDone: era un booleano prima che il Rivale diventasse ricorrente, ora è un contatore di stage", () => {
  // Numero valido (salvataggi nuovi): passa clampato a >=0, come gymIndex/eliteIndex.
  assert.strictEqual(sanitizeGameState({ rivalDone: 2 }).rivalDone, 2);
  assert.strictEqual(sanitizeGameState({ rivalDone: -1 }).rivalDone, 0);
  assert.strictEqual(sanitizeGameState({ rivalDone: NaN }).rivalDone, 0);
  // Retrocompatibilità con i vecchi salvataggi booleani: true migra a 1 (il
  // giocatore ha già affrontato "il rivale" una volta, i nuovi stage restano
  // da scoprire), false/assente migra a 0.
  assert.strictEqual(sanitizeGameState({ rivalDone: true }).rivalDone, 1);
  assert.strictEqual(sanitizeGameState({ rivalDone: false }).rivalDone, 0);
  assert.strictEqual(sanitizeGameState({}).rivalDone, 0);
});

test("sanitizeGameState - coins: numero valido clampato a >=0, altrimenti 5 (saldo di partenza)", () => {
  assert.strictEqual(sanitizeGameState({ coins: 20 }).coins, 20);
  assert.strictEqual(sanitizeGameState({ coins: -50 }).coins, 0, "negativo clampato a 0, non al default 5");
  assert.strictEqual(sanitizeGameState({ coins: NaN }).coins, 5);
  assert.strictEqual(sanitizeGameState({ coins: "10" }).coins, 5);
  assert.strictEqual(sanitizeGameState({}).coins, 5);
});

test("sanitizeGameState - completedGensCount/postgameRound/tournamentRound/choicesCount: NaN non deve mai attraversare il sanitizzatore", () => {
  // Bug trovato grazie al coverage report: a differenza di gymIndex/eliteIndex/coins,
  // questi 4 campi non avevano la guardia !isNaN() — un NaN in un salvataggio
  // corrotto passava indenne (Math.max(0, NaN) è NaN, non 0), rompendo silenziosamente
  // aritmetica a valle (es. postgameRound + 1, o proprio i confronti "count >= GENERATIONS.length"
  // della Fase 10). Corretto in saveSanitizer.js per allinearli agli altri campi numerici.
  const dirty = sanitizeGameState({
    completedGensCount: NaN,
    postgameRound: NaN,
    tournamentRound: NaN,
    choicesCount: NaN,
  });
  assert.strictEqual(dirty.completedGensCount, 0);
  assert.strictEqual(dirty.postgameRound, 0);
  assert.strictEqual(dirty.tournamentRound, 0);
  assert.strictEqual(dirty.choicesCount, 0);

  const clean = sanitizeGameState({ completedGensCount: 3, postgameRound: 7, tournamentRound: 2, choicesCount: 40 });
  assert.strictEqual(clean.completedGensCount, 3);
  assert.strictEqual(clean.postgameRound, 7);
  assert.strictEqual(clean.tournamentRound, 2);
  assert.strictEqual(clean.choicesCount, 40);

  const negative = sanitizeGameState({ completedGensCount: -2, postgameRound: -1, tournamentRound: -5, choicesCount: -9 });
  assert.strictEqual(negative.completedGensCount, 0);
  assert.strictEqual(negative.postgameRound, 0);
  assert.strictEqual(negative.tournamentRound, 0);
  assert.strictEqual(negative.choicesCount, 0);
});

test("sanitizeGameState - flag booleani: coercizzati con !! qualunque sia il valore grezzo", () => {
  const truthy = sanitizeGameState({ villainBossDone: "yes", multiGenRun: {}, isNuzlocke: true, isRandomizer: [], teamFatigued: "x", pendingEncounterIsLegendary: 1 });
  assert.strictEqual(truthy.villainBossDone, true);
  assert.strictEqual(truthy.multiGenRun, true);
  assert.strictEqual(truthy.isNuzlocke, true);
  assert.strictEqual(truthy.isRandomizer, true);
  assert.strictEqual(truthy.teamFatigued, true);
  assert.strictEqual(truthy.pendingEncounterIsLegendary, true);

  const falsy = sanitizeGameState({ villainBossDone: undefined, multiGenRun: null, isNuzlocke: false, isRandomizer: "" });
  assert.strictEqual(falsy.villainBossDone, false);
  assert.strictEqual(falsy.multiGenRun, false);
  assert.strictEqual(falsy.isNuzlocke, false);
  assert.strictEqual(falsy.isRandomizer, false);
});

test("sanitizeGameState - team/box: filtrano le voci senza id numerico, altrimenti array vuoto", () => {
  const clean = sanitizeGameState({
    team: [{ id: 1, level: 5 }, null, { level: 5 }, { id: "x" }, { id: 2 }],
    box: [{ id: 3, level: 5 }, null, { id: "y" }],
  });
  assert.deepStrictEqual(clean.team, [{ id: 1, level: 5 }, { id: 2 }]);
  assert.deepStrictEqual(clean.box, [{ id: 3, level: 5 }]);

  assert.deepStrictEqual(sanitizeGameState({ team: "not an array", box: "not an array" }).team, []);
  assert.deepStrictEqual(sanitizeGameState({ team: "not an array", box: "not an array" }).box, []);
});

test("sanitizeGameState - badges/items: filtrano le voci non-stringa, altrimenti array vuoto", () => {
  const clean = sanitizeGameState({
    badges: ["Medaglia Roccia", 42, null, "Medaglia Foglia"],
    items: ["Pozione", 99, null, "Antidoto"],
  });
  assert.deepStrictEqual(clean.badges, ["Medaglia Roccia", "Medaglia Foglia"]);
  assert.deepStrictEqual(clean.items, ["Pozione", "Antidoto"]);

  assert.deepStrictEqual(sanitizeGameState({ badges: 1, items: 12345 }).badges, []);
  assert.deepStrictEqual(sanitizeGameState({ badges: 1, items: 12345 }).items, []);
});

test("sanitizeGameState - pendingEncounterPool/pendingEvolutions/caughtLegendaries: array passa, altrimenti fallback", () => {
  const clean = sanitizeGameState({
    pendingEncounterPool: [16, 19],
    pendingEvolutions: [{ id: 1 }],
    caughtLegendaries: [150],
  });
  assert.deepStrictEqual(clean.pendingEncounterPool, [16, 19]);
  assert.deepStrictEqual(clean.pendingEvolutions, [{ id: 1 }]);
  assert.deepStrictEqual(clean.caughtLegendaries, [150]);

  const dirty = sanitizeGameState({ pendingEncounterPool: "x", pendingEvolutions: null, caughtLegendaries: {} });
  assert.strictEqual(dirty.pendingEncounterPool, null);
  assert.deepStrictEqual(dirty.pendingEvolutions, []);
  assert.deepStrictEqual(dirty.caughtLegendaries, []);
});

test("sanitizeGameState - pendingEncounterLevel: numero passa, altrimenti default 4", () => {
  assert.strictEqual(sanitizeGameState({ pendingEncounterLevel: 30 }).pendingEncounterLevel, 30);
  assert.strictEqual(sanitizeGameState({ pendingEncounterLevel: "30" }).pendingEncounterLevel, 4);
  assert.strictEqual(sanitizeGameState({}).pendingEncounterLevel, 4);
});

test("sanitizeGameState - pendingTrainer/pokedexRun: oggetto passa, altrimenti fallback", () => {
  const clean = sanitizeGameState({ pendingTrainer: { title: "x", teamIds: [1] }, pokedexRun: { 1: { seen: true } } });
  assert.deepStrictEqual(clean.pendingTrainer, { title: "x", teamIds: [1] });
  assert.deepStrictEqual(clean.pokedexRun, { 1: { seen: true } });

  const dirty = sanitizeGameState({ pendingTrainer: "x", pokedexRun: null });
  assert.strictEqual(dirty.pendingTrainer, null);
  assert.deepStrictEqual(dirty.pokedexRun, {});

  assert.strictEqual(sanitizeGameState({}).pendingTrainer, null);
  assert.deepStrictEqual(sanitizeGameState({}).pokedexRun, {});
});

test("sanitizeGameState - badgesByGeneration: oggetto di array di stringhe passa, ripulito per-chiave, altrimenti {}", () => {
  const clean = sanitizeGameState({ badgesByGeneration: { kanto: ["Medaglia Roccia", "Medaglia Cascata"], johto: [] } });
  assert.deepStrictEqual(clean.badgesByGeneration, { kanto: ["Medaglia Roccia", "Medaglia Cascata"], johto: [] });

  // Ogni valore viene comunque filtrato come array di stringhe, coerente con badges
  const mixed = sanitizeGameState({ badgesByGeneration: { kanto: ["Medaglia Roccia", 42, null], hoenn: "non un array" } });
  assert.deepStrictEqual(mixed.badgesByGeneration, { kanto: ["Medaglia Roccia"] });

  assert.deepStrictEqual(sanitizeGameState({ badgesByGeneration: null }).badgesByGeneration, {});
  assert.deepStrictEqual(sanitizeGameState({ badgesByGeneration: [] }).badgesByGeneration, {});
  assert.deepStrictEqual(sanitizeGameState({ badgesByGeneration: "not an object" }).badgesByGeneration, {});
  assert.deepStrictEqual(sanitizeGameState({}).badgesByGeneration, {});
});

test("sanitizeGameState - monoType: stringa passa, altrimenti null", () => {
  assert.strictEqual(sanitizeGameState({ monoType: "Fuoco" }).monoType, "Fuoco");
  assert.strictEqual(sanitizeGameState({ monoType: 1 }).monoType, null);
  assert.strictEqual(sanitizeGameState({}).monoType, null);
});

test("sanitizeGameState - lastEncounterId: numero passa, altrimenti null", () => {
  assert.strictEqual(sanitizeGameState({ lastEncounterId: 25 }).lastEncounterId, 25);
  assert.strictEqual(sanitizeGameState({ lastEncounterId: "25" }).lastEncounterId, null);
  assert.strictEqual(sanitizeGameState({}).lastEncounterId, null);
});

test("sanitizeGameState - campi di stato transiente sono SEMPRE resettati, qualunque cosa contenga il salvataggio", () => {
  // pokedexOpen/activeMega/activeTerastal/activeItemBoost/activeWeather/*ModalOpen
  // non vanno mai ripristinati da un salvataggio: sono stato della sessione
  // corrente (un modale aperto, un boost di battaglia in corso), non della
  // run. Se restassero "vivi" da un salvataggio corrotto, es. activeMega:true
  // residuo, la squadra risulterebbe boostata senza una battaglia in corso.
  const dirty = sanitizeGameState({
    pokedexOpen: true,
    activeMega: true,
    activeTerastal: true,
    activeItemBoost: 25,
    activeWeather: { name: "Sole Intenso" },
    boxModalOpen: true,
    hallOfFameOpen: true,
    scoreModalOpen: true,
  });
  assert.strictEqual(dirty.pokedexOpen, false);
  assert.strictEqual(dirty.activeMega, false);
  assert.strictEqual(dirty.activeTerastal, false);
  assert.strictEqual(dirty.activeItemBoost, 0);
  assert.strictEqual(dirty.activeWeather, null);
  assert.strictEqual(dirty.boxModalOpen, false);
  assert.strictEqual(dirty.hallOfFameOpen, false);
  assert.strictEqual(dirty.scoreModalOpen, false);
});
