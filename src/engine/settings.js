// Impostazioni di gioco persistite in localStorage, globali al browser
// (non legate ad uno slot di salvataggio specifico) — stesso criterio già
// usato per il mute audio in soundEngine.js.

const SHINY_RATE_KEY = "pcq_shiny_rate_mode";

// Il moltiplicatore leggendario (rispetto al tasso "normal") era 25x — pensato
// quando un incontro leggendario era raro di per sé (Fase 12 di ROADMAP.md:
// prima del fix sulla frequenza, il roll ambientale scattava solo per 6 dei
// ~19 bivi post-game). Dopo aver reso il roll leggendario un "interrupt" che
// tenta dopo ogni azione post-game, lo stesso moltiplicatore produceva più
// Shiny leggendari che normali in assoluto — segnalato da un giocatore
// reale. Sceso a 5x: i leggendari restano notevolmente più spesso Shiny
// *quando incontrati* rispetto a un Pokémon normale, ma non dominano più il
// conteggio grezzo degli Shiny solo perché ora compaiono più spesso.
export const SHINY_RATE_MODES = {
  default: { label: "Default (1/500)", normal: 0.002, legendary: 0.01 },
  increased: { label: "Aumentato (1/100)", normal: 0.01, legendary: 0.05 },
  off: { label: "Disattivato", normal: 0, legendary: 0 },
};

export function getShinyRateMode() {
  try {
    const stored = localStorage.getItem(SHINY_RATE_KEY);
    return SHINY_RATE_MODES[stored] ? stored : "default";
  } catch {
    return "default";
  }
}

export function setShinyRateMode(mode) {
  if (!SHINY_RATE_MODES[mode]) return;
  try {
    localStorage.setItem(SHINY_RATE_KEY, mode);
  } catch {
    // localStorage non disponibile (es. modalità privata): la modalità resta
    // valida solo per la sessione corrente — non grave quanto perdere un
    // salvataggio vero e proprio, coerente con lo stesso trade-off già
    // documentato in achievements.js/saveGame.js.
  }
}

/**
 * Probabilità (0..1) che un incontro sia Shiny, secondo l'impostazione
 * attuale del tasso di Shiny.
 */
export function getShinyChance(isLegendary) {
  const mode = SHINY_RATE_MODES[getShinyRateMode()];
  return isLegendary ? mode.legendary : mode.normal;
}
