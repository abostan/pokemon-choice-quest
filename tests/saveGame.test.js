// engine/saveGame.js non aveva finora nessun file di test dedicato: usa
// localStorage pesantemente (salvataggio multi-slot, retro-compatibilità
// col vecchio pcq_save_v1, import/export JSON, Pokédex storico) — non
// compariva nemmeno nel coverage report perché nessun test lo importava.

import test from "node:test";
import assert from "node:assert";

import {
  saveGame,
  loadGame,
  loadAllSlots,
  hasSave,
  deleteSave,
  exportSlotJSON,
  importSlotJSON,
  updateHistoricPokedex,
  loadHistoricPokedex,
} from "../src/engine/saveGame.js";
import { isAchievementUnlocked } from "../src/engine/achievements.js";
import { installLocalStorageStub, withThrowingLocalStorage } from "./helpers/localStorageStub.js";

const storage = installLocalStorageStub();

function isIsoDateString(value) {
  return typeof value === "string" && !isNaN(Date.parse(value));
}

// --- saveGame / loadGame --------------------------------------------------

test("saveGame + loadGame - round-trip: quello che si salva è quello che si ricarica", () => {
  storage.clear();
  const state = { generationId: "kanto", gymIndex: 3, team: [{ id: 1, level: 10 }], coins: 12 };
  saveGame(state, 1);

  const loaded = loadGame(1);
  assert.strictEqual(loaded.slotId, 1);
  assert.ok(isIsoDateString(loaded.savedAt));
  assert.strictEqual(loaded.state.generationId, "kanto");
  assert.strictEqual(loaded.state.gymIndex, 3);
  assert.strictEqual(loaded.state.coins, 12);
});

test("saveGame - i campi transienti (SKIP_FIELDS) non vengono salvati", () => {
  storage.clear();
  const state = {
    generationId: "kanto",
    pendingEncounterPool: [16, 19],
    pendingEncounterLevel: 6,
    pokedexOpen: true,
    pendingEvolutions: [{ id: 1 }],
    boxModalOpen: true,
  };
  saveGame(state, 1);
  const raw = JSON.parse(storage.getItem("pcq_save_slot_1"));
  for (const field of ["pendingEncounterPool", "pendingEncounterLevel", "pokedexOpen", "pendingEvolutions", "boxModalOpen"]) {
    assert.ok(!(field in raw.state), `${field} non doveva essere salvato`);
  }
});

test("loadGame - nessun salvataggio nello slot => null", () => {
  storage.clear();
  assert.strictEqual(loadGame(1), null);
  assert.strictEqual(loadGame(3), null);
});

test("saveGame - localStorage non disponibile: nessuna eccezione propagata", () => {
  withThrowingLocalStorage(() => {
    assert.doesNotThrow(() => saveGame({ generationId: "kanto" }, 1));
  });
});

test("loadGame - JSON corrotto nello slot => null, nessuna eccezione propagata", () => {
  storage.clear();
  storage.setItem("pcq_save_slot_1", "{questo non è json valido");
  assert.strictEqual(loadGame(1), null);
});

test("loadGame - version diversa dall'attuale => null (salvataggio da un formato incompatibile)", () => {
  storage.clear();
  storage.setItem("pcq_save_slot_1", JSON.stringify({ version: 999, state: { generationId: "kanto" } }));
  assert.strictEqual(loadGame(1), null);
});

test("loadGame - state senza generationId (dopo la sanitizzazione) => null", () => {
  storage.clear();
  saveGame({ team: [] }, 1); // nessun generationId
  assert.strictEqual(loadGame(1), null);
});

test("loadGame - retro-compatibilità: slot 1 vuoto ma esiste il vecchio pcq_save_v1", () => {
  storage.clear();
  storage.setItem("pcq_save_v1", JSON.stringify({ version: 1, state: { generationId: "johto" } }));
  const loaded = loadGame(1);
  assert.ok(loaded);
  assert.strictEqual(loaded.state.generationId, "johto");
});

test("loadGame - la retro-compatibilità con pcq_save_v1 vale solo per lo slot 1", () => {
  storage.clear();
  storage.setItem("pcq_save_v1", JSON.stringify({ version: 1, state: { generationId: "johto" } }));
  assert.strictEqual(loadGame(2), null);
});

// --- loadAllSlots / hasSave -------------------------------------------

test("loadAllSlots - restituisce tutti e 5 gli slot, con data null per quelli vuoti", () => {
  storage.clear();
  saveGame({ generationId: "kanto" }, 1);
  saveGame({ generationId: "hoenn" }, 3);

  const slots = loadAllSlots();
  assert.strictEqual(slots.length, 5);
  assert.deepStrictEqual(slots.map((s) => s.slotId), [1, 2, 3, 4, 5]);
  assert.strictEqual(slots[0].data.state.generationId, "kanto");
  assert.strictEqual(slots[1].data, null);
  assert.strictEqual(slots[2].data.state.generationId, "hoenn");
});

