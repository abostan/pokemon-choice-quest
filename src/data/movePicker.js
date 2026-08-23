// Logica pura (nessuna dipendenza React/PokeAPI live), separata da
// hooks/usePokemon.js per essere testabile in isolamento come il resto di
// src/engine/ e src/data/.

/**
 * Sceglie la "mossa firma" di una specie dall'array `moves` grezzo di
 * PokeAPI: la mossa imparata per livello (level-up) al livello più alto,
 * criterio semplice che in pratica seleziona quasi sempre la mossa più
 * iconica/potente imparata naturalmente (es. Charizard → Flare Blitz lv.66,
 * non una mossa base imparata a lv.1).
 * Ritorna { name, url } oppure null se la specie non impara nulla per
 * livello (non dovrebbe capitare, ma i dati editoriali di PokeAPI non sono
 * garantiti al 100%).
 */
export function pickSignatureMove(movesFromApi) {
  if (!Array.isArray(movesFromApi)) return null;
  let best = null;
  for (const entry of movesFromApi) {
    const levelUpDetail = entry.version_group_details?.find(
      (d) => d.move_learn_method?.name === "level-up"
    );
    if (!levelUpDetail) continue;
    if (!best || levelUpDetail.level_learned_at > best.level) {
      best = { name: entry.move.name, url: entry.move.url, level: levelUpDetail.level_learned_at };
    }
  }
  return best ? { name: best.name, url: best.url } : null;
}
