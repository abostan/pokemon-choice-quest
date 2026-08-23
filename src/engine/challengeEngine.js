import { getPokemonType, POKEMON_TYPES } from "../data/types.js";

// Lookup pigro: costruito solo alla prima chiamata
let _typeToIdsMap = null;

function getTypeToIdsMap() {
  if (_typeToIdsMap) return _typeToIdsMap;
  _typeToIdsMap = {};
  const entries = Object.entries(POKEMON_TYPES);
  for (let i = 0; i < entries.length; i++) {
    const id = Number(entries[i][0]);
    const type = entries[i][1];
    if (!_typeToIdsMap[type]) _typeToIdsMap[type] = [];
    _typeToIdsMap[type].push(id);
  }
  return _typeToIdsMap;
}

/**
 * Restituisce tutti gli ID dei Pokémon mappati in POKEMON_TYPES che corrispondono al tipo specificato.
 */
export function getMatchingTypePokemon(targetType) {
  if (!targetType) return [];
  const map = getTypeToIdsMap();
  return map[targetType] || [];
}

/**
 * Genera un numero pseudo-casuale deterministico tra 0 e max (escluso)
 * basato su seed e indice — NESSUNA Math.random() → risultato stabile tra render.
 */
function seededPick(arr, seed, n) {
  if (!arr || arr.length === 0) return 0;
  const hash = Math.abs(((seed + n * 31) * 1664525 + 1013904223) % arr.length);
  return arr[hash % arr.length];
}

/**
 * Applica i filtri delle Modalità Sfida (Randomizer e Mono-Type) a un pool di incontri selvatici.
 * IMPORTANTE: completamente deterministico — nessuna Math.random() — sicuro da chiamare nel render.
 */
export function filterEncounterPoolByChallenge(rawPool, state) {
  const pool = rawPool && rawPool.length > 0 ? rawPool : [25];

  // Seed basato sul contenuto del pool — stesso input = stesso output sempre
  const poolSeed = pool.reduce(function(acc, id, i) { return acc + id * (i + 1) * 31; }, 0);

  if (state && state.isRandomizer) {
    const allIds = Object.keys(POKEMON_TYPES).map(Number);
    return [
      seededPick(allIds, poolSeed, 0),
      seededPick(allIds, poolSeed, 1),
      seededPick(allIds, poolSeed, 2),
    ];
  }

  if (state && state.monoType) {
    // 1. Filtra prima il pool originale
    const filtered = pool.filter(function(id) { return getPokemonType(id) === state.monoType; });
    if (filtered.length > 0) return filtered;

    // 2. Nessun match nel pool originale → selezione deterministica dal lookup
    const matching = getMatchingTypePokemon(state.monoType);
    if (matching.length > 0) {
      return [
        seededPick(matching, poolSeed, 0),
        seededPick(matching, poolSeed, 1),
        seededPick(matching, poolSeed, 2),
      ];
    }
  }

  return pool;
}

/**
 * Applica i filtri per gli starter iniziali in base alle modalità di sfida.
 * IMPORTANTE: completamente deterministico.
 */
export function filterStartersByChallenge(starterIds, state) {
  if (!state || !state.monoType) return starterIds;

  const filtered = starterIds.filter(function(id) { return getPokemonType(id) === state.monoType; });
  if (filtered.length > 0) return filtered;

  const matching = getMatchingTypePokemon(state.monoType);
  const seed = starterIds.reduce(function(acc, id) { return acc + id; }, 0);
  if (matching.length >= 3) {
    return [
      seededPick(matching, seed, 0),
      seededPick(matching, seed, 1),
      seededPick(matching, seed, 2),
    ];
  }
  return matching.length > 0 ? matching : starterIds;
}
