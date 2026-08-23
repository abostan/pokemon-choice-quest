# 🗺️ Roadmap & Changelog — Pokémon: Scegli il Cammino

Questo documento traccia l'evoluzione del progetto, le funzionalità implementate versione per versione e le idee pianificate per il futuro.

---

## 📜 Storico delle Versioni (Funzionalità Completate)

### Versione 1.0 — Prova di Concetto (v1)
- [x] Starter unico della prima generazione (Gen 1).
- [x] Struttura base: bivio iniziale, incontro selvatico, singola palestra, sfida col rivale e schermata finale.
- [x] Calcolo esito basato sulle scelte narrative e sulla potenza complessiva della squadra (senza ruota della fortuna).
- [x] Integrazione con PokeAPI per sprite e dati dei Pokémon in tempo reale.

---

### Versione 2.0 — Regioni e Campionato Completo (v2)
- [x] **Selezione della Regione**: supporto per Kanto (Gen 1) e Johto (Gen 2).
- [x] **Campionato completo**: 8 Palestre fedeli per ordine e tipo, seguiti dall'Alto Comando (4 membri) e il Campione della Lega.
- [x] **Tappe di Esplorazione**: bivi esplorativi scalati in 3 tier di difficoltà tra una palestra e l'altra (erba alta, pesca, grotta con oggetti, o allenamento).
- [x] **Sfida Rivale**: evento battaglia a sorpresa a metà percorso.
- [x] **Barra di Avanzamento**: indicatore visivo del progresso nella Lega.
- [x] **Script di simulazione**: `scripts/simulate-flow.mjs` per validare la sequenza di gioco a secco.

---

### Versione 5.0 — Sala della Fama & Hall of Fame Storica (v5)
- [x] Persistenza automatica in `localStorage` (`pcq_hall_of_fame`) ad ogni vittoria contro il Campione della Lega in qualsiasi regione.
- [x] Registro d'onore permanente con nome della regione, data e ora del trionfo, membri della squadra vincente e badge Nuzlocke.
- [x] **📖 Modale `HallOfFameModal.js`**: tema dorato stile champagne con carte celebrate per ogni trionfo e sprite visivi pixel di tutti i Pokémon campioni.
- [x] **🔘 Pulsante Header (`🏆 Sala della Fama`)**: accesso rapido consultabile in qualsiasi momento nell'header della app accanto al Pokédex.

---

### Versione 6.5 — Torneo dei Campioni della Lega Post-Game (v6.5)
- [x] **Sblocco speciale del Torneo**: nel Post-Game è possibile sfidare i 5 Campioni leggendari in un duello ad eliminazione diretta.
- [x] **Round 1**: 🔴 *Campione Rosso (Kanto)* — Pikachu, Charizard, Blastoise, Venusaur (Potenza 180).
- [x] **Round 2**: 🪨 *Campione Rocco Petri (Hoenn)* — Metagross, Skarmory, Aggron, Armaldo (Potenza 195).
- [x] **Round 3**: 🌸 *Campionessa Camilla (Sinnoh)* — Garchomp, Lucario, Milotic, Spiritomb (Potenza 215).
- [x] **Round 4**: 🐉 *Campione Imbattibile Dandel (Galar)* — Charizard, Dragapult, Aegislash (Potenza 235).
- [x] **Grand Finale**: 👑 *Prima Campionessa Alisma (Paldea)* — Glimmora, Kingambit, Espathra (Potenza 260).
- [x] **🏆 Tabellone del Torneo (`TournamentScene.js`)**: schermata del tabellone ad eliminazione diretta con stato per ogni sfida.
- [x] **👑 Iscrizione nella Sala della Fama**: titolo supremo `👑 RE DEI CAMPIONI POKÉMON` e boost +5 livelli per l'intera squadra dopo la vittoria finale.

---

