import { useState, useEffect } from "react";
import { logger } from "../engine/logger.js";
import { getGeneration, getNextGeneration, GENERATIONS } from "../data/generations.js";
import { unlockAchievement } from "../engine/achievements.js";
import { checkEvolution } from "../data/evolutions.js";
import { filterEncounterPoolByChallenge } from "../engine/challengeEngine.js";
import { hasSave } from "../engine/saveGame.js";
import { useSaveSlot } from "./useSaveSlot.js";
import { usePokedexState } from "./usePokedexState.js";
import {
  isAudioMuted,
  toggleAudioMute,
  playButtonClickSound,
  playLevelUpSound,
  playItemUseSound,
} from "../engine/soundEngine.js";

export const WIN_LEVEL_BOOST = 3;
export const MAX_LEVEL = 100;
export const MAX_TEAM_SIZE = 6;
export const LEGENDARY_CHANCE = 0.05;

export function initialState() {
  return {
    phase: "generationSelect",
    generationId: null,
    nextGenId: null,
    gymIndex: 0,
    eliteIndex: 0,
    rivalDone: false,
    villainBossDone: false,
    team: [],
    box: [],
    badges: [],
    items: [],
    coins: 5,
    pendingEncounterPool: null,
    pendingEncounterLevel: 4,
    pendingEncounterIsLegendary: false,
    pendingTrainer: null,
    multiGenRun: false,
    completedGensCount: 0,
    postgameRound: 0,
    tournamentRound: 0,
    isNuzlocke: false,
    isRandomizer: false,
    teamFatigued: false,
    monoType: null,
    choicesCount: 0,
    pokedexRun: {},
    pokedexOpen: false,
    activeMega: false,
    activeTerastal: false,
    activeItemBoost: 0,
    activeWeather: null,
    pendingEvolutions: [],
    caughtLegendaries: [],
    boxModalOpen: false,
    hallOfFameOpen: false,
    scoreModalOpen: false,
  };
}

