// Audio cues using browser Web Audio API (no external asset dependencies)
export function playChime(frequency = 880, duration = 0.25, type: OscillatorType = 'sine') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    // Smooth attack and decay
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio cue error:', e);
  }
}

export function playRestCompleteSound() {
  playChime(659.25, 0.15, 'triangle'); // E5
  setTimeout(() => playChime(880, 0.35, 'triangle'), 150); // A5
}

export function playSetCompleteSound() {
  playChime(587.33, 0.12, 'sine'); // D5
  setTimeout(() => playChime(783.99, 0.2, 'sine'), 100); // G5
}

export function playWorkoutFinishSound() {
  playChime(523.25, 0.15, 'triangle'); // C5
  setTimeout(() => playChime(659.25, 0.15, 'triangle'), 120); // E5
  setTimeout(() => playChime(783.99, 0.15, 'triangle'), 240); // G5
  setTimeout(() => playChime(1046.5, 0.4, 'triangle'), 360); // C6
}
