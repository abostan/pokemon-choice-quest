import React, { useState, useEffect } from "react";
import { usePokemon } from "../hooks/usePokemon.js";
import { loadHistoricPokedex } from "../engine/saveGame.js";

const e = React.createElement;

// -------------------------------------------------------------------
// Componente singola riga Pokédex
// -------------------------------------------------------------------
function PokedexEntry({ pokemonId, status }) {
  const { data, loading } = usePokemon(pokemonId);
  const name = loading ? "..." : (data?.name ?? `#${pokemonId}`);
  const sprite = data?.sprite ?? "";

  return e(
    "div",
    { className: `pokedex-entry ${status}` },
    e(
      "div",
      { className: "pokedex-sprite" },
      sprite
        ? e("img", { src: sprite, alt: name, className: status === "seen" ? "seen-sprite" : "" })
        : e("span", { className: "pokedex-no-sprite" }, "?")
    ),
    e(
      "div",
      { className: "pokedex-info" },
      e("span", { className: "pokedex-name" }, name),
      data?.types
        ? e(
            "div",
            { className: "types" },
            data.types.map((t) => e("span", { key: t, className: `type-pill type-${t}` }, t))
          )
        : null
    ),
    e(
      "span",
      { className: `pokedex-status-badge ${status}` },
      status === "caught" ? "✓ Catturato" : "👁 Visto"
    )
  );
}

// -------------------------------------------------------------------
// Componente principale Pokédex
// -------------------------------------------------------------------
/**
 * Modale Pokédex con due viste: run corrente e storico.
 *
 * props:
 *  - pokedexRun: { [id]: { seen: true, caught: bool } }
 *  - onClose(): callback per chiudere il modale
 */
export function PokedexModal({ pokedexRun, onClose }) {
  const [tab, setTab] = useState("run"); // "run" | "historic"
  const [historic, setHistoric] = useState({});

  useEffect(() => {
    if (tab === "historic") {
      setHistoric(loadHistoricPokedex());
    }
  }, [tab]);

  // Costruisce la lista da mostrare per la tab selezionata
  const entries =
    tab === "run"
      ? Object.entries(pokedexRun).map(([id, info]) => ({
          id: Number(id),
          status: info.caught ? "caught" : "seen",
        }))
      : Object.entries(historic).map(([id, info]) => ({
          id: Number(id),
          status: info.caught ? "caught" : "seen",
        }));

  // Ordina per ID numerico
  entries.sort((a, b) => a.id - b.id);

  return e(
    "div",
    { className: "modal-overlay", onClick: (ev) => { if (ev.target === ev.currentTarget) onClose(); } },
    e(
      "div",
      { className: "modal-card pokedex-modal" },
      // Header modale
      e(
        "div",
        { className: "modal-header" },
        e("h2", { className: "scene-title", style: { margin: 0 } }, "📖 Pokédex"),
        e("button", { className: "modal-close-btn", onClick: onClose, "aria-label": "Chiudi" }, "✕")
      ),

      // Tab selector
      e(
        "div",
        { className: "pokedex-tabs" },
        e(
          "button",
          {
            className: `pokedex-tab ${tab === "run" ? "active" : ""}`,
            onClick: () => setTab("run"),
          },
          "Run attuale"
        ),
        e(
          "button",
          {
            className: `pokedex-tab ${tab === "historic" ? "active" : ""}`,
            onClick: () => setTab("historic"),
          },
          "Storico"
        )
      ),

      // Contatore
      e(
        "p",
        { className: "pokedex-count" },
        entries.filter((en) => en.status === "caught").length,
        " catturati / ",
        entries.length,
        " incontrati"
      ),

      // Lista
      entries.length === 0
        ? e(
            "p",
            { className: "empty-hint", style: { padding: "20px 0", textAlign: "center" } },
            tab === "run"
              ? "Nessun Pokémon incontrato in questa run."
              : "Nessun Pokémon nello storico. Inizia a giocare!"
          )
        : e(
            "div",
            { className: "pokedex-list" },
            entries.map((en) => e(PokedexEntry, { key: en.id, pokemonId: en.id, status: en.status }))
          )
    )
  );
}
