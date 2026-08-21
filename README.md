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

## Cosa contiene questa prima versione (MVP)

- Scelta dello starter (Bulbasaur / Charmander / Squirtle)
- Un bivio iniziale: erba alta, pesca al fiume, oppure andare dritto alla
  palestra
- Un incontro con un Pokémon selvatico dove scegli il metodo di cattura
  (Poké Ball, cibo, oppure ignorare)
- Una battaglia di palestra dove scegli una tattica (attacco diretto,
  bilanciata, difensiva) invece di subire un esito casuale
- Un secondo bivio (grotta / erba alta più avanti / allenamento) con oggetti
  trovabili nello zaino
- Una battaglia finale contro un Rivale
- Schermata finale con squadra, medaglie e zaino, e pulsante "Gioca di nuovo"

## Struttura del progetto

```
index.html              punto di ingresso, import map per React via CDN
src/
  main.js               monta l'app React nel DOM
  App.js                stato di gioco e transizioni tra le fasi
  styles.css
  data/
    pools.js             ID Pokémon usati nelle varie fasi, squadre avversarie, oggetti
  engine/
    battleLogic.js        logica pura (probabilità di cattura, calcolo battaglie) — senza React, facile da testare
  hooks/
    usePokemon.js          fetch + cache dei dati/sprite da PokeAPI
  components/
    StartScreen.js, ChoiceScene.js, EncounterScene.js, BattleScene.js,
    EndScreen.js, TeamPanel.js, PokemonSprite.js
```

I componenti sono scritti con `React.createElement` (qui abbreviato `e`)
invece che con la sintassi JSX, proprio perché non c'è un compilatore Babel a
disposizione senza un passo di build. Il codice resta comunque normale React
(hook, stato, componenti funzione): se in futuro vuoi migrare tutto in un
progetto Vite/Create React App con JSX, la struttura dei componenti è già
pronta e la conversione è quasi meccanica.

## Idee per continuare a svilupparla

Alcune direzioni naturali per le prossime versioni, da quello che ci siamo
detti:

- Aggiungere altre fasi dell'originale in versione "a scelta" (Alto Comando,
  leggendari, uova misteriose, scambi, Team Rocket, evoluzioni, shiny)
- Un sistema di battaglia con mosse e tipi reali, se in futuro vuoi più
  profondità delle "tattiche narrative" attuali
- Salvataggio della partita (localStorage per iniziare, account cloud in
  seguito)
- Multiplayer/sfide o classifiche tra amici

## Crediti

Dati e sprite dei Pokémon forniti da [PokeAPI](https://pokeapi.co), la stessa
fonte usata dal sito originale a cui questo progetto si ispira. Progetto fan
non ufficiale, non affiliato a Nintendo/Game Freak/The Pokémon Company.
