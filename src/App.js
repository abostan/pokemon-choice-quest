import React, { useState } from "react";
import { StartScreen } from "./components/StartScreen.js";
import { ChoiceScene } from "./components/ChoiceScene.js";
import { EncounterScene } from "./components/EncounterScene.js";
import { BattleScene } from "./components/BattleScene.js";
import { EndScreen } from "./components/EndScreen.js";
import { TeamPanel } from "./components/TeamPanel.js";
import {
  ROUTE1_GRASS_WILD_IDS,
  ROUTE1_FISHING_WILD_IDS,
  ROUTE2_CAVE_WILD_IDS,
  ROUTE2_GRASS_WILD_IDS,
  GYM1,
  RIVAL,
  ITEMS_FOUND_IN_CAVE,
  ITEMS_FOUND_IN_GRASS,
} from "./data/pools.js";

const e = React.createElement;

// Ordine "canonico" delle fasi, usato solo per calcolare la barra di
// avanzamento in alto: il percorso reale può saltare encounter1/encounter2
// a seconda delle scelte del giocatore, ma va sempre avanti in quest'ordine.
const STAGE_ORDER = ["start", "route1", "encounter1", "gym1", "route2", "encounter2", "finalBattle", "end"];

function initialState() {
  return {
    stage: "start",
    team: [],
    badges: [],
    items: [],
    // parametri decisi dalle scelte del giocatore, usati per personalizzare
    // il testo/i bivi successivi
    pendingEncounterPool: null,
    pendingEncounterLevel: 4,
  };
}

