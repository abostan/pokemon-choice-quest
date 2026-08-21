import React, { useState, useEffect, useMemo } from "react";
import { usePokemon } from "../hooks/usePokemon.js";
import { loadHistoricPokedex } from "../engine/saveGame.js";

const e = React.createElement;

// Totale specie per le generazioni 1..6 (Kanto → Kalos)
const TOTAL_POKEMON_COUNT = 721;

// -------------------------------------------------------------------
// Componente singola riga Pokédex
// -------------------------------------------------------------------
function PokedexEntry({ pokemonId, status, hasShiny }) {
  const isDiscovered = status === "caught" || status === "seen";
  const { data, loading } = usePokemon(isDiscovered ? pokemonId : null);

  const formattedId = `#${String(pokemonId).padStart(3, "0")}`;

  if (!isDiscovered) {
    return e(
      "div",
      { className: "pokedex-entry unseen" },
      e(
        "div",
        { className: "pokedex-sprite" },
        e("span", { className: "pokedex-no-sprite" }, "?")
      ),
      e(
        "div",
        { className: "pokedex-info" },
        e("span", { className: "pokedex-name unseen-text" }, `${formattedId} — ???`),
        e("span", { className: "pokedex-unseen-hint" }, "Non ancora scoperto")
      ),
      e("span", { className: "pokedex-status-badge unseen" }, "? Ignoto")
    );
  }

  const name = loading ? "..." : (data?.name ?? `${formattedId}`);
  const sprite = hasShiny ? (data?.spriteShiny || data?.sprite) : (data?.sprite ?? "");

  return e(
    "div",
    { className: `pokedex-entry ${status} ${hasShiny ? "pokedex-shiny" : ""}` },
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
      e("span", { className: "pokedex-name" }, `${formattedId} ${hasShiny ? `✨ ${name}` : name}`),
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
      status === "caught"
        ? hasShiny
          ? "✨ Catturato Shiny"
          : "✓ Catturato"
        : "👁 Visto"
    )
  );
}

// -------------------------------------------------------------------
// Componente principale Pokédex
// -------------------------------------------------------------------
export function PokedexModal({ pokedexRun, onClose }) {
  const [tab, setTab] = useState("run");           // "run" | "historic"
  const [filter, setFilter] = useState("all");     // "all" | "registered" | "caught" | "unseen"
  const [search, setSearch] = useState("");
  const [historic, setHistoric] = useState({});

  useEffect(() => {
    if (tab === "historic") {
      setHistoric(loadHistoricPokedex());
    }
  }, [tab]);

  const activeDexMap = tab === "run" ? pokedexRun : historic;

  // Genera l'elenco completo per tutti i 721 slot
  const allEntries = useMemo(() => {
    const list = [];
    for (let id = 1; id <= TOTAL_POKEMON_COUNT; id++) {
      const info = activeDexMap[id];
      const status = info ? (info.caught ? "caught" : "seen") : "unseen";
      list.push({
        id,
        status,
        hasShiny: !!info?.shiny,
      });
    }
    return list;
  }, [activeDexMap]);

  // Conteggi per le statistiche
  const caughtCount = useMemo(() => Object.values(activeDexMap).filter((x) => x.caught).length, [activeDexMap]);
  const seenCount = useMemo(() => Object.keys(activeDexMap).length, [activeDexMap]);

  // Filtra gli elementi
  const filteredEntries = useMemo(() => {
    return allEntries.filter((item) => {
      // Filtro per stato
      if (filter === "registered" && item.status === "unseen") return false;
      if (filter === "caught" && item.status !== "caught") return false;
      if (filter === "unseen" && item.status !== "unseen") return false;

      // Filtro per ricerca ID (es: "25" o "025")
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const idStr = String(item.id);
        const padStr = idStr.padStart(3, "0");
        return idStr.includes(q) || padStr.includes(q);
      }
      return true;
    });
  }, [allEntries, filter, search]);

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
        e("h2", { className: "scene-title", style: { margin: 0 } }, "📖 Pokédex Nazionale (Gen 1-6)"),
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
          "Storico permanente"
        )
      ),

      // Statistiche e filtri
      e(
        "div",
        { className: "pokedex-controls" },
        e(
          "p",
          { className: "pokedex-count" },
          `🏆 Catturati: ${caughtCount} | 👁 Visti: ${seenCount} / ${TOTAL_POKEMON_COUNT}`
        ),
        e(
          "div",
          { className: "pokedex-filter-bar" },
          e(
            "button",
            { className: `pokedex-filter-btn ${filter === "all" ? "active" : ""}`, onClick: () => setFilter("all") },
            `Tutti (${TOTAL_POKEMON_COUNT})`
          ),
          e(
            "button",
            { className: `pokedex-filter-btn ${filter === "registered" ? "active" : ""}`, onClick: () => setFilter("registered") },
            `Scoperti (${seenCount})`
          ),
          e(
            "button",
            { className: `pokedex-filter-btn ${filter === "caught" ? "active" : ""}`, onClick: () => setFilter("caught") },
            `Catturati (${caughtCount})`
          ),
          e(
            "button",
            { className: `pokedex-filter-btn ${filter === "unseen" ? "active" : ""}`, onClick: () => setFilter("unseen") },
            `Ignoti (${TOTAL_POKEMON_COUNT - seenCount})`
          )
        ),
        e("input", {
          className: "pokedex-search-input",
          type: "text",
          placeholder: "Cerca per #ID (es. 25 o 004)...",
          value: search,
          onChange: (ev) => setSearch(ev.target.value),
        })
      ),

      // Lista delle specie (con scroll interno)
      e(
        "div",
        { className: "pokedex-list" },
        filteredEntries.slice(0, 150).map((en) =>
          e(PokedexEntry, { key: en.id, pokemonId: en.id, status: en.status, hasShiny: en.hasShiny })
        ),
        filteredEntries.length > 150 &&
          e(
            "p",
            { className: "empty-hint", style: { textAlign: "center", padding: "10px 0" } },
            `Mostrati 150 di ${filteredEntries.length} risultati. Usa la barra di ricerca per trovare specie specifiche.`
          )
      )
    )
  );
}
