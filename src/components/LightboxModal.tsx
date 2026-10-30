import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Tag, Edit2, Check, Loader2 } from 'lucide-react';
import { GalleryPhoto } from '../data/birthdayContent';

interface LightboxModalProps {
  photo: GalleryPhoto | null;
  photos: GalleryPhoto[];
  onClose: () => void;
  onSelectPhoto: (photo: GalleryPhoto) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}) => {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSavingTag, setIsSavingTag] = useState(false);

  useEffect(() => {
    if (photo) {
      setTagInput(photo.tag || 'Memory');
      setIsEditingTag(false);
    }
  }, [photo]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else {
      onSelectPhoto(photos[photos.length - 1]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
    } else {
      onSelectPhoto(photos[0]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingTag) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (photo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [photo, onClose, handlePrev, handleNext, isEditingTag]);

  const handleSaveTag = async () => {
    if (!photo) return;
    setIsSavingTag(true);
    try {
      const res = await fetch('/api/update-photo-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoId: photo.id,
          tag: tagInput.trim() || 'Memory',
        }),
      });
      const data = await res.json();
      if (data.success) {
        photo.tag = tagInput.trim() || 'Memory';
        window.dispatchEvent(new CustomEvent('photos-updated'));
        setIsEditingTag(false);
      } else {
        alert(data.error || 'Failed to update tag');
      }
    } catch (err) {
      console.error('Failed to update tag:', err);
      alert('Error saving tag');
    } finally {
      setIsSavingTag(false);
    }
  };

  if (!photo) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      {/* Click outside backdrop to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative z-10 w-full max-w-2xl bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close photo preview"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center border border-rose-100 transition-transform hover:scale-105 cursor-pointer z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          type="button"
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center border border-rose-100 transition-transform hover:scale-105 cursor-pointer z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Display Frame */}
        <div className="flex flex-col items-center text-center">
          <div className="w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-tr from-[#FFF5F8] via-[#F8F5FF] to-[#F2FAF6] border border-[#F7DCE8] flex flex-col items-center justify-center p-4 mb-4 relative overflow-hidden shadow-inner">
            {photo.src ? (
              <img
                src={photo.src}
                alt={photo.title || 'Memory Photo'}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-100/70 text-[#925A7A] flex items-center justify-center text-3xl mx-auto shadow-2xs">
                  🌸
                </div>
                <div>
                  <p className="font-serif text-2xl text-[#513E51] font-medium">
                    {photo.placeholderLabel || photo.title}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Image placeholder for Kavisha's memory
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details & Tag Section */}
          <div className="space-y-3 max-w-lg w-full">
            {/* Tag Badge & Inline Editor */}
            <div className="flex flex-col items-center justify-center gap-2">
              {!isEditingTag ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#925A7A] text-xs font-semibold shadow-2xs">
                    <Tag className="w-3 h-3 text-[#BD779A]" />
                    <span>{photo.tag || 'Memory'}</span>
                  </span>

                  {/* Edit Tag button */}
                  <button
                    type="button"
                    onClick={() => {
                      setTagInput(photo.tag || 'Memory');
                      setIsEditingTag(true);
                    }}
                    title="Edit tag"
                    className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-[#BD779A] px-2 py-0.5 rounded-full hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>Edit Tag</span>
                  </button>

                  <span className="text-xs text-stone-400 font-mono ml-2">
                    {currentIndex + 1} of {photos.length}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-rose-50/80 p-1.5 rounded-xl border border-rose-200 animate-in fade-in">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter custom tag..."
                    maxLength={30}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTag();
                      if (e.key === 'Escape') setIsEditingTag(false);
                    }}
                    className="px-2 py-1 text-xs bg-white border border-rose-200 rounded-md text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#BD779A]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveTag}
                    disabled={isSavingTag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#BD779A] hover:bg-[#A86487] text-white text-xs font-medium cursor-pointer disabled:opacity-50"
                  >
                    {isSavingTag ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingTag(false)}
                    className="px-2 py-1 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Curated description text ONLY for the first 6 images (indexes 0 to 5) */}
            {/* For all photos after the first 6: no title, no description text, ONLY image and tag! */}
            {currentIndex >= 0 && currentIndex < 6 && (
              <div className="space-y-1.5 pt-1">
                {photo.title && (
                  <h2 id="lightbox-title" className="font-serif text-xl sm:text-2xl text-[#513E51] font-medium">
                    {photo.title}
                  </h2>
                )}

                {photo.caption && (
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    "{photo.caption}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
