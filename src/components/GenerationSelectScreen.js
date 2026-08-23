import React from "react";
import { GENERATIONS } from "../data/generations.js";
import { PokemonPreview } from "./PokemonSprite.js";

const e = React.createElement;

export function GenerationSelectScreen({ onChooseGeneration, boxCount }) {
  function handleStart(genId) {
    onChooseGeneration(genId, {
      isNuzlocke: false,  // impostato nella schermata starter
      isRandomizer: false,
      monoType: null,
    });
  }

  return e(
    "div",
    { className: "panel" },
    e("h2", { className: "scene-title" }, "Scegli la tua regione"),
    e(
      "p",
      { className: "scene-text" },
      boxCount > 0
        ? `Hai già ${boxCount} Pokémon nel box da avventure precedenti: resteranno con te qualunque regione tu scelga ora.`
        : "Ogni regione ha il proprio starter, le proprie palestre e la propria Lega. Scegli da dove iniziare la tua avventura!"
    ),

    e(
      "div",
      { className: "pokemon-card-row" },
      GENERATIONS.map((gen) =>
        e(
          "div",
          {
            key: gen.id,
            style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
          },
          e("strong", null, gen.name),
          e(
            "div",
            { style: { display: "flex", gap: "6px" } },
            gen.starterIds.map((id) => e(PokemonPreview, { key: id, id }))
          ),
          e(
            "button",
            { className: "continue-btn", onClick: () => handleStart(gen.id) },
            `Parti da ${gen.name}`
          )
        )
      )
    )
  );
}
