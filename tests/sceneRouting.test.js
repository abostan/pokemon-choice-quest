// resolveSceneForPhase() è la decisione di routing estratta da
// SceneRouter.js (Fase 10 di ROADMAP.md) — dove il bug storico di
// isPostgame si è manifestato all'utente ("niente palestre visibili").
// Testa solo la decisione (fase -> quale scena), non il rendering.

import test from "node:test";
import assert from "node:assert";

import { resolveSceneForPhase } from "../src/engine/sceneRouting.js";

test("resolveSceneForPhase - ogni fase realmente usata nel codice mappa alla scena attesa", () => {
  const expected = {
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
  for (const [phase, sceneKey] of Object.entries(expected)) {
    assert.strictEqual(resolveSceneForPhase(phase), sceneKey, `fase "${phase}"`);
  }
});

test("resolveSceneForPhase - fase sconosciuta/indefinita ricade sull'hub di emergenza (mai un crash)", () => {
  assert.strictEqual(resolveSceneForPhase("fase-mai-esistita"), "fallbackHub");
  assert.strictEqual(resolveSceneForPhase(undefined), "fallbackHub");
  assert.strictEqual(resolveSceneForPhase(null), "fallbackHub");
  assert.strictEqual(resolveSceneForPhase(""), "fallbackHub");
});

test("resolveSceneForPhase - le fasi che condividono un container restano raggruppate correttamente", () => {
  // explore/postgameExplore, gymBattle/rivalBattle/villainBossBattle,
  // nextGenSelect/eliteBattle/championBattle, encounter/legendaryEncounter:
  // gruppi di fasi diverse che devono risolvere alla STESSA scena.
  const groups = [
    ["explore", "postgameExplore"],
    ["gymBattle", "rivalBattle", "villainBossBattle"],
    ["nextGenSelect", "eliteBattle", "championBattle"],
    ["encounter", "legendaryEncounter"],
  ];
  for (const group of groups) {
    const scenes = new Set(group.map(resolveSceneForPhase));
    assert.strictEqual(scenes.size, 1, `il gruppo [${group.join(", ")}] dovrebbe risolvere a un'unica scena`);
  }
});
