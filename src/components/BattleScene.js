import React, { useState } from "react";
import { PokemonChip } from "./PokemonSprite.js";
import { computeTeamPower, computeWinChance, rollBattle } from "../engine/battleLogic.js";

const e = React.createElement;

const TACTICS = [
  {
    id: "aggressive",
    label: "Attacco diretto",
    hint: "Rischioso ma potente se la tua squadra è già forte",
  },
  {
    id: "balanced",
    label: "Strategia bilanciata",
    hint: "Un buon compromesso in ogni situazione",
  },
  {
    id: "defensive",
    label: "Gioco difensivo e contrattacco",
    hint: "Più sicuro contro avversari forti, meno spettacolare",
  },
];

/**
 * Scena di battaglia: il giocatore sceglie facoltativamente un oggetto dallo zaino,
 * poi sceglie una tattica e l'esito viene calcolato.
 *
 * props:
 *  - title, text
 *  - opponentTitle, opponentTeamIds
 *  - opponentPower (number)
 *  - team (array {id, level, isShiny})
 *  - items (array of strings)
 *  - rewardBadge (string|null)
 *  - onUseItem(itemIndex): callback per consumare l'oggetto dallo zaino
 *  - onResolved({ won })
 */
export function BattleScene({
  title,
  text,
  opponentTitle,
  opponentTeamIds,
  opponentPower,
  team,
  items = [],
  rewardBadge,
  onUseItem,
  onResolved,
}) {
  const [result, setResult] = useState(null); // { tactic, won, winChance } | null
  const [usedItem, setUsedItem] = useState(null); // { name, boost } | null

  const baseTeamPower = computeTeamPower(team);
  const itemBoost = usedItem ? usedItem.boost : 0;
  const totalTeamPower = baseTeamPower + itemBoost;

  function handleUseItem(itemIdx) {
    if (usedItem) return;
    const itemName = items[itemIdx];
    let boost = 10;
    if (itemName.includes("Iper") || itemName.includes("Super")) boost = 18;
    else if (itemName.includes("Pozione")) boost = 10;
    else if (itemName.includes("Pietra") || itemName.includes("Rimedio")) boost = 14;

    setUsedItem({ name: itemName, boost });
    if (onUseItem) onUseItem(itemIdx);
  }

  function fight(tactic) {
    const winChance = computeWinChance(totalTeamPower, opponentPower, tactic);
    const won = rollBattle(winChance);
    setResult({ tactic, won, winChance });
  }

  function retry() {
    setResult(null);
  }

  return e(
    "div",
    { className: "panel" },
    e("h2", { className: "scene-title" }, title),
    e("p", { className: "scene-text" }, text),
    e(
      "div",
      { style: { marginBottom: "14px" } },
      e("strong", null, opponentTitle),
      e(
        "div",
        { className: "team-list", style: { marginTop: "8px" } },
        opponentTeamIds.map((id, idx) => e(PokemonChip, { key: `${id}-${idx}`, id }))
      )
    ),

    // Sezione Oggetti dallo Zaino (se non ha ancora attaccato)
    !result && items && items.length > 0 &&
      e(
        "div",
        { className: "battle-item-section" },
        e("span", { className: "battle-item-label" }, "🎒 Usa uno strumento prima dello scontro:"),
        e(
          "div",
          { className: "battle-item-list" },
          items.map((itemName, idx) =>
            e(
              "button",
              {
                key: `${itemName}-${idx}`,
                className: `battle-item-btn ${usedItem?.name === itemName ? "used" : ""}`,
                disabled: usedItem !== null,
                onClick: () => handleUseItem(idx),
              },
              `🧪 ${itemName}`
            )
          )
        )
      ),

    usedItem &&
      e(
        "div",
        { className: "battle-item-notice" },
        `✨ Hai usato "${usedItem.name}"! La squadra guadagna +${usedItem.boost} Potenza per questa battaglia.`
      ),

    !result &&
      e(
        "div",
        { className: "choice-list", style: { marginTop: "16px" } },
        TACTICS.map((t) =>
          e(
            "button",
            { key: t.id, className: "choice-btn", onClick: () => fight(t.id) },
            e("span", null, t.label),
            e("span", { className: "choice-hint" }, t.hint)
          )
        )
      ),

    result &&
      e(
        "div",
        { className: `outcome-box ${result.won ? "" : "fail"}` },
        result.won
          ? `Hai vinto la battaglia!${rewardBadge ? ` Ottieni la medaglia "${rewardBadge}".` : ""}`
          : "Hai perso questa battaglia.",
        e(
          "div",
          { style: { marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" } },
          result.won
            ? e(
                "button",
                { className: "continue-btn", onClick: () => onResolved({ won: true }) },
                "Continua"
              )
            : [
                e("button", { key: "retry", className: "continue-btn", onClick: retry }, "Riprova la battaglia"),
                e(
                  "button",
                  {
                    key: "skip",
                    className: "continue-btn",
                    style: { background: "#2c3e4e", color: "#eef3f8" },
                    onClick: () => onResolved({ won: false }),
                  },
                  "Ritirati e prosegui comunque"
                ),
              ]
        )
      )
  );
}
