# Pokémon: Scegli il Cammino

Piccola avventura Pokémon in React, ispirata a [Pokemon Roulette](https://zeroxm.github.io/pokemon-roulette/)
ma con una differenza fondamentale: **non gira nessuna ruota**. Ad ogni passo
sei tu a scegliere cosa fare (esplorare l'erba alta o pescare, come affrontare
una battaglia, se rischiare una cattura o proseguire), e l'esito viene
calcolato in base alle scelte fatte e alla tua squadra, non da un tiro a sorte
puro.

## Come si avvia (nessuna installazione necessaria)

Questo progetto **non ha un passo di build**: niente `npm install`, niente
Vite/webpack. React viene caricato direttamente dal browser tramite CDN
(esm.sh), grazie a un *import map* dentro `index.html`.

Serve però un piccolo server statico, perché i moduli ES non si caricano
aprendo il file `index.html` direttamente da disco (protocollo `file://`).
Due modi semplici, scegline uno:

```bash
# Opzione A — se hai Node.js installato
npx serve .

# Opzione B — se hai Python 3 installato
python3 -m http.server 5173
```

Poi apri l'indirizzo che ti viene indicato (es. `http://localhost:5173`) nel
browser. Serve una connessione internet normale: la app scarica sprite e dati
dei Pokémon in diretta da [PokeAPI](https://pokeapi.co).

## Cosa contiene questa versione (v5.8)

- **💀 Modalità Sfida Hardcore / Nuzlocke**: Regole ad alta sfida attivabili all'inizio della partita con **Permadeath (morte permanente)** dei Pokémon svenuti nel PC Box (`isFainted: true`) ed un solo tentativo di cattura!
- **⚡ Sistema di Efficacia dei Tipi**: Calcolo automatico dei vantaggi/svantaggi di tipo per tutti i 18 tipi ufficiali! Bonus di **+15% alla potenza della squadra** per gli attacchi Super Efficaci e svantaggio del **-10%** se vulnerabili, con badge visivo in `BattleScene`.
- **🕵️ Battaglie Boss Narrative contro i Capo Team**: Scontri boss unici per ciascuna delle 9 generazioni (Giovanni, Archer, Max/Archie, Cyrus, Ghetsis, Lysandre, Guzma, Rose, Eri/Cassiopea) dopo la 4ª palestra.
- **🟣 Strumento Master Ball**: Ricompensa epica per aver sconfitto i Capo Team. Consente una **cattura al 100% garantita** per qualsiasi incontro selvatico o leggendario!
- **🍬 Caramella Rara**: Aumenta istantaneamente il livello di tutti i Pokémon della squadra di **+3 Livelli**.
- **🗺️ 9 Generazioni Giocabili**: Kanto (Gen 1), Johto (Gen 2), Hoenn (Gen 3), Sinnoh (Gen 4), Unova (Gen 5), Kalos (Gen 6), **Alola (Gen 7)**, **Galar (Gen 8)** e **Paldea (Gen 9)**.
- **📖 Pokédex Nazionale Completo (1025 specie)**: Modale Pokédex esteso con la **Vista Griglia Album (⬛)** a figurine con anteprime pixel e silhouette `? Ignoto` per tutti i 1025 slot dal #1 Bulbasaur al #1025 Pecharunt, con tab per regione (Kanto..Paldea) e ricerca per `#ID`.
- **🎲 Bivi Casuali (Rogue-Lite)**: Ad ogni tappa tra le palestre vengono generate **3-4 scelte casuali** (2 base + 1-2 eventi speciali pesati come Leggendari ⭐, Uova 🐣, Vulcano 🌋, Foresta 👻, Dojo 🥊, Team Nemico 🕵️‍♂️).
- **📦 Transizione Team nel PC Box tra Generazioni**: Quando si batte la Lega e si passa alla regione successiva, la squadra precedente viene salvata nel **PC Box** per ripartire solo col nuovo starter locale a Lv 5!
- **🎒 Tooltip Descrizioni Oggetti**: Descrizioni dettagliate su hover al passaggio del mouse su ciascun elemento dello Zaino (`TeamPanel`) ed in `BattleScene`.
- **✨ Sistema Pokémon Shiny**: Probabilità 1/500 di incontrare uno Shiny selvatico (1/20 per i leggendari), con badge dorato ✨ e sprite Shiny dedicato.
- **🏅 Medaglie Grafiche Visuali**: Chip grafici tematici con icone uniche per ogni tipo di palestra nel pannello laterale (`TeamPanel`).
- **👤 Avatar Avversario in Battaglia**: Scheda avatar visiva con icona, titolo e potenza stimata del Capopalestra o rivale prima dello scontro.
- **💾 Salvataggio Multi-Slot & Backup JSON**: 3 slot di salvataggio indipendenti con data/ora e supporto completo ad esportazione/importazione di file JSON.
- **Evoluzioni & Blocco Tasto B**: evoluzioni automatiche al livello soglia con opzione visiva per annullare/bloccare l'evoluzione di ogni specie (mappate per tutte le 9 Gen).
- **Modalità Infinita Post-Game & Leggendari**: esplorazione infinita a difficoltà crescente dopo Paldea, con probabilità di incontrare Pokémon leggendari unici.

## Struttura del progetto

```
index.html              punto di ingresso, import map per React via CDN
SPEC.md                 backlog/decisioni di design per le prossime funzioni
src/
  main.js               monta l'app React nel DOM
  App.js                stato di gioco e transizioni tra le fasi (generazione, palestre, Alto Comando, Campione)
  styles.css
  data/
    generations.js       dati di ogni generazione: starter, zone, palestre, Alto Comando, Campione, Rivale
    pools.js              (superato da generations.js, non più usato — puoi eliminarlo)
  engine/
    battleLogic.js        logica pura (probabilità di cattura, calcolo battaglie) — senza React, facile da testare
  hooks/
    usePokemon.js          fetch + cache dei dati/sprite da PokeAPI
  components/
    GenerationSelectScreen.js, StartScreen.js, ChoiceScene.js, EncounterScene.js,
    BattleScene.js, EndScreen.js, TeamPanel.js, PokemonSprite.js
scripts/
  simulate-flow.mjs       piccolo script Node per verificare la sequenza di gioco (nessuna palestra/indice mancante) senza aprire il browser
```

I componenti sono scritti con `React.createElement` (qui abbreviato `e`)
invece che con la sintassi JSX, proprio perché non c'è un compilatore Babel a
disposizione senza un passo di build. Il codice resta comunque normale React
(hook, stato, componenti funzione): se in futuro vuoi migrare tutto in un
progetto Vite/Create React App con JSX, la struttura dei componenti è già
pronta e la conversione è quasi meccanica.

## Idee per continuare a svilupparla

Le prossime funzioni concordate sono in `SPEC.md` (cambio generazione con
squadra/box che resta, modalità infinita post-generazioni, Pokédex run +
storico). Altre idee più a lungo termine:

- Altre fasi dell'originale in versione "a scelta" (leggendari, uova
  misteriose, scambi, Team Rocket, evoluzioni, shiny)
- Un sistema di battaglia con mosse e tipi reali, se in futuro vuoi più
  profondità delle "tattiche narrative" attuali
- Salvataggio della partita in corso (non solo il Pokédex storico)
- Multiplayer/sfide o classifiche tra amici
- Bilanciare meglio i numeri di potenza delle palestre/Alto Comando/Campione
  una volta provato con mano come si gioca

## Crediti

Dati e sprite dei Pokémon forniti da [PokeAPI](https://pokeapi.co), la stessa
fonte usata dal sito originale a cui questo progetto si ispira. Progetto fan
non ufficiale, non affiliato a Nintendo/Game Freak/The Pokémon Company.
