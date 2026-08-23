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
 *  - continueTeam: Array<{id,level}> | null  — se presente, mostra la squadra trasferita nel Box
 *  - onChooseStarter(id): callback
 */
export function StartScreen({ starterIds, generationName, continueTeam, onChooseStarter }) {
  const isContinue = continueTeam && continueTeam.length > 0;
  const [nuzlockeMode, setNuzlockeMode] = React.useState(false);

  return e(
    "div",
    { className: "panel" },
    e("h2", { className: "scene-title" }, `Scegli il tuo starter a ${generationName}`),
    e(
      "p",
      { className: "scene-text" },
      isContinue
        ? `Benvenuto a ${generationName}! I tuoi campioni della regione precedente sono stati riposti al sicuro nel Box PC. Scegli il tuo starter per iniziare la nuova avventura.`
        : "Il Professore ti lascia scegliere il tuo primo compagno di viaggio. A differenza del sito da cui è nata questa idea, qui non gira nessuna ruota: sei tu a decidere ogni passo."
    ),
    !isContinue && e(
      "div",
      {
        className: "nuzlocke-toggle-box",
        style: {
          margin: "12px 0 16px 0",
          padding: "10px 14px",
          background: nuzlockeMode ? "rgba(225, 29, 72, 0.15)" : "rgba(255, 255, 255, 0.05)",
          border: nuzlockeMode ? "1px solid #f43f5e" : "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        },
        onClick: () => setNuzlockeMode(!nuzlockeMode),
      },
      e("input", {
        type: "checkbox",
        checked: nuzlockeMode,
        onChange: (ev) => setNuzlockeMode(ev.target.checked),
        style: { cursor: "pointer", width: "18px", height: "18px" },
      }),
      e(
        "div",
        null,
        e("span", { style: { fontWeight: "bold", color: nuzlockeMode ? "#fda4af" : "#e2e8f0" } }, "💀 Modalità Sfida Hardcore / Nuzlocke"),
        e("div", { style: { fontSize: "0.78rem", color: "#94a3b8" } }, "Morte permanente: i Pokémon svenuti restano nel Box e non possono più combattere!")
      )
    ),
    isContinue &&
      e(
        "div",
        { style: { marginBottom: "16px" } },
        e("p", { className: "next-gen-label" }, "I tuoi Pokémon custoditi nel Box:"),
        e(
          "div",
          { className: "team-list" },
          continueTeam.map((p, idx) =>
            e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level, isShiny: p.isShiny })
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
            { className: "continue-btn", onClick: () => onChooseStarter(id, nuzlockeMode) },
            "Scegli"
          )
        )
      )
    )
  );
}
