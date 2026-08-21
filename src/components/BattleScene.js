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
 * Scena di battaglia: invece di simulare mosse e statistiche reali (come
 * nei giochi ufficiali), il giocatore sceglie una tattica narrativa e
 * l'esito viene calcolato in base alla potenza complessiva della squadra.
 *
 * props:
 *  - title, text
 *  - opponentTitle, opponentTeamIds (solo per mostrare gli sprite avversari)
 *  - opponentPower (number)
 *  - team (array {id, level})
 *  - rewardBadge (string|null)
 *  - onResolved({ won })
 */
export function BattleScene({
  title,
  text,
  opponentTitle,
  opponentTeamIds,
  opponentPower,
  team,
  rewardBadge,
  onResolved,
}) {
  const [result, setResult] = useState(null); // { tactic, won, winChance } | null

  const teamPower = computeTeamPower(team);

  function fight(tactic) {
    const winChance = computeWinChance(teamPower, opponentPower, tactic);
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
    !result &&
      e(
        "div",
        { className: "choice-list" },
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
