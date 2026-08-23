// Stub minimale di localStorage per i test in Node (`node --test` non lo
// fornisce nativamente, a differenza di un vero browser) — copre solo i
// metodi usati dai moduli engine/*.js che persistono su localStorage
// (getHighScore/saveHighScore in scoreLogic.js, achievements.js,
// hallOfFame.js...). Non un file *.test.js: vive in tests/helpers/ apposta,
// fuori dal glob `tests/*.test.js` di `npm test`.
//
// NOTA: `node --test` esegue ogni file di test in un processo isolato, quindi
// installare lo stub non fa "trapelare" stato tra file diversi — ma i test
// all'interno dello STESSO file condividono lo stesso globalThis, quindi
// vanno puliti esplicitamente (storage.clear()) quando serve uno stato pulito.

export function installLocalStorageStub() {
  const storage = {
    _map: new Map(),
    getItem(key) {
      return storage._map.has(key) ? storage._map.get(key) : null;
    },
    setItem(key, value) {
      storage._map.set(key, String(value));
    },
    removeItem(key) {
      storage._map.delete(key);
    },
    clear() {
      storage._map.clear();
    },
  };
  globalThis.localStorage = storage;
  return storage;
}

/**
 * Sostituisce temporaneamente globalThis.localStorage con uno che lancia
 * sempre un'eccezione — per esercitare i rami di fallback try/catch che
 * gestiscono localStorage non disponibile (es. modalità privata del
 * browser). Esegue `fn()` con lo stub rotto attivo, poi ripristina sempre
 * quello precedente (anche se `fn()` lancia), indipendentemente dall'ordine
 * in cui i test del file vengono eseguiti.
 */
export function withThrowingLocalStorage(fn) {
  const previous = globalThis.localStorage;
  const boom = () => {
    throw new Error("localStorage non disponibile in questo contesto");
  };
  globalThis.localStorage = { getItem: boom, setItem: boom, removeItem: boom, clear: boom };
  try {
    return fn();
  } finally {
    globalThis.localStorage = previous;
  }
}
