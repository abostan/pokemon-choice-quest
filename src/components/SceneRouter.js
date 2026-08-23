import React from "react";
import { GenerationSelectScreen } from "./GenerationSelectScreen.js";
import { StartScreen } from "./StartScreen.js";
import { EncounterScene } from "./EncounterScene.js";
import { BattleScene } from "./BattleScene.js";
import { EndScreen } from "./EndScreen.js";
import { PostgameScreen } from "./PostgameScreen.js";
import { ResumeScreen } from "./ResumeScreen.js";
import { NuzlockeGameOverScreen } from "./NuzlockeGameOverScreen.js";
import { TournamentScene } from "./TournamentScene.js";
import { PokeCenterScene } from "./PokeCenterScene.js";
import { MerchantScene } from "./MerchantScene.js";
import { ExploreSceneContainer } from "./scenes/ExploreSceneContainer.js";
import { GymBattleSceneContainer } from "./scenes/GymBattleSceneContainer.js";
import { LeagueSceneContainer } from "./scenes/LeagueSceneContainer.js";
import { getExplorationTier } from "../data/generations.js";
import { CHAMPIONS_TOURNAMENT } from "../data/championsTournament.js";
import { filterStartersByChallenge } from "../engine/challengeEngine.js";
import { addHallOfFameEntry } from "../engine/hallOfFame.js";
import { unlockAchievement } from "../engine/achievements.js";
import { deleteSave } from "../engine/saveGame.js";
import { initialState } from "../hooks/useGameState.js";

const e = React.createElement;

