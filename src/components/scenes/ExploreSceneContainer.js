import React, { useState } from "react";
import { ChoiceScene } from "../ChoiceScene.js";
import { CasinoScene } from "../CasinoScene.js";
import { getExplorationTier } from "../../data/generations.js";
import { MAX_LEVEL } from "../../hooks/useGameState.js";
import { computeExploreSeed, computePostgameSeed, pickWeightedIds, pickTopIds } from "../../engine/explorePicker.js";
import { EXPLORE_SPECIAL_WEIGHTS } from "../../data/exploreOptions.js";
import { rollCasinoOutcome } from "../../engine/casinoLogic.js";
import { rollWeather } from "../../data/weather.js";
import { recordCrossroad, recordChoice } from "../../engine/runRecorder.js";
import {
  FIRE_POOLS_BY_REGION,
  GHOST_POOLS_BY_REGION,
  ICE_POOLS_BY_REGION,
  FIGHTING_POOLS_BY_REGION,
  EGG_POOLS_BY_REGION,
  FOSSIL_POOLS_BY_REGION,
  SAFARI_POOLS_BY_REGION,
  NPC_TRADE_POOL,
  POSTGAME_FIRE_POOL,
  POSTGAME_GHOST_POOL,
  POSTGAME_ICE_POOL,
  POSTGAME_FIGHTING_POOL,
  POSTGAME_SAFARI_POOL,
  POSTGAME_FOSSIL_POOL,
  POSTGAME_TRADE_POOL,
  POSTGAME_EGG_POOL,
  POSTGAME_ULTRA_POOL,
  POSTGAME_SEARCH_ITEMS,
  WEATHER_ITEM_BY_ID,
  EVOLUTION_STONES,
  SAFARI_ITEMS,
} from "../../data/exploreZonePools.js";

