// Range del Pokédex nazionale per regione. Estratto da PokedexModal.js
// (unica fonte di questi numeri finora) per essere riusabile anche da
// scripts/simulate-pools.mjs — stesso principio già seguito per i pool di
// zona in exploreZonePools.js: mai duplicare una tabella che può disallinearsi.
export const TOTAL_POKEMON_COUNT = 1025;

export const NATIONAL_DEX_REGIONS = [
  { id: "all", name: "Tutti (1-1025)", start: 1, end: 1025 },
  { id: "kanto", name: "Kanto (1-151)", start: 1, end: 151 },
  { id: "johto", name: "Johto (152-251)", start: 152, end: 251 },
  { id: "hoenn", name: "Hoenn (252-386)", start: 252, end: 386 },
  { id: "sinnoh", name: "Sinnoh (387-493)", start: 387, end: 493 },
  { id: "unova", name: "Unova (494-649)", start: 494, end: 649 },
  { id: "kalos", name: "Kalos (650-721)", start: 650, end: 721 },
  { id: "alola", name: "Alola (722-809)", start: 722, end: 809 },
  { id: "galar", name: "Galar (810-905)", start: 810, end: 905 },
  { id: "paldea", name: "Paldea (906-1025)", start: 906, end: 1025 },
];
