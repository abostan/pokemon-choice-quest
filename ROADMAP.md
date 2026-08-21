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

## 🔮 Prossimi Sviluppi & TODO List (v4.0)

### 1. ✨ Sistema Pokémon Shiny
- [ ] Logica 1/500 di probabilità Shiny negli incontri selvatici.
- [ ] Salvataggio flag `isShiny: true` su team, box e Pokédex.
- [ ] Rendering dello sprite Shiny (`spriteShiny` da `usePokemon.js`).
- [ ] Badge stella / animazione di luccichio CSS nelle schede.

### 2. 🎒 Oggetti & Strumenti in Battaglia
- [ ] Utilizzo pozioni e strumenti dallo zaino prima della scelta della tattica in `BattleScene`.
- [ ] Effetto di cura o bonus temporaneo di potenza durante i boss.
- [ ] Consumo e gestione inventario dello zaino.

### 3. 🗺️ Generazioni 5 (Unova) & 6 (Kalos)
- [ ] Aggiunta di **Unova (Gen 5)** (Snivy, Tepig, Oshawott) a `generations.js`.
- [ ] Aggiunta di **Kalos (Gen 6)** (Chespin, Fennekin, Froakie) a `generations.js`.
- [ ] Mappatura evoluzioni Gen 5 & Gen 6 in `evolutions.js`.
- [ ] Aggiornamento simulatore `scripts/simulate-flow.mjs`.

### 4. 💾 Slot di Salvataggio Multipli & Backup
- [ ] Gestione fino a 3 slot di salvataggio in `saveGame.js`.
- [ ] Selettore slot nella `ResumeScreen` con info dettagliate per ciascuna partita.
- [ ] Esportazione / importazione del salvataggio in formato JSON per il backup.

