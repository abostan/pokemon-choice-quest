// Sistema di achievement/trofei, persistito in localStorage e globale al
// browser (come la Sala della Fama storica) — sono traguardi sull'insieme
// delle run giocate, non sullo stato di una singola partita.

const STORAGE_KEY = "pcq_achievements";

export const ACHIEVEMENTS = {
  firstShiny: {
    id: "firstShiny",
    icon: "🌟",
    title: "Luccichio Epico",
    description: "Cattura il tuo primo Pokémon Shiny.",
  },
  nuzlockeMaster: {
    id: "nuzlockeMaster",
    icon: "👑",
    title: "Master Nuzlocke",
    description: "Completa una regione in modalità Nuzlocke senza perdere l'intera squadra.",
  },
  silverMountain: {
    id: "silverMountain",
    icon: "🌋",
    title: "Monte Argento",
    description: "Sconfiggi Rosso Leggendario nel post-game.",
  },
  grandMaster: {
    id: "grandMaster",
    icon: "🌍",
    title: "Gran Maestro dei Continenti",
    description: "Conquista tutte e 9 le regioni in una sola run.",
  },
};

function loadUnlocked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getUnlockedAchievements() {
  return loadUnlocked();
}

export function isAchievementUnlocked(id) {
  return !!loadUnlocked()[id];
}

/**
 * Sblocca un achievement se non lo era già.
 * @returns {boolean} true se sbloccato ORA da questa chiamata, false se
 * era già sbloccato in precedenza (o l'id non esiste).
 */
export function unlockAchievement(id) {
  if (!ACHIEVEMENTS[id]) return false;
  const unlocked = loadUnlocked();
  if (unlocked[id]) return false;
  unlocked[id] = { unlockedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
  } catch {
    // localStorage non disponibile: l'achievement risulterà sbloccato solo
    // per questa sessione, ricontrollato (e magari ri-notificato) al prossimo
    // avvio — non è grave quanto perdere dati di salvataggio veri e propri.
  }
  return true;
}
