// Calcolo dell'effetto di una condizione atmosferica attiva sulla potenza
// squadra in battaglia — stesso pattern di typeMatchup.js (nessuna dipendenza
// da React, modulo puro e testabile in isolamento).
import { getPokemonType } from "../data/types.js";

/**
 * Calcola il bonus/malus di potenza dato il meteo attivo e i tipi in squadra.
 *
 * @param {Array<{ id: number, level: number }>} team
 * @param {{ icon: string, name: string, boostTypes: string[], malusTypes: string[] } | null} weather
 * @returns {{ multiplier: number, status: 'boost'|'malus'|'neutral', message: string }}
 */
export function computeWeatherEffect(team, weather) {
  if (!team || team.length === 0 || !weather) {
    return { multiplier: 1.0, status: "neutral", message: "" };
  }

  const teamTypes = [...new Set(team.map((p) => getPokemonType(p.id)))];

  const boostMatches = teamTypes.filter((t) => weather.boostTypes.includes(t));
  if (boostMatches.length > 0) {
    return {
      multiplier: 1.10,
      status: "boost",
      message: `${weather.icon} ${weather.name}: la tua squadra di tipo ${boostMatches.join(", ")} è avvantaggiata (+10% Potenza)!`,
    };
  }

  const malusMatches = teamTypes.filter((t) => weather.malusTypes.includes(t));
  if (malusMatches.length > 0) {
    return {
      multiplier: 0.92,
      status: "malus",
      message: `${weather.icon} ${weather.name}: la tua squadra di tipo ${malusMatches.join(", ")} è penalizzata (-8% Potenza)!`,
    };
  }

  return {
    multiplier: 1.0,
    status: "neutral",
    message: `${weather.icon} ${weather.name}: nessun effetto particolare sulla tua squadra questa volta.`,
  };
}
