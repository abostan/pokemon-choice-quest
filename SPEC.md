# Pokémon: Scegli il Cammino — Spec v5.5

Documento di lavoro e specifica tecnica delle funzionalità del progetto.

**Stato:** ✅ Tutte le specifiche (Gen 1-9, 1025 Pokedex, Rogue-Lite Bivi, Item Tooltips, Multi-Save, Shiny, Oggetti, Visual Badges) sono state interamente implementate e verificate.

---

## 0. Punto di partenza (v1, già consegnata)

Starter unico (Gen 1), un bivio iniziale, un incontro, una palestra, un secondo bivio, una battaglia col Rivale, schermata finale. Squadra/medaglie/zaino sempre visibili a lato. Sprite e dati da PokeAPI. Nessun salvataggio.

---

## 1. Selezione della generazione

**Cosa cambia:** prima di scegliere lo starter, il giocatore sceglie la generazione. Tutto il resto della run (starter disponibili, Pokémon selvatici, capipalestra, Lega) pesca solo da quella generazione.

**Decisione presa:** per questa iterazione implementiamo **due generazioni giocabili**, Kanto (Gen 1) e Johto (Gen 2). Le altre restano per una versione futura.

**Cosa serve costruire:**
- Una nuova schermata "scegli generazione" prima dello starter, con le due opzioni.
- Una struttura dati unica (`data/generations.js`) che raggruppa per generazione: starter disponibili, pool di incontri selvatici (erba, pesca, grotta, erba avanzata), capipalestra, Lega, Rivale.
- Gen 1 riusa i dati già presenti in v1. Gen 2 va scritta da zero (starter Chikorita/Cyndaquil/Totodile, pool ed avversari coerenti con Johto).

**Aperto/da confermare:** i nomi di capipalestra/Lega restano generici ("Capopalestra di tipo X") come in v1, non usiamo nomi di personaggi ufficiali — coerente con la scelta già fatta per Kanto.

---

## 2. Più capipalestra e Lega vera (non solo una palestra)

**Decisione presa:** versione fedele ai giochi, non la versione compatta. Ogni generazione ha **8 palestre** in sequenza, poi l'**Alto Comando (4 membri)** in fila, poi il **Campione** come battaglia conclusiva. Titoli generici per tipo (non nomi ufficiali dei personaggi), ma ruoli/tipi e ordine fedeli ai giochi originali.

**Squadre previste (per tipo, National Dex id — potremo affinare i livelli in fase di bilanciamento):**

*Kanto:*
1. Roccia — Geodude, Onix
2. Acqua — Staryu, Starmie
3. Elettrico — Voltorb, Pikachu, Raichu
4. Erba — Victreebel, Tangela, Vileplume
5. Veleno — Koffing, Muk, Weezing
6. Psico — Kadabra, Mr. Mime, Alakazam
7. Fuoco — Growlithe, Ponyta, Arcanine
8. Terra — Rhyhorn, Dugtrio, Nidoqueen, Nidoking

Alto Comando: Ghiaccio (Dewgong, Cloyster, Slowbro, Jynx, Lapras) → Lotta (Onix, Hitmonchan, Hitmonlee, Machamp) → Spettro/Veleno (Gengar, Golbat, Haunter, Arbok) → Drago (Gyarados, Dragonair, Aerodactyl, Dragonite).

Campione: squadra mista forte (Pidgeot, Alakazam, Rhydon, Gyarados, Exeggutor) — nei giochi originali è il Rivale diventato Campione, quindi lo presentiamo con lo stesso filo narrativo del Rivale che incontri durante l'avventura, anche se i dati restano un'entità separata (più forte) per semplicità.

*Johto:*
1. Volante — Pidgey, Pidgeotto
2. Coleottero — Metapod, Kakuna, Scyther
3. Normale — Clefairy, Miltank
4. Spettro — Gastly, Haunter, Gengar
5. Lotta — Primeape, Poliwrath
6. Acciaio — Magnemite, Steelix
7. Ghiaccio — Seel, Dewgong, Piloswine
8. Drago — Dragonair, Kingdra

Alto Comando: Psico (Xatu, Jynx, Exeggutor, Slowbro) → Veleno (Ariados, Forretress, Muk, Crobat) → Lotta (Hitmontop, Hitmonchan, Hitmonlee, Machamp) → Buio (Umbreon, Vileplume, Gengar, Houndoom).

Campione: Drago (Gyarados, Dragonite, Dragonite, Charizard, Aerodactyl) — qui il Campione è un ruolo a sé, non il Rivale (fedele a Johto, dove il tuo rivale non è il Campione).

