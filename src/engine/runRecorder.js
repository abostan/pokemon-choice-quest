// Registratore di sessione locale: accumula in memoria una traccia
// strutturata di una run reale (bivi mostrati/scelti, incontri, catture,
// battaglie) per poterla esportare come JSON e confrontarla con le
// assunzioni statistiche usate in tests/explorePicker.test.js e nello
// script scripts/analyze-run-log.mjs — es. per verificare se il delta reale
// di choicesCount tra un bivio e l'altro rispecchia la stima usata lì.
//
// Attivo solo in ambiente di sviluppo (stesso criterio di engine/logger.js).
// Non invia nulla altrove finché non lo chiedi tu O finché non giochi
// abbastanza da far scattare il salvataggio automatico (vedi AUTOSAVE_EVERY
// più sotto e i listener beforeunload/visibilitychange in fondo al file).
// Uso manuale da console DevTools, se preferisci:
//   pcqRunLog.save()      -> POST /api/log, salvato da server.mjs in logs/
//   pcqRunLog.download()  -> fallback: dialogo "Salva come" del browser
//                             (utile se non stai usando node server.mjs)

const IS_DEV = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:");

// Un id stabile per l'intera sessione (tab aperta): i salvataggi automatici
// riscrivono sempre lo stesso file logs/pcq-run-log-<sessionId>.json invece
// di crearne uno nuovo ogni volta, altrimenti una sessione lunga con
// autosave periodico produrrebbe decine di file quasi duplicati.
const sessionId = Date.now();
const AUTOSAVE_EVERY = 10; // eventi tra un autosave periodico e l'altro

let events = [];
let enabled = IS_DEV;
let saveInFlight = false;
let dirtySinceSave = false;

export function setRunRecording(on) {
  enabled = !!on;
}

export function isRunRecording() {
  return enabled;
}

function record(type, data) {
  if (!enabled) return;
  events.push({ t: Date.now(), type, ...data });
  dirtySinceSave = true;
  if (events.length % AUTOSAVE_EVERY === 0) saveRunLog({ auto: true });
}

// recordCrossroad viene chiamato dal corpo del render di ExploreSceneContainer
// (un componente senza hook propri, per non introdurre regole di ordine degli
// hook in un file con return condizionali). React può ri-renderizzare lo
// stesso bivio più volte senza che sia un nuovo bivio reale (es. aprendo il
// Pokédex mentre sei fermo lì): dedup alla fonte sull'ultimo bivio registrato,
// così i log restano puliti indipendentemente da quanti render intermedi ci
// sono stati.
let lastCrossroadKey = null;
export function recordCrossroad({ phase, ids, seedInputs }) {
  const key = JSON.stringify({ phase, seedInputs });
  if (key === lastCrossroadKey) return;
  lastCrossroadKey = key;
  record("crossroad_shown", { phase, ids, seedInputs });
}

export function recordChoice({ phase, id }) {
  record("choice_made", { phase, id });
}

export function recordEncounter({ pokemonId, isLegendary, isShiny }) {
  record("encounter", { pokemonId, isLegendary, isShiny });
}

export function recordCapture({ method, chance, success, isLegendary, pokemonId }) {
  record("capture_attempt", { method, chance, success, isLegendary, pokemonId });
}

export function recordBattle({ tactic, winChance, won, opponentTitle }) {
  record("battle", { tactic, winChance, won, opponentTitle });
}

export function getRunLog() {
  return events;
}

export function clearRunLog() {
  events = [];
}

export function downloadRunLog(filename) {
  try {
    const name = filename || `pcq-run-log-${Date.now()}.json`;
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.warn("[runRecorder] Impossibile esportare il log:", err);
  }
}

// Invia il log a server.mjs (POST /api/log?session=<sessionId>), che lo
// scrive in logs/pcq-run-log-<sessionId>.json — lo stesso file per tutta la
// sessione, sovrascritto ad ogni salvataggio (automatico o manuale) così una
// sessione lunga con autosave periodico non produce decine di file quasi
// duplicati.
// `auto: true` (usato dagli autosave interni) fallisce in silenzio con un
// solo warning se il server non risponde, invece di aprire un dialogo di
// download del browser ad ogni evento — fastidioso se si sta ancora usando
// `npx serve .` invece di `node server.mjs`. Una chiamata manuale
// (pcqRunLog.save()) ripiega invece su download().
export async function saveRunLog({ auto = false } = {}) {
  if (saveInFlight) return null;
  saveInFlight = true;
  try {
    const res = await fetch(`/api/log?session=${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events),
    });
    if (!res.ok) throw new Error(`risposta ${res.status}`);
    const { filename } = await res.json();
    dirtySinceSave = false;
    if (!auto) console.log(`[runRecorder] Log salvato in logs/${filename}`);
    return filename;
  } catch (err) {
    if (auto) {
      console.warn("[runRecorder] Autosave fallito (stai usando `node server.mjs`? vedi `npm start`). Riproverà al prossimo evento.", err);
    } else {
      console.warn("[runRecorder] Impossibile salvare sul server (stai usando `node server.mjs`?). Uso pcqRunLog.download() come alternativa.", err);
      downloadRunLog();
    }
    return null;
  } finally {
    saveInFlight = false;
  }
}

// Salvataggio best-effort quando si lascia/nasconde la pagina (cambio scheda,
// chiusura, refresh): fetch() può venire interrotto a metà durante l'unload,
// quindi qui usiamo sendBeacon, pensato apposta per questo caso — consegna
// il payload in background senza bloccare la navigazione.
function flushOnExit() {
  if (!enabled || !dirtySinceSave || events.length === 0) return;
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
  const blob = new Blob([JSON.stringify(events)], { type: "application/json" });
  navigator.sendBeacon(`/api/log?session=${sessionId}`, blob);
  dirtySinceSave = false;
}

if (IS_DEV && typeof window !== "undefined") {
  window.pcqRunLog = {
    get: getRunLog,
    clear: clearRunLog,
    download: downloadRunLog,
    save: saveRunLog,
    enable: () => setRunRecording(true),
    disable: () => setRunRecording(false),
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushOnExit();
  });
  window.addEventListener("pagehide", flushOnExit);
}
