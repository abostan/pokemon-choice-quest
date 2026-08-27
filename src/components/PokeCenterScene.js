import React, { useState } from "react";
import { playHealJingle } from "../engine/soundEngine.js";
import { ItemIcon } from "./ItemIcon.js";

const e = React.createElement;

const SHOP_ITEMS = [
  {
    name: "Pozione",
    price: 1,
    icon: "🧪",
    description: "Ripristina la salute di base (+10 Potenza in battaglia).",
  },
  {
    name: "Super Pozione",
    price: 2,
    icon: "🧪",
    description: "Ripristina la salute elevata (+18 Potenza in battaglia).",
  },
  {
    name: "Iper Pozione",
    price: 3,
    icon: "💊",
    description: "Ripristina al massimo la potenza della squadra (+24 Potenza in battaglia).",
  },
  {
    name: "Caramella Rara",
    price: 5,
    icon: "🍬",
    description: "Aumenta istantaneamente il livello di tutti i Pokémon di +3 Livelli.",
  },
  {
    name: "Master Ball",
    price: 10,
    icon: "🟣",
    description: "La Poké Ball definitiva. Cattura garantita al 100% per qualsiasi specie!",
  },
  {
    name: "Pallina Esca",
    price: 2,
    icon: "🎯",
    description: "Usabile in un incontro selvatico: +8% probabilità di cattura con Poké Ball/Cibo.",
  },
];

/**
 * Scena Centro Pokémon & Mercatino di Città.
 *
 * props:
 *  - coins: number (Pokédollari attuali)
 *  - team: Array<Pokemon>
 *  - items: Array<string>
 *  - onHealTeam(): callback per curare la squadra
 *  - onBuyItem(itemName, price): callback per acquistare un oggetto
 *  - onLeave(): callback per tornare all'avventura
 */
export function PokeCenterScene({
  coins = 0,
  team = [],
  items = [],
  teamFatigued = false,
  onHealTeam,
  onBuyItem,
  onLeave,
}) {
  const [activeTab, setActiveTab] = useState("center"); // 'center' | 'mart'
  const [healed, setHealed] = useState(false);
  const [message, setMessage] = useState("");

  function handleHeal() {
    const wasFatigued = teamFatigued;
    if (onHealTeam) onHealTeam();
    playHealJingle();
    setHealed(true);
    setMessage(
      wasFatigued
        ? "✨ La tua squadra era affaticata da una sconfitta recente: ora è di nuovo curata e al massimo delle forze (malus -10% Potenza rimosso)!"
        : "✨ La tua squadra è stata completamente curata ed è in perfetta forma!"
    );
  }

  function handleBuy(shopItem) {
    if (coins < shopItem.price) {
      setMessage(`⚠️ Non hai abbastanza Pokédollari per acquistare ${shopItem.name} (${shopItem.price} 💰 necessari).`);
      return;
    }
    if (onBuyItem) onBuyItem(shopItem.name, shopItem.price);
    setMessage(`✅ Hai acquistato ${shopItem.icon} ${shopItem.name} per ${shopItem.price} Pokédollari!`);
  }

  return e(
    "div",
    { className: "panel pokecenter-panel" },
    e(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
      e("h2", { className: "scene-title", style: { margin: 0 } }, "🏥 Centro Pokémon & Mercatino di Città"),
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

    // Tab Bar
    e(
      "div",
      { style: { display: "flex", gap: "10px", marginBottom: "20px" } },
      e(
        "button",
        {
          className: activeTab === "center" ? "btn btn-primary" : "btn btn-secondary",
          onClick: () => setActiveTab("center"),
        },
        "🏥 Infermeria Pokémon"
      ),
      e(
        "button",
        {
          className: activeTab === "mart" ? "btn btn-primary" : "btn btn-secondary",
          onClick: () => setActiveTab("mart"),
        },
        "🏪 PokéMart Mercatino"
      )
    ),

    // Messaggio di notifica
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

    // Sezione Infermeria
    activeTab === "center" &&
      e(
        "div",
        { className: "pokecenter-nurse-box", style: { textAlign: "center", padding: "20px 10px" } },
        e("div", { style: { fontSize: "3.5rem", marginBottom: "10px" } }, "👩‍⚕️"),
        e("h3", { style: { color: "#fff", marginBottom: "8px" } }, "Infermera Joy"),
        e(
          "p",
          { style: { color: "var(--text-dim)", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 20px auto" } },
          "«Benvenuto al Centro Pokémon! Possiamo rimettere in sesto la tua squadra ed energizzarla per la prossima palestra!»"
        ),
        e(
          "button",
          {
            className: "btn btn-success",
            onClick: handleHeal,
            disabled: healed,
            style: { padding: "12px 24px", fontSize: "1.05rem", fontWeight: "bold" },
          },
          healed ? "✨ Squadra in Forma!" : teamFatigued ? "😓 Cura la Squadra Affaticata (Gratis)" : "🏥 Cura la Squadra (Gratis)"
        )
      ),

    // Sezione Mercatino PokéMart
    activeTab === "mart" &&
      e(
        "div",
        { className: "pokemart-box" },
        e("h3", { style: { color: "#fff", marginBottom: "12px" } }, "🛒 Strumenti & Scorte Disponibili"),
        e(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px" } },
          SHOP_ITEMS.map((item) =>
            e(
              "div",
              {
                key: item.name,
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
                e("span", { style: { fontSize: "1.5rem" } }, e(ItemIcon, { name: item.name, fallbackEmoji: item.icon, size: 28 })),
                e(
                  "div",
                  null,
                  e("div", { style: { fontWeight: "bold", color: "#fff" } }, item.name),
                  e("div", { style: { fontSize: "0.8rem", color: "var(--text-dim)" } }, item.description)
                )
              ),
              e(
                "button",
                {
                  className: "btn btn-secondary btn-sm",
                  onClick: () => handleBuy(item),
                  disabled: coins < item.price,
                  style: { flexShrink: 0 },
                },
                `💰 ${item.price} Coin`
              )
            )
          )
        )
      ),

    // Bottone di Uscita
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
