// Test di integrità strutturale sui dati di gioco (data/generations.js e
// data/championsTournament.js), non sulla logica applicativa. Nato dal bug
// reale di isPostgame (ROADMAP.md Fase 10): un problema introdotto
// aggiungendo/modificando una regione ("abbiamo aggiunto la 9ª regione e
// dimenticato di aggiornare qualcosa altrove") oggi si scopre solo giocando
// fino a quel punto della run — questi test scorrono tutte le regioni
// automaticamente e verificano forma e coerenza, non i valori narrativi.

import test from "node:test";
import assert from "node:assert";

import { GENERATIONS, getBadgeType } from "../src/data/generations.js";
import { CHAMPIONS_TOURNAMENT } from "../src/data/championsTournament.js";
import { TYPE_LIST } from "../src/data/types.js";

function isValidTeamIds(teamIds) {
  return Array.isArray(teamIds) && teamIds.length > 0 && teamIds.every((id) => Number.isInteger(id) && id > 0);
}

test("data integrity - ogni regione ha esattamente 8 capipalestra", () => {
  for (const gen of GENERATIONS) {
    assert.strictEqual(gen.gymLeaders.length, 8, `${gen.id} ha ${gen.gymLeaders.length} capipalestra invece di 8`);
  }
});

test("data integrity - la potenza dei capipalestra cresce strettamente lungo la regione", () => {
  for (const gen of GENERATIONS) {
    for (let i = 1; i < gen.gymLeaders.length; i++) {
      assert.ok(
        gen.gymLeaders[i].opponentPower > gen.gymLeaders[i - 1].opponentPower,
        `${gen.id}: potenza palestra ${i + 1} (${gen.gymLeaders[i].opponentPower}) non maggiore della ${i} (${gen.gymLeaders[i - 1].opponentPower})`
      );
    }
  }
});

test("data integrity - ogni capopalestra ha teamIds validi (array non vuoto di interi positivi)", () => {
  for (const gen of GENERATIONS) {
    for (const gym of gen.gymLeaders) {
      assert.ok(isValidTeamIds(gym.teamIds), `${gen.id}/${gym.title}: teamIds mancante, vuoto o con id non validi`);
    }
  }
});

test("data integrity - il tipo di ogni medaglia è risolvibile e riconosciuto (getBadgeType)", () => {
  for (const gen of GENERATIONS) {
    for (const gym of gen.gymLeaders) {
      const type = getBadgeType(gym.badge);
      assert.ok(type != null, `${gen.id}/${gym.badge}: tipo non risolvibile da getBadgeType (titolo "${gym.title}" senza "di tipo X"?)`);
      assert.ok(TYPE_LIST.includes(type), `${gen.id}/${gym.badge}: tipo estratto "${type}" non è un tipo Pokémon riconosciuto`);
    }
  }
});

test("data integrity - Alto Comando presente, con teamIds validi e potenza crescente", () => {
  for (const gen of GENERATIONS) {
    assert.ok(Array.isArray(gen.eliteFour) && gen.eliteFour.length > 0, `${gen.id}: Alto Comando mancante o vuoto`);
    gen.eliteFour.forEach((member, i) => {
      assert.ok(isValidTeamIds(member.teamIds), `${gen.id}: Alto Comando #${i + 1} (${member.title}) senza teamIds validi`);
      if (i > 0) {
        assert.ok(
          member.opponentPower > gen.eliteFour[i - 1].opponentPower,
          `${gen.id}: Alto Comando #${i + 1} potenza (${member.opponentPower}) non maggiore del membro precedente (${gen.eliteFour[i - 1].opponentPower})`
        );
      }
    });
  }
});

test("data integrity - Campione presente, con teamIds validi e potenza superiore all'Alto Comando", () => {
  for (const gen of GENERATIONS) {
    assert.ok(gen.champion && typeof gen.champion === "object", `${gen.id}: Campione mancante`);
    assert.ok(isValidTeamIds(gen.champion.teamIds), `${gen.id}: Campione senza teamIds validi`);
    assert.ok(typeof gen.champion.title === "string" && gen.champion.title.length > 0, `${gen.id}: Campione senza titolo`);
    const lastElite = gen.eliteFour[gen.eliteFour.length - 1];
    assert.ok(
      gen.champion.opponentPower > lastElite.opponentPower,
      `${gen.id}: potenza Campione (${gen.champion.opponentPower}) non superiore all'ultimo membro dell'Alto Comando (${lastElite.opponentPower})`
    );
  }
});

test("data integrity - starter, leggendari e Pokédex regionale definiti per ogni regione", () => {
  for (const gen of GENERATIONS) {
    assert.strictEqual(gen.starterIds.length, 3, `${gen.id}: numero di starter diverso da 3`);
    assert.ok(gen.starterIds.every((id) => Number.isInteger(id) && id > 0), `${gen.id}: id starter non validi`);
    assert.ok(Array.isArray(gen.legendaries) && gen.legendaries.length > 0, `${gen.id}: nessun leggendario definito`);
    assert.ok(gen.regionalDex, `${gen.id}: regionalDex mancante`);
  }
});

test("data integrity - Rivale e Boss del team nemico, quando presenti, hanno teamIds validi e afterGymIndex nel range delle palestre", () => {
  for (const gen of GENERATIONS) {
    for (const [label, event] of [["rival", gen.rival], ["villainBoss", gen.villainBoss]]) {
      if (!event) continue;
      assert.ok(isValidTeamIds(event.teamIds), `${gen.id}/${label}: teamIds mancante o non valido`);
      assert.ok(
        Number.isInteger(event.afterGymIndex) && event.afterGymIndex >= 0 && event.afterGymIndex < gen.gymLeaders.length,
        `${gen.id}/${label}: afterGymIndex ${event.afterGymIndex} fuori dal range delle palestre (0-${gen.gymLeaders.length - 1})`
      );
    }
  }
});

test("data integrity - CHAMPIONS_TOURNAMENT: 5 round sequenziali, teamIds validi, potenza crescente", () => {
  assert.strictEqual(CHAMPIONS_TOURNAMENT.length, 5, "il Torneo dei Campioni deve avere esattamente 5 round");
  CHAMPIONS_TOURNAMENT.forEach((entry, idx) => {
    assert.strictEqual(entry.round, idx + 1, `round atteso ${idx + 1}, trovato ${entry.round} (${entry.id})`);
    assert.ok(isValidTeamIds(entry.teamIds), `${entry.id}: teamIds mancante o non valido`);
    assert.ok(TYPE_LIST.includes(entry.type), `${entry.id}: tipo "${entry.type}" non è un tipo Pokémon riconosciuto`);
    if (idx > 0) {
      assert.ok(
        entry.opponentPower > CHAMPIONS_TOURNAMENT[idx - 1].opponentPower,
        `${entry.id}: potenza (${entry.opponentPower}) non maggiore del round precedente (${CHAMPIONS_TOURNAMENT[idx - 1].opponentPower})`
      );
    }
  });
});
