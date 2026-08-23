// Gestione del salvataggio multi-slot e Pokédex storico su localStorage.
// Nessuna dipendenza da React — modulo puro, facile da testare.

import { sanitizeGameState } from "./saveSanitizer.js";

const SAVE_VERSION = 1;
const DEFAULT_SLOTS = [1, 2, 3, 4, 5];

// Campi dello state che NON vanno salvati (stato transiente della scena corrente)
const SKIP_FIELDS = ["pendingEncounterPool", "pendingEncounterLevel", "pokedexOpen", "pendingEvolutions", "boxModalOpen"];

function getSlotKey(slotId = 1) {
  return `pcq_save_slot_${slotId}`;
}

/**
 * Serializza e salva lo stato di gioco su uno specifico slot in localStorage.
 * @param {object} state - Lo stato React dell'app
 * @param {number} slotId - Indice dello slot (1-5)
 */
export function saveGame(state, slotId = 1) {
  try {
    const toSave = {};
    for (const [key, value] of Object.entries(state)) {
      if (!SKIP_FIELDS.includes(key)) {
        toSave[key] = value;
      }
    }
    const payload = {
      version: SAVE_VERSION,
      slotId,
      savedAt: new Date().toISOString(),
      state: toSave,
    };
    localStorage.setItem(getSlotKey(slotId), JSON.stringify(payload));
  } catch (err) {
    console.warn(`[saveGame] Impossibile salvare sullo slot ${slotId}:`, err);
  }
}

/**
 * Carica e valida il salvataggio da uno specifico slot in localStorage.
 * Supporta la retro-compatibilità con il vecchio pcq_save_v1.
 * @param {number} slotId - Indice dello slot (1-5)
 * @returns {{ state: object, savedAt: string, slotId: number } | null}
 */
export function loadGame(slotId = 1) {
  try {
    const key = getSlotKey(slotId);
    let raw = localStorage.getItem(key);

    // Retro-compatibilità: se lo slot 1 è vuoto ma esiste il vecchio pcq_save_v1, usiamo quello
    if (!raw && slotId === 1) {
      raw = localStorage.getItem("pcq_save_v1");
    }

    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload || payload.version !== SAVE_VERSION || !payload.state) return null;
    
    const sanitized = sanitizeGameState(payload.state);
    if (!sanitized || !sanitized.generationId) return null;

    return { state: sanitized, savedAt: payload.savedAt, slotId };
  } catch (err) {
    console.warn(`[loadGame] Salvataggio corrotto nello slot ${slotId}, ignorato:`, err);
    return null;
  }
}

/**
 * Carica le informazioni riassuntive di tutti gli slot per la ResumeScreen.
 * @returns {Array<{ slotId: number, data: object|null }>}
 */
export function loadAllSlots() {
  return DEFAULT_SLOTS.map((slotId) => ({
    slotId,
    data: loadGame(slotId),
  }));
}

/**
 * Restituisce true se esiste un salvataggio valido nello slot indicato (o in uno qualsiasi se non specificato).
 */
export function hasSave(slotId = null) {
  if (slotId != null) return loadGame(slotId) !== null;
  return DEFAULT_SLOTS.some((id) => loadGame(id) !== null);
}

/**
 * Rimuove il salvataggio dallo slot indicato in localStorage.
 */
export function deleteSave(slotId = 1) {
  try {
    localStorage.removeItem(getSlotKey(slotId));
    if (slotId === 1) localStorage.removeItem("pcq_save_v1");
  } catch (err) {
    console.warn(`[deleteSave] Errore nella rimozione slot ${slotId}:`, err);
  }
}

/**
 * Genera una stringa JSON scaricabile per il backup dello slot indicato.
 */
export function exportSlotJSON(slotId = 1) {
  const loaded = loadGame(slotId);
  if (!loaded) return null;
  return JSON.stringify(loaded, null, 2);
}

/**
 * Ripristina un salvataggio da una stringa JSON caricata dall'utente.
 */
export function importSlotJSON(slotId, jsonString) {
  try {
    const payload = JSON.parse(jsonString);
    if (!payload || !payload.state || !payload.state.generationId) {
      throw new Error("Formato del salvataggio JSON non valido.");
    }
    const toSave = {
      version: SAVE_VERSION,
      slotId,
      savedAt: payload.savedAt || new Date().toISOString(),
      state: payload.state,
    };
    localStorage.setItem(getSlotKey(slotId), JSON.stringify(toSave));
    return true;
  } catch (err) {
    console.warn("[importSlotJSON] Errore nell'importazione:", err);
    return false;
  }
}

// --- Pokédex storico ---

const POKEDEX_KEY = "pcq_pokedex_historic";

/**
 * Aggiunge una specie allo storico del Pokédex su localStorage.
 * @param {number} pokemonId
 * @param {boolean} caught - true se catturato, false se solo visto
 * @param {boolean} isShiny - true se catturato in versione Shiny
 */
export function updateHistoricPokedex(pokemonId, caught, isShiny = false) {
  try {
    const raw = localStorage.getItem(POKEDEX_KEY);
    const historic = raw ? JSON.parse(raw) : {};
    const existing = historic[pokemonId] || {};
    historic[pokemonId] = {
      seen: true,
      caught: caught || existing.caught || false,
      shiny: isShiny || existing.shiny || false,
      firstSeen: existing.firstSeen || new Date().toISOString(),
      firstCaught: caught && !existing.firstCaught ? new Date().toISOString() : (existing.firstCaught || null),
    };
    localStorage.setItem(POKEDEX_KEY, JSON.stringify(historic));
  } catch (err) {
    console.warn("[updateHistoricPokedex] Errore:", err);
  }
}

/**
 * Legge il Pokédex storico da localStorage.
 * @returns {object} mappa { [pokemonId]: { seen, caught, shiny, firstSeen, firstCaught } }
 */
export function loadHistoricPokedex() {
  try {
    const raw = localStorage.getItem(POKEDEX_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
