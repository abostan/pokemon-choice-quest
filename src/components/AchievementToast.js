import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { onAchievementUnlocked } from "../engine/achievements.js";

const e = React.createElement;

const DISPLAY_MS = 4000;

/**
 * Toast "🏆 Trofeo sbloccato!" mostrato in alto sullo schermo quando
 * unlockAchievement() sblocca davvero qualcosa (vedi ROADMAP.md Fase 11 —
 * prima nessun componente intercettava il valore di ritorno di
 * unlockAchievement(), quindi lo si scopriva solo aprendo il Medagliere).
 *
 * Da montare una sola volta in App.js: si iscrive globalmente a
 * onAchievementUnlocked() e mette in coda ogni sblocco, da qualunque punto
 * del gioco arrivi (cattura, evoluzione, palestra, oggetto...).
 */
export function AchievementToast() {
  const [queue, setQueue] = useState([]);
  const nextId = useRef(0);

  useEffect(() => {
    return onAchievementUnlocked((achievement) => {
      const id = nextId.current++;
      setQueue((prev) => [...prev, { id, achievement }]);
      setTimeout(() => {
        setQueue((prev) => prev.filter((t) => t.id !== id));
      }, DISPLAY_MS);
    });
  }, []);

  if (queue.length === 0) return null;

  return createPortal(
    e(
      "div",
      { className: "achievement-toast-stack", "aria-live": "polite" },
      queue.map(({ id, achievement }) =>
        e(
          "div",
          { key: id, className: "achievement-toast" },
          e("span", { className: "achievement-toast-icon" }, achievement.icon),
          e(
            "div",
            null,
            e("div", { className: "achievement-toast-label" }, "🏆 Trofeo sbloccato!"),
            e("div", { className: "achievement-toast-title" }, achievement.title)
          )
        )
      )
    ),
    document.body
  );
}
