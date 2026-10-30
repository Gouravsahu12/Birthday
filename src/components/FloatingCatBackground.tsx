import React from 'react';

interface FloatingGifItem {
  id: string;
  name: string;
  src: string;
  top: string;
  left?: string;
  right?: string;
  sizeClasses: string;
  duration: number; // seconds
  delay: number; // seconds
  driftDirection: 'left-to-right' | 'right-to-left';
  rotation: number;
  label: string;
}

// Randomly placed along the main page journey below the intro/hero section
const BACKGROUND_GIF_ITEMS: FloatingGifItem[] = [
  // Birthday Letter section
  {
    id: 'gif-a',
    name: 'Dancing Kittens A',
    src: '/images/background/A.gif',
    top: '23%',
    left: '1.5%',
    sizeClasses: 'w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48',
    duration: 26,
    delay: 0,
    driftDirection: 'left-to-right',
    rotation: -4,
    label: 'Dancing Duo 🐾',
  },
  {
    id: 'gif-b',
    name: 'Cheering Cats B',
    src: '/images/background/B.gif',
    top: '27%',
    right: '2%',
    sizeClasses: 'w-30 h-30 sm:w-42 sm:h-42 md:w-50 md:h-50',
    duration: 30,
    delay: 2,
    driftDirection: 'right-to-left',
    rotation: 5,
    label: 'Party Crew 🎉',
  },

  // Memory Book section
  {
    id: 'gif-c',
    name: 'Birthday Party Cat C',
    src: '/images/background/C.gif',
    top: '36%',
    left: '2%',
    sizeClasses: 'w-28 h-28 sm:w-38 sm:h-38 md:w-44 md:h-44',
    duration: 28,
    delay: 3,
    driftDirection: 'left-to-right',
    rotation: -5,
    label: 'Party Cat 🎂',
  },
  {
    id: 'gif-d',
    name: 'Birthday Cake Kitten D',
    src: '/images/background/D.gif',
    top: '42%',
    right: '2%',
    sizeClasses: 'w-30 h-30 sm:w-40 sm:h-40 md:w-48 md:h-48',
    duration: 32,
    delay: 4,
    driftDirection: 'right-to-left',
    rotation: 4,
    label: 'Make A Wish 🕯️',
  },

  // Timeline section (chapters 1-19)
  {
    id: 'gif-e',
    name: 'Playful Kitten E',
    src: '/images/background/E.gif',
    top: '51%',
    left: '2%',
    sizeClasses: 'w-24 h-24 sm:w-32 sm:h-32 md:w-38 md:h-38',
    duration: 23,
    delay: 1,
    driftDirection: 'right-to-left',
    rotation: 3,
    label: 'Little Cutie ✨',
  },
  {
    id: 'gif-f',
    name: 'Happy Kitty F',
    src: '/images/background/F.gif',
    top: '60%',
    right: '2%',
    sizeClasses: 'w-30 h-30 sm:w-40 sm:h-40 md:w-46 md:h-46',
    duration: 29,
    delay: 1.5,
    driftDirection: 'left-to-right',
    rotation: 2,
    label: 'Happy Vibes 🌸',
  },
  {
    id: 'gif-g',
    name: 'Dancing Meme Cat G',
    src: '/images/background/G.gif',
    top: '70%',
    left: '2%',
    sizeClasses: 'w-28 h-28 sm:w-38 sm:h-38 md:w-44 md:h-44',
    duration: 27,
    delay: 5,
    driftDirection: 'right-to-left',
    rotation: -4,
    label: 'Dance Time 🎶',
  },

  // Interactions & Secret Letter / Final section
  {
    id: 'gif-h',
    name: 'Vibing Cat H',
    src: '/images/background/H.gif',
    top: '80%',
    right: '2%',
    sizeClasses: 'w-32 h-32 sm:w-42 sm:h-42 md:w-48 md:h-48',
    duration: 34,
    delay: 2.5,
    driftDirection: 'left-to-right',
    rotation: -3,
    label: 'Vibing Cat 😻',
  },
  {
    id: 'gif-i',
    name: 'Joyful Mini Cat I',
    src: '/images/background/I.gif',
    top: '90%',
    left: '2%',
    sizeClasses: 'w-24 h-24 sm:w-32 sm:h-32 md:w-38 md:h-38',
    duration: 25,
    delay: 3.5,
    driftDirection: 'right-to-left',
    rotation: 5,
    label: 'Celebrate 19 🌷',
  },
];

export const FloatingCatBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {BACKGROUND_GIF_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`absolute pointer-events-none transition-transform duration-700 ease-out ${
            item.driftDirection === 'left-to-right'
              ? 'animate-sidewise-drift-lr'
              : 'animate-sidewise-drift-rl'
          }`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            transform: `rotate(${item.rotation}deg)`,
          }}
        >
          {/* Ambient background floater strictly behind foreground content */}
          <div 
            className="relative select-none pointer-events-none opacity-32 transition-opacity duration-500"
            style={{
              // Feathered mask so GIF edges blend smoothly into the ivory/blush backdrop
              WebkitMaskImage: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0.6) 75%, transparent 95%)',
              maskImage: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0.6) 75%, transparent 95%)',
              mixBlendMode: 'multiply',
              filter: 'sepia(8%) saturate(110%) contrast(102%)',
            }}
          >
            <img
              src={item.src}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className={`${item.sizeClasses} object-cover rounded-3xl`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