export function useGameState() {
  const [muted, setMuted] = useState(() => isAudioMuted());

  function handleToggleAudio() {
    const nextMuted = toggleAudioMute();
    setMuted(nextMuted);
  }

  const [state, setState] = useState(() => {
    if (hasSave()) {
      return { ...initialState(), phase: "resume" };
    }
    return initialState();
  });

  const slotSave = useSaveSlot(state, setState, initialState);
  const pokedexState = usePokedexState(setState);

  // Controllo globale Nuzlocke Game Over
  useEffect(() => {
    if (!state.isNuzlocke || state.phase === "nuzlockeGameOver" || state.phase === "generationSelect" || state.phase === "starterSelect" || state.phase === "resume") return;
    const hasHealthyInTeam = state.team.some((p) => !p.isFainted);
    const hasHealthyInBox = state.box.some((p) => !p.isFainted);

    if (!hasHealthyInTeam && !hasHealthyInBox) {
      update({ phase: "nuzlockeGameOver" });
    }
  }, [state.isNuzlocke, state.team, state.box, state.phase]);

  function update(patch) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function swapTeamPosition(fromIdx, toIdx) {
    if (fromIdx < 0 || fromIdx >= state.team.length) return;
    if (toIdx < 0 || toIdx >= state.team.length) return;
    setState((prev) => {
      const newTeam = [...prev.team];
      const temp = newTeam[fromIdx];
      newTeam[fromIdx] = newTeam[toIdx];
      newTeam[toIdx] = temp;
      return { ...prev, team: newTeam };
    });
  }

  function withdrawFromBox(boxIdx) {
    setState((prev) => {
      if (prev.team.length >= MAX_TEAM_SIZE) return prev;
      if (boxIdx < 0 || boxIdx >= prev.box.length) return prev;
      const target = prev.box[boxIdx];
      if (target?.isFainted) return prev;
      const newBox = prev.box.filter((_, idx) => idx !== boxIdx);
      const newTeam = [...prev.team, target];
      return { ...prev, team: newTeam, box: newBox };
    });
  }

  function depositToBox(teamIdx) {
    setState((prev) => {
      if (prev.team.length <= 1) return prev;
      if (teamIdx < 0 || teamIdx >= prev.team.length) return prev;
      const target = prev.team[teamIdx];
      const newTeam = prev.team.filter((_, idx) => idx !== teamIdx);
      const newBox = [...prev.box, target];
      return { ...prev, team: newTeam, box: newBox };
    });
  }

  function addToTeam(pokemon) {
    setState((prev) => {
      if (prev.team.length < MAX_TEAM_SIZE) {
        return { ...prev, team: [...prev.team, pokemon] };
      } else {
        return { ...prev, box: [...prev.box, pokemon] };
      }
    });
  }

  function addBadge(badge) {
    if (!badge) return;
    setState((prev) => ({ ...prev, badges: [...prev.badges, badge] }));
  }

  function addItem(item) {
    playItemUseSound();
    setState((prev) => ({ ...prev, items: [...prev.items, item] }));
  }

  function useItem(itemIndex) {
    setState((prev) => {
      const nextItems = [...prev.items];
      nextItems.splice(itemIndex, 1);
      return { ...prev, items: nextItems };
    });
  }

  function boostTeam(amount) {
    playLevelUpSound();
    setState((prev) => {
      const newTeam = prev.team.map((p) => {
        const boostedLevel = Math.min(MAX_LEVEL, p.level + amount);
        const boosted = { ...p, level: boostedLevel };
        return checkEvolution(boosted);
      });
      const evolutions = newTeam.filter((p) => p.evolvedFrom != null);
      const cleanTeam = newTeam.map(({ evolvedFrom, ...rest }) => rest);
      return {
        ...prev,
        team: cleanTeam,
        pendingEvolutions: evolutions,
      };
    });
  }

  function swapPokemon(teamIdx, boxIdx) {
    setState((prev) => {
      const newTeam = [...prev.team];
      const newBox = [...prev.box];
      const temp = newTeam[teamIdx];
      newTeam[teamIdx] = newBox[boxIdx];
      newBox[boxIdx] = temp;
      return { ...prev, team: newTeam, box: newBox };
    });
  }

  function goTo(phase, patch = {}) {
    playButtonClickSound();
    logger.stateTransition(state.phase, phase, patch);
    let finalPatch = patch;
    if (patch.pendingEncounterPool && !patch.pendingEncounterIsLegendary) {
      const challengeState = {
        isRandomizer: patch.isRandomizer ?? state.isRandomizer,
        monoType: patch.monoType ?? state.monoType,
      };
      finalPatch = {
        ...patch,
        pendingEncounterPool: filterEncounterPoolByChallenge(patch.pendingEncounterPool, challengeState),
      };
    }
    update({ choicesCount: (state.choicesCount || 0) + 1, phase, ...finalPatch });
  }

  const generation = state.generationId ? getGeneration(state.generationId) : null;
  const isPostgame =
    (state.completedGensCount || 0) >= GENERATIONS.length ||
    (generation && state.gymIndex >= generation.gymLeaders.length) ||
    (state.phase && state.phase.startsWith("postgame")) ||
    (state.phase && state.phase.startsWith("champions")) ||
    (state.phase && state.phase.startsWith("tournament"));

  const completedGens = state.completedGensCount || 0;
  const nuzlockeBonus = state.isNuzlocke ? 0.1 : 0;
  const difficultyMult = 1.0 + completedGens * 0.15 + nuzlockeBonus;

  function getScaledPower(basePower) {
    return Math.round(basePower * difficultyMult);
  }

  function resolveBattleWin(badge) {
    addBadge(badge);
    boostTeam(WIN_LEVEL_BOOST);
    setState((prev) => ({ ...prev, coins: (prev.coins || 0) + 4 }));
  }

  function handleNuzlockeLoss() {
    if (state.team.length === 0) return;
    setState((prev) => {
      if (prev.team.length === 0) return prev;
      const fatigued = prev.teamFatigued ? prev : { ...prev, teamFatigued: true };

      if (!fatigued.isNuzlocke) return fatigued;

      const fainted = { ...fatigued.team[fatigued.team.length - 1], isFainted: true };
      const nextTeam = fatigued.team.slice(0, fatigued.team.length - 1);
      const nextBox = [...fatigued.box, fainted];
      const hasHealthyInBox = nextBox.some((p) => !p.isFainted);

      if (nextTeam.length === 0 && !hasHealthyInBox) {
        return {
          ...fatigued,
          team: nextTeam,
          box: nextBox,
          phase: "nuzlockeGameOver",
        };
      }

      const shouldOpenBox = nextTeam.length === 0 && hasHealthyInBox;
      return {
        ...fatigued,
        team: nextTeam,
        box: nextBox,
        boxModalOpen: shouldOpenBox ? true : fatigued.boxModalOpen,
      };
    });
  }

  function advanceAfterGymBattle() {
    const finishedGymIndex = state.gymIndex;
    const nextGymIndex = finishedGymIndex + 1;

    if (generation.rival && !state.rivalDone && generation.rival.afterGymIndex === finishedGymIndex) {
      goTo("rivalBattle", { gymIndex: nextGymIndex });
      return;
    }

    if (generation.villainBoss && !state.villainBossDone && generation.villainBoss.afterGymIndex === finishedGymIndex) {
      goTo("villainBossBattle", { gymIndex: nextGymIndex });
      return;
    }

    if (nextGymIndex >= generation.gymLeaders.length) {
      goTo("eliteBattle", { gymIndex: nextGymIndex, eliteIndex: 0 });
      return;
    }

    goTo("explore", { gymIndex: nextGymIndex });
  }

  function checkNextGeneration() {
    const nextGen = getNextGeneration(state.generationId);
    const newCompletedCount = (state.completedGensCount || 0) + 1;
    if (nextGen) {
      goTo("nextGenSelect", { nextGenId: nextGen.id, completedGensCount: newCompletedCount });
    } else {
      if (newCompletedCount >= GENERATIONS.length) unlockAchievement("grandMaster");
      goTo("postgame", { completedGensCount: newCompletedCount });
    }
  }

  function startPostgameExplore() {
    const lastGen = generation || getGeneration(state.generationId);
    const availableLegendaries = (lastGen?.legendaries || []).filter(
      (id) => !state.caughtLegendaries.includes(id)
    );

    if (availableLegendaries.length > 0 && Math.random() < LEGENDARY_CHANCE) {
      const legendaryId = availableLegendaries[Math.floor(Math.random() * availableLegendaries.length)];
      goTo("legendaryEncounter", {
        pendingEncounterPool: [legendaryId],
        pendingEncounterLevel: Math.min(MAX_LEVEL, 60 + state.postgameRound * 2),
        pendingEncounterIsLegendary: true,
      });
    } else {
      goTo("postgameExplore");
    }
  }

  return {
    state,
    setState,
    update,
    goTo,
    ...slotSave,
    ...pokedexState,
    muted,
    handleToggleAudio,
    addToTeam,
    addBadge,
    addItem,
    useItem,
    boostTeam,
    swapPokemon,
    swapTeamPosition,
    withdrawFromBox,
    depositToBox,
    generation,
    isPostgame,
    difficultyMult,
    getScaledPower,
    resolveBattleWin,
    handleNuzlockeLoss,
    advanceAfterGymBattle,
    checkNextGeneration,
    startPostgameExplore,
  };
}
