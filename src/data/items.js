// Descrizioni dettagliate di tutti gli strumenti presenti nel gioco.

export const ITEM_DESCRIPTIONS = {
  "Master Ball": "La Poké Ball definitiva. Cattura qualsiasi Pokémon selvatico o leggendario con successo garantito al 100%!",
  "Caramella Rara": "Caramella prodigiosa ricolma di energia. Aumenta istantaneamente il livello di tutti i Pokémon in squadra di +3!",
  "Pozione": "Strumento curativo base. Aumenta la potenza effettiva della squadra di +10 per la battaglia.",
  "Super Pozione": "Strumento curativo avanzato. Aumenta la potenza effettiva della squadra di +18 per la battaglia.",
  "Iper Pozione": "Strumento curativo molto potente. Aumenta la potenza effettiva della squadra di +24 per la battaglia.",
  "Antidoto": "Cura i problemi di stato e dona stabilità alla squadra in battaglia (+10 Potenza).",
  "Pietra Metallica": "Minerale raro e resistente. Aumenta la potenza di battaglia di +14.",
  "Pietra Solare": "Pietra mistica riscaldata dal sole. Aumenta la potenza di battaglia di +14.",
  "Pietra Idrica": "Pietra evolutiva elementale dell'acqua. Aumenta la potenza di battaglia di +14.",
  "Pietra Folletto": "Pietra incantata ricca di energia magica. Aumenta la potenza di battaglia di +14.",
  "Pietra Brillante": "Pietra che brilla di una luce intensa. Aumenta la potenza di battaglia di +14.",
  "Foglia Strana": "Foglia aromatica speciale. Rinfresca la squadra e dona +10 Potenza.",
  "Biscotto Lavarone": "Famoso biscotto curativo di Lavarone. Rigenera la squadra (+10 Potenza).",
  "Miele": "Miele profumato e dolcissimo. Attira la fortuna in battaglia (+10 Potenza).",
  "Dolceofelia": "Prelibatezza regionale zuccherata. Aumenta il morale della squadra (+10 Potenza).",
  "Galletta di Yantar": "Biscotto croccante della regione di Kalos (+10 Potenza).",
  "Pallina Esca": "Strumento di supporto per attirare e pacificare i Pokémon.",
  "Revitalizzante": "Rimedia alle ferite della squadra donando +14 Potenza in battaglia.",
  "Rimedio Finale": "Cura completa che ripristina le energie del team (+14 Potenza).",
  "Assorbosfera": "Strumento tenuto. Aumenta la potenza di attacco del Pokémon del +20% in battaglia.",
  "Resti": "Strumento tenuto. Rigenera le forze ad ogni turno donando +10 Potenza passiva.",
  "Stolascelta": "Strumento tenuto. Aumenta la velocità e la potenza di attacco del +15%.",
  "Baccamela": "Strumento tenuto. Annulla i malus di tipo e protegge la squadra in battaglia.",
};

// Mappa nome italiano -> slug ufficiale PokeAPI (per lo sprite pixel reale
// in /item/{slug}). Solo per gli strumenti di cui sono ragionevolmente
// sicuro corrispondano davvero a un oggetto reale dei giochi: diversi nomi
// in questo gioco sono invenzioni di sapore (es. "Biscotto Lavarone",
// "Galletta di Yantar", "Pietra Metallica") senza un equivalente ufficiale
// certo — per quelli niente slug, restano con l'icona emoji esistente
// invece di rischiare uno sprite sbagliato/fuorviante.
export const ITEM_POKEAPI_SLUGS = {
  "Master Ball": "master-ball",
  "Pozione": "potion",
  "Super Pozione": "super-potion",
  "Iper Pozione": "hyper-potion",
  "Caramella Rara": "rare-candy",
  "Antidoto": "antidote",
  "Pietra Solare": "sun-stone",
  "Pietra Idrica": "water-stone",
  "Pietra Brillante": "shiny-stone",
  "Pallina Esca": "poke-toy",
  "Resti": "leftovers",
  "Revitalizzante": "revive",
  "Rimedio Finale": "full-restore",
  "Stolascelta": "choice-scarf",
  "Assorbosfera": "absorb-bulb",
  "Miele": "honey",
};

/**
 * Restituisce la descrizione di uno strumento dato il suo nome.
 * @param {string} name
 * @returns {string}
 */
export function getItemDescription(name) {
  if (!name) return "";
  if (ITEM_DESCRIPTIONS[name]) return ITEM_DESCRIPTIONS[name];
  if (name.includes("Pozione")) return "Strumento curativo. Aumenta la potenza della squadra in battaglia.";
  if (name.includes("Pietra")) return "Pietra evolutiva / minerale speciale (+14 Potenza).";
  return "Strumento utilizzabile dallo zaino per potenziare la squadra.";
}
