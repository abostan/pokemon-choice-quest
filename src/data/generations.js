// Dati per generazione: starter, zone di esplorazione (a "livelli" di difficoltà
// crescente), le 8 palestre, l'Alto Comando, il Campione e il Rivale.
//
// Nessun nome ufficiale di personaggio: solo ruoli/tipi, per restare un
// progetto originale. L'ordine e i tipi delle palestre seguono comunque
// fedelmente quelli dei giochi, come richiesto.
//
// Aggiungere una nuova generazione = aggiungere un nuovo oggetto a questo
// array: il resto del gioco (App.js) è scritto per scalare automaticamente
// con qualunque numero di generazioni.

export const GENERATIONS = [
  {
    id: "kanto",
    name: "Kanto",
    starterIds: [1, 4, 7], // Bulbasaur, Charmander, Squirtle

    // Tre "livelli" di zone, riusati durante le 8 palestre (le prime tre
    // palestre usano il tier 0, la 4-6 il tier 1, la 7-8 il tier 2).
    explorationTiers: [
      {
        level: 6,
        grass: [16, 19, 10, 13],
        fishing: [129, 60, 118],
        cave: [41, 74, 90],
        grass2: [43, 69, 32],
      },
      {
        level: 16,
        grass: [21, 27, 63],
        fishing: [118, 120, 79],
        cave: [42, 95, 75],
        grass2: [46, 48, 102],
      },
      {
        level: 28,
        grass: [123, 127, 105],
        fishing: [130, 121, 116],
        cave: [105, 111, 76],
        grass2: [70, 71, 114],
      },
    ],

    items: {
      cave: ["Super Pozione", "Pietra Lunare", "Antidoto"],
      grass: ["Pozione", "Pallina Esca", "Foglia Strana"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Roccia", teamIds: [74, 95], opponentPower: 14 },
      { title: "Capopalestra di tipo Acqua", badge: "Medaglia Corrente", teamIds: [120, 121], opponentPower: 20 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Voltaggio", teamIds: [100, 25, 26], opponentPower: 27 },
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Foglia", teamIds: [71, 114, 45], opponentPower: 35 },
      { title: "Capopalestra di tipo Veleno", badge: "Medaglia Tossica", teamIds: [109, 89, 110], opponentPower: 44 },
      { title: "Capopalestra di tipo Psico", badge: "Medaglia Arcana", teamIds: [64, 122, 65], opponentPower: 54 },
      { title: "Capopalestra di tipo Fuoco", badge: "Medaglia Brace", teamIds: [58, 77, 59], opponentPower: 65 },
      { title: "Capopalestra di tipo Terra", badge: "Medaglia Faglia", teamIds: [111, 51, 31, 34], opponentPower: 77 },
    ],

    eliteFour: [
      { title: "Alto Comando — Ghiaccio", teamIds: [87, 91, 80, 124, 131], opponentPower: 88 },
      { title: "Alto Comando — Lotta", teamIds: [95, 107, 106, 68], opponentPower: 96 },
      { title: "Alto Comando — Spettro", teamIds: [94, 42, 93, 24], opponentPower: 104 },
      { title: "Alto Comando — Drago", teamIds: [130, 148, 142, 149], opponentPower: 112 },
    ],

    champion: {
      title: "Campione della Lega (il tuo Rivale, cresciuto)",
      badge: "Titolo di Campione di Kanto",
      teamIds: [18, 65, 112, 130, 103],
      opponentPower: 125,
    },

    // Battaglia speciale a metà avventura, non legata a nessuna palestra.
    rival: {
      title: "Il tuo Rivale",
      teamIds: [16, 129, 74],
      opponentPower: 26,
      afterGymIndex: 2, // compare dopo la 3a palestra (indice 0-based 2)
    },

    // Leggendari catturabili nella modalità post-game infinita (5% prob. per round)
    legendaries: [144, 145, 146, 150], // Articuno, Zapdos, Moltres, Mewtwo
  },

  {
    id: "johto",
    name: "Johto",
    starterIds: [152, 155, 158], // Chikorita, Cyndaquil, Totodile

    explorationTiers: [
      {
        level: 6,
        grass: [161, 163, 165, 167],
        fishing: [129, 183, 118],
        cave: [41, 74, 206],
        grass2: [187, 190, 193],
      },
      {
        level: 16,
        grass: [179, 204, 215],
        fishing: [170, 223, 116],
        cave: [207, 213, 246],
        grass2: [194, 231, 209],
      },
      {
        level: 28,
        grass: [198, 215, 235],
        fishing: [117, 171, 224],
        cave: [228, 247, 208],
        grass2: [203, 192, 189],
      },
    ],

    items: {
      cave: ["Super Pozione", "Pietra Metallica", "Antidoto"],
      grass: ["Pozione", "Foglia Strana", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Volante", badge: "Medaglia Ala", teamIds: [16, 17], opponentPower: 14 },
      { title: "Capopalestra di tipo Coleottero", badge: "Medaglia Zanna", teamIds: [11, 14, 123], opponentPower: 20 },
      { title: "Capopalestra di tipo Normale", badge: "Medaglia Latte", teamIds: [35, 241], opponentPower: 27 },
      { title: "Capopalestra di tipo Spettro", badge: "Medaglia Ombra", teamIds: [92, 93, 94], opponentPower: 35 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Pugno", teamIds: [57, 62], opponentPower: 44 },
      { title: "Capopalestra di tipo Acciaio", badge: "Medaglia Lama", teamIds: [81, 208], opponentPower: 54 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Gelo", teamIds: [86, 87, 221], opponentPower: 65 },
      { title: "Capopalestra di tipo Drago", badge: "Medaglia Squama", teamIds: [148, 230], opponentPower: 77 },
    ],

    eliteFour: [
      { title: "Alto Comando — Psico", teamIds: [178, 124, 103, 80], opponentPower: 88 },
      { title: "Alto Comando — Veleno", teamIds: [168, 205, 89, 169], opponentPower: 96 },
      { title: "Alto Comando — Lotta", teamIds: [237, 107, 106, 68], opponentPower: 104 },
      { title: "Alto Comando — Buio", teamIds: [197, 45, 94, 229], opponentPower: 112 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Johto",
      teamIds: [130, 149, 149, 6, 142],
      opponentPower: 125,
    },

    rival: {
      title: "Il tuo Rivale",
      teamIds: [163, 168, 41],
      opponentPower: 26,
      afterGymIndex: 2,
    },

    // Leggendari catturabili nella modalità post-game infinita (5% prob. per round)
    legendaries: [243, 244, 245, 249, 250], // Raikou, Entei, Suicune, Lugia, Ho-Oh
  },
];

export function getGeneration(id) {
  return GENERATIONS.find((g) => g.id === id) ?? null;
}

export function getExplorationTier(generation, gymIndex) {
  const tierIndex = Math.min(Math.floor(gymIndex / 3), generation.explorationTiers.length - 1);
  return generation.explorationTiers[tierIndex];
}

export function getNextGeneration(currentId) {
  const idx = GENERATIONS.findIndex((g) => g.id === currentId);
  if (idx === -1 || idx + 1 >= GENERATIONS.length) return null;
  return GENERATIONS[idx + 1];
}
