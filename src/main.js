import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { applyStoredTheme } from "./engine/theme.js";

const e = React.createElement;

// Prima del render, così non c'è un flash del tema di default prima che
// quello scelto venga applicato.
applyStoredTheme();

const root = createRoot(document.getElementById("root"));
root.render(e(App));

// Registrazione del Service Worker per il caching offline-first (PokeAPI,
// sprite, librerie CDN e file dell'app — vedi sw.js per la strategia).
// Dopo il render principale e non bloccante: se fallisce (es. browser senza
// supporto, o pagina servita da file:// dove i SW non sono ammessi) il gioco
// funziona comunque, solo senza il beneficio della cache offline.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("[ServiceWorker] Registrazione fallita (il gioco funziona comunque, senza cache offline):", err);
    });
  });
}
