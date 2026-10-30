import React from 'react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data/birthdayContent';

interface FinalSectionProps {
  onReplay: () => void;
}

export const FinalSection: React.FC<FinalSectionProps> = ({ onReplay }) => {
  const { ending, recipient } = BIRTHDAY_CONFIG;

  return (
    <footer 
      aria-label="Celebration Ending"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-24 text-center select-none overflow-hidden"
    >
      {/* Dreamy Garden Ambient Glows */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-t from-[#F7DCE8]/40 via-[#DCD3F5]/30 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true" 
      />

      {/* Decorative Blossoms */}
      <div className="flex items-center justify-center gap-3 text-2xl mb-6 opacity-80" aria-hidden="true">
        <span>🌸</span>
        <span>🌿</span>
        <span>🌷</span>
      </div>

      {/* Title */}
      <h2 className="font-serif text-3xl sm:text-5xl text-[#513E51] font-normal tracking-tight text-glow mb-6 leading-tight max-w-2xl flex items-center justify-center gap-2 flex-wrap">
        <span>{ending.title}</span>
        <Heart className="w-8 h-8 text-[#BD779A] fill-rose-300 inline" />
      </h2>

      {/* Paragraphs */}
      <div className="max-w-xl mx-auto space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed font-light mb-10">
        {ending.paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Animated Sequential Lines */}
      <div className="space-y-3 my-6 font-serif italic text-xl sm:text-2xl text-[#925A7A] max-w-md">
        {ending.animatedLines.map((line, idx) => (
          <div 
            key={idx}
            className="transition-all duration-700 hover:text-[#513E51] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#BD779A] shrink-0" />
            <span>{line}</span>
          </div>
        ))}
      </div>

      {/* Final Grand Typography */}
      <div className="my-10 flex items-center justify-center gap-3 flex-wrap">
        <span className="font-serif text-3xl sm:text-5xl md:text-6xl font-semibold tracking-widest text-[#BD779A] text-glow uppercase block">
          {ending.largeText}
        </span>
        <Heart className="w-10 h-10 text-[#BD779A] fill-rose-300 inline" />
      </div>

      {/* Replay Magic Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-rose-50 text-[#925A7A] border border-rose-200 text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#BD779A]" />
          <span>{ending.replayButton}</span>
        </button>
      </div>

      {/* Quiet copyright / sign */}
      <div className="mt-16 text-xs text-stone-400 flex items-center gap-1.5">
        <span>Made with fondness for {recipient.name}’s 19th Birthday</span>
        <span>·</span>
        <span>2026</span>
      </div>
    </footer>
  );
};
