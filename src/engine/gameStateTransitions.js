// Decisioni di transizione della macchina a stati di gioco, estratte da
// useGameState.js come funzioni pure (nessuna dipendenza da React, nessun
// side-effect): dato lo state (o un sottoinsieme minimo di esso), restituiscono
// la prossima fase e la patch da applicare, senza mai chiamare goTo/setState/
// unlockAchievement direttamente — quello resta a carico del chiamante.
//
// Nate dal bug reale di isPostgame (Fase 10 di ROADMAP.md): un `8` hardcoded
// invece di GENERATIONS.length faceva scattare il post-game appena raggiunta
// Paldea, saltando le sue 8 palestre. Nessun test poteva scoprirlo perché
// questa logica viveva solo dentro un hook React non testabile in isolamento.

import { GENERATIONS, getNextGeneration } from "../data/generations.js";
import { computeTeamPower, computeWinChance } from "./battleLogic.js";

export const MAX_LEVEL = 100;
export const LEGENDARY_CHANCE = 0.05;

// Meccanismo "catch-up" ibrido (ROADMAP.md, richiesta di bilanciamento dopo il
// caso reale della Palestra 1): la curva di potenza resta quella statica di
// generations.js (ricompensa catturare/allenarsi con progressi reali), ma se
// con la squadra ATTUALE quella potenza produrrebbe un winrate sotto
// CATCHUP_MIN_WINCHANCE, l'avversario viene ammorbidito verso quella soglia —
// mai oltre, e mai il contrario: una squadra già forte non viene mai
// rincorsa/penalizzata, altrimenti catturare Pokémon smetterebbe di contare
// (rischio segnalato esplicitamente durante la discussione di bilanciamento).
// CATCHUP_STRENGTH < 1 lascia comunque una vera sfida sotto la soglia, invece
// di garantire un porto sicuro assoluto.
export const CATCHUP_MIN_WINCHANCE = 0.35;
export const CATCHUP_STRENGTH = 0.65;

/**
 * Potenza avversaria che produrrebbe esattamente CATCHUP_MIN_WINCHANCE dato
 * teamPower, invertendo computeWinChance in tattica "balanced" e senza
 * abilità passive (stessa baseline mostrata prima che il giocatore scelga
 * tattica/oggetti/mega in battaglia — vedi BattleScene.js).
 */
function computeCatchUpTargetPower(teamPower) {
  // raw = 0.5 + (team - opp) / (1.5 * opp)  =>  opp = team / (1.5*(raw-0.5) + 1)
  const denom = 1.5 * (CATCHUP_MIN_WINCHANCE - 0.5) + 1;
  return teamPower / denom;
}

/**
 * True se il giocatore ha completato tutte le regioni disponibili, oppure è
 * oltre le palestre della regione corrente, oppure si trova già in una delle
 * fasi post-game/torneo.
 */
export function computeIsPostgame(state, generation) {
  return (
    (state.completedGensCount || 0) >= GENERATIONS.length ||
    (generation != null && state.gymIndex >= generation.gymLeaders.length) ||
    (state.phase != null && state.phase.startsWith("postgame")) ||
    (state.phase != null && state.phase.startsWith("champions")) ||
    (state.phase != null && state.phase.startsWith("tournament"))
  );
}

/** Moltiplicatore di difficoltà: cresce con le regioni completate e in Nuzlocke. */
export function computeDifficultyMultiplier(state) {
  const completedGens = state.completedGensCount || 0;
  const nuzlockeBonus = state.isNuzlocke ? 0.1 : 0;
  return 1.0 + completedGens * 0.15 + nuzlockeBonus;
}

/**
 * Applica computeDifficultyMultiplier a una potenza base, poi ammorbidisce
 * (solo verso il basso, vedi CATCHUP_STRENGTH sopra) il risultato se la
 * squadra attuale del giocatore ne uscirebbe con un winrate troppo basso.
 * `state.team` assente/vuoto (es. chiamate di test con solo completedGensCount
 * /isNuzlocke) disattiva la correzione e restituisce la sola curva statica.
 */
export function computeScaledPower(basePower, state) {
  const staticPower = basePower * computeDifficultyMultiplier(state);
  const teamPower = computeTeamPower(state.team || [], {});
  if (teamPower <= 0) return Math.round(staticPower);

  const winChance = computeWinChance(teamPower, staticPower);
  if (winChance >= CATCHUP_MIN_WINCHANCE) return Math.round(staticPower);

  const targetPower = computeCatchUpTargetPower(teamPower);
  const blended = staticPower + (targetPower - staticPower) * CATCHUP_STRENGTH;
  return Math.round(Math.max(1, blended));
}

/**
 * Decide la prossima fase dopo la vittoria su una palestra. Richiede solo
 * { gymIndex, rivalDone, villainBossDone } da state, oltre alla generation
 * corrente. Non sblocca achievement: il chiamante decide in base a `phase`.
 *
 * `generation.rival` è un array di stage (il Rivale ricompare più volte
 * lungo la regione, con una squadra che cresce — vedi ROADMAP.md Fase 7):
 * `state.rivalDone` è quindi un contatore di quanti stage sono già stati
 * affrontati, non più un booleano. Lo stage successivo è
 * `generation.rival[state.rivalDone]`.
 * @returns {{ phase: string, patch: object }}
 */
export function resolveAfterGymBattle(state, generation) {
  const finishedGymIndex = state.gymIndex;
  const nextGymIndex = finishedGymIndex + 1;

  const nextRivalStage = generation.rival?.[state.rivalDone || 0];
  if (nextRivalStage && nextRivalStage.afterGymIndex === finishedGymIndex) {
    return { phase: "rivalBattle", patch: { gymIndex: nextGymIndex } };
  }

  if (generation.villainBoss && !state.villainBossDone && generation.villainBoss.afterGymIndex === finishedGymIndex) {
    return { phase: "villainBossBattle", patch: { gymIndex: nextGymIndex } };
  }

  if (nextGymIndex >= generation.gymLeaders.length) {
    return { phase: "eliteBattle", patch: { gymIndex: nextGymIndex, eliteIndex: 0 } };
  }

  return { phase: "explore", patch: { gymIndex: nextGymIndex } };
}

