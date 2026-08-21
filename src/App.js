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
import { saveGame, loadGame, hasSave, deleteSave, updateHistoricPokedex } from "./engine/saveGame.js";

const e = React.createElement;

// Quanti livelli guadagna l'intera squadra dopo aver vinto una battaglia
// importante (palestra, Rivale, Alto Comando, Campione).
const WIN_LEVEL_BOOST = 3;

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

    // --- Multi-generazione e post-game ---
    multiGenRun: false,
    postgameRound: 0,

    // --- Pokédex ---
    pokedexRun: {},
    pokedexOpen: false,

    // --- Evoluzioni in attesa di notifica ---
    pendingEvolutions: [],

    // --- Leggendari catturati (non rispawnano) ---
    caughtLegendaries: [],

    // --- UI ---
    boxModalOpen: false,
  };
}

export default function App() {
  // Controlla se esiste un salvataggio all'avvio
  const [saveData] = useState(() => loadGame());
  const [state, setState] = useState(() => {
    // Se c'è un salvataggio, mostra prima la ResumeScreen
    if (loadGame()) {
      return { ...initialState(), phase: "resume" };
    }
    return initialState();
  });

  // Auto-save: salva ogni volta che lo stato cambia (con debounce 600ms)
  const saveTimerRef = useRef(null);
  useEffect(() => {
    // Non salvare nelle fasi di scelta iniziale o nel menu resume
    if (state.phase === "generationSelect" || state.phase === "resume") return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveGame(state);
    }, 600);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  // -------------------------------------------------------
  // Funzioni di mutazione stato
  // -------------------------------------------------------

  function update(patch) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function addToTeam(pokemon) {
    setState((prev) => {
      if (prev.team.length < MAX_TEAM_SIZE) {
        return { ...prev, team: [...prev.team, pokemon] };
      } else {
        return { ...prev, box: [...prev.box, pokemon] };
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

  /**
   * Aumenta il livello di tutti i Pokémon del team e controlla le evoluzioni.
   * Se ci sono evoluzioni, le accumula in pendingEvolutions per mostrarle.
   */
  function boostTeam(amount) {
    setState((prev) => {
      const newTeam = prev.team.map((p) => {
        const boosted = { ...p, level: p.level + amount };
        return checkEvolution(boosted);
      });
      const evolutions = newTeam.filter((p) => p.evolvedFrom != null);
      // Pulisci il flag evolvedFrom dopo averlo registrato
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
  function markSeen(id) {
    setState((prev) => {
      if (prev.pokedexRun[id]) return prev; // già registrato
      updateHistoricPokedex(id, false);
      return {
        ...prev,
        pokedexRun: { ...prev.pokedexRun, [id]: { seen: true, caught: false } },
      };
    });
  }

  function markCaught(id) {
    setState((prev) => {
      updateHistoricPokedex(id, true);
      return {
        ...prev,
        pokedexRun: {
          ...prev.pokedexRun,
          [id]: { seen: true, caught: true },
        },
      };
    });
  }

  // -------------------------------------------------------
  // Logica di avanzamento
  // -------------------------------------------------------

  const generation = state.generationId ? getGeneration(state.generationId) : null;

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

  /**
   * Chiamata dopo aver sconfitto il Campione.
   * Decide se passare alla generazione successiva, alla modalità infinita, o alla fine.
   */
  function checkNextGeneration() {
    const nextGen = getNextGeneration(state.generationId);
    if (nextGen) {
      goTo("nextGenSelect", { nextGenId: nextGen.id });
    } else {
      goTo("postgame");
    }
  }

  /**
   * Gestisce un round di esplorazione post-game.
   * 5% di probabilità di incontro con un leggendario non ancora catturato.
   */
  function startPostgameExplore() {
    const lastGen = generation || getGeneration(state.generationId);
    const availableLegendaries = (lastGen?.legendaries || []).filter(
      (id) => !state.caughtLegendaries.includes(id)
    );

    if (availableLegendaries.length > 0 && Math.random() < LEGENDARY_CHANCE) {
      const legendaryId = availableLegendaries[Math.floor(Math.random() * availableLegendaries.length)];
      goTo("legendaryEncounter", {
        pendingEncounterPool: [legendaryId],
        pendingEncounterLevel: 60 + state.postgameRound * 2,
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
    const saved = loadGame();
    content = e(ResumeScreen, {
      savedAt: saved?.savedAt ?? new Date().toISOString(),
      savedState: saved?.state ?? {},
      onResume: () => {
        const loaded = loadGame();
        if (loaded) {
          setState({ ...initialState(), ...loaded.state, pokedexOpen: false, boxModalOpen: false });
        } else {
          setState(initialState());
        }
      },
      onNewGame: () => {
        deleteSave();
        setState(initialState());
      },
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
          badges: [],         // medaglie azzerate per la nuova regione
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
    const pgLevel = lastTier.level + state.postgameRound * 5;

    content = e(ChoiceScene, {
      key: `postgame-${state.postgameRound}`,
      title: "Esplorazione libera",
      text: `Continui ad esplorare il mondo Pokémon. I Pokémon selvatici sono sempre più forti. (Round ${state.postgameRound + 1})`,
      choices: [
        {
          id: "grass",
          label: "Addentrati nell'erba alta",
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
          label: "Vai a pescare",
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
          label: "Esplora una grotta",
          hint: "Pokémon insoliti e possibile oggetto",
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
          id: "train",
          label: "Allenati",
          hint: "La squadra sale di livello",
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
          ? "Lasci il laboratorio del Professore. Davanti a te la strada si divide: puoi esplorare, oppure prepararti in altro modo."
          : `Ti lasci alle spalle l'ultima palestra. Prima di affrontare "${nextGymTitle}", come vuoi prepararti?`,
      choices: [
        {
          id: "grass",
          label: useAltGrass ? "Esplora un nuovo sentiero erboso" : "Addentrati nell'erba alta",
          hint: "Potresti incontrare un Pokémon selvatico",
          onSelect: () =>
            goTo("encounter", {
              pendingEncounterPool: useAltGrass ? tier.grass2 : tier.grass,
              pendingEncounterLevel: tier.level,
              pendingEncounterIsLegendary: false,
            }),
        },
        {
          id: "fish",
          label: "Vai a pescare",
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
          label: "Esplora una grotta vicina",
          hint: "Pokémon più insoliti, e forse un oggetto da trovare",
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
          id: "train",
          label: "Fermati ad allenare la squadra",
          hint: "Nessun nuovo Pokémon, ma la squadra sale di livello",
          onSelect: () => {
            boostTeam(2);
            goTo("gymBattle");
          },
        },
      ],
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
    content = e(BattleScene, {
      key: `gym-${state.gymIndex}`,
      title: `Palestra ${state.gymIndex + 1} di ${generation.gymLeaders.length}`,
      text: `Entri nella palestra. ${gym.title} ti sfida a duello.`,
      opponentTitle: gym.title,
      opponentTeamIds: gym.teamIds,
      opponentPower: gym.opponentPower,
      team: state.team,
      rewardBadge: gym.badge,
      onResolved: ({ won }) => {
        if (won) resolveBattleWin(gym.badge);
        advanceAfterGymBattle();
      },
    });

  } else if (state.phase === "rivalBattle") {
    const rival = generation.rival;
    content = e(BattleScene, {
      key: "rival",
      title: "Sfida a sorpresa",
      text: `${rival.title} ti blocca la strada per una battaglia improvvisata.`,
      opponentTitle: rival.title,
      opponentTeamIds: rival.teamIds,
      opponentPower: rival.opponentPower,
      team: state.team,
      rewardBadge: null,
      onResolved: ({ won }) => {
        if (won) resolveBattleWin(null);
        update({ rivalDone: true, phase: "explore" });
      },
    });

  } else if (state.phase === "eliteBattle") {
    const member = generation.eliteFour[state.eliteIndex];
    content = e(BattleScene, {
      key: `elite-${state.eliteIndex}`,
      title: `${member.title} (${state.eliteIndex + 1}/${generation.eliteFour.length})`,
      text: "Sei entrato nella sala dell'Alto Comando. Un membro dopo l'altro, senza tregua.",
      opponentTitle: member.title,
      opponentTeamIds: member.teamIds,
      opponentPower: member.opponentPower,
      team: state.team,
      rewardBadge: null,
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
    content = e(BattleScene, {
      key: "champion",
      title: "Sfida finale: il Campione",
      text: `Davanti a te, l'ultimo ostacolo: ${champion.title}.`,
      opponentTitle: champion.title,
      opponentTeamIds: champion.teamIds,
      opponentPower: champion.opponentPower,
      team: state.team,
      rewardBadge: champion.badge,
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
        deleteSave();
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
        // Pulsante Pokédex (visibile durante il gioco)
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
