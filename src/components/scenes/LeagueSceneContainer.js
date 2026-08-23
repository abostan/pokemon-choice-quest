import React from "react";
import { BattleScene } from "../BattleScene.js";
import { NextGenerationScreen } from "../NextGenerationScreen.js";
import { getGeneration } from "../../data/generations.js";
import { addHallOfFameEntry } from "../../engine/hallOfFame.js";
import { unlockAchievement, regionAchievementId } from "../../engine/achievements.js";
import { resolveAfterEliteBattle } from "../../engine/gameStateTransitions.js";

const e = React.createElement;

export function LeagueSceneContainer({ game }) {
  const {
    state,
    update,
    goTo,
    generation,
    getScaledPower,
    resolveBattleWin,
    handleNuzlockeLoss,
    checkNextGeneration,
    useItem,
    addItem,
  } = game;

  if (state.phase === "nextGenSelect") {
    const nextGen = getGeneration(state.nextGenId);
    if (!nextGen) {
      // Stato inconsistente (es. salvataggio corrotto senza nextGenId): non
      // c'è una regione valida verso cui procedere, meglio tornare al menu
      // che crashare su un generationId inesistente in starterSelect.
      goTo("resume");
      return null;
    }
    return e(NextGenerationScreen, {
      currentGenName: generation?.name ?? "Pokémon",
      nextGenName: nextGen.name,
      team: state.team,
      onContinue: () =>
        goTo("starterSelect", {
          generationId: state.nextGenId,
          gymIndex: 0,
          eliteIndex: 0,
          rivalDone: false,
          badges: [],
          multiGenRun: true,
        }),
      onHome: () => goTo("resume"),
    });
  }

  if (state.phase === "eliteBattle") {
    const member = generation?.eliteFour?.[state.eliteIndex];
    if (!member) {
      goTo("championBattle");
      return null;
    } else {
      const scaledPower = getScaledPower(member.opponentPower);
      return e(BattleScene, {
        key: `elite-${state.eliteIndex}`,
        title: `${member.title} (${state.eliteIndex + 1}/${generation?.eliteFour?.length ?? 4})`,
        text: "Sei entrato nella sala dell'Alto Comando. Un membro dopo l'altro, senza tregua.",
        opponentTitle: member.title,
        opponentTeamIds: member.teamIds,
        opponentPower: scaledPower,
        team: state.team,
        items: state.items,
        rewardBadge: null,
        isNuzlocke: state.isNuzlocke,
        activeWeather: state.activeWeather,
        teamFatigued: state.teamFatigued,
        onUseItem: useItem,
        onOpenBox: () => update({ boxModalOpen: true }),
        onPowerBoost: update,
        onResolved: ({ won }) => {
          if (won) resolveBattleWin(null);
          else handleNuzlockeLoss();
          const { phase, patch } = resolveAfterEliteBattle(state, generation);
          goTo(phase, patch);
        },
      });
    }
  }

  if (state.phase === "championBattle") {
    const champion = generation?.champion;
    if (!champion) {
      checkNextGeneration();
      return null;
    } else {
      const scaledPower = getScaledPower(champion.opponentPower);
      return e(BattleScene, {
        key: "champion",
        title: "Sfida finale: il Campione",
        text: `Davanti a te, l'ultimo ostacolo: ${champion.title}.`,
        opponentTitle: champion.title,
        opponentTeamIds: champion.teamIds,
        opponentPower: scaledPower,
        team: state.team,
        items: state.items,
        rewardBadge: champion.badge,
        isNuzlocke: state.isNuzlocke,
        activeWeather: state.activeWeather,
        teamFatigued: state.teamFatigued,
        celebrateOnWin: true,
        onUseItem: useItem,
        onOpenBox: () => update({ boxModalOpen: true }),
        onPowerBoost: update,
        onResolved: ({ won }) => {
          if (won) {
            unlockAchievement("firstChampion");
            unlockAchievement(regionAchievementId("champion", generation.id));
            if (state.isNuzlocke) unlockAchievement("nuzlockeMaster");
            resolveBattleWin(champion.badge);
            addItem("Master Ball");
            addHallOfFameEntry({
              genName: generation.name,
              team: state.team,
              isNuzlocke: state.isNuzlocke,
            });
          } else {
            handleNuzlockeLoss();
          }
          checkNextGeneration();
        },
      });
    }
  }

  return null;
}
