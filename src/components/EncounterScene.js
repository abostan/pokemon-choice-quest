import React, { useMemo, useState } from "react";
import { PokemonPreview } from "./PokemonSprite.js";
import { computeCaptureChance, rollCapture } from "../engine/battleLogic.js";

const e = React.createElement;

/**
 * Scena di incontro con un Pokémon selvatico.
 *
 * props:
 *  - title, text: testo di intro
 *  - pool: array di id tra cui pescare il Pokémon incontrato
 *  - level: livello assegnato al Pokémon se catturato
 *  - isLegendary: bool — se true, restringe le opzioni e abbassa il tasso
 *  - onSeen(id): chiamata quando il Pokémon è rivelato (per il Pokédex)
 *  - onCaught(id): chiamata quando il Pokémon è catturato (per il Pokédex)
 *  - onResolved({ caught, pokemon }): chiamata quando la scena finisce
 */
export function EncounterScene({ title, text, pool, level = 4, isLegendary = false, onSeen, onCaught, onResolved }) {
  const wildId = useMemo(() => {
    const id = pool[Math.floor(Math.random() * pool.length)];
    // Notifica Pokédex: visto
    if (onSeen) onSeen(id);
    return id;
  }, [pool]); // eslint-disable-line react-hooks/exhaustive-deps

  const [result, setResult] = useState(null); // { method, success } | null

  // I leggendari hanno un tasso base ridotto e non accettano cibo
  const baseRate = isLegendary ? 0.10 : 0.55;

  function attemptCapture(method) {
    const chance = computeCaptureChance(method, baseRate);
    const success = rollCapture(chance);
    if (success && onCaught) onCaught(wildId);
    setResult({ method, success, chance });
  }

  function handleContinue() {
    if (result?.success) {
      onResolved({ caught: true, pokemon: { id: wildId, level } });
    } else {
      onResolved({ caught: false, pokemon: null });
    }
  }

  return e(
    "div",
    { className: `panel ${isLegendary ? "encounter-legendary" : ""}` },
    e("h2", { className: "scene-title" }, title),
    e("p", { className: "scene-text" }, text),
    isLegendary && e(
      "div",
      { className: "legendary-badge" },
      "⭐ Incontro leggendario — probabilità di cattura ridotta!"
    ),
    e(PokemonPreview, { id: wildId }),
    !result &&
      e(
        "div",
        { className: "choice-list", style: { marginTop: "16px" } },
        e(
          "button",
          { className: "choice-btn", onClick: () => attemptCapture("ball") },
          e("span", null, "Lancia una Poké Ball"),
          e("span", { className: "choice-hint" },
            isLegendary
              ? "Solo il 10% di probabilità — i leggendari non si arrendono facilmente"
              : "Metodo affidabile, probabilità nella media"
          )
        ),
        !isLegendary && e(
          "button",
          { className: "choice-btn", onClick: () => attemptCapture("food") },
          e("span", null, "Prova ad addolcirlo con del cibo"),
          e("span", { className: "choice-hint" }, "Probabilità di successo più alta")
        ),
        e(
          "button",
          { className: "choice-btn", onClick: () => onResolved({ caught: false, pokemon: null }) },
          e("span", null, "Ignora e prosegui"),
          e("span", { className: "choice-hint" }, "Nessun rischio, ma nessuna cattura")
        )
      ),
    result &&
      e(
        "div",
        { className: `outcome-box ${result.success ? "" : "fail"}` },
        result.success
          ? isLegendary
            ? "🌟 Incredibile! Hai catturato il leggendario!"
            : "Cattura riuscita! Il Pokémon si unisce alla tua squadra."
          : isLegendary
          ? "Il leggendario è fuggito nell'oscurità..."
          : "Il Pokémon è riuscito a scappare!",
        e(
          "div",
          null,
          e("button", { className: "continue-btn", onClick: handleContinue }, "Continua")
        )
      )
  );
}
