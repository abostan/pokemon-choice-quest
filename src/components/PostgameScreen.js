import React from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

/**
 * Schermata di ingresso alla modalità post-game infinita.
 * Mostrata una sola volta quando tutte le generazioni sono state completate.
 *
 * props:
 *  - lastGenName (string): nome dell'ultima generazione completata
 *  - team (Array<{id,level}>): squadra attuale
 *  - onStart(): callback per iniziare la modalità infinita
 */
export function PostgameScreen({ lastGenName, team, onStart, onStartTournament }) {
  return e(
    "div",
    { className: "panel postgame-screen" },
    e("div", { className: "postgame-stars" }, "✨"),
    e("h2", { className: "scene-title" }, "Sei un Maestro Pokémon!"),
    e(
      "p",
      { className: "scene-text" },
      `Hai completato tutte le generazioni disponibili. Sei diventato leggenda. Ma il mondo Pokémon non si ferma mai — continua a esplorare con il tuo team!`
    ),
    e(
      "div",
      { className: "next-gen-team-preview" },
      e("p", { className: "next-gen-label" }, "Il tuo leggendario team:"),
      e(
        "div",
        { className: "team-list" },
        team.map((p, idx) =>
          e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level })
        )
      )
    ),
    e(
      "p",
      { className: "scene-text", style: { marginTop: "16px" } },
      `Da ora in poi potrai esplorare liberamente, catturare Pokémon sempre più forti e sfidare i Campioni storici nel Grande Torneo!`
    ),
    e(
      "div",
      { style: { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" } },
      e(
        "button",
        {
          className: "continue-btn",
          style: {
            background: "linear-gradient(135deg, #d97706, #b45309)",
            color: "#fff",
            border: "1px solid #f59e0b",
            fontWeight: "bold",
            padding: "12px 24px",
          },
          onClick: onStartTournament,
        },
        "⚔️ TORNEO DEI CAMPIONI DELLA LEGA"
      ),
      e(
        "button",
        { className: "continue-btn next-gen-btn", onClick: onStart },
        "Continua l'avventura infinita →"
      )
    )
  );
}
