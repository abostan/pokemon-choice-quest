// Pool di Pokémon e oggetti per le zone a tema dei bivi di esplorazione
// (pre-postgame, per-regione, e post-game, a pool fisso multi-generazione).
// Estratti da ExploreSceneContainer.js (ROADMAP.md: simulatore di run) per
// essere riusabili anche da scripts/simulate-pools.mjs senza duplicare i
// dati — lo stesso principio già seguito da simulate-flow.mjs, che riusa la
// logica reale invece di reimplementarla altrove.

// --- Pre-postgame: pool per-regione. Tutte e 9 le regioni hanno ora un pool
// dedicato (Alola/Galar/Paldea aggiunte in scripts/simulate-pools.mjs Fase
// 13 — prima ricadevano sul fallback generico Kanto-based passato al sito
// di chiamata, che resta comunque come rete di sicurezza per eventuali
// future regioni). Le espansioni su regioni preesistenti (iceZone/mysteryEgg,
// entrambe risultate sottodimensionate dalla simulazione) sono state
// aggiunte SEMPRE in coda, senza mai riordinare o rimuovere id esistenti —
// l'unico punto del codice che legge un indice fisso di questi pool è
// ExploreSceneContainer.js (nessuno, in realtà: solo tier.grass[0]/tier.cave[0]
// per gli Allenatori, che non usano questi pool) quindi non c'era comunque
// alcun rischio, ma si mantiene lo stesso criterio già seguito nelle Fasi 11/12.

export const FIRE_POOLS_BY_REGION = {
  kanto: [37, 58, 100, 81, 77],
  johto: [155, 179, 218, 228, 239],
  hoenn: [255, 309, 322, 304, 324],
  sinnoh: [390, 403, 240, 436, 479],
  unova: [498, 522, 554, 599, 607],
  kalos: [653, 667, 694, 679, 669],
  alola: [725, 726, 727, 758, 776], // Litten, Torracat, Incineroar, Salazzle, Turtonator
  galar: [813, 814, 815, 851, 844], // Scorbunny, Raboot, Cinderace, Centiskorch, Sandaconda
  paldea: [909, 910, 911, 935, 950], // Fuecoco, Crocalor, Skeledirge, Charcadet (→Armarouge), Klawf
};

export const GHOST_POOLS_BY_REGION = {
  kanto: [92, 63, 96, 35, 39],
  johto: [200, 198, 215, 280, 175],
  hoenn: [353, 355, 302, 325, 280],
  sinnoh: [425, 442, 433, 434, 439],
  unova: [570, 607, 562, 574, 577],
  kalos: [708, 710, 677, 682, 684],
  alola: [769, 770, 778, 781, 764], // Sandygast, Palossand, Mimikyu, Dhelmise, Comfey
  galar: [854, 855, 867, 858, 861], // Sinistea, Polteageist, Runerigus, Hatterene, Grimmsnarl
  paldea: [971, 972, 956, 942, 957, 937, 946], // Greavard, Houndstone, Espathra, Maschiff, Tinkatink (→Tinkatuff→Tinkaton), Ceruledge, Bramblin (→Brambleghast)
};

export const ICE_POOLS_BY_REGION = {
  kanto: [124, 131, 90, 142, 87], // + Dewgong
  johto: [220, 225, 215, 227, 226], // + Mantine
  hoenn: [361, 363, 378, 374, 364], // + Sealeo
  sinnoh: [459, 361, 436, 447, 478], // + Froslass
  unova: [582, 613, 615, 624, 614], // + Beartic
  kalos: [712, 698, 679, 701, 713], // + Avalugg
  alola: [739, 740, 777, 733, 741], // Crabrawler, Crabominable, Togedemaru, Toucannon, Oricorio
  galar: [872, 873, 875, 884, 823], // Snom, Frosmoth, Eiscue, Duraludon, Corviknight
  paldea: [974, 975, 941, 962, 968], // Cetoddle, Cetitan, Kilowattrel, Bombirdier, Orthworm
};

export const FIGHTING_POOLS_BY_REGION = {
  kanto: [66, 56, 106, 107, 52],
  johto: [236, 214, 190, 216, 209],
  hoenn: [296, 307, 335, 287, 300],
  sinnoh: [447, 453, 427, 417, 422],
  unova: [532, 559, 619, 572, 506],
  kalos: [674, 701, 659, 676, 672],
  alola: [766, 759, 760, 735, 734], // Passimian, Stufful, Bewear, Gumshoos, Yungoos
  galar: [870, 865, 853, 820, 832], // Falinks, Sirfetch'd, Grapploct, Greedent, Dubwool
  paldea: [979, 915, 925, 982, 981, 967], // Annihilape, Lechonk, Maushold, Dudunsparce, Farigiraf, Cyclizar
};

export const EGG_POOLS_BY_REGION = {
  kanto: [133, 131, 147, 113, 137], // + Chansey, Porygon
  johto: [175, 172, 246, 179, 183], // + Mareep, Marill
  hoenn: [360, 328, 371, 298, 349], // + Azurill, Feebas
  sinnoh: [447, 403, 443, 440, 458], // + Happiny, Mantyke
  unova: [570, 559, 610, 587, 546], // + Emolga, Cottonee
  kalos: [677, 704, 714, 669, 682], // + Flabébé, Spritzee
  alola: [782, 742, 771, 761, 743], // Jangmo-o, Cutiefly, Pyukumuku, Bounsweet, Ribombee
  galar: [840, 848, 868, 835, 819], // Applin, Toxel, Milcery, Yamper, Skwovet
  paldea: [926, 924, 919, 953, 960], // Fidough, Tandemaus, Nymble, Rellor, Wiglett
};

