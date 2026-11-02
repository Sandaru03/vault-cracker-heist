/**
 * Audio Manager for Vault Cracker
 * - BGM: Standard HTML5 Audio with loop for robbery heist soundtrack
 * - SFX: Lightweight Web Audio API beeps for user interaction feedback
 */
class AudioManager {
  constructor() {
    this.sfxEnabled = true;
    this.bgmAudio = null;
    this.isBgmPlaying = false;
    this.ctx = null;
  }

  // Initialize Web Audio Context for SFX (Click, Success, Error)
  initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  // ----------------- SFX (Sound Effects for Inside Game) -----------------
  playClick() {
    if (!this.sfxEnabled) return;
    this.playTone(1000, 0.04);
  }

  playSuccess() {
    if (!this.sfxEnabled) return;
    this.playTone(600, 0.08);
    setTimeout(() => this.playTone(900, 0.12), 90);
  }

  playError() {
    if (!this.sfxEnabled) return;
    this.playTone(200, 0.15, 'sawtooth');
  }

  playTone(freq, duration, type = 'sine') {
    try {
      this.initAudioContext();
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
      // Ignore audio policy restrictions
    }
  }

  // ----------------- BGM (Robbery Heist Background Music) -----------------
  getBgmAudio() {
    if (!this.bgmAudio && typeof window !== 'undefined') {
      this.bgmAudio = new Audio('/audio/heist-bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.35; // Comfortable volume
    }
    return this.bgmAudio;
  }

  startBgm() {
    const audio = this.getBgmAudio();
    if (!audio) return;
    audio.play()
      .then(() => {
        this.isBgmPlaying = true;
      })
      .catch((err) => {
        console.warn('[BGM] Autoplay blocked, waiting for user click:', err);
      });
  }

  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
    }
  }

  toggleBgm() {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }
}

export const cyberAudio = new AudioManager();
