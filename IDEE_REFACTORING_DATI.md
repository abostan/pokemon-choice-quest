# Idee di refactoring — verso una struttura più scalabile

> **Superato da `ROADMAP_V2.md`**: tutte le idee di questo documento sono
> state integrate nelle milestone pertinenti di `ROADMAP_V2.md` (0, 0bis, 3,
> 4, 5, 7, 8, 10). Questo file resta come discussione originale/più
> dettagliata di alcuni punti (in particolare le sezioni 2-4 sui pool
> combinatori), ma la versione organizzata per un eventuale rewrite è
> `ROADMAP_V2.md`.

Documento di lavoro, non un piano da eseguire: raccoglie le idee emerse
ragionando su come gestiamo oggi i pool di Pokémon (`data/exploreZonePools.js`)
e su un'architettura alternativa proposta dall'utente (sezioni 1-4), più un
elenco più ampio di spunti di refactoring per il resto del progetto (sezione
5), nato da una domanda esplicita: se il progetto dovesse crescere, cosa
oggi richiede modificare **N file sparsi per aggiungere una singola cosa**
concettuale (una regione, un bivio, un oggetto, un achievement)? Nessun
codice toccato finché non si decide di procedere — vedi la sezione finale
per cosa manca prima di poterlo fare seriamente.

---

## 1. Come funziona oggi

Ogni pool (per zona a tema, per regione, pre/post-game) è un **array scritto
a mano**: nessun dato locale collega una specie al suo tipo o alla sua
generazione — i tipi vengono presi da PokeAPI solo a runtime, solo per la UI
(sprite, dettagli), mai per filtrare/generare un pool. Le uniche liste
"strutturali" già esistenti sono:

- `GENERATIONS[].legendaries` / `.starterIds` — dati veri, curati per forza
  (sono scelte narrative, non derivabili).
- `explorationTiers[].{grass,fishing,cave,grass2}` — ampliati a mano in Fase
  11 (7-8 id ciascuno, +765 id totali).
- I 7 pool a tema per zona (`FIRE_POOLS_BY_REGION` ecc.) — curati a mano
  oggi, per regione, sistemati in questa sessione dopo che il simulatore
  (`scripts/simulate-pools.mjs`) ha rivelato quanto fossero incompleti.
- `data/evolutions.js` (`EVOLUTIONS`) — tabella evoluzioni a soglia di
  livello, usata sia in gioco sia dal simulatore per calcolare la
  raggiungibilità del Pokédex (Sezione D).
- `data/nationalDex.js` (`NATIONAL_DEX_REGIONS`) — i range id per
  regione (Kanto 1-151 ecc.), estratto da `PokedexModal.js` in questa
  stessa sessione.

**Il problema strutturale, non solo di dati**: non esiste alcun meccanismo
che garantisca completezza o bilanciamento. Ogni pool è "corretto" solo
finché qualcuno lo cura a mano — ed è esattamente quello che abbiamo passato
un'intera sessione a fare (pool da 2-3 specie, 3 regioni intere senza pool
dedicato, mai emersi finché non abbiamo costruito uno strumento apposta per
scoprirlo). `simulate-pools.mjs` è un cerotto statistico su un problema
architetturale, non una soluzione.

---

## 2. L'idea proposta: pool combinatori (Generazione × Tipo)

Invece di scrivere `paldea: [909, 910, 911, 935, 950]` a mano, generare il
pool combinando due assi:

- **Asse Generazione**: già disponibile come range (`NATIONAL_DEX_REGIONS`),
  o come filtro su `GENERATIONS[].id`.
- **Asse Tipo**: **non esiste ancora localmente** — richiede un nuovo
  dataset `POKEMON_TYPES_BY_ID` (id → tipi), oggi assente dal repo.

Un pool diventa quindi il risultato di una funzione pura, non un array
scritto a mano:

```
buildTypePool(generationId, ["fire", "ground", "rock"])
  → tutti gli id di quella generazione con uno di quei tipi
```

### Perché ha senso

