import React from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

export function EndScreen({ team, badges, onRestart }) {
  return e(
    "div",
    { className: "panel end-screen" },
    e("h2", null, "Fine dell'avventura (per ora)"),
    e(
      "p",
      { className: "scene-text" },
      "Hai completato il tuo percorso fatto di scelte invece che di ruote della fortuna."
    ),
    e("h3", null, "La tua squadra finale"),
    e(
      "div",
      { className: "team-list", style: { justifyContent: "center" } },
      team.map((p, idx) => e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level }))
    ),
    e("h3", { style: { marginTop: "18px" } }, "Medaglie ottenute"),
    badges.length === 0
      ? e("p", { className: "empty-hint" }, "Nessuna medaglia in questa run.")
      : e(
          "div",
          { className: "badge-list", style: { justifyContent: "center" } },
          badges.map((b) => e("span", { className: "badge-chip", key: b }, b))
        ),
    e(
      "button",
      { className: "continue-btn", style: { marginTop: "20px" }, onClick: onRestart },
      "Gioca di nuovo"
    )
  );
}
