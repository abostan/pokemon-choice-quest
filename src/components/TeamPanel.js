import React from "react";
import { PokemonChip } from "./PokemonSprite.js";
import { getItemDescription, groupItemsByName } from "../data/items.js";
import { computeTeamAbilities } from "../data/abilities.js";
import { computeTeamPower, computeFatigueMultiplier } from "../engine/battleLogic.js";
import { usePokemon } from "../hooks/usePokemon.js";
import { useMegaSprite } from "../hooks/useMegaSprite.js";
import { useTeamStats } from "../hooks/useTeamStats.js";
import { getTypeIcon } from "../data/types.js";
import { computeWeatherEffect } from "../engine/weatherLogic.js";
import { getPokemonNature, computeNatureMultiplier } from "../data/natures.js";
import { getGenderSymbol } from "../data/gender.js";
import { usePokemonSpecies } from "../hooks/usePokemonSpecies.js";
import { getBadgeType } from "../data/generations.js";
import { TapTooltip } from "./TapTooltip.js";
import { ItemIcon } from "./ItemIcon.js";

const e = React.createElement;

function getBadgeIcon(badgeName) {
  if (badgeName.includes("Campione")) return "👑";
  if (badgeName.includes("Tris")) return "🍀"; // medaglia speciale non legata ad un tipo singolo
  const type = getBadgeType(badgeName);
  return type ? getTypeIcon(type) : "🏅";
}

function BadgeItem({ name }) {
  const icon = getBadgeIcon(name);
  return e(
    "div",
    { className: "badge-visual-chip", title: name },
    e("span", { className: "badge-icon" }, icon),
    e("span", { className: "badge-title" }, name)
  );
}

function TeamGridSlot({ pokemon, activeMega }) {
  if (!pokemon) {
    return e(
      "div",
      { className: "team-grid-slot empty" },
      e("span", { className: "empty-icon" }, "+"),
      e("span", { className: "empty-text" }, "Vuoto")
    );
  }

  const { data, loading } = usePokemon(pokemon.id);
  const { data: speciesData } = usePokemonSpecies(pokemon.id);
  const genderSymbol = getGenderSymbol(speciesData?.genderRate ?? null, pokemon.id);
  // Sprite reale della forma Mega/Gigamax se la specie ne ha una su PokeAPI
  // (molte non ce l'hanno, esattamente come nei giochi originali — in quel
  // caso resta lo sprite normale, il bonus di potenza si applica comunque).
  const megaSprite = useMegaSprite(pokemon.id, activeMega);
  const name = loading ? "..." : (data?.name ?? `#${pokemon.id}`);
  const isMegaShown = activeMega && !!megaSprite;
  const spriteUrl = isMegaShown
    ? megaSprite
    : pokemon.isShiny
    ? (data?.spriteShiny || data?.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`)
    : (data?.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`);
  const bstHint = data?.bst ? ` | BST: ${data.bst}` : "";
  const nature = getPokemonNature(pokemon.id);
  const natureMult = computeNatureMultiplier(nature);
  const natureHint =
    natureMult > 1 ? ` | Natura: ${nature.name} (+10% Potenza)` : natureMult < 1 ? ` | Natura: ${nature.name} (-10% Potenza)` : ` | Natura: ${nature.name}`;

  return e(
    "div",
    {
      className: `team-grid-slot ${pokemon.isShiny ? "shiny-slot" : ""} ${isMegaShown ? "mega-slot" : ""}`,
      title: `${name} Lv.${pokemon.level}${bstHint}${natureHint}${genderSymbol ? ` | ${genderSymbol}` : ""}${pokemon.isShiny ? " ✨ (Shiny)" : ""}${isMegaShown ? " 🔮 (Mega/Gigamax)" : ""}`,
    },
    e("img", { src: spriteUrl, alt: name, className: "team-slot-img" }),
    e(
      "span",
      { className: "team-slot-name" },
      name,
      genderSymbol && e("span", { className: `gender-symbol gender-${genderSymbol === "♀" ? "female" : "male"}` }, ` ${genderSymbol}`)
    ),
    e("span", { className: "team-slot-level" }, `Lv.${pokemon.level}`),
    pokemon.isShiny && e("span", { className: "shiny-sparkle" }, "✨"),
    isMegaShown && e("span", { className: "mega-sparkle" }, "🔮")
  );
}

