import { useEffect, useState } from "react";

// Cache in memoria condivisa, un Pokédex regionale intero per slug (150-400
// voci ciascuno) — molto più efficiente che richiedere il numero regionale
// specie per specie: lo scarichiamo una volta sola per regione e lo teniamo
// in memoria come mappa id-specie -> numero regionale.
const cache = new Map();

async function fetchRegionalDex(slug) {
  if (cache.has(slug)) return cache.get(slug);

  const promise = fetch(`https://pokeapi.co/api/v2/pokedex/${slug}/`)
    .then((res) => {
      if (!res.ok) throw new Error(`PokeAPI ha risposto ${res.status} per il pokedex ${slug}`);
      return res.json();
    })
    .then((data) => {
      const map = new Map();
      for (const entry of data.pokemon_entries || []) {
        const match = entry.pokemon_species?.url?.match(/\/pokemon-species\/(\d+)\//);
        if (match) map.set(Number(match[1]), entry.entry_number);
      }
      return map;
    });

  cache.set(slug, promise);
  return promise;
}

/**
 * Hook che restituisce il numero Pokédex regionale di una specie data una
 * regione (slug singolo, o array di slug — Kalos è divisa in 3 sotto-Pokédex
 * su PokeAPI e va controllata in ordine finché una non contiene la specie).
 * @param {number} speciesId
 * @param {string | string[] | null} regionalDexName
 * @returns {number | null} numero regionale, o null se non trovato/non ancora caricato
 */
export function useRegionalDexNumber(speciesId, regionalDexName) {
  const [number, setNumber] = useState(null);

  useEffect(() => {
    if (!speciesId || !regionalDexName) {
      setNumber(null);
      return;
    }
    const slugs = Array.isArray(regionalDexName) ? regionalDexName : [regionalDexName];
    let cancelled = false;
    setNumber(null);

    Promise.all(slugs.map(fetchRegionalDex))
      .then((maps) => {
        if (cancelled) return;
        for (const map of maps) {
          if (map.has(speciesId)) {
            setNumber(map.get(speciesId));
            return;
          }
        }
        setNumber(null);
      })
      .catch(() => {
        if (!cancelled) setNumber(null);
      });

    return () => {
      cancelled = true;
    };
  }, [speciesId, Array.isArray(regionalDexName) ? regionalDexName.join(",") : regionalDexName]);

  return number;
}
