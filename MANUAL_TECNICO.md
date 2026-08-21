# Manuale Tecnico — Pokémon: Scegli il Cammino (v3+)

> Documento di riferimento per sviluppatori. Descrive l'architettura, il flusso di gioco, i moduli e le decisioni tecniche della codebase aggiornata.

---

## 1. Panoramica del Progetto

**Pokémon: Scegli il Cammino** è un'avventura Pokémon interattiva per browser basata su scelte narrative e strategiche. A differenza dei giochi ufficiali o di simulatori casuali, l'esito delle catture e delle battaglie viene calcolato in base alla potenza complessiva della squadra, alle decisioni tattiche e a tiri di dado pesati su formule matematiche deterministiche.

### Stack Tecnologico

| Tecnologia | Utilizzo |
|---|---|
| **React 18** (via CDN `esm.sh`) | UI e gestione dello stato globale |
| **Vanilla JS (ES Modules)** | Logica pura, dati e motori di gioco — zero build step |
| **Vanilla CSS** | Design system completo (dark mode, modali, glassmorphism, glowing animation) |
| **PokeAPI** (`pokeapi.co`) | Fetch in tempo reale di sprite, nomi e tipi dei Pokémon |
| **`localStorage` API** | Persistenza del salvataggio di gioco e del Pokédex storico |

> [!IMPORTANT]
> **Nessun passo di build.** Il progetto non richiede Node/npm/Vite per eseguire la app nel browser. React viene importato direttamente tramite `importmap` dentro `index.html` e i componenti React sono scritti con `React.createElement` (alias `e`) per evitare di dipendere da compilatori JSX/Babel.

---

## 2. Struttura del Progetto

```
pokemon-choice-quest/
├── index.html              # Entry point HTML con import map per React/ReactDOM
├── package.json            # Metadati di base
├── README.md               # Guida per l'utente e avvio rapido
├── ROADMAP.md              # Changelog e roadmap dei prossimi sviluppi
├── MANUAL_TECNICO.md       # Manuale tecnico completo del progetto (questo file)
├── SPEC.md                 # Documento di specifica e backlog
├── scripts/
│   └── simulate-flow.mjs   # Script Node.js per testare a secco le 4 generazioni
└── src/
    ├── main.js             # Punto d'ingresso React: monta <App /> nel DOM
    ├── App.js              # Stato globale e macchina a stati (fasi di gioco)
    ├── styles.css          # Design system CSS unico (variabili, modali, animazioni)
    ├── data/
    │   ├── generations.js  # Dati delle 4 generazioni (Kanto, Johto, Hoenn, Sinnoh)
    │   └── evolutions.js   # Mappa completa delle evoluzioni (soglie di livello)
    ├── engine/
    │   ├── battleLogic.js  # Logica pura per cattura e battaglie (formule matematiche)
    │   └── saveGame.js     # Modulo di persistenza localStorage (save state & Pokédex storico)
    ├── hooks/
    │   └── usePokemon.js   # Hook React con cache in memoria per PokeAPI
    └── components/
        ├── GenerationSelectScreen.js  # Schermata di selezione della regione iniziale
        ├── StartScreen.js             # Selezione dello starter della generazione
        ├── ChoiceScene.js             # Scena generica a bivio (esplorazione/allenamento)
        ├── EncounterScene.js          # Scena incontro con Pokémon selvatico / leggendario
        ├── BattleScene.js             # Scena battaglia (Palestra, Rivale, Alto Comando, Campione)
        ├── EndScreen.js               # Schermata di conclusione della run
        ├── TeamPanel.js               # Sidebar per squadra, box, medaglie e zaino
        ├── PokemonSprite.js           # Componenti PokemonChip e PokemonPreview
        ├── NextGenerationScreen.js    # Schermata passaggio a nuova generazione post-Lega
        ├── PostgameScreen.js          # Schermata intro alla modalità infinita
        ├── PokedexModal.js            # Modale Pokédex (vista Run & vista Storico)
        ├── ResumeScreen.js            # Schermata di ripresa della partita salvata
        ├── EvolutionNotice.js         # Overlay animato evoluzioni con opzione Tasto B (annulla)
        └── BoxModal.js                # Modale gestione Box e swap Pokémon
```

---

## 3. Architettura e Macchina a Stati (`src/App.js`)

### 3.1 Diagramma dei Flussi e delle Fasi (`phase`)

