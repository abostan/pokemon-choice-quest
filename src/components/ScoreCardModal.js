import React, { useEffect, useState } from "react";
import { computeVictoryScore, getHighScore, saveHighScore } from "../engine/scoreLogic.js";
import { useModalA11y } from "../hooks/useModalA11y.js";

const e = React.createElement;

/**
 * Modale Scheda Punteggio & Grado di Vittoria (Grado S/A/B/C).
 */
export function ScoreCardModal({ gameState, onClose }) {
  const modalRef = useModalA11y(onClose);
  const scoreData = computeVictoryScore(gameState);
  const [highScore, setHighScore] = useState(() => getHighScore());
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    const isNew = saveHighScore(scoreData.totalScore);
    if (isNew) {
      setIsNewRecord(true);
      setHighScore(scoreData.totalScore);
    }
  }, [scoreData.totalScore]);

  const { rank, totalScore, breakdown } = scoreData;

  return e(
    "div",
    { className: "modal-backdrop", onClick: onClose },
    e(
      "div",
      {
        className: "modal-content score-modal",
        onClick: (evt) => evt.stopPropagation(),
        ref: modalRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Punteggio & Grado di Vittoria",
        tabIndex: -1,
        style: {
          background: "linear-gradient(135deg, #1e293b, var(--panel-darker))",
          border: `2px solid ${rank.color}`,
          borderRadius: "16px",
          padding: "24px",
          maxWidth: "520px",
          width: "90%",
          boxShadow: `0 0 30px ${rank.color}40`,
        },
      },

      // Header Modale
      e(
        "div",
        { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
        e("h2", { style: { margin: 0, fontSize: "1.3rem", color: "#fff" } }, "📊 Valutazione & Grado di Vittoria"),
        e(
          "button",
          { className: "modal-close-btn", onClick: onClose, style: { background: "none", border: "none", color: "var(--text-dim)", fontSize: "1.4rem", cursor: "pointer" } },
          "✕"
        )
      ),

      // Banner Trofeo e Grado
      e(
        "div",
        {
          style: {
            textAlign: "center",
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${rank.color}60`,
            marginBottom: "20px",
          },
        },
        e("div", { style: { fontSize: "4rem", marginBottom: "4px" } }, rank.trophy),
        e("div", { style: { fontSize: "1.8rem", fontWeight: "bold", color: rank.color } }, `GRADO ${rank.code}`),
        e("div", { style: { fontSize: "1.1rem", fontWeight: "600", color: "#fff", marginTop: "2px" } }, rank.title),
        e("p", { style: { fontSize: "0.85rem", color: "var(--text-dim)", margin: "8px 0 0 0" } }, rank.description)
      ),

      // Punteggio Totale e Record
      e(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            background: "rgba(0,0,0,0.3)",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center",
          },
        },
        e(
          "div",
          null,
          e("div", { style: { fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase" } }, "Punteggio Corrente"),
          e("div", { style: { fontSize: "1.5rem", fontWeight: "bold", color: "var(--gold)" } }, `${totalScore.toLocaleString()} pt`)
        ),
        e(
          "div",
          null,
          e("div", { style: { fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase" } }, "Record Personale"),
          e(
            "div",
            { style: { fontSize: "1.5rem", fontWeight: "bold", color: isNewRecord ? "var(--success)" : "var(--text-dim)" } },
            `${highScore.toLocaleString()} pt`,
            isNewRecord && e("span", { style: { fontSize: "0.75rem", marginLeft: "4px", color: "var(--success)" } }, "NEW!")
          )
        )
      ),

      // Dettaglio Punti Breakdown
      e("h4", { style: { color: "var(--text-dim)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "10px" } }, "Dettaglio Punti:"),
      e(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.88rem", color: "var(--text-dim)" } },
        e(
          "div",
          { style: { display: "flex", justifyContent: "space-between" } },
          e("span", null, `🏅 Medaglie (${breakdown.badgesCount}):`),
          e("span", { style: { fontWeight: "bold", color: "#fff" } }, `+${breakdown.badgePoints}`)
        ),
        e(
          "div",
          { style: { display: "flex", justifyContent: "space-between" } },
          e("span", null, "🏋️‍♂️ Livelli Squadra:"),
          e("span", { style: { fontWeight: "bold", color: "#fff" } }, `+${breakdown.teamLevelsPoints}`)
        ),
        e(
          "div",
          { style: { display: "flex", justifyContent: "space-between" } },
          e("span", null, `📖 Pokédex Specie (${breakdown.caughtCount}):`),
          e("span", { style: { fontWeight: "bold", color: "#fff" } }, `+${breakdown.pokedexPoints}`)
        ),
        breakdown.shinyCount > 0 &&
          e(
            "div",
            { style: { display: "flex", justifyContent: "space-between" } },
            e("span", null, `✨ Bonus Shiny (${breakdown.shinyCount}):`),
            e("span", { style: { fontWeight: "bold", color: "var(--gold)" } }, `+${breakdown.shinyPoints}`)
          ),
        breakdown.isNuzlocke &&
          e(
            "div",
            { style: { display: "flex", justifyContent: "space-between", color: "var(--danger)" } },
            e("span", null, "💀 Moltiplicatore Nuzlocke:"),
            e("span", { style: { fontWeight: "bold" } }, "x1.5")
          )
      ),

      // Bottone di chiusura
      e(
        "div",
        { style: { marginTop: "24px", textAlign: "center" } },
        e(
          "button",
          {
            className: "btn btn-primary",
            onClick: onClose,
            style: { width: "100%", padding: "10px" },
          },
          "Chiudi Scheda ➔"
        )
      )
    )
  );
}
