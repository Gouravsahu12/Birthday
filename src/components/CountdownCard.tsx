import React, { useEffect } from 'react';
import { Lock, Sparkles, Clock, Calendar, Eye } from 'lucide-react';
import { TimeRemaining } from '../utils/countdown';
import { BIRTHDAY_CONFIG } from '../data/birthdayContent';

interface CountdownCardProps {
  timeRemaining: TimeRemaining;
  onPreviewUnlock: () => void;
  isPreviewMode?: boolean;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({
  timeRemaining,
  onPreviewUnlock,
  isPreviewMode = false,
}) => {
  const { preBirthday, recipient } = BIRTHDAY_CONFIG;

  // When countdown hits 00:00:00, trigger fireworks reveal transition immediately
  useEffect(() => {
    if (timeRemaining.isUnlocked) {
      onPreviewUnlock();
    }
  }, [timeRemaining.isUnlocked, onPreviewUnlock]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center select-none overflow-hidden">
      {/* Soft atmospheric gradient orbs */}
      <div 
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#F7DCE8]/50 blur-3xl pointer-events-none"
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#DCD3F5]/45 blur-3xl pointer-events-none"
        aria-hidden="true" 
      />

      {/* Brand Header */}
      <div className="relative z-10 mb-8 max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#F7DCE8] text-[#925A7A] text-xs uppercase tracking-widest font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#BD779A]" />
          <span>{preBirthday.brandLabel}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#513E51] font-normal tracking-tight text-glow leading-tight">
          {preBirthday.headline}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
          {preBirthday.subhead}
        </p>
      </div>

      {/* Main Glass Countdown Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto glass-panel rounded-3xl p-6 sm:p-9 shadow-2xl border border-white/80 transition-all duration-300">
        {/* Subtle decorative corner flowers */}
        <div className="absolute top-3 left-4 text-xs opacity-60 text-[#BD779A]" aria-hidden="true">
          🌸
        </div>
        <div className="absolute top-3 right-4 text-xs opacity-60 text-[#BD779A]" aria-hidden="true">
          🌷
        </div>

        {/* Card Subheaders */}
        <div className="space-y-1 mb-6 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#925A7A] uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>{preBirthday.cardHeading}</span>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-medium text-[#513E51]">
            {recipient.birthdayDateFormatted} · {recipient.turningAge}th birthday
          </p>
        </div>

        {/* Four Count Units */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
          {/* Days */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/80 border border-[#F7DCE8]/80 shadow-xs">
            <span 
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#BD779A] tabular-nums"
              data-testid="countdown-days"
            >
              {timeRemaining.formattedDays}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium mt-1">
              Days
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/80 border border-[#F7DCE8]/80 shadow-xs">
            <span 
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#BD779A] tabular-nums"
              data-testid="countdown-hours"
            >
              {timeRemaining.formattedHours}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium mt-1">
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/80 border border-[#F7DCE8]/80 shadow-xs">
            <span 
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#BD779A] tabular-nums"
              data-testid="countdown-minutes"
            >
              {timeRemaining.formattedMinutes}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium mt-1">
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/80 border border-[#F7DCE8]/80 shadow-xs">
            <span 
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#925A7A] tabular-nums"
              data-testid="countdown-seconds"
            >
              {timeRemaining.formattedSeconds}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium mt-1">
              Seconds
            </span>
          </div>
        </div>

        {/* Timezone label (hidden per user request) */}
        <div className="hidden items-center justify-center gap-1.5 text-xs text-stone-500 mb-5" aria-hidden="true">
          <Clock className="hidden w-3.5 h-3.5 text-[#BD779A]" />
          <span className="hidden">{preBirthday.timeZoneNote} (Asia/Kolkata)</span>
        </div>

        {/* Locked Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF5F8] border border-[#F7DCE8] text-xs text-[#925A7A] mb-3 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-[#BD779A]" />
          <span>{preBirthday.lockedPill}</span>
        </div>

        <p className="text-xs text-stone-400 italic">
          "{preBirthday.waitingNote}"
        </p>

      </div>

      {/* Footer sign */}
      <div className="relative z-10 mt-8 text-xs text-stone-400 flex items-center gap-1.5">
        <span>Handcrafted with warmth</span>
        <span className="text-rose-300">♥</span>
        <span>for {recipient.name}</span>
      </div>

      {/* Discreet Preview Eye Icon on Bottom Right */}
      <button
        type="button"
        onClick={onPreviewUnlock}
        aria-label="View celebration intro"
        title="View Celebration Intro"
        className="fixed bottom-4 right-4 z-40 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-stone-400 hover:text-[#925A7A] border border-rose-200/60 shadow-sm backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  );
};
