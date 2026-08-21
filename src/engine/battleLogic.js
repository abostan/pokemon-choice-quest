// Logica di gioco pura (nessuna dipendenza da React), così è facile da
// testare e da modificare in isolamento.

/**
 * Calcola la probabilità di cattura (0..1) in base al metodo scelto
 * dal giocatore e a un tasso di base del Pokémon selvatico.
 *
 * @param {'ball'|'food'} method
 * @param {number} baseRate probabilità di base tra 0 e 1
 */
/**
 * Calcola la probabilità di cattura (0..1) in base al metodo scelto
 * dal giocatore e a un tasso di base del Pokémon selvatico.
 *
 * @param {'ball'|'food'} method
 * @param {number} baseRate probabilità di base tra 0 e 1
 * @param {boolean} isLegendary se il Pokémon è leggendario (tasso massimo 20%)
 */
export function computeCaptureChance(method, baseRate = 0.55, isLegendary = false) {
  if (isLegendary) {
    const legMod = method === 'food' ? 1.2 : 1.0;
    return clamp(0.15 * legMod, 0.05, 0.20);
  }
  const modifiers = {
    ball: 1.0,
    food: 1.25, // più efficace...
  };
  const mod = modifiers[method] ?? 1.0;
  return clamp(baseRate * mod, 0.05, 0.90);
}

/**
 * Effettua il tiro di cattura. Separata da computeCaptureChance per poter
 * testare la parte matematica senza dipendere da Math.random.
 */
export function rollCapture(chance, rng = Math.random) {
  return rng() < chance;
}

export const MAX_LEVEL = 100;

export function clampLevel(level) {
  return Math.min(MAX_LEVEL, Math.max(1, level));
}

/**
 * Potenza complessiva di una squadra, usata per stimare l'esito delle
 * battaglie. Più Pokémon e livelli più alti = squadra più forte.
 */
export function computeTeamPower(team) {
  if (!team || team.length === 0) return 0;
  const totalLevels = team.reduce((sum, p) => sum + Math.min(p.level, MAX_LEVEL), 0);
  const countBonus = team.length * 2; // avere più Pokémon aiuta comunque
  return totalLevels + countBonus;
}

const TACTIC_MODIFIERS = {
  aggressive: { teamMult: 1.15, opponentMult: 1.05 },
  balanced: { teamMult: 1.0, opponentMult: 1.0 },
  defensive: { teamMult: 0.9, opponentMult: 0.85 },
};

/**
 * Calcola la probabilità di vittoria (0..1) data la potenza delle due
 * squadre e la tattica scelta dal giocatore.
 */
export function computeWinChance(teamPower, opponentPower, tactic = 'balanced') {
  const { teamMult, opponentMult } = TACTIC_MODIFIERS[tactic] ?? TACTIC_MODIFIERS.balanced;
  const effectiveTeam = teamPower * teamMult;
  const effectiveOpponent = Math.max(opponentPower * opponentMult, 1);
  const raw = 0.5 + (effectiveTeam - effectiveOpponent) / (1.5 * effectiveOpponent);
  return clamp(raw, 0.08, 0.85);
}

export function rollBattle(winChance, rng = Math.random) {
  return rng() < winChance;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
