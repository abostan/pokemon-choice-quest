// Logger Diagnostico per Pokémon: Scegli il Cammino
// Fornisce log strutturati in console DevTools con badge colorati per fase e battaglie.

const IS_DEV = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:");

export const logger = {
  info(category, message, extra = null) {
    if (!IS_DEV) return;
    const style = "background: #2563eb; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;";
    if (extra) {
      console.log(`%cPCQ | ${category.toUpperCase()}`, style, message, extra);
    } else {
      console.log(`%cPCQ | ${category.toUpperCase()}`, style, message);
    }
  },

  stateTransition(fromPhase, toPhase, patch = null) {
    if (!IS_DEV) return;
    const style = "background: #7c3aed; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;";
    console.log(`%cPCQ | PHASE`, style, `${fromPhase} ➔ ${toPhase}`, patch || "");
  },

  battle(tactic, winChance, won) {
    if (!IS_DEV) return;
    const badgeColor = won ? "#16a34a" : "#dc2626";
    const style = `background: ${badgeColor}; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;`;
    const percent = Math.round(winChance * 100);
    console.log(`%cPCQ | BATTLE`, style, `Tattica: ${tactic} | Prob. Vittoria: ${percent}% | Esito: ${won ? "VITTORIA 🎉" : "SCONFITTA 💀"}`);
  },

  save(slotId, action) {
    if (!IS_DEV) return;
    const style = "background: #059669; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;";
    console.log(`%cPCQ | SAVE`, style, `Slot ${slotId}: ${action}`);
  },

  warn(category, message, extra = null) {
    const style = "background: #d97706; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;";
    console.warn(`%cPCQ | WARNING`, style, `[${category}] ${message}`, extra || "");
  },

  error(category, message, err = null) {
    const style = "background: #dc2626; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;";
    console.error(`%cPCQ | ERROR`, style, `[${category}] ${message}`, err || "");
  },
};
