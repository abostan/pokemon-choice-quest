import test from "node:test";
import assert from "node:assert";

import { computeWeatherEffect } from "../src/engine/weatherLogic.js";
import { WEATHER_CONDITIONS, rollWeather } from "../src/data/weather.js";

const SUN = WEATHER_CONDITIONS.find((w) => w.id === "sun");

test("weatherLogic - nessun meteo attivo => neutro senza messaggio", () => {
  const team = [{ id: 6, level: 20 }]; // Charizard, Fuoco
  const result = computeWeatherEffect(team, null);
  assert.strictEqual(result.multiplier, 1.0);
  assert.strictEqual(result.status, "neutral");
  assert.strictEqual(result.message, "");
});

test("weatherLogic - tipo in boostTypes => bonus +10%", () => {
  const team = [{ id: 6, level: 20 }]; // Charizard, Fuoco
  const result = computeWeatherEffect(team, SUN);
  assert.strictEqual(result.multiplier, 1.10);
  assert.strictEqual(result.status, "boost");
  assert.ok(result.message.includes("Sole Intenso"));
});

test("weatherLogic - tipo in malusTypes => malus -8%", () => {
  const team = [{ id: 7, level: 20 }]; // Squirtle, Acqua
  const result = computeWeatherEffect(team, SUN);
  assert.strictEqual(result.multiplier, 0.92);
  assert.strictEqual(result.status, "malus");
});

test("weatherLogic - tipo non coinvolto => neutro ma con messaggio esplicito (feedback sempre visibile)", () => {
  const team = [{ id: 25, level: 20 }]; // Pikachu, Elettrico (non in boost/malus di Sole Intenso)
  const result = computeWeatherEffect(team, SUN);
  assert.strictEqual(result.multiplier, 1.0);
  assert.strictEqual(result.status, "neutral");
  assert.ok(result.message.length > 0);
});

test("weather.rollWeather - copre tutte e 4 le condizioni su molti tiri ed è puro (nessun Math.random nascosto)", () => {
  const seen = new Set();
  for (let i = 0; i < 400; i++) {
    const w = rollWeather(() => i / 400);
    seen.add(w.id);
  }
  assert.strictEqual(seen.size, 4);
});
