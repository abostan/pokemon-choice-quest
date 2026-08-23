import React, { useState } from "react";
import { createPortal } from "react-dom";

const e = React.createElement;

const EMOJI_SETS = {
  sparkle: ["✨", "⭐", "💫"],
  confetti: ["🎉", "🎊", "🟡", "🟠", "💛"],
};

/**
 * Effetto particellare "spara e dimentica" (vedi ROADMAP.md Fase 5):
 * brillantini per catture Shiny/evoluzioni, coriandoli per vittorie
 * importanti. Nessuna dipendenza esterna — puro CSS + emoji.
 *
 * Da montare condizionalmente (`show && e(ParticleBurst, {...})`) nel punto
 * dell'albero React dove scatta l'evento. Renderizzato via createPortal
 * direttamente su document.body: un `position: fixed` da solo NON basta a
 * garantire la copertura dell'intero schermo se un antenato ha
 * filter/backdrop-filter/transform (crea un nuovo "containing block" per i
 * discendenti fixed, intrappolandoli in quel riquadro invece che nel
 * viewport — capitato con `.evo-overlay` che ha `backdrop-filter: blur()`).
 * Il portal rende l'effetto immune a questo genere di antenato, qualunque
 * sia il punto dell'albero da cui viene invocato.
 *
 * props:
 *  - type: "sparkle" | "confetti"
 *  - count: numero di particelle (default 24)
 */
export function ParticleBurst({ type = "sparkle", count = 24 }) {
  const [particles] = useState(() => {
    const emojis = EMOJI_SETS[type] || EMOJI_SETS.sparkle;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.3 + Math.random() * 0.9,
      size: 14 + Math.random() * 16,
    }));
  });

  return createPortal(
    e(
      "div",
      { className: "particle-burst-overlay", "aria-hidden": "true" },
      particles.map((p) =>
        e(
          "span",
          {
            key: p.id,
            className: "particle",
            style: {
              left: `${p.left}%`,
              fontSize: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            },
          },
          p.emoji
        )
      )
    ),
    document.body
  );
}
