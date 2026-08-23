// Sistema di achievement/trofei, persistito in localStorage e globale al
// browser (come la Sala della Fama storica) — sono traguardi sull'insieme
// delle run giocate, non sullo stato di una singola partita.

import { GENERATIONS } from "../data/generations.js";

const STORAGE_KEY = "pcq_achievements";

const GENERAL_ACHIEVEMENTS = {
  firstCapture: {
    id: "firstCapture",
    icon: "🎯",
    title: "Primo Passo da Allenatore",
    description: "Cattura il tuo primo Pokémon.",
  },
  firstEvolution: {
    id: "firstEvolution",
    icon: "🦋",
    title: "Metamorfosi",
    description: "Fai evolvere per la prima volta un Pokémon della tua squadra.",
  },
  firstGymBadge: {
    id: "firstGymBadge",
    icon: "🏅",
    title: "Prima Medaglia",
    description: "Sconfiggi il tuo primo Capopalestra.",
  },
  allGymsCleared: {
    id: "allGymsCleared",
    icon: "🥇",
    title: "Maestro delle Palestre",
    description: "Sconfiggi tutti i Capipalestra di una regione.",
  },
  firstChampion: {
    id: "firstChampion",
    icon: "🏆",
    title: "Campione della Lega",
    description: "Sconfiggi il Campione e completa la tua prima regione.",
  },
  legendaryCollector: {
    id: "legendaryCollector",
    icon: "🐉",
    title: "Collezionista di Leggende",
    description: "Cattura almeno un Pokémon leggendario in ciascuna delle 9 regioni, nella stessa run.",
  },
  firstMasterBall: {
    id: "firstMasterBall",
    icon: "🟣",
    title: "Cattura Garantita",
    description: "Ottieni la tua prima Master Ball.",
  },
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
  pokedexComplete: {
    id: "pokedexComplete",
    icon: "📕",
    title: "Maestro del Pokédex",
    description: "Cattura 151 specie diverse, in tutte le tue run su questo browser.",
  },
};

// Achievement per-regione: 4 categorie generate automaticamente per ognuna
// delle 9 regioni in GENERATIONS, invece di 36 voci scritte a mano — se una
// nuova regione viene aggiunta a generations.js, i suoi 4 trofei compaiono
// da soli senza toccare questo file.
const REGION_CATEGORIES = [
  {
    key: "gyms",
    icon: "🥇",
    label: "Maestro delle Palestre",
    description: (gen) => `Sconfiggi tutti i Capipalestra di ${gen.name}.`,
  },
  {
    key: "champion",
    icon: "🏆",
    label: "Campione",
    description: (gen) => `Sconfiggi il Campione della Lega di ${gen.name}.`,
  },
  {
    key: "legendary",
    icon: "🐉",
    label: "Leggenda",
    description: (gen) => `Cattura un Pokémon leggendario di ${gen.name}.`,
  },
  {
    key: "villain",
    icon: "🕵️",
    label: "Nemesi",
    description: (gen) => `Sconfiggi ${gen.villainBoss?.title || "il boss del team nemico"} a ${gen.name}.`,
  },
];

/** Costruisce l'id di un achievement per-regione (usato anche dai call-site che li sbloccano). */
export function regionAchievementId(categoryKey, generationId) {
  return `${categoryKey}_${generationId}`;
}

const REGION_ACHIEVEMENTS = {};
export const REGION_ACHIEVEMENT_GROUPS = GENERATIONS.map((gen) => {
  const achievements = REGION_CATEGORIES.map((cat) => {
    const entry = {
      id: regionAchievementId(cat.key, gen.id),
      icon: cat.icon,
      title: `${cat.label} — ${gen.name}`,
      description: cat.description(gen),
    };
    REGION_ACHIEVEMENTS[entry.id] = entry;
    return entry;
  });
  return { genId: gen.id, genName: gen.name, achievements };
});

export const GENERAL_ACHIEVEMENT_LIST = Object.values(GENERAL_ACHIEVEMENTS);
export const ACHIEVEMENTS = { ...GENERAL_ACHIEVEMENTS, ...REGION_ACHIEVEMENTS };

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

// Notifica chi vuole mostrare un toast quando un achievement viene sbloccato
// per la prima volta — disaccoppia unlockAchievement() (chiamato da vari
// hook/componenti sparsi nel gioco) dal componente che lo visualizza, senza
// dover passare callback in giro.
let unlockListeners = [];

export function onAchievementUnlocked(callback) {
  unlockListeners.push(callback);
  return () => {
    unlockListeners = unlockListeners.filter((l) => l !== callback);
  };
}

/**
 * Sblocca un achievement se non lo era già.
 * @returns {boolean} true se sbloccato ORA da questa chiamata, false se
 * era già sbloccato in precedenza (o l'id non esiste).
 */
export function unlockAchievement(id) {
  const achievement = ACHIEVEMENTS[id];
  if (!achievement) return false;
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
  unlockListeners.forEach((l) => l(achievement));
  return true;
}
