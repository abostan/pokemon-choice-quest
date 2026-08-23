import React from "react";
import { PokemonChip } from "./PokemonSprite.js";
import { getItemDescription } from "../data/items.js";
import { computeTeamAbilities } from "../data/abilities.js";
import { computeTeamPower } from "../engine/battleLogic.js";

const e = React.createElement;

function getBadgeIcon(badgeName) {
  if (badgeName.includes("Roccia") || badgeName.includes("Carbone") || badgeName.includes("Pietra") || badgeName.includes("Muro")) return "🪨";
  if (badgeName.includes("Corrente") || badgeName.includes("Acqua") || badgeName.includes("Pioggia") || badgeName.includes("Acstrino")) return "💧";
  if (badgeName.includes("Voltaggio") || badgeName.includes("Dinamo") || badgeName.includes("Faro") || badgeName.includes("Volt")) return "⚡";
  if (badgeName.includes("Foglia") || badgeName.includes("Bosco") || badgeName.includes("Pianta")) return "🌿";
  if (badgeName.includes("Tossica")) return "☠️";
  if (badgeName.includes("Arcana") || badgeName.includes("Relitto") || badgeName.includes("Mente") || badgeName.includes("Psiche")) return "🔮";
  if (badgeName.includes("Brace") || badgeName.includes("Fiamma")) return "🔥";
  if (badgeName.includes("Faglia") || badgeName.includes("Sisma")) return "🏔️";
  if (badgeName.includes("Ala") || badgeName.includes("Zanna") || badgeName.includes("Piuma") || badgeName.includes("Jet") || badgeName.includes("Insetto") || badgeName.includes("Maggiolino")) return "🦅";
  if (badgeName.includes("Latte") || badgeName.includes("Armonia") || badgeName.includes("Base")) return "🥛";
  if (badgeName.includes("Pugno") || badgeName.includes("Ciottolo") || badgeName.includes("Scontro")) return "🥊";
  if (badgeName.includes("Lama") || badgeName.includes("Cava")) return "🗡️";
  if (badgeName.includes("Gelo") || badgeName.includes("Ghiaccio") || badgeName.includes("Iceberg") || badgeName.includes("Glacia")) return "❄️";
  if (badgeName.includes("Squama") || badgeName.includes("Leggenda")) return "🐉";
  if (badgeName.includes("Fata")) return "🧚";
  if (badgeName.includes("Tris")) return "🍀";
  if (badgeName.includes("Campione")) return "👑";
  return "🏅";
}

function BadgeItem({ name }) {
  const icon = getBadgeIcon(name);
  return e(
    "div",
    { className: "badge-visual-chip", title: name },
    e("span", { className: "badge-icon" }, icon),
    e("span", { className: "badge-title" }, name)
  );
}

/**
 * Pannello laterale sempre visibile: squadra, box, medaglie, zaino.
 *
 * props:
 *  - team: Array<{id,level,isShiny}>
 *  - box: Array<{id,level,isShiny}>
 *  - badges: Array<string>
 *  - items: Array<string>
 *  - onOpenBox(): callback per aprire il BoxModal
 */