### Versione 7.0 — Sistema Abilità Passive dei Pokémon (v7.0)
- [x] Modulo `src/data/abilities.js` per l'assegnazione e il calcolo delle abilità passive delle varie specie.
- [x] **🦁 Prepotenza (Intimidate)**: riduce la potenza dell'avversario del **-10%** ad ogni scontro.
- [x] **⚡ Pressione (Pressure)**: aumenta la probabilità di successo in battaglia del **+8%**.
- [x] **🛡️ Levitazione (Levitate)**: annulla le penalità di svantaggio di tipo (-10% -> 0%).
- [x] **🌊 Nuotavelox (Swift Swim)**: +15% di potenza nelle zone d'acqua e pesca.
- [x] **💥 Acceleratore (Speed Boost)**: +5% alla probabilità di successo tattico in battaglia.
- [x] **🍀 Leggiadria (Serene Grace)**: +10% alla probabilità di cattura Pokémon selvatici.
- [x] **✨ Visualizzazione UI**: display dei badge delle abilità attive in `TeamPanel.js` ed in `BattleScene.js`.

---

### Versione 7.5 — Centro Pokémon & Mercatino PokéMart (v7.5)
- [x] Nuova tappa esplorativa `🏥 Centro Pokémon & Mercatino di Città` presente nelle tappe casuali tra le palestre.
- [x] **👩‍⚕️ Infermeria Joy**: ripristina la salute della squadra con jingle audio retro Game Boy a 8-bit (`playHealJingle()`).
- [x] **💰 Sistema Pokédollari**: moneta di gioco guadagnata vincendo sfide contro Capipalestra (+5 💰), Boss dei Team nemici (+4 💰) ed Allenatori (+2 💰).
- [x] **🏪 Mercatino PokéMart**: acquisto di Pozioni (1 💰), Super Pozioni (2 💰), Iper Pozioni (3 💰), Caramelle Rare (5 💰) e Master Ball (10 💰).
- [x] **🏷️ Display Pokédollari**: indicatore del saldo Pokédollari integrato nel pannello laterale della squadra (`TeamPanel.js`).

---

### Versione 8.0 — Classifica Punteggio & Grado di Vittoria (v8.0)
- [x] Modulo `src/engine/scoreLogic.js` per il calcolo matematico del punteggio di vittoria e del grado d'onore.
- [x] **🏆 Grado S — Maestro Pokémon Supremo** (>= 25.000 pt)
- [x] **🥇 Grado A — Allenatore d'Élite** (15.000 - 24.999 pt)
- [x] **🥈 Grado B — Veterano della Lega** (8.000 - 14.999 pt)
- [x] **🥉 Grado C — Allenatore Promettente** (< 8.000 pt)
- [x] **📊 Componente `ScoreCardModal.js`**: scheda d'onore celebrativa con trofeo visivo animato, riepilogo dettagliato punti (Medaglie, Livelli Squadra, Specie Pokédex, Bonus Shiny e Moltiplicatore Nuzlocke x1.5) e record personale salvato in `localStorage`.
- [x] **🔘 Pulsante Header (`📊 Punteggio`)**: accesso rapido consultabile in qualsiasi momento nell'header della app.

---

### Versione 8.5 — Refactoring Ultra-Modulare & Sanitizzatore (v8.5)
- [x] **🧹 Refactoring Architetturale**: scomposizione di `App.js` ed `useGameState.js` in sotto-hook compatti (`useSaveSlot.js`, `usePokedexState.js`) e sotto-container per le scene (`ExploreSceneContainer.js`, `GymBattleSceneContainer.js`, `LeagueSceneContainer.js`).
- [x] **🛡️ Sanitizzatore Automatico dei Salvataggi (`saveSanitizer.js`)**: validatore automatico per ripristinare valori sicuri in caso di salvataggi parziali o corrotti in LocalStorage.
- [x] **🧪 Suite di Test Automatici (`npm test`)**: test runner nativo di Node.js (`node --test`) con 7 test unitari su logica di battaglia, punteggio, tipo e salvataggi.
- [x] **🔍 Logger Diagnostico (`logger.js`)**: tracciamento pulito delle transizioni di fase ed esiti battaglie in console DevTools.

---

