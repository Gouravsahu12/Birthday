import React, { useState } from 'react';
import { Mail, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data/birthdayContent';
import { useTypewriter } from '../hooks/useTypewriter';

export const BirthdayEnvelope: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { letter, recipient } = BIRTHDAY_CONFIG;

  const {
    visibleParagraphs,
    activeParagraphIndex,
    activeSegmentIndex,
    isTyping,
    isComplete,
  } = useTypewriter({
    paragraphs: letter.paragraphs,
    isActive: isOpen,
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section 
      id="letter-section" 
      aria-labelledby="letter-heading"
      className="py-20 px-4 sm:px-6 max-w-4xl mx-auto relative select-none"
    >
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#F7DCE8] text-[#925A7A] text-xs uppercase tracking-wider font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Birthday Letter</span>
        </div>
        <h2 id="letter-heading" className="font-serif text-3xl sm:text-4xl text-[#513E51]">
          {letter.sectionTitle}
        </h2>
        <p className="text-sm text-stone-500">
          {letter.sectionSubtitle}
        </p>
      </div>

      {/* Envelope / Letter Interactive Card */}
      <div className="relative mx-auto max-w-2xl">
        {!isOpen ? (
          /* Closed Wax Seal Envelope */
          <div
            tabIndex={0}
            role="button"
            aria-label="Open wax sealed birthday letter"
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
              }
            }}
            className="group relative h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-[#FFFDFD] to-[#FDF4F7] border border-[#F7DCE8] shadow-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-rose-100/60"
          >
            {/* Top flap diagonal lines */}
            <div className="absolute top-0 left-0 right-0 h-44 border-b border-[#F7DCE8]/90 bg-gradient-to-b from-[#FAF0F4]/80 to-transparent rounded-t-3xl [clip-path:polygon(0_0,100%_0,50%_100%)] pointer-events-none" />

            {/* Glowing Wax Seal Button */}
            <div className="relative z-10 flex flex-col items-center space-y-3">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#925A7A] to-[#BD779A] text-white flex items-center justify-center shadow-lg shadow-[#BD779A]/40 group-hover:scale-110 transition-transform duration-300 border-2 border-white/80">
                <Heart className="w-9 h-9 fill-white/90 text-white" />
                <span className="sr-only">Wax seal with heart emblem</span>
              </div>

              <div className="text-center space-y-1">
                <span className="font-serif text-xl sm:text-2xl text-[#513E51] font-medium tracking-wide flex items-center justify-center gap-1.5">
                  <span>{letter.envelopePrompt}</span>
                  <Heart className="w-4 h-4 text-[#BD779A] fill-rose-300 inline" />
                </span>
                <p className="text-xs text-stone-500">
                  Tap to break the seal and unfold the note
                </p>
              </div>
            </div>

            {/* Corner filigree */}
            <div className="absolute bottom-4 left-6 text-xs text-rose-300 opacity-60 flex items-center gap-1">
              <span>To: {recipient.name}</span>
              <Heart className="w-3 h-3 fill-rose-300 text-rose-400" />
            </div>
            <div className="absolute bottom-4 right-6 text-xs text-rose-300 opacity-60">
              30.10.2026
            </div>
          </div>
        ) : (
          /* Unfolded Parchment Letter */
          <div className="relative bg-[#FFFDF9] rounded-3xl border border-[#F3E7DC] p-8 sm:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Minimal Top Control: Subtle Fold Button */}
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={handleToggle}
                type="button"
                aria-label="Fold back letter into envelope"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] hover:bg-[#F2ECE0] text-stone-500 hover:text-stone-800 text-xs border border-[#E8DEC8] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                <span>Fold</span>
              </button>
            </div>

            {/* Letter Head */}
            <div className="border-b border-[#EFE5D8] pb-6 mb-6">
              <div className="flex items-center justify-between text-xs text-stone-400 font-serif italic mb-2">
                <span>30 October 2026</span>
                <span className="flex items-center gap-1 text-[#BD779A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Nineteen Years
                </span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#513E51]">
                {letter.salutation}
              </h3>
            </div>

            {/* Letter Body Paragraphs (Typewritten) */}
            <div className="space-y-4 text-stone-700 font-sans text-base sm:text-lg leading-relaxed font-light min-h-[220px]">
              {visibleParagraphs.length === 0 && isTyping && (
                <p>
                  <span 
                    className="inline-block w-[2px] h-[1.15em] bg-[#925A7A] align-middle animate-pulse" 
                    aria-hidden="true"
                  />
                </p>
              )}

              {visibleParagraphs.map((para) => {
                const isCurrentPara = isTyping && para.paragraphIndex === activeParagraphIndex;

                return (
                  <p key={para.paragraphIndex}>
                    {para.segments.map((seg, sIdx) => {
                      const isCurrentSegment =
                        isCurrentPara && sIdx === activeSegmentIndex;

                      const renderedContent = (
                        <>
                          {seg.isBold ? (
                            <strong className="font-semibold text-[#513E51]">
                              {seg.text}
                            </strong>
                          ) : seg.isItalic ? (
                            <em className="italic text-[#925A7A] font-serif font-normal">
                              {seg.text}
                            </em>
                          ) : (
                            seg.text
                          )}
                          {/* Blinking Typewriter Cursor at current position */}
                          {isCurrentSegment && isTyping && (
                            <span 
                              className="inline-block w-[2px] h-[1.15em] bg-[#925A7A] ml-0.5 align-middle animate-pulse shadow-xs" 
                              aria-hidden="true"
                            />
                          )}
                        </>
                      );

                      return <React.Fragment key={sIdx}>{renderedContent}</React.Fragment>;
                    })}
                  </p>
                );
              })}
            </div>

            {/* Signoff (Fades in softly as typing finishes or when skipped) */}
            <div
              className={`mt-8 pt-6 border-t border-[#EFE5D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-700 ${
                isComplete ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2 pointer-events-none'
              }`}
            >
              <div>
                <p className="font-serif italic text-base text-stone-500">
                  {letter.signoff}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-script text-3xl sm:text-4xl text-[#925A7A]">
                    {letter.author}
                  </span>
                  <Heart className="w-5 h-5 fill-rose-300 text-[#BD779A] animate-pulse" />
                </div>
              </div>

              {letter.postscript && (
                <div className="text-xs text-stone-400 italic max-w-xs text-left sm:text-right">
                  {letter.postscript}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
