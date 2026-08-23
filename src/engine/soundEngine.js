// Motore Audio 8-bit Retro basato su Web Audio API nativa browser (senza librerie esterne).

let audioCtx = null;
let isMuted = localStorage.getItem("pcq_audio_muted") === "true";

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted() {
  return isMuted;
}

export function toggleAudioMute() {
  isMuted = !isMuted;
  localStorage.setItem("pcq_audio_muted", isMuted ? "true" : "false");
  return isMuted;
}

/**
 * Suona una singola nota 8-bit con frequenza, durata e tipo di onda.
 */
function playNote(freq, durationMs, type = "square", volume = 0.15) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch (e) {
    // Ignora errori di riproduzione audio se il contesto non è attivo
  }
}

// ✨ Jingle Incontro Shiny / Leggendario (Arpeggio brillante)
export function playShinySound() {
  if (isMuted) return;
  const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
  notes.forEach((freq, idx) => {
    setTimeout(() => playNote(freq, 120, "triangle", 0.2), idx * 70);
  });
}

// ⚾ Jingle Cattura Poké Ball (3 note stile Game Boy)
export function playCaptureSound() {
  if (isMuted) return;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, idx) => {
    setTimeout(() => playNote(freq, 150, "square", 0.18), idx * 90);
  });
}

// 🟣 Jingle Master Ball (Effetto cosmico retro)
export function playMasterBallSound() {
  if (isMuted) return;
  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.5]; // A4 -> E6
  notes.forEach((freq, idx) => {
    setTimeout(() => playNote(freq, 140, "sine", 0.22), idx * 60);
  });
}

// 🔮 Jingle Megaevoluzione / Gigamax (Onda ad impulsi energetici)
export function playMegaSound() {
  if (isMuted) return;
  const notes = [220, 330, 440, 660, 880];
  notes.forEach((freq, idx) => {
    setTimeout(() => playNote(freq, 180, "sawtooth", 0.2), idx * 80);
  });
}

// 🏆 Jingle Vittoria in Battaglia (Fanfara a 8-bit)
export function playVictoryJingle() {
  if (isMuted) return;
  const sequence = [
    { freq: 523.25, duration: 120 }, // C5
    { freq: 523.25, duration: 120 }, // C5
    { freq: 523.25, duration: 120 }, // C5
    { freq: 659.25, duration: 300 }, // E5
    { freq: 783.99, duration: 300 }, // G5
    { freq: 1046.5, duration: 500 }, // C6
  ];
  let delay = 0;
  sequence.forEach((item) => {
    setTimeout(() => playNote(item.freq, item.duration, "square", 0.2), delay);
    delay += item.duration + 20;
  });
}

// 🏥 Jingle Centro Pokémon (Trillo iconico di cura a 6 note)
export function playHealJingle() {
  if (isMuted) return;
  const notes = [
    { freq: 659.25, duration: 140 }, // E5
    { freq: 523.25, duration: 140 }, // C5
    { freq: 659.25, duration: 140 }, // E5
    { freq: 880.0, duration: 240 },  // A5
    { freq: 783.99, duration: 240 }, // G5
    { freq: 1046.5, duration: 400 }, // C6
  ];
  let delay = 0;
  notes.forEach((item) => {
    setTimeout(() => playNote(item.freq, item.duration, "triangle", 0.25), delay);
    delay += item.duration + 30;
  });
}

// 🧬 Jingle Evoluzione (Frequenza ascendente)
export function playEvolutionSound() {
  if (isMuted) return;
  for (let i = 0; i < 8; i++) {
    setTimeout(() => playNote(300 + i * 100, 100, "triangle", 0.15), i * 90);
  }
}

// 💀 Jingle Game Over Nuzlocke (Scala minore discendente)
export function playGameOverSound() {
  if (isMuted) return;
  const notes = [440, 415.3, 392, 349.23]; // A4, Ab4, G4, F4
  notes.forEach((freq, idx) => {
    setTimeout(() => playNote(freq, 250, "sawtooth", 0.22), idx * 200);
  });
}

// 🔘 Suono di click sui pulsanti (blip corto)
export function playButtonClickSound() {
  if (isMuted) return;
  playNote(800, 40, "square", 0.08);
}

// 🧪 Suono di utilizzo strumento / cura
export function playItemUseSound() {
  if (isMuted) return;
  playNote(587.33, 90, "sine", 0.15);
  setTimeout(() => playNote(880, 120, "sine", 0.18), 70);
}

// 🔊 Verso ufficiale del Pokémon (file audio reale da PokeAPI/cries, non un
// jingle sintetizzato) — riprodotto a incontro/evoluzione (vedi ROADMAP.md
// Fase 6). Usa l'elemento <audio> nativo, non l'oscillatore Web Audio delle
// altre funzioni di questo file: è un file .ogg vero, non una nota sintetica.
export function playPokemonCry(url) {
  if (isMuted || !url) return;
  try {
    const audio = new Audio(url);
    audio.volume = 0.35;
    audio.play().catch(() => {
      // Riproduzione bloccata (es. autoplay non ancora sbloccato dal
      // browser prima di un'interazione utente) — non è un errore da
      // segnalare, semplicemente quel verso non si sente questa volta.
    });
  } catch {
    // URL non valido o Audio non disponibile: ignora silenziosamente.
  }
}

// 📈 Suono di Level Up della squadra
export function playLevelUpSound() {
  if (isMuted) return;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    setTimeout(() => playNote(freq, 100, "triangle", 0.18), idx * 60);
  });
}
