import React from "react";

const e = React.createElement;

/**
 * Schermata di Game Over per la Modalità Nuzlocke Hardcore.
 *
 * props:
 *  - lastGenName: string
 *  - badgesCount: number
 *  - onRestart(): callback per ricominciare la sfida
 */
export function NuzlockeGameOverScreen({ lastGenName, badgesCount = 0, onRestart }) {
  return e(
    "div",
    {
      className: "panel nuzlocke-gameover-panel",
      style: {
        textAlign: "center",
        padding: "40px 24px",
        background: "linear-gradient(135deg, #450a0a, #0f172a)",
        border: "2px solid #ef4444",
        borderRadius: "16px",
        boxShadow: "0 0 32px rgba(239, 68, 68, 0.4)",
        color: "#fef2f2",
      },
    },
    e("div", { style: { fontSize: "4rem", marginBottom: "8px" } }, "💀"),
    e("h2", { className: "scene-title", style: { color: "#f87171", fontSize: "2rem", marginBottom: "12px" } }, "GAME OVER — SFIDA NUZLOCKE FALLITA"),
    e(
      "p",
      { className: "scene-text", style: { fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 20px auto", color: "#fca5a5" } },
      `Tutti i tuoi Pokémon sono svenuti nella regione di ${lastGenName || "Pokémon"} e non hai più compagni sani per continuare. Il tuo cammino si interrompe qui.`
    ),
    e(
      "div",
      {
        style: {
          background: "rgba(0, 0, 0, 0.4)",
          borderRadius: "12px",
          padding: "16px",
          maxWidth: "400px",
          margin: "0 auto 24px auto",
          border: "1px solid rgba(239, 68, 68, 0.3)",
        },
      },
      e("p", { style: { margin: "4px 0", color: "#e2e8f0" } }, `🏅 Medaglie Conquistate: ${badgesCount}`),
      e("p", { style: { margin: "4px 0", color: "#e2e8f0" } }, `🗺️ Regione Raggiunta: ${lastGenName || "Kanto"}`)
    ),
    e(
      "button",
      {
        className: "continue-btn",
        style: {
          background: "linear-gradient(135deg, #dc2626, #991b1b)",
          color: "#fff",
          fontSize: "1.1rem",
          padding: "12px 28px",
          borderRadius: "8px",
          border: "1px solid #f87171",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)",
        },
        onClick: onRestart,
      },
      "🔄 Riapri un Nuovo Cammino"
    )
  );
}
