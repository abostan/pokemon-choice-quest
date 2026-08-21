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

  {
    id: "hoenn",
    name: "Hoenn",
    starterIds: [252, 255, 258], // Treecko, Torchic, Mudkip

    explorationTiers: [
      {
        level: 6,
        grass: [261, 263, 265, 276],
        fishing: [129, 278, 339],
        cave: [293, 304, 290],
        grass2: [270, 273, 280],
      },
      {
        level: 16,
        grass: [285, 287, 296],
        fishing: [318, 341, 118],
        cave: [307, 309, 325],
        grass2: [300, 311, 312],
      },
      {
        level: 28,
        grass: [322, 328, 331],
        fishing: [320, 349, 130],
        cave: [353, 355, 371],
        grass2: [333, 343, 374],
      },
    ],

    items: {
      cave: ["Super Pozione", "Pietra Solare", "Antidoto"],
      grass: ["Pozione", "Biscotto Lavarone", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Pietra", teamIds: [304, 304], opponentPower: 14 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Pugno", teamIds: [296, 307], opponentPower: 20 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Dinamo", teamIds: [100, 309, 101, 310], opponentPower: 27 },
      { title: "Capopalestra di tipo Fuoco", badge: "Medaglia Fiamma", teamIds: [322, 218, 323], opponentPower: 35 },
      { title: "Capopalestra di tipo Normale", badge: "Medaglia Armonia", teamIds: [287, 288, 289], opponentPower: 44 },
      { title: "Capopalestra di tipo Volante", badge: "Medaglia Piuma", teamIds: [277, 279, 334], opponentPower: 54 },
      { title: "Capopalestra di tipo Psico", badge: "Medaglia Mente", teamIds: [344, 338], opponentPower: 65 },
      { title: "Capopalestra di tipo Acqua", badge: "Medaglia Pioggia", teamIds: [370, 340, 364, 350], opponentPower: 77 },
    ],

    eliteFour: [
      { title: "Alto Comando — Buio", teamIds: [262, 275, 332, 359, 229], opponentPower: 88 },
      { title: "Alto Comando — Spettro", teamIds: [354, 356, 354, 356, 302], opponentPower: 96 },
      { title: "Alto Comando — Ghiaccio", teamIds: [362, 364, 362, 364, 365], opponentPower: 104 },
      { title: "Alto Comando — Drago", teamIds: [330, 334, 330, 373, 230], opponentPower: 112 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Hoenn",
      teamIds: [227, 344, 306, 346, 348, 376],
      opponentPower: 125,
    },

    rival: {
      title: "Il tuo Rivale",
      teamIds: [263, 276, 255],
      opponentPower: 26,
      afterGymIndex: 2,
    },

    legendaries: [377, 378, 379, 380, 381, 382, 383, 384],
  },

  {
    id: "sinnoh",
    name: "Sinnoh",
    starterIds: [387, 390, 393], // Turtwig, Chimchar, Piplup

    explorationTiers: [
      {
        level: 6,
        grass: [396, 399, 401, 403],
        fishing: [129, 418, 118],
        cave: [41, 74, 436],
        grass2: [406, 412, 420],
      },
      {
        level: 16,
        grass: [415, 425, 427],
        fishing: [422, 456, 130],
        cave: [408, 410, 443],
        grass2: [431, 434, 449],
      },
      {
        level: 28,
        grass: [451, 453, 459],
        fishing: [457, 224, 117],
        cave: [437, 444, 461],
        grass2: [404, 419, 426],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Brillante", "Rimedio Finale"],
      grass: ["Pozione", "Miele", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Carbone", teamIds: [74, 408], opponentPower: 14 },
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Bosco", teamIds: [420, 315, 388], opponentPower: 20 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Ciottolo", teamIds: [307, 67, 448], opponentPower: 27 },
      { title: "Capopalestra di tipo Acqua", badge: "Medaglia Acstrino", teamIds: [418, 195, 423], opponentPower: 35 },
      { title: "Capopalestra di tipo Spettro", badge: "Medaglia Relitto", teamIds: [425, 93, 429], opponentPower: 44 },
      { title: "Capopalestra di tipo Acciaio", badge: "Medaglia Cava", teamIds: [81, 95, 411], opponentPower: 54 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Ghiacciolo", teamIds: [215, 460, 478], opponentPower: 65 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Faro", teamIds: [405, 424, 224, 466], opponentPower: 77 },
    ],

    eliteFour: [
      { title: "Alto Comando — Coleottero", teamIds: [269, 214, 416, 212, 452], opponentPower: 88 },
      { title: "Alto Comando — Terra", teamIds: [195, 185, 450, 112, 389], opponentPower: 96 },
      { title: "Alto Comando — Fuoco", teamIds: [78, 428, 135, 229, 392], opponentPower: 104 },
      { title: "Alto Comando — Psico", teamIds: [122, 178, 103, 437, 65], opponentPower: 112 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Sinnoh",
      teamIds: [442, 407, 423, 448, 460, 445],
      opponentPower: 125,
    },

    rival: {
      title: "Il tuo Rivale",
      teamIds: [397, 404, 391],
      opponentPower: 26,
      afterGymIndex: 2,
    },

    legendaries: [480, 481, 482, 483, 484, 485, 486, 487],
  },

  {
    id: "unova",
    name: "Unova",
    starterIds: [495, 498, 501], // Snivy, Tepig, Oshawott

    explorationTiers: [
      {
        level: 6,
        grass: [504, 506, 509, 519],
        fishing: [129, 550, 118],
        cave: [524, 527, 529],
        grass2: [511, 513, 515],
      },
      {
        level: 16,
        grass: [522, 540, 543],
        fishing: [592, 594, 550],
        cave: [532, 535, 551],
        grass2: [546, 548, 554],
      },
      {
        level: 28,
        grass: [559, 562, 570],
        fishing: [580, 593, 618],
        cave: [597, 607, 633],
        grass2: [572, 577, 582],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Idrica", "Revitalizzante"],
      grass: ["Pozione", "Dolceofelia", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Elementale", badge: "Medaglia Tris", teamIds: [506, 512], opponentPower: 14 },
      { title: "Capopalestra di tipo Normale", badge: "Medaglia Base", teamIds: [504, 505], opponentPower: 20 },
      { title: "Capopalestra di tipo Coleottero", badge: "Medaglia Maggiolino", teamIds: [544, 556, 542], opponentPower: 27 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Volt", teamIds: [587, 587, 523], opponentPower: 35 },
      { title: "Capopalestra di tipo Terra", badge: "Medaglia Sisma", teamIds: [552, 536, 530], opponentPower: 44 },
      { title: "Capopalestra di tipo Volante", badge: "Medaglia Jet", teamIds: [528, 561, 581], opponentPower: 54 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Glacia", teamIds: [583, 614, 615], opponentPower: 65 },
      { title: "Capopalestra di tipo Drago", badge: "Medaglia Leggenda", teamIds: [621, 611, 635], opponentPower: 77 },
    ],

    eliteFour: [
      { title: "Alto Comando — Spettro", teamIds: [563, 593, 623, 609], opponentPower: 88 },
      { title: "Alto Comando — Buio", teamIds: [510, 553, 625, 630], opponentPower: 96 },
      { title: "Alto Comando — Psico", teamIds: [518, 561, 576, 579], opponentPower: 104 },
      { title: "Alto Comando — Lotta", teamIds: [538, 539, 534, 620], opponentPower: 112 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Unova",
      teamIds: [635, 621, 612, 567, 604, 637],
      opponentPower: 125,
    },

    rival: {
      title: "Il tuo Rivale",
      teamIds: [507, 519, 499],
      opponentPower: 26,
      afterGymIndex: 2,
    },

    legendaries: [638, 639, 640, 641, 642, 643, 644, 645, 646],
  },

  {
    id: "kalos",
    name: "Kalos",
    starterIds: [650, 653, 656], // Chespin, Fennekin, Froakie

    explorationTiers: [
      {
        level: 6,
        grass: [659, 661, 664, 667],
        fishing: [129, 688, 118],
        cave: [677, 679, 682],
        grass2: [669, 672, 674],
      },
      {
        level: 16,
        grass: [670, 684, 686],
        fishing: [690, 692, 130],
        cave: [696, 698, 704],
        grass2: [701, 708, 710],
      },
      {
        level: 28,
        grass: [676, 680, 702],
        fishing: [691, 693, 370],
        cave: [705, 714, 712],
        grass2: [683, 685, 707],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Folletto", "Revitalizzante"],
      grass: ["Pozione", "Galletta di Yantar", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Coleottero", badge: "Medaglia Insetto", teamIds: [283, 665], opponentPower: 14 },
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Muro", teamIds: [696, 698], opponentPower: 20 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Scontro", teamIds: [301, 112, 448], opponentPower: 27 },
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Pianta", teamIds: [188, 673, 675], opponentPower: 35 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Volt", teamIds: [587, 695, 487], opponentPower: 44 },
      { title: "Capopalestra di tipo Folletto", badge: "Medaglia Fata", teamIds: [303, 122, 700], opponentPower: 54 },
      { title: "Capopalestra di tipo Psico", badge: "Medaglia Psiche", teamIds: [678, 678, 681], opponentPower: 65 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Iceberg", teamIds: [583, 713, 713], opponentPower: 77 },
    ],

    eliteFour: [
      { title: "Alto Comando — Fuoco", teamIds: [59, 323, 668, 637], opponentPower: 88 },
      { title: "Alto Comando — Acqua", teamIds: [321, 693, 121, 689], opponentPower: 96 },
      { title: "Alto Comando — Acciaio", teamIds: [227, 437, 681, 479], opponentPower: 104 },
      { title: "Alto Comando — Drago", teamIds: [334, 621, 697, 635], opponentPower: 112 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Kalos",
      teamIds: [701, 697, 699, 706, 282, 658],
      opponentPower: 125,
    },

    rival: {
      title: "Il tuo Rivale",
      teamIds: [662, 678, 654],
      opponentPower: 26,
      afterGymIndex: 2,
    },

    legendaries: [716, 717, 718],
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
