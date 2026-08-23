import test from "node:test";
import assert from "node:assert";

import { getGenderSymbol } from "../src/data/gender.js";

test("gender - genderRate assente o -1 => senza genere (null)", () => {
  assert.strictEqual(getGenderSymbol(null, 1), null);
  assert.strictEqual(getGenderSymbol(-1, 81), null); // es. Magnemite, davvero senza genere
});

test("gender - genderRate 0 => sempre maschio", () => {
  assert.strictEqual(getGenderSymbol(0, 1), "♂");
  assert.strictEqual(getGenderSymbol(0, 999), "♂");
});

test("gender - genderRate 8 => sempre femmina", () => {
  assert.strictEqual(getGenderSymbol(8, 1), "♀");
  assert.strictEqual(getGenderSymbol(8, 999), "♀");
});

test("gender - genderRate misto (1-7) è deterministico per id (stesso id => sempre lo stesso simbolo)", () => {
  const a = getGenderSymbol(4, 25);
  const b = getGenderSymbol(4, 25);
  assert.strictEqual(a, b);
  assert.ok(a === "♂" || a === "♀");
});

test("gender - genderRate misto produce entrambi i simboli su un range di id (non sempre lo stesso esito)", () => {
  const symbols = new Set();
  for (let id = 0; id < 8; id++) symbols.add(getGenderSymbol(4, id));
  assert.deepStrictEqual(symbols, new Set(["♂", "♀"]));
});
