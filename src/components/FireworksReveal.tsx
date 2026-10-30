import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data/birthdayContent';

interface FireworksRevealProps {
  onEnterWorld: () => void;
  onSkip?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
}

const CELEBRATION_COLORS = [
  '#F7DCE8', // blush pink
  '#BD779A', // dusty rose
  '#925A7A', // deep rose
  '#DCD3F5', // lavender
  '#FCD34D', // golden sparkle
  '#FDE68A', // champagne gold
];

export const FireworksReveal: React.FC<FireworksRevealProps> = ({
  onEnterWorld,
  onSkip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { reveal } = BIRTHDAY_CONFIG;

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles: Particle[] = [];

    const createFirework = (x: number, y: number) => {
      const count = 35;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.008,
          color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
          size: Math.random() * 3 + 2,
        });
      }
    };

    // Trigger initial bursts across top/mid screen
    createFirework(width * 0.3, height * 0.35);
    createFirework(width * 0.7, height * 0.3);
    setTimeout(() => createFirework(width * 0.5, height * 0.25), 400);
    setTimeout(() => createFirework(width * 0.25, height * 0.45), 900);
    setTimeout(() => createFirework(width * 0.75, height * 0.4), 1400);

    // Keep an occasional subtle burst
    const interval = setInterval(() => {
      createFirework(
        Math.random() * width * 0.6 + width * 0.2,
        Math.random() * height * 0.4 + height * 0.15
      );
    }, 1800);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.98; // drag
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden z-20">
      {/* Sparkles Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Skip button for accessibility and quick flow */}
      {onSkip && (
        <button
          onClick={onSkip}
          type="button"
          aria-label="Skip fireworks and open celebration"
          className="fixed top-4 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-stone-500 hover:text-stone-800 text-xs border border-rose-100 transition-colors shadow-2xs"
        >
          <X className="w-3.5 h-3.5" />
          <span>Skip intro</span>
        </button>
      )}

      {/* Main Announcement Card */}
      <div className="relative z-20 max-w-xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/90 animate-in fade-in zoom-in-95 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-purple-100 text-[#925A7A] text-xs font-semibold tracking-wider uppercase mb-6 shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#BD779A]" />
          <span>{reveal.badge}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#513E51] font-semibold tracking-tight text-glow mb-6 leading-tight">
          {reveal.headline}
        </h1>

        <div className="text-stone-600 text-base sm:text-lg leading-relaxed whitespace-pre-line mb-8 max-w-md mx-auto">
          {reveal.subhead}
        </div>

        <button
          type="button"
          onClick={onEnterWorld}
          className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-[#BD779A] to-[#925A7A] hover:from-[#aa6387] hover:to-[#7f4b69] text-white font-medium text-base shadow-lg shadow-[#BD779A]/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#BD779A]"
        >
          <span>{reveal.primaryButton}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
