// Configurazione dei 5 Campioni leggendari per il Torneo dei Campioni della Lega (Post-game)

export const CHAMPIONS_TOURNAMENT = [
  {
    round: 1,
    id: "red",
    title: "🔴 Campione Rosso (Kanto)",
    text: "Nel silenzio del Monte Argento, l'allenatore leggendario di Kanto ti fissa pronto alla sfida.",
    teamIds: [25, 6, 9, 3], // Pikachu, Charizard, Blastoise, Venusaur
    opponentPower: 180,
    type: "Normale",
  },
  {
    round: 2,
    id: "steven",
    title: "🪨 Campione Rocco Petri (Hoenn)",
    text: "Esperto di minerali rari e Pokémon d'Acciaio, Rocco sferra tutta la potenza di Hoenn.",
    teamIds: [376, 227, 306, 348], // Metagross, Skarmory, Aggron, Armaldo
    opponentPower: 195,
    type: "Acciaio",
  },
  {
    round: 3,
    id: "cynthia",
    title: "🌸 Campionessa Camilla (Sinnoh)",
    text: "La mitica Campionessa di Sinnoh sfoggia una squadra formidabile ed unita.",
    teamIds: [445, 448, 350, 442], // Garchomp, Lucario, Milotic, Spiritomb
    opponentPower: 215,
    type: "Drago",
  },
  {
    round: 4,
    id: "leon",
    title: "🐉 Campione Imbattibile Dandel (Galar)",
    text: "Il Campione mai sconfitto di Galar entra nell'arena con il suo inconfondibile Charizard!",
    teamIds: [6, 887, 681, 612], // Charizard, Dragapult, Aegislash, Haxorus
    opponentPower: 235,
    type: "Fuoco",
  },
  {
    round: 5,
    id: "geeta",
    title: "👑 Prima Campionessa Alisma (Paldea)",
    text: "La sedia della presidenza della Lega di Paldea scende in campo per la Grand Finale!",
    teamIds: [969, 983, 956, 713], // Glimmora, Kingambit, Espathra, Avalugg
    opponentPower: 260,
    type: "Roccia",
  },
];
