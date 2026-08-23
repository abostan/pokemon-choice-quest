import React from "react";
import { useItemSprite } from "../hooks/useItemSprite.js";

const e = React.createElement;

/**
 * Icona di uno strumento: sprite pixel ufficiale PokeAPI quando disponibile
 * (vedi ROADMAP.md Fase 6), altrimenti l'emoji di fallback passata da chi
 * chiama — non tutti gli strumenti di questo gioco hanno un equivalente
 * ufficiale certo (vedi ITEM_POKEAPI_SLUGS in data/items.js).
 *
 * props:
 *  - name: nome italiano dello strumento nel gioco
 *  - fallbackEmoji: emoji da mostrare se non c'è uno sprite noto
 *  - size: dimensione in px dello sprite (default 20)
 */
export function ItemIcon({ name, fallbackEmoji = "🧪", size = 20 }) {
  const sprite = useItemSprite(name);
  if (!sprite) return e("span", null, fallbackEmoji);
  return e("img", {
    src: sprite,
    alt: name,
    style: { width: `${size}px`, height: `${size}px`, imageRendering: "pixelated", verticalAlign: "middle" },
  });
}
