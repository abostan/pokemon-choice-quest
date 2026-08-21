# Roadmap & Changelog — Pokémon: Scegli il Cammino

Questo documento traccia l'evoluzione del progetto, le funzionalità implementate versione per versione e le idee pianificate per il futuro.

---

## 📜 Storico delle Versioni

### Versione 1.0 — Prova di Concetto (v1)
- Starter unico della prima generazione (Gen 1).
- Struttura base: bivio iniziale, incontro selvatico, singola palestra, sfida col rivale e schermata finale.
- Calcolo esito basato sulle scelte narrative e sulla potenza complessiva della squadra (senza ruota della fortuna).
- Integrazione con PokeAPI per sprite e dati dei Pokémon in tempo reale.

---

### Versione 2.0 — Regioni e Campionato Completo (v2)
- **Selezione della Regione**: supporto per Kanto (Gen 1) e Johto (Gen 2).
- **Campionato completo**: 8 Palestre fedeli per ordine e tipo, seguiti dall'Alto Comando (4 membri) e il Campione della Lega.
- **Tappe di Esplorazione**: bivi esplorativi scalati in 3 tier di difficoltà tra una palestra e l'altra (erba alta, pesca, grotta con oggetti, o allenamento).
- **Sfida Rivale**: evento battaglia a sorpresa a metà percorso.
- **Barra di Avanzamento**: indicatore visivo del progresso nella Lega.
- **Script di simulazione**: `scripts/simulate-flow.mjs` per validare la sequenza di gioco a secco.

---

### Versione 3.0 — Espansione Multi-Gen, Evoluzioni & Sistema Salvataggio (v3+ attuale)

#### 🗺️ 4 Generazioni Giocabili
- Aggiunte **Hoenn (Gen 3)** e **Sinnoh (Gen 4)** con starter dedicati, 8 palestre originali per regione, Alto Comando, Campioni (Steven/Wallace, Cynthia) e Leggendari.
- **Progressione Multi-Generazione**: completata una Lega, si può passare direttamente alla regione successiva mantenendo squadra, box e zaino.

#### 🧬 Sistema di Evoluzioni
- Evoluzione automatica al raggiungimento del livello-soglia (180+ specie mappate per Gen 1-4).
- **Blocco Evoluzione (Tasto B)**: overlay visivo con anteprima sprite che permette al giocatore di accettare o annullare l'evoluzione di ogni singolo Pokémon.

#### 📖 Pokédex Completo
- Pulsante fisso nell'header per aprire il modale Pokédex.
- **Vista Run attuale**: traccia i Pokémon visti e catturati nella sessione in corso.
- **Vista Storico**: archivio permanente di tutte le specie mai catturate su quel browser (persistito su `localStorage`).

#### 💾 Salvataggio Automatico & Ripresa
- Salvataggio dello stato di gioco ad ogni cambio di fase su `localStorage`.
- **Schermata di Ripresa (`ResumeScreen`)**: all'avvio riassume data, regione, progresso e squadra per riprendere o iniziare una nuova partita.

#### 📦 Gestione Box
- Squadra attiva limitata a 6 Pokémon.
- I Pokémon catturati oltre il 6° vanno automaticamente nel **Box**.
- **Modale Box (`BoxModal`)**: accessibile dal `TeamPanel` per scambiare liberamente i Pokémon tra squadra attiva e riserva.

#### ♾️ Modalità Infinita Post-Game & Leggendari
- Completate tutte le generazioni, si entra nella modalità di **esplorazione infinita** a difficoltà crescente.
- **Incontri Leggendari**: probabilità del 5% per round di incontrare un Pokémon leggendario unico (Articuno, Zapdos, Groudon, Rayquaza, Dialga, Palkia, ecc.) con stile visivo dedicato e probabilità di cattura ridotta al 10%.

---

### Versione 4.0 — Shiny, Oggetti in Battaglia, Unova, Kalos & Multi-Save (v4.0 attuale)

#### ✨ Sistema Pokémon Shiny
- [x] Logica 1/500 di probabilità Shiny negli incontri selvatici (1/20 per i leggendari).
- [x] Salvataggio del flag `isShiny: true` in squadra, box e Pokédex.
- [x] Rendering dello sprite Shiny tramite `spriteShiny` PokeAPI.
- [x] Badge stella ✨, titolo dorato e bagliore animato CSS.

