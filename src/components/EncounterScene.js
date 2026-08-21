import React, { useMemo, useState } from "react";
import { PokemonPreview } from "./PokemonSprite.js";
import { computeCaptureChance, rollCapture } from "../engine/battleLogic.js";

const e = React.createElement;

/**
 * Scena di incontro con un Pokémon selvatico. Il giocatore sceglie il
 * metodo con cui provare a catturarlo (o decide di ignorarlo), invece che
 * lasciare l'esito a una ruota casuale.
 *
 * props:
 *  - title, text: testo di intro
 *  - pool: array di id tra cui pescare (a caso, una volta sola) il Pokémon incontrato
 *  - level: livello assegnato al Pokémon se catturato
 *  - onResolved({ caught, pokemon }): chiamata quando la scena finisce
 */
export function EncounterScene({ title, text, pool, level = 4, onResolved }) {
  const wildId = useMemo(() => pool[Math.floor(Math.random() * pool.length)], [pool]);
  const [result, setResult] = useState(null); // { method, success } | null

  function attemptCapture(method) {
    const chance = computeCaptureChance(method, 0.55);
    const success = rollCapture(chance);
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
    { className: "panel" },
    e("h2", { className: "scene-title" }, title),
    e("p", { className: "scene-text" }, text),
    e(PokemonPreview, { id: wildId }),
    !result &&
      e(
        "div",
        { className: "choice-list", style: { marginTop: "16px" } },
        e(
          "button",
          { className: "choice-btn", onClick: () => attemptCapture("ball") },
          e("span", null, "Lancia una Poké Ball"),
          e("span", { className: "choice-hint" }, "Metodo affidabile, probabilità nella media")
        ),
        e(
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
          ? "Cattura riuscita! Il Pokémon si unisce alla tua squadra."
          : "Il Pokémon è riuscito a scappare!",
        e(
          "div",
          null,
          e("button", { className: "continue-btn", onClick: handleContinue }, "Continua")
        )
      )
  );
}
