import React, { useState } from "react";
import { CASINO_STAKES } from "../engine/casinoLogic.js";

const e = React.createElement;

const TIER_MESSAGES = {
  jackpot: (stake) => `🎉 JACKPOT! Hai catturato un Pokémon raro, vinto una Master Ball e ${stake * 3} Pokédollari!`,
  mid: (stake) => `✨ Piccola vincita! Hai ottenuto una Caramella Rara e ${Math.round(stake * 0.5)} Pokédollari.`,
  loss: (stake) => `😅 Niente vincita questa volta... hai perso ${stake} Pokédollari, ma la squadra si allena comunque (+1 Livello).`,
};

/**
 * Scena Casinò Razzo & Sala Giochi: vera puntata scelta dal giocatore prima
 * del roll, al contrario del vecchio comportamento a probabilità fisse senza
 * alcuna decisione.
 *
 * props:
 *  - coins: number (Pokédollari attuali)
 *  - onPlay(stake): esegue il roll e gli effetti collaterali (oggetti,
 *    cattura, monete), restituisce { tier, coinsDelta }
 *  - onLeave(): callback per tornare all'avventura dopo aver visto l'esito
 */
export function CasinoScene({ coins = 0, onPlay, onLeave }) {
  const [outcome, setOutcome] = useState(null);

  function handlePlay(stake) {
    if (coins < stake) return;
    const result = onPlay(stake);
    setOutcome({ tier: result.tier, stake });
  }

  return e(
    "div",
    { className: "panel pokecenter-panel" },
    e(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
      e("h2", { className: "scene-title", style: { margin: 0 } }, "🎰 Casinò Razzo & Sala Giochi"),
      e(
        "div",
        {
          style: {
            background: "rgba(251, 191, 36, 0.2)",
            border: "1px solid var(--gold)",
            color: "var(--gold-light)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontWeight: "bold",
            fontSize: "0.95rem",
          },
        },
        `💰 ${coins} Pokédollari`
      )
    ),

    !outcome
      ? e(
          "div",
          null,
          e(
            "p",
            { className: "scene-text", style: { marginBottom: "16px" } },
            "«Fai girare le slot machine! Scegli quanto puntare: più rischi, più vinci.»"
          ),
          e(
            "div",
            { style: { display: "flex", gap: "12px", flexWrap: "wrap" } },
            CASINO_STAKES.map((stake) =>
              e(
                "button",
                {
                  key: stake,
                  className: "btn btn-secondary",
                  disabled: coins < stake,
                  onClick: () => handlePlay(stake),
                  style: { flex: "1 1 120px", padding: "14px", fontSize: "1.05rem", fontWeight: "bold" },
                },
                `💰 Punta ${stake}`
              )
            )
          )
        )
      : e(
          "div",
          null,
          e(
            "div",
            {
              style: {
                padding: "14px 16px",
                borderRadius: "8px",
                background: outcome.tier === "loss" ? "rgba(239, 68, 68, 0.12)" : "rgba(34, 197, 94, 0.15)",
                border: `1px solid ${outcome.tier === "loss" ? "var(--danger)" : "var(--success)"}`,
                fontSize: "0.95rem",
                marginBottom: "16px",
              },
            },
            TIER_MESSAGES[outcome.tier](outcome.stake)
          ),
          e(
            "div",
            { style: { textAlign: "right" } },
            e(
              "button",
              { className: "btn btn-primary", onClick: onLeave, style: { padding: "10px 20px" } },
              "Riprendi il Cammino ➔"
            )
          )
        )
  );
}