#### 🎒 Oggetti & Strumenti in Battaglia
- [x] Selezione ed utilizzo degli strumenti dello zaino prima di scegliere la tattica in `BattleScene`.
- [x] Incremento temporaneo della potenza della squadra (+10/+18).
- [x] Consumo ed eliminazione dell'oggetto dallo zaino a seguito dell'uso.

#### 🗺️ 6 Generazioni Giocabili
- [x] Aggiunta di **Unova (Gen 5)**: Snivy, Tepig, Oshawott, 8 Palestre, Alto Comando e Leggendari (Reshiram, Zekrom, Kyurem, Cobalion, ecc.).
- [x] Aggiunta di **Kalos (Gen 6)**: Chespin, Fennekin, Froakie, 8 Palestre, Alto Comando e Leggendari (Xerneas, Yveltal, Zygarde).
- [x] 300+ evoluzioni mappate in `evolutions.js`.
- [x] Simulazione validata per tutte le 6 generazioni (22 passi ciascuna).

#### 💾 Slot di Salvataggio Multipli & Backup JSON
- [x] Supporto per 3 slot di salvataggio indipendenti (`Slot 1`, `Slot 2`, `Slot 3`) su `localStorage`.
- [x] Riprogettazione di `ResumeScreen` con schede interattive, date e riassunti per ogni slot.
- [x] Funzionalità di **Esportazione Backup JSON** e **Importazione Backup JSON** da file locale.

### Versione 5.0 — Pokédex Album Grid 721 Specie, Habitat Tematici, Tooltip & PC Box Transition (attuale)

#### 📖 Pokédex Album Grid (721 Specie) & Filtri per Regione
- [x] Estensione del Pokédex a **tutti i 721 slot** delle prime 6 generazioni.
- [x] Nuova vista **Griglia Album (⬛)** a schede di figurine con anteprime pixel e silhouette `? Ignoto`.
- [x] Tab di navigazione rapida per regione: **Kanto (1-151)**, **Johto (152-251)**, **Hoenn (252-386)**, **Sinnoh (387-493)**, **Unova (494-649)** e **Kalos (650-721)**.
- [x] Toggle per alternare in qualsiasi momento tra la **Griglia Album (⬛)** e la **Lista Dettagliata (☰)**.
- [x] Correzione registrazione evoluzioni: le forme evolute accettate vengono ora salvate automaticamente nel Pokédex della run e dello storico.

#### 🎒 Tooltip & Descrizioni degli Oggetti
- [x] Modulo `src/data/items.js` con le descrizioni dettagliate di tutti gli strumenti (Pozioni, Pietre evolutive, Rimedi, Esche, Biscotti).
- [x] Tooltip informativi al passaggio del mouse su ciascun elemento dello Zaino nella barra laterale (`TeamPanel`).
- [x] Tooltip descrittivi sui pulsanti degli strumenti prima delle battaglie in `BattleScene`.

#### 🗺️ Nuovi Bivi Narrative ed Habitat per Tutti i Tipi
- [x] ⭐ **Santuario Antico (Leggendari)**: cerca e affronta i Pokémon Leggendari della regione (Articuno, Lugia, Rayquaza, Dialga, Reshiram, Xerneas, ecc.).
- [x] 🌋 **Vulcano & Centrale Elettrica**: habitat per Pokémon di tipo **Fuoco**, **Elettrico** ed **Acciaio**.
- [x] 👻 **Foresta Stregata & Rovine**: habitat per Pokémon di tipo **Spettro**, **Psico**, **Buio** e **Fata**.
- [x] ❄️ **Vetta Innevata & Ghiacciaio**: habitat per Pokémon di tipo **Ghiaccio**, **Acciaio** e **Volante**.
- [x] 🥊 **Dojo dei Combattenti**: habitat per Pokémon di tipo **Lotta** e **Normale**.
- [x] 🐣 **Cova un Uovo Misterioso**: ricevi ed alletta un uovo di Pokémon raro/baby (Eevee, Togepi, Riolu, Zorua, Goomy, Dratini) a Lv 5.
- [x] 🕵️‍♂️ **Incursione del Team Nemico**: sfida la recluta del Team Rocket / Flare / Plasma per sbloccare la via e guadagnare premi.
- [x] ⚔️ **Allenatori del Percorso** e 🔍 **Cercatore di Strumenti & Bacche**.

