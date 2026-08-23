// Temi visivi personalizzabili (vedi ROADMAP.md Fase 5). Ogni tema è un
// blocco `:root[data-theme="X"]` in styles.css che sovrascrive le stesse
// custom property già usate in tutto il gioco — nessun componente ha
// bisogno di sapere quale tema è attivo. Persistenza globale in
// localStorage, stesso criterio di audio/shiny/achievement.

const THEME_KEY = "pcq_theme";

export const THEMES = [
  { id: "default", label: "🌌 Dark Classic (default)" },
  { id: "synthwave", label: "🌆 Dark Synthwave" },
  { id: "gameboy", label: "🎮 Retro GameBoy Green" },
  { id: "emerald", label: "💚 Classic Emerald" },
  { id: "cyberpunk", label: "🤖 Cyberpunk" },
];

const THEME_IDS = new Set(THEMES.map((t) => t.id));

export function getTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return THEME_IDS.has(stored) ? stored : "default";
}

/**
 * Applica il tema al documento (attributo data-theme sulla radice) e lo
 * persiste. Chiamata sia all'avvio (applyStoredTheme) sia dal selettore
 * nelle Impostazioni per il cambio a caldo.
 */
export function setTheme(id) {
  if (!THEME_IDS.has(id)) return;
  localStorage.setItem(THEME_KEY, id);
  applyThemeAttribute(id);
}

function applyThemeAttribute(id) {
  if (id === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", id);
  }
}

/** Da chiamare una volta all'avvio, prima del primo render. */
export function applyStoredTheme() {
  applyThemeAttribute(getTheme());
}
