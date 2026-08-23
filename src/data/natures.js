// Nature dei Pokémon — nei giochi ufficiali ogni Nature alza una statistica e
// ne abbassa un'altra (es. Decisa: +Attacco/-Att. Speciale). Questo gioco non
// modella 6 statistiche separate in battaglia, solo una "Potenza" aggregata
// (vedi computeTeamPower in engine/battleLogic.js): le Nature sono quindi
// semplificate in 3 fasce dirette sulla Potenza — offensive (+10%), difensive
// (-10%) e neutre (0%, esistono anche nei giochi reali: Ferma/Docile/Seria/
// Bizzarra non alterano alcuna statistica).
//
// L'assegnazione per Pokémon è deterministica sul resto della divisione
// dell'id (stesso approccio di riempimento già usato in data/abilities.js
// per le specie non mappate esplicitamente): nei giochi reali la Natura è
// casuale per singolo esemplare catturato, non legata alla specie — qui
// invece è stabile per id, così lo stesso Pokémon mostra sempre la stessa
// Natura tra un render e l'altro senza dover persistere un nuovo campo per
// ogni membro della squadra.

export const NATURE_POWER_MOD = {
  positive: 0.10,
  neutral: 0,
  negative: -0.10,
};

export const NATURES = [
  { name: "Decisa", tier: "positive" },
  { name: "Modesta", tier: "positive" },
  { name: "Timida", tier: "positive" },
  { name: "Gioviale", tier: "positive" },
  { name: "Impavida", tier: "positive" },
  { name: "Audace", tier: "negative" },
  { name: "Mite", tier: "negative" },
  { name: "Cauta", tier: "negative" },
  { name: "Fiacca", tier: "negative" },
  { name: "Placida", tier: "negative" },
  { name: "Ferma", tier: "neutral" },
  { name: "Docile", tier: "neutral" },
  { name: "Seria", tier: "neutral" },
  { name: "Bizzarra", tier: "neutral" },
];

/**
 * Restituisce la Natura di un Pokémon dato il suo id specie.
 * @param {number} speciesId
 * @returns {{ name: string, tier: 'positive'|'neutral'|'negative' }}
 */
export function getPokemonNature(speciesId) {
  if (!speciesId) return NATURES[0];
  return NATURES[speciesId % NATURES.length];
}

/**
 * Moltiplicatore di Potenza dato dalla Natura (1.10 / 1.0 / 0.90).
 * @param {{ tier: string } | null} nature
 */
export function computeNatureMultiplier(nature) {
  if (!nature) return 1.0;
  return 1.0 + (NATURE_POWER_MOD[nature.tier] ?? 0);
}
