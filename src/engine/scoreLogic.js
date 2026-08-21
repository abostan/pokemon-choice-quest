// Logica di calcolo del Punteggio di Vittoria e Grado d'Onore (Grado S / A / B / C)

export const RANKS = {
  S: {
    code: "S",
    title: "Maestro Pokémon Supremo",
    trophy: "🏆",
    color: "#f59e0b",
    minScore: 25000,
    description: "Una prestazione leggendaria! La tua maestria è senza pari nel mondo Pokémon.",
  },
  A: {
    code: "A",
    title: "Allenatore d'Élite",
    trophy: "🥇",
    color: "#eab308",
    minScore: 15000,
    description: "Capacità tattiche straordinarie! Sei tra i migliori Allenatori della regione.",
  },
  B: {
    code: "B",
    title: "Veterano della Lega",
    trophy: "🥈",
    color: "#94a3b8",
    minScore: 8000,
    description: "Una solida avventura condotta con coraggio e determinazione.",
  },
  C: {
    code: "C",
    title: "Allenatore Promettente",
    trophy: "🥉",
    color: "#b45309",
    minScore: 0,
    description: "Un buon inizio nel cammino Pokémon. Continua ad allenarti per salire di grado!",
  },
};

/**
 * Calcola il punteggio dettagliato ed il grado d'onore.
 * @param {object} state
 * @returns {object}
 */
export function computeVictoryScore(state) {
  if (!state) return { totalScore: 0, rank: RANKS.C, breakdown: {} };

  const team = state.team || [];
  const badges = state.badges || [];
  const pokedexRun = state.pokedexRun || {};
  const isNuzlocke = !!state.isNuzlocke;
  const completedGens = state.completedGensCount || 0;

  // 1. Punti Medaglie (+500 per medaglia)
  const badgePoints = badges.length * 500;

  // 2. Punti Livelli Squadra (+50 per livello)
  const teamLevelsPoints = team.reduce((sum, p) => sum + (p.level || 1), 0) * 50;

  // 3. Punti Pokédex (+100 per specie catturata)
  const caughtCount = Object.values(pokedexRun).filter((p) => p && p.caught).length;
  const pokedexPoints = caughtCount * 100;

  // 4. Bonus Shiny ✨ (+1500 per Shiny in squadra)
  const shinyCount = team.filter((p) => p.isShiny).length;
  const shinyPoints = shinyCount * 1500;

  // Subtotale prima del moltiplicatore Nuzlocke e generazioni
  const subtotal = badgePoints + teamLevelsPoints + pokedexPoints + shinyPoints;

  // 5. Moltiplicatore Nuzlocke (+50% se attivo)
  const nuzlockeMult = isNuzlocke ? 1.5 : 1.0;

  // 6. Bonus Generazioni Completate (+20% per gen extra)
  const genMult = 1.0 + completedGens * 0.20;

  const totalScore = Math.round(subtotal * nuzlockeMult * genMult);

  // Determinazione Grado
  let rank = RANKS.C;
  if (totalScore >= RANKS.S.minScore) rank = RANKS.S;
  else if (totalScore >= RANKS.A.minScore) rank = RANKS.A;
  else if (totalScore >= RANKS.B.minScore) rank = RANKS.B;

  return {
    totalScore,
    rank,
    breakdown: {
      badgePoints,
      badgesCount: badges.length,
      teamLevelsPoints,
      pokedexPoints,
      caughtCount,
      shinyPoints,
      shinyCount,
      nuzlockeMult,
      genMult,
      isNuzlocke,
    },
  };
}

const HIGH_SCORE_KEY = "pcq_high_score";

export function getHighScore() {
  try {
    const val = localStorage.getItem(HIGH_SCORE_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export function saveHighScore(score) {
  try {
    const currentHigh = getHighScore();
    if (score > currentHigh) {
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      return true;
    }
  } catch (e) {}
  return false;
}