test("hasSave - per slot specifico e su tutti gli slot", () => {
  storage.clear();
  assert.strictEqual(hasSave(), false);
  assert.strictEqual(hasSave(1), false);

  saveGame({ generationId: "sinnoh" }, 2);
  assert.strictEqual(hasSave(2), true);
  assert.strictEqual(hasSave(1), false);
  assert.strictEqual(hasSave(), true, "hasSave() senza argomenti controlla tutti gli slot");
});

// --- deleteSave ----------------------------------------------------------

test("deleteSave - rimuove solo lo slot indicato", () => {
  storage.clear();
  saveGame({ generationId: "kanto" }, 1);
  saveGame({ generationId: "johto" }, 2);
  deleteSave(1);
  assert.strictEqual(loadGame(1), null);
  assert.ok(loadGame(2));
});

test("deleteSave - sullo slot 1 rimuove anche il vecchio pcq_save_v1", () => {
  storage.clear();
  storage.setItem("pcq_save_v1", JSON.stringify({ version: 1, state: { generationId: "johto" } }));
  deleteSave(1);
  assert.strictEqual(storage.getItem("pcq_save_v1"), null);
});

test("deleteSave - localStorage non disponibile: nessuna eccezione propagata", () => {
  withThrowingLocalStorage(() => {
    assert.doesNotThrow(() => deleteSave(1));
  });
});

// --- export / import JSON -------------------------------------------------

test("exportSlotJSON - null se lo slot è vuoto, altrimenti una stringa JSON ricaricabile con loadGame", () => {
  storage.clear();
  assert.strictEqual(exportSlotJSON(1), null);

  saveGame({ generationId: "unova", coins: 7 }, 1);
  const json = exportSlotJSON(1);
  assert.strictEqual(typeof json, "string");
  const parsed = JSON.parse(json);
  assert.strictEqual(parsed.state.generationId, "unova");
});

test("importSlotJSON - ripristina un salvataggio valido e restituisce true", () => {
  storage.clear();
  const payload = JSON.stringify({ savedAt: "2024-01-01T00:00:00.000Z", state: { generationId: "kalos", coins: 3 } });
  const ok = importSlotJSON(4, payload);
  assert.strictEqual(ok, true);

  const loaded = loadGame(4);
  assert.strictEqual(loaded.state.generationId, "kalos");
  assert.strictEqual(loaded.state.coins, 3);
});

test("importSlotJSON - JSON non parsabile => false, nessuna scrittura", () => {
  storage.clear();
  assert.strictEqual(importSlotJSON(1, "{non è json"), false);
  assert.strictEqual(loadGame(1), null);
});

test("importSlotJSON - JSON valido ma senza state.generationId => false", () => {
  storage.clear();
  assert.strictEqual(importSlotJSON(1, JSON.stringify({ state: {} })), false);
  assert.strictEqual(importSlotJSON(1, JSON.stringify({})), false);
});

// --- Pokédex storico -------------------------------------------------------

test("updateHistoricPokedex + loadHistoricPokedex - registra visto/catturato/shiny e mantiene firstSeen/firstCaught", () => {
  storage.clear();
  updateHistoricPokedex(1, false, false); // solo visto
  let historic = loadHistoricPokedex();
  assert.strictEqual(historic[1].seen, true);
  assert.strictEqual(historic[1].caught, false);
  assert.ok(historic[1].firstSeen);
  assert.strictEqual(historic[1].firstCaught, null);

  updateHistoricPokedex(1, true, true); // poi catturato, shiny
  historic = loadHistoricPokedex();
  assert.strictEqual(historic[1].caught, true);
  assert.strictEqual(historic[1].shiny, true);
  assert.ok(historic[1].firstCaught, "la prima cattura va registrata una volta ottenuta");
});

test("updateHistoricPokedex - localStorage non disponibile: nessuna eccezione propagata", () => {
  withThrowingLocalStorage(() => {
    assert.doesNotThrow(() => updateHistoricPokedex(1, true, false));
  });
});

test("loadHistoricPokedex - oggetto vuoto se non c'è ancora nulla, o se localStorage non è disponibile", () => {
  storage.clear();
  assert.deepStrictEqual(loadHistoricPokedex(), {});
  withThrowingLocalStorage(() => {
    assert.deepStrictEqual(loadHistoricPokedex(), {});
  });
});

test("updateHistoricPokedex - sblocca pokedexComplete esattamente al raggiungimento di 151 specie diverse catturate", () => {
  storage.clear();
  for (let id = 1; id <= 150; id++) updateHistoricPokedex(id, true, false);
  assert.strictEqual(isAchievementUnlocked("pokedexComplete"), false, "non ancora a 151");

  updateHistoricPokedex(151, true, false);
  assert.strictEqual(isAchievementUnlocked("pokedexComplete"), true);
});
