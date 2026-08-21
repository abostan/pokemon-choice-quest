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

## Cosa contiene questa versione (v2)

- Scelta della regione/generazione (Kanto o Johto), poi dello starter di
  quella generazione
- Un bivio prima di ogni palestra: erba alta, pesca, grotta (con possibilità
  di trovare un oggetto) oppure allenamento
- Incontri con Pokémon selvatici dove scegli il metodo di cattura (Poké
  Ball, cibo, oppure ignorare), con Pokémon e livelli che diventano via via
  più forti
- **8 palestre** in sequenza, fedeli per tipo/ordine ai giochi originali,
  ciascuna con una propria tattica di battaglia da scegliere (attacco
  diretto, bilanciata, difensiva)
- Una battaglia a sorpresa contro il Rivale a metà avventura
- **Alto Comando (4 membri)** e infine il **Campione**, come nei giochi
- Schermata finale con squadra, medaglie e zaino, e pulsante "Gioca di nuovo"

Non ancora incluso (prossimi blocchi, vedi `SPEC.md`): continuare nella
generazione successiva mantenendo la squadra dopo aver battuto una Lega,
modalità infinita post-generazioni, e il Pokédex (run + storico).

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
