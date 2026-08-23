// getTypeIcon/getTypeIconFromSlug non erano mai state chiamate da nessun
// test (getPokemonType/POKEMON_TYPES sono coperte indirettamente tramite
// tests/challengeEngine.test.js).

import test from "node:test";
import assert from "node:assert";

import { getTypeIcon, getTypeIconFromSlug, TYPE_ICONS, TYPE_LIST } from "../src/data/types.js";

test("getTypeIcon - restituisce l'icona italiana per un tipo noto, il fallback per uno sconosciuto", () => {
  assert.strictEqual(getTypeIcon("Fuoco"), TYPE_ICONS.Fuoco);
  assert.strictEqual(getTypeIcon("TipoInventato"), "⚔️");
  assert.strictEqual(getTypeIcon("TipoInventato", "❓"), "❓", "il fallback personalizzato deve sostituire quello di default");
});

test("getTypeIcon - copre tutti e 18 i tipi ufficiali senza ricadere sul fallback", () => {
  for (const type of TYPE_LIST) {
    assert.notStrictEqual(getTypeIcon(type), "⚔️", `${type} dovrebbe avere un'icona dedicata`);
  }
});

test("getTypeIconFromSlug - restituisce l'icona per lo slug inglese di PokeAPI, il fallback per uno sconosciuto", () => {
  assert.strictEqual(getTypeIconFromSlug("fire"), TYPE_ICONS.Fuoco);
  assert.strictEqual(getTypeIconFromSlug("water"), TYPE_ICONS.Acqua);
  assert.strictEqual(getTypeIconFromSlug("slug-inventato"), "⚔️");
  assert.strictEqual(getTypeIconFromSlug("slug-inventato", "❓"), "❓");
});
