import React, { useMemo, useState, useEffect } from "react";
import { PokemonPreview } from "./PokemonSprite.js";
import { computeCaptureChance, rollCapture } from "../engine/battleLogic.js";
import { computeTeamAbilities } from "../data/abilities.js";
import { playShinySound, playCaptureSound, playMasterBallSound, playPokemonCry } from "../engine/soundEngine.js";
import { recordEncounter, recordCapture } from "../engine/runRecorder.js";
import { getShinyChance } from "../engine/settings.js";
import { ParticleBurst } from "./ParticleBurst.js";
import { usePokemon } from "../hooks/usePokemon.js";

const e = React.createElement;

/**
 * Scena di incontro con un Pokémon selvatico.
 *
 * props:
 *  - title, text: testo di intro
 *  - pool: array di id tra cui pescare il Pokémon incontrato
 *  - level: livello assegnato al Pokémon se catturato
 *  - isLegendary: bool — se true, restringe le opzioni e abbassa il tasso
 *  - team: Array delle specie in squadra
 *  - onSeen(id, isShiny): chiamata quando il Pokémon è rivelato (per il Pokédex)
 *  - onCaught(id, isShiny): chiamata quando il Pokémon è catturato (per il Pokédex)
 *  - onResolved({ caught, pokemon }): chiamata quando la scena finisce
 *  - pokedexRun: { [id]: { seen, caught, shiny } } — usato per mostrare il badge "già catturato"
 *  - lastEncounterId: id dell'ultimo Pokémon selvatico incontrato (qualunque zona) —
 *    escluso dall'estrazione se il pool ha altre opzioni, per non rivedere subito lo stesso
 */
