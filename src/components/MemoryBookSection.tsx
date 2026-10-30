import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, X, Heart, Star } from 'lucide-react';
import { BIRTHDAY_CONFIG, GalleryPhoto } from '../data/birthdayContent';
import { usePhotos } from '../hooks/usePhotos';
import { PhotoAlbum3D } from './PhotoAlbum3D';
import { LightboxModal } from './LightboxModal';
import { playAlbumOpenSound } from '../utils/audioEffects';

export const MemoryBookSection: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const { photos } = usePhotos();
  const { recipient } = BIRTHDAY_CONFIG;

  // Handle escape key to close the magical memory book
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenModal && !selectedPhoto) {
        setIsOpenModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenModal, selectedPhoto]);

  const handleOpenBook = () => {
    playAlbumOpenSound();
    setIsOpenModal(true);
  };

  const handleCloseBook = () => {
    setIsOpenModal(false);
  };

  return (
    <div id="memory-book-trigger" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto text-center relative select-none">
      {/* ============================================================== */}
      {/* INTERACTIVE BUTTON CARD AFTER THE LETTER SECTION               */}
      {/* ============================================================== */}
      <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-white/90 via-[#FFF8FA]/90 to-white/90 border border-rose-200/80 shadow-xl overflow-hidden group">
        {/* Soft background radial glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          {/* Subtle Tag Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-[#925A7A] text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#BD779A]" />
            <span>Interactive Keepsake</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#513E51] font-semibold">
              Kavisha's 3D Memory Book
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
              Having read the letter, step into your personal 3D keepsake album—turn realistic pages, relive memories, and add your own photos.
            </p>
          </div>

          {/* Interactive Magical Trigger Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenBook}
              aria-label="Open Kavisha's 3D Memory Book with magical animation"
              className="relative group/btn inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-4.5 rounded-full bg-gradient-to-r from-[#BD779A] via-[#925A7A] to-[#613652] text-white font-serif text-base sm:text-lg font-medium shadow-[0_12px_30px_-5px_rgba(189,119,154,0.5)] hover:shadow-[0_18px_40px_-5px_rgba(189,119,154,0.65)] hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer overflow-hidden ring-4 ring-rose-200/50 hover:ring-rose-300"
            >
              {/* Sweeping Shimmer Highlight Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              <BookOpen className="w-5 h-5 text-amber-200 transition-transform duration-300 group-hover/btn:rotate-[-6deg]" />
              <span className="tracking-wide">Open Memory Book ✨</span>
              <Heart className="w-4 h-4 text-rose-200 fill-rose-200/80 animate-pulse" />
            </button>
          </div>

          {/* Micro hint */}
          <p className="text-[11px] text-stone-400 font-mono tracking-wide pt-1">
            Tap to open · Realistic 3D pages & upload option inside
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAGICAL ANIMATION OVERLAY & 3D MEMORY BOOK DISPLAY             */}
      {/* ============================================================== */}
      {isOpenModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#23121F]/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-500"
          role="dialog"
          aria-modal="true"
          aria-labelledby="memory-book-modal-title"
        >
          {/* Floating Magical Stardust / Bokeh Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute top-1/4 left-10 text-amber-200/40 text-2xl animate-pulse">✨</div>
            <div className="absolute top-1/3 right-12 text-rose-300/40 text-xl animate-bounce">🌸</div>
            <div className="absolute bottom-1/4 left-1/4 text-pink-200/30 text-lg animate-pulse">✦</div>
            <div className="absolute bottom-1/3 right-1/4 text-amber-200/40 text-2xl animate-pulse">✨</div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-rose-400/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-5xl my-auto animate-in zoom-in-95 duration-500 ease-out flex flex-col items-center">
            {/* Top Modal Navigation Header */}
            <div className="w-full flex items-center justify-between px-3 sm:px-6 py-2 mb-2 text-white">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-amber-200">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h3 id="memory-book-modal-title" className="font-serif text-lg sm:text-xl font-medium tracking-wide text-white drop-shadow-sm">
                  {recipient.name}'s Memory Book
                </h3>
                <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-rose-200">
                  Chapter 19
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseBook}
                aria-label="Close Memory Book"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium border border-white/25 backdrop-blur-xs shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <span>Close Book</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3D Photo Album with autoOpen={true} */}
            <div className="w-full bg-[#FAF6F0]/95 backdrop-blur-sm rounded-3xl p-3 sm:p-6 shadow-2xl border border-white/40">
              <PhotoAlbum3D
                photos={photos}
                autoOpen={true}
                onOpenLightbox={(photo) => setSelectedPhoto(photo)}
                onClose={handleCloseBook}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for full screen inspection of clicked images */}
      <LightboxModal
        photo={selectedPhoto}
        photos={photos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />
    </div>
  );
};
