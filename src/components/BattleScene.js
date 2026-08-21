import React, { useState } from "react";
import { PokemonChip } from "./PokemonSprite.js";
import { computeTeamPower, computeWinChance, rollBattle } from "../engine/battleLogic.js";
import { getItemDescription } from "../data/items.js";
import { computeTypeEffectiveness } from "../engine/typeMatchup.js";

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

function getTrainerEmoji(title) {
  if (title.includes("Rivale")) return "🧢";
  if (title.includes("Campione")) return "👑";
  if (title.includes("Alto Comando")) return "⚔️";
  if (title.includes("Roccia")) return "🪨";
  if (title.includes("Acqua")) return "💧";
  if (title.includes("Elettrico")) return "⚡";
  if (title.includes("Erba")) return "🌿";
  if (title.includes("Veleno")) return "☠️";
  if (title.includes("Psico") || title.includes("Spettro")) return "🔮";
  if (title.includes("Fuoco")) return "🔥";
  if (title.includes("Terra")) return "🏔️";
  if (title.includes("Volante")) return "🦅";
  if (title.includes("Coleottero")) return "🐛";
  if (title.includes("Normale")) return "🥛";
  if (title.includes("Lotta")) return "🥊";
  if (title.includes("Acciaio")) return "🗡️";
  if (title.includes("Ghiaccio")) return "❄️";
  if (title.includes("Drago")) return "🐉";
  if (title.includes("Folletto")) return "🧚";
  return "👤";
}

/**
 * Avatar del Capopalestra / Avversario
 */
function TrainerAvatar({ title, opponentPower }) {
  const emoji = getTrainerEmoji(title);
  return e(
    "div",
    { className: "trainer-avatar-card" },
    e("div", { className: "trainer-avatar-icon" }, emoji),
    e(
      "div",
      { className: "trainer-avatar-info" },
      e("span", { className: "trainer-title" }, title),
      e("span", { className: "trainer-power" }, `⚡ Potenza Avversaria: ${opponentPower}`)
    )
  );
}

/**
 * Scena di battaglia con Avatar dell'Allenatore, efficacia di tipo ed uso oggetti dallo zaino.
 */
export function BattleScene({
  title,
  text,
  opponentTitle,
  opponentTeamIds,
  opponentPower,
  opponentType = "",
  team,
  items = [],
  rewardBadge,
  onUseItem,
  onResolved,
}) {
  const [result, setResult] = useState(null); // { tactic, won, winChance } | null
  const [usedItem, setUsedItem] = useState(null); // { name, boost } | null

  // Estrae il tipo avversario dal titolo se non passato esplicitamente (es. "Capopalestra di tipo Roccia")
  const detectedType = opponentType || (opponentTitle.match(/tipo ([A-Za-z]+)/)?.[1] ?? "");
  const typeEff = computeTypeEffectiveness(team, detectedType);

  const baseTeamPower = computeTeamPower(team);
  const itemBoost = usedItem ? usedItem.boost : 0;
  const rawTeamPower = baseTeamPower + itemBoost;
  const totalTeamPower = Math.round(rawTeamPower * typeEff.multiplier);

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

    // Avatar dell'Allenatore Avversario
    e(TrainerAvatar, { title: opponentTitle, opponentPower }),

    // Badge Efficacia dei Tipi
    typeEff.message && e(
      "div",
      {
        className: `type-advantage-badge ${typeEff.status}`,
        style: {
          margin: "10px 0",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "0.88rem",
          fontWeight: "600",
          background: typeEff.status === "super" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
          border: typeEff.status === "super" ? "1px solid #22c55e" : "1px solid #ef4444",
          color: typeEff.status === "super" ? "#4ade80" : "#f87171",
        },
      },
      typeEff.message
    ),

    // Squadra Avversario
    e(
      "div",
      { style: { marginBottom: "16px" } },
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
        e("span", { className: "battle-item-label" }, "🎒 Usa uno strumento prima dello scontro (passa sopra per info):"),
        e(
          "div",
          { className: "battle-item-list" },
          items.map((itemName, idx) => {
            const desc = getItemDescription(itemName);
            return e(
              "button",
              {
                key: `${itemName}-${idx}`,
                className: `battle-item-btn ${usedItem?.name === itemName ? "used" : ""}`,
                disabled: usedItem !== null,
                title: `${itemName}: ${desc}`,
                onClick: () => handleUseItem(idx),
              },
              `🧪 ${itemName}`
            );
          })
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
