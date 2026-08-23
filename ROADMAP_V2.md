# 🔁 ROADMAP_V2 — Se riscrivessimo il gioco da zero

Questo documento **non è la roadmap del progetto attuale** (quella resta `ROADMAP.md`, che continua a tracciare cosa è stato fatto e cosa manca sull'800+ funzionalità già esistenti). È una risposta a una domanda diversa: *"con tutto quello che sappiamo ora, in che ordine scriveremmo questo tipo di gioco se ripartissimo da un repository vuoto?"*

Il progetto attuale è arrivato a 9 generazioni, decine di meccaniche e ~50 file funzionando bene, ma **quasi ogni bug reale che abbiamo trovato e risolto** (vedi `ROADMAP.md`, Fase 8 e Fase 10) nasce dallo stesso pattern: una feature scritta prima che la fondazione sotto di essa fosse pronta a sostenerla — logica di stato incastrata in un hook React invece che in un modulo puro testabile, contenuto scritto a mano prima di un validatore che ne controlli la coerità, meccaniche aggiunte come bonus piatto e vincolate "dopo" invece che pensate vincolate da subito. Questo documento riordina lo sviluppo per evitare quella classe di problemi fin dall'inizio, non per rincorrerli a posteriori.

Ogni milestone elenca **cosa costruire** e **perché in quell'ordine**, con riferimento diretto a un episodio reale di questo progetto quando ce n'è uno pertinente.

---

## 🏛️ Milestone 0 — Decisioni fondazionali (prima di scrivere una sola feature)

Decisioni che costano pochissimo a monte e moltissimo a valle se rimandate — tutte cose che in questo progetto sono finite in backlog "da valutare" (`ROADMAP.md` Fase 9) invece che essere state decise all'inizio.

- **Build tooling, una volta sola**: zero-build (React da CDN, `React.createElement`) oppure TypeScript + build step. Non è una scelta sbagliata in sé (per questo progetto zero-build ha funzionato bene finché è rimasto piccolo), ma va presa *prima* di scrivere il primo componente — cambiarla a metà strada su 50+ file costa ordini di grandezza di più che deciderla al commit zero.
- **Contratto/schema dei dati di contenuto**: definire fin da subito la forma esatta di "una generazione" (starter, tier di esplorazione, 8 capipalestra, alto comando, campione, rivale, boss, leggendari) come un contratto scritto — anche solo un commento o un tipo — invece di lasciare che emerga implicitamente scrivendo Kanto e poi copiando il pattern a mano per le altre 8 regioni.
- **i18n sì/no, deciso una volta**: se si vuole mai supportare più lingue, le stringhe vanno estratte in un dizionario dal primo componente, non dopo che decine di componenti hanno testo italiano inline nel JSX (situazione attuale, `ROADMAP.md` Fase 9).
- **CI attiva dal primo commit**: anche solo `npm test` su push, da subito — non aggiunta dopo 8 versioni quando i test esistono già ma nessuno li fa girare automaticamente.

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
    items.js
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
      AchievementsModal.js
      achievements.js
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
- Sanitizzatore/whitelist dello state salvato, presente fin dal primo campo di stato — non aggiunto quando un campo dimenticato causa già un crash in produzione.

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
- **Solo dopo** aver scritto questo validatore, si scrive Johto — usandolo come guardrail immediato: se manca qualcosa, fallisce un test a scrittura, non un giocatore mesi dopo in produzione.
- Multi-slot di salvataggio, PC Box e transizione della squadra fra regioni.

**Perché in questo ordine e non prima/dopo**: nel progetto reale il validatore di integrità dati non esiste tuttora (è ancora in backlog, `ROADMAP.md` Fase 10) e due bug diversi sono nati esattamente dalla sua assenza — il filtro Mono-Type che restituiva risultati sbagliati per Johto e oltre perché la tabella tipi copriva solo Kanto, e `isPostgame` che non si accorgeva della nona regione. Scrivere il validatore *prima* della seconda regione, invece che scoprirne la mancanza alla nona, rende ogni nuova regione un'aggiunta meccanica e sicura invece che un rischio.

---

## 💰 Milestone 4 — Economia & progressione di base

- Pokédollari, PokéMart, cura della squadra — **con un vero effetto meccanico da subito** (nel progetto reale "Cura la Squadra" è rimasto un no-op puramente cosmetico per diverse versioni prima di ricevere un senso reale in Fase 8).
- Oggetti con effetti differenziati fin dall'inizio (cura %, cattura, XP...), non solo "+N Potenza" con il numero che cambia — lezione diretta da Fase 11 del progetto reale, dove quasi tutti gli strumenti fanno la stessa cosa.
- Evoluzioni, gestione Box.

**Perché qui**: è la prima meccanica trasversale (tocca esplorazione, battaglia, e progressione), quindi conviene stabilizzarla prima di scalare a più regioni e prima di aggiungere meccaniche di battaglia avanzate che si appoggeranno sugli stessi oggetti.

---

## 🗺️ Milestone 5 — Contenuto a scala: le altre 7 regioni

- Con schema + validatore + economia già solidi (Milestone 0/3/4), aggiungere le regioni 3-9 diventa un lavoro meccanico e ripetibile invece che un rischio crescente.
- Pool di incontro **larghi fin dall'inizio** (8-10 id per zona/tier, non 3-4) — lezione diretta da Fase 11, dove i pool scritti a mano nella prima stesura non sono mai stati riallargati e oggi sembrano ripetitivi.
- Tabella tipi **completa per ogni id usato nei pool di ogni regione scritta**, non solo per Kanto — lezione diretta dal bug Mono-Type Johto.

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

**Perché qui e non prima**: nel progetto reale, Randomizer e Mono-Type sono state scritte, poi disabilitate per un bug di re-render (Milestone 1 assente all'epoca), poi riattivate, poi scoperte comunque parzialmente rotte per dati di tipo incompleti (Milestone 3/5 assenti all'epoca). Costruirle per ultime, sopra fondamenta già solide, evita tutti e tre questi giri.

---

## 🏆 Milestone 8 — Meta-progressione & retention

- Achievement, **con notifica a schermo fin dal primo achievement scritto** — non aggiunta dopo, quando già esistono 4 trofei silenziosi che si scoprono solo aprendo un modale a mano (situazione reale attuale, Fase 11).
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
- Solo qui rivalutare TypeScript/coverage/riorganizzazione cartelle per-feature (le voci di Fase 9 del progetto reale) — decisioni di tooling a lungo termine che vanno prese quando si sa davvero quanto il progetto è cresciuto, non a scatola chiusa a inizio Milestone 0 (quella era la decisione binaria "zero-build sì/no"; questa è "vale la pena investire di più ora che il progetto è grande davvero").

**Perché per ultimo**: è tutto lavoro a basso rischio e alto valore percepito ma zero impatto sulla correttezza del gioco — l'esatto opposto delle Milestone 1/3, dove un errore di fondazione si paga per tutte le versioni successive.

---

## 📌 In sintesi: il principio guida

Il progetto reale ha seguito grosso modo l'ordine opposto su tre punti chiave — **contenuto prima del validatore, meccaniche prima dei vincoli, feature prima dei test** — ed è arrivato comunque a un buon risultato, ma pagando ogni volta con un bug scoperto in produzione e poi corretto (vedi `ROADMAP.md`, Fase 8/10/11). Non è stata una serie di errori: è la traiettoria naturale di un progetto che cresce organicamente aggiungendo la feature più interessante volta per volta. Questo documento è l'ordine che si sceglierebbe **sapendo già come va a finire** — utile come riferimento se mai si decidesse di ripartire da zero, o anche solo come lente per capire quale pezzo di fondazione manca ancora oggi sotto le feature più recenti.
