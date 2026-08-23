// Mappatura e logica delle Abilità Passive dei Pokémon

export const ABILITIES = {
  intimidate: {
    name: "Prepotenza",
    icon: "🦁",
    description: "Riduce la potenza dell'avversario del -10% ad ogni scontro.",
  },
  pressure: {
    name: "Pressione",
    icon: "⚡",
    description: "Aumenta la probabilità di vittoria tattica del +8%.",
  },
  levitate: {
    name: "Levitazione",
    icon: "🛡️",
    description: "Annulla le penalità di svantaggio di tipo (-10% -> 0%).",
  },
  swiftSwim: {
    name: "Nuotavelox",
    icon: "🌊",
    description: "Aumenta la potenza della squadra del +15% nelle sfide d'acqua.",
  },
  speedBoost: {
    name: "Acceleratore",
    icon: "💥",
    description: "Aumenta la probabilità di successo in battaglia del +5%.",
  },
  sereneGrace: {
    name: "Leggiadria",
    icon: "🍀",
    description: "Aumenta le probabilità di cattura Pokémon selvatici del +10%.",
  },
};

// Mappatura delle specie Pokémon ad abilità specifiche
const SPECIES_ABILITIES = {
  // Prepotenza (Intimidate)
  130: ABILITIES.intimidate, // Gyarados
  59: ABILITIES.intimidate,  // Arcanine
  373: ABILITIES.intimidate, // Salamence
  398: ABILITIES.intimidate, // Staraptor
  405: ABILITIES.intimidate, // Luxray
  553: ABILITIES.intimidate, // Krookodile
  727: ABILITIES.intimidate, // Incineroar

  // Pressione (Pressure)
  150: ABILITIES.pressure, // Mewtwo
  249: ABILITIES.pressure, // Lugia
  250: ABILITIES.pressure, // Ho-Oh
  384: ABILITIES.pressure, // Rayquaza
  483: ABILITIES.pressure, // Dialga
  484: ABILITIES.pressure, // Palkia
  487: ABILITIES.pressure, // Giratina
  144: ABILITIES.pressure, // Articuno
  145: ABILITIES.pressure, // Zapdos
  146: ABILITIES.pressure, // Moltres

  // Levitazione (Levitate)
  94: ABILITIES.levitate,   // Gengar
  330: ABILITIES.levitate,  // Flygon
  635: ABILITIES.levitate,  // Hydreigon
  380: ABILITIES.levitate,  // Latias
  381: ABILITIES.levitate,  // Latios
  479: ABILITIES.levitate,  // Rotom
  437: ABILITIES.levitate,  // Bronzong

  // Nuotavelox (Swift Swim)
  260: ABILITIES.swiftSwim, // Swampert
  230: ABILITIES.swiftSwim, // Kingdra
  419: ABILITIES.swiftSwim, // Floatzel
  272: ABILITIES.swiftSwim, // Ludicolo
  141: ABILITIES.swiftSwim, // Kabutops

  // Acceleratore (Speed Boost)
  257: ABILITIES.speedBoost, // Blaziken
  291: ABILITIES.speedBoost, // Ninjask
  469: ABILITIES.speedBoost, // Yanmega
  319: ABILITIES.speedBoost, // Sharpedo

  // Leggiadria (Serene Grace)
  468: ABILITIES.sereneGrace, // Togekiss
  385: ABILITIES.sereneGrace, // Jirachi
  242: ABILITIES.sereneGrace, // Blissey
};

/**
 * Restituisce l'abilità passiva di una specie Pokémon (o una basata sul tipo/specie come fallback).
 * @param {number} speciesId
 * @returns {object|null}
 */
export function getPokemonAbility(speciesId) {
  if (SPECIES_ABILITIES[speciesId]) {
    return SPECIES_ABILITIES[speciesId];
  }
  // Euristica di riempimento (NON dati reali dei giochi): assegna un'abilità
  // anche alle ~1000 specie non presenti in SPECIES_ABILITIES, per varietà,
  // usando il resto della divisione dell'id come chiave arbitraria. Non ha
  // alcun significato narrativo — es. Weedle (id 13) riceve "Acceleratore"
  // solo perché 13 % 13 === 0, non perché ci sia un legame tematico.
  if (speciesId % 13 === 0) return ABILITIES.speedBoost;
  if (speciesId % 17 === 0) return ABILITIES.intimidate;
  if (speciesId % 19 === 0) return ABILITIES.sereneGrace;
  return null;
}

/**
 * Calcola l'insieme delle abilità attive in una squadra.
 * @param {Array<{id: number, isFainted?: boolean}>} team
 * @returns {Array<object>}
 */
export function computeTeamAbilities(team) {
  if (!team || team.length === 0) return [];
  const activeAbilities = [];
  const seenAbilities = new Set();

  for (const pokemon of team) {
    if (pokemon.isFainted) continue;
    const ability = getPokemonAbility(pokemon.id);
    if (ability && !seenAbilities.has(ability.name)) {
      seenAbilities.add(ability.name);
      activeAbilities.push(ability);
    }
  }
  return activeAbilities;
}
