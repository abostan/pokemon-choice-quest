// engine/hallOfFame.js non aveva finora nessun file di test dedicato:
// stesso motivo di achievements.js/scoreLogic.js — usa localStorage,
// invisibile al coverage report finché nessun test lo importa.

import test from "node:test";
import assert from "node:assert";

import { getHallOfFame, addHallOfFameEntry, clearHallOfFame } from "../src/engine/hallOfFame.js";
import { installLocalStorageStub, withThrowingLocalStorage } from "./helpers/localStorageStub.js";

const storage = installLocalStorageStub();

test("getHallOfFame - array vuoto se non c'è ancora nessun trionfo salvato", () => {
  storage.clear();
  assert.deepStrictEqual(getHallOfFame(), []);
});

test("addHallOfFameEntry - aggiunge un ingresso con i campi attesi, più recente in cima", () => {
  storage.clear();
  const team = [{ id: 6, level: 62, isShiny: true }, { id: 9, level: 60 }];
  const updated = addHallOfFameEntry({ genName: "Kanto", team, isNuzlocke: true });

  assert.strictEqual(updated.length, 1);
  const [entry] = updated;
  assert.strictEqual(entry.genName, "Kanto");
  assert.strictEqual(entry.isNuzlocke, true);
  assert.ok(entry.id.startsWith("hof_"));
  assert.ok(typeof entry.timestamp === "string" && entry.timestamp.length > 0);
  assert.deepStrictEqual(entry.team, [
    { id: 6, level: 62, isShiny: true },
    { id: 9, level: 60, isShiny: false },
  ]);

  const second = addHallOfFameEntry({ genName: "Johto", team: [] });
  assert.strictEqual(second.length, 2);
  assert.strictEqual(second[0].genName, "Johto", "il trionfo più recente va in cima alla lista");
  assert.strictEqual(second[1].genName, "Kanto");
});

test("addHallOfFameEntry - genName mancante ricade su 'Lega Pokémon', isNuzlocke di default false", () => {
  storage.clear();
  const [entry] = addHallOfFameEntry({ team: [] });
  assert.strictEqual(entry.genName, "Lega Pokémon");
  assert.strictEqual(entry.isNuzlocke, false);
});

test("clearHallOfFame - svuota lo storico", () => {
  storage.clear();
  addHallOfFameEntry({ genName: "Hoenn", team: [] });
  assert.strictEqual(getHallOfFame().length, 1);
  clearHallOfFame();
  assert.deepStrictEqual(getHallOfFame(), []);
});

test("localStorage non disponibile: nessuna eccezione propagata, fallback sicuri", () => {
  withThrowingLocalStorage(() => {
    assert.deepStrictEqual(getHallOfFame(), []);
    assert.deepStrictEqual(addHallOfFameEntry({ genName: "Unova", team: [] }), []);
    assert.doesNotThrow(() => clearHallOfFame());
  });
});
