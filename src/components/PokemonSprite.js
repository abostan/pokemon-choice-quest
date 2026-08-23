import React from "react";
import { usePokemon } from "../hooks/usePokemon.js";
import { useSignatureMove } from "../hooks/useSignatureMove.js";
import { getTypeIconFromSlug } from "../data/types.js";
import { TapTooltip } from "./TapTooltip.js";

const e = React.createElement;

function formatMoveStat(value, suffix) {
  return value == null ? "—" : `${value}${suffix}`;
}

/**
 * Mostra lo sprite + nome di un Pokémon in formato piccolo (chip pill).
 * Usato nel TeamPanel e nelle scene di battaglia per gli avversari.
 *
 * `showMove` (usato in battaglia, vedi ROADMAP.md Fase 6 "Dettaglio Mosse &
 * Icone Tipi") aggiunge l'icona del tipo primario e, al tap, la mossa firma
 * (imparata per livello al livello più alto) con potenza/precisione reali
 * da PokeAPI — disattivato per default per non aggiungere richieste di rete
 * extra ovunque il chip è già usato (es. anteprima Box).
 */
export function PokemonChip({ id, level, isShiny, showMove = false }) {
  const { data, loading } = usePokemon(id);
  const { move, loading: moveLoading } = useSignatureMove(showMove ? id : null);
  const label = loading ? "..." : (data?.name ?? `#${id}`);
  const sprite = isShiny ? (data?.spriteShiny || data?.sprite) : data?.sprite;
  const primaryType = data?.types?.[0];
  const moveText = moveLoading
    ? "Mossa firma: caricamento..."
    : move
    ? `⚡ ${move.name} — Potenza ${formatMoveStat(move.power, "")} / Precisione ${formatMoveStat(move.accuracy, "%")}`
    : "Mossa firma non disponibile";

  return e(
    "div",
    { className: `pokemon-chip ${isShiny ? "shiny-chip" : ""}` },
    sprite
      ? e("img", { src: sprite, alt: label, title: label })
      : e("span", { className: "loading-text", style: { width: 34, textAlign: "center" } }, "…"),
    e(
      "span",
      null,
      isShiny && e("span", { className: "shiny-sparkle-inline" }, "✨ "),
      label,
      level != null && e("span", { className: "level" }, ` Lv${level}`)
    ),
    showMove &&
      primaryType &&
      e(
        TapTooltip,
        { text: moveText, className: "chip-type-icon", style: { cursor: "help" } },
        getTypeIconFromSlug(primaryType)
      )
  );
}

/**
 * Mostra lo sprite + nome + tipi di un Pokémon in formato card più grande.
 * Usato nell'EncounterScene e nella StartScreen.
 */
export function PokemonPreview({ id, isShiny, alreadyCaught = false }) {
  const { data, loading, error } = usePokemon(id);

  if (loading) return e("div", { className: "pokemon-preview" }, e("p", { className: "loading-text" }, "Caricamento…"));
  if (error || !data) return e("div", { className: "pokemon-preview" }, e("p", { className: "loading-text" }, `Dati non disponibili (#${id})`));

  const sprite = isShiny ? (data.spriteShiny || data.sprite) : data.sprite;

  return e(
    "div",
    { className: `pokemon-preview ${isShiny ? "shiny-preview" : ""}` },
    isShiny && e("div", { className: "shiny-badge" }, "✨ SHINY ✨"),
    alreadyCaught && e("div", { className: "caught-badge", title: "Hai già catturato questa specie in questa run" }, "⚪ Già catturato"),
    e("img", { src: sprite, alt: data.name }),
    e("span", { className: "name" }, isShiny ? `✨ ${data.name}` : data.name),
    e(
      "div",
      { className: "types" },
      data.types.map((t) => e("span", { key: t, className: `type-pill type-${t}` }, t))
    )
  );
}
