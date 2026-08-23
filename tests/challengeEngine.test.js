import test from "node:test";
import assert from "node:assert";

import { filterEncounterPoolByChallenge, filterStartersByChallenge, getMatchingTypePokemon } from "../src/engine/challengeEngine.js";
import { getPokemonType } from "../src/data/types.js";

test("getPokemonType - id sconosciuto restituisce null invece di un tipo inventato (regressione bug Mono-Type)", () => {
  // 161 = Sentret (Johto), reale tipo Normale, NON mappato in POKEMON_TYPES.
  // Prima del fix, il fallback id%8 gli assegnava un tipo fittizio scollegato dalla realtà.
  assert.strictEqual(getPokemonType(161), null);
  assert.strictEqual(getPokemonType(0), "Normale"); // id assente/0 resta un caso a parte, gestito esplicitamente
});

test("challengeEngine - Mono-Type su un pool interamente non mappato (es. Johto) non lascia passare id di tipo sbagliato", () => {
  // Pool di un tier di esplorazione Johto reale (grass tier 1), nessuno di
  // questi id è in POKEMON_TYPES: prima del fix, il filtro si affidava al
  // fallback id%8 e poteva lasciar passare Pokémon di qualunque tipo.
  const johtoGrassPool = [161, 163, 165, 167];
  const result = filterEncounterPoolByChallenge(johtoGrassPool, { monoType: "Fuoco" });

  // Il pool originale (nessun id è realmente Fuoco) non deve sopravvivere
  // tale e quale: il filtro deve ripiegare sul lookup di Pokémon Fuoco reali.
  assert.notDeepStrictEqual(result, johtoGrassPool);
  // Ogni id restituito deve avere davvero tipo Fuoco secondo POKEMON_TYPES.
  for (const id of result) {
    assert.strictEqual(getPokemonType(id), "Fuoco");
  }
});

test("challengeEngine - Mono-Type su un pool parzialmente mappato filtra correttamente mantenendo solo il tipo scelto", () => {
  // Pool misto: 6=Charizard(Fuoco, mappato), 7=Squirtle(Acqua, mappato), 161=Sentret(non mappato)
  const mixedPool = [6, 7, 161];
  const result = filterEncounterPoolByChallenge(mixedPool, { monoType: "Fuoco" });
  assert.deepStrictEqual(result, [6]);
});

test("challengeEngine - getMatchingTypePokemon restituisce solo id realmente di quel tipo", () => {
  const fireIds = getMatchingTypePokemon("Fuoco");
  assert.ok(fireIds.length > 0);
  for (const id of fireIds) {
    assert.strictEqual(getPokemonType(id), "Fuoco");
  }
});

test("challengeEngine - filterStartersByChallenge non è affetto dal bug (gli starter sono sempre mappati)", () => {
  // Starter Johto reali: 152 Chikorita (Erba), 155 Cyndaquil (Fuoco), 158 Totodile (Acqua)
  const result = filterStartersByChallenge([152, 155, 158], { monoType: "Fuoco" });
  assert.deepStrictEqual(result, [155]);
});
