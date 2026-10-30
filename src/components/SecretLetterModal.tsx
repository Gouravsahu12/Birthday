import React, { useState } from 'react';
import { Lock, Sparkles, EyeOff, Eye } from 'lucide-react';
import { playAlbumOpenSound } from '../utils/audioEffects';

interface SecretLetterModalProps {
  onUnlockSuccess?: () => void;
}

export const SecretLetterModal: React.FC<SecretLetterModalProps> = () => {
  // Option to unsee: toggles showing the WHAT IF text without any password input
  const [isUnseeActive, setIsUnseeActive] = useState(false);

  const handleToggleUnsee = () => {
    const nextState = !isUnseeActive;
    setIsUnseeActive(nextState);
    if (nextState) {
      playAlbumOpenSound();
    }
  };

  return (
    <section
      id="secret-letter-section"
      aria-label="Secret Easter Egg Section"
      className="pt-4 pb-16 px-4 max-w-2xl mx-auto relative select-none text-center"
    >
      {!isUnseeActive ? (
        /* ============================================================== */
        /* DEFAULT STATE: Subtle easter egg capsule with Unsee option     */
        /* ============================================================== */
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/80 hover:bg-white border border-rose-200/70 hover:border-rose-300 shadow-xs hover:shadow-md transition-all duration-300 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-stone-600 text-left">
            <Lock className="w-3.5 h-3.5 text-[#BD779A] shrink-0" />
            <span className="font-serif italic text-xs sm:text-sm text-[#513E51]">
              The answers to all those question....
            </span>
            <span className="hidden sm:inline text-stone-300" aria-hidden="true">
              ·
            </span>
            <span className="text-[11px] text-[#925A7A]/80 font-serif italic">
              Opens when it was the right time
            </span>
          </div>

          {/* Option to unsee */}
          <button
            type="button"
            onClick={handleToggleUnsee}
            aria-label="Option to unsee"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-[#925A7A] hover:text-[#513E51] border border-rose-200 text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer shrink-0 shadow-2xs"
          >
            <EyeOff className="w-3.5 h-3.5 text-[#BD779A]" />
            <span>Unsee</span>
          </button>
        </div>
      ) : (
        /* ============================================================== */
        /* REVEALED ON UNSEE: Just the text "WHAT IF" (No password input)  */
        /* ============================================================== */
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-white/95 border border-rose-300 shadow-lg shadow-rose-200/40 transition-all duration-300 backdrop-blur-xs animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2.5 text-stone-700">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
            <span className="font-serif font-extrabold tracking-widest text-base sm:text-lg text-[#513E51] text-glow">
              WHAT IF
            </span>
            <span className="hidden sm:inline text-stone-300" aria-hidden="true">
              ·
            </span>
            <span className="text-xs text-[#925A7A] font-serif italic">
              The answers to all those question.... Opens when it was the right time
            </span>
          </div>

          {/* Option to hide back */}
          <button
            type="button"
            onClick={handleToggleUnsee}
            aria-label="Hide WHAT IF"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200 text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer shrink-0 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#BD779A]" />
            <span>Hide</span>
          </button>
        </div>
      )}
    </section>
  );
};
