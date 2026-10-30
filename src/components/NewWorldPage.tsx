import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Sparkles, Heart, KeyRound, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data/birthdayContent';
import { playBoomSparkleSound, playScrollUnrollSound } from '../utils/audioEffects';
import { useTypewriter } from '../hooks/useTypewriter';

interface NewWorldPageProps {
  onReturnToMain: () => void;
}

export const NewWorldPage: React.FC<NewWorldPageProps> = ({ onReturnToMain }) => {
  const [finalKeyword, setFinalKeyword] = useState('');
  const [isUnrolling, setIsUnrolling] = useState(false);
  const [isUnrolled, setIsUnrolled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { secretLetter } = BIRTHDAY_CONFIG;

  const secretParagraphs = useMemo(
    () => secretLetter.placeholderMessage.split('\n\n').filter(Boolean),
    [secretLetter.placeholderMessage]
  );

  const {
    visibleParagraphs,
    activeParagraphIndex,
    activeSegmentIndex,
    isTyping,
    restart,
  } = useTypewriter({
    paragraphs: secretParagraphs,
    isActive: isUnrolled,
  });

  const handleUnlockFinal = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = finalKeyword.trim().toLowerCase();

    if (!clean) {
      setErrorMessage('Enter the secret keyword to unroll the letter...');
      return;
    }

    if (clean === 'attachment') {
      setErrorMessage('');
      triggerUnrollSequence();
    } else {
      setErrorMessage('Incorrect keyword. Remember what binds us...');
    }
  };

  const triggerUnrollSequence = () => {
    // 1. Play boom and unroll sounds
    playBoomSparkleSound();
    playScrollUnrollSound();

    // 2. Trigger visual boom confetti & ribbon animation
    setIsUnrolling(true);
    setShowConfetti(true);

    setTimeout(() => {
      setIsUnrolled(true);
      setIsUnrolling(false);
    }, 1200);

    // Stop confetti burst after 4s
    setTimeout(() => {
      setShowConfetti(false);
    }, 4500);
  };

  const handleRollBack = () => {
    playScrollUnrollSound();
    setIsUnrolled(false);
    setIsUnrolling(false);
    setFinalKeyword('');
    setErrorMessage('');
    restart();
  };

  // Canvas Confetti Effect
  useEffect(() => {
    if (!showConfetti) return;
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      rotation: number;
      rotSpeed: number;
    }

    const particles: Particle[] = [];
    const colors = ['#FFB5C5', '#F59E0B', '#F472B6', '#E9D5FF', '#FCD34D', '#FFFFFF', '#BE185D'];

    // Spawn 120 explosion confetti particles from center
    const centerX = width / 2;
    const centerY = height * 0.45;

    for (let i = 0; i < 140; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98;
        p.alpha -= 0.009;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();

        if (p.alpha <= 0 || p.y > height) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [showConfetti]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#13081E] via-[#200E2C] to-[#0E0617] text-white relative overflow-x-hidden selection:bg-rose-400 selection:text-white pb-20">
      {/* Background Starlight & Ambient Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-rose-500/10 blur-[130px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-[110px]" />
      </div>

      {/* Confetti Overlay */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Top Header Navigation */}
      <header className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <button
          onClick={onReturnToMain}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-xs font-mono tracking-wider backdrop-blur-md border border-white/20 transition-all hover:scale-105 cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Celebration</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 text-xs font-serif tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Secret Realm</span>
        </span>
      </header>

      {/* Main Container */}
      <main className="relative z-20 max-w-3xl mx-auto px-4 sm:px-6 pt-4 text-center">
        {/* Page Title */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-block mb-2">
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-rose-300/80">
              Dimensional Gateway
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-rose-200 via-amber-100 to-rose-300 bg-clip-text text-transparent drop-shadow-lg mb-3">
            NEW WORLD
          </h1>

          <p className="font-serif text-sm sm:text-base text-rose-200/70 max-w-md mx-auto italic font-light">
            A sanctuary crafted beyond time, where unspoken thoughts take flight.
          </p>
        </div>

        {/* ============================================================== */}
        {/* THE ROYAL SCROLL WITH ROLL & SILK RIBBON                       */}
        {/* ============================================================== */}
        <div className="relative mx-auto my-6 max-w-2xl select-none">
          {!isUnrolled ? (
            /* ============================================================ */
            /* 1. CLOSED ROLLED SCROLL WITH SILK RIBBON & WAX SEAL          */
            /* ============================================================ */
            <div className="flex flex-col items-center">
              {/* The Rolled Parchment Scroll Object */}
              <div
                className={`relative w-80 sm:w-96 transition-all duration-700 ${
                  isUnrolling ? 'scale-110 opacity-70 filter blur-xs' : 'hover:scale-[1.02]'
                }`}
              >
                {/* Top Wooden Rod with Golden Finials */}
                <div className="relative h-7 rounded-full bg-gradient-to-r from-[#5C3A21] via-[#8B5A2B] to-[#5C3A21] shadow-2xl border border-amber-900/60 flex items-center justify-between px-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md border border-amber-200" />
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md border border-amber-200" />
                </div>

                {/* Rolled Cylinder Paper Roll */}
                <div className="relative h-28 my-[-4px] mx-3 rounded-xl bg-gradient-to-b from-[#F2E5D0] via-[#FCF5E8] to-[#E5D4BC] shadow-2xl border-x-4 border-amber-900/40 flex items-center justify-center overflow-hidden">
                  {/* Parchment creasing texture */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute inset-x-0 top-3 h-px bg-amber-900/15" />
                  <div className="absolute inset-x-0 bottom-3 h-px bg-amber-900/15" />

                  {/* Horizontal Silk Crimson Ribbon */}
                  <div
                    className={`absolute inset-x-0 h-10 bg-gradient-to-r from-[#991B1B] via-[#E11D48] to-[#991B1B] shadow-lg flex items-center justify-center transition-all duration-500 ${
                      isUnrolling ? '-translate-y-16 opacity-0 rotate-12 scale-125' : ''
                    }`}
                  >
                    <div className="absolute inset-x-0 top-1 h-px bg-white/30" />
                    <div className="absolute inset-x-0 bottom-1 h-px bg-black/30" />

                    {/* Ribbon Bow & Tails */}
                    <div className="absolute -top-3 w-10 h-7 bg-[#E11D48] rounded-full shadow-md flex items-center justify-center border border-rose-300/40">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                    </div>

                    {/* Golden Wax Seal on Ribbon */}
                    <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-700 shadow-2xl border-2 border-yellow-200/80 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-amber-800/40 flex items-center justify-center bg-gradient-to-tr from-amber-600 to-yellow-500 shadow-inner">
                        <span className="font-serif text-lg font-bold text-amber-950 drop-shadow-xs">
                          K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Wooden Rod with Golden Finials */}
                <div className="relative h-7 rounded-full bg-gradient-to-r from-[#5C3A21] via-[#8B5A2B] to-[#5C3A21] shadow-2xl border border-amber-900/60 flex items-center justify-between px-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md border border-amber-200" />
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md border border-amber-200" />
                </div>
              </div>

              {/* Final Keyword Input Box Below the Scroll */}
              <div className="mt-8 w-full max-w-md p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-center">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-5 h-5 text-amber-300" />
                </div>

                <h2 className="font-serif text-xl sm:text-2xl text-white font-bold mb-1">
                  The Final Sealed Letter
                </h2>

                <p className="text-xs font-mono text-rose-200/80 mb-5">
                  Enter the final keyword to unroll the secret letter
                </p>

                <form onSubmit={handleUnlockFinal} className="space-y-4">
                  <input
                    type="password"
                    value={finalKeyword}
                    onChange={(e) => {
                      setFinalKeyword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter final keyword..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white text-sm text-center placeholder:text-stone-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all shadow-inner"
                  />

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 animate-in fade-in">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:via-rose-400 hover:to-purple-500 text-white text-sm font-semibold tracking-wider shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Unroll Letter 🎀</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* 2. FULLY UNROLLED ROYAL PARCHMENT SCROLL LETTER              */
            /* ============================================================ */
            <div className="relative text-left animate-in fade-in zoom-in-95 duration-700">
              {/* Top Wooden Dowel Rod */}
              <div className="relative h-6 sm:h-7 rounded-full bg-gradient-to-r from-[#5C3A21] via-[#8B5A2B] to-[#5C3A21] shadow-xl border border-amber-900/60 flex items-center justify-between px-2 mb-[-6px] z-20">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md border border-amber-200" />
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md border border-amber-200" />
              </div>

              {/* Unrolled Antique Parchment Canvas */}
              <div className="relative bg-[#FAF4E6] text-[#3B2618] rounded-b-lg p-7 sm:p-12 shadow-2xl border-x-4 border-amber-900/30 overflow-hidden">
                {/* Parchment Paper Texture & Watermark */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F2E5D0]/40 via-transparent to-[#EADBCE]/50 pointer-events-none" />
                <div className="absolute inset-0 border-8 border-double border-amber-900/10 pointer-events-none m-3 rounded-sm" />

                {/* Golden Floral Corners */}
                <div className="absolute top-5 left-5 text-amber-800/20 text-2xl select-none pointer-events-none">
                  ❦
                </div>
                <div className="absolute top-5 right-5 text-amber-800/20 text-2xl select-none pointer-events-none">
                  ❧
                </div>
                <div className="absolute bottom-5 left-5 text-amber-800/20 text-2xl select-none pointer-events-none">
                  ❧
                </div>
                <div className="absolute bottom-5 right-5 text-amber-800/20 text-2xl select-none pointer-events-none">
                  ❦
                </div>

                {/* Letter Header */}
                <div className="relative z-10 text-center border-b border-amber-800/20 pb-6 mb-6">
                  {/* Discreet Top Action: Roll back button */}
                  <div className="flex items-center justify-end mb-3">
                    <button
                      onClick={handleRollBack}
                      type="button"
                      aria-label="Roll back scroll"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-[#3B2618] text-xs font-medium border border-amber-900/20 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Roll Back</span>
                    </button>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-[#8C3A5A] text-xs font-mono font-medium tracking-widest uppercase border border-rose-200 mb-2">
                    Private & Confidential
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl text-[#3B2618] font-bold tracking-tight">
                    To Kavisha, My Dearest Bestie 🌷
                  </h3>
                  <p className="text-xs text-amber-900/60 font-mono mt-1">
                    30 October 2026 · 19th Birthday
                  </p>
                </div>

                {/* Letter Content (Typewritten) */}
                <div className="relative z-10 font-serif text-base sm:text-lg leading-relaxed text-[#3B2618] font-light space-y-4 min-h-[220px]">
                  {visibleParagraphs.length === 0 && isTyping && (
                    <p className="flex items-center gap-1 text-amber-900/60 italic">
                      <span>Preparing secret letter...</span>
                      <span className="inline-block w-0.5 h-5 bg-[#8C3A5A] animate-pulse ml-1" />
                    </p>
                  )}

                  {visibleParagraphs.map((para) => {
                    const isCurrentPara = isTyping && para.paragraphIndex === activeParagraphIndex;

                    return (
                      <p key={para.paragraphIndex}>
                        {para.segments.map((seg, sIdx) => {
                          const isCurrentSegment =
                            isCurrentPara && sIdx === activeSegmentIndex;

                          return (
                            <React.Fragment key={sIdx}>
                              {seg.isBold ? (
                                <strong className="font-semibold text-[#4A2818]">
                                  {seg.text}
                                </strong>
                              ) : seg.isItalic ? (
                                <em className="italic text-[#8C3A5A] font-serif font-normal">
                                  {seg.text}
                                </em>
                              ) : (
                                seg.text
                              )}
                              {isCurrentSegment && isTyping && (
                                <span
                                  className="inline-block w-[2px] h-[1.15em] bg-[#8C3A5A] ml-0.5 align-middle animate-pulse shadow-xs"
                                  aria-hidden="true"
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </p>
                    );
                  })}
                </div>

                {/* Letter Footer: Wax Seal Signature */}
                <div className="relative z-10 mt-10 pt-6 border-t border-amber-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Golden Wax Seal Emblem */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 via-yellow-400 to-amber-700 shadow-md border-2 border-yellow-200 flex items-center justify-center shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-700 to-yellow-500 flex items-center justify-center text-amber-950 font-serif font-bold text-sm">
                        G♥K
                      </div>
                    </div>
                    <div>
                      <p className="font-serif text-base font-semibold text-[#3B2618]">
                        Forever your bestie, Gourav
                      </p>
                      <p className="text-[11px] text-amber-800/60 font-mono">
                        No reply required — just for you.
                      </p>
                    </div>
                  </div>

                  {/* Roll Back Button */}
                  <button
                    onClick={handleRollBack}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-[#3B2618] text-xs font-medium border border-amber-900/20 transition-all hover:scale-105 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Roll Back Up 🎀</span>
                  </button>
                </div>
              </div>

              {/* Bottom Wooden Dowel Rod */}
              <div className="relative h-6 sm:h-7 rounded-full bg-gradient-to-r from-[#5C3A21] via-[#8B5A2B] to-[#5C3A21] shadow-xl border border-amber-900/60 flex items-center justify-between px-2 mt-[-6px] z-20">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md border border-amber-200" />
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md border border-amber-200" />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
