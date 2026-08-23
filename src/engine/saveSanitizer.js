// Sanitizzatore e validatore automatico per lo stato di gioco.
// Assicura che i dati caricati da LocalStorage o importati da JSON
// siano sempre validi e conformi alle aspettative dei componenti React.

export function sanitizeGameState(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    phase: typeof raw.phase === "string" ? raw.phase : "generationSelect",
    generationId: typeof raw.generationId === "string" ? raw.generationId : null,
    nextGenId: typeof raw.nextGenId === "string" ? raw.nextGenId : null,
    gymIndex: typeof raw.gymIndex === "number" && !isNaN(raw.gymIndex) ? Math.max(0, raw.gymIndex) : 0,
    eliteIndex: typeof raw.eliteIndex === "number" && !isNaN(raw.eliteIndex) ? Math.max(0, raw.eliteIndex) : 0,
    // Era un booleano prima che il Rivale diventasse ricorrente (Fase 7): ora
    // è un contatore di stage già affrontati. Un salvataggio vecchio con
    // `true` migra a 1 (il giocatore ha già affrontato "il rivale" una
    // volta, i nuovi stage restano da scoprire), `false`/assente a 0.
    rivalDone:
      typeof raw.rivalDone === "number" && !isNaN(raw.rivalDone)
        ? Math.max(0, raw.rivalDone)
        : raw.rivalDone === true
        ? 1
        : 0,
    villainBossDone: !!raw.villainBossDone,

    team: Array.isArray(raw.team) ? raw.team.filter((p) => p && typeof p.id === "number") : [],
    box: Array.isArray(raw.box) ? raw.box.filter((p) => p && typeof p.id === "number") : [],
    badges: Array.isArray(raw.badges) ? raw.badges.filter((b) => typeof b === "string") : [],
    items: Array.isArray(raw.items) ? raw.items.filter((i) => typeof i === "string") : [],
    coins: typeof raw.coins === "number" && !isNaN(raw.coins) ? Math.max(0, raw.coins) : 5,

    pendingEncounterPool: Array.isArray(raw.pendingEncounterPool) ? raw.pendingEncounterPool : null,
    pendingEncounterLevel: typeof raw.pendingEncounterLevel === "number" ? raw.pendingEncounterLevel : 4,
    pendingEncounterIsLegendary: !!raw.pendingEncounterIsLegendary,
    pendingTrainer: raw.pendingTrainer && typeof raw.pendingTrainer === "object" ? raw.pendingTrainer : null,

    multiGenRun: !!raw.multiGenRun,
    completedGensCount: typeof raw.completedGensCount === "number" && !isNaN(raw.completedGensCount) ? Math.max(0, raw.completedGensCount) : 0,
    postgameRound: typeof raw.postgameRound === "number" && !isNaN(raw.postgameRound) ? Math.max(0, raw.postgameRound) : 0,
    tournamentRound: typeof raw.tournamentRound === "number" && !isNaN(raw.tournamentRound) ? Math.max(0, raw.tournamentRound) : 0,

    isNuzlocke: !!raw.isNuzlocke,
    isRandomizer: !!raw.isRandomizer,
    teamFatigued: !!raw.teamFatigued,
    monoType: typeof raw.monoType === "string" ? raw.monoType : null,
    choicesCount: typeof raw.choicesCount === "number" && !isNaN(raw.choicesCount) ? Math.max(0, raw.choicesCount) : 0,
    pokedexRun: raw.pokedexRun && typeof raw.pokedexRun === "object" ? raw.pokedexRun : {},
    pokedexOpen: false,
    activeMega: false,
    activeTerastal: false,
    activeItemBoost: 0,
    activeWeather: null,

    pendingEvolutions: Array.isArray(raw.pendingEvolutions) ? raw.pendingEvolutions : [],
    caughtLegendaries: Array.isArray(raw.caughtLegendaries) ? raw.caughtLegendaries : [],
    lastEncounterId: typeof raw.lastEncounterId === "number" ? raw.lastEncounterId : null,

    boxModalOpen: false,
    hallOfFameOpen: false,
    scoreModalOpen: false,
  };
}
