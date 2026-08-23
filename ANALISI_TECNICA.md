# Analisi Tecnica — Pokémon: Scegli il Cammino

Analisi approfondita del codice allo stato attuale (v8.5), letta interamente
sui moduli chiave: `App.js`, `useGameState.js`, `SceneRouter.js`, i tre
container di scena, tutti i componenti UI, i moduli `engine/`, i dati in
`data/`, `styles.css` e `index.html`. Non sostituisce un playtest reale, ma
individua problemi concreti verificabili leggendo il codice.

Legenda priorità: 🔴 Alta — 🟡 Media — 🟢 Bassa/rifinitura.

---

## 1. Sintesi

Per un progetto senza build step (React via CDN, `React.createElement` puro,
niente bundler) il codice è insolitamente maturo: separazione pulita tra
logica pura (`engine/`) e UI, una suite di test reale, un refactor
architetturale già avvenuto (v8.5) e una roadmap tenuta con disciplina. I
problemi più seri non sono di "codice che non funziona", ma di:

1. **Meccaniche che minano la promessa centrale del gioco** ("le tue scelte
   contano, non gira nessuna ruota") — vedi sezione 3.
2. **Feature promosse nella documentazione ma irraggiungibili in gioco**
   (Randomizer Mode, Mono-Type Challenge).
3. **Debito di manutenzione silenzioso**: stile inline pervasivo, file che
   crescono senza limite, coupling implicito tramite l'oggetto `game`.

---

## 2. Codice

### 2.1 🔴 Randomizer Mode / Mono-Type Challenge: funzionalità morta ma pubblicizzata

> ✅ **Risolto in v8.6** — toggle reintrodotto in `GenerationSelectScreen`,
> filtro applicato in `useGameState.goTo()` (non nel render). Vedi
> ROADMAP.md v8.6. Un secondo bug emerso nell'implementazione — il filtro
> veniva applicato anche ai pool di incontro leggendario, sostituendo il
> leggendario con un Pokémon comune dello stesso tipo — è stato corretto
> escludendo esplicitamente `pendingEncounterIsLegendary: true` dal filtro.

- `challengeEngine.js` è scritto, deterministico e corretto (usa
  `seededPick`, nessun `Math.random()` nel render — esattamente il fix
  descritto in `ROADMAP.md`).
- Ma **nessuna UI lo attiva più**: `GenerationSelectScreen.js:9-13` passa
  sempre `{ isNuzlocke: false, isRandomizer: false, monoType: null }` fissi,
  senza controlli per l'utente. `ExploreSceneContainer.js:10` importa
  `filterEncounterPoolByChallenge` con un alias (`applyChallengeFilters`) ma
  con `state.isRandomizer`/`state.monoType` sempre `false`/`null` il filtro
  non scatta mai.
- **Il problema non è tecnico, è di comunicazione**: `README.md` (riga 42)
  descrive il Randomizer come "🎲 Randomizer Mode: Modalità caos attivabile
  all'avvio dalla schermata di selezione regione", e `ROADMAP.md` lo elenca
  tra le funzionalità "in Backlog" — ma un giocatore che legge solo il
  README si aspetta un toggle che non esiste in nessuna schermata.
- **Consiglio**: o si chiude il cerchio (reintrodurre il toggle in
  `GenerationSelectScreen`, applicando il filtro negli `onSelect()` come già
  pianificato in ROADMAP), o si aggiorna il README per non promettere una
  feature non raggiungibile.

### 2.2 🟡 Pattern `setTimeout(fn, 0)` per incatenare transizioni di stato

In `ExploreSceneContainer.js` (es. righe 91, 105, 117 e altre nei bivi
post-game) le callback `onSelect()` a volte chiamano `update(...)` e poi
`setTimeout(() => startPostgameExplore(), 0)` per forzare una seconda
transizione dopo il render. Funziona, ma è un pattern fragile fuori dal
flusso naturale di React: se in futuro si introducono `startTransition` o
altre feature concorrenti di React 18, l'ordine di esecuzione non è più
garantito. Meglio calcolare lo stato finale in un solo `update()`/`goTo()`.

### 2.3 🟡 Accoppiamento implicito tramite l'oggetto `game`

`useGameState()` ritorna un oggetto enorme (stato + ~25 funzioni) passato
per intero a `SceneRouter` e ai tre container di scena
(`ExploreSceneContainer`, `GymBattleSceneContainer`, `LeagueSceneContainer`).
Ogni container destruttura solo ciò che gli serve, ma può leggere/scrivere
qualunque campo dello stato globale — non c'è un confine esplicito tra "cosa
può toccare una scena di esplorazione" e "cosa può toccare una scena di
battaglia". Va bene alla scala attuale; se il progetto cresce ancora,
conviene passare prop mirate invece dell'intero `game`.

### 2.4 🟡 File che crescono senza un punto di rottura previsto

`data/generations.js` (729 righe), `components/scenes/ExploreSceneContainer.js`
(725), `data/evolutions.js` (492), `components/BattleScene.js` (446) sono già
grandi e destinati a crescere ulteriormente (nuove generazioni, nuovi bivi
post-game). Split naturale: un file per generazione in `data/generations/`,
i bivi post-game in moduli separati per categoria (eventi economici, incontri
speciali, minigiochi).

### 2.5 🟢 Icone assegnate per string-matching sul titolo, non per campo esplicito

> ✅ **Risolto in v8.6** — sostituito con `getTypeIcon()` (`data/types.js`)
> risolto tramite il tipo reale (`getBadgeType()` in `data/generations.js`,
> che lo ricava dal titolo del capopalestra, non dal nome estetico della
> medaglia). Verificando i nomi reali delle medaglie il problema si è
> rivelato più esteso di questo singolo caso: "Medaglia Erba", "Medaglia
> Fuoco", "Medaglia Normale Paldea", "Medaglia Buio", "Medaglia Folletto",
> "Medaglia Lotta" e "Medaglia Ombra" non matchavano **nessuna** parola
> chiave e cadevano sull'icona generica 🏅 — esattamente il tipo di rottura
> silenziosa descritto sotto. Spettro ha ora un'icona propria (👻) invece
> di condividere quella di Psico (🔮).

`TeamPanel.js:getBadgeIcon()` e `BattleScene.js:getTrainerEmoji()`
indovinano l'icona cercando sottostringhe nel nome (`title.includes("Roccia")`
ecc.), invece di leggere un campo `type` esplicito già presente nei dati.
Le due funzioni non sono nemmeno coerenti tra loro:
`getBadgeIcon` (riga 19) raggruppa **Insetto/Maggiolino** (medaglie di tipo
Coleottero) insieme alle parole chiave di tipo Volante, restituendo 🦅
invece di 🐛 — mentre `getTrainerEmoji` nello stesso file `BattleScene.js`
usa correttamente `title.includes("Coleottero") → 🐛`. Piccola incoerenza
visiva (medaglia Coleottero mostrata con l'icona sbagliata), ma sintomo di
un pattern strutturalmente fragile: aggiungere una generazione con nomi di
medaglie diversi rompe silenziosamente queste mappe testuali.

### 2.6 🟢 "Iper Pozione" non è più forte di "Super Pozione"

> ✅ **Risolto in v8.6** — Iper Pozione ora +24 Potenza (era +18, identico
> alla Super Pozione).

`items.js` (righe 7-8) e `BattleScene.js:handleUseItem` (riga 101) assegnano
lo stesso bonus (+18 Potenza) a "Super Pozione" e "Iper Pozione", pur
costando la seconda 50% in più al PokéMart (3 💰 vs 2 💰) ed essendo
descritta come cura "al massimo". Incoerenza di bilanciamento minore ma
facilmente notabile da chi gioca con attenzione ai numeri.

### 2.7 🟢 Abilità passive assegnate con un fallback aritmetico arbitrario

> ✅ **Risolto in v8.6** — aggiunto un commento esplicito nel codice che
> documenta il fallback come euristica di riempimento arbitraria, non dati
> ufficiali dei giochi (comportamento invariato, solo documentato).

`data/abilities.js:getPokemonAbility()` ha una whitelist curata per ~30
specie iconiche, poi un fallback `speciesId % 13 === 0 → Acceleratore`,
`% 17 → Prepotenza`, `% 19 → Leggiadria` per tutte le altre. È un modo
pragmatico per garantire varietà su 1025 specie senza scriverle a mano, ma
il risultato è arbitrario dal punto di vista narrativo (es. Weedle, id 13,
riceve "Acceleratore" solo perché `13 % 13 === 0`). Non è un bug, ma vale la
pena documentarlo nel codice come "euristica di riempimento" così un futuro
contributor non lo confonda con dati reali dei giochi.

### 2.8 🟢 Copertura test sottile rispetto alla superficie del progetto

> **Parzialmente ampliata in v8.6** — nuova `tests/explorePicker.test.js`
> (9 test) copre `engine/explorePicker.js` con simulazioni di run intere
> (fino a 200×120 bivi): copertura totale delle opzioni, non-dominazione,
> rarità del leggendario, purezza/determinismo, e cattura leggendari via
> Monte Carlo. `evolutions`, `hallOfFame`, `saveGame`, `megaLogic` restano
> senza test — il gap sotto resta valido per quei moduli.

`tests/engine.test.js` copre bene `battleLogic`, `scoreLogic`,
`typeMatchup`, `saveSanitizer` (7 test, tutti mirati e con asserzioni
numeriche precise — buona qualità). Ma moduli altrettanto centrali per la
correttezza — `evolutions.checkEvolution`, `challengeEngine`,
`hallOfFame`, `saveGame` (slot multipli, import/export JSON),
`megaLogic`/stacking Mega+Tera — non hanno test. Dato che la logica pura è
già isolata da React, aggiungerne sarebbe a basso costo/alto beneficio.

---

## 3. Game design

### 3.1 🔴 Il "Riprova la battaglia" annulla il rischio (fuori Nuzlocke)

In `BattleScene.js` (righe 362-364), se si perde una battaglia in modalità
normale, il giocatore ha sempre l'opzione **"Riprova la battaglia"** che
richiama `retry()` e permette di rilanciare `fight(tactic)` da capo, senza
alcun costo (non consuma oggetti, non riduce potenza, non c'è limite di
tentativi). Dato che `rollBattle` pesca un nuovo numero casuale ogni volta,
un giocatore determinato **vince sempre, prima o poi**, semplicemente
ripremendo il pulsante.

Questo è in tensione diretta con il pitch del progetto stesso (README riga
6-8: *"l'esito viene calcolato in base alle scelte fatte... non da un tiro a
sorte puro"*): se ogni sconfitta è annullabile gratis, l'unica battaglia che
ha davvero conseguenze è quella in modalità Nuzlocke. Le tattiche
(Aggressiva/Bilanciata/Difensiva) diventano un dettaglio estetico invece che
una decisione con peso, perché il "costo" di una tattica sbagliata è zero.

**Idee per dare peso alla sconfitta senza introdurre permadeath globale**:
un piccolo malus a ogni retry (es. -5% potenza per il tentativo successivo,
simulando la stanchezza), oppure consumo di un oggetto/Pokédollari per
riprovare, oppure limitare i retry a 1-2 per battaglia.

### 3.2 🔴 Megaevoluzione + Terastallizzazione: cumulabili, gratuite, sempre convenienti

> ✅ **Risolto in v8.6** — Mega e Tera sono ora mutuamente esclusivi:
> attivandone una, il pulsante dell'altra scompare per quella battaglia
> (`BattleScene.js`). Restano invece invariati, per scelta esplicita
> dell'utente in fase Alpha: nessun costo per "Riprova la battaglia" (3.1)
> e nessun costo per l'uso di oggetti (3.5) — segnati per una revisione
> futura.

In `BattleScene.js` entrambi i bottoni Mega (`+30%`) e Tera (`+25%`) sono
disponibili nella stessa battaglia (righe 178-265), indipendenti l'uno
dall'altro: `totalTeamPower` (riga 95) moltiplica `megaMult * teraMult`,
quindi si può ottenere **+62.5% di potenza combinata** senza alcun costo,
cooldown o limite di utilizzo per run. Nei giochi originali questi due
meccanismi sono reciprocamente esclusivi (nella Gen 9 non coesistono nemmeno
narrativamente) e limitati a un utilizzo per Pokémon/battaglia.

Il risultato pratico: non c'è mai una ragione per **non** premere entrambi
i pulsanti prima di ogni combattimento — non sono più una scelta tattica, ma
un doppio click obbligatorio prima di ogni scontro. Vale la pena decidere se
va corretto (renderli esclusivi, o dare un costo/limite d'uso) o se è un
compromesso "arcade" accettato consapevolmente per mantenere il gioco
semplice — in tal caso converrebbe comunque comunicarlo meglio nell'interfaccia,
invece di lasciarlo apparire come una svista.

### 3.3 🟡 Testo Nuzlocke fuorviante sul "tentativo di cattura unico"

`StartScreen.js` (riga 58) descrive la modalità Nuzlocke con: *"Morte
permanente dei Pokémon svenuti nel Box + **1 solo tentativo di cattura per
tappa**!"* — presentandolo come una regola speciale della modalità Hardcore.
In realtà `EncounterScene.js` non offre **mai**, per nessuna modalità, un
secondo tentativo di cattura nello stesso incontro (una volta impostato
`result`, l'unica azione possibile è "Continua"). È quindi un comportamento
di base del gioco descritto come esclusivo del Nuzlocke: rischia di
confondere chi legge il testo pensando che fuori Nuzlocke possa ritentare la
cattura sullo stesso Pokémon.

### 3.4 🟡 Bilanciamento del post-game infinito non verificabile a tavolino

`ExploreSceneContainer.js` scala il livello degli incontri con
`pgLevel = lastTier.level + postgameRound * 5` (crescita lineare senza tetto
oltre `MAX_LEVEL`) mentre la potenza degli avversari nelle battaglie scala
con `difficultyMult = 1 + completedGens*0.15 + nuzlockeBonus`, un moltiplicatore
che **si blocca** al numero di generazioni completate (max 9) e non cresce
più con `postgameRound`. Significa che nel post-game infinito la squadra del
giocatore può crescere di livello indefinitamente mentre gli avversari nei
bivi restano scalati sullo stesso moltiplicatore fisso: da un certo punto in
poi il gioco potrebbe diventare progressivamente più facile invece che più
difficile, contraddicendo la descrizione "Modalità Infinita... a difficoltà
crescente" nel README. Da verificare con un playtest lungo, ma è un rischio
di design leggibile già dai numeri.

### 3.5 🟢 Nessun costo per l'uso di oggetti in battaglia oltre al consumo

Usare un oggetto in battaglia (`handleUseItem`) dà sempre un bonus di
potenza puro senza contropartita (a parte "sparire dallo zaino"). Combinato
con Mega+Tera sempre gratuiti, la fase di preparazione pre-battaglia ha
pochi trade-off reali: quasi ogni bottone disponibile conviene premerlo.
Non è necessariamente un problema per un gioco pensato come rilassante, ma
va tenuto a mente se l'obiettivo futuro è dare più peso alle scelte.

---

## 4. UI/UX

### 4.1 🔴 Copertura mobile minima

`styles.css` (1336 righe) ha solo **due** media query, entrambe
`min-width` (800px e 760px) — cioè lo stile di base è pensato per schermi
piccoli "per difetto" ma non ottimizzato per essi: nessun adattamento
specifico per telefoni (es. font-size ridotti, bottoni a piena larghezza,
sidebar collassabile). Coerente con quanto la stessa ROADMAP segnala come
non fatto ("📱 Header Responsive Compatto Mobile"), ma vale la pena
evidenziarlo perché il `TeamPanel` (badge Pokédollari + Potenza + chip
sfida + griglia 2x3 + abilità + box + medaglie + zaino, tutto impilato
verticalmente) è già denso su desktop: su schermi stretti probabilmente
diventa una colonna molto lunga da scorrere prima di poter agire.

### 4.2 🟡 Tooltip via attributo `title` — invisibili su touch

Le descrizioni di oggetti (`TeamPanel.js`, `BattleScene.js`), abilità e
medaglie sono tutte implementate con l'attributo HTML nativo `title`
(tooltip al passaggio del mouse). Su dispositivo touch (tablet/telefono,
dove il gioco è comunque giocabile essendo un sito web) questi tooltip non
sono raggiungibili: il "🎒 Tooltip Descrizioni Oggetti" descritto come
funzionalità nel README di fatto non esiste per una fetta di utenti. Una
alternativa più robusta sarebbe un piccolo pannello/modal "ⓘ" apribile al
tap, oltre all'hover.

### 4.3 🟡 Modali senza gestione da tastiera/accessibilità

Tutti i modali (`PokedexModal`, `BoxModal`, `HallOfFameModal`,
`ScoreCardModal`) si chiudono cliccando sul backdrop, ma nessuno:
- chiude con `Esc`,
- imposta `role="dialog"` / `aria-modal="true"`,
- intrappola il focus della tastiera al proprio interno.

Per un progetto hobby non è bloccante, ma è a basso costo da aggiungere e
migliora sia l'accessibilità sia semplicemente l'usabilità da tastiera.

### 4.4 🟢 Stile inline pervasivo invece di classi CSS riutilizzabili

> ✅ **Risolto in v8.6 (scope minimo, deciso consapevolmente)** — non una
> riscrittura completa in classi CSS (troppo rischio/sforzo per una
> rifinitura), ma consolidati i 16 colori realmente duplicati (stesso
> concetto, valori leggermente diversi) sulle custom property esistenti o
> su nuovi token semantici (`--gold`, `--mega`, `--tera`, `--danger-dark`,
> `--panel-darker`). Zero duplicati rimasti, nessuna differenza visiva.

Componenti come `BattleScene.js`, `TeamPanel.js`, `PokeCenterScene.js`,
`HallOfFameModal.js`, `ScoreCardModal.js`, `NuzlockeGameOverScreen.js`
definiscono oggetti `style={{...}}` inline molto estesi, spesso con colori
scritti a mano in esadecimale (`#f43f5e`, `#4ade80`, `#fbbf24`...) invece di
riusare le custom property già definite in `:root` (`--accent`, `--danger`,
`--success`...). Effetto pratico: la palette "ufficiale" del tema esiste ma
viene ignorata metà delle volte, quindi colori simili (es. rosso pericolo,
rosso Nuzlocke, rosso sconfitta) sono definiti in punti diversi con valori
leggermente diversi, rendendo più difficile mantenere coerenza visiva o
introdurre un tema alternativo in futuro.

### 4.5 🟢 Densità informativa alta, gerarchia visiva piatta

> ✅ **Risolto in v8.6 (scope minimo)** — 3 classi CSS condivise
> (`.badge-status`, `.control-action`, `.info-chip`) applicate ai badge
> Nuzlocke/Randomizer/Mono-Tipo, ai pulsanti/badge Mega/Tera e ai chip
> abilità, senza toccare il layout generale. Stessa resa visiva di prima,
> struttura ora riutilizzabile invece che duplicata per feature.

Ogni nuova funzionalità (Nuzlocke, Randomizer, Mega, Tera, efficacia di
tipo, abilità, oggetti, Pokédollari, potenza squadra...) ha introdotto il
proprio badge/chip colorato con gradiente proprio, senza un sistema di
"livelli" visivi condiviso (es. badge di stato vs. controlli azionabili vs.
informazioni passive). Il risultato — specialmente nel `TeamPanel` laterale
e in `BattleScene` durante una battaglia con Mega+Tera+Item+Tipo tutti
attivi — è visivamente denso. Non è un difetto bloccante, ma con il ritmo di
aggiunta feature del progetto (v1→v8.5 in pochi step) conviene presto
fermarsi a definire 2-3 "livelli" di enfasi visiva riutilizzabili invece di
inventarne uno nuovo per ogni feature.

### 4.6 🟢 Nessun onboarding per il primo avvio

> ✅ **Risolto in v8.6** — nuovo `OnboardingModal.js`, 4 pannelli (bivi,
> cattura, tattiche di battaglia, Mega/Tera/Box) mostrati una sola volta al
> primissimo avvio (flag in `localStorage`, indipendente dagli salvataggi),
> riapribile in qualsiasi momento dal pulsante "❓ Come si gioca"
> nell'header.

Il gioco entra direttamente in `generationSelect → starterSelect → explore`
senza alcuna spiegazione del loop centrale (bivi, cattura, tattiche di
battaglia, Mega/Tera, Box). Per chi arriva senza aver letto il README può
non essere subito chiaro cosa distingue questo gioco da una semplice serie
di schermate — cosa comunque rilevante perché "le scelte contano" è il
messaggio differenziante del progetto, ma va scoperto giocando, non
comunicato all'inizio.

### 4.7 Cosa funziona bene (da preservare)

- L'estetica retro/8-bit coerente (icone emoji, sintetizzatore Web Audio
  nativo in `soundEngine.js`, palette dark) dà personalità distintiva senza
  bisogno di asset grafici custom.
- Feedback di stato chiaro e immediato: badge 💀 Nuzlocke, ✨ Shiny,
  barra di progresso nell'header, avatar avversario con potenza stimata.
- Flusso di salvataggio multi-slot con anteprima ricca (`ResumeScreen`) è
  già a un livello di cura superiore alla media di un progetto hobby.
- Il sanitizzatore (`saveSanitizer.js`) protegge l'esperienza utente da
  salvataggi corrotti in modo silenzioso e senza crash — buona UX difensiva,
  spesso trascurata in progetti di questa scala.

---

## 5. Priorità consigliate

Se dovessi scegliere un ordine, partirei da qui:

1. ✅ **Randomizer/Mono-Type riattivati** — risolto in v8.6 (2.1).
2. 🔴 **Dare un costo reale al "Riprova la battaglia"** (3.1) — è la
   modifica di design con il maggior impatto sulla coerenza dell'esperienza
   ("le scelte contano") a fronte di un cambiamento di codice piccolo.
   Deciso in v8.6 di rimandarla: si resta in fase Alpha, da rivedere più
   avanti.
3. ✅ **Mega e Tera resi mutuamente esclusivi** — risolto in v8.6 (3.2).
4. 🟡 **Correggere il testo Nuzlocke fuorviante** (3.3) — 1 riga di testo,
   zero rischio.
5. 🟡 **Aggiungere qualche breakpoint mobile in più** (4.1) — soprattutto
   per il `TeamPanel`, che è il componente più denso.
6. ✅ **Icone incoerenti, Iper Pozione, fallback abilità, stile inline,
   gerarchia visiva, onboarding** — tutti i 🟢 risolti in v8.6 (2.5, 2.6,
   2.7, 4.4, 4.5, 4.6).

Restano da fare: 🟡 testo Nuzlocke fuorviante (3.3), 🟡 breakpoint mobile
(4.1), 🟡 tooltip invisibili su touch (4.2), 🟡 modali senza accessibilità
da tastiera (4.3), 🔴 costo del "Riprova la battaglia" (3.1, deliberatamente
rimandato in fase Alpha), refresh completo di `MANUAL_TECNICO.md` §2/§3
(fuori scope di questo documento).
