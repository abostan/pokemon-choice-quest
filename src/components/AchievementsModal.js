import React from "react";
import { ACHIEVEMENTS, getUnlockedAchievements } from "../engine/achievements.js";
import { useModalA11y } from "../hooks/useModalA11y.js";

const e = React.createElement;

/**
 * Modale Medagliere Trofei & Achievement — traguardi sbloccabili sull'insieme
 * delle run giocate su questo browser (non per singolo salvataggio).
 *
 * props:
 *  - onClose(): callback per chiudere il modale
 */
export function AchievementsModal({ onClose }) {
  const modalRef = useModalA11y(onClose);
  const unlocked = getUnlockedAchievements();
  const list = Object.values(ACHIEVEMENTS);
  const unlockedCount = list.filter((a) => unlocked[a.id]).length;

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
        style: { maxWidth: "520px" },
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
        `${unlockedCount}/${list.length} sbloccati su questo browser, attraverso tutte le tue run.`
      ),
      e(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "10px" } },
        list.map((ach) => {
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
        })
      )
    )
  );
}
