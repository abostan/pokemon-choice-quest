import { useEffect, useState } from "react";
import { fetchPokemon } from "./usePokemon.js";

/**
 * Mappa { id → BST } per tutti i membri della squadra, usata da
 * computeTeamPower per un calcolo di potenza basato sulle statistiche base
 * reali. Riusa la stessa cache in memoria di usePokemon (nessuna richiesta
 * doppia rispetto alle schede squadra già mostrate).
 */
export function useTeamStats(team) {
  const ids = (team || []).map((p) => p.id);
  const key = ids.join(",");
  const [statsById, setStatsById] = useState({});

  useEffect(() => {
    if (ids.length === 0) {
      setStatsById({});
      return;
    }
    let cancelled = false;

    Promise.all(
      ids.map((id) =>
        fetchPokemon(id)
          .then((data) => [id, data.bst])
          .catch(() => [id, null])
      )
    ).then((pairs) => {
      if (cancelled) return;
      const map = {};
      for (const [id, bst] of pairs) {
        if (bst) map[id] = bst;
      }
      setStatsById(map);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return statsById;
}
