// Decisione pura "quale scena mostrare per questa fase", estratta da
// SceneRouter.js (Fase 10 di ROADMAP.md, "estensioni successive"). Nata dal
// bug reale di isPostgame: si era manifestato all'utente proprio come un
// problema di routing ("niente palestre visibili"), ma nulla nel progetto
// testava il routing stesso. Renderizzare per davvero componenti React
// richiederebbe jsdom + una libreria di testing, dipendenze che stridono con
// la filosofia "zero build" del progetto — questa funzione isola solo la
// *decisione* (quale sceneKey corrisponde a una fase), testabile senza
// montare nulla. SceneRouter.js resta l'unico responsabile di come renderizzare
// ciascuna sceneKey (JSX, callback onResolved, side-effect) — qui non c'è
// nessuna di quella logica, solo il mapping fase -> sceneKey.

const PHASE_TO_SCENE = {
  resume: "resume",
  generationSelect: "generationSelect",
  starterSelect: "starterSelect",
  pokecenter: "pokecenter",
  merchant: "merchant",
  postgame: "postgame",
  championsTournament: "championsTournament",
  tournamentBattle: "tournamentBattle",
  explore: "explore",
  postgameExplore: "explore",
  gymBattle: "gymBattleContainer",
  rivalBattle: "gymBattleContainer",
  villainBossBattle: "gymBattleContainer",
  nextGenSelect: "leagueContainer",
  eliteBattle: "leagueContainer",
  championBattle: "leagueContainer",
  trainerBattle: "trainerBattle",
  encounter: "encounter",
  legendaryEncounter: "encounter",
  nuzlockeGameOver: "nuzlockeGameOver",
  end: "end",
};

/**
 * Restituisce la chiave simbolica della scena da renderizzare per una data
 * fase, o "fallbackHub" se la fase non è riconosciuta (la schermata di
 * emergenza "Esplora / Palestra" mostrata in fondo a SceneRouter.js).
 * @param {string} phase
 * @returns {string}
 */
export function resolveSceneForPhase(phase) {
  return PHASE_TO_SCENE[phase] ?? "fallbackHub";
}