/**
 * Decide la prossima fase dopo aver affrontato un membro dell'Alto Comando:
 * il prossimo membro, o la sfida al Campione se era l'ultimo. Richiede solo
 * { eliteIndex } da state, oltre alla generation corrente.
 * @returns {{ phase: string, patch: object }}
 */
export function resolveAfterEliteBattle(state, generation) {
  const nextEliteIndex = state.eliteIndex + 1;
  const totalMembers = generation?.eliteFour?.length ?? 4;
  if (nextEliteIndex >= totalMembers) {
    return { phase: "championBattle", patch: {} };
  }
  return { phase: "eliteBattle", patch: { eliteIndex: nextEliteIndex } };
}

/**
 * Decide la prossima fase dopo aver completato una regione (Alto Comando +
 * Campione battuti). `isGrandMaster` è true solo quando il conteggio
 * raggiunge GENERATIONS.length — il chiamante decide se sbloccare l'achievement.
 *
 * Archivia anche le medaglie della regione appena completata in
 * `badgesByGeneration` (storico multi-regione, mostrato raggruppato per
 * regione in BadgesModal.js) — questo è l'unico punto raggiunto sia se
 * esiste una regione successiva sia se questa era l'ultima (Paldea ->
 * postgame), quindi un solo punto di scrittura invece di uno per ramo.
 * `state.badges` viene azzerato più tardi (quando il giocatore preme
 * "Continua" nella schermata della nuova regione), dopo che questo
 * snapshot è già stato preso.
 * @returns {{ phase: string, patch: object, isGrandMaster: boolean }}
 */
export function resolveNextGeneration(state) {
  const nextGen = getNextGeneration(state.generationId);
  const newCompletedCount = (state.completedGensCount || 0) + 1;
  const badgesByGeneration = { ...state.badgesByGeneration, [state.generationId]: state.badges };

  if (nextGen) {
    return {
      phase: "nextGenSelect",
      patch: { nextGenId: nextGen.id, completedGensCount: newCompletedCount, badgesByGeneration },
      isGrandMaster: false,
    };
  }

  return {
    phase: "postgame",
    patch: { completedGensCount: newCompletedCount, badgesByGeneration },
    isGrandMaster: newCompletedCount >= GENERATIONS.length,
  };
}

/**
 * Decide se il prossimo passo del post-game infinito è un incontro
 * leggendario (a probabilità LEGENDARY_CHANCE, solo se ne resta almeno uno
 * non ancora catturato) oppure la normale esplorazione.
 *
 * Pesca dal pool di **tutte** le regioni in GENERATIONS, non solo quella
 * corrente — prima era limitato a `generation.legendaries` (la singola
 * regione in cui ci si trova, che in post-game non cambia mai): una volta
 * catturati tutti i leggendari di quella sola regione, il roll non scattava
 * mai più, lasciando le Ultra Bestie (Fenditura Ultra-Varco) come unica
 * fonte rimasta di incontri rari. Segnalato da un giocatore reale.
 * @param {object} state
 * @param {() => number} rng iniettabile per i test, default Math.random
 * @returns {{ phase: string, patch: object }}
 */
export function resolvePostgameExplore(state, rng = Math.random) {
  const allLegendaries = GENERATIONS.flatMap((gen) => gen.legendaries || []);
  const availableLegendaries = allLegendaries.filter(
    (id) => !(state.caughtLegendaries || []).includes(id)
  );

  if (availableLegendaries.length > 0 && rng() < LEGENDARY_CHANCE) {
    const legendaryId = availableLegendaries[Math.floor(rng() * availableLegendaries.length)];
    return {
      phase: "legendaryEncounter",
      patch: {
        pendingEncounterPool: [legendaryId],
        pendingEncounterLevel: Math.min(MAX_LEVEL, 60 + (state.postgameRound || 0) * 2),
        pendingEncounterIsLegendary: true,
      },
    };
  }

  return { phase: "postgameExplore", patch: {} };
}

/**
 * Risolve una sconfitta: aggiorna sempre teamFatigued; in Nuzlocke fa
 * svenire permanentemente l'ultimo Pokémon in squadra, spostandolo nel box,
 * e passa a nuzlockeGameOver se non resta nessun Pokémon sano. Restituisce
 * lo state completo aggiornato (stessa forma già usata dal setState di
 * useGameState.js), non solo una patch.
 */
export function resolveNuzlockeLoss(state) {
  if (state.team.length === 0) return state;

  const fatigued = state.teamFatigued ? state : { ...state, teamFatigued: true };
  if (!fatigued.isNuzlocke) return fatigued;

  const fainted = { ...fatigued.team[fatigued.team.length - 1], isFainted: true };
  const nextTeam = fatigued.team.slice(0, fatigued.team.length - 1);
  const nextBox = [...fatigued.box, fainted];
  const hasHealthyInBox = nextBox.some((p) => !p.isFainted);

  if (nextTeam.length === 0 && !hasHealthyInBox) {
    return { ...fatigued, team: nextTeam, box: nextBox, phase: "nuzlockeGameOver" };
  }

  const shouldOpenBox = nextTeam.length === 0 && hasHealthyInBox;
  return {
    ...fatigued,
    team: nextTeam,
    box: nextBox,
    boxModalOpen: shouldOpenBox ? true : fatigued.boxModalOpen,
  };
}
