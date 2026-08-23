# 🔁 ROADMAP_V2 — Se riscrivessimo il gioco da zero

Questo documento **non è la roadmap del progetto attuale** (quella resta `ROADMAP.md`, che continua a tracciare cosa è stato fatto e cosa manca sull'800+ funzionalità già esistenti). È una risposta a una domanda diversa: *"con tutto quello che sappiamo ora, in che ordine scriveremmo questo tipo di gioco se ripartissimo da un repository vuoto?"*

Il progetto attuale è arrivato a 9 generazioni, decine di meccaniche e ~50 file funzionando bene, ma **quasi ogni bug reale che abbiamo trovato e risolto** (vedi `ROADMAP.md`, Fase 8 e Fase 10) nasce dallo stesso pattern: una feature scritta prima che la fondazione sotto di essa fosse pronta a sostenerla — logica di stato incastrata in un hook React invece che in un modulo puro testabile, contenuto scritto a mano prima di un validatore che ne controlli la coerità, meccaniche aggiunte come bonus piatto e vincolate "dopo" invece che pensate vincolate da subito. Questo documento riordina lo sviluppo per evitare quella classe di problemi fin dall'inizio, non per rincorrerli a posteriori.

Ogni milestone elenca **cosa costruire** e **perché in quell'ordine**, con riferimento diretto a un episodio reale di questo progetto quando ce n'è uno pertinente.

> **Aggiornamento**: le idee nate discutendo di come gestiamo oggi i pool di
> Pokémon (pool combinatori Generazione × Tipo invece di array curati a
> mano, registri unici per bivi/oggetti/achievement, type-checking dev-only)
> sono state integrate direttamente nelle milestone pertinenti (0, 0bis, 3,
> 4, 5, 7, 8, 10) invece di vivere in un documento separato — vedi
> `IDEE_REFACTORING_DATI.md` per la discussione originale, ora confluita qui.

---

## 🏛️ Milestone 0 — Decisioni fondazionali (prima di scrivere una sola feature)

Decisioni che costano pochissimo a monte e moltissimo a valle se rimandate — tutte cose che in questo progetto sono finite in backlog "da valutare" (`ROADMAP.md` Fase 9) invece che essere state decise all'inizio.

- **Build tooling, una volta sola**: zero-build (React da CDN, `React.createElement`) oppure TypeScript + build step. Non è una scelta sbagliata in sé (per questo progetto zero-build ha funzionato bene finché è rimasto piccolo), ma va presa *prima* di scrivere il primo componente — cambiarla a metà strada su 50+ file costa ordini di grandezza di più che deciderla al commit zero.
- **Type-checking leggero, dev-only, deciso insieme a "zero-build"**: le due cose non sono in conflitto — si può restare zero-build in produzione (il gioco continua a essere servito via CDN senza bundler) e avere comunque `JSDoc` (`@typedef`/`@param`) più uno script `npm run typecheck` (`tsc --checkJs --noEmit`, mai eseguito a runtime) o anche solo ESLint con le regole base (`no-undef`, `no-unused-vars`). **Episodio reale**: nella sessione che ha portato a questo documento, un refactor ha introdotto `export { MAX_LEVEL } from "..."` invece di un'importazione normale — sintatticamente valido, ma `MAX_LEVEL` non era un binding utilizzabile nello stesso file, causando un `ReferenceError` scoperto solo dall'utente in produzione (screenshot della console). `no-undef` l'avrebbe segnalato al salvataggio del file, `node --check` (usato di fatto come unica rete di sicurezza) valida solo la sintassi, non i binding.
- **Contratto/schema dei dati di contenuto**: definire fin da subito la forma esatta di "una generazione" (starter, tier di esplorazione, 8 capipalestra, alto comando, campione, rivale, boss, leggendari) come un contratto scritto — anche solo un commento o un tipo — invece di lasciare che emerga implicitamente scrivendo Kanto e poi copiando il pattern a mano per le altre 8 regioni.
- **i18n sì/no, deciso una volta**: se si vuole mai supportare più lingue, le stringhe vanno estratte in un dizionario dal primo componente, non dopo che decine di componenti hanno testo italiano inline nel JSX (situazione attuale, `ROADMAP.md` Fase 9).
- **CI attiva dal primo commit**: anche solo `npm test` su push, da subito — non aggiunta dopo 8 versioni quando i test esistono già ma nessuno li fa girare automaticamente.
- **Un solo documento "se ripartissimo da zero", non N**: anche la documentazione va decisa a Milestone 0 — un indice in cima al README che spiega a cosa serve ciascun file `.md` evita che si accumulino documenti che si sovrappongono senza che sia chiaro quale sia la fonte di verità (situazione che il progetto reale ha rischiato più volte, incluso durante la stesura di questo stesso documento).

---

## 🗂️ Milestone 0bis — Struttura delle cartelle

Diretta conseguenza delle decisioni di Milestone 0, e altrettanto costosa da cambiare a metà strada. Il progetto reale organizza per **tipo** (`components/`, `engine/`, `hooks/`, `data/`) — funziona bene fino a una certa scala, ma ha già mostrato due crepe concrete: `data/generations.js` è un unico file da 700+ righe con tutte e 9 le regioni impastate insieme, e un componente di battaglia (`BattleScene.js` in `components/`) vive lontano dal proprio hook (`useSignatureMove.js` in `hooks/`) pur essendo la stessa feature. Pokemon Roulette, sul lato opposto, organizza per **feature** (`wheel/`, `pokedex/`, `trainer-team/`), risolvendo quel problema ma perdendo la netta separazione fra "logica pura testabile" e "UI" che invece qui ha retto bene.

La struttura proposta è un ibrido deliberato: **tipo a livello radice, feature dentro il livello UI** — dove ciascuno dei due criteri rende di più.

```
src/
  main.js
  app/                        # shell applicativa: routing di fase, provider globali
    App.js
    SceneRouter.js

  core/                       # ⚠️ zero React, zero fetch — solo funzioni pure (Milestone 1)
    state/
      gameStateTransitions.js
      gameStateTransitions.test.js   # test colocato, non in una cartella tests/ separata
      initialState.js
      saveSanitizer.js
      saveSanitizer.test.js
    battle/
      battleLogic.js
      battleLogic.test.js
      typeMatchup.js
      typeMatchup.test.js
    capture/
      captureLogic.js
      captureLogic.test.js
    explore/
      explorePicker.js
      explorePicker.test.js
      poolBuilder.js           # Generazione × Tipo → pool di incontro (Milestone 3)
      poolBuilder.test.js
    achievements/
      achievementRules.js      # evento di gioco → quali achievement sblocca (pura, no UI)
      achievementRules.test.js
    economy/
      casinoLogic.js
      weatherLogic.js
    score/
      scoreLogic.js

  content/                    # dati di gioco + il loro validatore (Milestone 3/5)
    schema/
      generationSchema.js     # contratto esplicito: forma attesa di una generazione
      generationSchema.test.js # scorre TUTTE le regioni, verifica coerenza
    regions/
      kanto.js
      johto.js
      hoenn.js
      ...                    # una regione per file, non un unico generations.js monolitico
      index.js                # aggrega ed esporta GENERATIONS = [...]
    pokemonTypes.js            # id → tipi per tutte le specie, generato una tantum (Milestone 3)
    exploreOptions.js          # UN registro per ogni bivio (id, pesi, tipi della zona, hint) —
                                # sia il componente sia gli script di simulazione leggono da qui
    items.js                   # UN registro per oggetto (nome, icona, descrizione, effetto,
                                # dove si ottiene) invece di sparso fra 3-4 file (Milestone 4)
    achievements.js             # solo il catalogo (id, titolo, icona, descrizione) — le regole
                                # di sblocco vivono in core/achievements/ (Milestone 8)
    balanceConstants.js         # tutti i numeri di bilanciamento (soglie, minimi, quante opzioni
                                # per bivio) in un solo posto, non uno per file che li usa
    abilities.js
    natures.js
    types.js
    evolutions.js
    weather.js

  features/                   # UI + hook, raggruppati per dominio di gioco
    explore/
      ExploreSceneContainer.js
      useExploreState.js
    battle/
      BattleScene.js
      useSignatureMove.js      # ora accanto al componente che lo usa, non altrove
    team/
      TeamPanel.js
      BoxModal.js
    pokedex/
      PokedexModal.js
      usePokedexState.js
    casino/
      CasinoScene.js
    achievements/
      AchievementsModal.js       # legge il catalogo da content/achievements.js
      AchievementToast.js       # notifica a schermo nativa fin da subito (Milestone 8)
    hallOfFame/
      HallOfFameModal.js
    settings/
      SettingsModal.js
      theme.js
    saves/
      ResumeScreen.js
      useSaveSlot.js

  shared/                     # solo ciò che è usato da 3+ feature diverse
    PokemonSprite.js
    TapTooltip.js
    ParticleBurst.js
    usePokemon.js              # cache PokeAPI condivisa (pattern già azzeccato oggi)
    usePokemonSpecies.js
    useModalA11y.js
    soundEngine.js

  styles/
    styles.css
    themes.css

tests/
  integration/
    fullRun.test.js            # pilota DAVVERO core/state/*, non una sua copia (lezione simulate-flow.mjs)

scripts/
  analyze-run-log.mjs
  simulate-pool-balance.mjs   # frequenza bivi, dimensione pool, raggiungibilità Pokédex —
                               # riusa sempre core/content pure, mai una copia (Milestone 3/5)
  generate-pokemon-types.mjs  # rigenera content/pokemonTypes.js da PokeAPI, una tantum
```

**Le tre regole che guidano questa struttura:**

- **`core/` non importa mai React, né fa mai `fetch`.** È il confine più importante del progetto: se un giorno serve capire "perché questa logica non è testabile", la risposta deve essere "perché è finita fuori da `core/` per errore", non "perché è nata dentro un hook e non l'abbiamo mai estratta" — esattamente il motivo per cui `isPostgame` è rimasto un bug nascosto per intere versioni.
- **Un test colocato per ogni modulo di `core/` e `content/`**, non un'unica cartella `tests/` lontana dal codice — risolve direttamente la voce di backlog reale "test colocati vicino al codice" (`ROADMAP.md`, Fase 9). `tests/integration/` resta separata solo per i test che attraversano più moduli insieme (simulazioni di run complete), dove non esiste un singolo file "accanto" a cui appartengono naturalmente.
- **`features/` raggruppa per dominio di gioco, non per tipo di file.** Un componente e il suo hook dedicato vivono nella stessa cartella; solo ciò che è genuinamente condiviso da 3 o più feature sale a `shared/`. Questo è il punto preciso in cui l'organizzazione per-tipo del progetto reale ha iniziato a scricchiolare (voce Fase 9), e in cui l'organizzazione per-feature di Pokemon Roulette rende di più — ma applicato solo al layer UI, non a `core/`, dove la separazione netta da React resta il vincolo più importante da preservare.

---

## 🧠 Milestone 1 — Motore puro, zero UI

Prima riga di codice "di gioco" scritta: **non un componente**, ma i moduli di logica pura, con test scritti insieme al codice, non dopo.

- `battleLogic.js`: potenza squadra, probabilità di vittoria, probabilità di cattura — pure funzioni, input/output, niente `Math.random()` non iniettato, niente stato React.
- Macchina a stati del gioco come **funzioni pure indipendenti da React** fin dall'origine (`computeIsPostgame`, `resolveAfterGymBattle`, `checkNextGeneration`...) — mai logica di transizione scritta *dentro* un hook `useState`/`setState`.
- Sanitizzatore/whitelist dello state salvato, presente fin dal primo campo di stato — non aggiunto quando un campo dimenticato causa già un crash in produzione. Progettato fin da subito come **catena di migrazioni versionate** (`v1→v2`, `v2→v3`, applicate in ordine) invece di un'unica funzione che deve conoscere tutte le forme storiche contemporaneamente: nel progetto reale un solo campo che cambia tipo (`rivalDone` booleano→numero, per modellare un Rivale che ricompare più volte) ha già richiesto un ramo di retro-compatibilità dedicato — con più campi che cambiano forma nel tempo, una funzione piatta cresce linearmente con la storia del progetto invece che con le sue esigenze attuali.

**Perché per primo**: nel progetto reale, i tre bug più seri mai trovati (il loop di re-render infinito di Randomizer/Mono-Type, il crash `starterIds` al cambio regione per un campo mancante nel sanitizzatore, e `isPostgame` che saltava le palestre di Paldea) sono *tutti* nati da logica di stato scritta dentro componenti/hook invece che in moduli puri testabili in isolamento. Costruire questo layer per primo, con test da subito, previene l'intera classe invece di scoprirla bug per bug nelle versioni successive.

---

## 🎮 Milestone 2 — Un solo loop di gioco, completo, una sola regione

- Kanto e basta: starter → esplora (una sola zona, "erba alta") → palestra → rivale → alto comando → campione → schermata finale.
- UI minimale: nessun tema, nessuna animazione, nessun effetto particellare — solo che funzioni e sia leggibile.
- Test end-to-end che **pilota davvero le funzioni pure della Milestone 1**, non una loro reimplementazione a mano — lezione diretta da `scripts/simulate-flow.mjs`, che nel progetto reale duplica la macchina a stati invece di richiamarla, e per questo non ha mai potuto scoprire un bug vero.
- Salvataggio/ripresa, anche un solo slot, introdotto qui e non più tardi: è il momento in cui lo state cambia forma più spesso, quindi il più economico per abituarsi a sanificarlo bene fin da subito.

**Perché per secondo**: un loop completo e giocabile end-to-end, anche minimale, è il primo punto in cui si scoprono problemi di equilibrio/flusso reali (è già successo qui: barra di progresso, ordine palestre/alto comando/rivale). Meglio scoprirli su 1 regione che su 9.

---

## 🧪 Milestone 3 — Validatore di contenuti, poi la seconda regione

- Un test generico di integrità dati (schema-check) che scorre *qualunque* generazione e verifica: numero di capipalestra atteso, potenza crescente, `teamIds` validi, presenza di alto comando/campione, tipo risolvibile per ogni id usato nei pool.
- **`content/pokemonTypes.js` (id → tipi) e `core/explore/poolBuilder.js` scritti qui, non dopo**: i pool di incontro per zona (Fuoco, Spettro, Ghiaccio...) **si generano** da Generazione × insieme di tipi (`buildTypePool(generationId, ["fire", "ground", "rock"])`), invece di essere array scritti a mano per ogni regione. Le zone che non sono tassonomiche per natura (Safari, Fossili, Uovo Misterioso, Scambio NPC) restano curate a mano — non tutto deve diventare combinatorio, solo ciò che ha davvero un asse naturale (tipo, generazione) dietro.
- **Solo dopo** aver scritto questo validatore (e il generatore di pool), si scrive Johto — usandolo come guardrail immediato: se manca qualcosa, fallisce un test a scrittura, non un giocatore mesi dopo in produzione.
- Multi-slot di salvataggio, PC Box e transizione della squadra fra regioni.

**Perché in questo ordine e non prima/dopo**: nel progetto reale il validatore di integrità dati non esiste tuttora (è ancora in backlog, `ROADMAP.md` Fase 10) e più bug sono nati esattamente dalla sua assenza — il filtro Mono-Type che restituiva risultati sbagliati per Johto e oltre perché la tabella tipi copriva solo Kanto, `isPostgame` che non si accorgeva della nona regione, e — episodio più recente, nato proprio scrivendo questo documento — un simulatore statistico costruito apposta (`scripts/simulate-pool-balance.mjs` nell'idea di questo documento) che ha scoperto **3 regioni su 9 senza alcun pool dedicato per 7 zone a tema** (ricadevano tutte sullo stesso fallback generico) e una zona (`iceZone`) mai sopra le 4 specie in *nessuna* delle 9 regioni — scoperto solo dopo aver costruito lo strumento apposta per cercarlo, non prima. Con i pool generati invece che scritti a mano, questa intera classe di bug (regione dimenticata, pool troppo piccolo) diventa strutturalmente impossibile invece di doverla scoprire a campione. Scrivere il validatore *e* il generatore *prima* della seconda regione, invece che scoprirne la mancanza alla nona, rende ogni nuova regione un'aggiunta meccanica e sicura invece che un rischio.

---

## 💰 Milestone 4 — Economia & progressione di base

- Pokédollari, PokéMart, cura della squadra — **con un vero effetto meccanico da subito** (nel progetto reale "Cura la Squadra" è rimasto un no-op puramente cosmetico per diverse versioni prima di ricevere un senso reale in Fase 8).
- Oggetti con effetti differenziati fin dall'inizio (cura %, cattura, XP...), non solo "+N Potenza" con il numero che cambia — lezione diretta da Fase 11 del progetto reale, dove quasi tutti gli strumenti fanno la stessa cosa.
- **Un registro per oggetto, non un oggetto sparso fra file**: `content/items.js` come unica fonte (nome, icona, descrizione, effetto, dove si ottiene) letta sia dallo shop sia dalla battaglia sia dai pool tematici — nel progetto reale la stessa informazione su un oggetto vive in 3-4 file diversi (`items.js` per la descrizione, `itemEffects.js` per l'effetto, gruppi tematici duplicati nei pool di esplorazione), e aggiungerne uno nuovo richiede ricordarsi di toccarli tutti.
- Evoluzioni, gestione Box.

**Perché qui**: è la prima meccanica trasversale (tocca esplorazione, battaglia, e progressione), quindi conviene stabilizzarla prima di scalare a più regioni e prima di aggiungere meccaniche di battaglia avanzate che si appoggeranno sugli stessi oggetti.

---

## 🗺️ Milestone 5 — Contenuto a scala: le altre 7 regioni

- Con schema + validatore + generatore di pool + economia già solidi (Milestone 0/3/4), aggiungere le regioni 3-9 diventa un lavoro meccanico e ripetibile invece che un rischio crescente: una nuova regione eredita automaticamente pool di incontro dimensionati correttamente su ogni zona, perché generati da `poolBuilder.js` invece di scritti a mano una per una.
- Tabella tipi **completa per ogni id usato nei pool di ogni regione scritta**, non solo per Kanto — lezione diretta dal bug Mono-Type Johto (risolta strutturalmente qui, dato che `content/pokemonTypes.js` copre tutte le specie fin dalla Milestone 3, non aggiunta regione per regione).
- **Un controllo di raggiungibilità del Pokédex nazionale come parte del validatore**, non uno strumento scoperto a posteriori: verificare che ogni specie non-leggendaria sia raggiungibile da almeno un pool (direttamente, o tramite la catena di evoluzioni) evita di scoprire — come nel progetto reale, con un simulatore costruito ad hoc molti mesi dopo — che una regione intera raggiunge solo il 71% delle proprie specie, o che la tabella evoluzioni stessa contiene coppie id sbagliate (nel progetto reale, verificando questo controllo, sono emersi **3 bug reali pre-esistenti in `evolutions.js`**: due specie mappate su id completamente sbagliati per una svista di battitura, risalenti probabilmente alla stesura iniziale della tabella e mai scoperti perché nessun controllo incrociava gli id con una fonte esterna).

**Perché solo ora**: scalare a 9 regioni prima di avere un validatore automatico è esattamente come è andata nel progetto reale — funziona, ma nasconde silenziosamente buchi (dati mancanti, soglie non aggiornate) che emergono uno alla volta, a distanza di versioni, invece che tutti insieme e subito.

---

## ⚔️ Milestone 6 — Meccaniche di battaglia avanzate

- Abilità passive, meteo, tipo/efficacia.
- Mega Evoluzione / Terastallizzazione: progettate **vincolate alla squadra reale fin dall'origine** (serve davvero una specie mega-capace per usare Mega) invece che introdotte come bonus piatto e vincolate solo dopo — lezione diretta da Fase 7 del progetto reale, dove oggi il bottone Mega è sempre disponibile a prescindere dalla squadra.
- Strumenti tenuti assegnati per singolo Pokémon fin dall'inizio, non come bonus di squadra piatto poi da rifattorizzare.

**Perché dopo l'economia e non prima**: queste meccaniche si appoggiano sugli stessi oggetti/tipi della Milestone 4, e vincolarle bene "sulla carta" fin da subito costa lo stesso sforzo che progettarle slegate — ma evita l'intera voce di backlog "vincolare dopo" che oggi esiste nel progetto reale.

---

## 🎲 Milestone 7 — Sfide & modalità alternative

- Nuzlocke, Randomizer, Mono-Type — **solo dopo** che pool di incontro e tabella tipi sono completi e validati (Milestone 3/5): sono filtri sopra dati che devono già essere corretti, non features indipendenti.
- Torneo dei Campioni, modalità post-game infinita — con il pool di bivi speciali dimensionato fin dall'inizio in proporzione al numero di voci reali disponibili (nel progetto reale il post-game mostra 4 bivi estratti da un catalogo di 20, un'incoerenza mai corretta finché non è stata segnalata, Fase 11).
- **I bivi come registro dati (`content/exploreOptions.js`), non come oggetti letterali dentro il componente**: nel progetto reale, l'elenco delle opzioni post-game esiste *solo* dentro `ExploreSceneContainer.js` — al punto che lo script di analisi statistica ha dovuto mantenere una propria copia manuale dello stesso elenco di id, commentata esplicitamente come "va tenuta in sync a mano" (un rischio di disallineamento introdotto consapevolmente per mancanza di un'alternativa). Con un registro unico, sia il componente sia qualunque script di analisi leggono la stessa lista.

**Perché qui e non prima**: nel progetto reale, Randomizer e Mono-Type sono state scritte, poi disabilitate per un bug di re-render (Milestone 1 assente all'epoca), poi riattivate, poi scoperte comunque parzialmente rotte per dati di tipo incompleti (Milestone 3/5 assenti all'epoca). Costruirle per ultime, sopra fondamenta già solide, evita tutti e tre questi giri.

---

## 🏆 Milestone 8 — Meta-progressione & retention

- Achievement, **con notifica a schermo fin dal primo achievement scritto** — non aggiunta dopo, quando già esistono 4 trofei silenziosi che si scoprono solo aprendo un modale a mano (situazione reale attuale, Fase 11).
- **Achievement sbloccati da eventi, non da chiamate sparse nella logica di gioco**: nel progetto reale `unlockAchievement(id)` viene chiamato da punti diversi e lontani tra loro (`GymBattleSceneContainer.js`, `LeagueSceneContainer.js`, `SceneRouter.js`, `useGameState.js`) — la logica di battaglia/esplorazione deve "sapere" esplicitamente quali achievement esistono. Con `core/achievements/achievementRules.js` puro (evento tipizzato → quali id sblocca) e la logica di gioco che si limita a emettere eventi generici (`gymBattleWon`, `legendaryCaught`, `championDefeated`), aggiungere un achievement non richiede più toccare il codice di gioco che lo determina.
- Sala della Fama, punteggio/grado di vittoria.
- Pokédex nazionale + numerazione regionale.

**Perché dopo e non durante**: sono sistemi di ricompensa che leggono lo stato di gioco (badge, catture, vittorie) — hanno senso solo quando il loop e il contenuto che premiano sono già stabili, altrimenti si finisce a ritoccare le condizioni di sblocco ad ogni cambiamento a monte.

---

## 🌐 Milestone 9 — Integrazione PokéAPI di arricchimento

- Un **unico pattern di hook con cache in-memoria** stabilito una volta (esattamente come `usePokemon.js` in questo progetto) e riusato per ogni nuova integrazione (sprite, versi, descrizioni specie, statistiche, mosse) — questo è uno dei pochi pattern che il progetto reale ha già azzeccato al primo colpo e vale la pena copiare identico in un rewrite.
- Strategia di caching offline-first **pianificata come architettura fin dalla prima chiamata PokeAPI**, non aggiunta a fine progetto come voce di backlog (situazione reale attuale, Fase 6) — anche solo prevedendo da subito un layer di cache sostituibile (in-memoria → poi `CacheStorage`/`IndexedDB`) invece di scrivere ogni hook assumendo la rete sempre disponibile.

**Perché per penultimo**: sono arricchimenti via via aggiuntivi che non bloccano il gioco (se una sprite non carica, il gioco resta giocabile) — hanno senso solo quando c'è già abbastanza gioco da arricchire.

---

## 🎨 Milestone 10 — Polish, accessibilità, tooling di lungo periodo

- Temi visivi, responsive mobile, effetti particellari, onboarding.
- Un componente `<Badge variant="...">` condiviso invece di una classe CSS quasi identica per ogni badge (`.new-species-badge`, `.ball-lure-badge`, `.legendary-badge`, `.caught-badge` nel progetto reale — nate una alla volta, mai consolidate).
- `content/balanceConstants.js`: tutti i numeri di tuning del gioco (soglie di dominazione, dimensione minima di un pool, quante opzioni mostrare per bivio) in un solo file, non uno per ciascun modulo che li usa — utile soprattutto negli stessi cicli di ribilanciamento già capitati più volte nel progetto reale.
- Un util di test condiviso per il PRNG seedato usato nelle simulazioni (`mulberry32`) invece che duplicato identico in più file di test/script, come accaduto nel progetto reale.
- Solo qui rivalutare TypeScript/coverage/riorganizzazione cartelle per-feature (le voci di Fase 9 del progetto reale) — decisioni di tooling a lungo termine che vanno prese quando si sa davvero quanto il progetto è cresciuto, non a scatola chiusa a inizio Milestone 0 (quella era la decisione binaria "zero-build sì/no"; questa è "vale la pena investire di più ora che il progetto è grande davvero").

**Perché per ultimo**: è tutto lavoro a basso rischio e alto valore percepito ma zero impatto sulla correttezza del gioco — l'esatto opposto delle Milestone 1/3, dove un errore di fondazione si paga per tutte le versioni successive.

---

## 📌 In sintesi: il principio guida

Il progetto reale ha seguito grosso modo l'ordine opposto su tre punti chiave — **contenuto prima del validatore, meccaniche prima dei vincoli, feature prima dei test** — ed è arrivato comunque a un buon risultato, ma pagando ogni volta con un bug scoperto in produzione e poi corretto (vedi `ROADMAP.md`, Fase 8/10/11). Non è stata una serie di errori: è la traiettoria naturale di un progetto che cresce organicamente aggiungendo la feature più interessante volta per volta. Questo documento è l'ordine che si sceglierebbe **sapendo già come va a finire** — utile come riferimento se mai si decidesse di ripartire da zero, o anche solo come lente per capire quale pezzo di fondazione manca ancora oggi sotto le feature più recenti.
