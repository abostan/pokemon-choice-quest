import React from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

export function TeamPanel({ team, badges, items }) {
  return e(
    "div",
    { className: "panel side-panel" },
    e("h2", null, "La tua squadra"),
    team.length === 0
      ? e("p", { className: "empty-hint" }, "Non hai ancora nessun Pokémon.")
      : e(
          "div",
          { className: "team-list" },
          team.map((p, idx) => e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level }))
        ),
    e("h2", { style: { marginTop: "20px" } }, "Medaglie"),
    badges.length === 0
      ? e("p", { className: "empty-hint" }, "Nessuna medaglia ancora.")
      : e(
          "div",
          { className: "badge-list" },
          badges.map((b) => e("span", { className: "badge-chip", key: b }, b))
        ),
    e("h2", { style: { marginTop: "20px" } }, "Zaino"),
    !items || items.length === 0
      ? e("p", { className: "empty-hint" }, "Zaino vuoto.")
      : e(
          "ul",
          { style: { margin: 0, paddingLeft: "18px", color: "var(--text-dim)", fontSize: "0.85rem" } },
          items.map((it, idx) => e("li", { key: `${it}-${idx}` }, it))
        )
  );
}
