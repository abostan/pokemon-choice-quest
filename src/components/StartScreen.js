import React from "react";
import { PokemonPreview } from "./PokemonSprite.js";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

/**
 * Schermata di scelta dello starter.
 *
 * props:
 *  - starterIds: Array<number>
 *  - generationName: string
 *  - continueTeam: Array<{id,level}> | null  — se presente, mostra il team attuale
 *  - onChooseStarter(id): callback
 */
export function StartScreen({ starterIds, generationName, continueTeam, onChooseStarter }) {
  const isContinue = continueTeam && continueTeam.length > 0;
  return e(
    "div",
    { className: "panel" },
    e("h2", { className: "scene-title" }, `Scegli il tuo starter a ${generationName}`),
    e(
      "p",
      { className: "scene-text" },
      isContinue
        ? `Il Professore Pokémon di ${generationName} ti offre un compagno locale. Il tuo team esistente ti accompagna nel viaggio.`
        : "Il Professore ti lascia scegliere il tuo primo compagno di viaggio. A differenza del sito da cui è nata questa idea, qui non gira nessuna ruota: sei tu a decidere ogni passo."
    ),
    isContinue &&
      e(
        "div",
        { style: { marginBottom: "16px" } },
        e("p", { className: "next-gen-label" }, "Il tuo team attuale:"),
        e(
          "div",
          { className: "team-list" },
          continueTeam.map((p, idx) =>
            e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level })
          )
        )
      ),
    e(
      "div",
      { className: "pokemon-card-row" },
      starterIds.map((id) =>
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