export function TeamPanel({
  team,
  box,
  badges,
  items,
  coins = 0,
  isNuzlocke = false,
  activeMega = false,
  activeItemBoost = 0,
  onOpenBox,
  onSwapTeamPosition,
}) {
  const abilities = computeTeamAbilities(team);
  const baseTeamPower = computeTeamPower(team);
  const itemBoost = activeItemBoost || 0;
  const megaMult = activeMega ? 1.3 : 1.0;
  const teamPower = Math.round((baseTeamPower + itemBoost) * megaMult);
  const bonusDiff = teamPower - baseTeamPower;

  return e(
    "div",
    { className: "panel side-panel" },
    e(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
          background: "rgba(251, 191, 36, 0.12)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.85rem",
          fontWeight: "bold",
          color: "#fef08a",
        },
      },
      e("span", null, "💰 Pokédollari:"),
      e("span", null, `${coins} 💰`)
    ),
    e(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          background: bonusDiff > 0 ? "rgba(168, 85, 247, 0.18)" : "rgba(56, 189, 248, 0.12)",
          border: bonusDiff > 0 ? "1px solid rgba(168, 85, 247, 0.5)" : "1px solid rgba(56, 189, 248, 0.3)",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.85rem",
          fontWeight: "bold",
          color: bonusDiff > 0 ? "#e9d5ff" : "#7dd3fc",
          boxShadow: bonusDiff > 0 ? "0 2px 8px rgba(168, 85, 247, 0.25)" : "none",
        },
      },
      e("span", null, "⚡ Potenza Squadra:"),
      e(
        "span",
        null,
        `⚡ ${teamPower}`,
        bonusDiff > 0 && e("span", { style: { fontSize: "0.72rem", marginLeft: "4px", color: "#f472b6" } }, `(+${bonusDiff})`)
      )
    ),
    isNuzlocke && e(
      "div",
      {
        className: "nuzlocke-badge-panel",
        style: {
          padding: "4px 8px",
          marginBottom: "10px",
          borderRadius: "6px",
          background: "linear-gradient(135deg, #be123c, #881337)",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: "bold",
          textAlign: "center",
          letterSpacing: "0.5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        },
      },
      "💀 NUZLOCKE HARDCORE MODE"
    ),
    e("h2", null, `La tua squadra (${team.length}/6)`),
    team.length === 0
      ? e("p", { className: "empty-hint" }, "Non hai ancora nessun Pokémon.")
      : e(
          "div",
          { className: "team-list" },
          team.map((p, idx) =>
            e(
              "div",
              {
                key: `${p.id}-${idx}`,
                style: { position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" },
              },
              e(PokemonChip, { id: p.id, level: p.level, isShiny: p.isShiny }),
              onSwapTeamPosition && team.length > 1 &&
                e(
                  "div",
                  { style: { display: "flex", gap: "4px", marginTop: "2px" } },
                  idx > 0 &&
                    e(
                      "button",
                      {
                        className: "mini-swap-btn",
                        title: "Sposta a sinistra",
                        style: { padding: "0 4px", fontSize: "0.65rem", cursor: "pointer", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "3px", color: "#fff" },
                        onClick: () => onSwapTeamPosition(idx, idx - 1),
                      },
                      "◄"
                    ),
                  idx < team.length - 1 &&
                    e(
                      "button",
                      {
                        className: "mini-swap-btn",
                        title: "Sposta a destra",
                        style: { padding: "0 4px", fontSize: "0.65rem", cursor: "pointer", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "3px", color: "#fff" },
                        onClick: () => onSwapTeamPosition(idx, idx + 1),
                      },
                      "►"
                    )
                )
            )
          )
        ),

    // Sezione Abilità Passive Attive
    abilities.length > 0 &&
      e(
        "div",
        { style: { marginTop: "12px" } },
        e("span", { style: { fontSize: "0.75rem", fontWeight: "bold", color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.5px" } }, "🌟 Abilità Attive:"),
        e(
          "div",
          { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" } },
          abilities.map((ab, idx) =>
            e(
              "span",
              {
                key: `${ab.name}-${idx}`,
                title: ab.description,
                style: {
                  background: "rgba(251, 191, 36, 0.15)",
                  border: "1px solid rgba(251, 191, 36, 0.4)",
                  color: "#fef08a",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.72rem",
                  fontWeight: "500",
                  cursor: "help",
                },
              },
              `${ab.icon} ${ab.name}`
            )
          )
        )
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
          { className: "badge-visual-list" },
          badges.map((b, idx) => e(BadgeItem, { key: `${b}-${idx}`, name: b }))
        ),

    e("h2", { style: { marginTop: "20px" } }, "Zaino (Passa sopra per info)"),
    !items || items.length === 0
      ? e("p", { className: "empty-hint" }, "Zaino vuoto.")
      : e(
          "ul",
          { className: "inventory-list" },
          items.map((it, idx) => {
            const desc = getItemDescription(it);
            return e(
              "li",
              {
                key: `${it}-${idx}`,
                className: "inventory-item-row",
                title: `${it}: ${desc}`,
              },
              e("span", { className: "inventory-item-name" }, `🧪 ${it}`),
              e("span", { className: "inventory-item-tooltip" }, desc)
            );
          })
        )
  );
}
