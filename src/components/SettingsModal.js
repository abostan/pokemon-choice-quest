import React, { useState } from "react";
import { SHINY_RATE_MODES, getShinyRateMode, setShinyRateMode } from "../engine/settings.js";
import { useModalA11y } from "../hooks/useModalA11y.js";

const e = React.createElement;

/**
 * Modale Impostazioni. Per ora contiene solo il tasso di Shiny — le voci
 * "velocità animazioni" e "selettore lingua" del backlog restano da fare
 * a parte (richiedono rispettivamente un sistema di animazione e una
 * traduzione completa del gioco, sforzi molto più grandi).
 *
 * props:
 *  - onClose(): callback per chiudere il modale
 */
export function SettingsModal({ onClose }) {
  const modalRef = useModalA11y(onClose);
  const [shinyMode, setShinyModeState] = useState(() => getShinyRateMode());

  function handleShinyChange(mode) {
    setShinyRateMode(mode);
    setShinyModeState(mode);
  }

  return e(
    "div",
    { className: "modal-overlay", onClick: (ev) => { if (ev.target === ev.currentTarget) onClose(); } },
    e(
      "div",
      {
        className: "modal-card settings-modal",
        ref: modalRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Impostazioni",
        tabIndex: -1,
        style: { maxWidth: "440px" },
      },
      e(
        "div",
        { className: "modal-header" },
        e("h2", { className: "scene-title", style: { margin: 0 } }, "⚙️ Impostazioni"),
        e("button", { className: "modal-close-btn", onClick: onClose, "aria-label": "Chiudi" }, "✕")
      ),
      e("h3", { style: { fontSize: "0.9rem", color: "var(--text-dim)", margin: "0 0 8px" } }, "✨ Tasso di Shiny"),
      e(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        Object.entries(SHINY_RATE_MODES).map(([mode, cfg]) =>
          e(
            "label",
            {
              key: mode,
              style: {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                background: shinyMode === mode ? "rgba(255, 203, 5, 0.12)" : "var(--panel-alt)",
                border: shinyMode === mode ? "1px solid var(--accent)" : "1px solid transparent",
                cursor: "pointer",
              },
            },
            e("input", {
              type: "radio",
              name: "shiny-rate",
              checked: shinyMode === mode,
              onChange: () => handleShinyChange(mode),
            }),
            e("span", null, cfg.label)
          )
        )
      ),
      e(
        "p",
        { className: "scene-text", style: { fontSize: "0.78rem", marginTop: "14px", marginBottom: 0 } },
        "Si applica ai prossimi incontri selvatici. Altre impostazioni (velocità animazioni, lingua) arriveranno più avanti."
      )
    )
  );
}
