import React, { useState, useEffect, useRef } from "react";
import { GenerationSelectScreen } from "./components/GenerationSelectScreen.js";
import { StartScreen } from "./components/StartScreen.js";
import { ChoiceScene } from "./components/ChoiceScene.js";
import { EncounterScene } from "./components/EncounterScene.js";
import { BattleScene } from "./components/BattleScene.js";
import { EndScreen } from "./components/EndScreen.js";
import { TeamPanel } from "./components/TeamPanel.js";
import { NextGenerationScreen } from "./components/NextGenerationScreen.js";
import { PostgameScreen } from "./components/PostgameScreen.js";
import { PokedexModal } from "./components/PokedexModal.js";
import { ResumeScreen } from "./components/ResumeScreen.js";
import { EvolutionNotice } from "./components/EvolutionNotice.js";
import { BoxModal } from "./components/BoxModal.js";
import { getGeneration, getExplorationTier, getNextGeneration } from "./data/generations.js";
import { checkEvolution } from "./data/evolutions.js";
import {
  saveGame,
  loadGame,
  hasSave,
  deleteSave,
  loadAllSlots,
  exportSlotJSON,
  importSlotJSON,
  updateHistoricPokedex,
} from "./engine/saveGame.js";

const e = React.createElement;

// Quanti livelli guadagna la squadra dopo una battaglia di palestra/Lega
const WIN_LEVEL_BOOST = 3;

// Limite massimo di livello Pokémon
const MAX_LEVEL = 100;

// Limite massimo di Pokémon nella squadra attiva
const MAX_TEAM_SIZE = 6;

// Probabilità di incontro leggendario ad ogni round di esplorazione post-game
const LEGENDARY_CHANCE = 0.05;

function initialState() {
  return {
    // --- Flusso di gioco ---
    phase: "generationSelect",
    generationId: null,
    gymIndex: 0,
    eliteIndex: 0,
    rivalDone: false,

    // --- Squadra e inventario ---
    team: [],
    box: [],
    badges: [],
    items: [],

    // --- Stato transiente della scena ---
    pendingEncounterPool: null,
    pendingEncounterLevel: 4,
    pendingEncounterIsLegendary: false,
    pendingTrainer: null,

    // --- Multi-generazione e post-game ---
    multiGenRun: false,
    completedGensCount: 0,
    postgameRound: 0,

    // --- Pokédex ---
    pokedexRun: {},
    pokedexOpen: false,

    // --- Evoluzioni in attesa di notifica ---
    pendingEvolutions: [],

    // --- Leggendari catturati ---
    caughtLegendaries: [],

    // --- UI ---
    boxModalOpen: false,
  };
}

