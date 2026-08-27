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
import { BadgesModal } from "./components/BadgesModal.js";
import { SceneRouter } from "./components/SceneRouter.js";
import { MilestoneProgressBar } from "./components/MilestoneProgressBar.js";
import { useGameState, initialState } from "./hooks/useGameState.js";
import { updateHistoricPokedex } from "./engine/saveGame.js";
import { unlockAchievement } from "./engine/achievements.js";
import { AchievementToast } from "./components/AchievementToast.js";

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
  const [showBadges, setShowBadges] = React.useState(false);

  // Menu "⋯ Altro" a tendina: solo le azioni pinnate (Audio, Home, Pokédex,
  // Impostazioni) restano sempre visibili nell'header; le altre (Trofei,
  // Come si gioca, Sala della Fama, Punteggio) finiscono qui invece di
  // affollare la riga con un pulsante colorato ciascuna.
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const moreMenuRef = React.useRef(null);

  React.useEffect(() => {
    if (!moreMenuOpen) return;
    function handleOutside(ev) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(ev.target)) setMoreMenuOpen(false);
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [moreMenuOpen]);

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
          unlockAchievement("firstEvolution");
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

    // Toast trofei sbloccati, sempre montato indipendentemente dalla scena
    e(AchievementToast, null),

    // Onboarding modale (primo avvio, o riaperto manualmente)
    showOnboarding && e(OnboardingModal, { onClose: dismissOnboarding }),

    // Impostazioni modale
    showSettings && e(SettingsModal, { onClose: () => setShowSettings(false) }),

    // Medagliere Trofei modale
    showAchievements && e(AchievementsModal, { onClose: () => setShowAchievements(false) }),

    // Tutte le Medaglie modale (storico multi-regione)
    showBadges &&
      e(BadgesModal, {
        badges: state.badges,
        badgesByGeneration: state.badgesByGeneration,
        currentGenerationId: state.generationId,
        onClose: () => setShowBadges(false),
      }),

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
        regionalDexName: generation?.regionalDex ?? null,
        regionName: generation?.name ?? null,
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
        // Pulsanti Header: solo Audio, Home, Pokédex e Impostazioni restano
        // pinnati in vista — sono le azioni toccate quasi ogni sessione.
        // Trofei, Come si gioca, Sala della Fama e Punteggio (usati una
        // tantum) finiscono nel menu "⋯ Altro" invece di occupare la riga
        // con un pulsante colorato ciascuno.
        state.phase !== "generationSelect" && state.phase !== "resume" &&
          (() => {
            const pinnedButtons = [
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
                style: null,
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
                style: null,
                onClick: () => setShowSettings(true),
                title: "Impostazioni",
              },
            ];

            const moreButtons = [
              {
                key: "achievements",
                label: "🏆 Trofei",
                onClick: () => setShowAchievements(true),
                title: "Medagliere Trofei",
              },
              {
                key: "onboarding",
                label: "❓ Come si gioca",
                onClick: () => setShowOnboarding(true),
                title: "Come si gioca",
              },
              {
                key: "hof",
                label: "🏆 Sala della Fama",
                onClick: () => update({ hallOfFameOpen: true }),
                title: "Apri la Sala della Fama",
              },
              {
                key: "score",
                label: "📊 Punteggio",
                onClick: () => update({ scoreModalOpen: true }),
                title: "Vedi Punteggio & Grado",
              },
            ];

            return e(
              "div",
              { style: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" } },
              pinnedButtons.map((btn) =>
                e(
                  "button",
                  { key: btn.key, className: "pokedex-header-btn", style: btn.style, onClick: btn.onClick, title: btn.title },
                  btn.label
                )
              ),
              e(
                "div",
                { className: "header-more-menu", ref: moreMenuRef },
                e(
                  "button",
                  {
                    className: "pokedex-header-btn header-menu-toggle",
                    onClick: () => setMoreMenuOpen((o) => !o),
                    "aria-expanded": moreMenuOpen,
                    "aria-label": "Altro",
                  },
                  "⋯ Altro"
                ),
                moreMenuOpen &&
                  e(
                    "div",
                    { className: "header-menu-dropdown" },
                    moreButtons.map((btn) =>
                      e(
                        "button",
                        {
                          key: btn.key,
                          className: "pokedex-header-btn",
                          onClick: () => {
                            btn.onClick();
                            setMoreMenuOpen(false);
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

    // Barra avanzamento a tappe (8 palestre + 4 Alto Comando + Campione,
    // un'icona per tipo avversario al posto della singola barra piatta)
    state.phase !== "generationSelect" &&
      state.phase !== "resume" &&
      e(MilestoneProgressBar, { generation, completedMilestones, totalMilestones }),

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
          onOpenBadges: () => setShowBadges(true),
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
