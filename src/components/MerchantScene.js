import React, { useState } from "react";
import { getItemDescription } from "../data/items.js";
import { ItemIcon } from "./ItemIcon.js";

const e = React.createElement;

/**
 * Scena Mercante Ambulante: vera vetrina con scelta e prezzo per oggetto,
 * al contrario del vecchio comportamento che assegnava un oggetto casuale gratis.
 *
 * props:
 *  - coins: number (Pokédollari attuali)
 *  - pool: Array<{ name: string, price: number }>
 *  - onBuyItem(itemName, price): callback per acquistare un oggetto
 *  - onLeave(): callback per tornare all'avventura
 */
export function MerchantScene({ coins = 0, pool = [], onBuyItem, onLeave }) {
  const [message, setMessage] = useState("");

  function handleBuy(entry) {
    if (coins < entry.price) {
      setMessage(`⚠️ Non hai abbastanza Pokédollari per ${entry.name} (${entry.price} 💰 necessari).`);
      return;
    }
    if (onBuyItem) onBuyItem(entry.name, entry.price);
    setMessage(`✅ Hai acquistato ${entry.name} per ${entry.price} Pokédollari!`);
  }

  return e(
    "div",
    { className: "panel pokecenter-panel" },
    e(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
      e("h2", { className: "scene-title", style: { margin: 0 } }, "🛒 Mercante Ambulante di Strumenti Rari"),
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

    e(
      "p",
      { className: "scene-text", style: { marginBottom: "16px" } },
      "«Passavo di qui per caso... dai un'occhiata alla mia merce, forse trovi qualcosa di utile!»"
    ),

    message &&
      e(
        "div",
        {
          style: {
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(34, 197, 94, 0.15)",
            border: "1px solid var(--success)",
            color: "#86efac",
            fontSize: "0.9rem",
            marginBottom: "16px",
          },
        },
        message
      ),

    e(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "10px" } },
      pool.map((entry) =>
        e(
          "div",
          {
            key: entry.name,
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              background: "rgba(30, 41, 59, 0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "10px 14px",
              borderRadius: "8px",
            },
          },
          e(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "10px", flex: "1 1 auto", minWidth: 0 } },
            e("span", { style: { fontSize: "1.5rem" } }, e(ItemIcon, { name: entry.name, size: 28 })),
            e(
              "div",
              null,
              e("div", { style: { fontWeight: "bold", color: "#fff" } }, entry.name),
              e("div", { style: { fontSize: "0.8rem", color: "var(--text-dim)" } }, getItemDescription(entry.name))
            )
          ),
          e(
            "button",
            {
              className: "btn btn-secondary btn-sm",
              onClick: () => handleBuy(entry),
              disabled: coins < entry.price,
              style: { flexShrink: 0 },
            },
            `💰 ${entry.price} Coin`
          )
        )
      )
    ),

    e(
      "div",
      { style: { marginTop: "24px", textAlign: "right" } },
      e(
        "button",
        {
          className: "btn btn-primary",
          onClick: onLeave,
          style: { padding: "10px 20px" },
        },
        "Riprendi il Cammino ➔"
      )
    )
  );
}