export default function App() {
  const [activeSlotId, setActiveSlotId] = useState(1);
  const [slotsData, setSlotsData] = useState(() => loadAllSlots());

  const [state, setState] = useState(() => {
    if (hasSave()) {
      return { ...initialState(), phase: "resume" };
    }
    return initialState();
  });

  function refreshSlots() {
    setSlotsData(loadAllSlots());
  }

  // Auto-save su activeSlotId ogni volta che lo stato cambia (debounce 600ms)
  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (state.phase === "generationSelect" || state.phase === "resume") return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveGame(state, activeSlotId);
      refreshSlots();
    }, 600);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state, activeSlotId]);

  // -------------------------------------------------------
  // Funzioni di mutazione stato
  // -------------------------------------------------------

  function update(patch) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function addToTeam(pokemon) {
    setState((prev) => {
      const clampedP = { ...pokemon, level: Math.min(MAX_LEVEL, pokemon.level || 5) };
      if (prev.team.length < MAX_TEAM_SIZE) {
        return { ...prev, team: [...prev.team, clampedP] };
      } else {
        return { ...prev, box: [...prev.box, clampedP] };
      }
    });
  }

  function addBadge(badge) {
    if (!badge) return;
    setState((prev) => ({ ...prev, badges: [...prev.badges, badge] }));
  }

  function addItem(item) {
    setState((prev) => ({ ...prev, items: [...prev.items, item] }));
  }

  function useItem(itemIndex) {
    setState((prev) => {
      const nextItems = [...prev.items];
      nextItems.splice(itemIndex, 1);
      return { ...prev, items: nextItems };
    });
  }

  /**
   * Aumenta il livello della squadra clampando a MAX_LEVEL (100).
   */
  function boostTeam(amount) {
    setState((prev) => {
      const newTeam = prev.team.map((p) => {
        const boostedLevel = Math.min(MAX_LEVEL, p.level + amount);
        const boosted = { ...p, level: boostedLevel };
        return checkEvolution(boosted);
      });
      const evolutions = newTeam.filter((p) => p.evolvedFrom != null);
      const cleanTeam = newTeam.map(({ evolvedFrom, ...rest }) => rest);
      return {
        ...prev,
        team: cleanTeam,
        pendingEvolutions: evolutions,
      };
    });
  }

  function swapPokemon(teamIdx, boxIdx) {
    setState((prev) => {
      const newTeam = [...prev.team];
      const newBox = [...prev.box];
      const temp = newTeam[teamIdx];
      newTeam[teamIdx] = newBox[boxIdx];
      newBox[boxIdx] = temp;
      return { ...prev, team: newTeam, box: newBox };
    });
  }

  function goTo(phase, patch = {}) {
    update({ phase, ...patch });
  }

  // Pokédex callbacks
  function markSeen(id, isShiny = false) {
    setState((prev) => {
      const existing = prev.pokedexRun[id] || {};
      updateHistoricPokedex(id, false, isShiny);
      return {
        ...prev,
        pokedexRun: {
          ...prev.pokedexRun,
          [id]: { seen: true, caught: existing.caught || false, shiny: isShiny || existing.shiny || false },
        },
      };
    });
  }

  function markCaught(id, isShiny = false) {
    setState((prev) => {
      const existing = prev.pokedexRun[id] || {};
      updateHistoricPokedex(id, true, isShiny);
      return {
        ...prev,
        pokedexRun: {
          ...prev.pokedexRun,
          [id]: { seen: true, caught: true, shiny: isShiny || existing.shiny || false },
        },
      };
    });
  }

  // -------------------------------------------------------
  // Slot management handlers
  // -------------------------------------------------------

  function handleResumeSlot(slotId) {
    const loaded = loadGame(slotId);
    if (loaded) {
      setActiveSlotId(slotId);
      setState({ ...initialState(), ...loaded.state, pokedexOpen: false, boxModalOpen: false });
    }
  }

  function handleNewGameSlot(slotId) {
    deleteSave(slotId);
    setActiveSlotId(slotId);
    refreshSlots();
    setState({ ...initialState(), phase: "generationSelect" });
  }

  function handleDeleteSlot(slotId) {
    deleteSave(slotId);
    refreshSlots();
  }

  function handleExportSlot(slotId) {
    const jsonStr = exportSlotJSON(slotId);
    if (!jsonStr) return;
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pokemon_choice_quest_slot${slotId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportSlot(slotId, jsonContent) {
    const ok = importSlotJSON(slotId, jsonContent);
    if (ok) {
      refreshSlots();
      handleResumeSlot(slotId);
    } else {
      alert("Impossibile importare il salvataggio: file JSON non valido.");
    }
  }

  // -------------------------------------------------------
  // Logica di avanzamento & Scalabilità Difficoltà
  // -------------------------------------------------------

  const generation = state.generationId ? getGeneration(state.generationId) : null;

  // Moltiplicatore di difficoltà basato sul numero di generazioni completate
  const difficultyMult = 1 + (state.completedGensCount || 0) * 0.35;

  function getScaledPower(basePower) {
    return Math.round(basePower * difficultyMult);
  }

  function resolveBattleWin(badge) {
    addBadge(badge);
    boostTeam(WIN_LEVEL_BOOST);
  }

  function advanceAfterGymBattle() {
    const finishedGymIndex = state.gymIndex;
    const nextGymIndex = finishedGymIndex + 1;

    if (
      generation.rival &&
      !state.rivalDone &&
      generation.rival.afterGymIndex === finishedGymIndex
    ) {
      goTo("rivalBattle", { gymIndex: nextGymIndex });
      return;
    }

    if (nextGymIndex >= generation.gymLeaders.length) {
      goTo("eliteBattle", { gymIndex: nextGymIndex, eliteIndex: 0 });
      return;
    }

    goTo("explore", { gymIndex: nextGymIndex });
  }

  function checkNextGeneration() {
    const nextGen = getNextGeneration(state.generationId);
    if (nextGen) {
      goTo("nextGenSelect", { nextGenId: nextGen.id, completedGensCount: (state.completedGensCount || 0) + 1 });
    } else {
      goTo("postgame", { completedGensCount: (state.completedGensCount || 0) + 1 });
    }
  }

  function startPostgameExplore() {
    const lastGen = generation || getGeneration(state.generationId);
    const availableLegendaries = (lastGen?.legendaries || []).filter(
      (id) => !state.caughtLegendaries.includes(id)
    );

    if (availableLegendaries.length > 0 && Math.random() < LEGENDARY_CHANCE) {
      const legendaryId = availableLegendaries[Math.floor(Math.random() * availableLegendaries.length)];
      goTo("legendaryEncounter", {
        pendingEncounterPool: [legendaryId],
        pendingEncounterLevel: Math.min(MAX_LEVEL, 60 + state.postgameRound * 2),
        pendingEncounterIsLegendary: true,
      });
    } else {
      goTo("postgameExplore");
    }
  }

  // -------------------------------------------------------
  // Render condizionale per fase
  // -------------------------------------------------------
  let content;

  if (state.phase === "resume") {
    content = e(ResumeScreen, {
      slots: slotsData,
      selectedSlotId: activeSlotId,
      onSelectSlot: setActiveSlotId,
      onResume: handleResumeSlot,
      onNewGame: handleNewGameSlot,
      onDeleteSlot: handleDeleteSlot,
      onExportSlot: handleExportSlot,
      onImportSlot: handleImportSlot,
    });

  } else if (state.phase === "generationSelect") {
    content = e(GenerationSelectScreen, {
      boxCount: state.box.length,
      onChooseGeneration: (generationId) => goTo("starterSelect", { generationId }),
    });

  } else if (state.phase === "starterSelect") {
    content = e(StartScreen, {
      starterIds: generation.starterIds,
      generationName: generation.name,
      continueTeam: state.multiGenRun ? state.team : null,
      onChooseStarter: (id) => {
        markCaught(id, false); // Auto-registra lo starter scelto nel Pokédex!
        if (state.multiGenRun && state.team.length > 0) {
          // Sposta la squadra precedente nel Box PC per iniziare la regione solo col nuovo starter
          setState((prev) => ({
            ...prev,
            box: [...prev.box, ...prev.team],
            team: [{ id, level: 5 }],
            phase: "explore",
            gymIndex: 0,
          }));
        } else {
          addToTeam({ id, level: 5 });
          goTo("explore", { gymIndex: 0 });
        }
      },
    });

  } else if (state.phase === "nextGenSelect") {
    const nextGen = getGeneration(state.nextGenId);
    content = e(NextGenerationScreen, {
      currentGenName: generation.name,
      nextGenName: nextGen.name,
      team: state.team,
      onContinue: () =>
        goTo("starterSelect", {
          generationId: state.nextGenId,
          gymIndex: 0,
          eliteIndex: 0,
          rivalDone: false,
          badges: [],
          multiGenRun: true,
        }),
    });

  } else if (state.phase === "postgame") {
    content = e(PostgameScreen, {
      lastGenName: generation?.name ?? "Pokémon",
      team: state.team,
      onStart: () => goTo("postgameExplore", { postgameRound: 0 }),
    });

  } else if (state.phase === "postgameExplore") {
    const lastTier = generation
      ? generation.explorationTiers[generation.explorationTiers.length - 1]
      : { grass: [25, 39, 52], fishing: [129, 60], cave: [41, 74], grass2: [63, 92], level: 30 };
    const pgLevel = Math.min(MAX_LEVEL, lastTier.level + state.postgameRound * 5);

    content = e(ChoiceScene, {
      key: `postgame-${state.postgameRound}`,
      title: "Esplorazione libera post-game",
      text: `Continui ad esplorare il mondo Pokémon. I Pokémon selvatici ed avversari sono al massimo della potenza. (Round ${state.postgameRound + 1})`,
      choices: [
        {
          id: "grass",
          label: "🌿 Addentrati nell'erba alta",
          hint: "Pokémon selvatici sempre più forti",
          onSelect: () =>
            goTo("encounter", {
              pendingEncounterPool: lastTier.grass,
              pendingEncounterLevel: pgLevel,
              pendingEncounterIsLegendary: false,
            }),
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
          label: "🦇 Esplora una grotta",
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
        {
          id: "train",
          label: "🏋️‍♂️ Allenamento guidato",
          hint: "La squadra sale di livello (cap Lv100)",
          onSelect: () => {
            boostTeam(2);
            update({ postgameRound: state.postgameRound + 1 });
            setTimeout(() => startPostgameExplore(), 0);
          },
        },
      ],
    });

  } else if (state.phase === "legendaryEncounter") {
    content = e(EncounterScene, {
      key: `legendary-${state.pendingEncounterPool?.[0]}`,
      title: "⭐ Incontro leggendario!",
      text: "Un Pokémon leggendario ti appare davanti! È un momento irripetibile...",
      pool: state.pendingEncounterPool,
      level: state.pendingEncounterLevel,
      isLegendary: true,
      onSeen: markSeen,
      onCaught: markCaught,
      onResolved: ({ caught, pokemon }) => {
        if (caught) {
          addToTeam(pokemon);
          update({
            caughtLegendaries: [...state.caughtLegendaries, pokemon.id],
            postgameRound: state.postgameRound + 1,
          });
        } else {
          update({ postgameRound: state.postgameRound + 1 });
        }
        goTo("postgameExplore");
      },
    });

  } else if (state.phase === "explore") {
    const tier = getExplorationTier(generation, state.gymIndex);
    const nextGymTitle = generation.gymLeaders[state.gymIndex].title;
    const useAltGrass = state.gymIndex % 2 === 1;

    // Habitat tematici per ciascuna generazione
    const firePools = {
      kanto: [37, 58, 100, 81, 77], // Vulpix, Growlithe, Voltorb, Magnemite, Ponyta
      johto: [155, 179, 218, 228, 239], // Cyndaquil, Mareep, Slugma, Houndour, Elekid
      hoenn: [255, 309, 322, 304, 324], // Torchic, Electrike, Numel, Aron, Torkoal
      sinnoh: [390, 403, 240, 436, 479], // Chimchar, Shinx, Magby, Bronzor, Rotom
      unova: [498, 522, 554, 599, 607], // Tepig, Blitzle, Darumaka, Klink, Litwick
      kalos: [653, 667, 694, 679, 669], // Fennekin, Litleo, Helioptile, Honedge, Flabébé
    };

    const ghostPools = {
      kanto: [92, 63, 96, 35, 39], // Gastly, Abra, Drowzee, Clefairy, Jigglypuff
      johto: [200, 198, 215, 280, 175], // Misdreavus, Murkrow, Sneasel, Ralts, Togepi
      hoenn: [353, 355, 302, 325, 280], // Shuppet, Duskull, Sableye, Spoink, Ralts
      sinnoh: [425, 442, 433, 434, 439], // Drifloon, Spiritomb, Chingling, Stunky, Mime Jr.
      unova: [570, 607, 562, 574, 577], // Zorua, Litwick, Yamask, Gothita, Solosis
      kalos: [708, 710, 677, 682, 684], // Phantump, Pumpkaboo, Espurr, Spritzee, Swirlix
    };

    const icePools = {
      kanto: [124, 131, 90, 142], // Jynx, Lapras, Shellder, Aerodactyl
      johto: [220, 225, 215, 227], // Swinub, Delibird, Sneasel, Skarmory
      hoenn: [361, 363, 378, 374], // Snorunt, Spheal, Regice, Beldum
      sinnoh: [459, 361, 436, 447], // Snover, Snorunt, Bronzor, Riolu
      unova: [582, 613, 615, 624], // Vanillite, Cubchoo, Cryogonal, Pawniard
      kalos: [712, 698, 679, 701], // Bergmite, Amaura, Honedge, Hawlucha
    };

    const fightingPools = {
      kanto: [66, 56, 106, 107, 52], // Machop, Mankey, Hitmonlee, Hitmonchan, Meowth
      johto: [236, 214, 190, 216, 209], // Tyrogue, Heracross, Aipom, Teddiursa, Snubbull
      hoenn: [296, 307, 335, 287, 300], // Makuhita, Meditite, Zangoose, Slakoth, Skitty
      sinnoh: [447, 453, 427, 417, 422], // Riolu, Croagunk, Buneary, Pachirisu, Shellos
      unova: [532, 559, 619, 572, 506], // Timburr, Scraggy, Mienfoo, Minccino, Lillipup
      kalos: [674, 701, 659, 676, 672], // Pancham, Hawlucha, Bunnelby, Furfrou, Skiddo
    };

    // Specie baby/rare per le uova misteriose in base alla gen
    const eggPools = {
      kanto: [133, 131, 147], // Eevee, Lapras, Dratini
      johto: [175, 172, 246], // Togepi, Pichu, Larvitar
      hoenn: [360, 328, 371], // Wynaut, Trapinch, Bagon
      sinnoh: [447, 403, 443], // Riolu, Shinx, Gible
      unova: [570, 559, 610], // Zorua, Scraggy, Axew
      kalos: [677, 704, 714], // Espurr, Goomy, Noibat
    };

    // Costruisce la lista di tutte le opzioni speciali disponibili
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
          const pool = generation.items.cave;
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
        id: "searchItems",
        weight: 0.25,
        label: "🔍 Cercatore di Strumenti & Bacche",
        hint: "Esplora per trovare bacche, pozioni o pietre evolutive",
        onSelect: () => {
          const pool = [...generation.items.cave, ...generation.items.grass];
          const foundItem = pool[Math.floor(Math.random() * pool.length)];
          addItem(foundItem);
          boostTeam(1);
          goTo("gymBattle");
        },
      },
    ];

    // Estrae casualmente 2 eventi speciali tra quelli disponibili
    const rolledSpecials = [];
    const shuffled = [...allSpecialOptions].sort(() => Math.random() - 0.5);
    for (const opt of shuffled) {
      if (Math.random() < opt.weight) {
        rolledSpecials.push(opt);
        if (rolledSpecials.length >= 2) break;
      }
    }
    // Fallback se il tiro di dado non ha estratto abbastanza eventi
    if (rolledSpecials.length < 2) {
      for (const opt of shuffled) {
        if (!rolledSpecials.some((o) => o.id === opt.id)) {
          rolledSpecials.push(opt);
          if (rolledSpecials.length >= 2) break;
        }
      }
    }

    // Le 2 opzioni standard sempre garantite
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

    const exploreChoices = [
      baseGrassChoice,
      ...rolledSpecials,
      baseTrainChoice,
    ];

    content = e(ChoiceScene, {
      key: `explore-${state.gymIndex}`,
      title: state.gymIndex === 0 ? "Il primo bivio" : "Verso la prossima palestra",
      text:
        state.gymIndex === 0
          ? "Lasci il laboratorio del Professore. Le strade intorno si biforcano in modi inaspettati..."
          : `Ti lasci alle spalle l'ultima palestra. Quali opportunità ti riserva il percorso verso "${nextGymTitle}"?`,
      choices: exploreChoices,
    });

  } else if (state.phase === "trainerBattle") {
    const tr = state.pendingTrainer || { title: "Allenatore", teamIds: [16, 19], power: 15 };
    content = e(BattleScene, {
      key: "trainer-battle",
      title: "Battaglia sul percorso",
      text: `${tr.title} ti incrocia lo sguardo e ti sfida a duello!`,
      opponentTitle: tr.title,
      opponentTeamIds: tr.teamIds,
      opponentPower: tr.power,
      team: state.team,
      items: state.items,
      rewardBadge: null,
      onUseItem: useItem,
      onResolved: ({ won }) => {
        if (won) {
          boostTeam(2);
          addItem("Super Pozione");
        }
        goTo("gymBattle");
      },
    });

  } else if (state.phase === "encounter") {
    content = e(EncounterScene, {
      key: `encounter-${state.gymIndex}`,
      title: "Incontro selvaggio",
      text: "Qualcosa si muove tra i cespugli...",
      pool: state.pendingEncounterPool,
      level: state.pendingEncounterLevel,
      isLegendary: state.pendingEncounterIsLegendary,
      onSeen: markSeen,
      onCaught: markCaught,
      onResolved: ({ caught, pokemon }) => {
        if (caught) addToTeam(pokemon);
        goTo("gymBattle");
      },
    });

  } else if (state.phase === "gymBattle") {
    const gym = generation.gymLeaders[state.gymIndex];
    const scaledPower = getScaledPower(gym.opponentPower);
    content = e(BattleScene, {
      key: `gym-${state.gymIndex}`,
      title: `Palestra ${state.gymIndex + 1} di ${generation.gymLeaders.length}`,
      text: `Entri nella palestra. ${gym.title} ti sfida a duello.`,
      opponentTitle: gym.title,
      opponentTeamIds: gym.teamIds,
      opponentPower: scaledPower,
      team: state.team,
      items: state.items,
      rewardBadge: gym.badge,
      onUseItem: useItem,
      onResolved: ({ won }) => {
        if (won) resolveBattleWin(gym.badge);
        advanceAfterGymBattle();
      },
    });

  } else if (state.phase === "rivalBattle") {
    const rival = generation.rival;
    const scaledPower = getScaledPower(rival.opponentPower);
    content = e(BattleScene, {
      key: "rival",
      title: "Sfida a sorpresa",
      text: `${rival.title} ti blocca la strada per una battaglia improvvisata.`,
      opponentTitle: rival.title,
      opponentTeamIds: rival.teamIds,
      opponentPower: scaledPower,
      team: state.team,
      items: state.items,
      rewardBadge: null,
      onUseItem: useItem,
      onResolved: ({ won }) => {
        if (won) resolveBattleWin(null);
        update({ rivalDone: true, phase: "explore" });
      },
    });

  } else if (state.phase === "eliteBattle") {
    const member = generation.eliteFour[state.eliteIndex];
    const scaledPower = getScaledPower(member.opponentPower);
    content = e(BattleScene, {
      key: `elite-${state.eliteIndex}`,
      title: `${member.title} (${state.eliteIndex + 1}/${generation.eliteFour.length})`,
      text: "Sei entrato nella sala dell'Alto Comando. Un membro dopo l'altro, senza tregua.",
      opponentTitle: member.title,
      opponentTeamIds: member.teamIds,
      opponentPower: scaledPower,
      team: state.team,
      items: state.items,
      rewardBadge: null,
      onUseItem: useItem,
      onResolved: ({ won }) => {
        if (won) resolveBattleWin(null);
        const nextEliteIndex = state.eliteIndex + 1;
        if (nextEliteIndex >= generation.eliteFour.length) {
          goTo("championBattle");
        } else {
          goTo("eliteBattle", { eliteIndex: nextEliteIndex });
        }
      },
    });

  } else if (state.phase === "championBattle") {
    const champion = generation.champion;
    const scaledPower = getScaledPower(champion.opponentPower);
    content = e(BattleScene, {
      key: "champion",
      title: "Sfida finale: il Campione",
      text: `Davanti a te, l'ultimo ostacolo: ${champion.title}.`,
      opponentTitle: champion.title,
      opponentTeamIds: champion.teamIds,
      opponentPower: scaledPower,
      team: state.team,
      items: state.items,
      rewardBadge: champion.badge,
      onUseItem: useItem,
      onResolved: ({ won }) => {
        if (won) resolveBattleWin(champion.badge);
        checkNextGeneration();
      },
    });

  } else if (state.phase === "end") {
    content = e(EndScreen, {
      team: state.team,
      badges: state.badges,
      onRestart: () => {
        deleteSave(activeSlotId);
        setState(initialState());
      },
    });
  }

  // -------------------------------------------------------
  // Barra di avanzamento
  // -------------------------------------------------------
  const totalMilestones = generation
    ? generation.gymLeaders.length + generation.eliteFour.length + 1
    : 1;
  let completedMilestones = 0;
  if (generation) {
    completedMilestones = Math.min(state.gymIndex, generation.gymLeaders.length);
    if (
      state.phase === "eliteBattle" ||
      state.phase === "championBattle" ||
      state.phase === "end"
    ) {
      completedMilestones =
        generation.gymLeaders.length +
        Math.min(state.eliteIndex, generation.eliteFour.length);
    }
    if (state.phase === "end" || state.phase === "postgame" || state.phase === "postgameExplore") {
      completedMilestones = totalMilestones;
    }
  }
  const progressPct = Math.round((completedMilestones / totalMilestones) * 100);

  const showSidebar = state.phase !== "generationSelect" && state.phase !== "resume" && state.phase !== "nextGenSelect" && state.phase !== "postgame";

  function handleDismissEvolutions(rejectedList) {
    setState((prev) => {
      let updatedTeam = [...prev.team];
      const rejectedIds = new Set((rejectedList || []).map((r) => r.id));

      const updatedPokedexRun = { ...prev.pokedexRun };
      for (const evo of prev.pendingEvolutions || []) {
        if (!rejectedIds.has(evo.id)) {
          updateHistoricPokedex(evo.id, true, evo.isShiny);
          updatedPokedexRun[evo.id] = {
            seen: true,
            caught: true,
            shiny: evo.isShiny || updatedPokedexRun[evo.id]?.shiny || false,
          };
        }
      }

      if (rejectedList && rejectedList.length > 0) {
        for (const rej of rejectedList) {
          const idx = updatedTeam.findIndex((p) => p.id === rej.id);
          if (idx !== -1) {
            updatedTeam[idx] = { ...updatedTeam[idx], id: rej.evolvedFrom };
          }
        }
      }
      return {
        ...prev,
        team: updatedTeam,
        pokedexRun: updatedPokedexRun,
        pendingEvolutions: [],
      };
    });
  }

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return e(
    React.Fragment,
    null,

    // Overlay Evoluzioni
    state.pendingEvolutions && state.pendingEvolutions.length > 0 &&
      e(EvolutionNotice, {
        evolutions: state.pendingEvolutions,
        onDismiss: handleDismissEvolutions,
      }),

    // Pokédex modale
    state.pokedexOpen &&
      e(PokedexModal, {
        pokedexRun: state.pokedexRun,
        onClose: () => update({ pokedexOpen: false }),
      }),

    // Box modale
    state.boxModalOpen &&
      e(BoxModal, {
        team: state.team,
        box: state.box,
        onSwap: swapPokemon,
        onClose: () => update({ boxModalOpen: false }),
      }),

    // Header
    e(
      "header",
      { className: "app-header" },
      e("h1", null, "Pokémon: Scegli il Cammino"),
      e(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" } },
        e(
          "span",
          { className: "subtitle" },
          generation
            ? `${generation.name} — guidato dalle tue scelte`
            : "Ispirato a Pokemon Roulette, ma guidato dalle tue scelte"
        ),
        // Pulsante Pokédex
        state.phase !== "generationSelect" && state.phase !== "resume" &&
          e(
            "button",
            {
              className: "pokedex-header-btn",
              onClick: () => update({ pokedexOpen: true }),
              title: "Apri il Pokédex",
            },
            "📖 Pokédex"
          )
      )
    ),

    // Barra avanzamento
    e("div", { className: "progress-bar" }, e("div", { style: { width: `${progressPct}%` } })),

    // Layout principale
    e(
      "div",
      { className: showSidebar ? "layout" : "layout layout-full" },
      content,
      showSidebar &&
        e(TeamPanel, {
          team: state.team,
          box: state.box,
          badges: state.badges,
          items: state.items,
          onOpenBox: () => update({ boxModalOpen: true }),
        })
    ),

    e(
      "p",
      { className: "footer-note" },
      "Demo — dati e sprite dei Pokémon forniti da PokeAPI (pokeapi.co)."
    )
  );
}
