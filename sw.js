// Service Worker per il caching offline-first del gioco.
//
// Strategia runtime (non un elenco statico di file da precaricare): questo
// progetto non usa un bundler, quindi la app è composta da decine di moduli
// ES separati (vedi index.html) — un manifest scritto a mano andrebbe
// aggiornato ad ogni nuovo file e si romperebbe silenziosamente ad ogni
// dimenticanza. Invece, ogni richiesta osservata viene messa in cache al
// volo: dopo una prima visita online, tutto ciò che è stato effettivamente
// caricato resta disponibile offline. È il comportamento standard atteso
// per un Service Worker (prima visita online necessaria, poi offline).
//
// Due strategie diverse per due tipi di richieste:
//  - PokeAPI / sprite / CDN esm.sh (dati e librerie che cambiano di rado):
//    cache-first — azzera le chiamate di rete ripetute e garantisce
//    caricamenti istantanei anche online.
//  - File statici dello stesso dominio (il codice dell'app): network-first
//    con fallback alla cache — così le modifiche fatte durante lo sviluppo
//    restano visibili subito quando la rete c'è (coerente con l'header
//    "Cache-Control: no-cache" già impostato in server.mjs per evitare la
//    classe di bug vista in v8.6, dove una vecchia versione cachata di un
//    file mascherava una modifica più recente), con la cache usata solo
//    quando la rete non risponde (offline).

const CACHE_VERSION = "v1";
const APP_CACHE = `pcq-app-${CACHE_VERSION}`;
const API_CACHE = `pcq-api-${CACHE_VERSION}`;

const CACHED_HOSTS = new Set(["pokeapi.co", "raw.githubusercontent.com", "esm.sh"]);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== APP_CACHE && key !== API_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return; // non intercettare POST (es. /api/log dei run recorder)

  const url = new URL(event.request.url);

  if (CACHED_HOSTS.has(url.hostname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(event.request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(API_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    // Offline e mai cachato prima: non c'è nulla da servire.
    throw err;
  }
}

async function networkFirst(request) {
  const cache = await caches.open(APP_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}
