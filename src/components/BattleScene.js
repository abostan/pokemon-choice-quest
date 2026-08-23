import React, { useState } from "react";
import { PokemonChip } from "./PokemonSprite.js";
import { computeTeamPower, computeWinChance, rollBattle, TACTICS } from "../engine/battleLogic.js";
import { getItemDescription } from "../data/items.js";
import { computeTypeEffectiveness } from "../engine/typeMatchup.js";
import { computeMegaPower } from "../engine/megaLogic.js";
import { playMegaSound, playVictoryJingle } from "../engine/soundEngine.js";
import { recordBattle } from "../engine/runRecorder.js";
import { TapTooltip } from "./TapTooltip.js";
import { computeTeamAbilities } from "../data/abilities.js";
import { getTypeIcon, TYPE_LIST } from "../data/types.js";

const e = React.createElement;

function getTrainerEmoji(title) {
  if (title.includes("Rivale")) return "🧢";
  if (title.includes("Campione")) return "👑";
  if (title.includes("Alto Comando")) return "⚔️";
  const type = TYPE_LIST.find((t) => title.includes(t));
  return type ? getTypeIcon(type, "👤") : "👤";
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
 * Scena di battaglia con Avatar dell'Allenatore, Megaevoluzione ed efficacia di tipo.
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
  isNuzlocke = false,
  onUseItem,
  onOpenBox,
  onPowerBoost,
  onResolved,
}) {
  const [result, setResult] = useState(null); // { tactic, won, winChance } | null
  const [usedItem, setUsedItem] = useState(null); // { name, boost } | null
  const [isMegaActive, setIsMegaActive] = useState(false);
  const [isTerastalActive, setIsTerastalActive] = useState(false);

  const hasTeam = team && team.length > 0;
  const teamAbilities = computeTeamAbilities(team);

  // Estrae il tipo avversario dal titolo se non passato esplicitamente (es. "Capopalestra di tipo Roccia")
  const detectedType = opponentType || (opponentTitle.match(/tipo ([A-Za-z]+)/)?.[1] ?? "");
  const typeEff = computeTypeEffectiveness(team, detectedType);

  const baseTeamPower = computeTeamPower(team);
  const itemBoost = usedItem ? usedItem.boost : 0;
  const rawTeamPower = baseTeamPower + itemBoost;

  // Modificatore di Levitazione (se presente ed il team è vulnerabile, annulla lo svantaggio)
  const hasLevitate = teamAbilities.some((a) => a.name === "Levitazione");
  const effectiveMultiplier = hasLevitate && typeEff.multiplier < 1.0 ? 1.0 : typeEff.multiplier;

  const typePower = Math.round(rawTeamPower * effectiveMultiplier);
  const megaMult = isMegaActive ? 1.3 : 1.0;
  const teraMult = isTerastalActive ? 1.25 : 1.0;
  const totalTeamPower = Math.round(typePower * megaMult * teraMult);

  function handleUseItem(itemIdx) {
    if (usedItem) return;
    const itemName = items[itemIdx];
    let boost = 10;
    if (itemName.includes("Iper")) boost = 24;
    else if (itemName.includes("Super")) boost = 18;
    else if (itemName.includes("Pozione")) boost = 10;
    else if (itemName.includes("Pietra") || itemName.includes("Rimedio")) boost = 14;

    setUsedItem({ name: itemName, boost });
    if (onPowerBoost) onPowerBoost({ activeItemBoost: boost });
    if (onUseItem) onUseItem(itemIdx);
  }

  function fight(tactic) {
    if (!hasTeam) return;
    const winChance = computeWinChance(totalTeamPower, opponentPower, tactic, teamAbilities);
    const won = rollBattle(winChance);
    if (won) playVictoryJingle();
    recordBattle({ tactic, winChance, won, opponentTitle });
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

    // Avviso se la squadra è vuota
    !hasTeam &&
      e(
        "div",
        {
          style: {
            margin: "20px 0",
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(225, 29, 72, 0.15)",
            border: "1px solid #f43f5e",
            textAlign: "center",
          },
        },
        e("p", { style: { fontWeight: "bold", color: "#fda4af", margin: "0 0 8px 0" } }, "⚠️ Non hai nessun Pokémon attivo in squadra!"),
        e("p", { style: { fontSize: "0.88rem", color: "var(--text-dim)", margin: "0 0 12px 0" } }, "Devi ritirare un Pokémon sano dal Box per poter lottare."),
        e(
          "button",
          {
            className: "continue-btn",
            style: { background: "linear-gradient(135deg, #d97706, #92400e)", color: "#fff", border: "1px solid #f59e0b" },
            onClick: onOpenBox,
          },
          "📦 Apri Gestione Box"
        )
      ),

    // Badge Efficacia dei Tipi
    hasTeam && typeEff.message && e(
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
          border: typeEff.status === "super" ? "1px solid var(--success)" : "1px solid var(--danger)",
          color: typeEff.status === "super" ? "var(--success)" : "var(--danger)",
        },
      },
      typeEff.message
    ),

    // Megaevoluzione Button / Badge (esclusiva con la Terastallizzazione)
    hasTeam && !result && !isMegaActive && !isTerastalActive && e(
      "button",
      {
        className: "mega-btn control-action",
        style: {
          background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
          color: "#fff",
          border: "2px solid var(--mega)",
          margin: "10px 0",
        },
        onClick: () => {
          playMegaSound();
          setIsMegaActive(true);
          if (onPowerBoost) onPowerBoost({ activeMega: true });
        },
      },
      "🔮 Attiva MEGAEVOLUZIONE / GIGAMAX! (+30% Potenza Squadra)"
    ),

    hasTeam && isMegaActive && e(
      "div",
      {
        className: "mega-active-badge badge-status",
        style: {
          padding: "8px 12px",
          borderRadius: "8px",
          background: "rgba(124, 58, 237, 0.25)",
          border: "1px solid var(--mega)",
          color: "#c4b5fd",
          fontSize: "0.9rem",
          margin: "10px 0",
        },
      },
      "🔮 MEGAEVOLUZIONE / GIGAMAX ATTIVA (+30% POTENZA SQUADRA!)"
    ),

    // Terastallizzazione Button / Badge (esclusiva con la Megaevoluzione)
    hasTeam && !result && !isTerastalActive && !isMegaActive && e(
      "button",
      {
        className: "tera-btn control-action",
        style: {
          background: "linear-gradient(135deg, #0284c7, #0369a1)",
          color: "#fff",
          border: "2px solid var(--tera)",
          margin: "6px 0 10px 0",
        },
        onClick: () => {
          playMegaSound();
          setIsTerastalActive(true);
          if (onPowerBoost) onPowerBoost({ activeTerastal: true });
        },
      },
      "💎 Attiva TERASTALLIZZAZIONE! (+25% Potenza Tipo Tera)"
    ),

    hasTeam && isTerastalActive && e(
      "div",
      {
        className: "tera-active-badge badge-status",
        style: {
          padding: "8px 12px",
          borderRadius: "8px",
          background: "rgba(56, 189, 248, 0.25)",
          border: "1px solid var(--tera)",
          color: "var(--tera-light)",
          fontSize: "0.9rem",
          margin: "6px 0 10px 0",
        },
      },
      "💎 TERASTALLIZZAZIONE ATTIVA (+25% POTENZA TIPO TERA!)"
    ),

    // Squadra Avversario
    e(
      "div",
      { style: { marginBottom: "16px" } },
      e(
        "div",
        { className: "team-list", style: { marginTop: "8px" } },
        (opponentTeamIds || []).map((id, idx) => e(PokemonChip, { key: `${id}-${idx}`, id }))
      )
    ),

    // Sezione Oggetti dallo Zaino (se non ha ancora attaccato)
    hasTeam && !result && items && items.length > 0 &&
      e(
        "div",
        { className: "battle-item-section" },
        e("span", { className: "battle-item-label" }, "🎒 Usa uno strumento prima dello scontro:"),
        e(
          "div",
          { className: "battle-item-list" },
          items.map((itemName, idx) => {
            const desc = getItemDescription(itemName);
            return e(
              "span",
              { key: `${itemName}-${idx}`, className: "battle-item-row" },
              e(
                "button",
                {
                  className: `battle-item-btn ${usedItem?.name === itemName ? "used" : ""}`,
                  disabled: usedItem !== null,
                  title: `${itemName}: ${desc}`,
                  onClick: () => handleUseItem(idx),
                },
                `🧪 ${itemName}`
              ),
              e(TapTooltip, { text: `${itemName}: ${desc}`, as: "span", className: "battle-item-info" }, "ⓘ")
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

    hasTeam && !result &&
      e(
        "div",
        { className: "choice-list", style: { marginTop: "16px" } },
        TACTICS.map((t) => {
          const previewChance = computeWinChance(totalTeamPower, opponentPower, t.id, teamAbilities);
          const pct = Math.round(previewChance * 100);
          const barColor = previewChance < 0.4 ? "var(--danger)" : previewChance < 0.65 ? "var(--gold)" : "var(--success)";
          return e(
            "button",
            { key: t.id, className: "choice-btn", onClick: () => fight(t.id) },
            e("span", null, t.label),
            e("span", { className: "choice-hint" }, t.hint),
            e(
              "div",
              { className: "win-chance-bar-track" },
              e("div", { className: "win-chance-bar-fill", style: { width: `${pct}%`, background: barColor } })
            ),
            e("span", { className: "win-chance-bar-label", style: { color: barColor } }, `${pct}% probabilità di vittoria`)
          );
        })
      ),

    result &&
      e(
        "div",
        { className: `outcome-box ${result.won ? "" : "fail"}` },
        result.won
          ? `Hai vinto la battaglia!${rewardBadge ? ` Ottieni la medaglia "${rewardBadge}".` : ""}`
          : isNuzlocke
          ? "💀 Sconfitta Nuzlocke: il tuo Pokémon è svenuto ed è stato trasferito nel Box!"
          : "Hai perso questa battaglia.",
        e(
          "div",
          { style: { marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" } },
          result.won
            ? e(
                "button",
                {
                  className: "continue-btn",
                  onClick: () => {
                    if (onPowerBoost) onPowerBoost({ activeMega: false, activeTerastal: false, activeItemBoost: 0 });
                    onResolved({ won: true });
                  },
                },
                "Continua"
              )
            : isNuzlocke
            ? e(
                "button",
                {
                  className: "continue-btn",
                  style: { background: "linear-gradient(135deg, var(--danger), var(--danger-dark))", color: "#fff" },
                  onClick: () => {
                    if (onPowerBoost) onPowerBoost({ activeMega: false, activeTerastal: false, activeItemBoost: 0 });
                    onResolved({ won: false });
                  },
                },
                "💀 Registra la sconfitta"
              )
            : [
                e("button", { key: "retry", className: "continue-btn", onClick: retry }, "Riprova la battaglia"),
                e(
                  "button",
                  {
                    key: "skip",
                    className: "continue-btn",
                    style: { background: "#2c3e4e", color: "#eef3f8" },
                    onClick: () => {
                      if (onPowerBoost) onPowerBoost({ activeMega: false, activeTerastal: false, activeItemBoost: 0 });
                      onResolved({ won: false });
                    },
                  },
                  "Ritirati e prosegui comunque"
                ),
              ]
        )
      )
  );
}
