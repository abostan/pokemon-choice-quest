// 4 condizioni atmosferiche estraibili dal bivio "micro-Clima" durante
// l'esplorazione. Ognuna avvantaggia/penalizza la squadra in base al tipo dei
// suoi Pokémon nella prossima battaglia affrontata (poi si consuma).

export const WEATHER_CONDITIONS = [
  {
    id: "sun",
    icon: "☀️",
    name: "Sole Intenso",
    boostTypes: ["Fuoco"],
    malusTypes: ["Acqua"],
  },
  {
    id: "rain",
    icon: "🌧️",
    name: "Pioggia Battente",
    boostTypes: ["Acqua"],
    malusTypes: ["Fuoco"],
  },
  {
    id: "sandstorm",
    icon: "🌪️",
    name: "Tempesta di Sabbia",
    boostTypes: ["Roccia", "Terra", "Coleottero"],
    malusTypes: ["Erba"],
  },
  {
    id: "fog",
    icon: "🌫️",
    name: "Nebbia Fitta",
    boostTypes: ["Spettro", "Veleno"],
    malusTypes: ["Normale"],
  },
];

/**
 * Estrae una condizione atmosferica casuale (pesi uguali tra le 4).
 * @param {() => number} rng
 */
export function rollWeather(rng = Math.random) {
  const idx = Math.floor(rng() * WEATHER_CONDITIONS.length);
  return WEATHER_CONDITIONS[Math.min(idx, WEATHER_CONDITIONS.length - 1)];
}
