// getGeneration/getExplorationTier/getNextGeneration non avevano finora
// nessun test diretto (tests/dataIntegrity.test.js verifica il *contenuto*
// dei dati, non queste funzioni di utilità che li interrogano) — i loro
// rami di fallback (id sconosciuto, generazione nulla, ultima regione)
// non venivano mai esercitati.

import test from "node:test";
import assert from "node:assert";

import { GENERATIONS, getGeneration, getExplorationTier, getNextGeneration } from "../src/data/generations.js";

test("getGeneration - id valido restituisce la generazione, id sconosciuto restituisce null", () => {
  assert.strictEqual(getGeneration("kanto")?.name, "Kanto");
  assert.strictEqual(getGeneration("regione-inesistente"), null);
  assert.strictEqual(getGeneration(undefined), null);
});

test("getExplorationTier - generazione nulla o senza explorationTiers ricade sul tier di fallback", () => {
  const fallback = { level: 6, grass: [25, 39, 52], fishing: [129, 60], cave: [41, 74], grass2: [63, 92] };
  assert.deepStrictEqual(getExplorationTier(null), fallback);
  assert.deepStrictEqual(getExplorationTier(undefined), fallback);
  assert.deepStrictEqual(getExplorationTier({ explorationTiers: [] }), fallback);
});

test("getExplorationTier - seleziona il tier corretto in base a gymIndex (3 palestre per tier)", () => {
  const kanto = getGeneration("kanto");
  assert.strictEqual(getExplorationTier(kanto, 0), kanto.explorationTiers[0]);
  assert.strictEqual(getExplorationTier(kanto, 2), kanto.explorationTiers[0]);
  assert.strictEqual(getExplorationTier(kanto, 3), kanto.explorationTiers[1]);
  assert.strictEqual(getExplorationTier(kanto, 6), kanto.explorationTiers[2]);
  // Oltre l'ultimo tier (es. gymIndex molto alto in post-game) resta sull'ultimo, non va fuori indice.
  assert.strictEqual(getExplorationTier(kanto, 999), kanto.explorationTiers[kanto.explorationTiers.length - 1]);
});

test("getNextGeneration - regione intermedia restituisce quella successiva nell'ordine di GENERATIONS", () => {
  const next = getNextGeneration("kanto");
  assert.strictEqual(next.id, GENERATIONS[GENERATIONS.findIndex((g) => g.id === "kanto") + 1].id);
});

test("getNextGeneration - ultima regione o id sconosciuto restituiscono null", () => {
  const lastGen = GENERATIONS[GENERATIONS.length - 1];
  assert.strictEqual(getNextGeneration(lastGen.id), null);
  assert.strictEqual(getNextGeneration("regione-inesistente"), null);
});