/**
 * Pannello laterale sempre visibile: squadra (griglia 2x3), box, medaglie, zaino.
 */
export function TeamPanel({
  team = [],
  box = [],
  badges = [],
  items = [],
  coins = 0,
  isNuzlocke = false,
  isRandomizer = false,
  monoType = null,
  activeMega = false,
  activeTerastal = false,
  activeItemBoost = 0,
  activeWeather = null,
  teamFatigued = false,
  onOpenBox,
}) {
  const abilities = computeTeamAbilities(team);
  const statsById = useTeamStats(team);
  const baseTeamPower = computeTeamPower(team, statsById);
  const itemBoost = activeItemBoost || 0;
  const megaMult = activeMega ? 1.3 : 1.0;
  const fatigueMult = computeFatigueMultiplier(teamFatigued);
  // Approssimazione: qui non conosciamo il tipo dell'avversario né il tipo
  // Tera estratto in BattleScene, quindi mostriamo il caso base +25% (il
  // valore reale in battaglia può salire a +35% o scendere a +10% in base
  // al type-matchup, vedi computeTeraEffect in engine/typeMatchup.js).
  const teraMult = activeTerastal ? 1.25 : 1.0;
  const weatherMult = computeWeatherEffect(team, activeWeather).multiplier;
  const teamPower = Math.round((baseTeamPower + itemBoost) * megaMult * teraMult * weatherMult * fatigueMult);
  const bonusDiff = teamPower - baseTeamPower;

  // Griglia 2x3 fissa con 6 slot
  const gridSlots = [0, 1, 2, 3, 4, 5].map((i) => team[i] || null);

  return e(
    "div",
    { className: "panel side-panel" },

    // Pokédollari Badge
    e(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
          background: "rgba(251, 191, 36, 0.12)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.85rem",
          fontWeight: "bold",
          color: "var(--gold-light)",
        },
      },
      e("span", null, "💰 Pokédollari:"),
      e("span", null, `${coins} 💰`)
    ),

    // Potenza Squadra Badge
    e(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          background: bonusDiff > 0 ? "rgba(168, 85, 247, 0.18)" : "rgba(56, 189, 248, 0.12)",
          border: bonusDiff > 0 ? "1px solid rgba(168, 85, 247, 0.5)" : "1px solid rgba(56, 189, 248, 0.3)",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.85rem",
          fontWeight: "bold",
          color: bonusDiff > 0 ? "var(--mega-light)" : "var(--tera-light)",
          boxShadow: bonusDiff > 0 ? "0 2px 8px rgba(168, 85, 247, 0.25)" : "none",
        },
      },
      e("span", null, "⚡ Potenza Squadra:"),
      e(
        "span",
        null,
        `⚡ ${teamPower}`,
        bonusDiff > 0 && e("span", { style: { fontSize: "0.72rem", marginLeft: "4px", color: "#f472b6" } }, `(+${bonusDiff})`)
      )
    ),

    // Challenge Badges
    e(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" } },
      isNuzlocke && e(
        "div",
        {
          className: "nuzlocke-badge-panel badge-status",
          style: { background: "linear-gradient(135deg, var(--danger), var(--danger-dark))" },
        },
        "💀 NUZLOCKE HARDCORE"
      ),
      isRandomizer && e(
        "div",
        {
          className: "badge-status",
          style: { background: "linear-gradient(135deg, #7e22ce, #581c87)", color: "var(--mega-light)" },
        },
        "🎲 RANDOMIZER CAOS MODE"
      ),
      monoType && e(
        "div",
        {
          className: "badge-status",
          style: { background: "linear-gradient(135deg, #b45309, #78350f)", color: "#fef3c7" },
        },
        `🎯 MONO-TIPO: ${monoType.toUpperCase()}`
      ),
      activeWeather && e(
        "div",
        {
          className: "badge-status",
          style: { background: "linear-gradient(135deg, #0e7490, #164e63)", color: "#cffafe" },
          title: "Attivo per la prossima battaglia",
        },
        `${activeWeather.icon} METEO: ${activeWeather.name.toUpperCase()}`
      ),
      teamFatigued && e(
        "div",
        {
          className: "badge-status",
          style: { background: "linear-gradient(135deg, var(--danger), var(--danger-dark))" },
          title: "Passa dal Centro Pokémon per rimuovere il malus",
        },
        "😓 SQUADRA AFFATICATA (-10% Potenza)"
      )
    ),

    // Titolo Squadra
    e("h2", null, `La tua squadra (${team.length}/6)`),

    // Griglia 2x3 Perfetta
    e(
      "div",
      { className: "team-matrix-grid" },
      gridSlots.map((p, idx) => e(TeamGridSlot, { key: `grid-slot-${idx}`, pokemon: p, activeMega }))
    ),

    // Sezione Abilità Passive Attive
    abilities.length > 0 &&
      e(
        "div",
        { style: { marginTop: "8px" } },
        e("span", { style: { fontSize: "0.75rem", fontWeight: "bold", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "🌟 Abilità Attive:"),
        e(
          "div",
          { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" } },
          abilities.map((ab, idx) =>
            e(
              TapTooltip,
              {
                key: `${ab.name}-${idx}`,
                text: ab.description,
                className: "info-chip",
                style: {
                  background: "rgba(251, 191, 36, 0.15)",
                  border: "1px solid rgba(251, 191, 36, 0.4)",
                  color: "var(--gold-light)",
                  cursor: "help",
                },
              },
              `${ab.icon} ${ab.name}`
            )
          )
        )
      ),

    // Sezione Box
    e(
      "div",
      { className: "team-panel-box-row" },
      e("h2", { style: { marginTop: "16px" } }, `Box (${(box || []).length})`),
      box && box.length > 0 &&
        e(
          "button",
          { className: "box-open-btn", onClick: onOpenBox },
          "Gestisci →"
        )
    ),
    !box || box.length === 0
      ? e("p", { className: "empty-hint" }, "Box vuoto.")
      : e(
          "div",
          { className: "team-list" },
          box.slice(0, 3).map((p, idx) => e(PokemonChip, { key: `box-${p.id}-${idx}`, id: p.id, level: p.level, isShiny: p.isShiny }))
        ),
    box && box.length > 3 &&
      e("p", { className: "empty-hint", style: { fontSize: "0.75rem" } }, `...e altri ${box.length - 3} nel box`),

    // Medaglie
    e("h2", { style: { marginTop: "16px" } }, "Medaglie"),
    badges.length === 0
      ? e("p", { className: "empty-hint" }, "Nessuna medaglia ancora.")
      : e(
          "div",
          { className: "badge-visual-list" },
          badges.map((b, idx) => e(BadgeItem, { key: `${b}-${idx}`, name: b }))
        ),

    // Zaino
    e("h2", { style: { marginTop: "16px" } }, "Zaino"),
    !items || items.length === 0
      ? e("p", { className: "empty-hint" }, "Zaino vuoto.")
      : e(
          "ul",
          { className: "inventory-list" },
          groupItemsByName(items).map(({ name, count }) => {
            const desc = getItemDescription(name);
            const label = count > 1 ? `${name} x${count}` : name;
            return e(
              "li",
              {
                key: name,
                className: "inventory-item-row",
                title: `${name}: ${desc}`,
              },
              e("span", { className: "inventory-item-name" }, e(ItemIcon, { name }), ` ${label}`),
              e("span", { className: "inventory-item-tooltip" }, desc)
            );
          })
        )
  );
}
