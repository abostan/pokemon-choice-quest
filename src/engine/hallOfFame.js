// Gestione della persistenza della Sala della Fama (Hall of Fame) in localStorage.

const HOF_STORAGE_KEY = "pcq_hall_of_fame";

/**
 * Restituisce l'elenco delle squadre iscritte nella Sala della Fama.
 * @returns {Array<{ id: string, genName: string, timestamp: string, team: Array<{id: number, level: number, isShiny?: boolean}>, isNuzlocke?: boolean }>}
 */
export function getHallOfFame() {
  try {
    const raw = localStorage.getItem(HOF_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Errore durante la lettura della Sala della Fama:", e);
    return [];
  }
}

/**
 * Aggiunge un nuovo trionfo alla Sala della Fama.
 * @param {{ genName: string, team: Array<{id: number, level: number, isShiny?: boolean}>, isNuzlocke?: boolean }} entry
 */
export function addHallOfFameEntry({ genName, team, isNuzlocke = false }) {
  try {
    const current = getHallOfFame();
    const newEntry = {
      id: `hof_${Date.now()}`,
      genName: genName || "Lega Pokémon",
      timestamp: new Date().toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      team: team ? team.map((p) => ({ id: p.id, level: p.level, isShiny: !!p.isShiny })) : [],
      isNuzlocke: !!isNuzlocke,
    };
    const updated = [newEntry, ...current];
    localStorage.setItem(HOF_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Errore durante il salvataggio nella Sala della Fama:", e);
    return [];
  }
}

/**
 * Svuota la Sala della Fama.
 */
export function clearHallOfFame() {
  try {
    localStorage.removeItem(HOF_STORAGE_KEY);
  } catch (e) {
    console.error("Errore durante la cancellazione della Sala della Fama:", e);
  }
}
