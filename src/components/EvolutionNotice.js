import React, { useEffect, useState } from "react";
import { usePokemon } from "../hooks/usePokemon.js";
import { ParticleBurst } from "./ParticleBurst.js";
import { playPokemonCry } from "../engine/soundEngine.js";

const e = React.createElement;

/**
 * Componente singola evoluzione con opzione per accettare o annullare.
 */
function EvoCard({ fromId, toId, accepted, onToggle }) {
  const { data: fromData } = usePokemon(fromId);
  const { data: toData } = usePokemon(toId);

  const fromName = fromData?.name ?? `#${fromId}`;
  const toName = toData?.name ?? `#${toId}`;

  // Verso della nuova forma, solo se l'evoluzione è (ancora) accettata —
  // se il giocatore la blocca col Tasto B non ha senso farglielo sentire.
  useEffect(() => {
    if (accepted && toData?.cry) playPokemonCry(toData.cry);
  }, [accepted, toData?.cry]);

  return e(
    "div",
    { className: `evo-card-box ${!accepted ? "evo-rejected" : ""}` },
    e(
      "div",
      { className: "evo-card" },
      e(
        "div",
        { className: "evo-before" },
        fromData?.sprite && e("img", { src: fromData.sprite, alt: fromName }),
        e("span", { className: "evo-name" }, fromName)
      ),
      e("div", { className: "evo-arrow" }, accepted ? "→" : "✕"),
      e(
        "div",
        { className: "evo-after" },
        toData?.sprite && e("img", { src: toData.sprite, alt: toName, style: !accepted ? { opacity: 0.35, filter: "grayscale(1)" } : {} }),
        e("span", { className: `evo-name ${accepted ? "evo-name-new" : ""}` }, accepted ? toName : "Bloccata")
      )
    ),
    e(
      "button",
      {
        className: `evo-toggle-btn ${!accepted ? "canceled" : ""}`,
        onClick: onToggle,
        title: accepted ? "Premi B per bloccare l'evoluzione" : "Ripristina l'evoluzione",
      },
      accepted ? "Annulla evoluzione (Tasto B)" : "Permetti evoluzione"
    )
  );
}

/**
 * Banner/overlay che appare dopo una battaglia se uno o più Pokémon
 * del team sono evoluti. Permette di accettare o rifiutare ogni evoluzione.
 *
 * props:
 *  - evolutions: Array<{ evolvedFrom: number, id: number, level: number }>
 *  - onDismiss(rejectedItems): callback per applicare le decisioni e proseguire
 */
export function EvolutionNotice({ evolutions, onDismiss }) {
  const [visible, setVisible] = useState(false);
  // Mappa dell'accettazione per ciascuna evoluzione [idx]: boolean (true = accetta, false = rifiuta)
  const [decisions, setDecisions] = useState(() => evolutions ? evolutions.map(() => true) : []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  if (!evolutions || evolutions.length === 0) return null;

  function toggleDecision(idx) {
    setDecisions((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }

  function handleConfirm() {
    // Raccoglie la lista delle evoluzioni rifiutate dall'utente
    const rejected = evolutions.filter((_, idx) => !decisions[idx]);
    onDismiss(rejected);
  }

  return e(
    "div",
    { className: `evo-overlay ${visible ? "evo-visible" : ""}` },
    visible && e(ParticleBurst, { type: "sparkle", count: 18 }),
    e(
      "div",
      { className: "evo-panel" },
      e("div", { className: "evo-sparkle" }, "✨"),
      e("h2", { className: "scene-title", style: { textAlign: "center" } }, "Evoluzione!"),
      e(
        "p",
        { className: "scene-text", style: { textAlign: "center" } },
        evolutions.length === 1
          ? "Un membro del tuo team sta per evolversi! Puoi lasciarlo evolvere o bloccarlo."
          : `${evolutions.length} membri del tuo team stanno per evolversi!`
      ),
      e(
        "div",
        { className: "evo-list" },
        evolutions.map((p, idx) =>
          e(EvoCard, {
            key: idx,
            fromId: p.evolvedFrom,
            toId: p.id,
            accepted: decisions[idx] ?? true,
            onToggle: () => toggleDecision(idx),
          })
        )
      ),
      e(
        "button",
        { className: "continue-btn", style: { marginTop: "20px" }, onClick: handleConfirm },
        "Conferma e Continua"
      )
    )
  );
}