### Versione 8.6 — Randomizer/Mono-Type, Bilanciamento & Strumenti di Analisi Run (v8.6 - Attuale)
- [x] **🎲 Randomizer Mode & 🔥 Mono-Type Challenge riattivati**: toggle nella schermata `GenerationSelectScreen`; il filtro (`filterEncounterPoolByChallenge`) viene ora applicato centralmente in `useGameState.goTo()` al momento della transizione di stato, non nel render — fix definitivo del bug storico di re-render infinito (vedi sezione TODOLIST/Fix qui sotto, ora risolta).
- [x] **🐛 Fix incontri leggendari**: il filtro Randomizer/Mono-Type non viene più applicato ai pool di incontro leggendario (che contengono un solo id) — prima poteva sostituire il leggendario con un Pokémon comune qualsiasi dello stesso tipo.
- [x] **⚔️ Mega Evoluzione e Terastallizzazione mutuamente esclusive**: in battaglia non è più possibile attivare entrambe nella stessa battaglia (prima cumulabili e gratuite, +62.5% di potenza combinata senza alcun costo).
- [x] **🐛 Fix bivio di esplorazione ripetuto identico**: il seed che sceglie le opzioni speciali del bivio principale dipendeva solo da `gymIndex`/`badges.length` (fissi per l'intera durata di una palestra) — un'opzione poteva dominare per intere run mentre altre non comparivano mai. Ora il seed incorpora `choicesCount` (che avanza ad ogni transizione di stato) e l'hash di mescolamento è stato sostituito con FNV-1a + un finalizzatore a 32 bit (prima l'ordinamento guardava solo la prima lettera dell'id).
- [x] **📐 Bivi allargati da 3 a 6 opzioni speciali** mostrate per bivio principale (oltre a erba/allenamento/ruota del destino).
- [x] **⚖️ Bilanciamento incontro & cattura leggendari**: probabilità di incontro ridotta (peso 0.10 → 0.06, il più basso della tabella), tasso di cattura base abbassato (Poké Ball 15%→10%, Cibo 18%→12%), bonus Leggiadria dimezzato sui leggendari, tetto massimo 30%→20%. Master Ball resta garanzia 100% (invariato).
- [x] **🧪 Nuovo modulo puro `src/engine/explorePicker.js`**: logica di selezione dei bivi estratta da `ExploreSceneContainer.js` in un modulo senza React/`Math.random()`, testabile in isolamento. Tabella pesi condivisa in `src/data/exploreOptions.js` (unica fonte di verità tra componente e test).
- [x] **🧪 Nuova suite `tests/explorePicker.test.js`**: simula run intere (fino a 200×120 bivi) per verificare copertura totale delle opzioni, assenza di dominazione, rarità del leggendario, purezza/determinismo dell'algoritmo (incluso un test che fa esplodere `Math.random()` se il picker lo chiama mai) e cattura leggendari via Monte Carlo su 20.000 tentativi.
- [x] **📊 Registratore di sessione locale (`src/engine/runRecorder.js`)**: traccia bivi mostrati/scelti, incontri, catture e battaglie di una run reale. Autosave automatico ogni 10 eventi e alla chiusura/cambio scheda (`sendBeacon`), oltre a `pcqRunLog.save()`/`.download()` manuali da console DevTools.
- [x] **🖥️ Nuovo `server.mjs`**: server locale a zero dipendenze npm che sostituisce `npx serve .` come `npm start` — serve i file statici e accetta `POST /api/log` per scrivere i log di sessione in `logs/` (cartella esclusa da git).
- [x] **📈 Nuovo `scripts/analyze-run-log.mjs` (`npm run logs`)**: legge i log reali in `logs/` e stampa un report con verdetto ⚠️/✅ automatico (dominazione bivi, ripetizioni identiche, scarto osservato/teorico su catture e battaglie), con soglie coerenti con `tests/explorePicker.test.js`.
- [x] **🐛 Fix icone medaglie/avatar avversario incoerenti**: `TeamPanel.js` e `BattleScene.js` indovinavano l'icona per string-matching sul nome della medaglia/titolo, in modo incoerente tra loro e fragile verso nomi nuovi — verificato che badge come "Medaglia Erba", "Medaglia Fuoco", "Medaglia Normale Paldea", "Medaglia Buio", "Medaglia Folletto", "Medaglia Lotta" e "Medaglia Ombra" non matchavano **nessuna** parola chiave e cadevano sull'icona generica 🏅. Sostituito con una mappa tipo→icona condivisa (`getTypeIcon` in `data/types.js`) risolta tramite il tipo reale del capopalestra (`getBadgeType` in `data/generations.js`, che lo ricava dal titolo "di tipo X", non dal nome estetico della medaglia). Spettro ha ora un'icona propria (👻) invece di condividere quella di Psico (🔮).
- [x] **⚖️ Iper Pozione ora più forte della Super Pozione**: +18 → +24 Potenza in battaglia (prima identica alla Super Pozione pur costando 3💰 contro 2💰).
- [x] **📝 Documentato il fallback euristico delle abilità passive** (`data/abilities.js`): commento esplicito che l'assegnazione per modulo dell'id (es. Weedle → Acceleratore) è riempimento arbitrario, non dati ufficiali dei giochi.

---

## 🔮 Prossimi Sviluppi & Pianificazione Futura

### 🎯 Fase 1: Espansione dei Bivi & Eventi Dinamici (L'Esperienza dei Bivi - COMPLETATO)
- [x] **🧪 Laboratorio Fossili**: evento speciale per consegnare un fossile antico e far rianimare Pokémon rari (Omanyte, Kabuto, Aerodactyl, Lileep, Cranidos, Tyrunt).
- [x] **🤝 Scambio Allenatore (NPC Trade)**: incontra un Allenatore sul percorso disposto a scambiare un suo Pokémon raro per una specie specifica.
- [x] **🎰 Casinò Razzo & Sala Giochi**: minigioco facoltativo per scommettere le monete guadagnate e vincere Porygon, Master Ball, Monete extra o strumenti rari.
- [x] **🌾 Zona Safari**: zona di esplorazione speciale ad alto rischio/ricompensa dove usare Safari Ball per catturare Pokémon esotici.
- [x] **🛒 Mercante Ambulante & Pietre Evolutive**: negozio itinerante per acquistare pietre evolutive specifiche (Pietra Focaia, Idropietra, Pietra Lunare) o Caramelle Rare.
- [x] **☀️ Sistema Meteo sui Percorsi**: eventi atmosferici dinamici (Sole Intenso, Pioggia Battente, Tempesta di Sabbia, Nebbia) che potenziano o indeboliscono determinati tipi durante l'esplorazione.
- [x] **🎰 Modalità "Chaos Roulette" (Opzionale)**: opzione "Ruota del Destino" per far girare una roulette nei bivi invece di scegliere manualmente.

---

### 🍇 Fase 2: Espansione Contenuti — Generazione 9 (Paldea)
- [x] **Starter Gen 9**: inseriti *Sprigatito*, *Fuecoco*, e *Quaxly*.
- [x] **Capipalestra & Lega di Paldea**: le 8 palestre di Paldea, i Superquattro (Rika, Poppy, Larry, Hassel) ed il Campione Geeta / Nemi.
- [x] **Leggendari & Ultra-Bestie di Paldea**: incontri con *Koraidon*, *Miraidon* ed *I Quattro Tesori della Rovina* (Chien-Pao, Ting-Lu, Wo-Chien, Chi-Yu).

---

### 💎 Fase 3: Meccaniche di Lotta Avanzate & Strumenti
- [x] **💎 Terastallizzazione (Terastal)**: meccanica di Gen 9 per Terastallizzare un Pokémon in battaglia (+25% potenza del tipo Tera con pulsante dedicato e sincronizzazione potenza).
- [x] **🎒 Strumenti Tenuti (Held Items)**: integrazione strumenti passivi in battaglia (Assorbosfera +20%, Resti +10%, Stolascelta +15%, Baccamela).

---

### ⚔️ Fase 4: Modalità di Gioco & Sfide (Challenge Modes)
- [x] **💀 Nuzlocke Hardcore**: attivabile sulla schermata di selezione starter — morte permanente, badge visivo, moltiplicatore punteggio x1.5.
- [x] **📐 Bivi post-game dinamici**: pool di 20+ bivi speciali con shuffle deterministico basato su `postgameRound`.
- [x] **🎲 Randomizer Mode** *(riattivata in v8.6, vedi sopra)*
- [x] **🔥 Mono-Type Challenge** *(riattivata in v8.6, vedi sopra)*
- [ ] **⏱️ Speedrun / Choice Timer**: tracciamento del numero di decisioni effettuate e tempo trascorso.

---

## 🐛 TODOLIST / Fix — Storico (✅ Risolto in v8.6)

Randomizer Mode e Mono-Type Challenge erano **strutturalmente implementate** in `challengeEngine.js` ma disabilitate perché causavano un **loop di re-render infinito** in React.

### Causa del Bug (comune a Randomizer e Mono-Type)

Il filtro veniva applicato durante il render React chiamando `filterEncounterPoolByChallenge(pool, state)` direttamente nel render path. Questa funzione usava `Math.random()` internamente, producendo output diverso ad ogni chiamata → React rileva props cambiate → re-render → loop → freeze del browser.

### Fix applicato (v8.6)

Il filtraggio è stato spostato **a monte**, dentro `goTo()` in `src/hooks/useGameState.js`: ogni volta che un `patch` passato a `goTo()` contiene `pendingEncounterPool` (e non è un incontro leggendario, vedi sotto), viene filtrato lì una volta sola e il risultato salvato in `state.pendingEncounterPool`, stabile tra i render. Lo starter viene filtrato allo stesso modo in `SceneRouter.js` con `filterStartersByChallenge`. Il toggle UI è in `GenerationSelectScreen.js`.

Un secondo bug emerso applicando il fix: il filtro veniva applicato anche ai pool di incontro leggendario (un solo id) — se il leggendario rollato non era del tipo scelto, il fallback del filtro lo sostituiva con un Pokémon comune qualsiasi dello stesso tipo. Risolto escludendo esplicitamente `pendingEncounterIsLegendary: true` dal filtro.

---

### 🏆 Fase 5: Sistema di Achievement, Impostazioni & QoL
- [ ] **⚙️ Pannello Impostazioni (Settings Modal)**:
  - Tasso di Shiny (*Default 1/500*, *Aumentato 1/100*, *Disattivato*).
  - Velocità del testo e animazioni delle battaglie.
  - Selettore Lingua (Italiano, Inglese, Spagnolo).
- [ ] **🎨 Temi Visivi Personalizzabili**: selettore di temi per l'interfaccia (Dark Synthwave, Retro GameBoy Green, Classic Emerald, Cyberpunk).
- [ ] **🏆 Medagliere Trofei & Achievement**: schermata consultabile dall'Header con trofei sbloccabili tra cui:
  - 🌟 *"Luccichio Epico"*: Cattura il tuo primo Pokémon Shiny.
  - 👑 *"Master Nuzlocke"*: Completa una regione in modalità Nuzlocke senza perdere l'intera squadra.
  - 🌋 *"Monte Argento"*: Sconfiggi Rosso Leggendario nel post-game.
  - 🌍 *"Gran Maestro dei Continenti"*: Conquista tutte e 9 le regioni in una sola run.
- [x] **🎨 Carte Bivio in Griglia 2x2 con Border Glow**: layout a griglia con sfondi sfumati a tema per le scelte di esplorazione e bordi illuminati al passaggio del mouse.
- [ ] **📊 Indicatore Visivo Dinamico Probabilità di Vittoria**: barra a colori cangianti (Rosso/Giallo/Verde) con riempimento animato durante la scelta della tattica di battaglia.
- [ ] **📱 Header Responsive Compatto Mobile**: raggruppamento dei pulsanti dell'header sotto un menu a tendina "⚙️ Menu / Extra" su schermi piccoli.
- [ ] **🎉 Effetti Particellari (Sparkles & Confetti)**: animazione con brillantini e coriandoli d'oro durante catture Shiny, evoluzioni e vittorie importanti.
- [x] **⚡ Display Potenza Complessiva della Squadra**: indicatore visivo "⚡ Potenza Squadra: XXX" nel pannello laterale per confrontarla immediatamente con quella degli avversari.
- [x] **📐 Layout Griglia 2x3 Perfetto per il Team Panel**: struttura CSS Grid a 3 colonne per mantenere la squadra ordinata e bilanciata.
- [x] **📥 Gestione Flessibile del Box (Deposita / Ritira)**: possibilità di ritirare Pokémon dal Box se la squadra ha slot liberi (< 6) o depositare membri senza obbligo di scambio 1:1.
- [x] **↕️ Quick-Swap Posizione Pokémon**: pulsanti ◄ / ► sulle schede della squadra per riordinare la posizione dei Pokémon con un solo click.

---

### 📡 Fase 6: Integrazione Avanzata PokéAPI & Caching Locale (Offline-First)
- [ ] **🔊 Versi Audio Ufficiali dei Pokémon (`cries`)**: riproduzione del ruggito/verso originale del Pokémon (formato `.ogg` da `PokeAPI/cries`) ad ogni incontro, cattura ed evoluzione.
- [ ] **📖 Voci del Pokédex e Descrizioni in Italiano (`/pokemon-species`)**: descrizioni enciclopediche ufficiali in lingua italiana consultabili nel modale Pokédex.
- [ ] **🎒 Sprite Pixel Ufficiali degli Strumenti & Bacche (`/item`)**: visualizzazione degli sprite pixel ufficiali di Poké Ball, Pozioni, Pietre Evolutive e Caramelle Rare nel PokéMart ed Inventario.
- [ ] **🌴 Varianti Regionali & Forme Mega/Gigamax (`/pokemon-form`)**: supporto completo agli sprite e dati per forme d'Alola, Galar, Hisui e Paldea.
- [ ] **⚡ Dettaglio Mosse & Icone Tipi (`/type` & `/move`)**: visualizzazione icone tipi e mosse firma in battaglia con potenza e precisione.
- [ ] **📊 Base Stats Ufficiali (`/pokemon`)**: integrazione delle 6 statistiche base (PS, Attacco, Difesa, SpAtk, SpDef, Velocità) e Somma Statistiche (BST) per un calcolo di potenza ancora più accurato.
- [ ] **🎭 Nature dei Pokémon (`/nature`)**: assegnazione della Natura (es. *Decisa*, *Modesta*, *Timida*, *Sicura*) con un bonus/malus passivo del +10%/-10% alla potenza in battaglia.
- [ ] **♂️ Genere & Differenze di Forma (`/pokemon-species`)**: visualizzazione del genere ♂️ / ♀️ nella squadra e supporto alle varianti visive basate sul genere (es. Pikachu coda a cuore ♀️, Pyroar ♂️/♀️).
- [ ] **🌌 Condizioni di Evoluzione Avanzate (`/evolution-chain`)**: evoluzioni legate al ciclo Giorno/Notte (Espeon/Umbreon), Felicità o Pietre Evolutive specifiche.
- [ ] **📖 Numerazione Pokédex Regionale (`/pokedex`)**: visualizzazione del numero Pokédex ufficiale della regione attiva (es. Kanto #001-#151, Paldea #001-#400) oltre al numero Nazionale.
- [ ] **🚀 Architettura Caching Locale & Offline-First**:
  - Script Node `scripts/fetch-pokeapi-assets.js` per pre-scaricare periodicamente le descrizioni in italiano ed i dati in file JSON locali.
  - Caching intelligente nel browser tramite `CacheStorage` / `IndexedDB` per azzerare le chiamate di rete ripetute, garantire caricamenti istantanei a latenza zero e rendere il gioco 100% giocabile offline.
