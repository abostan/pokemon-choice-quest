// Gestione del salvataggio della partita in corso su localStorage.
// Nessuna dipendenza da React — modulo puro, facile da testare.

const SAVE_KEY = "pcq_save_v1";
const SAVE_VERSION = 1;

// Campi dello state che NON vanno salvati (stato transiente della scena corrente)
const SKIP_FIELDS = ["pendingEncounterPool", "pendingEncounterLevel", "pokedexOpen", "pendingEvolutions"];

/**
 * Serializza e salva lo stato di gioco su localStorage.
 * @param {object} state - Lo stato React completo dell'app
 */
export function saveGame(state) {
  try {
    const toSave = {};
    for (const [key, value] of Object.entries(state)) {
      if (!SKIP_FIELDS.includes(key)) {
        toSave[key] = value;
      }
    }
    const payload = {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      state: toSave,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("[saveGame] Impossibile salvare:", err);
  }
}

/**
 * Carica e valida il salvataggio da localStorage.
 * @returns {{ state: object, savedAt: string } | null}
 */
export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload || payload.version !== SAVE_VERSION || !payload.state) return null;
    // Validazione minima: deve avere una fase e una generazione
    if (!payload.state.phase || !payload.state.generationId) return null;
    return { state: payload.state, savedAt: payload.savedAt };
  } catch (err) {
    console.warn("[loadGame] Salvataggio corrotto, ignorato:", err);
    return null;
  }
}

/**
 * Restituisce true se esiste un salvataggio valido.
 */
export function hasSave() {
  return loadGame() !== null;
}

/**
 * Rimuove il salvataggio da localStorage.
 */
export function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.warn("[deleteSave] Errore nella rimozione:", err);
  }
}

// --- Pokédex storico ---

const POKEDEX_KEY = "pcq_pokedex_historic";

/**
 * Aggiunge una specie allo storico del Pokédex su localStorage.
 * @param {number} pokemonId
 * @param {boolean} caught - true se catturato, false se solo visto
 */
export function updateHistoricPokedex(pokemonId, caught) {
  try {
    const raw = localStorage.getItem(POKEDEX_KEY);
    const historic = raw ? JSON.parse(raw) : {};
    const existing = historic[pokemonId] || {};
    historic[pokemonId] = {
      seen: true,
      caught: caught || existing.caught || false,
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
 * @returns {object} mappa { [pokemonId]: { seen, caught, firstSeen, firstCaught } }
 */
export function loadHistoricPokedex() {
  try {
    const raw = localStorage.getItem(POKEDEX_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
