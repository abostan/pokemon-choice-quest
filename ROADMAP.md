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
  - 🐛 **Fix**: `npm start` poteva incappare in `EADDRINUSE: address already in use 127.0.0.1:3000` non gestito (crash immediato) se un processo `node` precedente non veniva chiuso e restava aggrappato alla porta — capitato più volte con processi server avviati per verifiche Playwright durante lo sviluppo, specie perché su questo setup Windows/Git Bash `kill %N` su un job in background non termina in modo affidabile un `node.exe` nativo (va usato `Stop-Process`/`taskkill` sul PID reale). Risolto rendendo `server.mjs` resiliente: alla `EADDRINUSE` prova automaticamente le porte successive (`3001`, `3002`, ... fino a 10 tentativi) invece di far crashare tutto, stampando chiaramente su quale porta è effettivamente partito. Nell'implementazione, un bug intermedio è emerso in verifica manuale: riusando lo stesso `Server` su più tentativi, il listener `"listening"` di un tentativo fallito (che non lo emette mai, solo `"error"`) restava agganciato anche al tentativo successivo — `.once` non basta a rimuoverlo da solo, va ripulito esplicitamente con `removeAllListeners` prima di ogni retry, altrimenti al bind riuscito scattano insieme sia il listener vecchio (con la porta sbagliata nel closure) sia quello nuovo, stampando due porte diverse come se fossero entrambe attive.
