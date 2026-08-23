// engine/settings.js non aveva finora nessun file di test dedicato — usa
// localStorage (stesso gap già chiuso in achievements.js/hallOfFame.js/
// saveGame.js/scoreLogic.js con lo stub condiviso).

import test from "node:test";
import assert from "node:assert";

import { SHINY_RATE_MODES, getShinyRateMode, setShinyRateMode, getShinyChance } from "../src/engine/settings.js";
import { installLocalStorageStub, withThrowingLocalStorage } from "./helpers/localStorageStub.js";

const storage = installLocalStorageStub();

test("getShinyRateMode - default se non è mai stata salvata una modalità", () => {
  storage.clear();
  assert.strictEqual(getShinyRateMode(), "default");
});

test("getShinyRateMode - default se il valore salvato non è una modalità valida", () => {
  storage.clear();
  storage.setItem("pcq_shiny_rate_mode", "modalita-inventata");
  assert.strictEqual(getShinyRateMode(), "default");
});

test("setShinyRateMode - salva una modalità valida, ignora una non valida", () => {
  storage.clear();
  setShinyRateMode("increased");
  assert.strictEqual(getShinyRateMode(), "increased");

  setShinyRateMode("modalita-inventata");
  assert.strictEqual(getShinyRateMode(), "increased", "un valore non valido non deve sovrascrivere quello corrente");
});

test("localStorage non disponibile: getShinyRateMode/setShinyRateMode non propagano eccezioni", () => {
  withThrowingLocalStorage(() => {
    assert.strictEqual(getShinyRateMode(), "default");
    assert.doesNotThrow(() => setShinyRateMode("increased"));
  });
});

test("getShinyChance - regressione: il moltiplicatore leggendario è 5x quello normale, non più 25x", () => {
  // Fase 12 di ROADMAP.md: con 25x, dopo aver reso il roll leggendario un
  // "interrupt" che tenta dopo ogni azione post-game, gli Shiny leggendari
  // superavano in assoluto quelli normali — segnalato da un giocatore reale.
  for (const mode of ["default", "increased"]) {
    const { normal, legendary } = SHINY_RATE_MODES[mode];
    assert.ok(normal > 0, `${mode}: il tasso normale deve essere positivo`);
    assert.ok(Math.abs(legendary / normal - 5) < 1e-9, `${mode}: atteso un moltiplicatore 5x, trovato ${legendary / normal}x`);
  }
});

test("getShinyChance - restituisce il tasso normale o leggendario in base al flag, secondo la modalità corrente", () => {
  storage.clear();
  setShinyRateMode("default");
  assert.strictEqual(getShinyChance(false), SHINY_RATE_MODES.default.normal);
  assert.strictEqual(getShinyChance(true), SHINY_RATE_MODES.default.legendary);

  setShinyRateMode("increased");
  assert.strictEqual(getShinyChance(false), SHINY_RATE_MODES.increased.normal);
  assert.strictEqual(getShinyChance(true), SHINY_RATE_MODES.increased.legendary);
});

test("getShinyChance - modalità 'off': mai Shiny, né normale né leggendario", () => {
  storage.clear();
  setShinyRateMode("off");
  assert.strictEqual(getShinyChance(false), 0);
  assert.strictEqual(getShinyChance(true), 0);
});
