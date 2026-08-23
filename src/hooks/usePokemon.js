import { useEffect, useState } from "react";

// Cache in memoria condivisa: se più componenti chiedono lo stesso Pokémon
// non rifacciamo la stessa chiamata a PokeAPI più volte.
const cache = new Map();

async function fetchPokemon(id) {
  if (cache.has(id)) return cache.get(id);

  const promise = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error(`PokeAPI ha risposto ${res.status} per l'id ${id}`);
      return res.json();
    })
    .then((data) => ({
      id: data.id,
      name: data.name,
      types: data.types.map((t) => t.type.name),
      sprite:
        data.sprites?.other?.["official-artwork"]?.front_default ||
        data.sprites?.front_default ||
        "",
      spriteShiny:
        data.sprites?.other?.["official-artwork"]?.front_shiny ||
        data.sprites?.front_shiny ||
        "",
      cry: data.cries?.latest || data.cries?.legacy || null,
    }));

  cache.set(id, promise);
  return promise;
}

/**
 * Hook che carica dati + sprite di un Pokémon da PokeAPI dato il suo id
 * (National Dex number). Ritorna { data, loading, error }.
 */
export function usePokemon(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (id == null) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ data: cache.has(id) ? undefined : null, loading: true, error: null });

    fetchPokemon(id)
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

export { fetchPokemon };
