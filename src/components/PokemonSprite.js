import React from "react";
import { usePokemon } from "../hooks/usePokemon.js";

const e = React.createElement;

/**
 * Mostra lo sprite + nome di un Pokémon in formato piccolo (chip pill).
 * Usato nel TeamPanel e nelle scene di battaglia per gli avversari.
 */
export function PokemonChip({ id, level, isShiny }) {
  const { data, loading } = usePokemon(id);
  const label = loading ? "..." : (data?.name ?? `#${id}`);
  const sprite = isShiny ? (data?.spriteShiny || data?.sprite) : data?.sprite;

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
    )
  );
}

/**
 * Mostra lo sprite + nome + tipi di un Pokémon in formato card più grande.
 * Usato nell'EncounterScene e nella StartScreen.
 */
export function PokemonPreview({ id, isShiny }) {
  const { data, loading, error } = usePokemon(id);

  if (loading) return e("div", { className: "pokemon-preview" }, e("p", { className: "loading-text" }, "Caricamento…"));
  if (error || !data) return e("div", { className: "pokemon-preview" }, e("p", { className: "loading-text" }, `Dati non disponibili (#${id})`));

  const sprite = isShiny ? (data.spriteShiny || data.sprite) : data.sprite;

  return e(
    "div",
    { className: `pokemon-preview ${isShiny ? "shiny-preview" : ""}` },
    isShiny && e("div", { className: "shiny-badge" }, "✨ SHINY ✨"),
    e("img", { src: sprite, alt: data.name }),
    e("span", { className: "name" }, isShiny ? `✨ ${data.name}` : data.name),
    e(
      "div",
      { className: "types" },
      data.types.map((t) => e("span", { key: t, className: `type-pill type-${t}` }, t))
    )
  );
}
