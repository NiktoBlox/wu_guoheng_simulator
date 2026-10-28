/**
 * WU GUOHENG SIMULATOR - PROCEDURAL WEB AUDIO SOUND ENGINE
 * Fully synthesized sound effects & chiptune background music.
 * Zero external audio files required!
 */

const SoundEngine = (function () {
  let ctx = null;
  let sfxEnabled = true;
  let bgmEnabled = false;
  let bgmInterval = null;
  let bgmStep = 0;

  // Initialize or resume AudioContext on first user interaction
  function getContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  function playTone(freq, type, duration, startTime = 0, gainLevel = 0.15) {
    if (!sfxEnabled) return;
    const c = getContext();
    if (!c) return;

    try {
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + startTime);

      gain.gain.setValueAtTime(gainLevel, c.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(c.currentTime + startTime);
      osc.stop(c.currentTime + startTime + duration);
    } catch (e) {
      console.warn("Audio playTone error", e);
    }
  }

  return {
    toggleSFX() {
      sfxEnabled = !sfxEnabled;
      return sfxEnabled;
    },

    isSFXEnabled() {
      return sfxEnabled;
    },

    isBGMEnabled() {
      return bgmEnabled;
    },

    playClick() {
      playTone(600, "sine", 0.05, 0, 0.08);
    },

    playCoin() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      playTone(987.77, "sine", 0.08, 0, 0.2); // B5
      playTone(1318.51, "sine", 0.25, 0.08, 0.25); // E6
    },

    playBoing() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      try {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.18);
        gain.gain.setValueAtTime(0.2, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.25);
      } catch (e) {}
    },

    playLaser() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      try {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1200, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.22);
        gain.gain.setValueAtTime(0.25, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.22);
      } catch (e) {}
    },

    playSlap() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      try {
        // Noise buffer for punchy slap
        const bufferSize = c.sampleRate * 0.1;
        const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = c.createBufferSource();
        noise.buffer = buffer;
        const gain = c.createGain();
        gain.gain.setValueAtTime(0.3, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.08);
        noise.connect(gain);
        gain.connect(c.destination);
        noise.start();
        noise.stop(c.currentTime + 0.08);
      } catch (e) {}
    },

    playBassDrop() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      try {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, c.currentTime + 0.6);
        gain.gain.setValueAtTime(0.4, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.6);
      } catch (e) {}
    },

    playBuzzer() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      playTone(150, "sawtooth", 0.35, 0, 0.25);
      playTone(140, "sawtooth", 0.35, 0.05, 0.25);
    },

    playLevelUp() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      // Arpeggio C4, E4, G4, C5
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        playTone(freq, "triangle", 0.18, idx * 0.08, 0.25);
      });
    },

    playVictory() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      // Fanfare notes
      const notes = [
        { f: 392.00, t: 0.12, d: 0 },
        { f: 523.25, t: 0.12, d: 0.13 },
        { f: 659.25, t: 0.12, d: 0.26 },
        { f: 783.99, t: 0.45, d: 0.39 }
      ];
      notes.forEach(n => playTone(n.f, "square", n.t, n.d, 0.2));
    },

    playDamage() {
      const c = getContext();
      if (!c || !sfxEnabled) return;
      playTone(120, "sawtooth", 0.15, 0, 0.2);
    },

    toggleBGM() {
      bgmEnabled = !bgmEnabled;
      if (bgmEnabled) {
        this.startBGM();
      } else {
        this.stopBGM();
      }
      return bgmEnabled;
    },

    startBGM() {
      if (bgmInterval) clearInterval(bgmInterval);
      const c = getContext();
      if (!c) return;

      // 16-step catchy chiptune bass & melody
      const melody = [
        261.63, 0, 329.63, 0, 392.00, 523.25, 392.00, 0,
        349.23, 0, 392.00, 0, 440.00, 0, 392.00, 0
      ];

      const bass = [
        130.81, 130.81, 164.81, 164.81, 196.00, 196.00, 196.00, 196.00,
        174.61, 174.61, 196.00, 196.00, 220.00, 220.00, 196.00, 130.81
      ];

      bgmStep = 0;
      bgmInterval = setInterval(() => {
        if (!bgmEnabled) return;
        const curMelody = melody[bgmStep % melody.length];
        const curBass = bass[bgmStep % bass.length];

        if (curMelody > 0) {
          playTone(curMelody, "square", 0.1, 0, 0.05);
        }
        if (curBass > 0) {
          playTone(curBass, "triangle", 0.12, 0, 0.08);
        }
        bgmStep++;
      }, 160);
    },

    stopBGM() {
      if (bgmInterval) {
        clearInterval(bgmInterval);
        bgmInterval = null;
      }
    },

    showEffect(message) {
      const toast = document.getElementById("sound-toast");
      if (!toast) return;
      toast.innerText = message;
      toast.classList.add("show");
      clearTimeout(toast._timeout);
      toast._timeout = setTimeout(() => {
        toast.classList.remove("show");
      }, 1500);
    }
  };
})();
