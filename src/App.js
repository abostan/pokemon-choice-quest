import React from "react";
import { TeamPanel } from "./components/TeamPanel.js";
import { PokedexModal } from "./components/PokedexModal.js";
import { EvolutionNotice } from "./components/EvolutionNotice.js";
import { BoxModal } from "./components/BoxModal.js";
import { HallOfFameModal } from "./components/HallOfFameModal.js";
import { ScoreCardModal } from "./components/ScoreCardModal.js";
import { OnboardingModal } from "./components/OnboardingModal.js";
import { SettingsModal } from "./components/SettingsModal.js";
import { AchievementsModal } from "./components/AchievementsModal.js";
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

  // Onboarding: mostrato una sola volta al primissimo avvio (flag globale in
  // localStorage, indipendente dagli slot di salvataggio — non è uno stato
  // di gioco, è "hai già visto la spiegazione su questo browser?"). Riapribile
  // in ogni momento dal pulsante "❓ Come si gioca" nell'header.
  const [showOnboarding, setShowOnboarding] = React.useState(() => {
    try {
      return !localStorage.getItem("pcq_onboarding_seen");
    } catch {
      return false;
    }
  });

  function dismissOnboarding() {
    try {
      localStorage.setItem("pcq_onboarding_seen", "1");
    } catch {
      // localStorage non disponibile: va bene lo stesso, semplicemente
      // ricomparirà al prossimo avvio invece di restare chiuso per sempre.
    }
    setShowOnboarding(false);
  }

  // Impostazioni: anche questo è un pannello globale al browser (come
  // l'onboarding), non legato ad uno slot di salvataggio.
  const [showSettings, setShowSettings] = React.useState(false);
  const [showAchievements, setShowAchievements] = React.useState(false);

  // Menu header mobile a tendina: sotto un certo numero di pulsanti (ora 8)
  // la fila orizzontale diventa ingombrante su schermi stretti anche con il
  // flexWrap già presente — sotto i 640px li raggruppiamo in un menu "☰"
  // (vedi ROADMAP.md Fase 5, "Header Responsive Compatto Mobile").
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const mobileMenuRef = React.useRef(null);

  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleOutside(ev) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(ev.target)) setMobileMenuOpen(false);
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [mobileMenuOpen]);

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

    // Onboarding modale (primo avvio, o riaperto manualmente)
    showOnboarding && e(OnboardingModal, { onClose: dismissOnboarding }),

    // Impostazioni modale
    showSettings && e(SettingsModal, { onClose: () => setShowSettings(false) }),

    // Medagliere Trofei modale
    showAchievements && e(AchievementsModal, { onClose: () => setShowAchievements(false) }),

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
        // Pulsanti Header: Audio, Home, Pokédex, Impostazioni, Trofei,
        // Onboarding, Sala della Fama e Punteggio. Definiti una volta sola e
        // renderizzati in due modi (fila desktop / menu a tendina mobile,
        // vedi sotto) invece di duplicare il markup.
        state.phase !== "generationSelect" && state.phase !== "resume" &&
          (() => {
            const headerButtons = [
              {
                key: "audio",
                label: muted ? "🔇 Audio Off" : "🔊 Audio On",
                style: {
                  background: muted ? "linear-gradient(135deg, #881337, #4c0519)" : "linear-gradient(135deg, #15803d, #14532d)",
                  border: muted ? "1px solid #f43f5e" : "1px solid #4ade80",
                },
                onClick: handleToggleAudio,
                title: muted ? "Attiva audio retro 8-bit" : "Disattiva audio retro 8-bit",
              },
              {
                key: "home",
                label: "🏠 Home",
                style: { background: "linear-gradient(135deg, #4b5563, #374151)", border: "1px solid #6b7280" },
                onClick: () => goTo("resume"),
                title: "Torna al Menu Principale / Homepage",
              },
              {
                key: "pokedex",
                label: "📖 Pokédex",
                style: null,
                onClick: () => update({ pokedexOpen: true }),
                title: "Apri il Pokédex",
              },
              {
                key: "settings",
                label: "⚙️ Impostazioni",
                style: { background: "linear-gradient(135deg, #4b5563, #374151)", border: "1px solid #6b7280" },
                onClick: () => setShowSettings(true),
                title: "Impostazioni",
              },
              {
                key: "achievements",
                label: "🏆 Trofei",
                style: { background: "linear-gradient(135deg, #b45309, #78350f)", border: "1px solid var(--gold)" },
                onClick: () => setShowAchievements(true),
                title: "Medagliere Trofei",
              },
              {
                key: "onboarding",
                label: "❓ Come si gioca",
                style: { background: "linear-gradient(135deg, #4b5563, #374151)", border: "1px solid #6b7280" },
                onClick: () => setShowOnboarding(true),
                title: "Come si gioca",
              },
              {
                key: "hof",
                label: "🏆 Sala della Fama",
                style: { background: "linear-gradient(135deg, #d97706, #92400e)", border: "1px solid #f59e0b" },
                onClick: () => update({ hallOfFameOpen: true }),
                title: "Apri la Sala della Fama",
              },
              {
                key: "score",
                label: "📊 Punteggio",
                style: { background: "linear-gradient(135deg, #0284c7, #0369a1)", border: "1px solid #38bdf8" },
                onClick: () => update({ scoreModalOpen: true }),
                title: "Vedi Punteggio & Grado",
              },
            ];

            return e(
              React.Fragment,
              null,
              // Fila completa: visibile da tablet in su, nascosta sotto i 640px (CSS)
              e(
                "div",
                { className: "header-actions-full", style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
                headerButtons.map((btn) =>
                  e(
                    "button",
                    { key: btn.key, className: "pokedex-header-btn", style: btn.style, onClick: btn.onClick, title: btn.title },
                    btn.label
                  )
                )
              ),
              // Menu "☰" a tendina: nascosto da tablet in su, visibile sotto i 640px (CSS)
              e(
                "div",
                { className: "header-menu-mobile", ref: mobileMenuRef },
                e(
                  "button",
                  {
                    className: "pokedex-header-btn header-menu-toggle",
                    onClick: () => setMobileMenuOpen((o) => !o),
                    "aria-expanded": mobileMenuOpen,
                    "aria-label": "Menu",
                  },
                  "☰ Menu"
                ),
                mobileMenuOpen &&
                  e(
                    "div",
                    { className: "header-menu-dropdown" },
                    headerButtons.map((btn) =>
                      e(
                        "button",
                        {
                          key: btn.key,
                          className: "pokedex-header-btn",
                          style: btn.style,
                          onClick: () => {
                            btn.onClick();
                            setMobileMenuOpen(false);
                          },
                          title: btn.title,
                        },
                        btn.label
                      )
                    )
                  )
              )
            );
          })()
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
          isRandomizer: state.isRandomizer,
          monoType: state.monoType,
          activeMega: state.activeMega,
          activeTerastal: state.activeTerastal,
          activeItemBoost: state.activeItemBoost,
          activeWeather: state.activeWeather,
          teamFatigued: state.teamFatigued,
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