- [x] **📈 Nuovo `scripts/analyze-run-log.mjs` (`npm run logs`)**: legge i log reali in `logs/` e stampa un report con verdetto ⚠️/✅ automatico (dominazione bivi, ripetizioni identiche, scarto osservato/teorico su catture e battaglie), con soglie coerenti con `tests/explorePicker.test.js`.
- [x] **🐛 Fix icone medaglie/avatar avversario incoerenti**: `TeamPanel.js` e `BattleScene.js` indovinavano l'icona per string-matching sul nome della medaglia/titolo, in modo incoerente tra loro e fragile verso nomi nuovi — verificato che badge come "Medaglia Erba", "Medaglia Fuoco", "Medaglia Normale Paldea", "Medaglia Buio", "Medaglia Folletto", "Medaglia Lotta" e "Medaglia Ombra" non matchavano **nessuna** parola chiave e cadevano sull'icona generica 🏅. Sostituito con una mappa tipo→icona condivisa (`getTypeIcon` in `data/types.js`) risolta tramite il tipo reale del capopalestra (`getBadgeType` in `data/generations.js`, che lo ricava dal titolo "di tipo X", non dal nome estetico della medaglia). Spettro ha ora un'icona propria (👻) invece di condividere quella di Psico (🔮).
- [x] **⚖️ Iper Pozione ora più forte della Super Pozione**: +18 → +24 Potenza in battaglia (prima identica alla Super Pozione pur costando 3💰 contro 2💰).
- [x] **📝 Documentato il fallback euristico delle abilità passive** (`data/abilities.js`): commento esplicito che l'assegnazione per modulo dell'id (es. Weedle → Acceleratore) è riempimento arbitrario, non dati ufficiali dei giochi.
- [x] **🐛 Fix crash "Cannot read properties of null (reading 'starterIds')" al cambio regione**: bug preesistente (non introdotto in questa versione) segnalato da un giocatore reale. `nextGenId` (impostato al passaggio tra una Lega e la successiva) non era incluso nel whitelist di `saveSanitizer.js`: se si resta sulla schermata "nuova regione" e il gioco si ricarica/riprende (refresh, o Home → Riprendi), il campo va perso e cliccando "Esplora" `generationId` diventa `undefined`, mandando in crash `SceneRouter`. Aggiunto `nextGenId` a `initialState()` e al sanitizzatore; aggiunto anche un guardrail in `LeagueSceneContainer.js` che torna alla schermata Salvataggi invece di andare in crash se `nextGenId` risultasse comunque non valido. Riprodotto e verificato risolto iniettando un salvataggio nello stato esatto del bug report.
- [x] **🎨 Consolidati i colori CSS duplicati** (`BattleScene.js`, `TeamPanel.js`, `PokeCenterScene.js`, `HallOfFameModal.js`, `ScoreCardModal.js`, `NuzlockeGameOverScreen.js`): 16 esadecimali usati ripetutamente con valori leggermente diversi tra loro (es. più "rossi pericolo" diversi) sostituiti con le custom property esistenti (`--danger`, `--success`, `--text-dim`, `--text`) o nuovi token semantici condivisi (`--gold`, `--gold-light`, `--mega`, `--mega-light`, `--tera`, `--tera-light`, `--danger-dark`, `--panel-darker`). Nessun colore duplicato rimasto, nessuna differenza visiva (verificato in browser).
- [x] **📐 Sistema di 3 livelli di enfasi visiva riutilizzabili**: nuove classi CSS `.badge-status` (stato permanente: Nuzlocke/Randomizer/Mono-Tipo/Mega-Tera attivi), `.control-action` (pulsanti Mega/Tera) e `.info-chip` (abilità attive) al posto di uno stile inline nuovo per ogni feature — stessa resa visiva di prima, struttura condivisa.
- [x] **❓ Modale di onboarding al primo avvio** (`OnboardingModal.js`): 4 pannelli che spiegano il loop centrale (bivi, cattura, tattiche di battaglia, Mega/Tera/Box), mostrato una sola volta (flag in `localStorage`, indipendente dagli slot di salvataggio) e riapribile in qualsiasi momento dal pulsante "❓ Come si gioca" nell'header.
- [x] **📝 Corretto il testo Nuzlocke fuorviante** (3.3): non descrive più "1 solo tentativo di cattura per tappa" come regola esclusiva Hardcore — nessuna modalità offre mai un secondo tentativo sullo stesso incontro, quindi il testo era fuorviante.
- [x] **♿ Accessibilità da tastiera per tutti i modali** (4.3): nuovo hook `useModalA11y` (`PokedexModal`, `BoxModal`, `HallOfFameModal`, `ScoreCardModal`, `OnboardingModal`) — chiusura con `Esc`, `role="dialog"` / `aria-modal="true"`, focus intrappolato dentro il modale (Tab non esce più verso la pagina sotto), focus spostato automaticamente all'apertura.
- [x] **📱 Breakpoint mobile aggiuntivi** (4.1): nuovo `@media (max-width: 480px)` — padding ridotto, `team-matrix-grid` da 3 a 2 colonne (il `TeamPanel` era il componente più denso), pulsanti header più compatti e con `flexWrap` corretto (prima potevano uscire dallo schermo su telefoni stretti invece di andare a capo). Verificato: nessun overflow orizzontale a 375px di larghezza.
- [x] **👆 Tooltip descrizioni raggiungibili anche su touch** (4.2): nuovo `TapTooltip.js` — tocca per aprire una bolla con la stessa descrizione dell'attributo `title` (invisibile su touch), tocca altrove per chiuderla. Applicato alle chip abilità (`TeamPanel.js`) e agli strumenti in battaglia (`BattleScene.js`, con una ⓘ separata dal pulsante d'uso per non consumare l'oggetto per sbaglio toccando per informarsi). Le descrizioni del Box/zaino erano già visibili come testo, non serviva intervenire lì.

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
- [x] **⚙️ Pannello Impostazioni (Settings Modal) — Tasso di Shiny**: nuovo `SettingsModal.js` + `engine/settings.js` (persistenza globale in `localStorage`, stesso criterio del mute audio). 3 modalità — *Default* (1/500 normali, 1/20 leggendari), *Aumentato* (1/100 normali, 1/4 leggendari), *Disattivato* (mai Shiny) — applicate in `EncounterScene.js`.
  - [ ] Velocità del testo e animazioni delle battaglie — rimandato: oggi non esiste alcun sistema di animazione/rivelazione testo da rendere configurabile, andrebbe costruito da zero.
  - [ ] Selettore Lingua (Italiano, Inglese, Spagnolo) — rimandato: richiederebbe tradurre l'intero gioco, sforzo molto più grande di una singola voce di backlog.
