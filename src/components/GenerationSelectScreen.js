import React from "react";
import { GENERATIONS } from "../data/generations.js";
import { PokemonPreview } from "./PokemonSprite.js";
import { TYPE_LIST } from "../data/types.js";

const e = React.createElement;

export function GenerationSelectScreen({ onChooseGeneration, boxCount }) {
  const [isRandomizer, setIsRandomizer] = React.useState(false);
  const [monoType, setMonoType] = React.useState(null);

  function handleStart(genId) {
    onChooseGeneration(genId, {
      isNuzlocke: false,  // impostato nella schermata starter
      isRandomizer,
      monoType,
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
      {
        style: {
          margin: "12px 0 16px 0",
          padding: "10px 14px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "16px",
        },
      },
      e(
        "label",
        { style: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" } },
        e("input", {
          type: "checkbox",
          checked: isRandomizer,
          onChange: (ev) => {
            setIsRandomizer(ev.target.checked);
            if (ev.target.checked) setMonoType(null);
          },
          style: { cursor: "pointer", width: "18px", height: "18px" },
        }),
        e("span", { style: { fontWeight: "bold", color: isRandomizer ? "#fbbf24" : "#e2e8f0" } }, "🎲 Randomizer Mode"),
      ),
      e(
        "label",
        { style: { display: "flex", alignItems: "center", gap: "8px", cursor: isRandomizer ? "default" : "pointer" } },
        e("span", { style: { fontWeight: "bold", color: monoType ? "#fbbf24" : "#e2e8f0" } }, "🎯 Mono-Tipo"),
        e(
          "select",
          {
            value: monoType || "",
            disabled: isRandomizer,
            onChange: (ev) => setMonoType(ev.target.value || null),
            style: { cursor: isRandomizer ? "default" : "pointer" },
          },
          e("option", { value: "" }, "Nessuno"),
          TYPE_LIST.map((t) => e("option", { key: t, value: t }, t))
        )
      )
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