export function EncounterScene({ title, text, pool = [], level = 4, isLegendary = false, hasMasterBall = false, team = [], pokedexRun = {}, lastEncounterId = null, onSeen, onCaught, onResolved }) {
  const isShiny = useMemo(() => {
    return Math.random() < getShinyChance(isLegendary);
  }, [isLegendary]);

  useEffect(() => {
    if (isShiny || isLegendary) {
      playShinySound();
    }
  }, [isShiny, isLegendary]);

  const safePool = useMemo(() => {
    if (Array.isArray(pool) && pool.length > 0) return pool;
    return [25];
  }, [pool]);

  // Esclude l'ultimo Pokémon incontrato (qualunque zona) se il pool offre
  // altre opzioni, per non rivedere subito lo stesso due volte di fila —
  // ininfluente sui pool a un solo id (leggendari, fossili...), che ripiegano
  // subito sul pool intero.
  const pickableIds = useMemo(() => {
    if (lastEncounterId == null) return safePool;
    const filtered = safePool.filter((id) => id !== lastEncounterId);
    return filtered.length > 0 ? filtered : safePool;
  }, [safePool, lastEncounterId]);

  const wildId = useMemo(() => {
    const id = pickableIds[Math.floor(Math.random() * pickableIds.length)];
    // Notifica Pokédex: visto
    if (onSeen) onSeen(id, isShiny);
    return id;
  }, [pickableIds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    recordEncounter({ pokemonId: wildId, isLegendary, isShiny });
  }, [wildId, isLegendary, isShiny]);

  // Verso ufficiale del Pokémon incontrato (PokeAPI/cries). usePokemon usa
  // la stessa cache in memoria di PokemonPreview qui sotto, quindi non
  // duplica la chiamata di rete già fatta per lo sprite.
  const { data: wildData } = usePokemon(wildId);
  useEffect(() => {
    if (wildData?.cry) playPokemonCry(wildData.cry);
  }, [wildData?.cry]);

  const alreadyCaught = !!pokedexRun[wildId]?.caught;

  const [result, setResult] = useState(null); // { method, success } | null

  // I leggendari hanno un tasso base ridotto e non accettano cibo
  const baseRate = isLegendary ? 0.10 : 0.55;
  const teamAbilities = computeTeamAbilities(team);
  const hasSereneGrace = teamAbilities.some((a) => a.name === "Leggiadria");

  function attemptCapture(method) {
    const chance = computeCaptureChance(method, baseRate, isLegendary, hasSereneGrace);
    const success = rollCapture(chance);
    recordCapture({ method, chance, success, isLegendary, pokemonId: wildId });
    if (success) {
      if (onCaught) onCaught(wildId, isShiny);
      if (method === "masterball") playMasterBallSound();
      else playCaptureSound();
    }
    setResult({ method, success, chance });
  }

  function handleContinue() {
    if (result?.success) {
      onResolved({ caught: true, pokemon: { id: wildId, level, isShiny }, usedMasterBall: result.method === "masterball", wildId });
    } else {
      onResolved({ caught: false, pokemon: null, usedMasterBall: false, wildId });
    }
  }

  return e(
    "div",
    { className: `panel ${isLegendary ? "encounter-legendary" : ""} ${isShiny ? "encounter-shiny" : ""}` },
    result?.success && isShiny && e(ParticleBurst, { type: "sparkle" }),
    e("h2", { className: "scene-title" }, isShiny ? `✨ Incontro Shiny: ${title}` : title),
    e("p", { className: "scene-text" }, isShiny ? "Un bagliore luccicante e speciale appare davanti ai tuoi occhi!" : text),
    isLegendary && e(
      "div",
      { className: "legendary-badge" },
      "⭐ Incontro leggendario — probabilità di cattura ridotta!"
    ),
    e(PokemonPreview, { id: wildId, isShiny, alreadyCaught }),
    !result &&
      e(
        "div",
        { className: "choice-list", style: { marginTop: "16px" } },
        hasMasterBall && e(
          "button",
          { className: "choice-btn master-ball-btn", onClick: () => attemptCapture("masterball"), style: { background: "linear-gradient(135deg, #6b21a8, #3b0764)", color: "#fff", border: "2px solid #a855f7" } },
          e("span", null, "🟣 Lancia una MASTER BALL!"),
          e("span", { className: "choice-hint", style: { color: "#e9d5ff" } }, "Cattura GARANTITA AL 100%! Consuma la tua Master Ball dallo zaino.")
        ),
        e(
          "button",
          { className: "choice-btn", onClick: () => attemptCapture("ball") },
          e("span", null, "Lancia una Poké Ball"),
          e("span", { className: "choice-hint" },
            isLegendary
              ? "Solo il 10% di probabilità — i leggendari non si arrendono facilmente"
              : "Metodo affidabile, probabilità nella media"
          )
        ),
        !isLegendary && e(
          "button",
          { className: "choice-btn", onClick: () => attemptCapture("food") },
          e("span", null, "Prova ad addolcirlo con del cibo"),
          e("span", { className: "choice-hint" }, "Probabilità di successo più alta")
        ),
        e(
          "button",
          { className: "choice-btn", onClick: () => onResolved({ caught: false, pokemon: null, wildId }) },
          e("span", null, "Ignora e prosegui"),
          e("span", { className: "choice-hint" }, "Nessun rischio, ma nessuna cattura")
        )
      ),
    result &&
      e(
        "div",
        { className: `outcome-box ${result.success ? "" : "fail"}` },
        result.success
          ? isShiny
            ? "✨ Incredibile! Hai catturato un Pokémon SHINY rare!"
            : isLegendary
            ? "🌟 Incredibile! Hai catturato il leggendario!"
            : "Cattura riuscita! Il Pokémon si unisce alla tua squadra."
          : isLegendary
          ? "Il leggendario è fuggito nell'oscurità..."
          : "Il Pokémon è riuscito a scappare!",
        e(
          "div",
          null,
          e("button", { className: "continue-btn", onClick: handleContinue }, "Continua")
        )
      )
  );
}