- [x] **🎨 Temi Visivi Personalizzabili**: nuovo `engine/theme.js` + selettore nel pannello Impostazioni. 5 temi (Dark Classic/default, Dark Synthwave, Retro GameBoy Green, Classic Emerald, Cyberpunk), ognuno un blocco `:root[data-theme="X"]` in `styles.css` che sovrascrive gli stessi token già usati ovunque (`--bg`, `--panel`, `--accent`, `--text`...) — nessun componente sa quale tema è attivo. Applicato subito al click (feedback immediato) e persistito in `localStorage`, applicato prima del primo render in `main.js` per evitare un flash del tema di default.
- [x] **🏆 Medagliere Trofei & Achievement**: nuovo `AchievementsModal.js` + `engine/achievements.js` (persistenza globale in `localStorage`, come la Sala della Fama storica — traguardi sull'insieme delle run, non per singolo salvataggio), consultabile dal pulsante "🏆 Trofei" nell'header. 4 trofei implementati:
  - 🌟 *"Luccichio Epico"*: Cattura il tuo primo Pokémon Shiny — sbloccato in `usePokedexState.markCaught`.
  - 👑 *"Master Nuzlocke"*: Completa una regione in modalità Nuzlocke senza perdere l'intera squadra — sbloccato alla vittoria sul Campione con `state.isNuzlocke` attivo (se il team fosse stato spazzato del tutto, il run si sarebbe fermato prima a `nuzlockeGameOver`, quindi arrivarci implica non averlo mai perso).
  - 🌋 *"Monte Argento"*: Sconfiggi Rosso Leggendario nel post-game — sbloccato alla vittoria contro l'"Allenatore Leggendario Rosso" in `SceneRouter.js`.
  - 🌍 *"Gran Maestro dei Continenti"*: Conquista tutte e 9 le regioni in una sola run — sbloccato quando `completedGensCount` raggiunge `GENERATIONS.length` al termine dell'ultima regione della catena.
- [x] **🎨 Carte Bivio in Griglia 2x2 con Border Glow**: layout a griglia con sfondi sfumati a tema per le scelte di esplorazione e bordi illuminati al passaggio del mouse.
- [x] **📊 Indicatore Visivo Dinamico Probabilità di Vittoria**: `computeWinChance` (già esistente, prima calcolato solo dopo aver scelto la tattica) ora chiamato in anteprima per tutte e 3 le tattiche mentre sono ancora selezionabili — una barra colorata (rosso <40%, oro 40-65%, verde >65%) con percentuale sotto ciascuna card di `BattleScene.js`, così la scelta è informata invece che alla cieca.
- [x] **📱 Header Responsive Compatto Mobile**: gli 8 pulsanti dell'header (Audio, Home, Pokédex, Impostazioni, Trofei, Come si gioca, Sala della Fama, Punteggio) sono definiti una sola volta e renderizzati in due modi — fila completa da tablet in su, menu "☰ Menu" a tendina sotto i 640px (chiusura al click fuori o su una voce). Verificato: a 400px la fila piena resta nascosta, il toggle mostra tutti gli 8 elementi ed apre correttamente il modale scelto.
- [x] **🎉 Effetti Particellari (Sparkles & Confetti)**: nuovo `ParticleBurst.js`, puro CSS + emoji (nessuna dipendenza esterna). Brillantini ✨ su cattura Shiny (`EncounterScene.js`) ed evoluzioni (`EvolutionNotice.js`); coriandoli 🎉 sulle vittorie importanti tramite nuova prop `celebrateOnWin` di `BattleScene.js`, attivata sulla vittoria contro il Campione e sulla finale del Torneo dei Campioni (non su ogni battaglia).
  - 🐛 **Fix**: sulla schermata Evoluzione le particelle apparivano intrappolate in una riga orizzontale invece di cadere su tutto lo schermo. Causa: `.evo-overlay` ha `backdrop-filter: blur()`, che crea un nuovo "containing block" per i discendenti `position: fixed` (li confina al riquadro dell'antenato invece che al viewport — una delle sorprese meno note del CSS). Risolto renderizzando `ParticleBurst` via `createPortal` direttamente su `document.body` (aggiunto `react-dom` all'import map in `index.html`, prima mappato solo `react-dom/client`), immune a qualsiasi filter/transform di un antenato indipendentemente da dove viene montato nell'albero React.
- [x] **⚡ Display Potenza Complessiva della Squadra**: indicatore visivo "⚡ Potenza Squadra: XXX" nel pannello laterale per confrontarla immediatamente con quella degli avversari.
- [x] **📐 Layout Griglia 2x3 Perfetto per il Team Panel**: struttura CSS Grid a 3 colonne per mantenere la squadra ordinata e bilanciata.
- [x] **📥 Gestione Flessibile del Box (Deposita / Ritira)**: possibilità di ritirare Pokémon dal Box se la squadra ha slot liberi (< 6) o depositare membri senza obbligo di scambio 1:1.
- [x] **↕️ Quick-Swap Posizione Pokémon**: pulsanti ◄ / ► sulle schede della squadra per riordinare la posizione dei Pokémon con un solo click.

---

### 📡 Fase 6: Integrazione Avanzata PokéAPI & Caching Locale (Offline-First)
- [x] **🔊 Versi Audio Ufficiali dei Pokémon (`cries`)**: `usePokemon.js` ora espone anche `data.cry` (URL `.ogg` da `data.cries.latest`, già incluso nella risposta di `/pokemon/{id}`). Nuova `playPokemonCry(url)` in `soundEngine.js` — usa l'elemento `<audio>` nativo, non l'oscillatore Web Audio dei jingle sintetizzati esistenti in quel file, perché qui è un file audio reale. Riprodotto alla rivelazione dell'incontro selvatico (`EncounterScene.js`) e alla nuova forma di un'evoluzione accettata (`EvolutionNotice.js`) — non ripetuto anche sulla cattura per evitare di far sentire due volte lo stesso verso a pochi secondi di distanza. Verificato con una richiesta di rete reale verso `PokeAPI/cries` (status 206, streaming audio).
  - 🐛 **Fix**: dopo questa modifica un giocatore ha riscontrato `SyntaxError: ... does not provide an export named 'playPokemonCry'`. Causa: `server.mjs` non mandava header anti-cache, quindi il browser aveva ancora in cache la vecchia versione di `soundEngine.js` mentre `EvolutionNotice.js` (modificato più di recente) veniva ricaricato fresco — importava un export non presente nella versione cache. Il file su disco era corretto fin dall'inizio. Risolto aggiungendo `Cache-Control: no-cache, no-store, must-revalidate` a tutte le risposte statiche di `server.mjs`, così una modifica al codice non resta mai invisibile dietro la cache del browser durante lo sviluppo.
- [x] **📖 Voci del Pokédex e Descrizioni in Italiano (`/pokemon-species`)**: nuovo `hooks/usePokemonSpecies.js` (stesso pattern cache-in-memoria di `usePokemon.js`) + pannello dettaglio in `PokedexModal.js`, apribile cliccando una specie già scoperta (griglia o lista). Mostra sprite, tipi, "genus" (es. "Pokémon Seme") e la descrizione Pokédex ufficiale in italiano più recente tra quelle disponibili per la specie. Caricata su richiesta per la sola specie selezionata, non per tutte le 1025 in una volta, per non intasare PokeAPI. Verificato con dati reali da PokeAPI (Bulbasaur, Charmander).
- [x] **🎒 Sprite Pixel Ufficiali degli Strumenti & Bacche (`/item`)**: nuovo `hooks/useItemSprite.js` (cache in memoria, stesso pattern di `usePokemon.js`) + componente `ItemIcon.js`, usato in PokéMart (`PokeCenterScene.js`), Zaino (`TeamPanel.js`) e strumenti in battaglia (`BattleScene.js`). Mappa `ITEM_POKEAPI_SLUGS` in `data/items.js` collega ~16 nomi italiani agli slug ufficiali PokeAPI (es. "Super Pozione" → `super-potion`) — solo per gli strumenti di cui sono ragionevolmente sicuro corrispondano a un oggetto reale dei giochi. Diversi nomi in questo gioco sono invenzioni di sapore senza equivalente ufficiale certo (es. "Biscotto Lavarone", "Galletta di Yantar", "Pietra Metallica"): per quelli niente slug, `ItemIcon` ripiega sull'emoji esistente invece di rischiare uno sprite sbagliato/fuorviante. Verificato: 5/5 sprite reali nel PokéMart, fallback emoji corretto per gli strumenti non mappati.
- [x] **🔮 Sprite Reali per Megaevoluzione/Gigamax (`/pokemon-species` → `varieties`)**: nuovo `hooks/useMegaSprite.js` (stesso pattern cache-in-memoria, due livelli: lista varietà per specie + sprite per varietà). Quando Mega/Gigamax è attivo in battaglia, ogni scheda squadra in `TeamPanel.js` interroga `varieties` della specie e cerca una forma con suffisso `-mega-x`, `-mega-y`, `-mega` o `-gmax` (in quest'ordine di priorità, così Charizard/Mewtwo mostrano X/Y invece di una scelta arbitraria); se trovata, sostituisce lo sprite normale con quello ufficiale della forma e aggiunge bordo viola + 🔮. Interrogato solo mentre Mega è attivo, per non sprecare chiamate a riposo. Specie senza alcuna variante Mega/Gigamax restano con lo sprite normale (il bonus +30% potenza si applica comunque a tutta la squadra, invariato). Verificato dal vivo: Charizard mostra Mega X, e — correttamente, non un bug — anche Pikachu mostra uno sprite alternativo perché possiede davvero una forma Gigamax ufficiale su PokeAPI (`pikachu-gmax`, introdotta in Spada/Scudo).
  - ⏸️ **Deferred**: supporto completo alle varianti regionali (Alola/Galar/Hisui/Paldea) NON incluso in questo step — è uno scope nettamente più ampio (specie diverse con Pokédex/stat/movepool propri, non solo uno sprite alternativo). Scelta esplicita dell'utente: "Solo sprite Mega/Gigamax per ora".
- [x] **⚡ Dettaglio Mosse & Icone Tipi (`/type` & `/move`)**: nuovo `data/movePicker.js` (funzione pura `pickSignatureMove`, testabile in isolamento) sceglie la "mossa firma" di una specie dall'array `moves` grezzo di `/pokemon/{id}` — la mossa imparata per livello (level-up) al livello più alto, criterio semplice che in pratica seleziona quasi sempre la mossa più iconica imparata naturalmente (es. Charizard → Flare Blitz lv.66, non una mossa base lv.1). `usePokemon.js` la espone come `data.signatureMoveRef` ({name, url}). Nuovo `hooks/useSignatureMove.js` fa il fetch dei dettagli reali (`/move/{id}`: potenza, precisione, tipo, nome italiano se disponibile) solo su richiesta, con cache in memoria condivisa per mossa. `PokemonChip` (`PokemonSprite.js`) accetta ora un prop `showMove` (default `false`, per non aggiungere fetch extra ovunque il chip è già usato, es. anteprima Box) che aggiunge l'icona del tipo primario e, al tap (`TapTooltip`), la mossa firma con potenza/precisione — attivato sulla sola squadra avversaria in `BattleScene.js`, coerente con lo scope "in battaglia" di questa voce. Le icone dei tipi restano gli emoji esistenti (`TYPE_ICONS` in `data/types.js`, già usati per medaglie/badge) invece di sprite `/type` scaricati da PokeAPI: nessun beneficio reale nel sostituire un set completo e già funzionante di 18 icone con richieste di rete aggiuntive — aggiunta solo una variante `getTypeIconFromSlug()` indicizzata sullo slug inglese di PokeAPI (`data.types` restituisce "fire"/"water", non "Fuoco"/"Acqua"). Verificato dal vivo: chip avversario Geodude in battaglia mostra 🏔️, al tap "Sdoppiatore — Potenza 120 / Precisione 100%" (Double-Edge, dati reali corretti). 2 nuovi test unitari (20/20 passano).
- [x] **📊 Base Stats Ufficiali (`/pokemon`)**: `usePokemon.js` espone ora anche `data.stats` (6 statistiche base) e `data.bst` (somma). Nuovo `hooks/useTeamStats.js` recupera il BST di tutta la squadra (riusando la stessa cache di `usePokemon.js`, nessuna richiesta doppia) e lo passa a `computeTeamPower(team, statsById)` in `battleLogic.js`. Scelta di design deliberata sul *come* integrarlo, per non dover ricalibrare i ~200 valori `opponentPower` hand-tuned in `generations.js`/`championsTournament.js`: ogni specie riceve un moltiplicatore di potenza `computeStatMultiplier(bst)` clampato 0.7×–1.4× in base allo scostamento del suo BST dalla media di riferimento (`AVERAGE_BST = 430`, media approssimativa tra tutte le ~1000 specie) — una squadra di specie "nella media" produce la stessa potenza di prima (calibrazione esistente intatta), mentre leggendari/pseudo-leggendari (es. Mewtwo, BST 680) pesano di più e specie notoriamente deboli (es. Magikarp, BST 200) pesano di meno. Dato mancante/non ancora caricato → moltiplicatore neutro 1.0, per non far "saltare" la potenza mostrata durante il fetch. Usato sia in `TeamPanel.js` (badge Potenza Squadra + BST nel tooltip di ogni scheda) sia in `BattleScene.js` (stesso input a `computeWinChance`, quindi ora incide realmente sull'esito della battaglia). Aggiunte anche 6 barre statistiche + Totale nel pannello di dettaglio del Pokédex (`PokedexModal.js`) per rendere il dato visibile, non solo un moltiplicatore nascosto. Verificato dal vivo: squadra Mewtwo+Magikarp stesso livello → potenza 88 contro 84 di una squadra "nella media" (calcolo motore e badge in-game combaciano esattamente); barre statistiche di Magikarp nel Pokédex corrispondono ai valori reali PokeAPI (PS 20/Atk 10/Def 55/SpA 15/SpD 20/Vel 80 = 200). 2 nuovi test unitari (18/18 passano).
- [ ] **🎭 Nature dei Pokémon (`/nature`)**: assegnazione della Natura (es. *Decisa*, *Modesta*, *Timida*, *Sicura*) con un bonus/malus passivo del +10%/-10% alla potenza in battaglia.
- [ ] **♂️ Genere & Differenze di Forma (`/pokemon-species`)**: visualizzazione del genere ♂️ / ♀️ nella squadra e supporto alle varianti visive basate sul genere (es. Pikachu coda a cuore ♀️, Pyroar ♂️/♀️).
- [ ] **🌌 Condizioni di Evoluzione Avanzate (`/evolution-chain`)**: evoluzioni legate al ciclo Giorno/Notte (Espeon/Umbreon), Felicità o Pietre Evolutive specifiche.
- [ ] **📖 Numerazione Pokédex Regionale (`/pokedex`)**: visualizzazione del numero Pokédex ufficiale della regione attiva (es. Kanto #001-#151, Paldea #001-#400) oltre al numero Nazionale.
- [ ] **🚀 Architettura Caching Locale & Offline-First**:
  - Script Node `scripts/fetch-pokeapi-assets.js` per pre-scaricare periodicamente le descrizioni in italiano ed i dati in file JSON locali.
  - Caching intelligente nel browser tramite `CacheStorage` / `IndexedDB` per azzerare le chiamate di rete ripetute, garantire caricamenti istantanei a latenza zero e rendere il gioco 100% giocabile offline.

---

### 🧬 Fase 7: Approfondimenti Mega/Oggetti & Meccaniche di Battaglia (idee da valutare, confronto con Pokemon Roulette)
- [ ] **🔮 Megaevoluzione vincolata alla squadra reale**: oggi il bottone Mega (`BattleScene.js`) è sempre disponibile con `hasTeam` e dà +30% flat a tutta la squadra, indipendentemente dal fatto che tu abbia davvero una specie mega-capace — solo lo sprite (`useMegaSprite.js`) cambia visivamente per le specie che hanno una varietà `-mega`/`-gmax` reale. Da valutare una tabella dati `megaCapableSpecies.js` per: (A) disabilitare/nascondere il bottone se in squadra non c'è nessuna specie mega-capace, oppure (B) scalare il bonus in base a quanti membri della squadra sono davvero mega-capaci invece di un flat all-or-nothing.
- [ ] **🎒 Strumenti tenuti per singolo Pokémon**: oggi i bonus da strumento (`items.js`) sono applicati come bonus di squadra piatto. Da valutare l'assegnazione di uno strumento tenuto a un singolo membro della squadra (più fedele ai giochi ufficiali) invece che a tutta la squadra insieme.
- [ ] **🍇 Bacche con effetti situazionali**: oggetti che curano una % di PS o rimuovono uno stato invece di dare solo +Potenza fissa, per differenziarle dalle pozioni.
- [ ] **🎁 Oggetti tematici per bivio**: pool di ricompense specifiche per certi bivi (es. la Zona Safari droppa i suoi oggetti propri) invece di attingere sempre allo stesso pool generico del PokéMart.
- [ ] **⚔️ Battaglie doppie / sinergia di tipo in squadra**: bonus di potenza per combinazioni di tipo complementari tra i 6 membri, oggi la potenza è pura somma senza sinergie.
- [ ] **🥊 Rivale ricorrente con squadra in evoluzione**: oggi il Rivale è un singolo scontro a metà percorso; da valutare farlo ricomparire più volte lungo la run con una squadra che cresce insieme alla tua.
- [ ] **🎯 Sistema di mosse reali con potenza/precisione in battaglia**: estendere il lavoro già fatto in `useSignatureMove.js`/`movePicker.js` (oggi mostra solo la mossa firma come info) verso un vero calcolo dell'esito di battaglia basato su mosse e tipi reali, invece delle "tattiche narrative" attuali (idea di lungo periodo già citata in `README.md`).

---

### 🩺 Fase 8: Bug & Miglioramenti da Segnalazione Utente (Backlog — 23/08/2026)

**Quick win (banale/medio, basso rischio):**
- [ ] **💾 Più slot di salvataggio**: hardcoded a 3 in `DEFAULT_SLOTS` (`src/engine/saveGame.js:7`) + riferimento testuale in `ResumeScreen.js:136`. La UI è già generata dinamicamente dagli slot, basta allargare l'array e il testo.
- [ ] **🏷️ Tipo di partita nella card dello slot**: `savedState` include già `isNuzlocke`/`isRandomizer`/`monoType` (già sanificati in `saveSanitizer.js`), basta leggerli e mostrarli in `SlotCard` (`ResumeScreen.js`) accanto a regione/progresso/livello.
- [ ] **🎒 Raggruppare oggetti duplicati con quantità (es. "Pozione x12")**: oggi `items` è un array con duplicati e `TeamPanel.js` (righe ~262-274) renderizza una `<li>` per ogni copia. Aggiungere un raggruppamento *solo visuale* (reduce per nome + conteggio) prima del `.map`, senza toccare la struttura dati sottostante (usata per indice da `useItem`/uso in battaglia/Master Ball in `EncounterScene.js`).
- [ ] **🏆 Master Ball garantita a fine Lega**: oggi la Master Ball si ottiene solo da acquisto PokéMart, Casinò/Mercante postgame (25%), o boss Team Malvagio (solo in Kanto/Hoenn/Sinnoh/Kalos/Galar — non in Johto/Unova/Alola/Paldea, che danno Caramella Rara). Nessuna fonte è legata alla vittoria su Capopalestra/Alto Comando/Campione. Aggiungere `addItem("Master Ball")` nel blocco vittoria contro il Campione in `LeagueSceneContainer.js`.
- [ ] **🛒 Mercante Ambulante: dare davvero una scelta**: oggi selezionare il bivio "Mercante Ambulante" (`ExploreSceneContainer.js:585-601` pre-postgame, `:117-128` postgame) assegna subito un oggetto casuale dal pool **gratis**, nonostante il testo dica "Acquista...". Nessuna delle due varianti scala `state.coins`. Da trasformare in una sotto-schermata con una voce a costo per ciascun oggetto del pool, riusando il pattern già presente in `PokeCenterScene.js` (`SHOP_ITEMS` + `handleBuy`).

**Bug di correttezza (priorità alta):**
- [ ] **🔥 Fix filtro Mono-Type Challenge da Johto in poi**: causa reale identificata — non è un problema di reset dello stato al cambio regione (quel meccanismo funziona correttamente), ma la copertura incompleta di `POKEMON_TYPES` (`src/data/types.js:42-169`, quasi solo Kanto + pochi starter iconici). Per gli id non mappati, `getPokemonType()` (righe 176-184) ricade su un fallback finto `id % 8`, scollegato dal tipo reale della specie — il filtro mono-tipo "funziona" tecnicamente ma filtra su un tipo inventato, lasciando passare Pokémon di tipo diverso da quello scelto in Johto/Hoenn/Sinnoh/ecc. Da risolvere completando `POKEMON_TYPES` con gli id effettivamente usati nei pool di `generations.js`, o facendo sì che il filtro di sfida ignori gli id senza tipo reale invece di affidarsi al fallback modulare.

**Da discutere in fase di design (richiedono decisioni prima di implementare):**
- [ ] **🎰 Casinò Razzo**: oggi non è un vero casinò — nessuna puntata scelta dal giocatore, roll automatico a probabilità fisse all'apertura del bivio (25/40/35% pre-postgame). Da valutare se aggiungere una UI di puntata con payout proporzionale, o lasciarlo come minigioco "a slot" attuale.
- [ ] **💎 Vero Tipo Tera per la Terastallizzazione**: oggi è solo un moltiplicatore flat +25% potenza, senza alcun tipo Tera calcolato o assegnato per specie — il testo "Tipo Tera" è puro flavor. Da valutare l'assegnazione di un tipo Tera per Pokémon (fisso via dato o random) integrato con `computeTypeEffectiveness` (`src/engine/typeMatchup.js`) e visibile in UI.
- [ ] **☀️ Meteo differenziato per tipo + feedback visibile**: il ROADMAP segnava questa voce come completata (Fase 1) ma di fatto esiste una sola variante generica "microclima" con bonus fisso (+2 livelli, 1 Super Pozione) — le 4 condizioni nominate nel testo (Sole Intenso, Pioggia Battente, Tempesta di Sabbia, Nebbia) non hanno mai avuto logica di tipo o feedback distinti. Da rifare come 4 varianti pesate con tipo target/moltiplicatore diretto o inverso e un messaggio esplicito su cosa è stato applicato.
- [ ] **🩹 Dare un senso meccanico a "Cura la Squadra"**: il gioco non ha HP persistenti (le battaglie usano solo potenza squadra calcolata da livello+statistiche). Il pulsante di cura resetta `isFainted: false`, ma quel campo non è mai vero sui membri in squadra attiva (usato solo in Nuzlocke, dove il Pokémon viene rimosso, non flaggato) — oggi è un no-op puramente cosmetico (suono + messaggio). Da valutare l'introduzione di un'usura/malus persistente da battaglia in battaglia che la cura resetti davvero (tocca `battleLogic.js` e il flusso di risoluzione battaglie).

---

### 🏗️ Fase 9: Architettura & Tooling (confronto con Pokemon Roulette)
Spunti emersi confrontando struttura/tooling reali di [zeroxm/pokemon-roulette](https://github.com/zeroxm/pokemon-roulette) (Angular 21 + TypeScript, cartelle per feature, test Jasmine colocati, `ngx-translate`) con l'impostazione attuale di questo progetto (React via CDN senza build, JS non tipizzato, cartelle per tipo, test centralizzati in `tests/`). Non urgenti alla scala attuale, ma da tenere d'occhio se il progetto continua a crescere:
- [ ] **🔷 Valutare migrazione (anche parziale) a TypeScript**: lo state di gioco (`useGameState.js` e derivati) è cresciuto parecchio dal refactoring di v8.5 — un typo in una chiave dello state oggi si scopre solo a runtime/test, con tipi si scoprirebbe a compile time. Da valutare anche solo JSDoc + `checkJs` come passo intermedio meno invasivo di una migrazione TS completa.
- [ ] **📂 Riorganizzazione cartelle per-feature invece che per-tipo**: oggi si separa per tipo (`components/`, `engine/`, `hooks/`, `data/`); se le feature continuano ad aumentare (vedi Fase 7), valutare un raggruppamento per funzionalità (component+logica+dati della stessa feature vicini) come fa l'originale con `wheel/`, `pokedex/`, `trainer-team/`.
- [ ] **🧪 Test colocati vicino al codice**: oggi tutti i test vivono in `tests/`, lontani dai file che testano; valutare di avvicinarli (es. `battleLogic.test.js` accanto a `battleLogic.js`) per rendere più immediato capire cosa ha/non ha coverage.
- [ ] **🌍 Infrastruttura i18n per l'estrazione stringhe**: base tecnica (dizionario centralizzato invece di stringhe italiane hardcoded nei componenti) come prerequisito per lo "Selettore Lingua" già segnato come rimandato in Fase 5 — oggi ogni stringa è inline nel JSX/`React.createElement`, quindi anche solo l'inglese richiederebbe toccare praticamente ogni componente.
