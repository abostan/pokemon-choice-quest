import React from "react";
import { PokemonPreview } from "./PokemonSprite.js";
import { STARTER_IDS } from "../data/pools.js";

const e = React.createElement;

export function StartScreen({ onChooseStarter }) {
  return e(
    "div",
    { className: "panel" },
    e("h2", { className: "scene-title" }, "Inizia la tua avventura"),
    e(
      "p",
      { className: "scene-text" },
      "Il Professore ti lascia scegliere il tuo primo compagno di viaggio. A differenza del sito da cui è nata questa idea, qui non gira nessuna ruota: sei tu a decidere ogni passo."
    ),
    e(
      "div",
      { className: "pokemon-card-row" },
      STARTER_IDS.map((id) =>
        e(
          "div",
          { key: id, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" } },
          e(PokemonPreview, { id }),
          e(
            "button",
            { className: "continue-btn", onClick: () => onChooseStarter(id) },
            "Scegli"
          )
        )
      )
    )
  );
}
