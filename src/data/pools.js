// Pool di ID Pokémon (National Dex) usati nelle varie fasi del gioco.
// Aggiungere nuovi Pokémon a queste liste è sufficiente per ampliare le fasi:
// non serve toccare la logica di gioco.

export const STARTER_IDS = [1, 4, 7]; // Bulbasaur, Charmander, Squirtle

export const ROUTE1_GRASS_WILD_IDS = [16, 19, 10, 13]; // Pidgey, Rattata, Caterpie, Weedle
export const ROUTE1_FISHING_WILD_IDS = [129, 60, 118]; // Magikarp, Poliwag, Goldeen

export const ROUTE2_CAVE_WILD_IDS = [41, 74, 95]; // Zubat, Geodude, Onix
export const ROUTE2_GRASS_WILD_IDS = [43, 69, 32]; // Oddish, Bellsprout, Nidoran

// Le squadre avversarie non usano nomi di personaggi ufficiali (per restare
// un progetto originale), solo un ruolo/titolo e una squadra di Pokémon.
export const GYM1 = {
  title: 'Capopalestra di tipo Roccia',
  teamIds: [74, 95], // Geodude, Onix
};

export const RIVAL = {
  title: 'Il tuo Rivale',
  teamIds: [16, 129, 74], // squadra eterogenea di media difficoltà
};

export const ITEMS_FOUND_IN_CAVE = ['Super Pozione', 'Pietra Lunare', 'Antidoto'];
export const ITEMS_FOUND_IN_GRASS = ['Pozione', 'Pallina Esca', 'Foglia Strana'];
