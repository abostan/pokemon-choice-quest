// Effetto di uno strumento usato prima di una battaglia. Prima di questo
// modulo ogni oggetto (comprese le Pozioni, ma anche Assorbosfera/Stolascelta/
// Baccamela nonostante descrizioni esplicitamente diverse in data/items.js)
// dava solo un bonus fisso di Potenza scelto per string-matching dentro
// BattleScene.js — nessuno dei tre "strumenti tenuti" applicava davvero il
// bonus percentuale o l'annullamento di tipo promesso dalla propria
// descrizione. Vedi ROADMAP.md Fase 11.

/**
 * @typedef {{ kind: 'flat', value: number }
 *         | { kind: 'percent', value: number }
 *         | { kind: 'neutralizeType' }} ItemEffect
 */

/**
 * @param {string} itemName
 * @returns {ItemEffect}
 */
export function computeItemEffect(itemName) {
  if (itemName === "Assorbosfera") return { kind: "percent", value: 0.20 };
  if (itemName === "Stolascelta") return { kind: "percent", value: 0.15 };
  if (itemName === "Baccamela") return { kind: "neutralizeType" };
  if (itemName.includes("Iper")) return { kind: "flat", value: 24 };
  if (itemName.includes("Super")) return { kind: "flat", value: 18 };
  if (itemName.includes("Pozione")) return { kind: "flat", value: 10 };
  if (itemName.includes("Pietra") || itemName.includes("Rimedio")) return { kind: "flat", value: 14 };
  return { kind: "flat", value: 10 };
}
