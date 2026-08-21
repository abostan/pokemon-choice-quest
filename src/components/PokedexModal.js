import React, { useState, useEffect, useMemo } from "react";
import { usePokemon } from "../hooks/usePokemon.js";
import { loadHistoricPokedex } from "../engine/saveGame.js";

const e = React.createElement;

const TOTAL_POKEMON_COUNT = 1025;

const REGIONS = [
  { id: "all", name: "Tutti (1-1025)", start: 1, end: 1025 },
  { id: "kanto", name: "Kanto (1-151)", start: 1, end: 151 },
  { id: "johto", name: "Johto (152-251)", start: 152, end: 251 },
  { id: "hoenn", name: "Hoenn (252-386)", start: 252, end: 386 },
  { id: "sinnoh", name: "Sinnoh (387-493)", start: 387, end: 493 },
  { id: "unova", name: "Unova (494-649)", start: 494, end: 649 },
  { id: "kalos", name: "Kalos (650-721)", start: 650, end: 721 },
  { id: "alola", name: "Alola (722-809)", start: 722, end: 809 },
  { id: "galar", name: "Galar (810-905)", start: 810, end: 905 },
  { id: "paldea", name: "Paldea (906-1025)", start: 906, end: 1025 },
];

/**
 * Singolo slot della griglia album del Pokédex.
 */
function PokedexGridCard({ pokemonId, status, hasShiny }) {
  const isDiscovered = status === "caught" || status === "seen";
  const { data, loading } = usePokemon(isDiscovered ? pokemonId : null);

  const formattedId = `#${String(pokemonId).padStart(3, "0")}`;

  if (!isDiscovered) {
    return e(
      "div",
      {
        className: "pokedex-grid-card unseen",
        title: `${formattedId}: Non ancora scoperto`,
      },
      e("span", { className: "pokedex-grid-id" }, formattedId),
      e("div", { className: "pokedex-grid-sprite" }, e("span", { className: "unseen-question" }, "?")),
      e("span", { className: "pokedex-grid-name unseen" }, "???")
    );
  }

  const name = loading ? "..." : (data?.name ?? formattedId);
  const sprite = hasShiny ? (data?.spriteShiny || data?.sprite) : (data?.sprite ?? "");

  const tooltipText = `${formattedId} ${data?.name || ''} ${hasShiny ? '(✨ Shiny)' : ''} [${status === 'caught' ? 'Catturato' : 'Visto'}]`;

  return e(
    "div",
    {
      className: `pokedex-grid-card ${status} ${hasShiny ? "shiny" : ""}`,
      title: tooltipText,
    },
    e("span", { className: "pokedex-grid-id" }, formattedId),
    e(
      "div",
      { className: "pokedex-grid-sprite" },
      sprite
        ? e("img", { src: sprite, alt: name, className: status === "seen" ? "seen-sprite" : "" })
        : e("span", { className: "pokedex-no-sprite" }, "?")
    ),
    e(
      "span",
      { className: "pokedex-grid-name" },
      hasShiny ? `✨ ${name}` : name
    )
  );
}

/**
 * Singola riga della vista lista estesa.
 */
