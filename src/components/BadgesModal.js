import React, { useState } from "react";
import { GENERATIONS } from "../data/generations.js";
import { useModalA11y } from "../hooks/useModalA11y.js";
import { BadgeItem } from "./TeamPanel.js";

const e = React.createElement;

function BadgeRegionSection({ genName, badges, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return e(
    "div",
    { style: { border: "1px solid var(--panel-alt)", borderRadius: "10px", overflow: "hidden" } },
    e(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        "aria-expanded": open,
        style: {
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          background: "var(--panel-alt)",
          border: "none",
          color: "var(--text)",
          cursor: "pointer",
          fontWeight: "bold",
        },
      },
      e("span", null, `${open ? "▾" : "▸"} ${genName}`),
      e("span", { style: { fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: "normal" } }, `${badges.length}`)
    ),
    open &&
      e(
        "div",
        { style: { padding: "10px" } },
        badges.length === 0
          ? e("p", { className: "empty-hint", style: { margin: 0 } }, "Nessuna medaglia in questa regione.")
          : e("div", { className: "badge-visual-list" }, badges.map((b, idx) => e(BadgeItem, { key: `${b}-${idx}`, name: b })))
      )
  );
}

/**
 * Modale "Tutte le Medaglie": storico multi-regione, raggruppato per
 * generazione con sezioni collassabili — stesso pattern strutturale/visivo
 * già usato in AchievementsModal.js per non inventare un secondo modo di
 * mostrare "N gruppi per regione" nello stesso progetto.
 *
 * Prima di questa modifica, il pannello laterale mostrava solo le medaglie
 * della regione corrente (`state.badges` si azzera cambiando regione) — le
 * regioni completate in precedenza restavano visibili solo finché non si
 * passava alla successiva. Le medaglie delle regioni già completate vivono
 * in `state.badgesByGeneration` (archiviato in checkNextGeneration(),
 * useGameState.js); la regione corrente, non ancora archiviata, usa
 * `state.badges` live.
 *
 * props:
 *  - badges: string[] (medaglie della regione corrente, live)
 *  - badgesByGeneration: { [generationId]: string[] } (regioni completate)
 *  - currentGenerationId: string
 *  - onClose(): callback per chiudere il modale
 */
export function BadgesModal({ badges = [], badgesByGeneration = {}, currentGenerationId, onClose }) {
  const modalRef = useModalA11y(onClose);

  function badgesForRegion(genId) {
    return genId === currentGenerationId ? badges : badgesByGeneration[genId] || [];
  }

  const totalCount = GENERATIONS.reduce((sum, gen) => sum + badgesForRegion(gen.id).length, 0);

  return e(
    "div",
    { className: "modal-overlay", onClick: (ev) => { if (ev.target === ev.currentTarget) onClose(); } },
    e(
      "div",
      {
        className: "modal-card badges-modal",
        ref: modalRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Tutte le Medaglie",
        tabIndex: -1,
        style: { maxWidth: "520px", maxHeight: "80vh", overflowY: "auto" },
      },
      e(
        "div",
        { className: "modal-header" },
        e("h2", { className: "scene-title", style: { margin: 0 } }, "🏅 Tutte le Medaglie"),
        e("button", { className: "modal-close-btn", onClick: onClose, "aria-label": "Chiudi" }, "✕")
      ),
      e(
        "p",
        { className: "scene-text", style: { fontSize: "0.85rem" } },
        `${totalCount} medaglie raccolte in questa run, raggruppate per regione.`
      ),
      e(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        GENERATIONS.map((gen) =>
          e(BadgeRegionSection, {
            key: gen.id,
            genName: gen.name,
            badges: badgesForRegion(gen.id),
            defaultOpen: gen.id === currentGenerationId,
          })
        )
      )
    )
  );
}
