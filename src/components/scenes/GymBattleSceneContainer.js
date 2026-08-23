import React from "react";
import { BattleScene } from "../BattleScene.js";

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
    const rival = generation?.rival;
    if (!rival) {
      update({ rivalDone: true, phase: "explore" });
      return null;
    } else {
      const scaledPower = getScaledPower(rival.opponentPower);
      return e(BattleScene, {
        key: "rival",
        title: "Sfida a sorpresa",
        text: `${rival.title} ti blocca la strada per una battaglia improvvisata.`,
        opponentTitle: rival.title,
        opponentTeamIds: rival.teamIds,
        opponentPower: scaledPower,
        team: state.team,
        items: state.items,
        rewardBadge: null,
        isNuzlocke: state.isNuzlocke,
        onUseItem: useItem,
        onOpenBox: () => update({ boxModalOpen: true }),
        onPowerBoost: update,
        onResolved: ({ won }) => {
          if (won) resolveBattleWin(null);
          else handleNuzlockeLoss();
          update({ rivalDone: true, phase: "explore" });
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
        onUseItem: useItem,
        onOpenBox: () => update({ boxModalOpen: true }),
        onPowerBoost: update,
        onResolved: ({ won }) => {
          if (won) {
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
