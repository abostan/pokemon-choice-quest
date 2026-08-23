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

export const MAX_LEVEL = 100;
export const LEGENDARY_CHANCE = 0.05;

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

/** Applica computeDifficultyMultiplier a una potenza base, arrotondando. */
export function computeScaledPower(basePower, state) {
  return Math.round(basePower * computeDifficultyMultiplier(state));
}

/**
 * Decide la prossima fase dopo la vittoria su una palestra. Richiede solo
 * { gymIndex, rivalDone, villainBossDone } da state, oltre alla generation
 * corrente. Non sblocca achievement: il chiamante decide in base a `phase`.
 * @returns {{ phase: string, patch: object }}
 */
export function resolveAfterGymBattle(state, generation) {
  const finishedGymIndex = state.gymIndex;
  const nextGymIndex = finishedGymIndex + 1;

  if (generation.rival && !state.rivalDone && generation.rival.afterGymIndex === finishedGymIndex) {
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
 * @returns {{ phase: string, patch: object, isGrandMaster: boolean }}
 */
export function resolveNextGeneration(state) {
  const nextGen = getNextGeneration(state.generationId);
  const newCompletedCount = (state.completedGensCount || 0) + 1;

  if (nextGen) {
    return {
      phase: "nextGenSelect",
      patch: { nextGenId: nextGen.id, completedGensCount: newCompletedCount },
      isGrandMaster: false,
    };
  }

  return {
    phase: "postgame",
    patch: { completedGensCount: newCompletedCount },
    isGrandMaster: newCompletedCount >= GENERATIONS.length,
  };
}

/**
 * Decide se il prossimo passo del post-game infinito è un incontro
 * leggendario (a probabilità LEGENDARY_CHANCE, solo se ne resta almeno uno
 * non ancora catturato per questa generazione) oppure la normale esplorazione.
 * @param {object} state
 * @param {object} generation
 * @param {() => number} rng iniettabile per i test, default Math.random
 * @returns {{ phase: string, patch: object }}
 */
export function resolvePostgameExplore(state, generation, rng = Math.random) {
  const availableLegendaries = (generation?.legendaries || []).filter(
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
