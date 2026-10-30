/**
 * Gentle Web Audio synthesis for realistic tactile interactions (page turns, album clicks)
 * Completely self-contained, no external audio files required.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Realistic crisp paper rustle / page turn sound effect
 */
export function playPageTurnSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = 0.18;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Filtered pinkish noise burst with natural physical decay
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      const envelope = Math.sin((i / bufferSize) * Math.PI) * Math.exp(-i / (ctx.sampleRate * 0.06));
      data[i] = (lastOut * 3 + white * 0.15) * envelope;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter to mimic paper friction
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch {
    // Fail silently if browser blocks autoplay
  }
}

/**
 * Soft chime for opening/closing the photo album
 */
export function playAlbumOpenSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 soft chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + idx * 0.05 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.95);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Magical boom and sparkling celebratory crescendo
 */
export function playBoomSparkleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Deep warm sub-bass pulse
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.6);
    subGain.gain.setValueAtTime(0.2, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.7);

    // Sparkle chime arpeggio
    const sparkles = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    sparkles.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.08 + idx * 0.04);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + 0.08 + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.12 + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6 + idx * 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.08 + idx * 0.04);
      osc.stop(ctx.currentTime + 0.8 + idx * 0.04);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Authentic royal parchment scroll unrolling rustle and ribbon untie
 */
export function playScrollUnrollSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Silk ribbon whoosh / friction
    const duration = 0.55;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = white * env * 0.08;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    // Fail silently
  }
}

/**
 * Very soft, subtle mechanical typewriter key click
 */
let lastClickTime = 0;
export function playTypewriterClick(isParagraphEnd = false) {
  try {
    const now = performance.now();
    // Throttle clicks to avoid audio stacking (min 35ms between clicks)
    if (now - lastClickTime < 35) return;
    lastClickTime = now;

    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    if (isParagraphEnd) {
      // Soft carriage ping / bell chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } else {
      // Subtle key strike click
      const freq = 1200 + Math.random() * 400;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    }
  } catch {
    // Fail silently
  }
}


