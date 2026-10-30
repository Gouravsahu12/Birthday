import React, { useState } from 'react';
import { Sparkles, Heart, Flame, Gift } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data/birthdayContent';

export const MiniInteractions: React.FC = () => {
  const { miniInteractions } = BIRTHDAY_CONFIG;

  // Interaction 1: Tap to Bloom Flower
  const [bloomIndex, setBloomIndex] = useState<number | null>(null);

  // Interaction 2: 19 Wishes Jar
  const [currentWishIndex, setCurrentWishIndex] = useState<number | null>(null);

  // Interaction 3: Blow Out the Candle
  const [isCandleBlown, setIsCandleBlown] = useState<boolean>(false);

  const handleBloom = () => {
    const next = bloomIndex === null ? 0 : (bloomIndex + 1) % miniInteractions.bloomNotes.length;
    setBloomIndex(next);
  };

  const handleDrawWish = () => {
    const random = Math.floor(Math.random() * miniInteractions.wishes.length);
    setCurrentWishIndex(random);
  };

  const handleBlowCandle = () => {
    setIsCandleBlown(true);
  };

  const handleRelight = () => {
    setIsCandleBlown(false);
  };

  return (
    <section 
      id="interactions-section" 
      aria-labelledby="interactions-heading"
      className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative select-none"
    >
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#F7DCE8] text-[#925A7A] text-xs uppercase tracking-wider font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Delights</span>
        </div>
        <h2 id="interactions-heading" className="font-serif text-3xl sm:text-4xl text-[#513E51]">
          {miniInteractions.sectionTitle}
        </h2>
        <p className="text-sm text-stone-500">
          {miniInteractions.sectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Card 1: Tap-to-Bloom Flower */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 text-center flex flex-col items-center justify-between border border-white/80 shadow-md hover:shadow-xl transition-all duration-300">
          <div>
            <span className="text-[11px] font-semibold text-[#925A7A] uppercase tracking-wider">
              Little Secret 01
            </span>
            <h3 className="font-serif text-2xl text-[#513E51] font-medium mt-1">
              Tap-to-Bloom Flower
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Tap the bud to help it blossom and reveal a warm note.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBloom}
            aria-label="Tap blossom flower"
            className="group relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#FFF0F5] to-[#F5EBF2] border-2 border-rose-200 flex items-center justify-center text-4xl shadow-md transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="transition-transform duration-500 group-hover:rotate-12">
              {bloomIndex !== null ? '🌸' : '🌱'}
            </span>
            {bloomIndex !== null && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500" />
              </span>
            )}
          </button>

          <div className="mt-6 w-full min-h-[60px] flex items-center justify-center p-3 rounded-2xl bg-white/70 border border-rose-100/70 text-xs text-[#513E51] italic">
            {bloomIndex !== null ? (
              <span className="animate-in fade-in zoom-in-95">
                "{miniInteractions.bloomNotes[bloomIndex]}"
              </span>
            ) : (
              <span className="text-stone-400">
                (Tap the bud above to blossom)
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Jar of 19 Birthday Wishes */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 text-center flex flex-col items-center justify-between border border-white/80 shadow-md hover:shadow-xl transition-all duration-300">
          <div>
            <span className="text-[11px] font-semibold text-[#925A7A] uppercase tracking-wider">
              Little Secret 02
            </span>
            <h3 className="font-serif text-2xl text-[#513E51] font-medium mt-1">
              Jar of 19 Wishes
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Pick a wish crafted for your 19th year of life.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDrawWish}
            aria-label="Pick a birthday wish from jar"
            className="group w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#F8F5FF] to-[#FAF3F7] border-2 border-purple-200 flex flex-col items-center justify-center text-3xl shadow-md transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="group-hover:rotate-6 transition-transform">🫙✨</span>
            <span className="text-[10px] font-sans font-semibold text-purple-700 uppercase tracking-widest mt-1">
              Pick Wish
            </span>
          </button>

          <div className="mt-6 w-full min-h-[60px] flex items-center justify-center p-3 rounded-2xl bg-white/70 border border-purple-100/70 text-xs text-[#513E51]">
            {currentWishIndex !== null ? (
              <div className="animate-in fade-in">
                <span className="font-serif text-xs font-semibold text-[#925A7A] block mb-0.5">
                  Wish #{currentWishIndex + 1} of 19
                </span>
                <span className="inline-flex items-center gap-1">
                  <span>{miniInteractions.wishes[currentWishIndex]}</span>
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-300 shrink-0" />
                </span>
              </div>
            ) : (
              <span className="text-stone-400">
                (Click jar to draw a wish)
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Candle for 19 */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 text-center flex flex-col items-center justify-between border border-white/80 shadow-md hover:shadow-xl transition-all duration-300">
          <div>
            <span className="text-[11px] font-semibold text-[#925A7A] uppercase tracking-wider">
              Little Secret 03
            </span>
            <h3 className="font-serif text-2xl text-[#513E51] font-medium mt-1">
              Make a 19th Wish
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Close your eyes, make a wish, and blow out the candle!
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* Candle visual */}
            <div className="relative mb-2">
              {!isCandleBlown ? (
                <div className="flex flex-col items-center animate-bounce duration-1000">
                  <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-400 to-yellow-200 shadow-md shadow-amber-300 animate-pulse" />
                  <div className="w-0.5 h-2 bg-stone-700" />
                </div>
              ) : (
                <div className="h-8 flex items-center justify-center text-xs text-stone-400 animate-in fade-in">
                  💨 ✨
                </div>
              )}
              {/* Candle Body */}
              <div className="w-4 h-12 rounded-t-sm bg-gradient-to-b from-rose-200 to-rose-300 border border-rose-300 shadow-xs flex items-center justify-center text-[9px] font-mono text-rose-800 font-bold">
                19
              </div>
              {/* Little cake base */}
              <div className="w-16 h-6 rounded-b-xl bg-amber-100 border border-amber-200 -mt-1 shadow-xs flex items-center justify-center text-xs">
                🧁
              </div>
            </div>

            <button
              type="button"
              onClick={isCandleBlown ? handleRelight : handleBlowCandle}
              aria-label={isCandleBlown ? "Relight candle" : "Blow out birthday candle"}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                isCandleBlown
                  ? 'bg-rose-100 text-[#925A7A] hover:bg-rose-200'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm hover:scale-105'
              }`}
            >
              {isCandleBlown ? 'Relight Candle 🕯️' : 'Blow Candle 🌬️'}
            </button>
          </div>

          <div className="mt-6 w-full min-h-[60px] flex items-center justify-center p-3 rounded-2xl bg-white/70 border border-amber-100/70 text-xs text-[#513E51]">
            {isCandleBlown ? (
              <span className="text-[#925A7A] font-serif text-sm font-medium animate-in zoom-in-95">
                🎉 Your 19th wish is out in the universe! May it come true!
              </span>
            ) : (
              <span className="text-stone-400">
                (Click blow candle to make your wish)
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