export default function App() {
  const [state, setState] = useState(initialState);

  function update(patch) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function addToTeam(pokemon) {
    setState((prev) => ({ ...prev, team: [...prev.team, pokemon] }));
  }

  function addBadge(badge) {
    setState((prev) => ({ ...prev, badges: [...prev.badges, badge] }));
  }

  function addItem(item) {
    setState((prev) => ({ ...prev, items: [...prev.items, item] }));
  }

  function boostTeam(amount) {
    setState((prev) => ({
      ...prev,
      team: prev.team.map((p) => ({ ...p, level: p.level + amount })),
    }));
  }

  function goTo(stage, patch = {}) {
    update({ stage, ...patch });
  }

  let content;

  if (state.stage === "start") {
    content = e(StartScreen, {
      onChooseStarter: (id) => {
        addToTeam({ id, level: 5 });
        goTo("route1");
      },
    });
  } else if (state.stage === "route1") {
    content = e(ChoiceScene, {
      title: "Il primo bivio",
      text: "Lasci il laboratorio del Professore. Davanti a te la strada si divide: puoi esplorare, oppure andare dritto verso la prima palestra.",
      choices: [
        {
          id: "grass",
          label: "Addentrati nell'erba alta",
          hint: "Potresti incontrare un Pokémon selvatico",
          onSelect: () =>
            goTo("encounter1", { pendingEncounterPool: ROUTE1_GRASS_WILD_IDS, pendingEncounterLevel: 4 }),
        },
        {
          id: "fish",
          label: "Vai a pescare al fiume",
          hint: "I Pokémon d'acqua abbondano da queste parti",
          onSelect: () =>
            goTo("encounter1", { pendingEncounterPool: ROUTE1_FISHING_WILD_IDS, pendingEncounterLevel: 4 }),
        },
        {
          id: "skip",
          label: "Vai dritto alla prima palestra",
          hint: "Più veloce, ma affronterai la palestra con una squadra più piccola",
          onSelect: () => goTo("gym1"),
        },
      ],
    });
  } else if (state.stage === "encounter1") {
    content = e(EncounterScene, {
      title: "Incontro selvaggio",
      text: "Qualcosa si muove tra i cespugli...",
      pool: state.pendingEncounterPool,
      level: state.pendingEncounterLevel,
      onResolved: ({ caught, pokemon }) => {
        if (caught) addToTeam(pokemon);
        goTo("gym1");
      },
    });
  } else if (state.stage === "gym1") {
    content = e(BattleScene, {
      title: "Prima Palestra",
      text: "Entri nella palestra. Il Capopalestra ti sfida a duello.",
      opponentTitle: GYM1.title,
      opponentTeamIds: GYM1.teamIds,
      opponentPower: 14,
      team: state.team,
      rewardBadge: "Medaglia Roccia",
      onResolved: ({ won }) => {
        if (won) addBadge("Medaglia Roccia");
        goTo("route2");
      },
    });
  } else if (state.stage === "route2") {
    content = e(ChoiceScene, {
      title: "Oltre la palestra",
      text: "Con la medaglia in tasca, la strada continua. Come vuoi proseguire?",
      choices: [
        {
          id: "cave",
          label: "Esplora la grotta",
          hint: "Pokémon di roccia e buio, più forti di quelli incontrati finora",
          onSelect: () => {
            addItem(ITEMS_FOUND_IN_CAVE[Math.floor(Math.random() * ITEMS_FOUND_IN_CAVE.length)]);
            goTo("encounter2", { pendingEncounterPool: ROUTE2_CAVE_WILD_IDS, pendingEncounterLevel: 7 });
          },
        },
        {
          id: "grass2",
          label: "Cerca tra l'erba alta più avanti",
          hint: "Nuove specie non ancora nella tua squadra",
          onSelect: () => {
            addItem(ITEMS_FOUND_IN_GRASS[Math.floor(Math.random() * ITEMS_FOUND_IN_GRASS.length)]);
            goTo("encounter2", { pendingEncounterPool: ROUTE2_GRASS_WILD_IDS, pendingEncounterLevel: 7 });
          },
        },
        {
          id: "train",
          label: "Fermati ad allenare la squadra",
          hint: "Nessun nuovo Pokémon, ma la squadra attuale sale di livello",
          onSelect: () => {
            boostTeam(2);
            goTo("finalBattle");
          },
        },
      ],
    });
  } else if (state.stage === "encounter2") {
    content = e(EncounterScene, {
      title: "Un altro incontro",
      text: "Un Pokémon più esperto ti osserva con attenzione...",
      pool: state.pendingEncounterPool,
      level: state.pendingEncounterLevel,
      onResolved: ({ caught, pokemon }) => {
        if (caught) addToTeam(pokemon);
        goTo("finalBattle");
      },
    });
  } else if (state.stage === "finalBattle") {
    content = e(BattleScene, {
      title: "Sfida finale: il tuo Rivale",
      text: "Il tuo Rivale ti aspetta per l'ultima sfida di questa demo.",
      opponentTitle: RIVAL.title,
      opponentTeamIds: RIVAL.teamIds,
      opponentPower: 26,
      team: state.team,
      rewardBadge: null,
      onResolved: () => goTo("end"),
    });
  } else if (state.stage === "end") {
    content = e(EndScreen, {
      team: state.team,
      badges: state.badges,
      onRestart: () => setState(initialState()),
    });
  }

  const stageIndex = Math.max(0, STAGE_ORDER.indexOf(state.stage));
  const progressPct = Math.round((stageIndex / (STAGE_ORDER.length - 1)) * 100);

  return e(
    React.Fragment,
    null,
    e(
      "header",
      { className: "app-header" },
      e("h1", null, "Pokémon: Scegli il Cammino"),
      e("span", { className: "subtitle" }, "Ispirato a Pokemon Roulette, ma guidato dalle tue scelte")
    ),
    e("div", { className: "progress-bar" }, e("div", { style: { width: `${progressPct}%` } })),
    e(
      "div",
      { className: "layout" },
      content,
      e(TeamPanel, { team: state.team, badges: state.badges, items: state.items })
    ),
    e(
      "p",
      { className: "footer-note" },
      "Demo MVP — dati e sprite dei Pokémon forniti da PokeAPI (pokeapi.co)."
    )
  );
}
