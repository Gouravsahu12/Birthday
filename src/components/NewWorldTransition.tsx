import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { playBoomSparkleSound } from '../utils/audioEffects';

interface NewWorldTransitionProps {
  onComplete: () => void;
}

interface FlyingWord {
  id: number;
  text: string;
  delay: number; // in seconds
  duration: number; // in seconds
  x: number; // percentage
  y: number; // percentage
  scale: number;
  color: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

const FLYING_WORDS: FlyingWord[] = [
  { id: 1, text: 'Wait...', delay: 0.1, duration: 1.2, x: 50, y: 38, scale: 1.1, color: '#FAD2E1', size: 'md' },
  { id: 2, text: 'WHAT IF...', delay: 0.6, duration: 1.4, x: 45, y: 48, scale: 1.4, color: '#FCE7F3', size: 'lg' },
  { id: 3, text: 'Every memory was just the beginning...', delay: 1.2, duration: 1.5, x: 52, y: 42, scale: 1.1, color: '#E9D5FF', size: 'md' },
  { id: 4, text: 'The dates we never went to...', delay: 1.9, duration: 1.5, x: 48, y: 55, scale: 1.2, color: '#FED7AA', size: 'md' },
  { id: 5, text: 'And all the unspoken words...', delay: 2.6, duration: 1.4, x: 50, y: 36, scale: 1.2, color: '#FBCFE8', size: 'md' },
  { id: 6, text: 'Something big is happening...', delay: 3.2, duration: 1.4, x: 50, y: 52, scale: 1.3, color: '#FDE68A', size: 'lg' },
  { id: 7, text: 'NEW WORLD ✨', delay: 3.8, duration: 1.2, x: 50, y: 50, scale: 1.8, color: '#FFFBEB', size: 'xl' },
];

export const NewWorldTransition: React.FC<NewWorldTransitionProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    playBoomSparkleSound();

    // Climax boom sound at 3.6s
    const soundTimeout = setTimeout(() => {
      playBoomSparkleSound();
    }, 3600);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const sec = (Date.now() - startTime) / 1000;
      setElapsed(sec);

      // Start smooth fade transition at 4.2s (final 800ms)
      if (sec >= 4.2) {
        setIsFadingOut(true);
      }

      // Exactly 5.0 seconds duration, then direct to NEW WORLD page with smooth fade
      if (sec >= 5.0) {
        clearInterval(interval);
        onCompleteRef.current();
      }
    }, 40);

    return () => {
      clearInterval(interval);
      clearTimeout(soundTimeout);
    };
  }, []);

  // Canvas Particle System: Fireworks, Sparkles, and Swirling Petals
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      rotation: number;
      rotSpeed: number;
      isPetal?: boolean;
    }

    const particles: Particle[] = [];
    const colors = ['#FFB5C5', '#FF8DA1', '#FCD34D', '#F472B6', '#E9D5FF', '#FFFFFF', '#F59E0B'];

    const spawnPetal = () => {
      particles.push({
        x: Math.random() * width,
        y: -20,
        vx: (Math.random() - 0.5) * 3 + Math.sin(Date.now() * 0.003) * 2,
        vy: Math.random() * 2.8 + 2.2,
        size: Math.random() * 14 + 8,
        color: Math.random() > 0.4 ? '#FFB5C5' : '#F472B6',
        alpha: Math.random() * 0.5 + 0.5,
        decay: 0.001,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        isPetal: true,
      });
    };

    const createFirework = (bx: number, by: number) => {
      const count = 45;
      const fireworkColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 6 + 3.5;
        particles.push({
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.3 ? fireworkColor : '#FFFBEB',
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
          rotation: 0,
          rotSpeed: 0,
          isPetal: false,
        });
      }
    };

    let lastFireworkTime = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(18, 8, 28, 0.28)';
      ctx.fillRect(0, 0, width, height);

      const now = Date.now();
      if (now - lastFireworkTime > 380) {
        lastFireworkTime = now;
        createFirework(
          width * (0.15 + Math.random() * 0.7),
          height * (0.12 + Math.random() * 0.5)
        );
      }

      if (Math.random() > 0.15) {
        spawnPetal();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.isPetal) {
          p.vx += Math.sin(p.rotation) * 0.05;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          p.vy += 0.07;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (p.alpha <= 0 || p.y > height + 30) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 750ms ease-in-out',
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#12081C] select-none flex items-center justify-center pointer-events-none"
    >
      {/* Background canvas for fireworks and swirling petals */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Radial Energy Pulse in Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-rose-500/15 via-purple-500/20 to-amber-500/15 blur-3xl animate-pulse" />
      </div>

      {/* Kinetic Flying Words */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {FLYING_WORDS.map((item) => {
          const isVisible = elapsed >= item.delay && elapsed < item.delay + item.duration;
          if (!isVisible) return null;

          const progress = (elapsed - item.delay) / item.duration; // 0 to 1
          const currentScale = item.scale * (0.85 + Math.sin(progress * Math.PI) * 0.35);
          const currentOpacity = Math.sin(progress * Math.PI);
          const offsetY = (progress - 0.5) * -45; // float upwards

          const sizeClasses = {
            sm: 'text-xl sm:text-2xl',
            md: 'text-2xl sm:text-4xl',
            lg: 'text-3xl sm:text-5xl',
            xl: 'text-4xl sm:text-7xl font-bold tracking-widest',
          }[item.size];

          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) translateY(${offsetY}px) scale(${currentScale})`,
                opacity: currentOpacity,
                color: item.color,
                textShadow: `0 0 25px ${item.color}, 0 0 50px rgba(255, 181, 197, 0.6)`,
              }}
              className={`font-serif text-center transition-all duration-75 whitespace-nowrap drop-shadow-2xl ${sizeClasses}`}
            >
              {item.text}
            </div>
          );
        })}
      </div>

      {/* Radiant Glow Flash at Climax (around 4.0s - 4.8s) */}
      {elapsed > 4.0 && (
        <div
          style={{ opacity: Math.min(0.85, (elapsed - 4.0) / 0.8) }}
          className="absolute inset-0 bg-gradient-to-t from-transparent via-rose-200/40 to-white/60 pointer-events-none transition-opacity duration-300 z-20"
        />
      )}

      {/* Skip Button */}
      <button
        onClick={() => onCompleteRef.current()}
        type="button"
        className="absolute bottom-6 right-6 z-30 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-xs font-mono backdrop-blur-md border border-white/20 transition-all cursor-pointer pointer-events-auto"
      >
        Skip intro ✨
      </button>
    </div>
  );
};
