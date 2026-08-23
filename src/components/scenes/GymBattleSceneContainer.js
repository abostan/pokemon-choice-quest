import React from "react";
import { BattleScene } from "../BattleScene.js";
import { unlockAchievement, regionAchievementId } from "../../engine/achievements.js";

const e = React.createElement;

export function GymBattleSceneContainer({ game }) {
  const {
    state,
    update,
    goTo,
    generation,
    isPostgame,
    getScaledPower,
    resolveBattleWin,
    handleNuzlockeLoss,
    advanceAfterGymBattle,
    useItem,
    addItem,
    boostTeam,
  } = game;

  if (state.phase === "gymBattle") {
    const gym = generation?.gymLeaders?.[state.gymIndex];
    if (!gym) {
      return e(
        "div",
        { className: "panel", style: { textAlign: "center", padding: "24px" } },
        e("h2", { className: "scene-title" }, "Tutte le palestre completate!"),
        e("p", { className: "scene-text" }, "Hai superato tutte le palestre di questa regione."),
        e(
          "button",
          {
            className: "continue-btn",
            onClick: () => {
              if (isPostgame) goTo("postgameExplore");
              else goTo("eliteBattle", { eliteIndex: 0 });
            },
          },
          isPostgame ? "Continua Post-Game →" : "Sfida l'Alto Comando →"
        )
      );
    } else {
      const scaledPower = getScaledPower(gym.opponentPower);
      return e(BattleScene, {
        key: `gym-${state.gymIndex}`,
        title: `Palestra ${state.gymIndex + 1} di ${generation?.gymLeaders?.length ?? 8}`,
        text: `Entri nella palestra. ${gym.title} ti sfida a duello.`,
        opponentTitle: gym.title,
        opponentTeamIds: gym.teamIds,
        opponentPower: scaledPower,
        team: state.team,
        items: state.items,
        rewardBadge: gym.badge,
        isNuzlocke: state.isNuzlocke,
        activeWeather: state.activeWeather,
        teamFatigued: state.teamFatigued,
        onUseItem: useItem,
        onOpenBox: () => update({ boxModalOpen: true }),
        onPowerBoost: update,
        onResolved: ({ won }) => {
          if (won) resolveBattleWin(gym.badge);
          else handleNuzlockeLoss();
          advanceAfterGymBattle();
        },
      });
    }
  }

  if (state.phase === "rivalBattle") {
    const rivalStageIndex = state.rivalDone || 0;
    const rival = generation?.rival?.[rivalStageIndex];
    if (!rival) {
      update({ rivalDone: rivalStageIndex + 1, phase: "explore" });
      return null;
    } else {
      const scaledPower = getScaledPower(rival.opponentPower);
      // 3 varianti di testo in base allo stage (0/1/2), non duplicate nei
      // dati di ogni regione — danno la sensazione di una rivalità che
      // cresce lungo la run invece del solito scontro anonimo.
      const rivalIntro = [
        `${rival.title} ti blocca la strada per una battaglia improvvisata.`,
        `${rival.title} ti sfida di nuovo: la sua squadra è cresciuta dall'ultimo incontro!`,
        `${rival.title} ti aspetta per lo scontro decisivo, prima dell'Alto Comando.`,
      ][Math.min(rivalStageIndex, 2)];
      return e(BattleScene, {
        key: `rival-${rivalStageIndex}`,
        title: "Sfida a sorpresa",
        text: rivalIntro,
        opponentTitle: rival.title,
        opponentTeamIds: rival.teamIds,
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
          update({ rivalDone: rivalStageIndex + 1, phase: "explore" });
        },
      });
    }
  }

  if (state.phase === "villainBossBattle") {
    const boss = generation?.villainBoss;
    if (!boss) {
      update({ villainBossDone: true, phase: "explore" });
      return null;
    } else {
      const scaledPower = getScaledPower(boss.opponentPower);
      return e(BattleScene, {
        key: "villain-boss",
        title: "🕵️ Scontro Boss Narrativo!",
        text: `${boss.title} tenta di ostacolare il tuo cammino! Sconfiggilo per salvare la regione ed ottenere la ricompensa: ${boss.rewardItem}!`,
        opponentTitle: boss.title,
        opponentTeamIds: boss.teamIds,
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
          if (won) {
            unlockAchievement(regionAchievementId("villain", generation.id));
            resolveBattleWin(null);
            addItem(boss.rewardItem);
            if (boss.rewardItem === "Caramella Rara") {
              boostTeam(3);
            }
          } else {
            handleNuzlockeLoss();
          }
          update({ villainBossDone: true, phase: "explore" });
        },
      });
    }
  }

  return null;
}
