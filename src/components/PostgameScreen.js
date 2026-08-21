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
export function PostgameScreen({ lastGenName, team, onStart }) {
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
      `Da ora in poi potrai esplorare liberamente, catturare Pokémon sempre più forti, e — se sei fortunato — incontrare qualche leggendario...`
    ),
    e(
      "button",
      { className: "continue-btn next-gen-btn", onClick: onStart },
      "Continua l'avventura infinita →"
    )
  );
}