- **Scala automaticamente**: aggiungere una decima regione non richiederebbe
  più curare 7 pool a mano — si genererebbero da soli.
- **Garantisce una dimensione minima** in modo strutturale invece che a
  campione (il problema di oggi — `iceZone` ferma a 4 specie ovunque — non
  può ripresentarsi se il pool è "tutti i Ghiaccio/Acciaio/Volanti della
  generazione", quasi sempre ben sopra la soglia).
- **Elimina la classe di bug di oggi**: "regione dimenticata" non può più
  succedere se il pool si genera dalla lista delle generazioni invece che
  da una mappa scritta a mano che qualcuno può dimenticare di aggiornare.

### Cosa serve prima di poterlo fare

1. **Il dataset dei tipi**: uno script una tantum che interroga PokeAPI per
   tutti i 1025 id e salva un file statico (`data/pokemonTypes.js` o
   `.json`, committato nel repo) — **non** un fetch live a runtime, per non
   introdurre una dipendenza di rete nella logica di gioco (oggi PokeAPI è
   usata solo per sprite/flavor text, mai per decisioni di gameplay).
2. **Le zone non sono "un tipo solo"**: `iceZone` oggi è già descritta come
   "Ghiaccio, Acciaio e Volante" — quindi ogni zona andrebbe definita come
   un **insieme** di tipi, non un tipo singolo. Nessun problema concettuale,
   basta fare l'unione.
3. **Doppio tipo**: un Pokémon con due tipi comparirebbe in entrambi i pool
   pertinenti — probabilmente corretto/desiderabile (più varietà), ma va
   deciso esplicitamente, non lasciato implicito.
4. **Esclusione dei leggendari**: `gen.legendaries` va sempre sottratto dal
   pool combinatorio, altrimenti un leggendario finirebbe anche nei pool
   "normali" (rompendo la sua rarità/specialità narrativa — oggi è raggiunto
   solo tramite il bivio dedicato).
5. **Stadio evolutivo**: un pool "tutti i Fuoco di Kalos" includerebbe sia
   Fennekin (base) sia Delphox (evoluzione finale, potenzialmente forte) —
   oggi i pool sono già curati in modo informale per evitare questo, ma un
   generatore combinatorio dovrebbe decidere esplicitamente se filtrare per
   stadio evolutivo (es. solo forme base/non-evolute per le zone
   pre-postgame, dove il livello assegnato è basso indipendentemente dalla
   specie scelta) o accettare il mix. Questo si può calcolare da
   `EVOLUTIONS`: un id è "forma base" se non compare mai come `evolvesTo` di
   nessun altro id.

### Zone che NON si prestano a questo modello

Non tutte le zone sono tassonomiche — alcune sono a tema narrativo:
**Safari** (esotico/raro), **Laboratorio Fossili** (specie "antiche"),
**Uovo Misterioso** (carino/raro), **Scambio NPC** (specie rara "di
scambio"). Nessuna di queste corrisponde a un insieme di tipi — resterebbero
curate a mano, oppure si potrebbe esplorare un **asse diverso** invece del
tipo: una "fascia di rarità" (es. derivata dal base stat total o dal tasso
di cattura reale, disponibili anch'essi da PokeAPI) per pool come Safari o
Scambio NPC, dove il criterio narrativo è "raro", non "di un certo tipo".

---

## 3. Estendere la stessa logica ad altre parti del gioco?

Punti dove esiste oggi lo stesso pattern ("array curato a mano per
regione") e che potrebbero beneficiarne:

- **`explorationTiers` (grass/fishing/cave/grass2)**: stesso identico
  problema dei pool a tema, solo già ampliato a mano una volta (Fase 11).
  Un generatore combinatorio (Gen × {tipi tipici di erba/acqua/grotta})
  renderebbe quell'ampliamento permanente/automatico invece di un
  intervento una tantum da rifare ad ogni nuova regione.
- **Pool post-game**: già multi-generazione per design — diventerebbero
  semplicemente "tutte le generazioni × set di tipi", la stessa formula
  usata pre-postgame ma senza il filtro sulla generazione corrente.

Punti dove **non** ha senso applicarla (per completezza, non tutto deve
diventare combinatorio):

- **Squadre di Capipalestra/Alto Comando/Campione/Rivale**: sono scelte
  narrative precise (un capopalestra "è" un personaggio con una squadra
  pensata), non liste di specie intercambiabili — devono restare curate.
- **Oggetti tematici** (`WEATHER_ITEM_BY_ID`, `EVOLUTION_STONES`,
  `SAFARI_ITEMS`): liste piccole e finite per design (le pietre evolutive
  sono un insieme chiuso nei giochi reali), non hanno un "asse" naturale da
  combinare.

**Precedente già esistente nel progetto** che va nella stessa direzione:
i 36 achievement per-regione (Fase 11) sono già **generati** da
`GENERATIONS` invece che scritti a mano uno per uno — la stessa filosofia
che si vorrebbe applicare qui, solo non ancora ai pool.

---

## 4. Bozza di struttura dati (solo abbozzo, da discutere)

```js
// data/pokemonTypes.js — generato una tantum da script, poi committato
export const POKEMON_TYPES_BY_ID = {
  1: ["grass", "poison"],
  4: ["fire"],
  // ... tutti i 1025 id
};

// data/zoneDefinitions.js — la zona diventa un DATO (i tipi che la
// compongono), non più un array di id
export const ZONE_TYPE_SETS = {
  fireZone: ["fire", "ground", "rock"],
  ghostZone: ["ghost", "psychic", "dark", "fairy"],
  iceZone: ["ice", "steel", "flying"],
  fightingZone: ["fighting", "normal"],
};

// engine/poolBuilder.js — nuovo modulo puro, riusabile da gioco e simulatore
export function buildTypePool(generationId, types, { excludeIds = [] } = {}) {
  // GENERATIONS + POKEMON_TYPES_BY_ID + NATIONAL_DEX_REGIONS già esistenti
}
```

Le `label`/`hint` narrative del bivio restano nel componente (sono testo,
non dati derivabili) — cambia solo *da dove viene* l'array di id.

---

## 5. Altre idee di refactoring, oltre ai pool

Elenco ampio e non filtrato, come richiesto — non tutte le voci hanno lo
stesso peso, alcune sono davvero minori. Raggruppate per tema.

### 5.1 Contenuti generati invece che scritti a mano (stesso spirito della sezione 2)

- **Bivi/zone come registro dati unico**: oggi aggiungere un'opzione al
  bivio (fisso o post-game) richiede toccare `ExploreSceneContainer.js` (in
  due punti distinti, uno per pre- e uno per post-game), `EXPLORE_SPECIAL_WEIGHTS`
  in `exploreOptions.js`, il pool in `exploreZonePools.js` — e, di fatto,
  anche `scripts/simulate-pools.mjs`, che oggi mantiene una sua copia
  manuale di `POSTGAME_SPECIAL_IDS` proprio perché quell'elenco non esiste
  come dato esportato da nessuna parte (l'ho scritto e commentato
  esplicitamente come "va tenuto in sync a mano" — un rischio di drift reale
  che ho introdotto io stesso in questa sessione). Un registro unico
  (`EXPLORE_OPTIONS = [{ id, label, hint, weight, pool, effect }, ...]`)
  userebbe la stessa lista sia per renderizzare il bivio sia per il
  simulatore, eliminando la copia manuale.
- **Achievement**: oggi si sblocca un achievement chiamando
  `unlockAchievement(id)` da punti sparsi nel codice di gioco
  (`GymBattleSceneContainer.js`, `LeagueSceneContainer.js`,
  `SceneRouter.js`, `useGameState.js`...) — aggiungerne uno nuovo richiede
  sia una entry in `achievements.js` sia trovare/aggiungere la chiamata nel
  punto giusto della logica di business. Un sistema a eventi (la logica di
  gioco emette eventi generici tipo `gymBattleWon`/`legendaryCaught`/
  `championDefeated`, e l'achievement engine ci si registra sopra in modo
  dichiarativo) disaccoppierebbe "cosa succede in gioco" da "quali trofei
  esistono" — oggi il primo deve sapere esplicitamente del secondo.
- **Oggetti**: le informazioni su un item sono sparse fra `data/items.js`
  (descrizione/icona), il punto dove viene assegnato (uno o più pool),
  `engine/itemEffects.js` (se ha un effetto in battaglia) e i raggruppamenti
  tematici in `exploreZonePools.js` (`EVOLUTION_STONES`/`SAFARI_ITEMS`).
  Un registro singolo per oggetto (`{ name, icon, description, effect,
  obtainableFrom }`) letto dagli altri sistemi invece di duplicato tra loro
  ridurrebbe i punti di modifica per aggiungerne uno nuovo.

### 5.2 Organizzazione dei file

- **`ExploreSceneContainer.js` fa troppe cose**: pre-postgame e post-game
  sono due macchine a stati quasi indipendenti nello stesso file (oltre
  700 righe anche dopo aver estratto i pool). Separarli in due file/hook
  (`usePrePostgameExplore.js` / `usePostgameExplore.js`) più un container
  sottile che sceglie quale montare renderebbe ciascuno più leggibile e
  testabile in isolamento.
- **`data/generations.js` cresce senza limite**: già ~700+ righe per 9
  regioni. Se se ne aggiungessero altre, valutare uno split per regione
  (`data/generations/kanto.js`, `.../johto.js`, ecc.) con un file indice che
  li riunisce in `GENERATIONS` — nessun altro modulo dovrebbe accorgersene
  (stesso array esportato, stessa forma).
- **Badge duplicati in stile**: `.new-species-badge`, `.ball-lure-badge`,
  `.legendary-badge`, `.caught-badge` sono classi CSS quasi identiche create
  una per volta man mano che serviva un badge nuovo. Un componente unico
  `<Badge variant="...">` con una sola classe base + modificatori
  scalerebbe meglio del pattern "una classe nuova per ogni badge".

### 5.3 Gestione dello stato

- **L'oggetto `game` come prop-drilling universale**: quasi ogni scena
  riceve l'intero oggetto `game` (decine di funzioni/campi) anche quando
  gliene servono 3. Rende difficile capire, leggendo un componente, da cosa
  dipende davvero. Da valutare (non urgente, è un cambiamento pervasivo):
  hook più piccoli e componibili (`useTeamState`, `useExploreState`,
  `useBattleState`) invece di un unico `useGameState` monolitico, o un
  Context per evitare di passare tutto esplicitamente.
- **`saveSanitizer.js` come funzione unica che deve conoscere ogni forma
  storica**: il caso `rivalDone` bool→number di questa sessione è un
  esempio di un pattern che si ripeterà — ogni campo che cambia forma nel
  tempo aggiunge un ramo alla stessa funzione. Con più campi/più versioni
  del salvataggio, uno schema di migrazioni esplicite e sequenziali
  (`v1→v2`, `v2→v3`, applicate in ordine) scalerebbe meglio di una singola
  funzione che deve gestire tutte le combinazioni contemporaneamente.

### 5.4 Tooling e dev-experience

- **Un type-checking leggero, senza rompere la filosofia "zero build"**:
  aggiungere `JSDoc` (`@typedef`/`@param`) + uno script dev-only
  `npm run typecheck` (`tsc --checkJs --noEmit`, mai eseguito in produzione,
  il gioco continua a essere servito come oggi via CDN senza bundler)
  avrebbe intercettato **due bug reali di questa sessione**: il
  `ReferenceError: MAX_LEVEL is not defined` (un type-checker segnala
  subito un identificativo non definito) e probabilmente anche l'id
  sbagliato in `evolutions.js` se i tipi fossero stati abbastanza specifici
  da vincolare gli id a un range noto.
- **ESLint, anche solo con le regole base** (`no-undef`, `no-unused-vars`):
  stesso discorso — `no-undef` avrebbe reso impossibile anche solo salvare
  il file con il bug `MAX_LEVEL`. Dev-only, zero impatto sul runtime.
- **`mulberry32` duplicato**: la stessa funzione PRNG esiste identica in
  `tests/explorePicker.test.js` e in `scripts/simulate-pools.mjs` (l'ho
  copiata io stesso in questa sessione seguendo il precedente del test).
  Piccola cosa, ma andrebbe estratta in un util condiviso
  (`scripts/lib/testRng.mjs` o simile) invece di vivere in due posti.
- **Costanti di bilanciamento sparse**: `MAX_LEVEL`/`LEGENDARY_CHANCE` sono
  già centralizzate in `gameStateTransitions.js`, ma altri numeri di
  bilanciamento (soglia di dominazione dei bivi, dimensione minima di un
  pool, quante opzioni mostrare per bivio) vivono ciascuno nel file che li
  usa. Un solo file `data/balanceConstants.js` con tutti i numeri "di
  tuning" del gioco renderebbe più facile trovarli e ribilanciare in futuro
  (esattamente il tipo di modifiche fatte più volte in questa sessione).

### 5.5 Documentazione

- **Sei file `.md` alla radice** (`README`, `ROADMAP`, `ROADMAP_V2`,
  `ANALISI_TECNICA`, `MANUAL_TECNICO`, `SPEC`, più questo nuovo
  `IDEE_REFACTORING_DATI`) senza un indice che spieghi il ruolo di
  ciascuno o perché coesistono `ROADMAP` e `ROADMAP_V2`. Man mano che se ne
  aggiungono altri, rischia di diventare confuso quale sia la fonte di
  verità per cosa. Anche solo una tabella riepilogativa in cima al README
  ("questo file serve a X, guarda invece Y per Z") risolverebbe gran parte
  del problema senza spostare nulla.

### 5.6 Cose piccole/futili

- Naming non sempre coerente tra contatori simili (`postgameRound`,
  `choicesCount`, `tournamentRound`, `gymIndex` — alcuni "Count", altri
  "Round", altri "Index" per concetti simili di "quante volte è successo
  qualcosa").
- I file di dati usano sia virgolette doppie sia singole in punti diversi
  (minore, un formatter tipo Prettier con config fissa lo renderebbe
  invisibile come problema, dev-only anche questo).
- Alcuni commenti nei dati (es. le sigle regionali nei pool) potrebbero
  diventare un JSDoc strutturato invece di un commento libero, se si
  aggiunge il type-checking del punto 5.4.

## 6. Domande aperte da decidere prima di scrivere codice

1. Le zone non tipizzabili (Safari/Fossili/Uovo/Scambio) restano curate a
   mano per sempre, o si prova un asse "rarità" anche per quelle?
2. Le forme evolute vanno incluse nei pool pre-postgame, o solo le forme
   base (lasciando che l'evoluzione avvenga in gioco)?
3. Un pool combinatorio molto grande (es. "tutti i Normal-type" potrebbero
   essere 60+ specie in una generazione) è un bene (più varietà) o perde
   l'identità "curata"/iconica che le zone hanno oggi? Serve un tetto
   massimo per zona, o va bene senza?
4. Migrazione: big-bang (sostituire tutti i pool in un colpo) o incrementale
   zona per zona, usando `simulate-pools.mjs` come rete di sicurezza per
   confrontare "prima vs dopo" ad ogni passo?
5. Chi rigenera `pokemonTypes.js` se in futuro si aggiunge una decima
   generazione? Serve uno script di rigenerazione documentato (non un
   fetch live), stesso principio già seguito per non introdurre dipendenze
   di rete nella logica di gioco.

## 7. Prossimi passi (di processo, non di codice)

- Rispondere insieme alle domande della sezione 5.
- Prototipare `poolBuilder.js` isolato e testato, **senza** ancora toccare
  `ExploreSceneContainer.js` — verificarne l'output con lo stesso approccio
  già validato in questa sessione (`simulate-pools.mjs` come confronto
  prima/dopo) prima di sostituire un solo pool esistente.
- Solo dopo aver validato un pool combinatorio contro quello curato attuale,
  decidere se estendere il refactoring agli altri.
