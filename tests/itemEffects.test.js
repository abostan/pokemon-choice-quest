import test from "node:test";
import assert from "node:assert";

import { computeItemEffect } from "../src/engine/itemEffects.js";

test("itemEffects - Assorbosfera/Stolascelta sono bonus percentuali, non fissi", () => {
  assert.deepStrictEqual(computeItemEffect("Assorbosfera"), { kind: "percent", value: 0.20 });
  assert.deepStrictEqual(computeItemEffect("Stolascelta"), { kind: "percent", value: 0.15 });
});

test("itemEffects - Baccamela annulla lo svantaggio di tipo", () => {
  assert.deepStrictEqual(computeItemEffect("Baccamela"), { kind: "neutralizeType" });
});

test("itemEffects - Pozioni e Pietre restano bonus fissi coerenti con le descrizioni esistenti", () => {
  assert.deepStrictEqual(computeItemEffect("Pozione"), { kind: "flat", value: 10 });
  assert.deepStrictEqual(computeItemEffect("Super Pozione"), { kind: "flat", value: 18 });
  assert.deepStrictEqual(computeItemEffect("Iper Pozione"), { kind: "flat", value: 24 });
  assert.deepStrictEqual(computeItemEffect("Pietra Focaia"), { kind: "flat", value: 14 });
  assert.deepStrictEqual(computeItemEffect("Rimedio Finale"), { kind: "flat", value: 14 });
});

test("itemEffects - oggetto sconosciuto ricade sul bonus fisso di default", () => {
  assert.deepStrictEqual(computeItemEffect("Oggetto Mai Visto"), { kind: "flat", value: 10 });
});
