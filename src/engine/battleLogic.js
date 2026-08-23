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
/**
 * Calcola la probabilità di cattura (0..1) in base al metodo scelto
 * dal giocatore, tasso base ed eventuale abilità Leggiadria.
 */
export function computeCaptureChance(method, baseRate = 0.55, isLegendary = false, hasSereneGrace = false) {
  if (method === 'masterball') {
    return 1.0; // 100% cattura garantita!
  }
  const sereneBonus = hasSereneGrace ? 0.10 : 0;
  if (isLegendary) {
    const legMod = method === 'food' ? 1.2 : 1.0;
    return clamp(0.10 * legMod + sereneBonus / 2, 0.03, 0.20);
  }
  const modifiers = {
    ball: 1.0,
    food: 1.25, // più efficace...
  };
  const mod = modifiers[method] ?? 1.0;
  return clamp(baseRate * mod + sereneBonus, 0.05, 0.95);
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

export const TACTICS = [
  { id: "aggressive", label: "⚔️ Attacco Aggressivo", hint: "+15% potenza attacco, ma aumenta il rischio" },
  { id: "balanced", label: "⚖️ Tattica Bilanciata", hint: "Equilibrio standard tra attacco e difesa" },
  { id: "defensive", label: "🛡️ Difesa Prudente", hint: "-10% potenza attacco, ma riduce i danni subiti dall'avversario" },
];

const TACTIC_MODIFIERS = {
  aggressive: { teamMult: 1.15, opponentMult: 1.05 },
  balanced: { teamMult: 1.0, opponentMult: 1.0 },
  defensive: { teamMult: 0.9, opponentMult: 0.85 },
};

/**
 * Calcola la probabilità di vittoria (0..1) data la potenza delle due
 * squadre, la tattica scelta e le abilità passive attive.
 */
export function computeWinChance(teamPower, opponentPower, tactic = 'balanced', teamAbilities = []) {
  const { teamMult, opponentMult } = TACTIC_MODIFIERS[tactic] ?? TACTIC_MODIFIERS.balanced;
  
  // Abilità passive
  const hasIntimidate = teamAbilities.some((a) => a.name === "Prepotenza");
  const hasPressure = teamAbilities.some((a) => a.name === "Pressione");
  const hasSpeedBoost = teamAbilities.some((a) => a.name === "Acceleratore");

  const intimidateMod = hasIntimidate ? 0.90 : 1.0; // Riduce potenza avversaria del -10%
  const effectiveTeam = teamPower * teamMult;
  const effectiveOpponent = Math.max(opponentPower * opponentMult * intimidateMod, 1);

  let raw = 0.5 + (effectiveTeam - effectiveOpponent) / (1.5 * effectiveOpponent);

  if (hasPressure) raw += 0.08;
  if (hasSpeedBoost) raw += 0.05;

  return clamp(raw, 0.08, 0.92);
}

export function rollBattle(winChance, rng = Math.random) {
  return rng() < winChance;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
