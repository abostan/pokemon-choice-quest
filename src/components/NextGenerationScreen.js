import React from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

/**
 * Schermata intermedia mostrata quando il giocatore completa la Lega
 * di una generazione e ne esiste un'altra da giocare.
 *
 * props:
 *  - currentGenName (string): nome della generazione appena completata
 *  - nextGenName (string): nome della prossima generazione
 *  - team (Array<{id,level}>): squadra attuale
 *  - onContinue(): callback per procedere alla scelta del nuovo starter
 */
export function NextGenerationScreen({ currentGenName, nextGenName, team, onContinue, onHome }) {
  return e(
    "div",
    { className: "panel next-gen-screen" },
    e("div", { className: "next-gen-trophy" }, "🏆"),
    e("h2", { className: "scene-title" }, `${currentGenName} conquistata!`),
    e(
      "p",
      { className: "scene-text" },
      `Hai sconfitto il Campione e scritto il tuo nome nella Hall of Fame di ${currentGenName}. Una nuova avventura ti attende nella regione di ${nextGenName}!`
    ),
    e(
      "div",
      { className: "next-gen-team-preview" },
      e("p", { className: "next-gen-label" }, "La tua squadra Hall of Fame (verrà riposta nel Box PC):"),
      e(
        "div",
        { className: "team-list" },
        team.map((p, idx) =>
          e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level, isShiny: p.isShiny })
        )
      )
    ),
    e(
      "p",
      { className: "scene-text", style: { marginTop: "16px" } },
      `I tuoi campioni si riposeranno nel Box. Inizierai a ${nextGenName} solo con il tuo nuovo starter, e potrai recuperare i tuoi vecchi Pokémon dal Box in qualsiasi momento.`
    ),
    e(
      "div",
      { style: { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" } },
      e(
        "button",
        { className: "continue-btn next-gen-btn", onClick: onContinue },
        `Esplora ${nextGenName} →`
      ),
      onHome &&
        e(
          "button",
          {
            className: "continue-btn",
            style: {
              background: "linear-gradient(135deg, #4b5563, #374151)",
              color: "#fff",
              border: "1px solid #6b7280",
              padding: "12px 24px",
            },
            onClick: onHome,
          },
          "🏠 Menu Principale"
        )
    )
  );
}
