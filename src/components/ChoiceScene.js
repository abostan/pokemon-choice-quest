import React from "react";

const e = React.createElement;

/**
 * Scena generica "narrativa": mostra un titolo, un testo e una lista di
 * scelte cliccabili. Ogni scelta ha { id, label, hint, onSelect }.
 * Usata per i bivi dell'avventura (dove andare, cosa fare) che nel sito
 * originale sarebbero stati decisi da una roulette.
 */
export function ChoiceScene({ title, text, choices }) {
  return e(
    "div",
    { className: "panel" },
    e("h2", { className: "scene-title" }, title),
    e("p", { className: "scene-text" }, text),
    e(
      "div",
      { className: "choice-list" },
      choices.map((choice) =>
        e(
          "button",
          { key: choice.id, className: "choice-btn", onClick: choice.onSelect },
          e("span", null, choice.label),
          choice.hint ? e("span", { className: "choice-hint" }, choice.hint) : null
        )
      )
    )
  );
}