```mermaid
stateDiagram-v2
    [*] --> resume : Salvataggio presente su localStorage
    [*] --> generationSelect : Nessun salvataggio

    resume --> generationSelect : Nuova partita
    resume --> explore : Riprendi partita

    generationSelect --> starterSelect : Selezione generazione
    starterSelect --> explore : Selezione starter

    explore --> encounter : Erba alta / Pesca / Grotta
    explore --> gymBattle : Allenamento (salta alla palestra)

    encounter --> gymBattle : Risolto (catturato o fuggito)

    gymBattle --> rivalBattle : Dopo gym N (se rivale programmato)
    gymBattle --> eliteBattle : Sconfitte tutte le 8 palestre
    gymBattle --> explore : Prossima palestra

    rivalBattle --> explore : Battaglia risolta

    eliteBattle --> eliteBattle : Membro successivo (1..4)
    eliteBattle --> championBattle : Sconfitti i 4 membri

    championBattle --> nextGenSelect : Esiste generazione successiva
    championBattle --> postgame : Ultima generazione completata

    nextGenSelect --> starterSelect : Nuova regione (mantiene squadra/box/zaino)
    postgame --> postgameExplore : Avvio modalità infinita

    postgameExplore --> postgameExplore : Loop esplorazione (round + 1)
    postgameExplore --> legendaryEncounter : 5% probabilità incontro leggendario
    legendaryEncounter --> postgameExplore : Risolto (catturato o fuggito)

    end --> generationSelect : Riavvio
```

### 3.2 Struttura dello Stato Globale (`initialState()`)

```js
{
  // Flusso di gioco
  phase: "generationSelect",
  generationId: null,
  gymIndex: 0,
  eliteIndex: 0,
  rivalDone: false,

  // Squadra e inventario
  team: [],                 // Array<{id, level}> (max 6)
  box: [],                  // Array<{id, level}> (riserva)
  badges: [],               // Array<string> (medaglie regione corrente)
  items: [],                // Array<string> (oggetti nello zaino)

  // Scena corrente (stato transiente)
  pendingEncounterPool: null,
  pendingEncounterLevel: 4,
  pendingEncounterIsLegendary: false,

  // Multi-generazione e post-game
  multiGenRun: false,
  postgameRound: 0,

  // Pokédex
  pokedexRun: {},           // { [id]: { seen: true, caught: boolean } }
  pokedexOpen: false,

  // Evoluzioni e Leggendari
  pendingEvolutions: [],    // Array<{ evolvedFrom, id, level }>
  caughtLegendaries: [],    // Array<number> (ID leggendari catturati)

  // Modali UI
  boxModalOpen: false,
}
```

---

## 4. Moduli di Logica e Persistenza (`src/engine/`)

### 4.1 `battleLogic.js` (Logica Pura di Gioco)

Modulo completamente disaccoppiato da React per il calcolo delle formule matematiche:

- **Cattura**:
  - `computeCaptureChance(method, baseRate)`: applica moltiplicatori (`ball`: 1.0×, `food`: 1.25×) e clamp tra 5% e 95%.
  - `rollCapture(chance, rng = Math.random)`: esegue il tiro di dado.

- **Potenza della Squadra**:
  - `computeTeamPower(team)`: calcola $\sum \text{livelli} + (\text{lunghezza team} \times 2)$.

- **Vittoria in Battaglia**:
  - `computeWinChance(teamPower, opponentPower, tactic)`: applica i moltiplicatori di tattica (`aggressive`: team 1.2×, `balanced`: 1.0×, `defensive`: team 0.95×, opp 0.8×).
  - Formula: $0.5 + \frac{\text{teamEff} - \text{oppEff}}{2 \times \text{oppEff}}$, clampata tra 12% e 90%.
  - `rollBattle(winChance, rng)`: esegue il tiro di vittoria.

### 4.2 `saveGame.js` (Salvataggio & Pokédex Storico)

Gestisce la persistenza lato client tramite l'API `localStorage`:

- **Salvataggio Partita (`pcq_save_v1`)**:
  - `saveGame(state)`: serializza lo stato filtrando i campi transienti (`SKIP_FIELDS`).
  - `loadGame()`: recupera e valida la struttura del salvataggio.
  - `deleteSave()`: rimuove il salvataggio.

- **Pokédex Storico (`pcq_pokedex_historic`)**:
  - `updateHistoricPokedex(pokemonId, caught)`: salva o aggiorna lo stato visto/catturato con timestamp `firstSeen` e `firstCaught`.
  - `loadHistoricPokedex()`: restituisce la mappa completa delle specie registrate nel browser.

---

## 5. Layer dei Dati (`src/data/`)

### 5.1 `generations.js`

Contiene la configurazione delle **4 generazioni**:

