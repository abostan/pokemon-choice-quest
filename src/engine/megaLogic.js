// Modulo per la gestione della Megaevoluzione / Gigamax durante le battaglie.

export const MEGA_POWER_BOOST_RATIO = 1.30; // +30% potenza squadra

/**
 * Calcola la potenza potenziata dalla Megaevoluzione.
 * @param {number} basePower
 * @returns {number}
 */
export function computeMegaPower(basePower) {
  return Math.round(basePower * MEGA_POWER_BOOST_RATIO);
}
