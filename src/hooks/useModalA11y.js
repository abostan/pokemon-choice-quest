import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessibilità da tastiera comune a tutti i modali (vedi ANALISI_TECNICA.md
 * 4.3): chiusura con Esc e focus intrappolato dentro il modale mentre è
 * aperto, invece di poter uscire con Tab verso il resto della pagina sotto.
 * Ritorna un ref da assegnare al contenitore del modale (il div
 * "modal-card"), su cui va messo anche role="dialog" aria-modal="true".
 */
export function useModalA11y(onClose) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Sposta subito il focus dentro il modale, così Tab/Esc funzionano da
    // subito senza dover prima cliccare qualcosa dentro.
    node.focus();

    function handleKeyDown(ev) {
      if (ev.key === "Escape") {
        ev.stopPropagation();
        onClose();
        return;
      }
      if (ev.key !== "Tab") return;

      const focusable = node.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (ev.shiftKey && document.activeElement === first) {
        ev.preventDefault();
        last.focus();
      } else if (!ev.shiftKey && document.activeElement === last) {
        ev.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return ref;
}
