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

async function hasMegaOrGmaxVariety(id) {
  const varieties = await fetchVarieties(id);
  return FORM_SUFFIXES.some((suffix) => varieties.some((v) => v.pokemon.name.endsWith(suffix)));
}

/**
 * Insieme (Set) degli id specie in squadra che hanno davvero una forma
 * Mega/Gigamax su PokeAPI — interrogato sempre (non solo quando Mega è già
 * attivo, a differenza di useMegaSprite sopra), per poter mostrare/nascondere
 * il bottone Mega PRIMA che il giocatore lo attivi (vedi ROADMAP.md Fase 7:
 * prima il bottone era sempre disponibile per qualunque squadra). Stessa
 * fonte dati e stessa cache di useMegaSprite, quindi nessuna richiesta
 * doppia se poi Mega viene davvero attivato.
 *
 * `ready` diventa true solo a fetch completato: usarlo per evitare di
 * mostrare per un istante "nessun Pokémon Mega-capace" prima ancora di
 * saperlo davvero (falso negativo temporaneo durante il caricamento).
 * @returns {{ capableIds: Set<number>, ready: boolean }}
 */
export function useTeamMegaCapability(team) {
  const ids = (team || []).map((p) => p.id).filter((id) => id != null);
  const key = ids.join(",");
  const [capableIds, setCapableIds] = useState(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    if (ids.length === 0) {
      setCapableIds(new Set());
      setReady(true);
      return;
    }
    let cancelled = false;

    Promise.all(
      ids.map((id) =>
        hasMegaOrGmaxVariety(id)
          .then((isCapable) => (isCapable ? id : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setCapableIds(new Set(results.filter((id) => id != null)));
      setReady(true);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { capableIds, ready };
}
