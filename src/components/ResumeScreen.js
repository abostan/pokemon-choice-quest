import React, { useState, useRef } from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

/**
 * Single Slot Card component
 */
function SlotCard({ slotId, data, isSelected, onSelect, onResume, onNewGame, onDelete, onExport, onImport }) {
  const fileInputRef = useRef(null);

  const hasData = !!data;
  const savedState = data?.state ?? {};
  const dateStr = data?.savedAt
    ? new Date(data.savedAt).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const genName = savedState.generationId
    ? savedState.generationId.charAt(0).toUpperCase() + savedState.generationId.slice(1)
    : "—";

  const gymText =
    savedState.phase === "eliteBattle" || savedState.phase === "championBattle"
      ? "Alto Comando / Campione"
      : savedState.phase === "postgameExplore" || savedState.phase === "postgame"
      ? "Modalità infinita"
      : savedState.gymIndex != null
      ? `Palestra ${savedState.gymIndex + 1}`
      : "Inizio avventura";

  const teamSize = (savedState.team || []).length;
  const maxLevel = teamSize > 0 ? Math.max(...(savedState.team || []).map((p) => p.level)) : 0;

  function handleFileChange(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImport(slotId, e.target?.result);
    };
    reader.readAsText(file);
    ev.target.value = "";
  }

  return e(
    "div",
    {
      className: `slot-card ${isSelected ? "selected" : ""} ${!hasData ? "empty" : ""}`,
      onClick: () => onSelect(slotId),
    },
    e(
      "div",
      { className: "slot-header" },
      e("span", { className: "slot-title" }, `💾 Slot ${slotId}`),
      hasData ? e("span", { className: "slot-date" }, dateStr) : e("span", { className: "slot-empty-tag" }, "Vuoto")
    ),

    hasData
      ? e(
          "div",
          { className: "slot-details" },
          e(
            "div",
            { className: "resume-summary" },
            e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Regione"), e("span", null, genName)),
            e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Progresso"), e("span", null, gymText)),
            e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Pokémon"), e("span", null, `${teamSize} in squadra`)),
            e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Livello max"), e("span", null, maxLevel > 0 ? `Lv${maxLevel}` : "—"))
          ),
          teamSize > 0 &&
            e(
              "div",
              { className: "resume-team", style: { marginTop: "10px" } },
              e(
                "div",
                { className: "team-list", style: { flexWrap: "wrap", gap: "6px" } },
                (savedState.team || []).map((p, idx) =>
                  e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level, isShiny: p.isShiny })
                )
              )
            )
        )
      : e(
          "div",
          { className: "slot-empty-info" },
          e("p", { className: "empty-hint" }, "Nessuna partita salvata su questo slot.")
        ),

    isSelected &&
      e(
        "div",
        { className: "slot-actions", onClick: (ev) => ev.stopPropagation() },
        hasData
          ? [
              e("button", { key: "resume", className: "continue-btn", onClick: () => onResume(slotId) }, "▶ Riprendi partita"),
              e("button", { key: "export", className: "slot-action-btn", onClick: () => onExport(slotId) }, "📤 Esporta Backup JSON"),
              e("button", { key: "delete", className: "slot-action-btn danger", onClick: () => onDelete(slotId) }, "🗑 Elimina Slot"),
            ]
          : [
              e("button", { key: "new", className: "continue-btn", onClick: () => onNewGame(slotId) }, "🎮 Nuova Partita"),
              e("button", { key: "import", className: "slot-action-btn", onClick: () => fileInputRef.current?.click() }, "📥 Importa Backup JSON"),
              e("input", {
                key: "file-input",
                type: "file",
                accept: ".json",
                ref: fileInputRef,
                style: { display: "none" },
                onChange: handleFileChange,
              }),
            ]
      )
  );
}

/**
 * Schermata mostrata all'avvio: gestione dei 3 Slot di Salvataggio e Backup JSON.
 */
export function ResumeScreen({ slots, selectedSlotId, onSelectSlot, onResume, onNewGame, onDeleteSlot, onExportSlot, onImportSlot }) {
  const [selectedSlot, setSelectedSlot] = useState(selectedSlotId || 1);

  function handleSelect(id) {
    setSelectedSlot(id);
    if (onSelectSlot) onSelectSlot(id);
  }

  return e(
    "div",
    { className: "panel resume-screen-multi" },
    e("div", { className: "resume-icon" }, "💾"),
    e("h2", { className: "scene-title" }, "Gestione Salvataggi"),
    e("p", { className: "scene-text" }, "Seleziona uno dei 3 slot per continuare o iniziare una nuova avventura."),

    e(
      "div",
      { className: "slots-grid" },
      slots.map((slot) =>
        e(SlotCard, {
          key: slot.slotId,
          slotId: slot.slotId,
          data: slot.data,
          isSelected: selectedSlot === slot.slotId,
          onSelect: handleSelect,
          onResume: onResume,
          onNewGame: onNewGame,
          onDelete: onDeleteSlot,
          onExport: onExportSlot,
          onImport: onImportSlot,
        })
      )
    )
  );
}
