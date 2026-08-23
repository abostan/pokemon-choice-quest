import { useEffect, useState } from "react";

// Cache in memoria condivisa, stesso criterio di usePokemon.js — endpoint
// PokeAPI diverso (/pokemon-species invece di /pokemon), dati diversi
// (descrizione Pokédex e "genus" invece di sprite/tipi).
const cache = new Map();

function cleanFlavorText(text) {
  // I flavor_text di PokeAPI contengono caratteri di controllo residui dai
  // font a larghezza fissa dei giochi originali (\n, \f, ­).
  return text.replace(/[\n\f\r]+/g, " ").replace(/­/g, "").trim();
}

async function fetchPokemonSpecies(id) {
  if (cache.has(id)) return cache.get(id);

  const promise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error(`PokeAPI ha risposto ${res.status} per la specie ${id}`);
      return res.json();
    })
    .then((data) => {
      const itEntries = (data.flavor_text_entries || []).filter((e) => e.language?.name === "it");
      // L'ultima entry italiana corrisponde di solito alla versione di gioco
      // più recente che include quella specie — testo tendenzialmente più
      // aggiornato delle primissime traduzioni.
      const description = itEntries.length > 0 ? cleanFlavorText(itEntries[itEntries.length - 1].flavor_text) : null;
      const genusEntry = (data.genera || []).find((g) => g.language?.name === "it");
      return {
        description,
        genus: genusEntry?.genus ?? null,
      };
    });

  cache.set(id, promise);
  return promise;
}

/**
 * Hook che carica la descrizione Pokédex ufficiale in italiano (e la
 * "genus", es. "Pokémon Seme") da PokeAPI dato l'id (National Dex number).
 * Ritorna { data: {description, genus} | null, loading, error }.
 */
export function usePokemonSpecies(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (id == null) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ data: cache.has(id) ? undefined : null, loading: true, error: null });

    fetchPokemonSpecies(id)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
