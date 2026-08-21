import React, { useState } from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

/**
 * Modale di gestione Box: permette di scambiare un Pokémon della squadra
 * attiva con uno nel Box.
 *
 * props:
 *  - team: Array<{id, level}>
 *  - box: Array<{id, level}>
 *  - onSwap(teamIdx, boxIdx): callback che esegue lo swap
 *  - onClose(): chiude il modale
 */
export function BoxModal({ team, box, onSwap, onClose }) {
  const [selectedBox, setSelectedBox] = useState(null);   // indice nel box selezionato
  const [selectedTeam, setSelectedTeam] = useState(null); // indice nel team selezionato

  function handleBoxClick(idx) {
    if (box[idx]?.isFainted) return; // Morte permanente Nuzlocke!
    if (selectedTeam !== null) {
      // Ho già selezionato un membro della squadra → esegui swap
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
      // Ho già selezionato un Pokémon dal box → esegui swap
      onSwap(idx, selectedBox);
      setSelectedTeam(null);
      setSelectedBox(null);
    } else {
      setSelectedTeam(idx === selectedTeam ? null : idx);
    }
  }

  const hint =
    selectedBox !== null
      ? "Seleziona un Pokémon della squadra con cui scambiarlo"
      : selectedTeam !== null
      ? "Seleziona un Pokémon dal Box con cui scambiarlo"
      : "Clicca su un Pokémon per selezionarlo, poi clicca sull'altro per scambiare";

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
                    onClick: () => handleTeamClick(idx),
                  },
                  e(PokemonChip, { id: p.id, level: p.level, isShiny: p.isShiny })
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
                    style: p.isFainted ? { opacity: 0.5, border: "1px dashed #ef4444", cursor: "not-allowed" } : {},
                    onClick: () => handleBoxClick(idx),
                  },
                  e(PokemonChip, { id: p.id, level: p.level, isShiny: p.isShiny }),
                  p.isFainted && e("span", { style: { fontSize: "0.72rem", color: "#f87171", fontWeight: "bold" } }, "⚰️ Esausto")
                )
              )
        )
      ),

      e("button", { className: "resume-new-btn", style: { marginTop: "16px" }, onClick: onClose }, "Chiudi")
    )
  );
}
