import { useState, useEffect } from "react";
import { logger } from "../engine/logger.js";
import { getGeneration } from "../data/generations.js";
import { unlockAchievement, regionAchievementId } from "../engine/achievements.js";
import { checkEvolution } from "../data/evolutions.js";
import { filterEncounterPoolByChallenge } from "../engine/challengeEngine.js";
import { hasSave } from "../engine/saveGame.js";
import { useSaveSlot } from "./useSaveSlot.js";
import { usePokedexState } from "./usePokedexState.js";
import {
  MAX_LEVEL,
  computeIsPostgame,
  computeDifficultyMultiplier,
  computeScaledPower,
  resolveAfterGymBattle,
  resolveNextGeneration,
  resolvePostgameExplore,
  resolveNuzlockeLoss,
} from "../engine/gameStateTransitions.js";
import {
  isAudioMuted,
  toggleAudioMute,
  playButtonClickSound,
  playLevelUpSound,
  playItemUseSound,
} from "../engine/soundEngine.js";

export { MAX_LEVEL };
export const WIN_LEVEL_BOOST = 3;
export const MAX_TEAM_SIZE = 6;

export function initialState() {
  return {
    phase: "generationSelect",
    generationId: null,
    nextGenId: null,
    gymIndex: 0,
    eliteIndex: 0,
    rivalDone: 0, // contatore di stage del Rivale già affrontati (era booleano)
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
    lastEncounterId: null,
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
    setState((prev) => {
      // Centralizzato qui (non in goTo) perché il ritorno a "postgameExplore"
      // avviene sia tramite goTo() (bivi scelti direttamente dal giocatore)
      // sia tramite update() diretto dopo una battaglia risolta altrove
      // (SceneRouter.js, GymBattleSceneContainer.js) — un fix messo solo in
      // goTo() avrebbe lasciato scoperta quest'ultima classe di transizioni,
      // che nella pratica sono la maggioranza delle azioni post-game
      // (allenatori, zone a tema, Rosso, torneo...). Prima il roll del
      // leggendario ambientale scattava solo per le 6 azioni "istantanee"
      // (fossile, scambio, meteo, cerca oggetti, uovo, casinò) che
      // richiamavano esplicitamente startPostgameExplore() — segnalato da
      // un giocatore reale che non vedeva mai comparire un leggendario.
      if (patch.phase === "postgameExplore") {
        const merged = { ...prev, ...patch };
        const rolled = resolvePostgameExplore(merged);
        return { ...prev, ...patch, phase: rolled.phase, ...rolled.patch };
      }
      return { ...prev, ...patch };
    });
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
    if (item === "Master Ball") unlockAchievement("firstMasterBall");
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
  const isPostgame = computeIsPostgame(state, generation);
  const difficultyMult = computeDifficultyMultiplier(state);

  function getScaledPower(basePower) {
    return computeScaledPower(basePower, state);
  }

  function resolveBattleWin(badge) {
    if (badge) unlockAchievement("firstGymBadge");
    addBadge(badge);
    boostTeam(WIN_LEVEL_BOOST);
    setState((prev) => ({ ...prev, coins: (prev.coins || 0) + 4 }));
  }

  function handleNuzlockeLoss() {
    if (state.team.length === 0) return;
    setState((prev) => resolveNuzlockeLoss(prev));
  }

  function advanceAfterGymBattle() {
    const { phase, patch } = resolveAfterGymBattle(state, generation);
    if (phase === "eliteBattle") {
      unlockAchievement("allGymsCleared");
      unlockAchievement(regionAchievementId("gyms", generation.id));
    }
    goTo(phase, patch);
  }

  function checkNextGeneration() {
    const { phase, patch, isGrandMaster } = resolveNextGeneration(state);
    if (isGrandMaster) unlockAchievement("grandMaster");
    goTo(phase, patch);
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
  };
}