export function SceneRouter({ game }) {
  const {
    state,
    setState,
    update,
    goTo,
    activeSlotId,
    setActiveSlotId,
    slotsData,
    generation,
    isPostgame,
    getScaledPower,
    resolveBattleWin,
    handleNuzlockeLoss,
    markCaught,
    markSeen,
    handleResumeSlot,
    handleNewGameSlot,
    handleDeleteSlot,
    handleExportSlot,
    handleImportSlot,
    addItem,
    useItem,
    boostTeam,
    addToTeam,
  } = game;

  if (state.phase === "resume") {
    return e(ResumeScreen, {
      slots: slotsData,
      selectedSlotId: activeSlotId,
      onSelectSlot: setActiveSlotId,
      onResume: handleResumeSlot,
      onNewGame: handleNewGameSlot,
      onDeleteSlot: handleDeleteSlot,
      onExportSlot: handleExportSlot,
      onImportSlot: handleImportSlot,
    });
  }

  if (state.phase === "generationSelect") {
    return e(GenerationSelectScreen, {
      boxCount: state.box.length,
      onChooseGeneration: (generationId, challengeOptions = {}) =>
        goTo("starterSelect", { generationId, ...challengeOptions }),
    });
  }

  if (state.phase === "starterSelect") {
    return e(StartScreen, {
      starterIds: filterStartersByChallenge(generation.starterIds, state),
      generationName: generation.name,
      continueTeam: state.multiGenRun ? state.team : null,
      onChooseStarter: (id, nuzlockeMode) => {
        markCaught(id, false);
        const isNuz = nuzlockeMode || state.isNuzlocke;
        if (state.multiGenRun && state.team.length > 0) {
          setState((prev) => ({
            ...prev,
            isNuzlocke: isNuz,
            box: [...prev.box, ...prev.team],
            team: [{ id, level: 5 }],
            phase: "explore",
            gymIndex: 0,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isNuzlocke: isNuz,
            team: [{ id, level: 5 }],
            phase: "explore",
            gymIndex: 0,
          }));
        }
      },
    });
  }

  if (state.phase === "pokecenter") {
    return e(PokeCenterScene, {
      coins: state.coins || 0,
      team: state.team,
      items: state.items,
      onHealTeam: () => {
        const updatedTeam = state.team.map((p) => ({
          ...p,
          isFainted: false,
        }));
        update({ team: updatedTeam });
      },
      onBuyItem: (itemName, price) => {
        addItem(itemName);
        update({ coins: Math.max(0, (state.coins || 0) - price) });
      },
      onLeave: () => {
        if (isPostgame) goTo("postgameExplore");
        else goTo("gymBattle");
      },
    });
  }

  if (state.phase === "merchant") {
    const pool = isPostgame
      ? [
          { name: "Caramella Rara", price: 5 },
          { name: "Resti", price: 6 },
          { name: "Assorbosfera", price: 6 },
          { name: "Master Ball", price: 10 },
        ]
      : [
          { name: "Pietra Focaia", price: 4 },
          { name: "Idropietra", price: 4 },
          { name: "Pietra Foglia", price: 4 },
          { name: "Pietra Tuono", price: 4 },
          { name: "Pietraluna", price: 4 },
          { name: "Caramella Rara", price: 5 },
        ];
    return e(MerchantScene, {
      coins: state.coins || 0,
      pool,
      onBuyItem: (itemName, price) => {
        addItem(itemName);
        update({ coins: Math.max(0, (state.coins || 0) - price) });
      },
      onLeave: () => {
        if (isPostgame) goTo("postgameExplore");
        else goTo("gymBattle");
      },
    });
  }

  if (state.phase === "postgame") {
    return e(PostgameScreen, {
      lastGenName: generation?.name ?? "Pokémon",
      team: state.team,
      onStart: () => goTo("postgameExplore", { postgameRound: 0 }),
      onStartTournament: () => goTo("championsTournament", { tournamentRound: 0 }),
      onHome: () => goTo("resume"),
    });
  }

  if (state.phase === "championsTournament") {
    return e(TournamentScene, {
      currentRound: state.tournamentRound,
      onStartMatch: () => goTo("tournamentBattle"),
      onExit: () => goTo("postgame"),
    });
  }

  if (state.phase === "tournamentBattle") {
    const champ = CHAMPIONS_TOURNAMENT[state.tournamentRound] || CHAMPIONS_TOURNAMENT[0];
    const scaledPower = getScaledPower(champ.opponentPower);
    return e(BattleScene, {
      key: `tournament-${champ.id}`,
      title: `${champ.title} — Round ${state.tournamentRound + 1}/5`,
      text: champ.text,
      opponentTitle: champ.title,
      opponentTeamIds: champ.teamIds,
      opponentPower: scaledPower,
      opponentType: champ.type,
      team: state.team,
      items: state.items,
      rewardBadge: null,
      isNuzlocke: state.isNuzlocke,
      celebrateOnWin: state.tournamentRound >= CHAMPIONS_TOURNAMENT.length - 1,
      onUseItem: useItem,
      onOpenBox: () => update({ boxModalOpen: true }),
      onPowerBoost: update,
      onResolved: ({ won }) => {
        if (won) {
          resolveBattleWin(null);
          const nextRound = state.tournamentRound + 1;
          if (nextRound >= CHAMPIONS_TOURNAMENT.length) {
            addHallOfFameEntry({
              genName: "Torneo dei Campioni",
              team: state.team,
              isNuzlocke: state.isNuzlocke,
            });
            boostTeam(5);
          }
          update({ tournamentRound: nextRound, phase: "championsTournament" });
        } else {
          handleNuzlockeLoss();
          update({ phase: "championsTournament" });
        }
      },
    });
  }

  if (state.phase === "explore" || state.phase === "postgameExplore") {
    return e(ExploreSceneContainer, { game });
  }

  if (state.phase === "gymBattle" || state.phase === "rivalBattle" || state.phase === "villainBossBattle") {
    return e(GymBattleSceneContainer, { game });
  }

  if (state.phase === "nextGenSelect" || state.phase === "eliteBattle" || state.phase === "championBattle") {
    return e(LeagueSceneContainer, { game });
  }

  if (state.phase === "trainerBattle") {
    const tr = state.pendingTrainer || { title: "Allenatore", teamIds: [16, 19], power: 15 };
    return e(BattleScene, {
      key: "trainer-battle",
      title: "Battaglia sul percorso",
      text: `${tr.title} ti incrocia lo sguardo e ti sfida a duello!`,
      opponentTitle: tr.title,
      opponentTeamIds: tr.teamIds,
      opponentPower: tr.power,
      team: state.team,
      items: state.items,
      rewardBadge: null,
      onUseItem: useItem,
      onPowerBoost: update,
      onResolved: ({ won }) => {
        if (won) {
          if (tr.title === "Allenatore Leggendario Rosso") unlockAchievement("silverMountain");
          boostTeam(2);
          addItem("Super Pozione");
        }
        if (isPostgame) {
          update({ postgameRound: (state.postgameRound || 0) + 1, phase: "postgameExplore" });
        } else {
          goTo("gymBattle");
        }
      },
    });
  }

  if (state.phase === "encounter" || state.phase === "legendaryEncounter") {
    const isLegendary = state.phase === "legendaryEncounter";
    const hasMb = state.items.includes("Master Ball");
    const tier = getExplorationTier(generation, state.gymIndex);
    const fallbackPool = isLegendary ? (generation?.legendaries || [150]) : (tier?.grass || [25]);
    // Il pool è già filtrato per Randomizer/Mono-Tipo da goTo() al momento della transizione di stato.
    const encPool = (state.pendingEncounterPool && state.pendingEncounterPool.length > 0)
      ? state.pendingEncounterPool
      : fallbackPool;

    return e(EncounterScene, {
      key: `${state.phase}-${encPool[0] || state.gymIndex}`,
      title: isLegendary ? "⭐ Incontro leggendario!" : "Incontro selvaggio",
      text: isLegendary
        ? "Un Pokémon leggendario ti appare davanti! È un momento irripetibile..."
        : "Qualcosa si muove tra i cespugli...",
      pool: encPool,
      level: state.pendingEncounterLevel,
      isLegendary: isLegendary || state.pendingEncounterIsLegendary,
      hasMasterBall: hasMb,
      onSeen: markSeen,
      onCaught: markCaught,
      onResolved: ({ caught, pokemon, usedMasterBall }) => {
        if (usedMasterBall) {
          const mbIdx = state.items.indexOf("Master Ball");
          if (mbIdx !== -1) useItem(mbIdx);
        }
        if (caught) {
          addToTeam(pokemon);
          if (isLegendary) {
            update({
              caughtLegendaries: [...state.caughtLegendaries, pokemon.id],
              postgameRound: state.postgameRound + 1,
            });
          }
        } else if (isLegendary) {
          update({ postgameRound: state.postgameRound + 1 });
        }
        if (isPostgame) {
          update({ postgameRound: (state.postgameRound || 0) + 1, phase: "postgameExplore" });
        } else {
          goTo("gymBattle");
        }
      },
    });
  }

  if (state.phase === "nuzlockeGameOver") {
    return e(NuzlockeGameOverScreen, {
      lastGenName: generation?.name ?? "Pokémon",
      badgesCount: state.badges.length,
      onRestart: () => {
        deleteSave(activeSlotId);
        setState({ ...initialState(), phase: "generationSelect" });
      },
    });
  }

  if (state.phase === "end") {
    return e(EndScreen, {
      team: state.team,
      badges: state.badges,
      onRestart: () => {
        deleteSave(activeSlotId);
        setState(initialState());
      },
    });
  }

  return e(
    "div",
    { className: "panel", style: { textAlign: "center", padding: "30px" } },
    e("h2", { className: "scene-title" }, "Avventura Pokémon"),
    e("p", { className: "scene-text" }, "Scegli la tua prossima azione per continuare."),
    e(
      "div",
      { style: { display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" } },
      e(
        "button",
        { className: "continue-btn", onClick: () => goTo("explore") },
        "🌿 Esplora"
      ),
      e(
        "button",
        { className: "continue-btn", onClick: () => goTo("gymBattle") },
        "⚔️ Palestra"
      )
    )
  );
}
