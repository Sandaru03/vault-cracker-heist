// Cyberpunk Web Audio API Sound Synthesizer (No external asset files needed)
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playBeep(freq = 800, type = 'sine', duration = 0.08) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio errors if blocked by browser policy
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    this.playBeep(520, 'sine', 0.1);
    setTimeout(() => this.playBeep(780, 'sine', 0.15), 100);
    setTimeout(() => this.playBeep(1040, 'triangle', 0.2), 220);
  }

  playError() {
    if (!this.enabled) return;
    this.playBeep(220, 'sawtooth', 0.15);
    setTimeout(() => this.playBeep(180, 'sawtooth', 0.25), 120);
  }

  playClick() {
    this.playBeep(1200, 'sine', 0.04);
  }
}

export const cyberAudio = new CyberAudio();

