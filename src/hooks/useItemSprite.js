import { useEffect, useState } from "react";
import { ITEM_POKEAPI_SLUGS } from "../data/items.js";

// Cache in memoria condivisa, stesso criterio di usePokemon.js.
const cache = new Map();

async function fetchItemSprite(slug) {
  if (cache.has(slug)) return cache.get(slug);

  const promise = fetch(`https://pokeapi.co/api/v2/item/${slug}`)
    .then((res) => {
      if (!res.ok) throw new Error(`PokeAPI ha risposto ${res.status} per l'oggetto ${slug}`);
      return res.json();
    })
    .then((data) => data.sprites?.default || null);

  cache.set(slug, promise);
  return promise;
}

/**
 * Sprite pixel ufficiale di uno strumento, dato il suo nome italiano nel
 * gioco (vedi ITEM_POKEAPI_SLUGS in data/items.js). Ritorna l'URL dello
 * sprite, o null se lo strumento non ha una corrispondenza nota con un
 * oggetto reale dei giochi (in quel caso il chiamante mostra l'icona emoji
 * esistente come fallback).
 */
export function useItemSprite(itemName) {
  const slug = ITEM_POKEAPI_SLUGS[itemName];
  const [sprite, setSprite] = useState(null);

  useEffect(() => {
    if (!slug) {
      setSprite(null);
      return;
    }
    let cancelled = false;
    fetchItemSprite(slug)
      .then((url) => { if (!cancelled) setSprite(url); })
      .catch(() => { if (!cancelled) setSprite(null); });
    return () => { cancelled = true; };
  }, [slug]);

  return sprite;
}
