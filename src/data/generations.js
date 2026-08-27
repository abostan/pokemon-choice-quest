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
    regionalDex: "kanto", // slug PokeAPI /pokedex/{slug} per la numerazione regionale

    // Tre "livelli" di zone, riusati durante le 8 palestre (le prime tre
    // palestre usano il tier 0, la 4-6 il tier 1, la 7-8 il tier 2).
    explorationTiers: [
      {
        level: 6,
        grass: [16, 19, 10, 13, 21, 29, 39, 84],
        fishing: [129, 60, 118, 72, 98, 116, 79],
        cave: [41, 74, 90, 46, 88, 109, 96],
        grass2: [43, 69, 32, 35, 37, 56, 58],
      },
      {
        level: 16,
        grass: [21, 27, 63, 66, 84, 102, 96],
        fishing: [118, 120, 79, 60, 72, 98, 116],
        cave: [42, 95, 75, 41, 74, 88, 109],
        grass2: [46, 48, 102, 69, 114, 127, 133],
      },
      {
        level: 28,
        grass: [123, 127, 105, 21, 46, 63, 84],
        fishing: [130, 121, 116, 60, 72, 98, 118],
        cave: [105, 111, 76, 74, 95, 42, 41],
        grass2: [70, 71, 114, 43, 69, 102, 133],
      },
    ],

    items: {
      cave: ["Super Pozione", "Pietra Lunare", "Antidoto"],
      grass: ["Pozione", "Pallina Esca", "Foglia Strana"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Roccia", teamIds: [74, 95], opponentPower: 14 },
      { title: "Capopalestra di tipo Acqua", badge: "Medaglia Corrente", teamIds: [120, 121], opponentPower: 26 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Voltaggio", teamIds: [100, 25, 26], opponentPower: 35 },
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Foglia", teamIds: [71, 114, 45], opponentPower: 46 },
      { title: "Capopalestra di tipo Veleno", badge: "Medaglia Tossica", teamIds: [109, 89, 110], opponentPower: 58 },
      { title: "Capopalestra di tipo Psico", badge: "Medaglia Arcana", teamIds: [64, 122, 65], opponentPower: 72 },
      { title: "Capopalestra di tipo Fuoco", badge: "Medaglia Brace", teamIds: [58, 77, 59], opponentPower: 88 },
      { title: "Capopalestra di tipo Terra", badge: "Medaglia Faglia", teamIds: [111, 51, 31, 34], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Alto Comando — Ghiaccio", teamIds: [87, 91, 80, 124, 131], opponentPower: 120 },
      { title: "Alto Comando — Lotta", teamIds: [95, 107, 106, 68], opponentPower: 132 },
      { title: "Alto Comando — Spettro", teamIds: [94, 42, 93, 24], opponentPower: 144 },
      { title: "Alto Comando — Drago", teamIds: [130, 148, 142, 149], opponentPower: 156 },
    ],

    champion: {
      title: "Campione della Lega (il tuo Rivale, cresciuto)",
      badge: "Titolo di Campione di Kanto",
      teamIds: [18, 65, 112, 130, 103],
      opponentPower: 175,
    },

    // Il Rivale ricompare 3 volte lungo la regione (indici 0-based dopo le
    // palestre 1/5/7), con una squadra che cresce e si evolve ad ogni
    // incontro — mai sullo stesso afterGymIndex del villainBoss (fisso a 3).
    rival: [
      { title: "Il tuo Rivale", teamIds: [16, 129], opponentPower: 20, afterGymIndex: 0 },
      { title: "Il tuo Rivale", teamIds: [17, 130, 75, 25], opponentPower: 62, afterGymIndex: 4 },
      { title: "Il tuo Rivale", teamIds: [18, 130, 76, 26, 65, 59], opponentPower: 94, afterGymIndex: 6 },
    ],

    // Battaglia Boss Narrativa contro il Capo del Team malvagio dopo la 4a palestra
    villainBoss: {
      title: "Capo Team Rocket — Giovanni",
      teamIds: [53, 111, 34, 112],
      opponentPower: 52,
      rewardItem: "Master Ball",
      afterGymIndex: 3, // compare dopo la 4a palestra
    },

    // Leggendari catturabili nella modalità post-game infinita (5% prob. per round)
    legendaries: [144, 145, 146, 150], // Articuno, Zapdos, Moltres, Mewtwo
  },

  {
    id: "johto",
    name: "Johto",
    starterIds: [152, 155, 158], // Chikorita, Cyndaquil, Totodile
    regionalDex: "updated-johto",

    explorationTiers: [
      {
        level: 6,
        grass: [161, 163, 165, 167, 172, 191, 220, 216],
        fishing: [129, 183, 118, 194, 170, 72, 60],
        cave: [41, 74, 206, 88, 95, 46, 231],
        grass2: [187, 190, 193, 204, 209, 236, 191],
      },
      {
        level: 16,
        grass: [179, 204, 215, 216, 220, 231, 234],
        fishing: [170, 223, 116, 129, 183, 194, 72],
        cave: [207, 213, 246, 41, 74, 88, 95],
        grass2: [194, 231, 209, 187, 190, 204, 236],
      },
      {
        level: 28,
        grass: [198, 215, 235, 216, 217, 220, 221],
        fishing: [117, 171, 224, 130, 121, 116, 60],
        cave: [228, 247, 208, 211, 213, 207, 246],
        grass2: [203, 192, 189, 234, 231, 190, 187],
      },
    ],

    items: {
      cave: ["Super Pozione", "Pietra Metallica", "Antidoto"],
      grass: ["Pozione", "Foglia Strana", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Volante", badge: "Medaglia Ala", teamIds: [16, 17], opponentPower: 14 },
      { title: "Capopalestra di tipo Coleottero", badge: "Medaglia Zanna", teamIds: [11, 14, 123], opponentPower: 26 },
      { title: "Capopalestra di tipo Normale", badge: "Medaglia Latte", teamIds: [35, 241], opponentPower: 35 },
      { title: "Capopalestra di tipo Spettro", badge: "Medaglia Ombra", teamIds: [92, 93, 94], opponentPower: 46 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Pugno", teamIds: [57, 62], opponentPower: 58 },
      { title: "Capopalestra di tipo Acciaio", badge: "Medaglia Lama", teamIds: [81, 208], opponentPower: 72 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Gelo", teamIds: [86, 87, 221], opponentPower: 88 },
      { title: "Capopalestra di tipo Drago", badge: "Medaglia Squama", teamIds: [148, 230], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Alto Comando — Psico", teamIds: [178, 124, 103, 80], opponentPower: 120 },
      { title: "Alto Comando — Veleno", teamIds: [168, 205, 89, 169], opponentPower: 132 },
      { title: "Alto Comando — Lotta", teamIds: [237, 107, 106, 68], opponentPower: 144 },
      { title: "Alto Comando — Buio", teamIds: [197, 45, 94, 229], opponentPower: 156 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Johto",
      teamIds: [130, 149, 149, 6, 142],
      opponentPower: 175,
    },

    rival: [
      { title: "Il tuo Rivale", teamIds: [163, 168], opponentPower: 20, afterGymIndex: 0 },
      { title: "Il tuo Rivale", teamIds: [164, 168, 42, 180], opponentPower: 62, afterGymIndex: 4 },
      { title: "Il tuo Rivale", teamIds: [164, 168, 169, 181, 211, 229], opponentPower: 94, afterGymIndex: 6 },
    ],

    villainBoss: {
      title: "Capo Reclute Team Rocket — Archer",
      teamIds: [229, 110, 130],
      opponentPower: 52,
      rewardItem: "Caramella Rara",
      afterGymIndex: 3,
    },

    // Leggendari catturabili nella modalità post-game infinita (5% prob. per round)
    legendaries: [243, 244, 245, 249, 250], // Raikou, Entei, Suicune, Lugia, Ho-Oh
  },

  {
    id: "hoenn",
    name: "Hoenn",
    starterIds: [252, 255, 258], // Treecko, Torchic, Mudkip
    regionalDex: "updated-hoenn",

    explorationTiers: [
      {
        level: 6,
        grass: [261, 263, 265, 276, 285, 283, 300, 273],
        fishing: [129, 278, 339, 349, 317, 370, 72],
        cave: [293, 304, 290, 74, 41, 307, 325],
        grass2: [270, 273, 280, 285, 283, 300, 311],
      },
      {
        level: 16,
        grass: [285, 287, 296, 261, 263, 276, 300],
        fishing: [318, 341, 118, 339, 349, 72, 370],
        cave: [307, 309, 325, 290, 293, 304, 74],
        grass2: [300, 311, 312, 313, 314, 315, 273],
      },
      {
        level: 28,
        grass: [322, 328, 331, 335, 336, 357, 359],
        fishing: [320, 349, 130, 366, 368, 369, 317],
        cave: [353, 355, 371, 372, 345, 344, 302],
        grass2: [333, 343, 374, 334, 375, 376, 359],
      },
    ],

    items: {
      cave: ["Super Pozione", "Pietra Solare", "Antidoto"],
      grass: ["Pozione", "Biscotto Lavarone", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Pietra", teamIds: [304, 304], opponentPower: 14 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Pugno", teamIds: [296, 307], opponentPower: 26 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Dinamo", teamIds: [100, 309, 101, 310], opponentPower: 35 },
      { title: "Capopalestra di tipo Fuoco", badge: "Medaglia Fiamma", teamIds: [322, 218, 323], opponentPower: 46 },
      { title: "Capopalestra di tipo Normale", badge: "Medaglia Armonia", teamIds: [287, 288, 289], opponentPower: 58 },
      { title: "Capopalestra di tipo Volante", badge: "Medaglia Piuma", teamIds: [277, 279, 334], opponentPower: 72 },
      { title: "Capopalestra di tipo Psico", badge: "Medaglia Mente", teamIds: [344, 338], opponentPower: 88 },
      { title: "Capopalestra di tipo Acqua", badge: "Medaglia Pioggia", teamIds: [370, 340, 364, 350], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Alto Comando — Buio", teamIds: [262, 275, 332, 359, 229], opponentPower: 120 },
      { title: "Alto Comando — Spettro", teamIds: [354, 356, 354, 356, 302], opponentPower: 132 },
      { title: "Alto Comando — Ghiaccio", teamIds: [362, 364, 362, 364, 365], opponentPower: 144 },
      { title: "Alto Comando — Drago", teamIds: [330, 334, 330, 373, 230], opponentPower: 156 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Hoenn",
      teamIds: [227, 344, 306, 346, 348, 376],
      opponentPower: 175,
    },

    rival: [
      { title: "Il tuo Rivale", teamIds: [263, 276], opponentPower: 20, afterGymIndex: 0 },
      { title: "Il tuo Rivale", teamIds: [264, 277, 256, 304], opponentPower: 62, afterGymIndex: 4 },
      { title: "Il tuo Rivale", teamIds: [264, 277, 257, 306, 335, 359], opponentPower: 94, afterGymIndex: 6 },
    ],

    villainBoss: {
      title: "Capo Team Magma/Aqua — Max & Archie",
      teamIds: [323, 319, 229],
      opponentPower: 52,
      rewardItem: "Master Ball",
      afterGymIndex: 3,
    },

    legendaries: [377, 378, 379, 380, 381, 382, 383, 384],
  },

  {
    id: "sinnoh",
    name: "Sinnoh",
    starterIds: [387, 390, 393], // Turtwig, Chimchar, Piplup
    regionalDex: "extended-sinnoh",

    explorationTiers: [
      {
        level: 6,
        grass: [396, 399, 401, 403, 441, 417, 438, 439],
        fishing: [129, 418, 118, 422, 456, 72, 60],
        cave: [41, 74, 436, 408, 410, 88, 46],
        grass2: [406, 412, 420, 421, 427, 417, 439],
      },
      {
        level: 16,
        grass: [415, 425, 427, 396, 399, 401, 417],
        fishing: [422, 456, 130, 418, 457, 72, 60],
        cave: [408, 410, 443, 41, 74, 436, 449],
        grass2: [431, 434, 449, 424, 428, 412, 420],
      },
      {
        level: 28,
        grass: [451, 453, 459, 443, 447, 461, 472],
        fishing: [457, 224, 117, 458, 456, 418, 130],
        cave: [437, 444, 461, 445, 450, 452, 472],
        grass2: [404, 419, 426, 405, 417, 424, 431],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Brillante", "Rimedio Finale"],
      grass: ["Pozione", "Miele", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Carbone", teamIds: [74, 408], opponentPower: 14 },
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Bosco", teamIds: [420, 315, 388], opponentPower: 26 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Ciottolo", teamIds: [307, 67, 448], opponentPower: 35 },
      { title: "Capopalestra di tipo Acqua", badge: "Medaglia Acstrino", teamIds: [418, 195, 423], opponentPower: 46 },
      { title: "Capopalestra di tipo Spettro", badge: "Medaglia Relitto", teamIds: [425, 93, 429], opponentPower: 58 },
      { title: "Capopalestra di tipo Acciaio", badge: "Medaglia Cava", teamIds: [81, 95, 411], opponentPower: 72 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Ghiacciolo", teamIds: [215, 460, 478], opponentPower: 88 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Faro", teamIds: [405, 424, 224, 466], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Alto Comando — Coleottero", teamIds: [269, 214, 416, 212, 452], opponentPower: 120 },
      { title: "Alto Comando — Terra", teamIds: [195, 185, 450, 112, 389], opponentPower: 132 },
      { title: "Alto Comando — Fuoco", teamIds: [78, 428, 135, 229, 392], opponentPower: 144 },
      { title: "Alto Comando — Psico", teamIds: [122, 178, 103, 437, 65], opponentPower: 156 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Sinnoh",
      teamIds: [442, 407, 423, 448, 460, 445],
      opponentPower: 175,
    },

    rival: [
      { title: "Il tuo Rivale", teamIds: [396, 403], opponentPower: 20, afterGymIndex: 0 },
      { title: "Il tuo Rivale", teamIds: [397, 404, 391, 453], opponentPower: 62, afterGymIndex: 4 },
      { title: "Il tuo Rivale", teamIds: [398, 405, 392, 454, 428, 466], opponentPower: 94, afterGymIndex: 6 },
    ],

    villainBoss: {
      title: "Capo Team Galassia — Cyrus",
      teamIds: [198, 215, 130, 461],
      opponentPower: 52,
      rewardItem: "Master Ball",
      afterGymIndex: 3,
    },

    legendaries: [480, 481, 482, 483, 484, 485, 486, 487],
  },

  {
    id: "unova",
    name: "Unova",
    starterIds: [495, 498, 501], // Snivy, Tepig, Oshawott
    regionalDex: "updated-unova",

    explorationTiers: [
      {
        level: 6,
        grass: [504, 506, 509, 519, 517, 540, 543, 522],
        fishing: [129, 550, 118, 535, 592, 60, 72],
        cave: [524, 527, 529, 41, 74, 532, 551],
        grass2: [511, 513, 515, 546, 548, 540, 543],
      },
      {
        level: 16,
        grass: [522, 540, 543, 504, 506, 519, 546],
        fishing: [592, 594, 550, 535, 580, 72, 60],
        cave: [532, 535, 551, 524, 527, 529, 557],
        grass2: [546, 548, 554, 570, 572, 511, 513],
      },
      {
        level: 28,
        grass: [559, 562, 570, 551, 553, 571, 610],
        fishing: [580, 593, 618, 594, 592, 130, 60],
        cave: [597, 607, 633, 610, 621, 624, 632],
        grass2: [572, 577, 582, 574, 585, 548, 546],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Idrica", "Revitalizzante"],
      grass: ["Pozione", "Dolceofelia", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Tris", teamIds: [506, 512], opponentPower: 14 },
      { title: "Capopalestra di tipo Normale", badge: "Medaglia Base", teamIds: [504, 505], opponentPower: 26 },
      { title: "Capopalestra di tipo Coleottero", badge: "Medaglia Maggiolino", teamIds: [544, 556, 542], opponentPower: 35 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Volt", teamIds: [587, 587, 523], opponentPower: 46 },
      { title: "Capopalestra di tipo Terra", badge: "Medaglia Sisma", teamIds: [552, 536, 530], opponentPower: 58 },
      { title: "Capopalestra di tipo Volante", badge: "Medaglia Jet", teamIds: [528, 561, 581], opponentPower: 72 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Glacia", teamIds: [583, 614, 615], opponentPower: 88 },
      { title: "Capopalestra di tipo Drago", badge: "Medaglia Leggenda", teamIds: [621, 611, 635], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Alto Comando — Spettro", teamIds: [563, 593, 623, 609], opponentPower: 120 },
      { title: "Alto Comando — Buio", teamIds: [510, 553, 625, 630], opponentPower: 132 },
      { title: "Alto Comando — Psico", teamIds: [518, 561, 576, 579], opponentPower: 144 },
      { title: "Alto Comando — Lotta", teamIds: [538, 539, 534, 620], opponentPower: 156 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Unova",
      teamIds: [635, 621, 612, 567, 604, 637],
      opponentPower: 175,
    },

    rival: [
      { title: "Il tuo Rivale", teamIds: [506, 519], opponentPower: 20, afterGymIndex: 0 },
      { title: "Il tuo Rivale", teamIds: [507, 520, 499, 543], opponentPower: 62, afterGymIndex: 4 },
      { title: "Il tuo Rivale", teamIds: [508, 521, 500, 545, 553, 561], opponentPower: 94, afterGymIndex: 6 },
    ],

    villainBoss: {
      title: "Capo Team Plasma — Ghetsis",
      teamIds: [635, 563, 625, 604],
      opponentPower: 52,
      rewardItem: "Caramella Rara",
      afterGymIndex: 3,
    },

    legendaries: [638, 639, 640, 641, 642, 643, 644, 645, 646],
  },

  {
    id: "kalos",
    name: "Kalos",
    starterIds: [650, 653, 656], // Chespin, Fennekin, Froakie
    // Kalos è l'unica regione senza un Pokédex regionale unificato su PokeAPI:
    // nei giochi reali è diviso in 3 sotto-Pokédex (Centro/Costa/Montagna) — qui
    // controlliamo tutti e 3 in ordine e usiamo il primo che contiene la specie.
    regionalDex: ["kalos-central", "kalos-coastal", "kalos-mountain"],

    explorationTiers: [
      {
        level: 6,
        grass: [659, 661, 664, 667, 669, 672, 674, 686],
        fishing: [129, 688, 118, 690, 692, 60, 72],
        cave: [677, 679, 682, 41, 74, 696, 698],
        grass2: [669, 672, 674, 664, 667, 684, 685],
      },
      {
        level: 16,
        grass: [670, 684, 686, 659, 661, 672, 701],
        fishing: [690, 692, 130, 688, 691, 72, 60],
        cave: [696, 698, 704, 677, 679, 682, 705],
        grass2: [701, 708, 710, 669, 672, 684, 685],
      },
      {
        level: 28,
        grass: [676, 680, 702, 686, 701, 668, 673],
        fishing: [691, 693, 370, 688, 690, 130, 60],
        cave: [705, 714, 712, 696, 706, 713, 679],
        grass2: [683, 685, 707, 684, 672, 669, 701],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Folletto", "Revitalizzante"],
      grass: ["Pozione", "Galletta di Yantar", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Coleottero", badge: "Medaglia Insetto", teamIds: [283, 665], opponentPower: 14 },
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Muro", teamIds: [696, 698], opponentPower: 26 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Scontro", teamIds: [301, 112, 448], opponentPower: 35 },
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Pianta", teamIds: [188, 673, 675], opponentPower: 46 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Volt", teamIds: [587, 695, 487], opponentPower: 58 },
      { title: "Capopalestra di tipo Folletto", badge: "Medaglia Fata", teamIds: [303, 122, 700], opponentPower: 72 },
      { title: "Capopalestra di tipo Psico", badge: "Medaglia Psiche", teamIds: [678, 678, 681], opponentPower: 88 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Iceberg", teamIds: [583, 713, 713], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Alto Comando — Fuoco", teamIds: [59, 323, 668, 637], opponentPower: 120 },
      { title: "Alto Comando — Acqua", teamIds: [321, 693, 121, 689], opponentPower: 132 },
      { title: "Alto Comando — Acciaio", teamIds: [227, 437, 681, 479], opponentPower: 144 },
      { title: "Alto Comando — Drago", teamIds: [334, 621, 697, 635], opponentPower: 156 },
    ],

    champion: {
      title: "Campione della Lega",
      badge: "Titolo di Campione di Kalos",
      teamIds: [701, 697, 699, 706, 282, 658],
      opponentPower: 175,
    },

    rival: [
      { title: "Il tuo Rivale", teamIds: [661, 677], opponentPower: 20, afterGymIndex: 0 },
      { title: "Il tuo Rivale", teamIds: [662, 678, 654, 686], opponentPower: 62, afterGymIndex: 4 },
      { title: "Il tuo Rivale", teamIds: [663, 678, 655, 687, 700, 701], opponentPower: 94, afterGymIndex: 6 },
    ],

    villainBoss: {
      title: "Capo Team Flare — Lysandre",
      teamIds: [668, 198, 479, 635],
      opponentPower: 52,
      rewardItem: "Master Ball",
      afterGymIndex: 3,
    },

    legendaries: [716, 717, 718],
  },

  {
    id: "alola",
    name: "Alola",
    starterIds: [722, 725, 728], // Rowlet, Litten, Popplio
    regionalDex: "updated-alola",

    explorationTiers: [
      {
        level: 6,
        grass: [734, 731, 736, 10, 753, 755, 741, 742],
        fishing: [129, 746, 751, 72, 60, 747, 771],
        cave: [744, 749, 757, 41, 74, 739, 767],
        grass2: [753, 755, 759, 761, 764, 741, 742],
      },
      {
        level: 16,
        grass: [761, 764, 766, 731, 734, 741, 753],
        fishing: [771, 779, 130, 746, 747, 72, 60],
        cave: [774, 775, 776, 744, 749, 739, 767],
        grass2: [777, 778, 782, 759, 761, 764, 741],
      },
      {
        level: 28,
        grass: [780, 781, 784, 782, 783, 745, 760],
        fishing: [746, 752, 771, 747, 748, 130, 60],
        cave: [776, 780, 784, 774, 775, 769, 770],
        grass2: [778, 782, 783, 745, 760, 761, 764],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Solare", "Revitalizzante"],
      grass: ["Pozione", "Miele", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capitano di tipo Normale", badge: "Cristallo Normale", teamIds: [734, 735], opponentPower: 14 },
      { title: "Capitano di tipo Acqua", badge: "Cristallo Idrico", teamIds: [746, 752], opponentPower: 26 },
      { title: "Capitano di tipo Fuoco", badge: "Cristallo Pyros", teamIds: [758, 776], opponentPower: 35 },
      { title: "Capitano di tipo Erba", badge: "Cristallo Botanico", teamIds: [754, 756], opponentPower: 46 },
      { title: "Capitano di tipo Elettrico", badge: "Cristallo Electro", teamIds: [777, 738], opponentPower: 58 },
      { title: "Capitano di tipo Spettro", badge: "Cristallo Spettro", teamIds: [778, 769], opponentPower: 72 },
      { title: "Capitano di tipo Buio", badge: "Cristallo Tenebra", teamIds: [741, 758], opponentPower: 88 },
      { title: "Capitano di tipo Drago", badge: "Cristallo Drago", teamIds: [780, 784], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Kahuna — Lotta", teamIds: [739, 759, 760, 297], opponentPower: 120 },
      { title: "Kahuna — Roccia", teamIds: [745, 743, 299, 774], opponentPower: 132 },
      { title: "Kahuna — Spettro", teamIds: [778, 769, 426, 781], opponentPower: 144 },
      { title: "Kahuna — Volante", teamIds: [733, 758, 227, 780], opponentPower: 156 },
    ],

    champion: {
      title: "Campione della Lega di Alola",
      badge: "Titolo di Campione di Alola",
      teamIds: [745, 763, 768, 778, 784],
      opponentPower: 175,
    },

    rival: [
      { title: "Il tuo Rivale", teamIds: [744, 772], opponentPower: 20, afterGymIndex: 0 },
      { title: "Il tuo Rivale", teamIds: [745, 772, 761, 742], opponentPower: 62, afterGymIndex: 4 },
      { title: "Il tuo Rivale", teamIds: [745, 773, 763, 743, 758, 769], opponentPower: 94, afterGymIndex: 6 },
    ],

    villainBoss: {
      title: "Capo Team Skull — Guzma",
      teamIds: [768, 212, 127],
      opponentPower: 52,
      rewardItem: "Caramella Rara",
      afterGymIndex: 3,
    },

    legendaries: [785, 786, 787, 788, 791, 792, 800],
  },

  {
    id: "galar",
    name: "Galar",
    starterIds: [810, 813, 816], // Grookey, Scorbunny, Sobble
    regionalDex: "galar",

    explorationTiers: [
      {
        level: 6,
        grass: [819, 821, 824, 827, 831, 835, 840, 872],
        fishing: [129, 846, 118, 833, 72, 60, 847],
        cave: [837, 843, 848, 41, 74, 878, 862],
        grass2: [831, 835, 840, 819, 821, 872, 829],
      },
      {
        level: 16,
        grass: [850, 852, 856, 859, 868, 872, 829],
        fishing: [847, 851, 130, 846, 833, 72, 60],
        cave: [859, 863, 865, 837, 843, 878, 862],
        grass2: [868, 871, 874, 856, 859, 829, 840],
      },
      {
        level: 28,
        grass: [875, 877, 884, 850, 856, 859, 868],
        fishing: [846, 847, 880, 851, 833, 130, 60],
        cave: [887, 880, 881, 882, 883, 878, 862],
        grass2: [862, 865, 870, 866, 874, 868, 871],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Metallica", "Revitalizzante"],
      grass: ["Pozione", "Miele", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Erba", teamIds: [829, 830], opponentPower: 14 },
      { title: "Capopalestra di tipo Acqua", badge: "Medaglia Acqua", teamIds: [846, 834], opponentPower: 26 },
      { title: "Capopalestra di tipo Fuoco", badge: "Medaglia Fuoco", teamIds: [850, 851], opponentPower: 35 },
      { title: "Capopalestra di tipo Lotta", badge: "Medaglia Lotta", teamIds: [852, 853], opponentPower: 46 },
      { title: "Capopalestra di tipo Folletto", badge: "Medaglia Folletto", teamIds: [858, 859], opponentPower: 58 },
      { title: "Capopalestra di tipo Roccia", badge: "Medaglia Roccia Galar", teamIds: [874, 875], opponentPower: 72 },
      { title: "Capopalestra di tipo Buio", badge: "Medaglia Buio", teamIds: [862, 863], opponentPower: 88 },
      { title: "Capopalestra di tipo Drago", badge: "Medaglia Drago Galar", teamIds: [884, 887], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Torneo — Sfida Erba", teamIds: [830, 829, 832, 850], opponentPower: 120 },
      { title: "Torneo — Sfida Acqua", teamIds: [834, 847, 851, 861], opponentPower: 132 },
      { title: "Torneo — Sfida Lotta", teamIds: [853, 865, 870, 887], opponentPower: 144 },
      { title: "Torneo — Sfida Drago", teamIds: [884, 887, 880, 881], opponentPower: 156 },
    ],

    champion: {
      title: "Campione Imbattibile di Galar",
      badge: "Titolo di Campione di Galar",
      teamIds: [812, 815, 818, 887, 6],
      opponentPower: 175,
    },

    rival: [
      { title: "Il tuo Rivale", teamIds: [819, 821], opponentPower: 20, afterGymIndex: 0 },
      { title: "Il tuo Rivale", teamIds: [820, 822, 811, 835], opponentPower: 62, afterGymIndex: 4 },
      { title: "Il tuo Rivale", teamIds: [820, 823, 812, 836, 850, 859], opponentPower: 94, afterGymIndex: 6 },
    ],

    villainBoss: {
      title: "Presidente Macro Cosmos — Rose",
      teamIds: [839, 879, 884, 870],
      opponentPower: 52,
      rewardItem: "Master Ball",
      afterGymIndex: 3,
    },

    legendaries: [888, 889, 890, 891, 892, 898],
  },

  {
    id: "paldea",
    name: "Paldea",
    starterIds: [906, 909, 912], // Sprigatito, Fuecoco, Quaxly
    regionalDex: "paldea",

    explorationTiers: [
      {
        level: 6,
        grass: [915, 917, 919, 921, 926, 928, 942, 944],
        fishing: [129, 963, 118, 960, 72, 60, 964],
        cave: [932, 935, 938, 41, 74, 950, 951],
        grass2: [926, 928, 940, 915, 917, 921, 944],
      },
      {
        level: 16,
        grass: [942, 944, 948, 915, 917, 921, 926],
        fishing: [964, 977, 130, 963, 960, 72, 60],
        cave: [953, 955, 958, 932, 935, 950, 951],
        grass2: [968, 971, 974, 928, 940, 926, 944],
      },
      {
        level: 28,
        grass: [975, 980, 996, 973, 979, 942, 948],
        fishing: [963, 964, 977, 960, 965, 130, 60],
        cave: [997, 998, 1000, 950, 951, 958, 983],
        grass2: [982, 996, 998, 968, 971, 974, 979],
      },
    ],

    items: {
      cave: ["Iper Pozione", "Pietra Brillante", "Revitalizzante"],
      grass: ["Pozione", "Miele", "Pallina Esca"],
    },

    gymLeaders: [
      { title: "Capopalestra di tipo Coleottero", badge: "Medaglia Insetto Paldea", teamIds: [917, 918], opponentPower: 14 },
      { title: "Capopalestra di tipo Erba", badge: "Medaglia Erba Paldea", teamIds: [928, 929], opponentPower: 26 },
      { title: "Capopalestra di tipo Elettrico", badge: "Medaglia Volt Paldea", teamIds: [938, 939], opponentPower: 35 },
      { title: "Capopalestra di tipo Acqua", badge: "Medaglia Acqua Paldea", teamIds: [963, 964], opponentPower: 46 },
      { title: "Capopalestra di tipo Normale", badge: "Medaglia Normale Paldea", teamIds: [916, 968], opponentPower: 58 },
      { title: "Capopalestra di tipo Spettro", badge: "Medaglia Spettro Paldea", teamIds: [971, 972], opponentPower: 72 },
      { title: "Capopalestra di tipo Psico", badge: "Medaglia Psiche Paldea", teamIds: [955, 956], opponentPower: 88 },
      { title: "Capopalestra di tipo Ghiaccio", badge: "Medaglia Ghiaccio Paldea", teamIds: [974, 975], opponentPower: 105 },
    ],

    eliteFour: [
      { title: "Superquattro — Terra", teamIds: [948, 949, 934, 980], opponentPower: 120 },
      { title: "Superquattro — Acciaio", teamIds: [958, 959, 968, 970], opponentPower: 132 },
      { title: "Superquattro — Volante", teamIds: [941, 962, 977, 982], opponentPower: 144 },
      { title: "Superquattro — Drago", teamIds: [996, 997, 998, 1000], opponentPower: 156 },
    ],

    champion: {
      title: "Prima Campionessa di Paldea",
      badge: "Titolo di Campione di Paldea",
      teamIds: [953, 954, 970, 980, 998, 1000],
      opponentPower: 175,
    },

    rival: [
      { title: "La tua Rivale", teamIds: [921, 935], opponentPower: 20, afterGymIndex: 0 },
      { title: "La tua Rivale", teamIds: [922, 935, 907, 944], opponentPower: 62, afterGymIndex: 4 },
      { title: "La tua Rivale", teamIds: [923, 936, 908, 945, 956, 969], opponentPower: 94, afterGymIndex: 6 },
    ],

    villainBoss: {
      title: "Capo Team Star — Eri & Cassiopea",
      teamIds: [935, 936, 968, 970],
      opponentPower: 52,
      rewardItem: "Caramella Rara",
      afterGymIndex: 3,
    },

    legendaries: [1001, 1002, 1003, 1004, 1007, 1008, 1024],
  },
];

export function getGeneration(id) {
  return GENERATIONS.find((g) => g.id === id) ?? null;
}

export function getExplorationTier(generation, gymIndex = 0) {
  if (!generation || !generation.explorationTiers || generation.explorationTiers.length === 0) {
    return { level: 6, grass: [25, 39, 52], fishing: [129, 60], cave: [41, 74], grass2: [63, 92] };
  }
  const tierIndex = Math.min(Math.floor(gymIndex / 3), generation.explorationTiers.length - 1);
  return generation.explorationTiers[Math.max(0, tierIndex)];
}

export function getNextGeneration(currentId) {
  const idx = GENERATIONS.findIndex((g) => g.id === currentId);
  if (idx === -1 || idx + 1 >= GENERATIONS.length) return null;
  return GENERATIONS[idx + 1];
}

// Costruita una sola volta al caricamento del modulo: nome medaglia -> tipo,
// ricavato dal titolo del capopalestra ("Capopalestra di tipo X") invece che
// dal nome estetico della medaglia stesso (che varia liberamente tra
// generazioni, es. "Medaglia Zanna" per il tipo Coleottero).
const BADGE_TYPE_BY_NAME = (() => {
  const map = {};
  for (const gen of GENERATIONS) {
    for (const gym of gen.gymLeaders || []) {
      const match = gym.title?.match(/di tipo (\S+)/);
      if (gym.badge && match) map[gym.badge] = match[1];
    }
  }
  return map;
})();

/**
 * Restituisce il tipo Pokémon associato ad una medaglia di palestra
 * (es. "Medaglia Zanna" -> "Coleottero"), o null se non è una medaglia di
 * palestra nota (es. un titolo da Campione, che non ha un tipo singolo).
 */
export function getBadgeType(badgeName) {
  return BADGE_TYPE_BY_NAME[badgeName] ?? null;
}
