import React from "react";
import { usePokemon } from "../hooks/usePokemon.js";

const e = React.createElement;

// Nota per chi estende il progetto: qui non usiamo JSX ma React.createElement
// direttamente (scritto come "e(...)"), perché il progetto non ha un passo di
// build (niente Babel/Vite). Se in futuro importi questi file in un progetto
// Vite/CRA, puoi tranquillamente riscriverli in JSX se preferisci.

export function PokemonPreview({ id, level, shiny = false }) {
  const { data, loading, error } = usePokemon(id);

  if (loading) {
    return e("div", { className: "pokemon-preview" }, e("span", { className: "loading-text" }, "Caricamento..."));
  }
  if (error || !data) {
    return e("div", { className: "pokemon-preview" }, e("span", { className: "loading-text" }, "Sprite non disponibile"));
  }

  return e(
    "div",
    { className: "pokemon-preview" },
    e("img", {
      src: shiny && data.spriteShiny ? data.spriteShiny : data.sprite,
      alt: data.name,
      loading: "lazy",
    }),
    e("span", { className: "name" }, data.name),
    typeof level === "number" ? e("span", { className: "level" }, `Lv. ${level}`) : null,
    e(
      "div",
      { className: "types" },
      data.types.map((t) => e("span", { className: "type-pill", key: t }, t))
    )
  );
}

export function PokemonChip({ id, level }) {
  const { data, loading } = usePokemon(id);
  return e(
    "div",
    { className: "pokemon-chip" },
    data ? e("img", { src: data.sprite, alt: data.name }) : e("span", null, "..."),
    e(
      "span",
      null,
      loading ? "..." : data?.name ?? "?",
      typeof level === "number" ? e("span", { className: "level" }, ` Lv.${level}`) : null
    )
  );
}
