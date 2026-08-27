import React from "react";
import { getMilestoneType } from "../data/generations.js";
import { getTypeIcon } from "../data/types.js";

const e = React.createElement;

function milestoneIcon(title, kind) {
  if (kind === "champion") return "👑";
  const type = getMilestoneType(title);
  return type ? getTypeIcon(type) : "⚔️";
}

function statusLabel(status) {
  if (status === "done") return "Superato";
  if (status === "current") return "In corso";
  return "Da affrontare";
}

/**
 * Barra di avanzamento a tappe: una icona per palestra/Alto Comando/Campione
 * (8 + 4 + 1) invece della singola barra percentuale piatta, con l'icona del
 * tipo dell'avversario per riconoscere a colpo d'occhio cosa manca — vedi
 * richiesta utente su bottoni negozio/header/progress bar.
 *
 * props:
 *  - generation: generazione attiva (gymLeaders/eliteFour/champion)
 *  - completedMilestones: numero di tappe già superate
 *  - totalMilestones: numero totale di tappe (gymLeaders.length + eliteFour.length + 1)
 */
export function MilestoneProgressBar({ generation, completedMilestones, totalMilestones }) {
  if (!generation) return null;

  const milestones = [
    ...generation.gymLeaders.map((g) => ({ title: g.title, kind: "gym" })),
    ...generation.eliteFour.map((g) => ({ title: g.title, kind: "elite" })),
    { title: generation.champion.title, kind: "champion" },
  ];

  return e(
    "div",
    {
      className: "milestone-track",
      role: "list",
      "aria-label": `Progresso: ${completedMilestones} di ${totalMilestones} tappe superate`,
    },
    milestones.map((m, i) => {
      const status = i < completedMilestones ? "done" : i === completedMilestones ? "current" : "upcoming";
      return e(
        React.Fragment,
        { key: i },
        e(
          "div",
          {
            className: `milestone-node ${status}`,
            role: "listitem",
            title: `${m.title} — ${statusLabel(status)}`,
          },
          milestoneIcon(m.title, m.kind)
        ),
        i < milestones.length - 1 && e("div", { className: `milestone-connector ${status === "done" ? "done" : ""}` })
      );
    })
  );
}
