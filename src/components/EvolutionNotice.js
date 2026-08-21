import React, { useEffect, useState } from "react";
import { usePokemon } from "../hooks/usePokemon.js";

const e = React.createElement;

/**
 * Componente singola evoluzione: sprite before → sprite after.
 */
function EvoCard({ fromId, toId }) {
  const { data: fromData } = usePokemon(fromId);
  const { data: toData } = usePokemon(toId);

  const fromName = fromData?.name ?? `#${fromId}`;
  const toName = toData?.name ?? `#${toId}`;

  return e(
    "div",
    { className: "evo-card" },
    e(
      "div",
      { className: "evo-before" },
      fromData?.sprite && e("img", { src: fromData.sprite, alt: fromName }),
      e("span", { className: "evo-name" }, fromName)
    ),
    e("div", { className: "evo-arrow" }, "→"),
    e(
      "div",
      { className: "evo-after" },
      toData?.sprite && e("img", { src: toData.sprite, alt: toName }),
      e("span", { className: "evo-name evo-name-new" }, toName)
    )
  );
}

/**
 * Banner/overlay che appare dopo una battaglia se uno o più Pokémon
 * del team sono evoluti.
 *
 * props:
 *  - evolutions: Array<{ evolvedFrom: number, id: number, level: number }>
 *    — lista dei Pokémon che hanno appena evoluto (id è il nuovo id,
 *      evolvedFrom è il vecchio id)
 *  - onDismiss(): callback per chiudere e proseguire
 */
export function EvolutionNotice({ evolutions, onDismiss }) {
  const [visible, setVisible] = useState(false);

  // Animazione di ingresso
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  if (!evolutions || evolutions.length === 0) return null;

  return e(
    "div",
    { className: `evo-overlay ${visible ? "evo-visible" : ""}` },
    e(
      "div",
      { className: "evo-panel" },
      e("div", { className: "evo-sparkle" }, "✨"),
      e("h2", { className: "scene-title", style: { textAlign: "center" } }, "Evoluzione!"),
      e(
        "p",
        { className: "scene-text", style: { textAlign: "center" } },
        evolutions.length === 1
          ? "Un membro del tuo team si è evoluto!"
          : `${evolutions.length} membri del tuo team si sono evoluti!`
      ),
      e(
        "div",
        { className: "evo-list" },
        evolutions.map((p, idx) =>
          e(EvoCard, { key: idx, fromId: p.evolvedFrom, toId: p.id })
        )
      ),
      e(
        "button",
        { className: "continue-btn", style: { marginTop: "20px" }, onClick: onDismiss },
        "Continua"
      )
    )
  );
}
