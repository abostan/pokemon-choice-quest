import { useEffect, useState } from "react";
import { fetchPokemon } from "./usePokemon.js";

// Cache in memoria per i dettagli della mossa (potenza/precisione/tipo),
// condivisa tra tutte le specie che imparano la stessa mossa come "firma".
const moveDetailCache = new Map();

async function fetchMoveDetail(url) {
  if (moveDetailCache.has(url)) return moveDetailCache.get(url);
  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`PokeAPI ha risposto ${res.status} per la mossa ${url}`);
      return res.json();
    })
    .then((data) => {
      const it = data.names?.find((n) => n.language.name === "it");
      return {
        name: it?.name || data.name,
        power: data.power, // null per le mosse di stato (es. Danza Spada)
        accuracy: data.accuracy, // null per le mosse che non falliscono mai (es. Danza Spada, Terremoto contro volanti a parte)
        type: data.type?.name || null,
        damageClass: data.damage_class?.name || null,
      };
    });
  moveDetailCache.set(url, promise);
  return promise;
}

/**
 * Mossa firma (imparata per livello al livello più alto) di una specie, con
 * potenza/precisione/tipo reali da PokeAPI — usata in battaglia per dare
 * un'idea di cosa un Pokémon (proprio o avversario) sa effettivamente fare,
 * oltre al solo numero di Potenza Squadra aggregato.
 */
export function useSignatureMove(speciesId) {
  const [state, setState] = useState({ move: null, loading: true });

  useEffect(() => {
    if (speciesId == null) {
      setState({ move: null, loading: false });
      return;
    }
    let cancelled = false;
    setState({ move: null, loading: true });

    fetchPokemon(speciesId)
      .then((data) => {
        if (!data.signatureMoveRef) return null;
        return fetchMoveDetail(data.signatureMoveRef.url);
      })
      .then((move) => {
        if (!cancelled) setState({ move, loading: false });
      })
      .catch(() => {
        if (!cancelled) setState({ move: null, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [speciesId]);

  return state;
}
