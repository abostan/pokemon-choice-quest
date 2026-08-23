// Motore puro (nessuna dipendenza da React, nessun Math.random()) per la
// selezione deterministica delle opzioni mostrate ai bivi di esplorazione.
// Isolato qui per poter essere testato senza montare componenti React e per
// prevenire regressioni come il seed a bassa entropia che faceva ripetere
// identici gli stessi bivi per intere run (vedi tests/explorePicker.test.js).

// Finalizzatore a 32 bit stile splitmix/murmur: a differenza di un singolo
// passo di LCG, rimescola bene anche input che differiscono di poco (come i
// seed generati da computeExploreSeed, che avanzano a passi fissi) — senza
// questo, seed vicini producevano output troppo simili tra loro e certi
// bivi si ripetevano identici molto più spesso del previsto.
function mix32(x) {
  x = (x ^ (x >>> 16)) >>> 0;
  x = Math.imul(x, 0x7feb352d) >>> 0;
  x = (x ^ (x >>> 15)) >>> 0;
  x = Math.imul(x, 0x846ca68b) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  return x >>> 0;
}

// Hash FNV-1a sull'intera stringa (non solo il primo carattere, che faceva
// collidere id con la stessa iniziale — es. "fireZone"/"fightingZone"/"fish"
// — impedendo loro di riordinarsi mai tra loro).
function stringHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function seededRandom(seed, extra) {
  return mix32((seed + extra * 2654435761) | 0) / 4294967296;
}

function hashSort(ids, seed) {
  return [...ids].sort((a, b) => {
    const ha = mix32((stringHash(a) ^ seed) >>> 0);
    const hb = mix32((stringHash(b) ^ seed) >>> 0);
    return ha - hb;
  });
}

/**
 * Seed per i bivi dell'esplorazione principale (pre-postgame). Include
 * choicesCount (che avanza ad ogni transizione di stato, vedi useGameState
 * goTo()) apposta: senza di esso il seed dipende solo da gymIndex/badges,
 * che restano fissi per l'intera durata di una palestra, facendo ripetere
 * lo stesso identico terzetto di opzioni ad ogni visita.
 */
export function computeExploreSeed({ gymIndex = 0, badgesCount = 0, choicesCount = 0 } = {}) {
  return gymIndex * 1013 + badgesCount * 37 + choicesCount * 151 + 7;
}

export function computePostgameSeed({ postgameRound = 0 } = {}) {
  return postgameRound * 1013 + 7;
}

/**
 * Sceglie deterministicamente fino a `count` id da `weightedItems`
 * ([{id, weight}]) in base al seed: ogni id, nell'ordine dato da un
 * hash-sort deterministico, viene incluso se un valore pseudo-casuale
 * (ma riproducibile) è sotto il suo peso. Se meno di `count` superano la
 * soglia, il resto viene riempito con i successivi dell'ordine mescolato,
 * cosicché il risultato ha sempre length === min(count, weightedItems.length).
 */
export function pickWeightedIds(weightedItems, seed, count) {
  const weightById = new Map(weightedItems.map((o) => [o.id, o.weight]));
  const shuffled = hashSort(weightedItems.map((o) => o.id), seed);

  const picked = [];
  let extraSeed = 0;
  for (const id of shuffled) {
    extraSeed++;
    if (seededRandom(seed, extraSeed) < weightById.get(id)) {
      picked.push(id);
      if (picked.length >= count) break;
    }
  }
  if (picked.length < count) {
    for (const id of shuffled) {
      if (!picked.includes(id)) {
        picked.push(id);
        if (picked.length >= count) break;
      }
    }
  }
  return picked;
}

/**
 * Sceglie i primi `count` id di `ids` dopo un hash-sort deterministico
 * (usato per il pool speciale post-game, che non ha pesi propri).
 */
export function pickTopIds(ids, seed, count) {
  return hashSort(ids, seed).slice(0, count);
}
