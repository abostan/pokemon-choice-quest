// Modulo per il calcolo dell'efficacia dei tipi (Super Efficace / Poco Efficace).
import { getPokemonType } from "../data/types.js";

// Tabella delle relazioni di efficacia: tipoAttaccante -> array di tipi contro cui è Super Efficace (+15%)
export const TYPE_SUPER_EFFECTIVE = {
  Fuoco: ["Erba", "Ghiaccio", "Coleottero", "Acciaio"],
  Acqua: ["Fuoco", "Roccia", "Terra"],
  Erba: ["Acqua", "Roccia", "Terra"],
  Elettrico: ["Acqua", "Volante"],
  Lotta: ["Normale", "Ghiaccio", "Roccia", "Buio", "Acciaio"],
  Spettro: ["Psico", "Spettro"],
  Psico: ["Lotta", "Veleno"],
  Buio: ["Psico", "Spettro"],
  Ghiaccio: ["Erba", "Terra", "Volante", "Drago"],
  Drago: ["Drago"],
  Folletto: ["Lotta", "Drago", "Buio"],
  Acciaio: ["Roccia", "Ghiaccio", "Folletto"],
  Terra: ["Fuoco", "Elettrico", "Veleno", "Roccia", "Acciaio"],
  Roccia: ["Fuoco", "Ghiaccio", "Volante", "Coleottero"],
  Volante: ["Erba", "Lotta", "Coleottero"],
  Coleottero: ["Erba", "Psico", "Buio"],
  Veleno: ["Erba", "Folletto"],
  Normale: [],
};

/**
 * Calcola il bonus/malus di efficacia di tipo della squadra contro un tipo avversario.
 *
 * @param {Array<{ id: number, level: number }>} team
 * @param {string} opponentType (es. "Roccia", "Acqua", "Fuoco", etc.)
 * @returns {{ multiplier: number, status: 'super'|'weak'|'neutral', message: string }}
 */
export function computeTypeEffectiveness(team, opponentType) {
  if (!team || team.length === 0 || !opponentType) {
    return { multiplier: 1.0, status: "neutral", message: "" };
  }

  // Estrae i tipi dei Pokémon in squadra
  const teamTypes = [...new Set(team.map((p) => getPokemonType(p.id)))];

  // Controlla se la squadra ha Pokémon Super Efficaci contro l'avversario
  const superEffectiveTypes = teamTypes.filter((type) => {
    const targets = TYPE_SUPER_EFFECTIVE[type] || [];
    return targets.includes(opponentType) || opponentType.includes(type);
  });

  if (superEffectiveTypes.length > 0) {
    return {
      multiplier: 1.15, // +15% potenza squadra
      status: "super",
      message: `⚡ Vantaggio di Tipo (+15% Potenza): la tua squadra ha Pokémon di tipo ${superEffectiveTypes.join(", ")} Super Efficaci!`,
    };
  }

  // Controlla se l'avversario ha il vantaggio di tipo sulla squadra
  const oppTargets = TYPE_SUPER_EFFECTIVE[opponentType] || [];
  const weakCount = teamTypes.filter((t) => oppTargets.includes(t)).length;

  if (weakCount >= Math.ceil(teamTypes.length / 2)) {
    return {
      multiplier: 0.90, // -10% potenza squadra
      status: "weak",
      message: `⚠️ Svantaggio di Tipo (-10% Potenza): il tipo ${opponentType} dell'avversario è efficace contro la tua squadra!`,
    };
  }

  return {
    multiplier: 1.0,
    status: "neutral",
    message: "",
  };
}