function withRecordedChoices(choices, phase) {
  return choices.map((choice) => ({
    ...choice,
    onSelect: () => {
      recordChoice({ phase, id: choice.id });
      choice.onSelect();
    },
  }));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const e = React.createElement;

export function ExploreSceneContainer({ game }) {
  const {
    state,
    update,
    goTo,
    generation,
    getScaledPower,
    boostTeam,
    addItem,
    markCaught,
    addToTeam,
  } = game;

  const [casinoOpen, setCasinoOpen] = useState(false);

  function playCasino(stake, pokemonLevel) {
    const outcome = rollCasinoOutcome(stake);
    if (outcome.tier === "jackpot") {
      const porygonId = Math.random() < 0.5 ? 137 : 233;
      markCaught(porygonId, false);
      addToTeam({ id: porygonId, level: pokemonLevel });
      addItem("Master Ball");
      outcome.pokemonId = porygonId;
    } else if (outcome.tier === "mid") {
      addItem("Caramella Rara");
      boostTeam(1);
    } else {
      boostTeam(1);
    }
    update({ coins: Math.max(0, (state.coins || 0) + outcome.coinsDelta) });
    return outcome;
  }

  if (state.phase === "postgameExplore") {
    const lastTier = generation
      ? generation.explorationTiers[generation.explorationTiers.length - 1]
      : { grass: [25, 39, 52], fishing: [129, 60], cave: [41, 74], grass2: [63, 92], level: 30 };
    const pgLevel = Math.min(MAX_LEVEL, lastTier.level + state.postgameRound * 5);
    // La potenza degli allenatori post-game cresceva con state.postgameRound
    // senza alcun tetto (a differenza di pgLevel sopra, correttamente
    // limitato a MAX_LEVEL) — dopo un centinaio di round superava facilmente
    // i 1000 punti, ben oltre quanto una squadra al livello massimo può mai
    // raggiungere, rendendo il post-game infinito impossibile da battere
    // oltre un certo punto. Segnalato da un giocatore reale. Fix: la crescita
    // si ferma allo stesso round in cui pgLevel raggiunge già MAX_LEVEL,
    // cosa che avviene comunque una volta sola (round non-negativo).
    const powerGrowthRound = Math.min(state.postgameRound, Math.max(0, Math.ceil((MAX_LEVEL - lastTier.level) / 5)));

    const postgameSpecialPool = [
      {
        id: "ultraWormhole",
        label: "🌌 Fenditura Ultra-Varco (Ultra Bestie)",
        hint: "Incontra creature leggendarie provenienti da altre dimensioni",
        onSelect: () => {
          const ubId = POSTGAME_ULTRA_POOL[Math.floor(Math.random() * POSTGAME_ULTRA_POOL.length)];
          goTo("legendaryEncounter", {
            pendingEncounterPool: [ubId],
            pendingEncounterLevel: Math.min(MAX_LEVEL, 75 + state.postgameRound * 2),
            pendingEncounterIsLegendary: true,
          });
        },
      },
      {
        id: "redBoss",
        label: "👑 Sfida Rosso sul Monte Argento",
        hint: "Lo scontro leggendario definitivo (Potenza 200) per ricompense epiche",
        onSelect: () => {
          goTo("trainerBattle", {
            pendingTrainer: {
              title: "Allenatore Leggendario Rosso",
              teamIds: [25, 131, 143, 6, 9, 3],
              power: getScaledPower(200),
            },
          });
        },
      },
      {
        id: "championsTournament",
        label: "🏆 Torneo dei Campioni Post-Game",
        hint: "Sfida i Campioni di tutte le regioni in un torneo ad eliminazione",
        onSelect: () => goTo("championsTournament", { tournamentRound: 0 }),
      },
      {
        id: "safariZone",
        label: "🌾 Parco Safari Esotico Post-Game",
        hint: "Riserva naturale di specie rare di tutte le generazioni",
        onSelect: () => {
          const chosenId = POSTGAME_SAFARI_POOL[Math.floor(Math.random() * POSTGAME_SAFARI_POOL.length)];
          addItem(pickRandom(SAFARI_ITEMS));
          goTo("encounter", {
            pendingEncounterPool: [chosenId],
            pendingEncounterLevel: pgLevel,
            pendingEncounterIsLegendary: false,
          });
        },
      },
      {
        id: "fossilRevival",
        label: "🧪 Laboratorio Fossili Antichi",
        hint: "Rianima e cattura un Pokémon preistorico a Lv 50",
        onSelect: () => {
          const fossilId = POSTGAME_FOSSIL_POOL[Math.floor(Math.random() * POSTGAME_FOSSIL_POOL.length)];
          markCaught(fossilId, false);
          addToTeam({ id: fossilId, level: 50 });
          update({ postgameRound: state.postgameRound + 1, phase: "postgameExplore" });
        },
      },
      {
        id: "npcTrade",
        label: "🤝 Allenatore in cerca di Scambi",
        hint: "Scambia un Pokémon per ottenere una specie rara a livello elevato",
        onSelect: () => {
          const tradeId = POSTGAME_TRADE_POOL[Math.floor(Math.random() * POSTGAME_TRADE_POOL.length)];
          markCaught(tradeId, false);
          addToTeam({ id: tradeId, level: Math.min(MAX_LEVEL, pgLevel + 5) });
          addItem(pickRandom(EVOLUTION_STONES)); // un allenatore che scambia offre volentieri anche una pietra evolutiva
          update({ postgameRound: state.postgameRound + 1, phase: "postgameExplore" });
        },
      },
      {
        id: "wanderingMerchant",
        label: "🛒 Mercante Ambulante di Strumenti Rari",
        hint: "Acquista pietre evolutive, Caramelle Rare o Master Ball",
        onSelect: () => goTo("merchant"),
      },
      {
        id: "casinoGameCorner",
        label: "🎰 Casinò Razzo & Sala Giochi",
        hint: "Scegli la puntata e fai girare le slot machine per vincere Porygon, monete e premi epici",
        onSelect: () => setCasinoOpen(true),
      },
      {
        id: "weatherCondition",
        label: "☀️ micro-Clima & Evento Atmosferico",
        hint: "Tempesta o sole intenso: influenzerà la tua prossima battaglia in base al tipo della squadra",
        onSelect: () => {
          const weather = rollWeather();
          addItem(WEATHER_ITEM_BY_ID[weather.id] || "Super Pozione");
          update({ activeWeather: weather, postgameRound: state.postgameRound + 1, phase: "postgameExplore" });
        },
      },
      {
        id: "fireZone",
        label: "🌋 Zona del Vulcano & Deserto",
        hint: "Pokémon selvatici di tipo Fuoco, Terra e Roccia",
        onSelect: () =>
          goTo("encounter", {
            pendingEncounterPool: POSTGAME_FIRE_POOL,
            pendingEncounterLevel: pgLevel,
            pendingEncounterIsLegendary: false,
          }),
      },
      {
        id: "ghostZone",
        label: "👻 Foresta Stregata & Rovine Antiche",
        hint: "Pokémon selvatici di tipo Spettro, Psico, Buio e Fata",
        onSelect: () =>
          goTo("encounter", {
            pendingEncounterPool: POSTGAME_GHOST_POOL,
            pendingEncounterLevel: pgLevel,
            pendingEncounterIsLegendary: false,
          }),
      },
      {
        id: "iceZone",
        label: "❄️ Vetta Innevata & Ghiacciaio",
        hint: "Pokémon selvatici di tipo Ghiaccio, Acciaio e Volante",
        onSelect: () =>
          goTo("encounter", {
            pendingEncounterPool: POSTGAME_ICE_POOL,
            pendingEncounterLevel: pgLevel,
            pendingEncounterIsLegendary: false,
          }),
      },
      {
        id: "fightingZone",
        label: "🥊 Dojo dei Combattenti & Arena",
        hint: "Pokémon selvatici di tipo Lotta e Normale",
        onSelect: () =>
          goTo("encounter", {
            pendingEncounterPool: POSTGAME_FIGHTING_POOL,
            pendingEncounterLevel: pgLevel,
            pendingEncounterIsLegendary: false,
          }),
      },
      {
        id: "pokecenterMarket",
        label: "🏥 Centro Pokémon & Mercatino di Città",
        hint: "Cura i Pokémon feriti e acquista strumenti utili con i Pokédollari!",
        onSelect: () => goTo("pokecenter"),
      },
      {
        id: "searchItems",
        label: "🔍 Cercatore di Strumenti & Bacche",
        hint: "Esplora per trovare bacche, pozioni o pietre evolutive",
        onSelect: () => {
          addItem(POSTGAME_SEARCH_ITEMS[Math.floor(Math.random() * POSTGAME_SEARCH_ITEMS.length)]);
          boostTeam(1);
          update({ postgameRound: state.postgameRound + 1, phase: "postgameExplore" });
        },
      },
      {
        id: "mysteryEgg",
        label: "🐣 Cova un Uovo Misterioso",
        hint: "Ricevi un uovo raro che si schiuderà in un nuovo Pokémon a Lv 5",
        onSelect: () => {
          const eggId = POSTGAME_EGG_POOL[Math.floor(Math.random() * POSTGAME_EGG_POOL.length)];
          markCaught(eggId, false);
          addToTeam({ id: eggId, level: 5 });
          addItem("Caramella Rara"); // il nuovo nato cresce in fretta
          update({ postgameRound: state.postgameRound + 1, phase: "postgameExplore" });
        },
      },
      {
        id: "enemyTeam",
        label: "🕵️‍♂️ Incursione del Team Nemico",
        hint: "Sconfiggi le reclute del Team malvagio per liberare la strada e vincere un premio",
        onSelect: () => {
          const oppPower = getScaledPower(100 + powerGrowthRound * 5);
          goTo("trainerBattle", {
            pendingTrainer: {
              title: "Recluta del Team Nemico Post-Game",
              teamIds: [24, 110, 130, 248],
              power: oppPower,
            },
          });
        },
      },
      {
        id: "fish",
        label: "🎣 Vai a pescare",
        hint: "Pokémon acquatici rari",
        onSelect: () =>
          goTo("encounter", {
            pendingEncounterPool: lastTier.fishing,
            pendingEncounterLevel: pgLevel,
            pendingEncounterIsLegendary: false,
          }),
      },
      {
        id: "cave",
        label: "🦇 Esplora una grotta misteriosa",
        hint: "Pokémon insoliti e strumenti",
        onSelect: () => {
          const pool = generation?.items?.cave ?? ["Pozione"];
          addItem(pool[Math.floor(Math.random() * pool.length)]);
          goTo("encounter", {
            pendingEncounterPool: lastTier.cave,
            pendingEncounterLevel: pgLevel,
            pendingEncounterIsLegendary: false,
          });
        },
      },
      {
        id: "trainer",
        label: "⚔️ Sfida un Allenatore di passaggio",
        hint: "Battaglia rapida per XP extra e strumenti",
        onSelect: () => {
          const teamIds = [lastTier.grass[0], lastTier.cave[0]];
          const power = getScaledPower(35 + powerGrowthRound * 5);
          goTo("trainerBattle", {
            pendingTrainer: { title: "Allenatore di passaggio", teamIds, power },
          });
        },
      },
    ];

    // Shuffle deterministico basato su postgameRound (nessun Math.random() in render → no loop infinito)
    const postgameSeed = computePostgameSeed({ postgameRound: state.postgameRound });
    const postgameById = new Map(postgameSpecialPool.map((o) => [o.id, o]));
    const rolledSpecials = pickTopIds(postgameSpecialPool.map((o) => o.id), postgameSeed, 6)
      .map((id) => postgameById.get(id));

    const baseGrassChoice = {
      id: "grass",
      label: "🌿 Addentrati nell'erba alta",
      hint: "Pokémon selvatici sempre più forti",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: lastTier.grass,
          pendingEncounterLevel: pgLevel,
          pendingEncounterIsLegendary: false,
        }),
    };

    const choicesPool = [...rolledSpecials, baseGrassChoice];

    const chaosRouletteChoice = {
      id: "chaosRoulette",
      label: "🎲 Ruota del Destino (Chaos Roulette)",
      hint: "Lascia che sia la sorte a scegliere casualmente uno dei bivi per te!",
      onSelect: () => {
        const randomIndex = Math.floor(Math.random() * choicesPool.length);
        choicesPool[randomIndex].onSelect();
      },
    };

    const postgameChoices = [...choicesPool, chaosRouletteChoice];
    recordCrossroad({
      phase: state.phase,
      ids: postgameChoices.map((c) => c.id),
      seedInputs: { postgameRound: state.postgameRound },
    });

    if (casinoOpen) {
      return e(CasinoScene, {
        coins: state.coins || 0,
        onPlay: (stake) => playCasino(stake, pgLevel),
        onLeave: () => {
          setCasinoOpen(false);
          update({ postgameRound: state.postgameRound + 1, phase: "postgameExplore" });
        },
      });
    }

    return e(ChoiceScene, {
      key: `postgame-${state.postgameRound}`,
      title: "Esplorazione libera post-game",
      text: `Continui ad esplorare il mondo Pokémon. I Pokémon selvatici ed avversari sono al massimo della potenza. (Round ${state.postgameRound + 1})`,
      choices: withRecordedChoices(postgameChoices, state.phase),
    });
  }

  const tier = getExplorationTier(generation, state.gymIndex);
  const nextGymTitle = generation?.gymLeaders?.[state.gymIndex]?.title ?? "la prossima Palestra";
  const useAltGrass = state.gymIndex % 2 === 1;

  if (casinoOpen) {
    return e(CasinoScene, {
      coins: state.coins || 0,
      onPlay: (stake) => playCasino(stake, Math.min(MAX_LEVEL, tier.level + 4)),
      onLeave: () => {
        setCasinoOpen(false);
        goTo("gymBattle");
      },
    });
  }

  const allSpecialOptions = [
    {
      id: "legendary",
      weight: EXPLORE_SPECIAL_WEIGHTS.legendary,
      label: "⭐ Santuario Antico (Incontro Leggendario)",
      hint: "Segui antichi segni per scovare un Pokémon Leggendario della regione!",
      onSelect: () => {
        const legendaries = generation.legendaries || [150];
        const uncaptured = legendaries.filter((id) => !state.caughtLegendaries.includes(id));
        const selectedId = uncaptured.length > 0
          ? uncaptured[Math.floor(Math.random() * uncaptured.length)]
          : legendaries[Math.floor(Math.random() * legendaries.length)];
        
        goTo("legendaryEncounter", {
          pendingEncounterPool: [selectedId],
          pendingEncounterLevel: Math.min(100, 35 + state.gymIndex * 5),
          pendingEncounterIsLegendary: true,
        });
      },
    },
    {
      id: "fireZone",
      weight: EXPLORE_SPECIAL_WEIGHTS.fireZone,
      label: "🌋 Vulcano & Centrale Elettrica",
      hint: "Pokémon selvatici di tipo Fuoco, Elettrico ed Acciaio",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: FIRE_POOLS_BY_REGION[state.generationId] || [37, 58, 100],
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "ghostZone",
      weight: EXPLORE_SPECIAL_WEIGHTS.ghostZone,
      label: "👻 Foresta Stregata & Rovine Antiche",
      hint: "Pokémon selvatici di tipo Spettro, Psico, Buio e Fata",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: GHOST_POOLS_BY_REGION[state.generationId] || [92, 63, 35],
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "iceZone",
      weight: EXPLORE_SPECIAL_WEIGHTS.iceZone,
      label: "❄️ Vetta Innevata & Ghiacciaio",
      hint: "Pokémon selvatici di tipo Ghiaccio, Acciaio e Volante",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: ICE_POOLS_BY_REGION[state.generationId] || [124, 131, 220],
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "fightingZone",
      weight: EXPLORE_SPECIAL_WEIGHTS.fightingZone,
      label: "🥊 Dojo dei Combattenti & Arena",
      hint: "Pokémon selvatici di tipo Lotta e Normale",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: FIGHTING_POOLS_BY_REGION[state.generationId] || [66, 56, 106],
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "fish",
      weight: EXPLORE_SPECIAL_WEIGHTS.fish,
      label: "🎣 Vai a pescare sul fiume",
      hint: "Pokémon d'acqua e acquatici rari",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: tier.fishing,
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "cave",
      weight: EXPLORE_SPECIAL_WEIGHTS.cave,
      label: "🦇 Esplora una grotta misteriosa",
      hint: "Pokémon di tipo Roccia, Terra e Buio + minerale regalo",
      onSelect: () => {
        const pool = generation?.items?.cave || ["Super Pozione"];
        addItem(pool[Math.floor(Math.random() * pool.length)]);
        goTo("encounter", {
          pendingEncounterPool: tier.cave,
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        });
      },
    },
    {
      id: "enemyTeam",
      weight: EXPLORE_SPECIAL_WEIGHTS.enemyTeam,
      label: "🕵️‍♂️ Incursione del Team Nemico",
      hint: "Sconfiggi le reclute del Team malvagio per liberare la strada e vincere un premio",
      onSelect: () => {
        const oppPower = getScaledPower(18 + state.gymIndex * 8);
        goTo("trainerBattle", {
          pendingTrainer: {
            title: "Recluta del Team Nemico",
            teamIds: [tier.grass[0], tier.cave[0] || tier.grass[1]],
            power: oppPower,
          },
        });
      },
    },
    {
      id: "mysteryEgg",
      weight: EXPLORE_SPECIAL_WEIGHTS.mysteryEgg,
      label: "🐣 Cova un Uovo Misterioso",
      hint: "Ricevi un uovo raro che si schiuderà in un nuovo Pokémon a Lv 5",
      onSelect: () => {
        const pool = EGG_POOLS_BY_REGION[state.generationId] || [133, 175, 447];
        const eggId = pool[Math.floor(Math.random() * pool.length)];
        markCaught(eggId, false);
        addToTeam({ id: eggId, level: 5 });
        addItem("Caramella Rara"); // il nuovo nato cresce in fretta
        goTo("gymBattle");
      },
    },
    {
      id: "trainer",
      weight: EXPLORE_SPECIAL_WEIGHTS.trainer,
      label: "⚔️ Sfida un Allenatore del percorso",
      hint: "Battaglia rapida per XP della squadra ed un premio",
      onSelect: () => {
        const oppPower = getScaledPower(12 + state.gymIndex * 7);
        goTo("trainerBattle", {
          pendingTrainer: {
            title: "Allenatore del percorso",
            teamIds: [tier.grass[0], tier.cave[0] || tier.grass[1]],
            power: oppPower,
          },
        });
      },
    },
    {
      id: "pokecenterMarket",
      weight: EXPLORE_SPECIAL_WEIGHTS.pokecenterMarket,
      label: "🏥 Centro Pokémon & Mercatino di Città",
      hint: "Cura i Pokémon feriti e acquista strumenti utili con i Pokédollari!",
      onSelect: () => goTo("pokecenter"),
    },
    {
      id: "searchItems",
      weight: EXPLORE_SPECIAL_WEIGHTS.searchItems,
      label: "🔍 Cercatore di Strumenti & Bacche",
      hint: "Esplora per trovare bacche, pozioni o pietre evolutive",
      onSelect: () => {
        const caveItems = generation?.items?.cave || ["Super Pozione"];
        const grassItems = generation?.items?.grass || ["Pozione"];
        const pool = [...caveItems, ...grassItems];
        const foundItem = pool[Math.floor(Math.random() * pool.length)];
        addItem(foundItem);
        boostTeam(1);
        goTo("gymBattle");
      },
    },
    {
      id: "fossilRevival",
      weight: EXPLORE_SPECIAL_WEIGHTS.fossilRevival,
      label: "🧪 Laboratorio Fossili Antichi",
      hint: "Consegna un fossile per rianimare e catturare un Pokémon preistorico a Lv 15",
      onSelect: () => {
        const pool = FOSSIL_POOLS_BY_REGION[state.generationId] || [138, 140, 142, 345, 347];
        const fossilId = pool[Math.floor(Math.random() * pool.length)];
        markCaught(fossilId, false);
        addToTeam({ id: fossilId, level: 15 });
        boostTeam(1);
        goTo("gymBattle");
      },
    },
    {
      id: "npcTrade",
      weight: EXPLORE_SPECIAL_WEIGHTS.npcTrade,
      label: "🤝 Allenatore in cerca di Scambi",
      hint: "Un Allenatore del percorso ti offre una specie rara in cambio di una collaborazione",
      onSelect: () => {
        const tradeId = NPC_TRADE_POOL[Math.floor(Math.random() * NPC_TRADE_POOL.length)];
        markCaught(tradeId, false);
        const avgLevel = state.team.length > 0
          ? Math.round(state.team.reduce((acc, p) => acc + (p.level || 5), 0) / state.team.length) + 2
          : 12;
        addToTeam({ id: tradeId, level: Math.min(MAX_LEVEL, avgLevel) });
        addItem(pickRandom(EVOLUTION_STONES)); // un allenatore che scambia offre volentieri anche una pietra evolutiva
        goTo("gymBattle");
      },
    },
    {
      id: "wanderingMerchant",
      weight: EXPLORE_SPECIAL_WEIGHTS.wanderingMerchant,
      label: "🛒 Mercante Ambulante di Strumenti",
      hint: "Acquista pietre evolutive rare o Caramelle Rare con i tuoi Pokédollari",
      onSelect: () => goTo("merchant"),
    },
    {
      id: "casinoGameCorner",
      weight: EXPLORE_SPECIAL_WEIGHTS.casinoGameCorner,
      label: "🎰 Casinò Razzo & Sala Giochi",
      hint: "Scegli la puntata e scommetti alle slot machine per tentare di vincere Porygon, Master Ball o Pokédollari!",
      onSelect: () => setCasinoOpen(true),
    },
    {
      id: "safariZone",
      weight: EXPLORE_SPECIAL_WEIGHTS.safariZone,
      label: "🌾 Parco Safari — Riserva Naturale",
      hint: "Entra nella riserva per incontrare ed armarti di Safari Ball contro Pokémon esotici e rari",
      onSelect: () => {
        const pool = SAFARI_POOLS_BY_REGION[state.generationId] || [123, 127, 128, 115, 147];
        addItem(pickRandom(SAFARI_ITEMS));
        goTo("encounter", {
          pendingEncounterPool: pool,
          pendingEncounterLevel: tier.level + 2,
          pendingEncounterIsLegendary: false,
        });
      },
    },
    {
      id: "weatherCondition",
      weight: EXPLORE_SPECIAL_WEIGHTS.weatherCondition,
      label: "☀️ micro-Clima & Evento Atmosferico",
      hint: "Venti sabbiosi, piogge o sole intenso: influenzeranno la prossima battaglia in base al tipo della squadra",
      onSelect: () => {
        const weather = rollWeather();
        addItem(WEATHER_ITEM_BY_ID[weather.id] || "Super Pozione");
        update({ activeWeather: weather });
        goTo("gymBattle");
      },
    },
  ];

  // Shuffle e selezione deterministica (nessun Math.random() in render, per evitare
  // ricalcoli instabili tra un render e l'altro). Il seed incorpora choicesCount, che
  // avanza ad ogni transizione di stato (goTo), così il bivio varia visita dopo visita
  // invece di ripetersi identico finché gymIndex/badges non cambiano.
  const explSeed = computeExploreSeed({
    gymIndex: state.gymIndex || 0,
    badgesCount: state.badges ? state.badges.length : 0,
    choicesCount: state.choicesCount || 0,
  });
  const specialsById = new Map(allSpecialOptions.map((o) => [o.id, o]));
  const rolledSpecials = pickWeightedIds(allSpecialOptions, explSeed, 6)
    .map((id) => specialsById.get(id));

  const baseGrassChoice = {
    id: "grass",
    label: useAltGrass ? "🌿 Esplora un nuovo sentiero erboso" : "🌿 Addentrati nell'erba alta",
    hint: "Incontra Pokémon selvatici locali (Erba, Volante, Coleottero)",
    onSelect: () =>
      goTo("encounter", {
        pendingEncounterPool: useAltGrass ? tier.grass2 : tier.grass,
        pendingEncounterLevel: tier.level,
        pendingEncounterIsLegendary: false,
      }),
  };

  const baseTrainChoice = {
    id: "train",
    label: "🏋️‍♂️ Allenamento intensivo",
    hint: "Nessun Pokémon selvatico, ma la squadra guadagna +2 Livelli",
    onSelect: () => {
      boostTeam(2);
      goTo("gymBattle");
    },
  };

  const chaosRouletteChoice = {
    id: "chaosRoulette",
    label: "🎰 Ruota del Destino (Chaos Roulette)",
    hint: "Lascia che sia la sorte a scegliere casualmente uno dei bivi per te!",
    onSelect: () => {
      const remaining = [baseGrassChoice, ...rolledSpecials, baseTrainChoice];
      const chosen = remaining[Math.floor(Math.random() * remaining.length)];
      chosen.onSelect();
    },
  };

  const exploreChoices = [
    baseGrassChoice,
    ...rolledSpecials,
    baseTrainChoice,
    chaosRouletteChoice,
  ];

  recordCrossroad({
    phase: state.phase,
    ids: exploreChoices.map((c) => c.id),
    seedInputs: {
      gymIndex: state.gymIndex || 0,
      badgesCount: state.badges ? state.badges.length : 0,
      choicesCount: state.choicesCount || 0,
    },
  });

  return e(ChoiceScene, {
    key: `explore-${state.gymIndex}`,
    title: state.gymIndex === 0 ? "Il primo bivio" : "Verso la prossima palestra",
    text:
      state.gymIndex === 0
        ? "Lasci il laboratorio del Professore. Le strade intorno si biforcano in modi inaspettati..."
        : `Ti lasci alle spalle l'ultima palestra. Quali opportunità ti riserva il percorso verso "${nextGymTitle}"?`,
    choices: withRecordedChoices(exploreChoices, state.phase),
  });
}
