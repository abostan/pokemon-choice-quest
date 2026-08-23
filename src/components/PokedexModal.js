import React, { useState, useEffect, useMemo } from "react";
import { useModalA11y } from "../hooks/useModalA11y.js";
import { usePokemon } from "../hooks/usePokemon.js";
import { usePokemonSpecies } from "../hooks/usePokemonSpecies.js";
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
function PokedexGridCard({ pokemonId, status, hasShiny, onSelect }) {
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
      onClick: () => onSelect(pokemonId, hasShiny),
      style: { cursor: "pointer" },
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
function PokedexListRow({ pokemonId, status, hasShiny, onSelect }) {
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
    {
      className: `pokedex-entry ${status} ${hasShiny ? "pokedex-shiny" : ""}`,
      onClick: () => onSelect(pokemonId, hasShiny),
      style: { cursor: "pointer" },
    },
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

/**
 * Pannello dettaglio: sprite, nome, tipi e descrizione Pokédex ufficiale in
 * italiano (da PokeAPI /pokemon-species), apribile cliccando una entry
 * scoperta. Caricata su richiesta invece che per tutte le 1025 specie in
 * una volta, per non intasare PokeAPI di chiamate inutili.
 */
const STAT_LABELS = [
  { key: "hp", label: "PS", color: "#4ade80" },
  { key: "attack", label: "Attacco", color: "#f87171" },
  { key: "defense", label: "Difesa", color: "#60a5fa" },
  { key: "spAttack", label: "Att. Sp.", color: "#c084fc" },
  { key: "spDefense", label: "Dif. Sp.", color: "#38bdf8" },
  { key: "speed", label: "Velocità", color: "#fbbf24" },
];
// 255 è il massimo storico per una singola statistica base tra tutte le
// specie (es. la Velocità di Deoxys-Speed): usato come scala fissa per le
// barre, così un valore alto "riempie" visivamente la barra in modo coerente
// tra specie diverse invece di normalizzare sul massimo del solo Pokémon mostrato.
const MAX_SINGLE_STAT = 255;

function StatBars({ stats, bst }) {
  if (!stats) return null;
  return e(
    "div",
    { className: "pokedex-stat-bars" },
    STAT_LABELS.map(({ key, label, color }) =>
      e(
        "div",
        { key, className: "pokedex-stat-row" },
        e("span", { className: "pokedex-stat-label" }, label),
        e(
          "div",
          { className: "pokedex-stat-bar-track" },
          e("div", {
            className: "pokedex-stat-bar-fill",
            style: { width: `${Math.min(100, (stats[key] / MAX_SINGLE_STAT) * 100)}%`, background: color },
          })
        ),
        e("span", { className: "pokedex-stat-value" }, stats[key])
      )
    ),
    e(
      "div",
      { className: "pokedex-stat-row pokedex-stat-total" },
      e("span", { className: "pokedex-stat-label" }, "Totale"),
      e("span", { className: "pokedex-stat-value" }, bst)
    )
  );
}

function PokedexDetailPanel({ pokemonId, hasShiny, onClose }) {
  const { data: pokeData, loading: pokeLoading } = usePokemon(pokemonId);
  const { data: speciesData, loading: speciesLoading } = usePokemonSpecies(pokemonId);
  const formattedId = `#${String(pokemonId).padStart(3, "0")}`;
  const sprite = hasShiny ? (pokeData?.spriteShiny || pokeData?.sprite) : pokeData?.sprite;

  return e(
    "div",
    { className: "pokedex-detail-panel" },
    e("button", { className: "modal-close-btn pokedex-detail-close", onClick: onClose, "aria-label": "Chiudi dettaglio" }, "✕"),
    e(
      "div",
      { className: "pokedex-detail-sprite" },
      sprite ? e("img", { src: sprite, alt: pokeData?.name }) : e("span", { className: "pokedex-no-sprite" }, "?")
    ),
    e(
      "div",
      { className: "pokedex-detail-info" },
      e(
        "h3",
        { style: { margin: "0 0 2px" } },
        `${formattedId} ${pokeLoading ? "..." : (pokeData?.name ?? "")}`,
        hasShiny && " ✨"
      ),
      speciesData?.genus && e("p", { className: "pokedex-detail-genus" }, speciesData.genus),
      pokeData?.types &&
        e(
          "div",
          { className: "types", style: { marginBottom: "8px" } },
          pokeData.types.map((t) => e("span", { key: t, className: `type-pill type-${t}` }, t))
        ),
      e(
        "p",
        { className: "pokedex-detail-description" },
        speciesLoading
          ? "Caricamento descrizione..."
          : speciesData?.description || "Nessuna descrizione italiana disponibile per questa specie."
      ),
      !pokeLoading && pokeData?.stats && e(StatBars, { stats: pokeData.stats, bst: pokeData.bst })
    )
  );
}

// -------------------------------------------------------------------
// Componente principale Pokédex
// -------------------------------------------------------------------
export function PokedexModal({ pokedexRun, onClose }) {
  const modalRef = useModalA11y(onClose);
  const [tab, setTab] = useState("run");             // "run" | "historic"
  const [viewMode, setViewMode] = useState("grid");  // "grid" | "list"
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "registered" | "caught" | "unseen"
  const [search, setSearch] = useState("");
  const [historic, setHistoric] = useState({});
  const [selectedEntry, setSelectedEntry] = useState(null); // { id, hasShiny } | null

  function handleSelectEntry(id, hasShiny) {
    setSelectedEntry({ id, hasShiny });
  }

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
      { className: "modal-card pokedex-modal", ref: modalRef, role: "dialog", "aria-modal": "true", "aria-label": "Pokédex", tabIndex: -1 },
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

      // Pannello dettaglio (sprite, tipi, descrizione italiana) della entry selezionata
      selectedEntry &&
        e(PokedexDetailPanel, {
          pokemonId: selectedEntry.id,
          hasShiny: selectedEntry.hasShiny,
          onClose: () => setSelectedEntry(null),
        }),

      // Vista Griglia o Lista
      viewMode === "grid"
        ? e(
            "div",
            { className: "pokedex-grid-container" },
            filteredEntries.map((en) =>
              e(PokedexGridCard, { key: en.id, pokemonId: en.id, status: en.status, hasShiny: en.hasShiny, onSelect: handleSelectEntry })
            )
          )
        : e(
            "div",
            { className: "pokedex-list" },
            filteredEntries.map((en) =>
              e(PokedexListRow, { key: en.id, pokemonId: en.id, status: en.status, hasShiny: en.hasShiny, onSelect: handleSelectEntry })
            )
          )
    )
  );
}
