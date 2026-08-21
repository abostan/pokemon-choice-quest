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

### Versione 5.0 — Pokédex Nazionale 721 Specie, Allenatori di Percorso & UI Polishing (attuale)

#### 📖 Pokédex Nazionale Completo (Gen 1-6)
- [x] Estensione del Pokédex a **tutti i 721 slot** delle prime 6 generazioni.
- [x] Visualizzazione delle specie non ancora scoperte con carte dedicate (`? Ignoto`, `#025 — ???`).
- [x] Nuovi filtri rapidi nella barra Pokédex (`Tutti`, `Scoperti`, `Catturati`, `Ignoti`).
- [x] Barra di ricerca dinamica per `#ID` numerico con auto-padding (es. `25` o `025`).
- [x] Statistiche numeriche in tempo reale su specie viste e catturate su 721.

#### ⚔️ Allenatori di Percorso & Nuove Opzioni di Bivio
- [x] Nuova scelta narrativa `Sfida un Allenatore` nei bivi tra una palestra e l'altra.
- [x] Sfida rapida per accumulare XP della squadra e strumenti bonus (es. `Super Pozione`).
- [x] Nuova azione `Cercatore di Strumenti` per raccogliere pozioni, bacche e pietre evolutive nel percorso.

#### 🏅 Medaglie Grafiche & Card Avatar Avversario
- [x] Rendering delle medaglie nel `TeamPanel` con chip grafici (`BadgeItem`) e icone tematiche dedicate per ogni tipo di palestra (🪨, 💧, ⚡, 🌿, ☠️, 🔮, 🔥, 🏔️, 🦅, 🥛, 🥊, 🗡️, ❄️, 🐉, 🧚, 👑).
- [x] Card Avatar dell'Avversario (`BattleScene`) con icona rappresentativa, titolo ufficiale e indicatore di potenza della squadra nemica.

#### ⚖️ Scaling della Difficoltà & Cap Livello 100
- [x] Algoritmo `getScaledPower` per la progressione dinamica della difficoltà della squadra avversaria nelle run multi-generazione successive.
- [x] Cap massimo di livello fissato a 100 (`clampLevel` & `MAX_LEVEL = 100`) per prevenire overflow nei conteggi di potenza.

---

## 🔮 Prossimi Sviluppi & Idee Future (v6.0)

- [ ] **Altre Generazioni**: Alola (Gen 7), Galar (Gen 8), Paldea (Gen 9).
- [ ] **Sistema di Mosse e Tipi Reali**: efficacia dei tipi (Super Efficace / Non Molto Efficace) durante le battaglie.
- [ ] **Eventi Narrativi Speciali**: sfide storia con i team nemici (Team Rocket / Team Plasma / Team Flare / Team Galactic).
- [ ] **Effetti Sonori Web Audio API**: piccoli effetti audio rétro 8-bit per cattura, vittoria ed evoluzione.
- [ ] **Modalità Sfida / Nuzlocke**: regole speciali con permadeath dei Pokémon esausti.



