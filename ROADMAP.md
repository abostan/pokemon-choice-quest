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

### Versione 7.5 — Centro Pokémon & Mercatino PokéMart (attuale)

#### 🏥 Centro Pokémon & Mercatino PokéMart
- [x] Nuova tappa esplorativa `🏥 Centro Pokémon & Mercatino di Città` presente nelle tappe casuali tra le palestre.
- [x] **👩‍⚕️ Infermeria Joy**: Ripristina la salute della squadra con jingle audio retro Game Boy a 8-bit (`playHealJingle()`).
- [x] **💰 Sistema Pokédollari**: Moneta di gioco guadagnata vincendo sfide contro Capipalestra (+5), Boss dei Team nemici (+4) ed Allenatori (+2).
- [x] **🏪 Mercatino PokéMart**: Acquisto di Pozioni (1 💰), Super Pozioni (2 💰), Iper Pozioni (3 💰), Caramelle Rare (5 💰) e Master Ball (10 💰).
- [x] **🏷️ Display Pokédollari**: Indicatore del saldo Pokédollari integrato nel pannello laterale della squadra (`TeamPanel.js`).

### Versione 8.0 — Classifica Punteggio & Grado di Vittoria (attuale)

#### 🏆 Classifica Punteggio & Grado di Vittoria (Grado S / A / B / C)
- [x] Modulo `src/engine/scoreLogic.js` per il calcolo matematico del punteggio di vittoria e del grado d'onore.
- [x] **🏆 Grado S — Maestro Pokémon Supremo** (>= 25.000 pt)
- [x] **🥇 Grado A — Allenatore d'Élite** (15.000 - 24.999 pt)
- [x] **🥈 Grado B — Veterano della Lega** (8.000 - 14.999 pt)
- [x] **🥉 Grado C — Allenatore Promettente** (< 8.000 pt)
- [x] **📊 Componente `ScoreCardModal.js`**: Scheda d'onore celebrativa con trofeo visivo animato, riepilogo dettagliato punti (Medaglie, Livelli Squadra, Specie Pokédex, Bonus Shiny e Moltiplicatore Nuzlocke x1.5) e record personale salvato in `localStorage`.
- [x] **🔘 Pulsante Header (`📊 Punteggio`)**: Accesso rapido consultabile in qualsiasi momento nell'header della app.

---

## 🔮 Prossimi Sviluppi & Idee Future (v8.5)

- [ ] **🎨 Temi Visivi Personalizzabili**: Selettore di temi per l'interfaccia (Dark Synthwave, Retro GameBoy Green, Classic Emerald, Cyberpunk).
