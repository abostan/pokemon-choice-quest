# Idee di refactoring — dati combinatori invece di array curati a mano

Documento di lavoro, non un piano da eseguire: raccoglie le idee emerse
ragionando su come gestiamo oggi i pool di Pokémon (`data/exploreZonePools.js`)
e su un'architettura alternativa proposta dall'utente. Nessun codice toccato
finché non si decide di procedere — vedi la sezione finale per cosa
manca prima di poterlo fare seriamente.

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

## 5. Domande aperte da decidere prima di scrivere codice

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

## 6. Prossimi passi (di processo, non di codice)

- Rispondere insieme alle domande della sezione 5.
- Prototipare `poolBuilder.js` isolato e testato, **senza** ancora toccare
  `ExploreSceneContainer.js` — verificarne l'output con lo stesso approccio
  già validato in questa sessione (`simulate-pools.mjs` come confronto
  prima/dopo) prima di sostituire un solo pool esistente.
- Solo dopo aver validato un pool combinatorio contro quello curato attuale,
  decidere se estendere il refactoring agli altri.
