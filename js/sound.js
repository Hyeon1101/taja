// Sound Engine using Web Audio API for Hancom Taja Typing Practice

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
    this.volume = 0.4;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmMaster = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stopRunnerBgm();
    return this.enabled;
  }

  // Key press click sound
  playKeyPress() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Mechanical switch click simulation
      const now = this.audioCtx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // Error buzz sound
  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const now = this.audioCtx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(130, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // Line / Sentence complete chime
  playCompleteLine() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      notes.forEach((freq, index) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const startTime = now + index * 0.06;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(this.volume * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // Word Game Explosion sound
  playExplosion() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  _tone(freq, when, dur, type, amp) {
    if (!this.audioCtx || !this.bgmMaster) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(amp, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
    osc.connect(gain);
    gain.connect(this.bgmMaster);
    osc.start(when);
    osc.stop(when + dur);
  }

  _blip(freq, dur, type, amp) {
    this.init();
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.55), now + dur);
      gain.gain.setValueAtTime(this.volume * amp, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playHeal() {
    this._blip(740, 0.08, 'sine', 0.22);
  }

  playDash() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const t = now + i * 0.05;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(this.volume * 0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      });
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playCrash() {
    this._blip(140, 0.22, 'sawtooth', 0.38);
  }

  startRunnerBgm() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    this.stopRunnerBgm();
    this.bgmPlaying = true;

    this.bgmMaster = this.audioCtx.createGain();
    this.bgmMaster.gain.value = this.volume * 0.16;
    this.bgmMaster.connect(this.audioCtx.destination);

    const beat = 60 / 128;
    const lead = [
      523.25, 659.25, 783.99, 659.25,
      880.00, 783.99, 659.25, 587.33,
      523.25, 587.33, 659.25, 783.99,
      698.46, 659.25, 587.33, 523.25
    ];
    const bass = [
      130.81, 0, 196.00, 0,
      164.81, 0, 196.00, 0,
      130.81, 0, 174.61, 0,
      196.00, 174.61, 164.81, 130.81
    ];

    let step = 0;
    const tick = () => {
      if (!this.bgmPlaying || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const i = step % 16;
      if (lead[i]) this._tone(lead[i], now, beat * 0.42, 'triangle', 0.55);
      if (bass[i]) this._tone(bass[i], now, beat * 0.58, 'square', 0.22);
      if (step % 2 === 0) this._tone(1568, now, 0.03, 'square', 0.08);
      step++;
      this.bgmTimer = setTimeout(tick, beat * 1000);
    };
    tick();
  }

  stopRunnerBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmMaster) {
      try { this.bgmMaster.disconnect(); } catch (e) { /* ignore */ }
      this.bgmMaster = null;
    }
  }
}

const soundEngine = new SoundEngine();