function PokedexListRow({ pokemonId, status, hasShiny }) {
  const isDiscovered = status === "caught" || status === "seen";
  const { data, loading } = usePokemon(isDiscovered ? pokemonId : null);
  const formattedId = `#${String(pokemonId).padStart(3, "0")}`;

  if (!isDiscovered) {
    return e(
      "div",
      { className: "pokedex-entry unseen" },
      e("div", { className: "pokedex-sprite" }, e("span", { className: "pokedex-no-sprite" }, "?")),
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
  const [tab, setTab] = useState("run");             // "run" | "historic"
  const [viewMode, setViewMode] = useState("grid");  // "grid" | "list"
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "registered" | "caught" | "unseen"
  const [search, setSearch] = useState("");
  const [historic, setHistoric] = useState({});

  useEffect(() => {
    if (tab === "historic") {
      setHistoric(loadHistoricPokedex());
    }
  }, [tab]);

  const activeDexMap = tab === "run" ? pokedexRun : historic;

  // Genera tutti gli elementi in base alla regione selezionata
  const allEntries = useMemo(() => {
    const reg = REGIONS.find((r) => r.id === regionFilter) || REGIONS[0];
    const list = [];
    for (let id = reg.start; id <= reg.end; id++) {
      const info = activeDexMap[id];
      const status = info ? (info.caught ? "caught" : "seen") : "unseen";
      list.push({
        id,
        status,
        hasShiny: !!info?.shiny,
      });
    }
    return list;
  }, [activeDexMap, regionFilter]);

  const caughtCount = useMemo(() => Object.values(activeDexMap).filter((x) => x.caught).length, [activeDexMap]);
  const seenCount = useMemo(() => Object.keys(activeDexMap).length, [activeDexMap]);

  // Filtra per stato e ricerca
  const filteredEntries = useMemo(() => {
    return allEntries.filter((item) => {
      if (statusFilter === "registered" && item.status === "unseen") return false;
      if (statusFilter === "caught" && item.status !== "caught") return false;
      if (statusFilter === "unseen" && item.status !== "unseen") return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const idStr = String(item.id);
        const padStr = idStr.padStart(3, "0");
        return idStr.includes(q) || padStr.includes(q);
      }
      return true;
    });
  }, [allEntries, statusFilter, search]);

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
        e("h2", { className: "scene-title", style: { margin: 0 } }, "📖 Pokédex Nazionale (Album Grid)"),
        e("button", { className: "modal-close-btn", onClick: onClose, "aria-label": "Chiudi" }, "✕")
      ),

      // Tab selector: Run vs Storico
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
        ),
        e(
          "div",
          { style: { marginLeft: "auto", display: "flex", gap: "4px" } },
          e(
            "button",
            {
              className: `pokedex-tab ${viewMode === "grid" ? "active" : ""}`,
              onClick: () => setViewMode("grid"),
              title: "Griglia Album",
            },
            "⬛ Griglia"
          ),
          e(
            "button",
            {
              className: `pokedex-tab ${viewMode === "list" ? "active" : ""}`,
              onClick: () => setViewMode("list"),
              title: "Lista dettagliata",
            },
            "☰ Lista"
          )
        )
      ),

      // Filtri per Regione
      e(
        "div",
        { className: "pokedex-region-tabs" },
        REGIONS.map((r) =>
          e(
            "button",
            {
              key: r.id,
              className: `pokedex-region-btn ${regionFilter === r.id ? "active" : ""}`,
              onClick: () => setRegionFilter(r.id),
            },
            r.name
          )
        )
      ),

      // Statistiche e ricerca
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
            { className: `pokedex-filter-btn ${statusFilter === "all" ? "active" : ""}`, onClick: () => setStatusFilter("all") },
            "Tutti"
          ),
          e(
            "button",
            { className: `pokedex-filter-btn ${statusFilter === "registered" ? "active" : ""}`, onClick: () => setStatusFilter("registered") },
            "Scoperti"
          ),
          e(
            "button",
            { className: `pokedex-filter-btn ${statusFilter === "caught" ? "active" : ""}`, onClick: () => setStatusFilter("caught") },
            "Catturati"
          ),
          e(
            "button",
            { className: `pokedex-filter-btn ${statusFilter === "unseen" ? "active" : ""}`, onClick: () => setStatusFilter("unseen") },
            "Ignoti"
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

      // Vista Griglia o Lista
      viewMode === "grid"
        ? e(
            "div",
            { className: "pokedex-grid-container" },
            filteredEntries.map((en) =>
              e(PokedexGridCard, { key: en.id, pokemonId: en.id, status: en.status, hasShiny: en.hasShiny })
            )
          )
        : e(
            "div",
            { className: "pokedex-list" },
            filteredEntries.map((en) =>
              e(PokedexListRow, { key: en.id, pokemonId: en.id, status: en.status, hasShiny: en.hasShiny })
            )
          )
    )
  );
}
