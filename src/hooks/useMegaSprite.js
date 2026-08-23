import { useEffect, useState } from "react";

// Cache in memoria condivisa (due livelli: lista varietà per specie, poi
// sprite per singola varietà), stesso criterio degli altri hook PokeAPI.
const varietiesCache = new Map();
const spriteCache = new Map();

async function fetchVarieties(id) {
  if (varietiesCache.has(id)) return varietiesCache.get(id);
  const promise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error(`PokeAPI ha risposto ${res.status} per la specie ${id}`);
      return res.json();
    })
    .then((data) => data.varieties || []);
  varietiesCache.set(id, promise);
  return promise;
}

async function fetchSpriteFromVarietyUrl(url) {
  if (spriteCache.has(url)) return spriteCache.get(url);
  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`PokeAPI ha risposto ${res.status} per ${url}`);
      return res.json();
    })
    .then((data) => data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default || null);
  spriteCache.set(url, promise);
  return promise;
}

// Ordine di preferenza: X/Y prima della Mega generica (Charizard/Mewtwo
// hanno entrambe le varianti, non ha senso sceglierne una a caso), poi
// Gigamax come fallback per le specie che hanno quello invece della Mega.
const FORM_SUFFIXES = ["-mega-x", "-mega-y", "-mega", "-gmax"];

/**
 * Sprite ufficiale della forma Megaevoluta/Gigamax di una specie, se esiste
 * su PokeAPI — altrimenti null (molte specie non hanno alcuna forma Mega o
 * Gigamax, esattamente come nei giochi originali). Interrogata solo quando
 * `active` è true, per non sprecare chiamate quando Mega non è attivo.
 */
export function useMegaSprite(speciesId, active) {
  const [sprite, setSprite] = useState(null);

  useEffect(() => {
    if (!active || speciesId == null) {
      setSprite(null);
      return;
    }
    let cancelled = false;

    fetchVarieties(speciesId)
      .then((varieties) => {
        for (const suffix of FORM_SUFFIXES) {
          const match = varieties.find((v) => v.pokemon.name.endsWith(suffix));
          if (match) return fetchSpriteFromVarietyUrl(match.pokemon.url);
        }
        return null;
      })
      .then((url) => { if (!cancelled) setSprite(url); })
      .catch(() => { if (!cancelled) setSprite(null); });

    return () => { cancelled = true; };
  }, [speciesId, active]);

  return sprite;
}
