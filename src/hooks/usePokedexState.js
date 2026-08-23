import { updateHistoricPokedex } from "../engine/saveGame.js";
import { unlockAchievement } from "../engine/achievements.js";

export function usePokedexState(setState) {
  function markSeen(id, isShiny = false) {
    setState((prev) => {
      const existing = prev.pokedexRun[id] || {};
      updateHistoricPokedex(id, false, isShiny);
      return {
        ...prev,
        pokedexRun: {
          ...prev.pokedexRun,
          [id]: { seen: true, caught: existing.caught || false, shiny: isShiny || existing.shiny || false },
        },
      };
    });
  }

  function markCaught(id, isShiny = false) {
    unlockAchievement("firstCapture");
    if (isShiny) unlockAchievement("firstShiny");
    setState((prev) => {
      const existing = prev.pokedexRun[id] || {};
      updateHistoricPokedex(id, true, isShiny);
      return {
        ...prev,
        pokedexRun: {
          ...prev.pokedexRun,
          [id]: { seen: true, caught: true, shiny: isShiny || existing.shiny || false },
        },
      };
    });
  }

  return { markSeen, markCaught };
}
