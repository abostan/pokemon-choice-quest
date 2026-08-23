// Simulazione "a secco" della macchina a stati di App.js, per verificare
// che la sequenza palestre -> rivale -> alto comando -> campione non acceda
// mai a un indice fuori dai limiti, per entrambe le generazioni.
// Non è un vero test automatizzato del componente React (richiederebbe un
// browser), ma controlla la logica di transizione che è la parte più a
// rischio di bug in questa modifica.
//
// I blocchi gymBattle ed eliteBattle chiamano le vere resolveAfterGymBattle()/
// resolveAfterEliteBattle() di engine/gameStateTransitions.js (Fase 10 di
// ROADMAP.md) invece di reimplementare la stessa decisione a mano: prima un
// bug in quella logica (es. il vecchio hardcoded `8` di isPostgame) non
// sarebbe mai stato scoperto da questo script, perché copiava la sequenza
// indipendentemente dal codice vero.

import { GENERATIONS, getExplorationTier } from "../src/data/generations.js";
import { resolveAfterGymBattle, resolveAfterEliteBattle } from "../src/engine/gameStateTransitions.js";

for (const generation of GENERATIONS) {
  console.log(`\n=== ${generation.name} ===`);
  let gymIndex = 0;
  let eliteIndex = 0;
  let rivalDone = false;
  let villainBossDone = false;
  let phase = "explore";
  let steps = 0;
  const maxSteps = 200;

  while (phase !== "end" && steps < maxSteps) {
    steps++;
    if (phase === "explore") {
      const tier = getExplorationTier(generation, gymIndex);
      if (!tier) throw new Error(`Tier mancante per gymIndex ${gymIndex}`);
      const gym = generation.gymLeaders[gymIndex];
      if (!gym) throw new Error(`Gym mancante per indice ${gymIndex}`);
      phase = "gymBattle";
    } else if (phase === "gymBattle") {
      const gym = generation.gymLeaders[gymIndex];
      if (!gym) throw new Error(`Gym mancante per indice ${gymIndex}`);
      console.log(`  palestra ${gymIndex + 1}: ${gym.title} (potenza ${gym.opponentPower})`);
      const { phase: nextPhase, patch } = resolveAfterGymBattle({ gymIndex, rivalDone, villainBossDone }, generation);
      gymIndex = patch.gymIndex;
      if (patch.eliteIndex != null) eliteIndex = patch.eliteIndex;
      phase = nextPhase;
    } else if (phase === "rivalBattle") {
      console.log(`  rivale: ${generation.rival.title} (potenza ${generation.rival.opponentPower})`);
      rivalDone = true;
      phase = "explore";
    } else if (phase === "villainBossBattle") {
      console.log(`  capo team: ${generation.villainBoss.title} (potenza ${generation.villainBoss.opponentPower}, premio: ${generation.villainBoss.rewardItem})`);
      villainBossDone = true;
      phase = "explore";
    } else if (phase === "eliteBattle") {
      const member = generation.eliteFour[eliteIndex];
      if (!member) throw new Error(`Membro Alto Comando mancante per indice ${eliteIndex}`);
      console.log(`  alto comando ${eliteIndex + 1}: ${member.title} (potenza ${member.opponentPower})`);
      const { phase: nextPhase, patch } = resolveAfterEliteBattle({ eliteIndex }, generation);
      if (patch.eliteIndex != null) eliteIndex = patch.eliteIndex;
      phase = nextPhase;
    } else if (phase === "championBattle") {
      console.log(`  campione: ${generation.champion.title} (potenza ${generation.champion.opponentPower})`);
      phase = "end";
    }
  }

  if (steps >= maxSteps) throw new Error(`${generation.name}: possibile loop infinito nella simulazione`);
  console.log(`  -> fine avventura raggiunta in ${steps} passi.`);
}

console.log("\nSimulazione completata senza errori per tutte le generazioni.");