#### 📦 Transizione del Team nel PC Box ad Ogni Cambio Regione
- [x] Quando si batte la Lega e si passa alla regione successiva, l'intera squadra precedente viene trasferita e conservata nel **PC Box**.
- [x] Il giocatore inizia la nuova regione solo con il **nuovo starter locale a Lv 5**, mantenendo la possibilità di ritirare i vecchi campioni dal Box in qualsiasi momento.

### Versione 5.5 — 9 Generazioni Giocabili (Alola, Galar, Paldea) & Pokédex 1025 Specie (attuale)

#### 🗺️ 9 Generazioni Giocabili
- [x] **Alola (Gen 7)**: Rowlet, Litten, Popplio | Prove dei Capitani, Kahuna e Campione Kukui.
- [x] **Galar (Gen 8)**: Grookey, Scorbunny, Sobble | Palestre negli stadi, Torneo della Lega e Campione Dandel (Leon).
- [x] **Paldea (Gen 9)**: Sprigatito, Fuecoco, Quaxly | Capipalestra dell'Accademia, Superquattro (Rika, Poppy, Larry, Hassel) e Prima Campionessa Alisma (Geeta).
- [x] Leggendari unici per ciascuna nuova regione: Solgaleo, Lunala, Necrozma, Zacian, Zamazenta, Eternatus, Koraidon, Miraidon, Terapagos.

