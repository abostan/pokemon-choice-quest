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
export function NextGenerationScreen({ currentGenName, nextGenName, team, onContinue }) {
  return e(
    "div",
    { className: "panel next-gen-screen" },
    e("div", { className: "next-gen-trophy" }, "🏆"),
    e("h2", { className: "scene-title" }, `${currentGenName} conquistata!`),
    e(
      "p",
      { className: "scene-text" },
      `Hai sconfitto il Campione e scritto il tuo nome nella storia di ${currentGenName}. Ma l'avventura non è finita: la regione di ${nextGenName} ti chiama.`
    ),
    e(
      "div",
      { className: "next-gen-team-preview" },
      e("p", { className: "next-gen-label" }, "Il tuo team ti accompagna:"),
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
      `Puoi scegliere un nuovo starter di ${nextGenName} per aggiungerlo alla squadra e affrontare le 8 nuove palestre.`
    ),
    e(
      "button",
      { className: "continue-btn next-gen-btn", onClick: onContinue },
      `Esplora ${nextGenName} →`
    )
  );
}
