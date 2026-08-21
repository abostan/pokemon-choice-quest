import React from "react";
import { CHAMPIONS_TOURNAMENT } from "../data/championsTournament.js";

const e = React.createElement;

/**
 * Tabellone del Torneo dei Campioni della Lega (Post-game)
 *
 * props:
 *  - currentRound: number (0-4)
 *  - onStartMatch(): callback per avviare la sfida del round corrente
 *  - onExit(): callback per tornare al postgame
 */
export function TournamentScene({ currentRound = 0, onStartMatch, onExit }) {
  const currentChamp = CHAMPIONS_TOURNAMENT[currentRound] || CHAMPIONS_TOURNAMENT[0];
  const isFinished = currentRound >= CHAMPIONS_TOURNAMENT.length;

  return e(
    "div",
    {
      className: "panel tournament-panel",
      style: {
        background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
        border: "2px solid #fbbf24",
        borderRadius: "16px",
        padding: "24px",
        color: "#f8fafc",
      },
    },

    e("h2", { className: "scene-title", style: { color: "#fbbf24", textAlign: "center", margin: "0 0 8px 0" } }, "⚔️ TORNEO DEI CAMPIONI DELLA LEGA"),
    e("p", { className: "scene-text", style: { textAlign: "center", color: "#cbd5e1", margin: "0 0 20px 0" } }, "Il palcoscenico supremo: affronta i 5 Campioni storici in duello ad eliminazione diretta!"),

    // Tabellone dei 5 Round
    e(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "10px", margin: "20px 0" } },
      CHAMPIONS_TOURNAMENT.map((champ, idx) => {
        const isCurrent = idx === currentRound;
        const isPassed = idx < currentRound;
        return e(
          "div",
          {
            key: champ.id,
            style: {
              display: "flex",
              justify: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: "10px",
              background: isCurrent
                ? "rgba(251, 191, 36, 0.2)"
                : isPassed
                ? "rgba(34, 197, 94, 0.15)"
                : "rgba(30, 41, 59, 0.5)",
              border: isCurrent
                ? "2px solid #fbbf24"
                : isPassed
                ? "1px solid #22c55e"
                : "1px solid rgba(255,255,255,0.1)",
              opacity: !isCurrent && !isPassed ? 0.6 : 1,
            },
          },
          e(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "10px" } },
            e("span", { style: { fontWeight: "bold", color: isCurrent ? "#fef08a" : "#94a3b8" } }, `Round ${champ.round}:`),
            e("span", { style: { fontWeight: "600", color: "#f8fafc" } }, champ.title)
          ),
          e(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "12px" } },
            e("span", { style: { fontSize: "0.85rem", color: "#fbbf24" } }, `⚡ Potenza ${champ.opponentPower}`),
            e(
              "span",
              { style: { fontWeight: "bold", fontSize: "0.9rem" } },
              isPassed ? "✅ SCONFITTO" : isCurrent ? "⚔️ IN CORSO" : "🔒 BLOCCO"
            )
          )
        );
      })
    ),

    // Sezione di controllo
    !isFinished
      ? e(
          "div",
          { style: { textAlign: "center", marginTop: "24px" } },
          e("p", { style: { fontStyle: "italic", color: "#fca5a5", marginBottom: "16px" } }, currentChamp.text),
          e(
            "div",
            { style: { display: "flex", justifyContent: "center", gap: "12px" } },
            e(
              "button",
              {
                className: "continue-btn",
                style: {
                  background: "linear-gradient(135deg, #d97706, #b45309)",
                  color: "#fff",
                  fontSize: "1.05rem",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "1px solid #f59e0b",
                  fontWeight: "bold",
                },
                onClick: onStartMatch,
              },
              `⚔️ Sfida ${currentChamp.title.split(" ")[1] || "il Campione"}!`
            ),
            e("button", { className: "continue-btn", style: { background: "#334155" }, onClick: onExit }, "Torna al Postgame")
          )
        )
      : e(
          "div",
          { style: { textAlign: "center", marginTop: "24px" } },
          e("h3", { style: { color: "#4ade80", fontSize: "1.4rem" } }, "👑 HAI VINTO IL TORNEO DEI CAMPIONI!"),
          e("p", null, "Sei stato incoronato Re dei Campioni Pokémon in assoluto!"),
          e("button", { className: "continue-btn", onClick: onExit }, "Torna al Postgame")
        )
  );
}
