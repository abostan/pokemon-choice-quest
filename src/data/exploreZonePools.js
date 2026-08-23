// Pool di Pokémon e oggetti per le zone a tema dei bivi di esplorazione
// (pre-postgame, per-regione, e post-game, a pool fisso multi-generazione).
// Estratti da ExploreSceneContainer.js (ROADMAP.md: simulatore di run) per
// essere riusabili anche da scripts/simulate-pools.mjs senza duplicare i
// dati — lo stesso principio già seguito da simulate-flow.mjs, che riusa la
// logica reale invece di reimplementarla altrove.

// --- Pre-postgame: pool per-regione (solo 6 delle 9 regioni hanno un pool
// dedicato; le altre 3 ricadono sul fallback passato al sito di chiamata) ---

export const FIRE_POOLS_BY_REGION = {
  kanto: [37, 58, 100, 81, 77],
  johto: [155, 179, 218, 228, 239],
  hoenn: [255, 309, 322, 304, 324],
  sinnoh: [390, 403, 240, 436, 479],
  unova: [498, 522, 554, 599, 607],
  kalos: [653, 667, 694, 679, 669],
};

export const GHOST_POOLS_BY_REGION = {
  kanto: [92, 63, 96, 35, 39],
  johto: [200, 198, 215, 280, 175],
  hoenn: [353, 355, 302, 325, 280],
  sinnoh: [425, 442, 433, 434, 439],
  unova: [570, 607, 562, 574, 577],
  kalos: [708, 710, 677, 682, 684],
};

export const ICE_POOLS_BY_REGION = {
  kanto: [124, 131, 90, 142],
  johto: [220, 225, 215, 227],
  hoenn: [361, 363, 378, 374],
  sinnoh: [459, 361, 436, 447],
  unova: [582, 613, 615, 624],
  kalos: [712, 698, 679, 701],
};

export const FIGHTING_POOLS_BY_REGION = {
  kanto: [66, 56, 106, 107, 52],
  johto: [236, 214, 190, 216, 209],
  hoenn: [296, 307, 335, 287, 300],
  sinnoh: [447, 453, 427, 417, 422],
  unova: [532, 559, 619, 572, 506],
  kalos: [674, 701, 659, 676, 672],
};

export const EGG_POOLS_BY_REGION = {
  kanto: [133, 131, 147],
  johto: [175, 172, 246],
  hoenn: [360, 328, 371],
  sinnoh: [447, 403, 443],
  unova: [570, 559, 610],
  kalos: [677, 704, 714],
};

export const FOSSIL_POOLS_BY_REGION = {
  kanto: [138, 140, 142],
  johto: [138, 140, 345, 347],
  hoenn: [345, 347, 142],
  sinnoh: [408, 410, 142],
  unova: [564, 566],
  kalos: [696, 698],
};

export const SAFARI_POOLS_BY_REGION = {
  kanto: [123, 127, 128, 115, 113, 147],
  johto: [214, 225, 234, 246],
  hoenn: [328, 335, 359, 371],
  sinnoh: [443, 453, 455],
  unova: [559, 610, 621],
  kalos: [704, 708, 712],
};

export const NPC_TRADE_POOL = [83, 122, 124, 127, 131, 214, 303, 441, 538, 677];

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
