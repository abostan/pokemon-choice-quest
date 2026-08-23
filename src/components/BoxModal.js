import React, { useState } from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

/**
 * Modale di gestione Box: permette di scambiare, ritirare o depositare Pokémon.
 */
export function BoxModal({ team, box, onSwap, onWithdraw, onDeposit, onClose }) {
  const [selectedBox, setSelectedBox] = useState(null);   // indice nel box selezionato
  const [selectedTeam, setSelectedTeam] = useState(null); // indice nel team selezionato

  function handleBoxClick(idx) {
    if (box[idx]?.isFainted) return; // Nuzlocke fainted!
    if (selectedTeam !== null) {
      onSwap(selectedTeam, idx);
      setSelectedTeam(null);
      setSelectedBox(null);
    } else {
      setSelectedBox(idx === selectedBox ? null : idx);
    }
  }

  function handleTeamClick(idx) {
    if (selectedBox !== null) {
      if (box[selectedBox]?.isFainted) return;
      onSwap(idx, selectedBox);
      setSelectedTeam(null);
      setSelectedBox(null);
    } else {
      setSelectedTeam(idx === selectedTeam ? null : idx);
    }
  }

  const hint =
    selectedBox !== null
      ? "Seleziona un Pokémon della squadra con cui scambiarlo, oppure usa il tasto Ritira"
      : selectedTeam !== null
      ? "Seleziona un Pokémon dal Box con cui scambiarlo, oppure usa il tasto Deposita"
      : "Clicca su un Pokémon per selezionarlo o usa le azioni rapide Deposita / Ritira";

  return e(
    "div",
    { className: "modal-overlay", onClick: (ev) => { if (ev.target === ev.currentTarget) onClose(); } },
    e(
      "div",
      { className: "modal-card box-modal" },
      // Header
      e(
        "div",
        { className: "modal-header" },
        e("h2", { className: "scene-title", style: { margin: 0 } }, "📦 Gestione Box"),
        e("button", { className: "modal-close-btn", onClick: onClose, "aria-label": "Chiudi" }, "✕")
      ),
      e("p", { className: "box-hint" }, hint),

      // Layout a due colonne
      e(
        "div",
        { className: "box-layout" },

        // Colonna squadra attiva
        e(
          "div",
          { className: "box-column" },
          e("h3", { className: "box-col-title" }, `Squadra (${team.length}/6)`),
          team.length === 0
            ? e("p", { className: "empty-hint" }, "Squadra vuota.")
            : team.map((p, idx) =>
                e(
                  "div",
                  {
                    key: `team-${p.id}-${idx}`,
                    className: `box-slot ${selectedTeam === idx ? "selected" : ""}`,
                    style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" },
                  },
                  e(
                    "div",
                    { onClick: () => handleTeamClick(idx), style: { flex: 1, cursor: "pointer" } },
                    e(PokemonChip, { id: p.id, level: p.level, isShiny: p.isShiny })
                  ),
                  onDeposit && team.length > 1 &&
                    e(
                      "button",
                      {
                        className: "mini-swap-btn",
                        title: "Deposita nel Box",
                        style: { background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", color: "#fca5a5", fontSize: "0.7rem", padding: "2px 6px", borderRadius: "4px", cursor: "pointer", marginLeft: "6px" },
                        onClick: (ev) => {
                          ev.stopPropagation();
                          onDeposit(idx);
                          setSelectedTeam(null);
                        },
                      },
                      "📤 Deposita"
                    )
                )
              )
        ),

        // Separatore
        e("div", { className: "box-divider" }, "⇄"),

        // Colonna box
        e(
          "div",
          { className: "box-column" },
          e("h3", { className: "box-col-title" }, `Box (${box.length})`),
          box.length === 0
            ? e("p", { className: "empty-hint" }, "Box vuoto.")
            : box.map((p, idx) =>
                e(
                  "div",
                  {
                    key: `box-${p.id}-${idx}`,
                    className: `box-slot ${selectedBox === idx ? "selected" : ""} ${p.isFainted ? "fainted-slot" : ""}`,
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      opacity: p.isFainted ? 0.5 : 1,
                      border: p.isFainted ? "1px dashed #ef4444" : undefined,
                    },
                  },
                  e(
                    "div",
                    { onClick: () => handleBoxClick(idx), style: { flex: 1, cursor: p.isFainted ? "not-allowed" : "pointer" } },
                    e(PokemonChip, { id: p.id, level: p.level, isShiny: p.isShiny }),
                    p.isFainted && e("span", { style: { fontSize: "0.72rem", color: "#f87171", fontWeight: "bold", marginLeft: "4px" } }, "⚰️ Esausto")
                  ),
                  onWithdraw && !p.isFainted && team.length < 6 &&
                    e(
                      "button",
                      {
                        className: "mini-swap-btn",
                        title: "Ritira in Squadra",
                        style: { background: "rgba(34, 197, 94, 0.2)", border: "1px solid #22c55e", color: "#86efac", fontSize: "0.7rem", padding: "2px 6px", borderRadius: "4px", cursor: "pointer", marginLeft: "6px" },
                        onClick: (ev) => {
                          ev.stopPropagation();
                          onWithdraw(idx);
                          setSelectedBox(null);
                        },
                      },
                      "📥 Ritira"
                    )
                )
              )
        )
      ),

      e("button", { className: "resume-new-btn", style: { marginTop: "16px" }, onClick: onClose }, "Chiudi")
    )
  );
}
