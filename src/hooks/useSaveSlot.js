import { useState, useEffect, useRef } from "react";
import {
  saveGame,
  loadGame,
  deleteSave,
  loadAllSlots,
  exportSlotJSON,
  importSlotJSON,
} from "../engine/saveGame.js";

export function useSaveSlot(state, setState, initialState) {
  const [activeSlotId, setActiveSlotId] = useState(1);
  const [slotsData, setSlotsData] = useState(() => loadAllSlots());

  function refreshSlots() {
    setSlotsData(loadAllSlots());
  }

  // Auto-save su activeSlotId ogni volta che lo stato cambia (debounce 600ms)
  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (!state || state.phase === "generationSelect" || state.phase === "resume" || state.phase === "nuzlockeGameOver") return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      saveGame(state, activeSlotId);
      refreshSlots();
    }, 600);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state, activeSlotId]);

  function handleResumeSlot(slotId) {
    const loaded = loadGame(slotId);
    if (loaded) {
      setActiveSlotId(slotId);
      setState({ ...initialState(), ...loaded.state, pokedexOpen: false, boxModalOpen: false });
    }
  }

  function handleNewGameSlot(slotId) {
    deleteSave(slotId);
    setActiveSlotId(slotId);
    refreshSlots();
    setState({ ...initialState(), phase: "generationSelect" });
  }

  function handleDeleteSlot(slotId) {
    deleteSave(slotId);
    refreshSlots();
  }

  function handleExportSlot(slotId) {
    const jsonStr = exportSlotJSON(slotId);
    if (!jsonStr) return;
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pokemon_choice_quest_slot${slotId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportSlot(slotId, jsonContent) {
    const ok = importSlotJSON(slotId, jsonContent);
    if (ok) {
      refreshSlots();
      handleResumeSlot(slotId);
    } else {
      alert("Impossibile importare il salvataggio: file JSON non valido.");
    }
  }

  return {
    activeSlotId,
    setActiveSlotId,
    slotsData,
    refreshSlots,
    handleResumeSlot,
    handleNewGameSlot,
    handleDeleteSlot,
    handleExportSlot,
    handleImportSlot,
  };
}