#### 📖 Pokédex Nazionale Completo (1025 Specie)
- [x] Estensione del Pokédex a **tutti i 1025 slot** (#1 Bulbasaur fino a #1025 Pecharunt).
- [x] Nuovi tab di navigazione rapida per regione: **Alola (722-809)**, **Galar (810-905)** e **Paldea (906-1025)**.
- [x] Vista Griglia Album e Lista Dettagliata per tutte le 1025 specie.
- [x] Mappatura evoluzioni completa per Gen 7, 8 e 9 in `evolutions.js`.

### Versione 5.6 — Battaglie Boss Narrative contro i Capo Team & Master Ball (attuale)

#### 🕵️ Battaglie Boss Narrative contro i Capo Team
- [x] **Scontri Boss Unici per Ciascuna delle 9 Generazioni**:
  - Kanto (Gen 1): Giovanni (Team Rocket) — *Master Ball* 🟣
  - Johto (Gen 2): Archer (Team Rocket) — *Caramella Rara (+3 Livelli)* 🍬
  - Hoenn (Gen 3): Max / Archie (Team Magma/Aqua) — *Master Ball* 🟣
  - Sinnoh (Gen 4): Cyrus (Team Galassia) — *Master Ball* 🟣
  - Unova (Gen 5): Ghetsis (Team Plasma) — *Caramella Rara (+3 Livelli)* 🍬
  - Kalos (Gen 6): Lysandre (Team Flare) — *Master Ball* 🟣
  - Alola (Gen 7): Guzma (Team Skull) — *Caramella Rara (+3 Livelli)* 🍬
  - Galar (Gen 8): Presidente Rose (Macro Cosmos) — *Master Ball* 🟣
  - Paldea (Gen 9): Eri & Cassiopea (Team Star) — *Caramella Rara (+3 Livelli)* 🍬
- [x] Attivazione automatica dello scontro boss a metà percorso dopo la 4ª palestra (`afterGymIndex: 3`).

#### 🟣 Strumento Master Ball & Caramella Rara
- [x] **Master Ball**: Pulsante speciale `🟣 Lancia una MASTER BALL!` durante gli incontri selvatici o leggendari con **cattura garantita al 100%**.
- [x] Consumo ed eliminazione della Master Ball dallo zaino a seguito dell'uso.
- [x] **Caramella Rara**: Incremento immediato di **+3 Livelli** per tutta la squadra a seguito della vittoria del boss.

### Versione 5.7 — Sistema di Efficacia dei Tipi (Type Matchups) (attuale)

#### ⚡ Sistema Efficacia dei Tipi
- [x] Mappatura dei 18 tipi primari Pokémon in `src/data/types.js` (Fuoco, Acqua, Erba, Elettrico, Lotta, Spettro, Psico, Buio, Ghiaccio, Drago, Acciaio, Folletto, Roccia, Terra, Volante, Coleottero, Veleno, Normale).
- [x] Modulo `src/engine/typeMatchup.js` per il calcolo delle relazioni tra i 18 tipi.
- [x] **⚡ Super Efficace (+15% Potenza Squadra)**: Se la squadra possiede Pokémon avvantaggiati rispetto al tipo del Capopalestra/Boss.
- [x] **⚠️ Poco Efficace (-10% Potenza Squadra)**: Se la squadra è vulnerabile al tipo di palestra.
- [x] **📊 Badge Visivo in `BattleScene`**: Indicatore cromatico verde/rosso prima della battaglia con spiegazione del bonus o svantaggio di tipo.

### Versione 5.8 — Modalità Sfida Hardcore / Nuzlocke (attuale)

#### 💀 Modalità Nuzlocke Hardcore
- [x] Toggle attivabile nella schermata iniziale di selezione starter (`StartScreen.js`).
- [x] **⚰️ Permadeath (Morte Permanente)**: I Pokémon svenuti in battaglia finiscono nel Box PC contrassegnati come `isFainted: true` (Esausti) e non possono più essere curati o rimessi in squadra.
- [x] **📦 Blocco Scambio Box**: `BoxModal` impedisce il reinserimento in squadra dei Pokémon svenuti con indicatore visivo `⚰️ Esausto`.
- [x] **🏷️ Badge Visivo UI**: Badge rosso `💀 NUZLOCKE HARDCORE MODE` nel pannello laterale della squadra (`TeamPanel`).

### Versione 5.9 — Sistema di Megaevoluzione / Gigamax (attuale)

#### 🔮 Megaevoluzione / Gigamax (+30% Potenza)
- [x] Pulsante speciale viola/dorato `🔮 Attiva MEGAEVOLUZIONE / GIGAMAX!` in `BattleScene.js`.
- [x] Modulo `src/engine/megaLogic.js` per il calcolo dell'incremento del **+30% alla potenza della squadra**.
- [x] Badge animato `🔮 MEGAEVOLUZIONE / GIGAMAX ATTIVA (+30% POTENZA SQUADRA!)` visibile durante la battaglia.
- [x] Limite di 1 attivazione per battaglia durante le sfide contro Capipalestra, Boss dei Team malvagi, Alto Comando e Campione.

### Versione 6.0 — Sala della Fama & Hall of Fame Storica (attuale)

# Roadmap & Changelog — Pokémon: Scegli il Cammino

Questo documento traccia l'evoluzione del progetto, le funzionalità implementate versione per versione e le idee pianificate per il futuro.

---

## 📜 Storico delle Versioni

### Versione 1.0 — Prova di Concetto (v1)
- Starter unico della prima generazione (Gen 1).
- Struttura base: bivio iniziale, incontro selvatico, singola palestra, sfida col rivale e schermata finale.
- Calcolo esito basato sulle scelte narrative e sulla potenza complessiva della squadra (senza ruota della fortuna).
- Integrazione con PokeAPI per sprite e dati dei Pokémon in tempo reale.

---

### Versione 2.0 — Regioni e Campionato Completo (v2)
- **Selezione della Regione**: supporto per Kanto (Gen 1) e Johto (Gen 2).
- **Campionato completo**: 8 Palestre fedeli per ordine e tipo, seguiti dall'Alto Comando (4 membri) e il Campione della Lega.
- **Tappe di Esplorazione**: bivi esplorativi scalati in 3 tier di difficoltà tra una palestra e l'altra (erba alta, pesca, grotta con oggetti, o allenamento).
- **Sfida Rivale**: evento battaglia a sorpresa a metà percorso.
- **Barra di Avanzamento**: indicatore visivo del progresso nella Lega.
- **Script di simulazione**: `scripts/simulate-flow.mjs` per validare la sequenza di gioco a secco.

---

### Versione 3.0 — Espansione Multi-Gen, Evoluzioni & Sistema Salvataggio (v3+ attuale)

#### 🗺️ 4 Generazioni Giocabili
- Aggiunte **Hoenn (Gen 3)** e **Sinnoh (Gen 4)** con starter dedicati, 8 palestre originali per regione, Alto Comando, Campioni (Steven/Wallace, Cynthia) e Leggendari.
- **Progressione Multi-Generazione**: completata una Lega, si può passare direttamente alla regione successiva mantenendo squadra, box e zaino.

#### 🧬 Sistema di Evoluzioni
- Evoluzione automatica al raggiungimento del livello-soglia (180+ specie mappate per Gen 1-4).
- **Blocco Evoluzione (Tasto B)**: overlay visivo con anteprima sprite che permette al giocatore di accettare o annullare l'evoluzione di ogni singolo Pokémon.

#### 📖 Pokédex Completo
- Pulsante fisso nell'header per aprire il modale Pokédex.
- **Vista Run attuale**: traccia i Pokémon visti e catturati nella sessione in corso.
- **Vista Storico**: archivio permanente di tutte le specie mai catturate su quel browser (persistito su `localStorage`).

#### 💾 Salvataggio Automatico & Ripresa
- Salvataggio dello stato di gioco ad ogni cambio di fase su `localStorage`.
- **Schermata di Ripresa (`ResumeScreen`)**: all'avvio riassume data, regione, progresso e squadra per riprendere o iniziare una nuova partita.

#### 📦 Gestione Box
- Squadra attiva limitata a 6 Pokémon.
- I Pokémon catturati oltre il 6° vanno automaticamente nel **Box**.
- **Modale Box (`BoxModal`)**: accessibile dal `TeamPanel` per scambiare liberamente i Pokémon tra squadra attiva e riserva.

#### ♾️ Modalità Infinita Post-Game & Leggendari
- Completate tutte le generazioni, si entra nella modalità di **esplorazione infinita** a difficoltà crescente.
- **Incontri Leggendari**: probabilità del 5% per round di incontrare un Pokémon leggendario unico (Articuno, Zapdos, Groudon, Rayquaza, Dialga, Palkia, ecc.) con stile visivo dedicato e probabilità di cattura ridotta al 10%.

---

### Versione 4.0 — Shiny, Oggetti in Battaglia, Unova, Kalos & Multi-Save (v4.0 attuale)

#### ✨ Sistema Pokémon Shiny
- [x] Logica 1/500 di probabilità Shiny negli incontri selvatici (1/20 per i leggendari).
- [x] Salvataggio del flag `isShiny: true` in squadra, box e Pokédex.
- [x] Rendering dello sprite Shiny tramite `spriteShiny` PokeAPI.
- [x] Badge stella ✨, titolo dorato e bagliore animato CSS.

#### 🎒 Oggetti & Strumenti in Battaglia
- [x] Selezione ed utilizzo degli strumenti dello zaino prima di scegliere la tattica in `BattleScene`.
- [x] Incremento temporaneo della potenza della squadra (+10/+18).
- [x] Consumo ed eliminazione dell'oggetto dallo zaino a seguito dell'uso.

#### 🗺️ 6 Generazioni Giocabili
- [x] Aggiunta di **Unova (Gen 5)**: Snivy, Tepig, Oshawott, 8 Palestre, Alto Comando e Leggendari (Reshiram, Zekrom, Kyurem, Cobalion, ecc.).
- [x] Aggiunta di **Kalos (Gen 6)**: Chespin, Fennekin, Froakie, 8 Palestre, Alto Comando e Leggendari (Xerneas, Yveltal, Zygarde).
- [x] 300+ evoluzioni mappate in `evolutions.js`.
- [x] Simulazione validata per tutte le 6 generazioni (22 passi ciascuna).

#### 💾 Slot di Salvataggio Multipli & Backup JSON
- [x] Supporto per 3 slot di salvataggio indipendenti (`Slot 1`, `Slot 2`, `Slot 3`) su `localStorage`.
- [x] Riprogettazione di `ResumeScreen` con schede interattive, date e riassunti per ogni slot.
- [x] Funzionalità di **Esportazione Backup JSON** e **Importazione Backup JSON** da file locale.

### Versione 5.0 — Pokédex Album Grid 721 Specie, Habitat Tematici, Tooltip & PC Box Transition (attuale)

#### 📖 Pokédex Album Grid (721 Specie) & Filtri per Regione
- [x] Estensione del Pokédex a **tutti i 721 slot** delle prime 6 generazioni.
- [x] Nuova vista **Griglia Album (⬛)** a schede di figurine con anteprime pixel e silhouette `? Ignoto`.
- [x] Tab di navigazione rapida per regione: **Kanto (1-151)**, **Johto (152-251)**, **Hoenn (252-386)**, **Sinnoh (387-493)**, **Unova (494-649)** e **Kalos (650-721)**.
- [x] Toggle per alternare in qualsiasi momento tra la **Griglia Album (⬛)** e la **Lista Dettagliata (☰)**.
- [x] Correzione registrazione evoluzioni: le forme evolute accettate vengono ora salvate automaticamente nel Pokédex della run e dello storico.

#### 🎒 Tooltip & Descrizioni degli Oggetti
- [x] Modulo `src/data/items.js` con le descrizioni dettagliate di tutti gli strumenti (Pozioni, Pietre evolutive, Rimedi, Esche, Biscotti).
- [x] Tooltip informativi al passaggio del mouse su ciascun elemento dello Zaino nella barra laterale (`TeamPanel`).
- [x] Tooltip descrittivi sui pulsanti degli strumenti prima delle battaglie in `BattleScene`.

#### 🗺️ Nuovi Bivi Narrative ed Habitat per Tutti i Tipi
- [x] ⭐ **Santuario Antico (Leggendari)**: cerca e affronta i Pokémon Leggendari della regione (Articuno, Lugia, Rayquaza, Dialga, Reshiram, Xerneas, ecc.).
- [x] 🌋 **Vulcano & Centrale Elettrica**: habitat per Pokémon di tipo **Fuoco**, **Elettrico** ed **Acciaio**.
- [x] 👻 **Foresta Stregata & Rovine**: habitat per Pokémon di tipo **Spettro**, **Psico**, **Buio** e **Fata**.
- [x] ❄️ **Vetta Innevata & Ghiacciaio**: habitat per Pokémon di tipo **Ghiaccio**, **Acciaio** e **Volante**.
- [x] 🥊 **Dojo dei Combattenti**: habitat per Pokémon di tipo **Lotta** e **Normale**.
- [x] 🐣 **Cova un Uovo Misterioso**: ricevi ed alletta un uovo di Pokémon raro/baby (Eevee, Togepi, Riolu, Zorua, Goomy, Dratini) a Lv 5.
- [x] 🕵️‍♂️ **Incursione del Team Nemico**: sfida la recluta del Team Rocket / Flare / Plasma per sbloccare la via e guadagnare premi.
- [x] ⚔️ **Allenatori del Percorso** e 🔍 **Cercatore di Strumenti & Bacche**.

#### 📦 Transizione del Team nel PC Box ad Ogni Cambio Regione
- [x] Quando si batte la Lega e si passa alla regione successiva, l'intera squadra precedente viene trasferita e conservata nel **PC Box**.
- [x] Il giocatore inizia la nuova regione solo con il **nuovo starter locale a Lv 5**, mantenendo la possibilità di ritirare i vecchi campioni dal Box in qualsiasi momento.

### Versione 5.5 — 9 Generazioni Giocabili (Alola, Galar, Paldea) & Pokédex 1025 Specie (attuale)

#### 🗺️ 9 Generazioni Giocabili
- [x] **Alola (Gen 7)**: Rowlet, Litten, Popplio | Prove dei Capitani, Kahuna e Campione Kukui.
- [x] **Galar (Gen 8)**: Grookey, Scorbunny, Sobble | Palestre negli stadi, Torneo della Lega e Campione Dandel (Leon).
- [x] **Paldea (Gen 9)**: Sprigatito, Fuecoco, Quaxly | Capipalestra dell'Accademia, Superquattro (Rika, Poppy, Larry, Hassel) e Prima Campionessa Alisma (Geeta).
- [x] Leggendari unici per ciascuna nuova regione: Solgaleo, Lunala, Necrozma, Zacian, Zamazenta, Eternatus, Koraidon, Miraidon, Terapagos.

#### 📖 Pokédex Nazionale Completo (1025 Specie)
- [x] Estensione del Pokédex a **tutti i 1025 slot** (#1 Bulbasaur fino a #1025 Pecharunt).
- [x] Nuovi tab di navigazione rapida per regione: **Alola (722-809)**, **Galar (810-905)** e **Paldea (906-1025)**.
- [x] Vista Griglia Album e Lista Dettagliata per tutte le 1025 specie.
- [x] Mappatura evoluzioni completa per Gen 7, 8 e 9 in `evolutions.js`.

### Versione 5.6 — Battaglie Boss Narrative contro i Capo Team & Master Ball (attuale)

#### 🕵️ Battaglie Boss Narrative contro i Capo Team
- [x] **Scontri Boss Unici per Ciascuna delle 9 Generazioni**:
  - Kanto (Gen 1): Giovanni (Team Rocket) — *Master Ball* 🟣
  - Johto (Gen 2): Archer (Team Rocket) — *Caramella Rara (+3 Livelli)* 🍬
  - Hoenn (Gen 3): Max / Archie (Team Magma/Aqua) — *Master Ball* 🟣
  - Sinnoh (Gen 4): Cyrus (Team Galassia) — *Master Ball* 🟣
  - Unova (Gen 5): Ghetsis (Team Plasma) — *Caramella Rara (+3 Livelli)* 🍬
  - Kalos (Gen 6): Lysandre (Team Flare) — *Master Ball* 🟣
  - Alola (Gen 7): Guzma (Team Skull) — *Caramella Rara (+3 Livelli)* 🍬
  - Galar (Gen 8): Presidente Rose (Macro Cosmos) — *Master Ball* 🟣
  - Paldea (Gen 9): Eri & Cassiopea (Team Star) — *Caramella Rara (+3 Livelli)* 🍬
- [x] Attivazione automatica dello scontro boss a metà percorso dopo la 4ª palestra (`afterGymIndex: 3`).

#### 🟣 Strumento Master Ball & Caramella Rara
- [x] **Master Ball**: Pulsante speciale `🟣 Lancia una MASTER BALL!` durante gli incontri selvatici o leggendari con **cattura garantita al 100%**.
- [x] Consumo ed eliminazione della Master Ball dallo zaino a seguito dell'uso.
- [x] **Caramella Rara**: Incremento immediato di **+3 Livelli** per tutta la squadra a seguito della vittoria del boss.

### Versione 5.7 — Sistema di Efficacia dei Tipi (Type Matchups) (attuale)

#### ⚡ Sistema Efficacia dei Tipi
- [x] Mappatura dei 18 tipi primari Pokémon in `src/data/types.js` (Fuoco, Acqua, Erba, Elettrico, Lotta, Spettro, Psico, Buio, Ghiaccio, Drago, Acciaio, Folletto, Roccia, Terra, Volante, Coleottero, Veleno, Normale).
- [x] Modulo `src/engine/typeMatchup.js` per il calcolo delle relazioni tra i 18 tipi.
- [x] **⚡ Super Efficace (+15% Potenza Squadra)**: Se la squadra possiede Pokémon avvantaggiati rispetto al tipo del Capopalestra/Boss.
- [x] **⚠️ Poco Efficace (-10% Potenza Squadra)**: Se la squadra è vulnerabile al tipo di palestra.
- [x] **📊 Badge Visivo in `BattleScene`**: Indicatore cromatico verde/rosso prima della battaglia con spiegazione del bonus o svantaggio di tipo.

### Versione 5.8 — Modalità Sfida Hardcore / Nuzlocke (attuale)

#### 💀 Modalità Nuzlocke Hardcore
- [x] Toggle attivabile nella schermata iniziale di selezione starter (`StartScreen.js`).
- [x] **⚰️ Permadeath (Morte Permanente)**: I Pokémon svenuti in battaglia finiscono nel Box PC contrassegnati come `isFainted: true` (Esausti) e non possono più essere curati o rimessi in squadra.
- [x] **📦 Blocco Scambio Box**: `BoxModal` impedisce il reinserimento in squadra dei Pokémon svenuti con indicatore visivo `⚰️ Esausto`.
- [x] **🏷️ Badge Visivo UI**: Badge rosso `💀 NUZLOCKE HARDCORE MODE` nel pannello laterale della squadra (`TeamPanel`).

### Versione 5.9 — Sistema di Megaevoluzione / Gigamax (attuale)

#### 🔮 Megaevoluzione / Gigamax (+30% Potenza)
- [x] Pulsante speciale viola/dorato `🔮 Attiva MEGAEVOLUZIONE / GIGAMAX!` in `BattleScene.js`.
- [x] Modulo `src/engine/megaLogic.js` per il calcolo dell'incremento del **+30% alla potenza della squadra**.
- [x] Badge animato `🔮 MEGAEVOLUZIONE / GIGAMAX ATTIVA (+30% POTENZA SQUADRA!)` visibile durante la battaglia.
- [x] Limite di 1 attivazione per battaglia durante le sfide contro Capipalestra, Boss dei Team malvagi, Alto Comando e Campione.

### Versione 6.0 — Sala della Fama & Hall of Fame Storica (attuale)

#### 🏆 Sala della Fama & Hall of Fame Storica
- [x] Persistenza automatica in `localStorage` (`pcq_hall_of_fame`) ad ogni vittoria contro il Campione della Lega in qualsiasi regione.
- [x] Registro d'onore permanente con nome della regione, data e ora del trionfo, membri della squadra vincente e badge Nuzlocke.
- [x] **📖 Modale `HallOfFameModal.js`**: Tema dorato stile champagne con carte celebrate per ogni trionfo e sprite visivi pixel di tutti i Pokémon campioni.
- [x] **🔘 Pulsante Header (`🏆 Sala della Fama`)**: Accesso rapido consultabile in qualsiasi momento nell'header della app accanto al Pokédex.

### Versione 6.5 — Torneo dei Campioni della Lega Post-Game (attuale)

#### ⚔️ Torneo dei Campioni della Lega (Post-Game)
- [x] Sblocco speciale del Torneo nel Post-Game per sfidare i 5 Campioni leggendari in duello ad eliminazione diretta.
- [x] **Round 1**: 🔴 *Campione Rosso (Kanto)* — Pikachu, Charizard, Blastoise, Venusaur (Potenza 180).
- [x] **Round 2**: 🪨 *Campione Rocco Petri (Hoenn)* — Metagross, Skarmory, Aggron, Armaldo (Potenza 195).
- [x] **Round 3**: 🌸 *Campionessa Camilla (Sinnoh)* — Garchomp, Lucario, Milotic, Spiritomb (Potenza 215).
- [x] **Round 4**: 🐉 *Campione Imbattibile Dandel (Galar)* — Charizard, Dragapult, Aegislash (Potenza 235).
- [x] **Grand Finale**: 👑 *Prima Campionessa Alisma (Paldea)* — Glimmora, Kingambit, Espathra (Potenza 260).
- [x] **🏆 Tabellone del Torneo (`TournamentScene.js`)**: Schermata del tabellone ad eliminazione diretta con stato per ogni sfida.
- [x] **👑 Iscrizione nella Sala della Fama**: Titolo supremo `👑 RE DEI CAMPIONI POKÉMON` e boost +5 livelli per l'intera squadra dopo la vittoria finale.

### Versione 7.0 — Sistema Abilità Passive dei Pokémon (attuale)

#### 🌟 Sistema Abilità Passive dei Pokémon
- [x] Modulo `src/data/abilities.js` per l'assegnazione e il calcolo delle abilità passive delle varie specie.
- [x] **🦁 Prepotenza (Intimidate)**: Riduce la potenza dell'avversario del **-10%** ad ogni scontro.
- [x] **⚡ Pressione (Pressure)**: Aumenta la probabilità di successo in battaglia del **+8%**.
- [x] **🛡️ Levitazione (Levitate)**: Annulla le penalità di svantaggio di tipo (-10% -> 0%).
- [x] **🌊 Nuotavelox (Swift Swim)**: +15% di potenza nelle zone d'acqua e pesca.
- [x] **💥 Acceleratore (Speed Boost)**: +5% alla probabilità di successo tattico in battaglia.
- [x] **🍀 Leggiadria (Serene Grace)**: +10% alla probabilità di cattura Pokémon selvatici.
- [x] **✨ Visualizzazione UI**: Display dei badge delle abilità attive in `TeamPanel.js` ed in `BattleScene.js`.

---

## 🔮 Prossimi Sviluppi & Idee Future (v7.5)

- [ ] **🏆 Classifica Punteggio & Grado di Vittoria**: Punteggio finale basato su tempo, percentuale Pokédex e KO con assegnazione del Grado (S / A / B / C).
- [ ] **🎨 Temi Visivi Personalizzabili**: Selettore di temi per l'interfaccia (Dark Synthwave, Retro GameBoy Green, Classic Emerald).
