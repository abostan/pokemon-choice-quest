import React from "react";
import { TeamPanel } from "./components/TeamPanel.js";
import { PokedexModal } from "./components/PokedexModal.js";
import { EvolutionNotice } from "./components/EvolutionNotice.js";
import { BoxModal } from "./components/BoxModal.js";
import { HallOfFameModal } from "./components/HallOfFameModal.js";
import { ScoreCardModal } from "./components/ScoreCardModal.js";
import { SceneRouter } from "./components/SceneRouter.js";
import { useGameState, initialState } from "./hooks/useGameState.js";
import { updateHistoricPokedex } from "./engine/saveGame.js";

const e = React.createElement;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return e(
        "div",
        { className: "panel", style: { textAlign: "center", margin: "40px auto", maxWidth: "500px" } },
        e("h2", { style: { color: "var(--danger)" } }, "⚠️ Si è verificato un errore"),
        e("p", { className: "scene-text" }, "La schermata ha riscontrato un problema imprevisto."),
        e(
          "button",
          {
            className: "continue-btn",
            style: { background: "var(--accent)", color: "#1a1a1a" },
            onClick: () => {
              this.setState({ hasError: false });
              if (this.props.onReset) this.props.onReset();
            },
          },
          "🏠 Torna alla Homepage"
        )
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const game = useGameState();
  const {
    state,
    setState,
    update,
    goTo,
    muted,
    handleToggleAudio,
    swapPokemon,
    generation,
  } = game;

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

  const showSidebar =
    state.phase !== "generationSelect" &&
    state.phase !== "resume" &&
    state.phase !== "nextGenSelect" &&
    state.phase !== "postgame";

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
        onWithdraw: game.withdrawFromBox,
        onDeposit: game.depositToBox,
        onClose: () => update({ boxModalOpen: false }),
      }),

    // Sala della Fama modale
    state.hallOfFameOpen &&
      e(HallOfFameModal, {
        onClose: () => update({ hallOfFameOpen: false }),
      }),

    // Scheda Punteggio & Grado modale
    state.scoreModalOpen &&
      e(ScoreCardModal, {
        gameState: state,
        onClose: () => update({ scoreModalOpen: false }),
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
        // Pulsanti Header: Audio, Home, Pokédex, Sala della Fama e Punteggio
        state.phase !== "generationSelect" && state.phase !== "resume" &&
          e(
            "div",
            { style: { display: "flex", gap: "8px" } },
            e(
              "button",
              {
                className: "pokedex-header-btn",
                style: {
                  background: muted ? "linear-gradient(135deg, #881337, #4c0519)" : "linear-gradient(135deg, #15803d, #14532d)",
                  border: muted ? "1px solid #f43f5e" : "1px solid #4ade80",
                },
                onClick: handleToggleAudio,
                title: muted ? "Attiva audio retro 8-bit" : "Disattiva audio retro 8-bit",
              },
              muted ? "🔇 Audio Off" : "🔊 Audio On"
            ),
            e(
              "button",
              {
                className: "pokedex-header-btn",
                style: { background: "linear-gradient(135deg, #4b5563, #374151)", border: "1px solid #6b7280" },
                onClick: () => goTo("resume"),
                title: "Torna al Menu Principale / Homepage",
              },
              "🏠 Home"
            ),
            e(
              "button",
              {
                className: "pokedex-header-btn",
                onClick: () => update({ pokedexOpen: true }),
                title: "Apri il Pokédex",
              },
              "📖 Pokédex"
            ),
            e(
              "button",
              {
                className: "pokedex-header-btn",
                style: { background: "linear-gradient(135deg, #d97706, #92400e)", border: "1px solid #f59e0b" },
                onClick: () => update({ hallOfFameOpen: true }),
                title: "Apri la Sala della Fama",
              },
              "🏆 Sala della Fama"
            ),
            e(
              "button",
              {
                className: "pokedex-header-btn",
                style: { background: "linear-gradient(135deg, #0284c7, #0369a1)", border: "1px solid #38bdf8" },
                onClick: () => update({ scoreModalOpen: true }),
                title: "Vedi Punteggio & Grado",
              },
              "📊 Punteggio"
            )
          )
      )
    ),

    // Barra avanzamento
    e("div", { className: "progress-bar" }, e("div", { style: { width: `${progressPct}%` } })),

    // Layout principale con SceneRouter
    e(
      "div",
      { className: showSidebar ? "layout" : "layout layout-full" },
      e(
        ErrorBoundary,
        { onReset: () => setState({ ...initialState(), phase: "resume" }) },
        e(SceneRouter, { game })
      ),
      showSidebar &&
        e(TeamPanel, {
          team: state.team,
          box: state.box,
          badges: state.badges,
          items: state.items,
          coins: state.coins || 0,
          isNuzlocke: state.isNuzlocke,
          activeMega: state.activeMega,
          activeTerastal: state.activeTerastal,
          activeItemBoost: state.activeItemBoost,
          onOpenBox: () => update({ boxModalOpen: true }),
          onSwapTeamPosition: game.swapTeamPosition,
        })
    ),

    e(
      "p",
      { className: "footer-note" },
      "Demo — dati e sprite dei Pokémon forniti da PokeAPI (pokeapi.co)."
    )
  );
}
