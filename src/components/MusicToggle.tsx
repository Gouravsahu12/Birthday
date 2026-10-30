import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data/birthdayContent';

export const MusicToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundMode, setSoundMode] = useState<'synth' | 'audio-file' | 'none'>('synth');
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const hasAudioFile = Boolean(BIRTHDAY_CONFIG.audio.src);

  useEffect(() => {
    if (hasAudioFile) {
      setSoundMode('audio-file');
      audioElementRef.current = new Audio(BIRTHDAY_CONFIG.audio.src);
      audioElementRef.current.loop = true;
    } else {
      // We offer a built-in gentle pentatonic ambient chime synth
      setSoundMode('synth');
    }

    return () => {
      stopAudio();
    };
  }, [hasAudioFile]);

  // Soft pentatonic frequencies (G4, A4, C5, D5, E5, G5)
  const notes = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

  const playChimeNote = (ctx: AudioContext, freq: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Soft envelope with slow attack and dreamy decay
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.6);
  };

  const startSynthChimes = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Play initial chord
    playChimeNote(ctx, notes[0]);
    setTimeout(() => playChimeNote(ctx, notes[2]), 400);
    setTimeout(() => playChimeNote(ctx, notes[4]), 800);

    // Schedule gentle intermittent chimes every 2-4 seconds
    const loop = () => {
      if (!audioContextRef.current) return;
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      playChimeNote(audioContextRef.current, randomNote);
      const nextDelay = 1800 + Math.random() * 2200;
      timerRef.current = window.setTimeout(loop, nextDelay);
    };

    timerRef.current = window.setTimeout(loop, 2200);
  };

  const stopAudio = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.suspend();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      if (soundMode === 'audio-file' && audioElementRef.current) {
        audioElementRef.current.play().catch(() => {
          // Fallback to synth if external file cannot be decoded
          startSynthChimes();
        });
      } else {
        startSynthChimes();
      }
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center">
      <button
        onClick={toggleMusic}
        type="button"
        aria-label={isPlaying ? 'Pause background sound' : 'Play soft ambient sound'}
        aria-pressed={isPlaying}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 shadow-sm cursor-pointer ${
          isPlaying
            ? 'bg-[#BD779A] text-white shadow-md shadow-[#BD779A]/20 scale-102'
            : 'bg-white/80 hover:bg-white text-[#513E51] border border-[#F7DCE8] backdrop-blur-md'
        }`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 animate-pulse text-white" />
            <span>Sound: Calm Chimes (On)</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#925A7A]" />
            <span>Sound: Off</span>
          </>
        )}
      </button>
    </div>
  );
};
