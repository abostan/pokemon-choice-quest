import React from "react";
import { PokemonChip } from "./PokemonSprite.js";

const e = React.createElement;

/**
 * Schermata mostrata all'avvio quando esiste un salvataggio.
 * Propone di riprendere o iniziare una nuova partita.
 *
 * props:
 *  - savedAt (string): ISO timestamp del salvataggio
 *  - savedState (object): stato salvato (per mostrare il riassunto)
 *  - onResume(): callback per riprendere la partita
 *  - onNewGame(): callback per iniziare una nuova partita
 */
export function ResumeScreen({ savedAt, savedState, onResume, onNewGame }) {
  const date = new Date(savedAt);
  const dateStr = date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const genName = savedState.generationId
    ? savedState.generationId.charAt(0).toUpperCase() + savedState.generationId.slice(1)
    : "—";

  const gymText =
    savedState.phase === "eliteBattle" || savedState.phase === "championBattle"
      ? "Alto Comando / Campione"
      : savedState.phase === "postgameExplore" || savedState.phase === "postgame"
      ? "Modalità infinita"
      : `Palestra ${savedState.gymIndex + 1}`;

  const teamSize = (savedState.team || []).length;
  const maxLevel = teamSize > 0 ? Math.max(...(savedState.team || []).map((p) => p.level)) : 0;

  return e(
    "div",
    { className: "panel resume-screen" },
    e("div", { className: "resume-icon" }, "💾"),
    e("h2", { className: "scene-title" }, "Partita trovata!"),
    e("p", { className: "scene-text" }, `Salvata il ${dateStr}`),

    e(
      "div",
      { className: "resume-summary" },
      e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Generazione"), e("span", null, genName)),
      e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Progresso"), e("span", null, gymText)),
      e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Pokémon"), e("span", null, `${teamSize} in squadra`)),
      e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Livello max"), e("span", null, maxLevel > 0 ? `Lv${maxLevel}` : "—")),
      e("div", { className: "resume-stat" }, e("span", { className: "resume-label" }, "Medaglie"), e("span", null, (savedState.badges || []).length))
    ),

    teamSize > 0 &&
      e(
        "div",
        { className: "resume-team" },
        e("p", { className: "next-gen-label" }, "Il tuo team:"),
        e(
          "div",
          { className: "team-list", style: { flexWrap: "wrap" } },
          (savedState.team || []).map((p, idx) =>
            e(PokemonChip, { key: `${p.id}-${idx}`, id: p.id, level: p.level })
          )
        )
      ),

    e(
      "div",
      { className: "resume-actions" },
      e("button", { className: "continue-btn", onClick: onResume }, "▶ Riprendi partita"),
      e(
        "button",
        { className: "resume-new-btn", onClick: onNewGame },
        "✕ Inizia una nuova partita"
      )
    )
  );
}
