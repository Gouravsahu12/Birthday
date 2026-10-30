import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { BIRTHDAY_CONFIG, SlideshowPhoto } from '../data/birthdayContent';

interface HeroSectionProps {
  onScrollToTimeline?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToTimeline }) => {
  const { hero, recipient, slideshowPhotos } = BIRTHDAY_CONFIG;
  const [slideshowList] = useState<SlideshowPhoto[]>(slideshowPhotos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slideshow with smooth transition one by one (2 sec speed)
  useEffect(() => {
    if (isPaused || slideshowList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowList.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isPaused, slideshowList.length]);

  // Adjust current index if slideshow list length changes
  useEffect(() => {
    if (currentIndex >= slideshowList.length && slideshowList.length > 0) {
      setCurrentIndex(0);
    }
  }, [slideshowList.length, currentIndex]);

  const handleScrollDown = () => {
    if (onScrollToTimeline) {
      onScrollToTimeline();
    } else {
      const target = document.getElementById('letter-section') || document.getElementById('timeline-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      id="hero-section" 
      aria-label="Birthday Hero"
      className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-16 text-center select-none"
    >
      {/* Background Soft Glows */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#F7DCE8]/40 via-[#DCD3F5]/30 to-[#DDEFE6]/30 blur-3xl -z-10 pointer-events-none"
        aria-hidden="true" 
      />

      {/* Floating Decorative Flowers Top-Left & Top-Right */}
      <div className="absolute top-8 left-8 sm:left-16 hidden sm:block opacity-60 text-2xl rotate-[-12deg]" aria-hidden="true">
        🌸
      </div>
      <div className="absolute top-12 right-8 sm:right-16 hidden sm:block opacity-60 text-2xl rotate-[15deg]" aria-hidden="true">
        🌷
      </div>

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#F7DCE8] text-[#925A7A] text-xs font-semibold tracking-widest uppercase mb-6 shadow-xs backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-[#BD779A]" />
        <span>30 October 2026 · Turning 19</span>
        <Heart className="w-3 h-3 text-rose-400 fill-rose-300" />
      </div>

      {/* Main Title */}
      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#513E51] font-normal tracking-tight text-glow max-w-3xl leading-tight mb-5">
        {hero.greeting}
      </h1>

      <p className="font-serif italic text-xl sm:text-2xl text-[#925A7A] max-w-xl mx-auto mb-8 font-light">
        "{hero.subtitle}"
      </p>

      {/* Floating Glass Hero Photo Frame / Extended Tab Showcase */}
      <div className="relative group my-8 sm:my-10">
        {/* Soft frame glow */}
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-rose-200 via-purple-200 to-rose-200 opacity-60 blur-md group-hover:opacity-85 transition duration-500" />

        <div className="relative w-72 sm:w-84 md:w-96 mt-6 sm:mt-8 rounded-3xl glass-panel p-3.5 sm:p-4 flex flex-col items-center justify-between border border-white shadow-xl transition-all duration-500 hover:shadow-2xl overflow-visible">
          {/* Decorative Corner Filigree */}
          <div className="absolute top-3 left-3 text-xs opacity-60 text-[#BD779A] z-20 pointer-events-none">
            <Sparkles className="w-3 h-3 text-[#BD779A]/70" />
          </div>
          <div className="absolute top-3 right-3 text-xs opacity-60 text-[#BD779A] z-20 pointer-events-none">
            <Sparkles className="w-3 h-3 text-[#BD779A]/70" />
          </div>
          <div className="absolute bottom-3 left-3 text-xs opacity-60 text-[#BD779A] z-20 pointer-events-none">
            <Sparkles className="w-3 h-3 text-[#BD779A]/70" />
          </div>
          <div className="absolute bottom-3 right-3 text-xs opacity-60 text-[#BD779A] z-20 pointer-events-none">
            <Sparkles className="w-3 h-3 text-[#BD779A]/70" />
          </div>

          {/* The Tab with Pure Smooth Transitioning Images & Extended Bottom */}
          <div 
            className="w-full h-full rounded-2xl bg-gradient-to-b from-white/95 to-[#FFF6F8]/90 border border-[#F7DCE8]/80 flex flex-col overflow-visible shadow-inner relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top Carousel Image Display Area - Pure Image Transitions Only (no count badge, no eye icon) */}
            <div className="relative -mt-10 sm:-mt-12 -mx-3 sm:-mx-5 w-[calc(100%+1.5rem)] sm:w-[calc(100%+2.5rem)] h-68 sm:h-80 rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-[3px] border-white/95 overflow-hidden z-30 group/image bg-stone-100 transition-transform duration-500 hover:scale-[1.01]">
              {slideshowList.map((photo, index) => {
                const isActive = index === currentIndex;
                return (
                  <div
                    key={photo.id || index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    {photo.src ? (
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className={`w-full h-full object-cover transition-transform duration-2400 ease-out ${
                          isActive ? 'scale-105' : 'scale-100'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50/60 p-4 text-center">
                        <span className="text-4xl mb-2">🌸</span>
                        <p className="text-xs text-stone-500">{photo.title}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Extended at Bottom of the Tab */}
            <div className="w-full pt-4 pb-4 px-4 sm:px-5 bg-white/95 backdrop-blur-md rounded-b-2xl flex flex-col items-center text-center space-y-2 z-20">
              {/* Heading */}
              <div className="flex items-center justify-center gap-2">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#513E51] font-medium tracking-tight">
                  {recipient.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-[10px] text-[#925A7A] uppercase tracking-wider font-semibold">
                  <Sparkles className="w-2.5 h-2.5 text-[#BD779A]" />
                  Chapter 19
                </span>
              </div>

              {/* Line */}
              <p className="font-serif italic text-xs sm:text-[13px] text-[#925A7A] leading-relaxed max-w-xs font-light">
                "Radiance, quiet kindness, and an infectious smile that lights up any room."
              </p>

              {/* Smooth Transition Dots Indicator */}
              <div className="pt-2 flex items-center justify-center gap-1.5 max-w-full overflow-x-auto py-1">
                {slideshowList.map((photo, dotIdx) => (
                  <button
                    key={photo.id || dotIdx}
                    type="button"
                    onClick={() => setCurrentIndex(dotIdx)}
                    aria-label={`Show slide ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer shrink-0 ${
                      dotIdx === currentIndex
                        ? 'w-6 bg-[#BD779A] shadow-xs'
                        : 'w-1.5 bg-rose-200 hover:bg-rose-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Cue CTA */}
      <div className="mt-8 flex items-center justify-center">
        <button
          type="button"
          onClick={handleScrollDown}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 hover:bg-white text-[#513E51] hover:text-[#BD779A] border border-[#F7DCE8] text-xs font-medium tracking-wide shadow-xs backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <span>{hero.scrollCue}</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#BD779A]" />
        </button>
      </div>
    </section>
  );
};
