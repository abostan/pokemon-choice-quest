// Logica pura del Casinò Razzo — nessuna dipendenza da React, facile da testare.
// Le probabilità sono fisse (25% jackpot / 40% vincita media / 35% piccola
// perdita); la puntata scala solo l'entità del payout in Pokédollari, non le
// probabilità di ciascun esito.

export const CASINO_STAKES = [5, 10, 20];

/**
 * Determina l'esito di una giocata al Casinò Razzo dato l'importo puntato.
 * @param {number} stake - Pokédollari puntati (deve essere <= saldo del giocatore)
 * @param {() => number} rng
 * @returns {{ tier: 'jackpot'|'mid'|'loss', coinsDelta: number }}
 */
export function rollCasinoOutcome(stake, rng = Math.random) {
  const roll = rng();
  if (roll < 0.25) {
    return { tier: "jackpot", coinsDelta: stake * 3 };
  }
  if (roll < 0.65) {
    return { tier: "mid", coinsDelta: Math.round(stake * 0.5) };
  }
  return { tier: "loss", coinsDelta: -stake };
}