**Cosa serve costruire:**
- `data/generations.js` con array `gymLeaders` (8 elementi), `eliteFour` (4 elementi), `champion` per ciascuna generazione, oltre a `rival` (incontro a metà avventura, non in fondo).
- Un flusso di gioco generico "gauntlet" (palestra 1 → bivio → palestra 2 → bivio → ... → palestra 8 → Alto Comando membro 1 → 2 → 3 → 4 → Campione), invece di stage scritti a mano uno per uno: la stessa struttura dati alimenta N palestre senza dover copiare/incollare codice per ognuna.
- Bivi di esplorazione tra una palestra e l'altra: per restare gestibili, useremo 3 "livelli" di pool (Pokémon più forti mano a mano che si avanza) riusati lungo le 8 palestre, invece di scrivere zone uniche per ognuna delle 8 tappe — così la fedeltà è sulle palestre/Lega (il cuore della richiesta), mentre le zone di esplorazione restano semplici e scalabili in difficoltà.

**Bilanciamento:** con 8 palestre + Alto Comando + Campione il gioco è molto più lungo che nella v1: darò più occasioni di catturare/allenare lungo il percorso e scalerò gradualmente la potenza degli avversari, ma alcuni numeri andranno probabilmente aggiustati dopo le prime prove — è normale, lo sistemiamo insieme dopo aver provato.

---

## 3. Fine del gioco: proseguire nella generazione successiva, poi infinito

**Decisione aggiornata in chat** (sostituisce l'idea iniziale di sola esplorazione libera): dopo aver battuto la Lega di una generazione, **non c'è game over**. Si passa alla generazione successiva: si sceglie un nuovo starter di quella generazione, ma **la squadra/box attuale resta**, i Pokémon già catturati non si perdono. Si riparte quindi con un bivio iniziale ambientato nella nuova generazione, e così via.

**Cosa succede quando le generazioni finite (per ora solo Kanto e Johto):** una volta battuta anche la Lega dell'ultima generazione disponibile, il gioco entra nella modalità **esplorazione libera infinita** già discussa: bivi di esplorazione/cattura/allenamento senza più boss fissi, usando i pool dell'ultima generazione raggiunta. Così le due idee emerse in chat si combinano: prima si incatenano le generazioni implementate (con progressione reale: nuovo starter, box che cresce), poi — finiti i contenuti — il gioco non si blocca comunque mai.

**Cosa serve costruire:**
- Un nuovo stage `nextGeneration` dopo la vittoria in Lega: se esiste una generazione successiva nella lista, propone la scelta del nuovo starter (schermata simile a quella iniziale) mantenendo intatti team/box/Pokédex; se non esiste, passa allo stage `postgame` (esplorazione libera, pool dell'ultima generazione).
- Il "Rivale" e i capipalestra della nuova generazione sono quelli definiti in `data/generations.js` per quella generazione (vedi punto 1).

**Aperto/da confermare:** la squadra attiva (i Pokémon "in campo", non nel box) resta quella con cui hai finito la generazione precedente, oppure si "svuota" nel box e riparti solo con il nuovo starter più libertà di richiamare gli altri dal box quando vuoi? Per la prima versione la proposta è: tutto resta in squadra se hai posto per meno di 6, altrimenti extra nel box — nessuna gestione box avanzata (cambio squadra manuale) per ora, la aggiungiamo se poi la vuoi.

**Idea per dopo (non richiesta ora, solo annotata):** una piccola probabilità di incontro raro/leggendario nella fase di esplorazione libera finale, per dare un obiettivo a lungo termine oltre al semplice completamento del Pokédex.

---

## 4. Pokédex

**Decisione presa:** un pulsante sempre visibile che apre il Pokédex, con due viste:
- **Pokédex della run**: specie incontrate/catturate nella partita in corso. Si azzera quando si inizia una nuova run.
- **Pokédex storico**: specie catturate in *tutte* le run giocate su questo browser, mai azzerato.

**Nota tecnica importante:** senza un account/backend (non richiesto per questa iterazione), lo storico può essere salvato solo con `localStorage` **nel browser del dispositivo usato**. Significa che: resta lì anche chiudendo e riaprendo il browser sullo stesso computer, ma non si sincronizza automaticamente se giochi da un altro dispositivo o browser. Se in futuro vorrai lo storico condiviso tra dispositivi, servirà un account (fuori scope per ora, ne avevamo già parlato all'inizio).

**Cosa serve costruire:**
- Un modale/pannello Pokédex con lista specie, sprite, nome, tipi; toggle tra le due viste.
- Salvataggio/lettura dello storico da `localStorage` ad ogni cattura.

**Aperto/da confermare:** nessun punto bloccante; unica cosa da tenere a mente è il limite di `localStorage` descritto sopra.

---

## Ordine di implementazione proposto

1. Struttura dati multi-generazione + schermata di scelta generazione (base per tutto il resto).
2. Estensione a più palestre + Lega finale (usando la struttura del punto 1).
3. Post-game infinito.
4. Pokédex (run + storico con `localStorage`).

Procediamo un blocco alla volta, con verifica giocabile dopo ognuno, invece che un'unica modifica enorme.

## Decisioni confermate

1. Palestre e Lega: versione completa e fedele (8 palestre + Alto Comando a 4 + Campione), non la versione compatta — vedi punto 2.
2. Cambio generazione: squadra/box attuale resta intatta (extra oltre 6 nel box).

Nessuna domanda bloccante rimasta: si parte con l'implementazione, in ordine, verificando che sia giocabile dopo ogni blocco.
