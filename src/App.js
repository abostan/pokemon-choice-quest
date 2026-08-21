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
        addToTeam({ id, level: 5 });
        goTo("explore", { gymIndex: 0 });
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

    content = e(ChoiceScene, {
      key: `explore-${state.gymIndex}`,
      title: state.gymIndex === 0 ? "Il primo bivio" : "Verso la prossima palestra",
      text:
        state.gymIndex === 0
          ? "Lasci il laboratorio del Professore. Davanti a te la strada si divide: puoi esplorare, sfidare allenatori o raccogliere strumenti."
          : `Ti lasci alle spalle l'ultima palestra. Prima di affrontare "${nextGymTitle}", come vuoi prepararti?`,
      choices: [
        {
          id: "grass",
          label: useAltGrass ? "🌿 Esplora un nuovo sentiero erboso" : "🌿 Addentrati nell'erba alta",
          hint: "Incontra Pokémon selvatici locali",
          onSelect: () =>
            goTo("encounter", {
              pendingEncounterPool: useAltGrass ? tier.grass2 : tier.grass,
              pendingEncounterLevel: tier.level,
              pendingEncounterIsLegendary: false,
            }),
        },
        {
          id: "fish",
          label: "🎣 Vai a pescare sul fiume",
          hint: "I Pokémon d'acqua abbondano da queste parti",
          onSelect: () =>
            goTo("encounter", {
              pendingEncounterPool: tier.fishing,
              pendingEncounterLevel: tier.level,
              pendingEncounterIsLegendary: false,
            }),
        },
        {
          id: "cave",
          label: "🦇 Esplora una grotta vicina",
          hint: "Pokémon di tipo roccia/buio e uno strumento da trovare",
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
          id: "trainer",
          label: "⚔️ Sfida un Allenatore sul percorso",
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
          label: "🔍 Cercatore di Strumenti",
          hint: "Esplora per trovare bacche, pozioni o pietre evolutive",
          onSelect: () => {
            const pool = [...generation.items.cave, ...generation.items.grass];
            const foundItem = pool[Math.floor(Math.random() * pool.length)];
            addItem(foundItem);
            boostTeam(1);
            goTo("gymBattle");
          },
        },
        {
          id: "train",
          label: "🏋️‍♂️ Allenamento intensivo",
          hint: "Nessun Pokémon selvatico, ma la squadra guadagna +2 Livelli",
          onSelect: () => {
            boostTeam(2);
            goTo("gymBattle");
          },
        },
      ],
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
