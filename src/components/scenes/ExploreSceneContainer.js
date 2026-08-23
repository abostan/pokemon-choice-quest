import React from "react";
import { ChoiceScene } from "../ChoiceScene.js";
import { getExplorationTier } from "../../data/generations.js";
import { MAX_LEVEL } from "../../hooks/useGameState.js";
import { filterEncounterPoolByChallenge } from "../../engine/challengeEngine.js";

const e = React.createElement;

// Alias locale per compatibilità con le chiamate interne
const applyChallengeFilters = filterEncounterPoolByChallenge;

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
    startPostgameExplore,
  } = game;

  if (state.phase === "postgameExplore") {
    const lastTier = generation
      ? generation.explorationTiers[generation.explorationTiers.length - 1]
      : { grass: [25, 39, 52], fishing: [129, 60], cave: [41, 74], grass2: [63, 92], level: 30 };
    const pgLevel = Math.min(MAX_LEVEL, lastTier.level + state.postgameRound * 5);

    const postgameSpecialPool = [
      {
        id: "ultraWormhole",
        label: "🌌 Fenditura Ultra-Varco (Ultra Bestie)",
        hint: "Incontra creature leggendarie provenienti da altre dimensioni",
        onSelect: () => {
          const ultraPool = [793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806];
          const ubId = ultraPool[Math.floor(Math.random() * ultraPool.length)];
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
          const safariPool = [123, 128, 147, 246, 371, 443, 610, 696, 782, 885, 996];
          const chosenId = safariPool[Math.floor(Math.random() * safariPool.length)];
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
          const fossilPool = [138, 140, 142, 345, 347, 408, 410, 564, 566, 696, 698];
          const fossilId = fossilPool[Math.floor(Math.random() * fossilPool.length)];
          markCaught(fossilId, false);
          addToTeam({ id: fossilId, level: 50 });
          update({ postgameRound: state.postgameRound + 1 });
          setTimeout(() => startPostgameExplore(), 0);
        },
      },
      {
        id: "npcTrade",
        label: "🤝 Allenatore in cerca di Scambi",
        hint: "Scambia un Pokémon per ottenere una specie rara a livello elevato",
        onSelect: () => {
          const tradePool = [137, 212, 468, 474, 635, 706, 959];
          const tradeId = tradePool[Math.floor(Math.random() * tradePool.length)];
          markCaught(tradeId, false);
          addToTeam({ id: tradeId, level: Math.min(MAX_LEVEL, pgLevel + 5) });
          addItem("Super Pozione");
          update({ postgameRound: state.postgameRound + 1 });
          setTimeout(() => startPostgameExplore(), 0);
        },
      },
      {
        id: "wanderingMerchant",
        label: "🛒 Mercante Ambulante di Strumenti Rari",
        hint: "Acquista pietre evolutive, Caramelle Rare o Master Ball",
        onSelect: () => {
          const merchantItems = ["Caramella Rara", "Resti", "Assorbosfera", "Master Ball"];
          const bought = merchantItems[Math.floor(Math.random() * merchantItems.length)];
          addItem(bought);
          update({ postgameRound: state.postgameRound + 1 });
          setTimeout(() => startPostgameExplore(), 0);
        },
      },
      {
        id: "casinoGameCorner",
        label: "🎰 Casinò Razzo & Sala Giochi",
        hint: "Fai girare le slot machine per vincere Porygon, monete e premi epici",
        onSelect: () => {
          const roll = Math.random();
          if (roll < 0.25) {
            markCaught(474, false);
            addToTeam({ id: 474, level: Math.min(MAX_LEVEL, pgLevel) });
            addItem("Master Ball");
            update({ coins: (state.coins || 0) + 25 });
          } else {
            boostTeam(3);
            update({ coins: (state.coins || 0) + 10 });
          }
          update({ postgameRound: state.postgameRound + 1 });
          setTimeout(() => startPostgameExplore(), 0);
        },
      },
      {
        id: "weatherCondition",
        label: "☀️ micro-Clima & Evento Atmosferico",
        hint: "Tempesta o sole intenso potenziante per la tua squadra",
        onSelect: () => {
          boostTeam(2);
          addItem("Super Pozione");
          update({ postgameRound: state.postgameRound + 1 });
          setTimeout(() => startPostgameExplore(), 0);
        },
      },
      {
        id: "fireZone",
        label: "🌋 Zona del Vulcano & Deserto",
        hint: "Pokémon selvatici di tipo Fuoco, Terra e Roccia",
        onSelect: () =>
          goTo("encounter", {
            pendingEncounterPool: [58, 77, 218, 322, 554, 667, 935],
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
            pendingEncounterPool: [92, 200, 353, 425, 607, 708, 971],
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
            pendingEncounterPool: [131, 225, 363, 459, 613, 712, 974],
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
            pendingEncounterPool: [66, 106, 296, 447, 532, 759, 921],
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
          const pool = ["Super Pozione", "Caramella Rara", "Pietra Lunare", "Resti"];
          addItem(pool[Math.floor(Math.random() * pool.length)]);
          boostTeam(1);
          update({ postgameRound: state.postgameRound + 1 });
          setTimeout(() => startPostgameExplore(), 0);
        },
      },
      {
        id: "mysteryEgg",
        label: "🐣 Cova un Uovo Misterioso",
        hint: "Ricevi un uovo raro che si schiuderà in un nuovo Pokémon a Lv 5",
        onSelect: () => {
          const eggPool = [133, 175, 447, 633, 704, 885, 996];
          const eggId = eggPool[Math.floor(Math.random() * eggPool.length)];
          markCaught(eggId, false);
          addToTeam({ id: eggId, level: 5 });
          addItem("Super Pozione");
          update({ postgameRound: state.postgameRound + 1 });
          setTimeout(() => startPostgameExplore(), 0);
        },
      },
      {
        id: "enemyTeam",
        label: "🕵️‍♂️ Incursione del Team Nemico",
        hint: "Sconfiggi le reclute del Team malvagio per liberare la strada e vincere un premio",
        onSelect: () => {
          const oppPower = getScaledPower(100 + state.postgameRound * 5);
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
          const power = getScaledPower(35 + state.postgameRound * 5);
          goTo("trainerBattle", {
            pendingTrainer: { title: "Allenatore di passaggio", teamIds, power },
          });
        },
      },
    ];

    // Shuffle deterministico basato su postgameRound (nessun Math.random() in render → no loop infinito)
    const seed = (state.postgameRound || 0) * 1013 + 7;
    const shuffled = [...postgameSpecialPool].sort((a, b) => {
      const ha = ((a.id.charCodeAt(0) * 31 + seed) * 17) % 97;
      const hb = ((b.id.charCodeAt(0) * 31 + seed) * 17) % 97;
      return ha - hb;
    });
    const rolledSpecials = shuffled.slice(0, 4);

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

    return e(ChoiceScene, {
      key: `postgame-${state.postgameRound}`,
      title: "Esplorazione libera post-game",
      text: `Continui ad esplorare il mondo Pokémon. I Pokémon selvatici ed avversari sono al massimo della potenza. (Round ${state.postgameRound + 1})`,
      choices: [...choicesPool, chaosRouletteChoice],
    });
  }

  const tier = getExplorationTier(generation, state.gymIndex);
  const nextGymTitle = generation?.gymLeaders?.[state.gymIndex]?.title ?? "la prossima Palestra";
  const useAltGrass = state.gymIndex % 2 === 1;

  const firePools = {
    kanto: [37, 58, 100, 81, 77],
    johto: [155, 179, 218, 228, 239],
    hoenn: [255, 309, 322, 304, 324],
    sinnoh: [390, 403, 240, 436, 479],
    unova: [498, 522, 554, 599, 607],
    kalos: [653, 667, 694, 679, 669],
  };

  const ghostPools = {
    kanto: [92, 63, 96, 35, 39],
    johto: [200, 198, 215, 280, 175],
    hoenn: [353, 355, 302, 325, 280],
    sinnoh: [425, 442, 433, 434, 439],
    unova: [570, 607, 562, 574, 577],
    kalos: [708, 710, 677, 682, 684],
  };

  const icePools = {
    kanto: [124, 131, 90, 142],
    johto: [220, 225, 215, 227],
    hoenn: [361, 363, 378, 374],
    sinnoh: [459, 361, 436, 447],
    unova: [582, 613, 615, 624],
    kalos: [712, 698, 679, 701],
  };

  const fightingPools = {
    kanto: [66, 56, 106, 107, 52],
    johto: [236, 214, 190, 216, 209],
    hoenn: [296, 307, 335, 287, 300],
    sinnoh: [447, 453, 427, 417, 422],
    unova: [532, 559, 619, 572, 506],
    kalos: [674, 701, 659, 676, 672],
  };

  const eggPools = {
    kanto: [133, 131, 147],
    johto: [175, 172, 246],
    hoenn: [360, 328, 371],
    sinnoh: [447, 403, 443],
    unova: [570, 559, 610],
    kalos: [677, 704, 714],
  };

  const allSpecialOptions = [
    {
      id: "legendary",
      weight: 0.10,
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
      weight: 0.20,
      label: "🌋 Vulcano & Centrale Elettrica",
      hint: "Pokémon selvatici di tipo Fuoco, Elettrico ed Acciaio",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: firePools[state.generationId] || [37, 58, 100],
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "ghostZone",
      weight: 0.20,
      label: "👻 Foresta Stregata & Rovine Antiche",
      hint: "Pokémon selvatici di tipo Spettro, Psico, Buio e Fata",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: ghostPools[state.generationId] || [92, 63, 35],
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "iceZone",
      weight: 0.15,
      label: "❄️ Vetta Innevata & Ghiacciaio",
      hint: "Pokémon selvatici di tipo Ghiaccio, Acciaio e Volante",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: icePools[state.generationId] || [124, 131, 220],
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "fightingZone",
      weight: 0.20,
      label: "🥊 Dojo dei Combattenti & Arena",
      hint: "Pokémon selvatici di tipo Lotta e Normale",
      onSelect: () =>
        goTo("encounter", {
          pendingEncounterPool: fightingPools[state.generationId] || [66, 56, 106],
          pendingEncounterLevel: tier.level,
          pendingEncounterIsLegendary: false,
        }),
    },
    {
      id: "fish",
      weight: 0.30,
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
      weight: 0.30,
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
      weight: 0.20,
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
      weight: 0.12,
      label: "🐣 Cova un Uovo Misterioso",
      hint: "Ricevi un uovo raro che si schiuderà in un nuovo Pokémon a Lv 5",
      onSelect: () => {
        const pool = eggPools[state.generationId] || [133, 175, 447];
        const eggId = pool[Math.floor(Math.random() * pool.length)];
        markCaught(eggId, false);
        addToTeam({ id: eggId, level: 5 });
        addItem("Super Pozione");
        goTo("gymBattle");
      },
    },
    {
      id: "trainer",
      weight: 0.25,
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
      weight: 0.22,
      label: "🏥 Centro Pokémon & Mercatino di Città",
      hint: "Cura i Pokémon feriti e acquista strumenti utili con i Pokédollari!",
      onSelect: () => goTo("pokecenter"),
    },
    {
      id: "searchItems",
      weight: 0.25,
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
      weight: 0.20,
      label: "🧪 Laboratorio Fossili Antichi",
      hint: "Consegna un fossile per rianimare e catturare un Pokémon preistorico a Lv 15",
      onSelect: () => {
        const fossilPools = {
          kanto: [138, 140, 142],
          johto: [138, 140, 345, 347],
          hoenn: [345, 347, 142],
          sinnoh: [408, 410, 142],
          unova: [564, 566],
          kalos: [696, 698],
        };
        const pool = fossilPools[state.generationId] || [138, 140, 142, 345, 347];
        const fossilId = pool[Math.floor(Math.random() * pool.length)];
        markCaught(fossilId, false);
        addToTeam({ id: fossilId, level: 15 });
        boostTeam(1);
        goTo("gymBattle");
      },
    },
    {
      id: "npcTrade",
      weight: 0.20,
      label: "🤝 Allenatore in cerca di Scambi",
      hint: "Un Allenatore del percorso ti offre una specie rara in cambio di una collaborazione",
      onSelect: () => {
        const tradePool = [83, 122, 124, 127, 131, 214, 303, 441, 538, 677];
        const tradeId = tradePool[Math.floor(Math.random() * tradePool.length)];
        markCaught(tradeId, false);
        const avgLevel = state.team.length > 0
          ? Math.round(state.team.reduce((acc, p) => acc + (p.level || 5), 0) / state.team.length) + 2
          : 12;
        addToTeam({ id: tradeId, level: Math.min(MAX_LEVEL, avgLevel) });
        addItem("Super Pozione");
        goTo("gymBattle");
      },
    },
    {
      id: "wanderingMerchant",
      weight: 0.22,
      label: "🛒 Mercante Ambulante di Strumenti",
      hint: "Acquista pietre evolutive rare o Caramelle Rare con i tuoi Pokédollari",
      onSelect: () => {
        const merchantItems = ["Pietra Focaia", "Idropietra", "Pietra Foglia", "Pietra Tuono", "Pietraluna", "Caramella Rara"];
        const boughtItem = merchantItems[Math.floor(Math.random() * merchantItems.length)];
        addItem(boughtItem);
        if (boughtItem === "Caramella Rara") {
          boostTeam(2);
        } else {
          boostTeam(1);
        }
        goTo("gymBattle");
      },
    },
    {
      id: "casinoGameCorner",
      weight: 0.22,
      label: "🎰 Casinò Razzo & Sala Giochi",
      hint: "Scommetti le tue monete alle slot machine per tentare di vincere Porygon, Master Ball o Pokédollari!",
      onSelect: () => {
        const roll = Math.random();
        if (roll < 0.25) {
          const porygonId = Math.random() < 0.5 ? 137 : 233;
          markCaught(porygonId, false);
          addToTeam({ id: porygonId, level: Math.min(MAX_LEVEL, tier.level + 4) });
          addItem("Master Ball");
          update({ coins: (state.coins || 0) + 8 });
        } else if (roll < 0.65) {
          addItem("Caramella Rara");
          update({ coins: (state.coins || 0) + 3 });
          boostTeam(1);
        } else {
          boostTeam(1);
          update({ coins: Math.max(0, (state.coins || 0) - 1) });
        }
        goTo("gymBattle");
      },
    },
    {
      id: "safariZone",
      weight: 0.22,
      label: "🌾 Parco Safari — Riserva Naturale",
      hint: "Entra nella riserva per incontrare ed armarti di Safari Ball contro Pokémon esotici e rari",
      onSelect: () => {
        const safariPools = {
          kanto: [123, 127, 128, 115, 113, 147],
          johto: [214, 225, 234, 246],
          hoenn: [328, 335, 359, 371],
          sinnoh: [443, 453, 455],
          unova: [559, 610, 621],
          kalos: [704, 708, 712],
        };
        const pool = safariPools[state.generationId] || [123, 127, 128, 115, 147];
        goTo("encounter", {
          pendingEncounterPool: pool,
          pendingEncounterLevel: tier.level + 2,
          pendingEncounterIsLegendary: false,
        });
      },
    },
    {
      id: "weatherCondition",
      weight: 0.25,
      label: "☀️ micro-Clima & Evento Atmosferico",
      hint: "Venti sabbiosi, piogge o sole intenso sferzano il percorso potenziando la squadra",
      onSelect: () => {
        addItem("Super Pozione");
        boostTeam(2);
        goTo("gymBattle");
      },
    },
  ];

  // Shuffle e selezione deterministica basata su gymIndex (nessun Math.random() in render)
  const explSeed = (state.gymIndex || 0) * 1013 + (state.badges ? state.badges.length * 37 : 0) + 7;
  function seededRandom(extra) {
    return ((explSeed + extra) * 1664525 + 1013904223) % 2147483647 / 2147483647;
  }

  const rolledSpecials = [];
  const shuffled = [...allSpecialOptions].sort((a, b) => {
    const ha = ((a.id.charCodeAt(0) * 31 + explSeed) * 17) % 97;
    const hb = ((b.id.charCodeAt(0) * 31 + explSeed) * 17) % 97;
    return ha - hb;
  });
  let extraSeed = 0;
  for (const opt of shuffled) {
    if (seededRandom(++extraSeed) < opt.weight) {
      rolledSpecials.push(opt);
      if (rolledSpecials.length >= 3) break;
    }
  }
  if (rolledSpecials.length < 3) {
    for (const opt of shuffled) {
      if (!rolledSpecials.some((o) => o.id === opt.id)) {
        rolledSpecials.push(opt);
        if (rolledSpecials.length >= 3) break;
      }
    }
  }

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

  return e(ChoiceScene, {
    key: `explore-${state.gymIndex}`,
    title: state.gymIndex === 0 ? "Il primo bivio" : "Verso la prossima palestra",
    text:
      state.gymIndex === 0
        ? "Lasci il laboratorio del Professore. Le strade intorno si biforcano in modi inaspettati..."
        : `Ti lasci alle spalle l'ultima palestra. Quali opportunità ti riserva il percorso verso "${nextGymTitle}"?`,
    choices: exploreChoices,
  });
}
