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

## Cosa contiene questa versione (v3+)

- **4 Generazioni giocabili**: Kanto (Gen 1), Johto (Gen 2), Hoenn (Gen 3), Sinnoh (Gen 4)
- **Progressione Multi-Generazione**: dopo aver battuto la Lega di una regione, si può passare alla generazione successiva mantenendo squadra, box e zaino!
- **Evoluzioni dei Pokémon**: evoluzioni automatiche al raggiungimento del livello soglia, con possibilità di annullare/bloccare l'evoluzione (Premendo il tasto B)
- **Gestione Box**: gestione riserva per scambiare i Pokémon quando la squadra (max 6) è piena
- **Pokédex completo**: modale sempre accessibile con due viste (Run attuale e Storico persistito su `localStorage`)
- **Salvataggio Automatico**: salvataggio stato su `localStorage` e schermata per riprendere la partita
- **Modalità Infinita Post-Game**: completate le generazioni, l'esplorazione continua liberamente a difficoltà crescente
- **Incontri Leggendari**: probabilità del 5% ad ogni round post-game di incontrare Pokémon leggendari unici (Articuno, Zapdos, Groudon, Dialga, ecc.)


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
