import { computeTeamPower, computeWinChance } from "./src/engine/battleLogic.js";
import { GENERATIONS } from "./src/data/generations.js";

console.log("=== ANALISI BILANCIAMENTO PALESTRA 1 ===");

// Config 1: Solo starter Lv 5 (cattura fallita o scelta senza cattura)
// Starter tipo Charmander / Bulbasaur / Squirtle (BST ~310)
const starterOnly = [{ id: 4, level: 5 }]; 
const powerStarterOnly = computeTeamPower(starterOnly, { 4: 309 });

// Config 2: Starter Lv 7 (opzione "Allenamento intensivo")
const starterTrained = [{ id: 4, level: 7 }];
const powerStarterTrained = computeTeamPower(starterTrained, { 4: 309 });

// Config 3: Starter Lv 5 + 1 Pokemon selvatico Lv 6 (Pidgey BST ~251)
const starterPlusOne = [{ id: 4, level: 5 }, { id: 16, level: 6 }];
const powerPlusOne = computeTeamPower(starterPlusOne, { 4: 309, 16: 251 });

// Config 4: Starter Lv 5 + 2 Pokemon selvatici (Pidgey Lv 6 + Rattata Lv 6)
const starterPlusTwo = [{ id: 4, level: 5 }, { id: 16, level: 6 }, { id: 19, level: 6 }];
const powerPlusTwo = computeTeamPower(starterPlusTwo, { 4: 309, 16: 251, 19: 253 });

console.log(`Potenza solo Starter Lv 5: ${powerStarterOnly}`);
console.log(`Potenza Starter Allenato Lv 7: ${powerStarterTrained}`);
console.log(`Potenza Starter + 1 selvatico: ${powerPlusOne}`);
console.log(`Potenza Starter + 2 selvatici: ${powerPlusTwo}`);

const gym1PowerActual = GENERATIONS[0].gymLeaders[0].opponentPower; // 18
console.log(`\n-- Palestra 1 attuale (Potenza ${gym1PowerActual}) --`);
console.log(`Win% Solo Starter Lv 5: ${(computeWinChance(powerStarterOnly, gym1PowerActual) * 100).toFixed(1)}%`);
console.log(`Win% Starter Allenato Lv 7: ${(computeWinChance(powerStarterTrained, gym1PowerActual) * 100).toFixed(1)}%`);
console.log(`Win% Starter + 1 selvatico: ${(computeWinChance(powerPlusOne, gym1PowerActual) * 100).toFixed(1)}%`);
console.log(`Win% Starter + 2 selvatici: ${(computeWinChance(powerPlusTwo, gym1PowerActual) * 100).toFixed(1)}%`);

for (const targetPower of [12, 13, 14, 15]) {
  console.log(`\n-- SE Palestra 1 avesse Potenza ${targetPower} --`);
  console.log(`Win% Solo Starter Lv 5: ${(computeWinChance(powerStarterOnly, targetPower) * 100).toFixed(1)}%`);
  console.log(`Win% Starter Allenato Lv 7: ${(computeWinChance(powerStarterTrained, targetPower) * 100).toFixed(1)}%`);
  console.log(`Win% Starter + 1 selvatico: ${(computeWinChance(powerPlusOne, targetPower) * 100).toFixed(1)}%`);
  console.log(`Win% Starter + 2 selvatici: ${(computeWinChance(powerPlusTwo, targetPower) * 100).toFixed(1)}%`);
}
