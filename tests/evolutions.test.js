import test from "node:test";
import assert from "node:assert";

import { checkEvolution, resolveEeveeEvolution } from "../src/data/evolutions.js";

test("evolutions - checkEvolution: sotto la soglia di livello non evolve", () => {
  const pokemon = { id: 1, level: 15 }; // Bulbasaur evolve a lv16
  assert.deepStrictEqual(checkEvolution(pokemon), pokemon);
});

test("evolutions - checkEvolution: alla soglia evolve e traccia evolvedFrom", () => {
  const result = checkEvolution({ id: 1, level: 16 }); // Bulbasaur → Ivysaur
  assert.strictEqual(result.id, 2);
  assert.strictEqual(result.evolvedFrom, 1);
});

test("evolutions - checkEvolution: forma finale (evolvesTo === id) non entra in loop", () => {
  const pokemon = { id: 131, level: 50 }; // Lapras, forma finale
  const result = checkEvolution(pokemon);
  assert.strictEqual(result.id, 131);
  assert.strictEqual(result.evolvedFrom, undefined);
});

test("evolutions - resolveEeveeEvolution: giorno => Espeon, notte => Umbreon", () => {
  assert.strictEqual(resolveEeveeEvolution(new Date(2026, 0, 1, 10, 0)), 196); // 10:00 giorno
  assert.strictEqual(resolveEeveeEvolution(new Date(2026, 0, 1, 15, 30)), 196); // 15:30 giorno
  assert.strictEqual(resolveEeveeEvolution(new Date(2026, 0, 1, 22, 0)), 197); // 22:00 notte
  assert.strictEqual(resolveEeveeEvolution(new Date(2026, 0, 1, 3, 0)), 197); // 03:00 notte
  assert.strictEqual(resolveEeveeEvolution(new Date(2026, 0, 1, 6, 0)), 196); // confine: 6:00 è già giorno
  assert.strictEqual(resolveEeveeEvolution(new Date(2026, 0, 1, 17, 59)), 196); // confine: 17:59 ancora giorno
  assert.strictEqual(resolveEeveeEvolution(new Date(2026, 0, 1, 18, 0)), 197); // confine: 18:00 è già notte
});

test("evolutions - checkEvolution: Eevee usa la condizione giorno/notte invece della soglia di livello fissa", () => {
  const dayResult = checkEvolution({ id: 133, level: 36 });
  const resolved = resolveEeveeEvolution();
  assert.strictEqual(dayResult.id, resolved);
  assert.strictEqual(dayResult.evolvedFrom, 133);
  assert.ok(dayResult.id === 196 || dayResult.id === 197);
});
