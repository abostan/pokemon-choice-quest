// engine/achievements.js non aveva finora nessun file di test dedicato: usa
// localStorage pesantemente, quindi era invisibile al coverage report
// (nessun test lo importava, quindi Node non lo strumentava nemmeno).

import test from "node:test";
import assert from "node:assert";

import { GENERATIONS } from "../src/data/generations.js";
import {
  ACHIEVEMENTS,
  GENERAL_ACHIEVEMENT_LIST,
  REGION_ACHIEVEMENT_GROUPS,
  regionAchievementId,
  getUnlockedAchievements,
  isAchievementUnlocked,
  onAchievementUnlocked,
  unlockAchievement,
} from "../src/engine/achievements.js";
import { installLocalStorageStub, withThrowingLocalStorage } from "./helpers/localStorageStub.js";

const storage = installLocalStorageStub();

test("unlockAchievement - id inesistente: false, nessuna scrittura", () => {
  storage.clear();
  assert.strictEqual(unlockAchievement("nonEsiste"), false);
  assert.deepStrictEqual(getUnlockedAchievements(), {});
});

test("unlockAchievement - prima chiamata true, chiamate successive false (idempotente)", () => {
  storage.clear();
  assert.strictEqual(unlockAchievement("firstCapture"), true);
  assert.strictEqual(unlockAchievement("firstCapture"), false);
  assert.strictEqual(unlockAchievement("firstCapture"), false);
});

test("isAchievementUnlocked/getUnlockedAchievements riflettono lo sblocco", () => {
  storage.clear();
  assert.strictEqual(isAchievementUnlocked("firstShiny"), false);
  unlockAchievement("firstShiny");
  assert.strictEqual(isAchievementUnlocked("firstShiny"), true);
  assert.ok(getUnlockedAchievements().firstShiny?.unlockedAt);
});

test("unlockAchievement - localStorage non disponibile: sblocca comunque per la sessione corrente (true), ma senza persistere", () => {
  storage.clear();
  withThrowingLocalStorage(() => {
    assert.strictEqual(unlockAchievement("firstEvolution"), true);
  });
  // Tornati a uno storage funzionante, non essendo mai stato scritto risulta di nuovo non sbloccato.
  assert.strictEqual(isAchievementUnlocked("firstEvolution"), false);
});

test("onAchievementUnlocked - notifica i listener attivi con l'oggetto achievement completo", () => {
  storage.clear();
  const received = [];
  const unsubscribe = onAchievementUnlocked((achievement) => received.push(achievement));

  unlockAchievement("firstMasterBall");
  assert.strictEqual(received.length, 1);
  assert.strictEqual(received[0].id, "firstMasterBall");
  assert.strictEqual(received[0].title, ACHIEVEMENTS.firstMasterBall.title);

  unsubscribe();
  unlockAchievement("allGymsCleared");
  assert.strictEqual(received.length, 1, "dopo unsubscribe non deve ricevere altri sblocchi");
});

test("onAchievementUnlocked - non notifica se l'achievement era già sbloccato", () => {
  storage.clear();
  unlockAchievement("firstChampion");
  const received = [];
  onAchievementUnlocked((achievement) => received.push(achievement));
  unlockAchievement("firstChampion"); // già sbloccato sopra
  assert.strictEqual(received.length, 0);
});

test("regionAchievementId - costruisce l'id come categoria_regione", () => {
  assert.strictEqual(regionAchievementId("gyms", "kanto"), "gyms_kanto");
  assert.strictEqual(regionAchievementId("legendary", "paldea"), "legendary_paldea");
});

test("REGION_ACHIEVEMENT_GROUPS - un gruppo da 4 achievement per ciascuna delle regioni in GENERATIONS", () => {
  assert.strictEqual(REGION_ACHIEVEMENT_GROUPS.length, GENERATIONS.length);
  REGION_ACHIEVEMENT_GROUPS.forEach((group, idx) => {
    assert.strictEqual(group.genId, GENERATIONS[idx].id);
    assert.strictEqual(group.achievements.length, 4);
    const ids = group.achievements.map((a) => a.id);
    assert.deepStrictEqual(
      ids,
      ["gyms", "champion", "legendary", "villain"].map((cat) => regionAchievementId(cat, group.genId))
    );
  });
});

test("ACHIEVEMENTS - unisce i trofei generali e quelli per-regione senza collisioni di id", () => {
  const generalIds = GENERAL_ACHIEVEMENT_LIST.map((a) => a.id);
  const regionIds = REGION_ACHIEVEMENT_GROUPS.flatMap((g) => g.achievements.map((a) => a.id));

  for (const id of generalIds) assert.strictEqual(ACHIEVEMENTS[id]?.id, id);
  for (const id of regionIds) assert.strictEqual(ACHIEVEMENTS[id]?.id, id);

  const totalExpected = generalIds.length + regionIds.length;
  assert.strictEqual(Object.keys(ACHIEVEMENTS).length, totalExpected, "nessuna collisione di id tra generali e per-regione");
});
