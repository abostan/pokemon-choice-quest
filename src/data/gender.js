// Genere dei Pokémon — dato reale da PokeAPI (/pokemon-species → gender_rate):
// -1 = specie senza genere (es. Magnemite, Voltorb, la maggior parte dei
// leggendari), 0 = sempre maschio, 8 = sempre femmina, 1-7 = popolazione
// mista (gender_rate/8 di probabilità femmina, il resto maschio).
//
// Nei giochi reali il genere è casuale per singolo esemplare catturato
// (non legato all'id specie). Qui, come per Nature/Abilità (vedi
// data/natures.js e data/abilities.js), è deterministico sul resto della
// divisione dell'id specie per restare stabile tra un render e l'altro
// senza dover persistere un nuovo campo per ogni membro della squadra —
// stesso trade-off già accettato altrove in questo codebase.

/**
 * Restituisce il simbolo di genere di un Pokémon dato il gender_rate reale
 * della specie (da PokeAPI) ed il suo id.
 * @param {number | null} genderRate valore -1..8 da PokeAPI, o null se non ancora caricato
 * @param {number} speciesId
 * @returns {'♂' | '♀' | null} null se senza genere o dato non ancora disponibile
 */
export function getGenderSymbol(genderRate, speciesId) {
  if (genderRate == null || genderRate === -1) return null;
  if (genderRate === 0) return "♂";
  if (genderRate === 8) return "♀";
  // Popolazione mista: usa il resto della divisione per 8 come proxy
  // deterministico della probabilità reale genderRate/8 di essere femmina.
  return (speciesId % 8) < genderRate ? "♀" : "♂";
}
