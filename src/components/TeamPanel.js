import React from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

/**
 * Pannello laterale sempre visibile: squadra, box, medaglie, zaino.
 *
 * props:
 *  - team: Array<{id,level}>
 *  - box: Array<{id,level}>
 *  - badges: Array<string>
 *  - items: Array<string>
 *  - onOpenBox(): callback per aprire il BoxModal
 */
export function TeamPanel({ team, box, badges, items, onOpenBox }) {
  return e(
    "div",
    { className: "panel side-panel" },
    e("h2", null, `La tua squadra (${team.length}/6)`),
    team.length === 0
      ? e("p", { className: "empty-hint" }, "Non hai ancora nessun Pokémon.")
      : e(
          "div",
          { className: "team-list" },
          team.map((p, idx) => e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level, isShiny: p.isShiny }))
        ),

    // Sezione Box
    e(
      "div",
      { className: "team-panel-box-row" },
      e("h2", { style: { marginTop: "20px" } }, `Box (${(box || []).length})`),
      box && box.length > 0 &&
        e(
          "button",
          { className: "box-open-btn", onClick: onOpenBox },
          "Gestisci →"
        )
    ),
    !box || box.length === 0
      ? e("p", { className: "empty-hint" }, "Box vuoto.")
      : e(
          "div",
          { className: "team-list" },
          box.slice(0, 3).map((p, idx) => e(PokemonChip, { key: `box-${p.id}-${idx}`, id: p.id, level: p.level, isShiny: p.isShiny }))
        ),
    box && box.length > 3 &&
      e("p", { className: "empty-hint", style: { fontSize: "0.75rem" } }, `...e altri ${box.length - 3} nel box`),

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