```js
{
  id: "kanto" | "johto" | "hoenn" | "sinnoh",
  name: string,
  starterIds: [id1, id2, id3],
  explorationTiers: [
    { level: number, grass: [], fishing: [], cave: [], grass2: [] },
    // 3 tier riusati lungo le 8 palestre
  ],
  items: { cave: [], grass: [] },
  gymLeaders: [ { title, badge, teamIds, opponentPower } ], // 8 elementi
  eliteFour: [ { title, teamIds, opponentPower } ],         // 4 elementi
  champion: { title, badge, teamIds, opponentPower },
  rival: { title, teamIds, opponentPower, afterGymIndex },
  legendaries: [id1, id2, ...]                             // Leggendari post-game
}
```

Funzioni esportate: `getGeneration(id)`, `getExplorationTier(gen, gymIndex)`, `getNextGeneration(currentId)`.

### 5.2 `evolutions.js`

Mappa 180+ specie di Pokémon delle prime 4 generazioni con soglia di livello:

```js
export const EVOLUTIONS = {
  1: { evolvesAt: 16, evolvesTo: 2 }, // Bulbasaur -> Ivysaur
  ...
};
```

Funzione `checkEvolution(pokemon)`: se il livello è $\ge$ `evolvesAt`, restituisce l'oggetto Pokémon con `id: evolvesTo` e `evolvedFrom: originalId`.

---

## 6. Componenti UI (`src/components/`)

| Componente | Ruolo |
|---|---|
| `GenerationSelectScreen` | Selezione della regione di partenza tra quelle disponibili. |
| `StartScreen` | Scelta dello starter. Se in run multi-gen, mostra il team attuale che accompagna il giocatore. |
| `ChoiceScene` | Scena narrative a bivio per esplorazione o allenamento. |
| `EncounterScene` | Gestisce l'incontro selvatico/leggendario. Supporta flag `isLegendary` (tasso 10%, no cibo). |
| `BattleScene` | Scena di combattimento con scelta delle 3 tattiche e visualizzazione del team avversario. |
| `TeamPanel` | Sidebar fissa: squadra (max 6), anteprima box, medaglie e zaino. |
| `PokemonSprite` | `PokemonChip` (formato compatto 34px) e `PokemonPreview` (formato card 72px) con tipi. |
| `NextGenerationScreen` | Transizione alla nuova regione mantenendo il team/box/zaino accumulato. |
| `PostgameScreen` | Schermata celebrativa e di passaggio alla modalità infinita. |
| `PokedexModal` | Modale con tab toggle "Run attuale" e "Storico", conteggio catturati/visti e ricerca visuale. |
| `ResumeScreen` | Schermata di caricamento salvataggio all'avvio della app. |
| `EvolutionNotice` | Overlay animato di evoluzione con opzione per annullare/bloccare l'evoluzione di ciascun Pokémon (Tasto B). |
| `BoxModal` | Modale di gestione della riserva con UX a 2 colonne per scambiare Pokémon tra squadra e box. |

---

## 7. Design System CSS (`src/styles.css`)

### Variabili CSS principali (`:root`)

- `--bg`: `#0f1620` (Sfondo globale scuro con gradiente radiale)
- `--panel`: `#16202c` (Pannelli principali)
- `--panel-alt`: `#1d2b3a` (Card, chip e bottoni secondari)
- `--accent`: `#ffcb05` (Giallo iconico Pokémon)
- `--accent-2`: `#3c5aa6` (Blu iconico Pokémon)
- `--success`: `#4caf7d` / `--danger`: `#e0554f`
- `--radius`: `14px`

### Stili Speciali Aggiunti in v3+
- `.pokedex-modal`: Layout a modale con tab navigabili e status badge (`✓ Catturato` verde, `👁 Visto` grigio).
- `.box-modal`: Layout griglia a due colonne (`Squadra` vs `Box`) con indicatore di selezione (`.selected`).
- `.evo-overlay`: Backdrop opaco con `backdrop-filter: blur(4px)` e carte evoluzione con pulsante annulla (`.evo-toggle-btn`).
- `.encounter-legendary`: Glowing animato viola/dorato (`@keyframes legendaryGlow`) per gli incontri con i Pokémon leggendari.
- `.type-pill.type-*`: Classi CSS dedicate per la colorazione dinamica di ciascun tipo Pokémon (Fuoco, Acqua, Erba, Elettro, Psico, Drago, ecc.).

---

## 8. Script di Simulazione (`scripts/simulate-flow.mjs`)

Script eseguibile via Node.js per la verifica automatica del flusso di gioco:

```bash
node scripts/simulate-flow.mjs
```

Esegue una simulazione a secco di tutte e 4 le generazioni verificate in sequenza (22 passi ciascuna), assicurandosi che nessun indice di palestra, rivale, Alto Comando o campione risulti `undefined` o generi eccezioni di runtime.
