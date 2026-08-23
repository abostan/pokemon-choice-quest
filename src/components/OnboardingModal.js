import React, { useState } from "react";

const e = React.createElement;

const STEPS = [
  {
    icon: "🧭",
    title: "Le tue scelte contano",
    text: "Ad ogni bivio decidi tu cosa fare: esplorare l'erba alta, pescare, allenarti o affrontare un evento speciale. Non c'è nessuna ruota che decide per te — ogni bivio porta a un incontro o un evento diverso, e la varietà cambia visita dopo visita.",
  },
  {
    icon: "🎯",
    title: "Cattura: rischio e ricompensa",
    text: "Quando incontri un Pokémon selvatico puoi lanciare una Poké Ball, provare con il cibo (probabilità più alta) o ignorarlo. I leggendari sono molto più difficili da catturare — a meno che tu non abbia una Master Ball, che garantisce sempre il successo.",
  },
  {
    icon: "⚔️",
    title: "Battaglie: scegli la tattica",
    text: "Prima di ogni scontro scegli una tattica — Aggressiva (più potenza, più rischio), Bilanciata o Difensiva — e puoi usare uno strumento dallo zaino per un bonus. L'esito viene calcolato dalla potenza della tua squadra contro quella avversaria, non da un tiro puramente casuale.",
  },
  {
    icon: "🔮",
    title: "Mega, Tera e il tuo Box",
    text: "Nelle battaglie decisive puoi attivare Megaevoluzione oppure Terastallizzazione per un forte bonus di potenza — sono a vicenda esclusive, scegline una. La tua squadra può avere fino a 6 Pokémon in campo: il resto va nel Box, da cui puoi richiamarli quando vuoi.",
  },
];

/**
 * Modale di onboarding mostrato una sola volta al primissimo avvio (o
 * riaperto manualmente dal pulsante "❓ Come si gioca" nell'header).
 *
 * props:
 *  - onClose(): callback per chiudere il modale
 */
export function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return e(
    "div",
    { className: "modal-overlay", onClick: (ev) => { if (ev.target === ev.currentTarget) onClose(); } },
    e(
      "div",
      { className: "modal-card onboarding-modal", style: { maxWidth: "480px", textAlign: "center" } },
      e(
        "div",
        { className: "modal-header", style: { justifyContent: "flex-end" } },
        e("button", { className: "modal-close-btn", onClick: onClose, title: "Chiudi" }, "✕")
      ),
      e("div", { style: { fontSize: "3rem", marginBottom: "8px" } }, current.icon),
      e("h2", { className: "scene-title", style: { marginBottom: "10px" } }, current.title),
      e("p", { className: "scene-text", style: { minHeight: "96px" } }, current.text),
      e(
        "div",
        { style: { display: "flex", justifyContent: "center", gap: "6px", margin: "12px 0" } },
        STEPS.map((_, idx) =>
          e("span", {
            key: idx,
            style: {
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: idx === step ? "var(--accent)" : "var(--panel-alt)",
            },
          })
        )
      ),
      e(
        "div",
        { style: { display: "flex", gap: "10px", justifyContent: "center", marginTop: "8px" } },
        step > 0 &&
          e(
            "button",
            {
              className: "continue-btn",
              style: { background: "#2c3e4e", color: "#eef3f8" },
              onClick: () => setStep((s) => s - 1),
            },
            "← Indietro"
          ),
        e(
          "button",
          { className: "continue-btn", onClick: () => (isLast ? onClose() : setStep((s) => s + 1)) },
          isLast ? "Inizia l'avventura 🚀" : "Avanti →"
        )
      )
    )
  );
}
