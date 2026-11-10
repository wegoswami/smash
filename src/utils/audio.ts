/**
 * Web Audio API synthesizer for instant tactile sound effects and ambient soundscapes.
 * Completely client-side, zero external audio asset dependencies, zero network latency.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Active ambient nodes
  private ambientGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private fireNode: AudioNode | null = null;
  private bowlInterval: number | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private bgmStep: number = 0;
  private currentStation: 'chill' | 'synthwave' | 'zen' = 'chill';

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public vibrate(pattern: number | number[] = 25) {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Haptics not allowed or unsupported
      }
    }
  }

  // --- SMASH & WEAPONS ---
  public playSmash(tool: 'hammer' | 'crowbar' | 'bat' | 'slap' | 'laser' | 'lightning' = 'hammer') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const now = t;

    if (tool === 'slap') {
      // Crisp whip / slap sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.13);

      // Slap noise burst
      this.playNoiseBurst(0.08, 1200, 0.4);
      this.vibrate(20);
      return;
    }

    if (tool === 'laser') {
      // Sci-fi zap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.22);
      this.vibrate(25);
      return;
    }

    if (tool === 'lightning') {
      // Electric crackle and sub thunder
      this.playNoiseBurst(0.35, 400, 0.8);
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(90, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + 0.4);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      sub.connect(gain);
      gain.connect(this.masterGain);
      sub.start(now);
      sub.stop(now + 0.42);
      this.vibrate([30, 20, 50]);
      return;
    }

    // Heavy blunt impact (Hammer / Crowbar / Bat)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const startFreq = tool === 'crowbar' ? 240 : tool === 'bat' ? 160 : 120;
    subOsc.type = tool === 'crowbar' ? 'triangle' : 'sine';
    subOsc.frequency.setValueAtTime(startFreq, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.25);
    subGain.gain.setValueAtTime(tool === 'hammer' ? 0.9 : 0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.26);

    // Debris crunch / thump
    this.playNoiseBurst(tool === 'hammer' ? 0.18 : 0.12, tool === 'crowbar' ? 2200 : 800, 0.6);

    // Metallic ring for crowbar
    if (tool === 'crowbar') {
      const ping = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(1420, now);
      ping.frequency.exponentialRampToValueAtTime(1100, now + 0.2);
      pingGain.gain.setValueAtTime(0.4, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      ping.connect(pingGain);
      pingGain.connect(this.masterGain);
      ping.start(now);
      ping.stop(now + 0.22);
    }

    this.vibrate(tool === 'hammer' ? 45 : 30);
  }

  // --- CATASTROPHIC SHATTER ---
  public playShatter() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Multitone crystalline shard frequencies
    const freqs = [1850, 2340, 3120, 4200, 5600];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * (1 + (Math.random() * 0.1 - 0.05)), t + idx * 0.015);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.25 + idx * 0.02);
      gain.gain.setValueAtTime(0.35 / freqs.length, t + idx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35 + idx * 0.02);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.015);
      osc.stop(t + 0.4 + idx * 0.02);
    });

    // Glass explosion noise
    this.playNoiseBurst(0.28, 3500, 0.6);
    this.vibrate([40, 20, 60]);
  }

  // --- BUBBLE WRAP POP ---
  public playBubblePop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Subtle pitch randomize for organic popping
    const baseFreq = 420 + Math.random() * 260;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.4, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, t + 0.018);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, t + 0.055);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.07);

    this.vibrate(12);
  }

  // --- PAPER SHREDDER ---
  public playPaperShred() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    // Rhythmic paper tearing noise
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playNoiseBurst(0.09, 1800, 0.35);
      }, i * 70);
    }
    this.vibrate([15, 15, 15, 15]);
  }

  // --- FIRE CRACKLE & BURN ---
  public playFireBurn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.playNoiseBurst(0.4, 900, 0.4);
    // Embers pop
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.frequency.setValueAtTime(900 + Math.random() * 800, now);
        g.gain.setValueAtTime(0.15, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.025);
      }, i * 60 + Math.random() * 40);
    }
  }

  // --- ROCKET WHOOSH ---
  public playRocketLaunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(750, t + 0.6);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.7, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.72);

    this.playNoiseBurst(0.65, 550, 0.5);
    this.vibrate([30, 40, 60]);
  }

  // --- ZEN SINGING BOWL ---
  public playSingingBowl(freq = 256) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Dual oscillator creates organic Tibetan beating frequency
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.012, t); // gentle 2-3Hz interference beat

    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(freq * 2.76, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.08); // soft mallet attack
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.8); // 3.8s resonant decay

    const harmGain = this.ctx.createGain();
    harmGain.gain.setValueAtTime(0.15, t);
    harmGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);

    osc1.connect(gain);
    osc2.connect(gain);
    oscHarmonic.connect(harmGain);
    harmGain.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    oscHarmonic.start(t);
    osc1.stop(t + 4.0);
    osc2.stop(t + 4.0);
    oscHarmonic.stop(t + 2.2);
  }

  // --- ZEN STEEL TONGUE DRUM / HANDPAN ---
  public playTongueDrum(freq: number = 293.66) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Fundamental tone
    const oscMain = this.ctx.createOscillator();
    const gainMain = this.ctx.createGain();
    oscMain.type = 'sine';
    oscMain.frequency.setValueAtTime(freq, t);

    // Metallic overtone partial
    const oscOvertone = this.ctx.createOscillator();
    const gainOvertone = this.ctx.createGain();
    oscOvertone.type = 'sine';
    oscOvertone.frequency.setValueAtTime(freq * 2.756, t);

    // Soft mallet attack
    gainMain.gain.setValueAtTime(0.001, t);
    gainMain.gain.linearRampToValueAtTime(0.55, t + 0.012);
    gainMain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);

    gainOvertone.gain.setValueAtTime(0.001, t);
    gainOvertone.gain.linearRampToValueAtTime(0.2, t + 0.008);
    gainOvertone.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

    oscMain.connect(gainMain);
    oscOvertone.connect(gainOvertone);
    gainMain.connect(this.masterGain);
    gainOvertone.connect(this.masterGain);

    oscMain.start(t);
    oscOvertone.start(t);
    oscMain.stop(t + 2.6);
    oscOvertone.stop(t + 1.0);

    this.vibrate(18);
  }

  // --- PENTATONIC WATER RIPPLE CHIME ---
  public playWaterChime(scaleIndex: number = 0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    // D Major Pentatonic: D4, E4, F#4, A4, B4, D5, E5, F#5, A5
    const pentatonic = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0];
    const freq = pentatonic[Math.abs(scaleIndex) % pentatonic.length];

    const t = this.ctx.currentTime;

    // Upward bubble drip
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.92, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.03);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.85);
  }

  // --- ARCADE GAME SOUNDS ---
  public playSoapSlice() {
    this.playSlice();
  }

  public playSlice() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Fast high-pitch whoosh + sharp slash
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.12);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.13);

    this.playNoiseBurst(0.09, 2800, 0.45);
    this.vibrate(15);
  }

  public playBonk() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.16);

    gain.gain.setValueAtTime(0.85, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.18);

    this.vibrate(25);
  }

  public playCoin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // B-E two-tone arcade chime
    [987.77, 1318.51].forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + idx * 0.08);

      gain.gain.setValueAtTime(0.4, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.22);
    });
  }

  public playBoing() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(380, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.28);

    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.3);

    this.vibrate(20);
  }

  // --- HYDRAULIC PRESS SOUNDS ---
  public playHydraulicHum() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(110, t + 0.25);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  public playHydraulicCrush() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Heavy sub bass thud
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, t);
    subOsc.frequency.exponentialRampToValueAtTime(28, t + 0.45);
    subGain.gain.setValueAtTime(0.9, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(t);
    subOsc.stop(t + 0.46);

    // Crunch metal/debris burst
    this.playNoiseBurst(0.35, 1400, 0.7);
    this.vibrate([60, 30, 80]);
  }

  // --- 3D POP-IT FIDGET SOUND ---
  public playPopIt(row: number = 0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Pleasant musical pitch scale per row
    const rowPitches = [330, 370, 415, 466, 523, 587, 660, 740];
    const baseFreq = rowPitches[Math.abs(row) % rowPitches.length] || 440;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.7, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, t + 0.015);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, t + 0.045);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.06);

    this.vibrate(12);
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.09);

      gain.gain.setValueAtTime(0.5, t + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.09);
      osc.stop(t + idx * 0.09 + 0.38);
    });
  }

  // --- ADVANCED GAME SOUNDS ---
  public playSpinTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  public playSandCrunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Layer 1: Grainy friction
    this.playNoiseBurst(0.12, 2200, 0.45);

    // Layer 2: Soft tactile squish
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.1);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.11);
    this.vibrate(15);
  }

  public playNewtonClick(intensity = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Hard steel sphere strike
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.04);

    gain.gain.setValueAtTime(Math.min(0.8, 0.5 * intensity), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.065);

    // High harmonic metallic resonance
    const ping = this.ctx.createOscillator();
    const pingGain = this.ctx.createGain();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(4800, t);
    pingGain.gain.setValueAtTime(0.18 * intensity, t);
    pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    ping.connect(pingGain);
    pingGain.connect(this.masterGain);
    ping.start(t);
    ping.stop(t + 0.13);

    this.vibrate(Math.round(18 * intensity));
  }

  public playPvpHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.22);
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.23);

    this.playNoiseBurst(0.14, 1200, 0.5);
    this.vibrate([25, 20, 35]);
  }

  public playPetGiggle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const freqs = [587.33, 739.99, 880.0]; // D5, F#5, A5
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.06);
      osc.frequency.linearRampToValueAtTime(f * 1.15, t + i * 0.06 + 0.05);

      gain.gain.setValueAtTime(0.3, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.13);
    });
    this.vibrate(15);
  }

  // --- LO-FI ARCADE BGM SYNTHESIZER ---
  public toggleBgm(): boolean {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return false;

    if (this.isBgmPlaying) {
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
      this.isBgmPlaying = false;
      return false;
    }

    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // 3 Unique Musical Stations
    const stationChords: Record<string, number[][]> = {
      chill: [
        [293.66, 349.23, 440.0, 523.25, 659.25], // Dm9
        [196.0, 293.66, 392.0, 493.88, 659.25],  // G13
        [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9
        [220.0, 329.63, 440.0, 523.25, 659.25],  // Am9
      ],
      synthwave: [
        [130.81, 196.0, 261.63, 392.0], // C3 Arp
        [146.83, 220.0, 293.66, 440.0], // D3 Arp
        [164.81, 246.94, 329.63, 493.88], // E3 Arp
        [174.61, 261.63, 349.23, 523.25], // F3 Arp
      ],
      zen: [
        [261.63, 329.63, 392.0, 523.25], // C major pentatonic
        [293.66, 369.99, 440.0, 587.33], // D pentatonic
        [329.63, 392.0, 493.88, 659.25], // E pentatonic
        [261.63, 392.0, 523.25, 783.99], // C octave
      ],
    };

    const chords = stationChords[this.currentStation] || stationChords.chill;

    this.bgmInterval = window.setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx || !this.masterGain || this.isMuted) return;

      const chordIdx = Math.floor(this.bgmStep / 4) % chords.length;
      const noteIdx = this.bgmStep % 4;
      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx % currentChord.length];

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.currentStation === 'synthwave' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Warm analog vibe
      const peakVol = this.currentStation === 'synthwave' ? 0.07 : 0.12;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(peakVol, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.6);

      this.bgmStep = (this.bgmStep + 1) % 16;
    }, this.currentStation === 'synthwave' ? 200 : 280);

    return true;
  }

  public setStation(station: 'chill' | 'synthwave' | 'zen') {
    this.currentStation = station;
    if (this.isBgmPlaying) {
      this.toggleBgm(); // stop
      this.toggleBgm(); // restart with new station
    }
  }

  public getStation(): string {
    return this.currentStation;
  }

  public getBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // --- AMBIENT SOUND GENERATORS ---
  public toggleRain(enable: boolean, volume = 0.4) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    if (this.rainNode) {
      try {
        (this.rainNode as unknown as { stop: () => void }).stop();
      } catch {
        // ignore
      }
      this.rainNode = null;
    }

    if (!enable) {
      return;
    }

    // Generate looping gentle rain (filtered pink noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.5, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.rainNode = whiteNoise;
  }

  // Helper for synthesized noise bursts
  private playNoiseBurst(duration: number, cutoff: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }
}

export const sound = new SoundEngine();