export const FOSSIL_POOLS_BY_REGION = {
  kanto: [138, 140, 142, 139, 141], // + Omastar, Kabutops (le evoluzioni dei fossili base già presenti)
  johto: [138, 140, 345, 347, 142], // + Aerodactyl (completa il trio Kanto, mancante per una svista)
  hoenn: [345, 347, 142, 346, 348], // + Cradily, Armaldo
  sinnoh: [408, 410, 142, 409, 411], // + Rampardos, Bastiodon
  unova: [564, 566, 565, 567, 142], // + Carracosta, Archeops
  kalos: [696, 698, 697, 699, 142], // + Tyrantrum, Aurorus
  // Alola non ha fossili propri nel canone (in USUM si recuperano quelli
  // classici via Poké Pelago): pool a tema "creazione di laboratorio antico"
  // che combina questa lore con i fossili classici già stabiliti altrove.
  alola: [772, 773, 138, 140, 142], // Type: Null, Silvally, Omanyte, Kabuto, Aerodactyl
  galar: [880, 881, 882, 883, 884], // Dracozolt, Arctozolt, Dracovish, Arctovish, Duraludon
  // Paldea non ha fossili classici: i Pokémon Paradosso "antichi" (creature
  // preistoriche letteralmente riportate in vita/studiate in laboratorio
  // nel gioco originale) sono il fit tematico più diretto disponibile.
  paldea: [984, 985, 986, 987, 988, 989], // Great Tusk, Scream Tail, Brute Bonnet, Flutter Mane, Slither Wing, Sandy Shocks
};

export const SAFARI_POOLS_BY_REGION = {
  kanto: [123, 127, 128, 115, 113, 147],
  johto: [214, 225, 234, 246, 241], // + Miltank
  hoenn: [328, 335, 359, 371, 320], // + Wailmer
  sinnoh: [443, 453, 455, 424, 415], // + Ambipom, Combee
  unova: [559, 610, 621, 590, 618], // + Foongus, Stunfisk
  kalos: [704, 708, 712, 687, 703], // + Malamar, Carbink
  alola: [746, 748, 750, 774, 775], // Wishiwashi, Toxapex, Mudsdale, Minior, Komala
  galar: [845, 846, 871, 874, 852], // Cramorant, Arrokuda, Pincurchin, Stonjourner, Clobbopus
  paldea: [931, 976, 977, 963, 961, 969, 978], // Squawkabilly, Veluza, Dondozo, Finizen, Wugtrio, Glimmet (→Glimmora), Tatsugiri
};

export const NPC_TRADE_POOL = [83, 122, 124, 127, 131, 214, 303, 441, 538, 677];

// Jackpot del Casinò (playCasino() in ExploreSceneContainer.js): 50/50 tra
// Porygon e la sua evoluzione Porygon2 — unica fonte di cattura del Casinò,
// estratta qui per essere inclusa nel controllo di raggiungibilità del
// Pokédex (scripts/simulate-pools.mjs, Sezione D).
export const CASINO_JACKPOT_POOL = [137, 233];

// --- Post-game: pool fissi, già multi-generazione ---

export const POSTGAME_FIRE_POOL = [58, 77, 218, 322, 554, 667, 935, 4, 111, 246, 328, 408, 636, 758, 839, 936];
export const POSTGAME_GHOST_POOL = [92, 200, 353, 425, 607, 708, 971, 63, 122, 302, 355, 359, 570, 677, 885];
export const POSTGAME_ICE_POOL = [131, 225, 363, 459, 613, 712, 974, 87, 124, 215, 220, 361, 471, 582, 873, 996];
export const POSTGAME_FIGHTING_POOL = [66, 106, 296, 447, 532, 759, 921, 56, 107, 236, 448, 619, 701, 979];
export const POSTGAME_SAFARI_POOL = [123, 128, 147, 246, 371, 443, 610, 696, 782, 885, 996, 142, 193, 359, 472, 571, 707, 866, 952];
export const POSTGAME_FOSSIL_POOL = [138, 140, 142, 345, 347, 408, 410, 564, 566, 696, 698, 880, 881, 882, 883];
export const POSTGAME_TRADE_POOL = [137, 212, 468, 474, 635, 706, 959, 448, 475, 700, 776, 887, 983];
export const POSTGAME_EGG_POOL = [133, 175, 447, 633, 704, 885, 996, 172, 173, 174, 298, 360, 438, 439];
export const POSTGAME_ULTRA_POOL = [793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806];
export const POSTGAME_SEARCH_ITEMS = ["Super Pozione", "Caramella Rara", "Pietraluna", "Resti"];

// --- Oggetti tematici (Fase 7) ---

export const WEATHER_ITEM_BY_ID = {
  sun: "Pietra Solare", // Sole Intenso — corrispondenza diretta col nome
  rain: "Idropietra", // Pioggia Battente
  sandstorm: "Pietra Metallica", // Tempesta di Sabbia — minerale/deserto
  fog: "Pietraluna", // Nebbia Fitta — atmosfera notturna/misteriosa
};

export const EVOLUTION_STONES = [
  "Pietra Focaia", "Idropietra", "Pietra Foglia", "Pietra Tuono", "Pietraluna",
  "Pietra Metallica", "Pietra Solare", "Pietra Idrica", "Pietra Folletto", "Pietra Brillante",
];

export const SAFARI_ITEMS = ["Miele", "Foglia Strana", "Resti", "Caramella Rara"];
