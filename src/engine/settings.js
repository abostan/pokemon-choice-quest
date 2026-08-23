// Impostazioni di gioco persistite in localStorage, globali al browser
// (non legate ad uno slot di salvataggio specifico) — stesso criterio già
// usato per il mute audio in soundEngine.js.

const SHINY_RATE_KEY = "pcq_shiny_rate_mode";

export const SHINY_RATE_MODES = {
  default: { label: "Default (1/500)", normal: 0.002, legendary: 0.05 },
  increased: { label: "Aumentato (1/100)", normal: 0.01, legendary: 0.25 },
  off: { label: "Disattivato", normal: 0, legendary: 0 },
};

export function getShinyRateMode() {
  const stored = localStorage.getItem(SHINY_RATE_KEY);
  return SHINY_RATE_MODES[stored] ? stored : "default";
}

export function setShinyRateMode(mode) {
  if (!SHINY_RATE_MODES[mode]) return;
  localStorage.setItem(SHINY_RATE_KEY, mode);
}

/**
 * Probabilità (0..1) che un incontro sia Shiny, secondo l'impostazione
 * attuale del tasso di Shiny.
 */
export function getShinyChance(isLegendary) {
  const mode = SHINY_RATE_MODES[getShinyRateMode()];
  return isLegendary ? mode.legendary : mode.normal;
}
