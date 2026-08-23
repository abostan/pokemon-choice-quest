import React, { useState } from "react";
import { GENERAL_ACHIEVEMENT_LIST, REGION_ACHIEVEMENT_GROUPS, getUnlockedAchievements } from "../engine/achievements.js";
import { useModalA11y } from "../hooks/useModalA11y.js";

const e = React.createElement;

function AchievementRow({ ach, unlocked }) {
  const entry = unlocked[ach.id];
  const isUnlocked = !!entry;
  return e(
    "div",
    {
      key: ach.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        borderRadius: "10px",
        background: isUnlocked ? "rgba(255, 203, 5, 0.1)" : "var(--panel-alt)",
        border: isUnlocked ? "1px solid var(--accent)" : "1px solid transparent",
        opacity: isUnlocked ? 1 : 0.55,
      },
    },
    e(
      "span",
      { style: { fontSize: "1.8rem", filter: isUnlocked ? "none" : "grayscale(1)" } },
      isUnlocked ? ach.icon : "🔒"
    ),
    e(
      "div",
      { style: { flex: 1 } },
      e("div", { style: { fontWeight: "bold" } }, ach.title),
      e("div", { style: { fontSize: "0.8rem", color: "var(--text-dim)" } }, ach.description),
      isUnlocked &&
        e(
          "div",
          { style: { fontSize: "0.72rem", color: "var(--accent)", marginTop: "2px" } },
          `Sbloccato il ${new Date(entry.unlockedAt).toLocaleDateString("it-IT")}`
        )
    )
  );
}

function RegionSection({ group, unlocked }) {
  const [open, setOpen] = useState(false);
  const unlockedCount = group.achievements.filter((a) => unlocked[a.id]).length;

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
      e("span", null, `${open ? "▾" : "▸"} ${group.genName}`),
      e("span", { style: { fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: "normal" } }, `${unlockedCount}/${group.achievements.length}`)
    ),
    open &&
      e(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px", padding: "10px" } },
        group.achievements.map((ach) => e(AchievementRow, { key: ach.id, ach, unlocked }))
      )
  );
}

/**
 * Modale Medagliere Trofei & Achievement — traguardi sbloccabili sull'insieme
 * delle run giocate su questo browser (non per singolo salvataggio).
 *
 * Due sezioni: trofei generali (lista piatta, come prima di questa modifica)
 * e trofei per-regione, raggruppati in sezioni collassabili per tenere
 * leggibile la lista anche con 4 trofei × 9 regioni (vedi ROADMAP.md Fase 11).
 *
 * props:
 *  - onClose(): callback per chiudere il modale
 */
export function AchievementsModal({ onClose }) {
  const modalRef = useModalA11y(onClose);
  const unlocked = getUnlockedAchievements();
  const totalCount = GENERAL_ACHIEVEMENT_LIST.length + REGION_ACHIEVEMENT_GROUPS.reduce((sum, g) => sum + g.achievements.length, 0);
  const unlockedCount = Object.keys(unlocked).length;

  return e(
    "div",
    { className: "modal-overlay", onClick: (ev) => { if (ev.target === ev.currentTarget) onClose(); } },
    e(
      "div",
      {
        className: "modal-card achievements-modal",
        ref: modalRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Medagliere Trofei",
        tabIndex: -1,
        style: { maxWidth: "520px", maxHeight: "80vh", overflowY: "auto" },
      },
      e(
        "div",
        { className: "modal-header" },
        e("h2", { className: "scene-title", style: { margin: 0 } }, "🏆 Medagliere Trofei"),
        e("button", { className: "modal-close-btn", onClick: onClose, "aria-label": "Chiudi" }, "✕")
      ),
      e(
        "p",
        { className: "scene-text", style: { fontSize: "0.85rem" } },
        `${unlockedCount}/${totalCount} sbloccati su questo browser, attraverso tutte le tue run.`
      ),
      e(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" } },
        GENERAL_ACHIEVEMENT_LIST.map((ach) => e(AchievementRow, { key: ach.id, ach, unlocked }))
      ),
      e(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        REGION_ACHIEVEMENT_GROUPS.map((group) => e(RegionSection, { key: group.genId, group, unlocked }))
      )
    )
  );
}
