// Server di sviluppo locale, zero dipendenze npm (solo moduli built-in di
// Node). Sostituisce "npx serve ." con due responsabilità:
//   1. servire i file statici del progetto esattamente come prima
//   2. accettare POST /api/log per salvare i log di sessione esportati da
//      src/engine/runRecorder.js direttamente nella cartella logs/ del
//      progetto, invece di passare dal dialogo "Salva come" del browser.
//
// Resta in ascolto solo su localhost: scrive file su disco in risposta a
// richieste HTTP, quindi non deve mai essere esposto in rete.

import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.join(ROOT, "logs");
const PORT = Number(process.env.PORT) || 3000;
const MAX_LOG_BYTES = 10 * 1024 * 1024; // 10MB, generoso per un log di sessione

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
};

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");

  // Protezione path traversal: il file risolto deve restare dentro ROOT.
  const filePath = path.normalize(path.join(ROOT, relative));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      // Server di sviluppo: mai far mettere in cache i file dal browser, o
      // una modifica al codice può restare invisibile finché non si fa un
      // hard refresh manuale (successo con soundEngine.js: EvolutionNotice.js
      // aggiornato importava un export non ancora presente nella versione
      // di soundEngine.js servita dalla cache del browser).
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    res.end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}

async function handleSaveLog(req, res) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_LOG_BYTES) {
      res.writeHead(413).end("Log troppo grande");
      return;
    }
    chunks.push(chunk);
  }

  let events;
  try {
    events = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  } catch {
    res.writeHead(400).end("JSON non valido");
    return;
  }

  // ?session=<id> (impostato una volta per tab da runRecorder.js) fa sì che
  // tutti i salvataggi della stessa sessione (autosave periodico, uscita
  // dalla pagina, save manuale) riscrivano lo stesso file invece di
  // crearne uno nuovo ogni volta. Solo cifre ammesse: il valore finisce nel
  // nome del file, va sanificato.
  const sessionParam = new URL(req.url, "http://localhost").searchParams.get("session");
  const session = sessionParam && /^\d+$/.test(sessionParam) ? sessionParam : Date.now();

  if (!existsSync(LOGS_DIR)) await mkdir(LOGS_DIR, { recursive: true });
  const filename = `pcq-run-log-${session}.json`;
  await writeFile(path.join(LOGS_DIR, filename), JSON.stringify(events, null, 2), "utf-8");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, filename }));
}

const server = createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  if (req.method === "POST" && pathname === "/api/log") {
    handleSaveLog(req, res).catch((err) => {
      console.error("[server] Errore salvando il log:", err);
      res.writeHead(500).end("Errore interno");
    });
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Pokémon: Scegli il Cammino — http://localhost:${PORT}`);
  console.log(`I log di sessione (pcqRunLog.save() dalla console) verranno salvati in ${LOGS_DIR}`);
});
