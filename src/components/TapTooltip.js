import React, { useEffect, useRef, useState } from "react";

const e = React.createElement;

/**
 * Wrapper per descrizioni altrimenti disponibili solo via hover (attributo
 * HTML `title`), invisibili su dispositivo touch (vedi ANALISI_TECNICA.md
 * 4.2). Mantiene `title` per il comportamento desktop normale, e aggiunge un
 * tap/click che apre una piccola bolla con lo stesso testo, richiudibile
 * toccando di nuovo o cliccando altrove.
 *
 * props:
 *  - text (string): descrizione da mostrare
 *  - as (string): tag dell'elemento wrapper interattivo (default "span")
 *  - className, style: passati all'elemento wrapper interattivo
 *  - children: contenuto normalmente visibile (icona, chip, bottone...)
 */
export function TapTooltip({ text, as = "span", className = "", style = {}, children }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(ev) {
      if (wrapRef.current && !wrapRef.current.contains(ev.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [open]);

  return e(
    "span",
    { ref: wrapRef, className: "tap-tooltip-anchor" },
    e(
      as,
      {
        title: text,
        className,
        style,
        onClick: (ev) => {
          ev.stopPropagation();
          setOpen((o) => !o);
        },
      },
      children
    ),
    open && e("span", { className: "tap-tooltip-bubble", role: "tooltip" }, text)
  );
}
