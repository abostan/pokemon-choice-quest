import React, { useState, useEffect } from "react";
import { PokemonChip } from "./PokemonSprite.js";
import { getHallOfFame, clearHallOfFame } from "../engine/hallOfFame.js";

const e = React.createElement;

/**
 * Modale della Sala della Fama & Hall of Fame Storica.
 *
 * props:
 *  - onClose(): callback per chiudere il modale
 */
export function HallOfFameModal({ onClose }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(getHallOfFame());
  }, []);

  function handleClear() {
    if (window.confirm("Sei sicuro di voler svuotare la Sala della Fama?")) {
      clearHallOfFame();
      setEntries([]);
    }
  }

  return e(
    "div",
    { className: "modal-overlay", onClick: (ev) => { if (ev.target === ev.currentTarget) onClose(); } },
    e(
      "div",
      {
        className: "modal-card HOF-modal",
        style: {
          maxWidth: "760px",
          width: "90%",
          maxHeight: "85vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
          border: "2px solid #fbbf24",
          boxShadow: "0 0 24px rgba(251, 191, 36, 0.3)",
          color: "#f8fafc",
          borderRadius: "16px",
          padding: "24px",
        },
      },

      // Header
      e(
        "div",
        { className: "modal-header", style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(251, 191, 36, 0.3)", paddingBottom: "12px", marginBottom: "16px" } },
        e("h2", { className: "scene-title", style: { margin: 0, color: "#fbbf24", fontSize: "1.5rem" } }, "🏆 Sala della Fama (Hall of Fame)"),
        e("button", { className: "modal-close-btn", onClick: onClose, "aria-label": "Chiudi", style: { background: "none", border: "none", color: "#fbbf24", fontSize: "1.5rem", cursor: "pointer" } }, "✕")
      ),

      e("p", { style: { color: "#cbd5e1", fontSize: "0.92rem", marginBottom: "20px" } }, "Ecco l'albo d'oro delle squadre campioni che hanno trionfato nella Lega Pokémon e sono state incoronate per l'eternità!"),

      entries.length === 0
        ? e(
            "div",
            { style: { textAlign: "center", padding: "40px 20px", color: "#94a3b8" } },
            e("div", { style: { fontSize: "3rem", marginBottom: "12px" } }, "👑"),
            e("p", null, "Nessun Campione ancora registrato."),
            e("p", { style: { fontSize: "0.85rem", color: "#64748b" } }, "Sconfiggi il primo Campione della Lega per iscrivere la tua squadra nella storia!")
          )
        : e(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px" } },
            entries.map((entry) =>
              e(
                "div",
                {
                  key: entry.id,
                  style: {
                    background: "rgba(30, 41, 59, 0.7)",
                    border: "1px solid rgba(251, 191, 36, 0.4)",
                    borderRadius: "12px",
                    padding: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  },
                },
                e(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" } },
                  e(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "8px" } },
                    e("span", { style: { fontSize: "1.2rem" } }, "👑"),
                    e("span", { style: { fontWeight: "bold", fontSize: "1.1rem", color: "#fef08a" } }, `Campione di ${entry.genName}`),
                    entry.isNuzlocke && e(
                      "span",
                      { style: { background: "#be123c", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "0.72rem", fontWeight: "bold" } },
                      "💀 NUZLOCKE"
                    )
                  ),
                  e("span", { style: { fontSize: "0.8rem", color: "#94a3b8" } }, entry.timestamp)
                ),
                e(
                  "div",
                  { className: "team-list", style: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" } },
                  entry.team.map((p, idx) =>
                    e(PokemonChip, { key: `${entry.id}-${p.id}-${idx}`, id: p.id, level: p.level, isShiny: p.isShiny })
                  )
                )
              )
            )
          ),

      entries.length > 0 &&
        e(
          "div",
          { style: { display: "flex", justifyContent: "space-between", marginTop: "24px", alignItems: "center" } },
          e("button", { className: "resume-new-btn", style: { background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid #ef4444", padding: "6px 12px", fontSize: "0.85rem" }, onClick: handleClear }, "🗑️ Svuota Sala della Fama"),
          e("button", { className: "continue-btn", onClick: onClose }, "Chiudi")
        )
    )
  );
}
