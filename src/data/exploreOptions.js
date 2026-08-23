// Pesi delle opzioni speciali del bivio di esplorazione principale
// (pre-postgame, vedi ExploreSceneContainer.js "allSpecialOptions").
// Unica fonte di verità condivisa tra il componente (che vi affianca
// label/hint/onSelect) e i test di regressione in
// tests/explorePicker.test.js, così una modifica ad una probabilità non
// può disallinearsi silenziosamente dai test che la verificano.
export const EXPLORE_SPECIAL_WEIGHTS = {
  legendary: 0.06,
  fireZone: 0.20,
  ghostZone: 0.20,
  iceZone: 0.15,
  fightingZone: 0.20,
  fish: 0.30,
  cave: 0.30,
  enemyTeam: 0.20,
  mysteryEgg: 0.12,
  trainer: 0.25,
  pokecenterMarket: 0.22,
  searchItems: 0.25,
  fossilRevival: 0.20,
  npcTrade: 0.20,
  wanderingMerchant: 0.22,
  casinoGameCorner: 0.22,
  safariZone: 0.22,
  weatherCondition: 0.25,
};
