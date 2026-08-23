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

test("challengeEngine - filterEncounterPoolByChallenge senza state/monoType/isRandomizer restituisce il pool invariato", () => {
  assert.deepStrictEqual(filterEncounterPoolByChallenge([16, 19], null), [16, 19]);
  assert.deepStrictEqual(filterEncounterPoolByChallenge([16, 19], {}), [16, 19]);
});

test("challengeEngine - Randomizer Mode: 3 id deterministici, sempre gli stessi per lo stesso pool", () => {
  const pool = [16, 19, 10, 13];
  const first = filterEncounterPoolByChallenge(pool, { isRandomizer: true });
  const second = filterEncounterPoolByChallenge(pool, { isRandomizer: true });
  assert.strictEqual(first.length, 3);
  assert.deepStrictEqual(first, second, "stesso pool in ingresso => stesso risultato (nessun Math.random)");
  for (const id of first) assert.ok(Number.isInteger(id) && id > 0);
});

test("challengeEngine - Randomizer Mode ha priorità su Mono-Type se entrambi attivi", () => {
  const pool = [6, 7]; // entrambi mappati (Fuoco/Acqua)
  const result = filterEncounterPoolByChallenge(pool, { isRandomizer: true, monoType: "Fuoco" });
  // Il ramo isRandomizer restituisce sempre 3 id: se il Mono-Type avesse
  // avuto la priorità, il pool [6,7] filtrato su Fuoco darebbe [6] (1 solo id).
  assert.strictEqual(result.length, 3);
});

test("challengeEngine - Mono-Type su un tipo senza alcun Pokémon mappato (né nel pool né nel lookup) ripiega sul pool originale", () => {
  const pool = [6, 7]; // Fuoco/Acqua, nessuno dei due è "TipoInventato"
  const result = filterEncounterPoolByChallenge(pool, { monoType: "TipoInventato" });
  assert.deepStrictEqual(result, pool);
});

test("challengeEngine - filterStartersByChallenge: nessuno starter combacia ma il lookup ne offre almeno 3 => selezione deterministica", () => {
  // Starter Johto (Erba/Fuoco/Acqua), nessuno è Buio: filtered=[], ma
  // getMatchingTypePokemon("Buio") ne offre più di 3 (197,215,228,229,633,634,635,717).
  const starters = [152, 155, 158];
  const result = filterStartersByChallenge(starters, { monoType: "Buio" });
  assert.strictEqual(result.length, 3);
  for (const id of result) assert.strictEqual(getPokemonType(id), "Buio");
  assert.deepStrictEqual(
    result,
    filterStartersByChallenge(starters, { monoType: "Buio" }),
    "deterministico: stesso input => stesso output"
  );
});

test("challengeEngine - filterStartersByChallenge: nessun match da nessuna parte => starter originali invariati", () => {
  const starters = [152, 155, 158];
  const result = filterStartersByChallenge(starters, { monoType: "TipoInventato" });
  assert.deepStrictEqual(result, starters);
});
