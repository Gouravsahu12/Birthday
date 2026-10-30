import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Bookmark,
  RotateCcw,
  Camera,
  Upload,
  Check,
  Edit2,
  X,
  Plus,
  Loader2,
} from 'lucide-react';
import { GalleryPhoto } from '../data/birthdayContent';
import { playPageTurnSound, playAlbumOpenSound } from '../utils/audioEffects';

interface PhotoAlbum3DProps {
  photos: GalleryPhoto[];
  onOpenLightbox: (photo: GalleryPhoto) => void;
  autoOpen?: boolean;
  onClose?: () => void;
}

export const PhotoAlbum3D: React.FC<PhotoAlbum3DProps> = ({
  photos,
  onOpenLightbox,
  autoOpen = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Upload state for the last page of the book
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadTag, setUploadTag] = useState<string>('Besties 💕');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Tag editing state for existing photos
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [editedTagText, setEditedTagText] = useState<string>('');
  const [isSavingTag, setIsSavingTag] = useState(false);

  // Quick tag suggestions for Kavisha
  const QUICK_TAGS = ['Besties 💕', 'Campus Days 🌸', 'Pure Laughs 😂', 'Cutest Moment ✨', 'Milestone 🎂', 'Sweet Memory 🌷'];

  // Touch and drag swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number | null>(null);
  const albumContainerRef = useRef<HTMLDivElement | null>(null);

  // 2 photos per page -> 4 items per 2-page spread
  // Total items = existing photos + 1 slot for uploading at the end of the book
  const PHOTOS_PER_SPREAD = 4;
  const totalPhotos = photos.length;
  const totalItems = totalPhotos + 1; // Photos + dedicated upload slot at the very end
  const totalSpreads = Math.max(1, Math.ceil(totalItems / PHOTOS_PER_SPREAD));

  // Determine current spread items (4 slots: 2 on Left page, 2 on Right page)
  const leftIndexTop = currentSpread * PHOTOS_PER_SPREAD;
  const leftIndexBottom = currentSpread * PHOTOS_PER_SPREAD + 1;
  const rightIndexTop = currentSpread * PHOTOS_PER_SPREAD + 2;
  const rightIndexBottom = currentSpread * PHOTOS_PER_SPREAD + 3;

  const leftPageNumber = currentSpread * 2 + 1;
  const rightPageNumber = currentSpread * 2 + 2;

  // Auto-open if prop changed to true
  useEffect(() => {
    if (autoOpen && !isOpen) {
      setIsOpen(true);
    }
  }, [autoOpen, isOpen]);

  // Mouse tilt effect when closed
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 16;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Open & Close handlers
  const handleOpenAlbum = () => {
    playAlbumOpenSound();
    playPageTurnSound();
    setIsOpen(true);
    setTimeout(() => {
      albumContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleCloseAlbum = () => {
    playPageTurnSound();
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Page turn navigation
  const handleNextPage = useCallback(() => {
    if (flipDirection || totalSpreads <= 1) return;
    playPageTurnSound();
    setFlipDirection('next');
    setTimeout(() => {
      setCurrentSpread((prev) => (prev + 1) % totalSpreads);
      setFlipDirection(null);
    }, 400);
  }, [flipDirection, totalSpreads]);

  const handlePrevPage = useCallback(() => {
    if (flipDirection || totalSpreads <= 1) return;
    playPageTurnSound();
    setFlipDirection('prev');
    setTimeout(() => {
      setCurrentSpread((prev) => (prev - 1 + totalSpreads) % totalSpreads);
      setFlipDirection(null);
    }, 400);
  }, [flipDirection, totalSpreads]);

  // Jump straight to the upload spread at the last of the book
  const handleJumpToUpload = () => {
    const uploadSpread = Math.floor(totalPhotos / PHOTOS_PER_SPREAD);
    playPageTurnSound();
    setCurrentSpread(uploadSpread);
  };

  // Keyboard navigation when album is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingPhoto) return; // don't navigate when typing in tag editor
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Escape') {
        handleCloseAlbum();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextPage, handlePrevPage, editingPhoto]);

  // Touch Swipe Handlers for mobile & tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOpen || editingPhoto) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isOpen || editingPhoto || touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Mouse Drag Swipe Handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOpen || editingPhoto) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isOpen || !isDragging.current || dragStartX.current === null || editingPhoto) return;
    const deltaX = e.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
    isDragging.current = false;
    dragStartX.current = null;
  };

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit new photo upload with custom tag
  const handleSaveUpload = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await fetch('/api/upload-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: [
            {
              dataUrl: previewUrl,
              tag: uploadTag.trim() || 'Keepsake Memory',
              title: selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Special Memory',
            },
          ],
          creatorKey: 'kavisha',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUploadSuccess(true);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        window.dispatchEvent(new CustomEvent('photos-updated'));
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(data.error || 'Failed to upload photo.');
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setUploadError('Network error while saving photo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Open tag editor for an existing photo
  const handleOpenTagEditor = (e: React.MouseEvent, photo: GalleryPhoto) => {
    e.stopPropagation();
    setEditingPhoto(photo);
    setEditedTagText(photo.tag || 'Memory');
  };

  // Save updated tag to backend
  const handleSavePhotoTag = async () => {
    if (!editingPhoto) return;
    setIsSavingTag(true);

    try {
      const res = await fetch('/api/update-photo-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoId: editingPhoto.id,
          tag: editedTagText.trim() || 'Memory',
        }),
      });

      const data = await res.json();
      if (data.success) {
        editingPhoto.tag = editedTagText.trim() || 'Memory';
        window.dispatchEvent(new CustomEvent('photos-updated'));
        setEditingPhoto(null);
      } else {
        alert(data.error || 'Failed to update tag.');
      }
    } catch (err) {
      console.error('Error updating tag:', err);
      alert('Network error while updating tag.');
    } finally {
      setIsSavingTag(false);
    }
  };

  // ==============================================================
  // RENDER 1: Reusable 2-images-per-page Photo Mount
  // ==============================================================
  const renderPhotoMount = (
    photo: GalleryPhoto | null,
    index: number,
    rotationClass: string
  ) => {
    if (!photo) return null;

    return (
      <div
        key={photo.id || index}
        onClick={() => onOpenLightbox(photo)}
        className={`relative group/photo p-2 sm:p-2.5 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md border border-stone-200/90 transition-all duration-300 hover:scale-[1.015] cursor-pointer ${rotationClass}`}
        role="button"
        tabIndex={0}
        aria-label={`View photo ${photo.title || index + 1} in full screen`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenLightbox(photo);
          }
        }}
      >
        {/* Vintage Rose Mounting Corners */}
        <div className="absolute -top-1 -left-1 w-3 sm:w-3.5 h-3 sm:h-3.5 border-t-2 border-l-2 border-[#BD779A] rounded-tl-sm pointer-events-none z-20" />
        <div className="absolute -top-1 -right-1 w-3 sm:w-3.5 h-3 sm:h-3.5 border-t-2 border-r-2 border-[#BD779A] rounded-tr-sm pointer-events-none z-20" />
        <div className="absolute -bottom-1 -left-1 w-3 sm:w-3.5 h-3 sm:h-3.5 border-b-2 border-l-2 border-[#BD779A] rounded-bl-sm pointer-events-none z-20" />
        <div className="absolute -bottom-1 -right-1 w-3 sm:w-3.5 h-3 sm:h-3.5 border-b-2 border-r-2 border-[#BD779A] rounded-br-sm pointer-events-none z-20" />

        {/* Decorative Washi Tape */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-3.5 sm:h-4 bg-[#F7DCE8]/90 border border-white shadow-2xs rotate-[-1deg] rounded-xs pointer-events-none z-20" />

        {/* Image Display */}
        <div className="w-full h-36 sm:h-44 md:h-48 rounded-lg overflow-hidden bg-rose-50/60 relative flex items-center justify-center">
          {photo.src ? (
            <img
              src={photo.src}
              alt={photo.title || `Memory ${index + 1}`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover/photo:scale-105"
            />
          ) : (
            <div className="text-center p-3 space-y-1">
              <span className="text-2xl">🌸</span>
              <p className="text-[11px] text-stone-500 font-serif">{photo.title}</p>
            </div>
          )}

          {/* Floating Tag Badge with Edit Trigger on Image */}
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-medium tracking-wide border border-white/20 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-rose-300" />
              <span>{photo.tag || 'Memory'}</span>
            </span>

            {/* Quick Edit Tag Button for user */}
            <button
              type="button"
              onClick={(e) => handleOpenTagEditor(e, photo)}
              title="Edit tag for this photo"
              className="p-1 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-[#BD779A] shadow-xs backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Tap to View Full Screen Icon */}
          <div className="absolute bottom-2 right-2 z-20 p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs transition-transform duration-200 group-hover/photo:scale-110">
            <Maximize2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#BD779A]" />
          </div>
        </div>
      </div>
    );
  };

  // ==============================================================
  // RENDER 2: Dedicated Small Upload Option at Last of the Book
  // ==============================================================
  const renderUploadMount = (rotationClass: string) => {
    return (
      <div
        className={`relative p-3 sm:p-4 bg-gradient-to-br from-[#FFFDF9] via-[#FFF6F9] to-[#FBF8F3] rounded-xl sm:rounded-2xl border-2 border-dashed border-[#BD779A]/60 flex flex-col items-center justify-between min-h-[148px] sm:min-h-[178px] md:min-h-[196px] shadow-sm transition-all duration-300 ${rotationClass}`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploadSuccess ? (
          <div className="my-auto text-center space-y-1.5 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-5 h-5" />
            </div>
            <p className="font-serif text-sm font-semibold text-[#513E51]">
              Saved to Kavisha's Book! 🌸
            </p>
            <p className="text-[10px] text-stone-500">Your photo is now part of the album.</p>
          </div>
        ) : !previewUrl ? (
          /* Initial Upload Prompt */
          <div className="w-full h-full flex flex-col items-center justify-center text-center py-2 space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-100/80 text-[#BD779A] flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <p className="font-serif text-xs sm:text-sm font-semibold text-[#513E51]">
                Add Your Keepsake Photo
              </p>
              <p className="text-[10px] text-stone-500 font-sans max-w-[170px] mx-auto">
                Upload a memory and customize your tag
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BD779A] hover:bg-[#A86487] text-white text-[11px] font-medium shadow-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Choose Photo</span>
            </button>

            {uploadError && (
              <p className="text-[10px] text-rose-500 font-sans max-w-[180px]">{uploadError}</p>
            )}
          </div>
        ) : (
          /* File Selected: Preview & Edit Tag Form */
          <div className="w-full flex flex-col gap-2 py-1">
            <div className="flex items-center gap-2">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-rose-200 shadow-xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-[#925A7A] font-semibold block">
                  Edit Custom Tag
                </span>
                <input
                  type="text"
                  value={uploadTag}
                  onChange={(e) => setUploadTag(e.target.value)}
                  placeholder="e.g. Besties 💕"
                  maxLength={30}
                  className="w-full px-2 py-1 text-[11px] bg-white border border-rose-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#BD779A] font-medium text-stone-800"
                />
              </div>
            </div>

            {/* Quick Tag Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
              {QUICK_TAGS.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setUploadTag(tag)}
                  className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 border cursor-pointer ${
                    uploadTag === tag
                      ? 'bg-[#BD779A] text-white border-[#BD779A]'
                      : 'bg-white/80 text-stone-600 border-rose-100 hover:border-rose-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Save / Cancel Action Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleSaveUpload}
                disabled={isUploading}
                className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 rounded-md bg-[#BD779A] hover:bg-[#A86487] text-white text-[10px] font-medium shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Add to Book</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isUploading}
                className="py-1 px-2 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==============================================================
  // Helper to render whatever belongs in slot (Photo, Upload, or Keepsake)
  // ==============================================================
  const renderSlot = (slotIndex: number, rotationClass: string) => {
    if (slotIndex < totalPhotos) {
      return renderPhotoMount(photos[slotIndex], slotIndex, rotationClass);
    }
    if (slotIndex === totalPhotos) {
      return renderUploadMount(rotationClass);
    }
    // Any remaining slot after upload is a delicate keepsake
    return (
      <div className="relative p-3 sm:p-4 bg-gradient-to-br from-[#FFFDF9] to-[#FFF6F8] rounded-xl sm:rounded-2xl border border-dashed border-rose-200/80 flex flex-col items-center justify-center text-center h-36 sm:h-44 md:h-48 shadow-2xs">
        <span className="text-2xl sm:text-3xl mb-1">🌷</span>
        <p className="font-serif italic text-xs sm:text-sm text-[#925A7A]">A Little Keepsake</p>
        <p className="text-[10px] text-stone-400 font-sans mt-0.5">Memories preserved in time</p>
      </div>
    );
  };

  return (
    <div ref={albumContainerRef} className="w-full flex flex-col items-center select-none py-4">
      {/* ============================================================== */}
      {/* STATE 1: CLOSED 3D PHOTO ALBUM BOOK COVER                      */}
      {/* (No '6 cherished moments' text anywhere on cover)              */}
      {/* ============================================================== */}
      {!isOpen ? (
        <div className="relative flex flex-col items-center">
          {/* Outer glowing aura */}
          <div className="absolute -inset-8 bg-gradient-to-r from-rose-200/50 via-purple-200/40 to-pink-200/50 rounded-full blur-2xl -z-10 pointer-events-none" />

          {/* Interactive 3D Book Container */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Open Memory Book 3D Photo Album"
            onClick={handleOpenAlbum}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenAlbum();
              }
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="perspective-1200 cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#BD779A]/50 rounded-3xl"
          >
            <div
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.04 : 1})`,
                transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.5s ease-out',
                transformStyle: 'preserve-3d',
              }}
              className="relative w-76 sm:w-88 md:w-96 h-[440px] sm:h-[480px] rounded-r-3xl rounded-l-md shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_25px_60px_-15px_rgba(189,119,154,0.45)]"
            >
              {/* Stacked Paper Page Edges (Right and Bottom) */}
              <div
                className="absolute top-2 right-[-14px] bottom-2 w-[16px] rounded-r-sm book-page-edges shadow-md z-0"
                style={{ transform: 'translateZ(-12px)' }}
              />
              <div
                className="absolute left-4 right-[-10px] bottom-[-10px] h-[12px] rounded-b-sm book-page-edges shadow-md z-0"
                style={{ transform: 'translateZ(-12px)' }}
              />

              {/* Silk Bookmark Ribbon Dangling from bottom */}
              <div
                className="absolute -bottom-8 left-24 w-5 h-16 bg-gradient-to-b from-[#BD779A] to-[#925A7A] shadow-md z-10 rounded-b-sm transform rotate-[-4deg] transition-transform duration-300 group-hover:rotate-[2deg] group-hover:translate-y-1"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)',
                  transform: 'translateZ(10px)',
                }}
              />

              {/* Left Spine with Gold Embossed Ribs */}
              <div
                className="absolute top-0 left-0 bottom-0 w-8 sm:w-10 rounded-l-md bg-gradient-to-r from-[#3D2536] via-[#613652] to-[#7E436A] shadow-[inset_-3px_0_8px_rgba(0,0,0,0.5),_2px_0_6px_rgba(0,0,0,0.3)] z-20 flex flex-col justify-between py-8 items-center"
                style={{ transform: 'translateZ(2px)' }}
              >
                <div className="w-full h-1 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 opacity-70 shadow-xs" />
                <div className="w-full h-1 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 opacity-70 shadow-xs" />
                <div className="rotate-90 text-[10px] tracking-[0.25em] font-serif text-amber-200/90 uppercase font-semibold whitespace-nowrap">
                  Chapter 19
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 opacity-70 shadow-xs" />
                <div className="w-full h-1 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 opacity-70 shadow-xs" />
              </div>

              {/* Front Book Cover Face (No '6 cherished moments' text) */}
              <div
                className="absolute inset-0 ml-7 sm:ml-9 rounded-r-3xl rounded-l-xs bg-gradient-to-br from-[#8C4A73] via-[#75395E] to-[#4F2540] border-t border-r border-b border-rose-300/30 p-6 flex flex-col justify-between items-center text-center text-white overflow-hidden shadow-inner z-10"
                style={{ transform: 'translateZ(4px)' }}
              >
                {/* Subtle linen leather texture */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                {/* Gilded Inner Border Frame */}
                <div className="absolute inset-3 border border-amber-200/50 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between text-amber-200/80 text-xs">
                    <span>❦</span>
                    <span>❦</span>
                  </div>
                  <div className="flex justify-between text-amber-200/80 text-xs">
                    <span>❦</span>
                    <span>❦</span>
                  </div>
                </div>

                {/* Top Corner Details */}
                <div className="pt-2 flex flex-col items-center gap-1 z-10">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-amber-200/90 font-medium">
                    Limited Keepsake Edition
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                </div>

                {/* Center Book Title Plate */}
                <div className="my-auto py-4 space-y-3 z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xs border border-amber-200/40 flex items-center justify-center text-amber-200 shadow-md transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-white drop-shadow-md">
                      Memory Book
                    </h3>
                    <p className="font-serif italic text-amber-100/90 text-sm">
                      Kavisha's 19th Birthday Album
                    </p>
                  </div>
                </div>

                {/* Bottom Call to Action */}
                <div className="pb-2 flex flex-col items-center gap-2 z-10">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400 text-[#4F2540] text-xs font-semibold shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <span>Click to Open Book</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="text-[11px] text-amber-100/70 font-mono">
                    Swipe pages like a real book
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instruction hint below book */}
          <div className="mt-6 flex items-center gap-2 text-stone-500 text-xs bg-white/80 px-4 py-1.5 rounded-full border border-rose-200 shadow-2xs">
            <Bookmark className="w-3.5 h-3.5 text-[#BD779A]" />
            <span>Interactive 3D Book · Click to dynamically open and flip pages</span>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* STATE 2: DYNAMICALLY OPENED 3D PHOTO ALBUM BOOK                */
        /* (2 images per page, full screen tap, upload at the last)       */
        /* ============================================================== */
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-in zoom-in-95 duration-500">
          {/* Top Control Bar */}
          <div className="w-full flex items-center justify-between mb-4 px-2 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#F7DCE8] text-[#925A7A] text-xs font-semibold shadow-xs">
                <BookOpen className="w-3.5 h-3.5 text-[#BD779A]" />
                <span>Memory Book · Open Album</span>
              </span>
              <span className="text-xs text-stone-500 hidden sm:inline-block font-mono">
                Pages {leftPageNumber} & {rightPageNumber} · Spread {currentSpread + 1} of {totalSpreads}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Jump to Upload Button */}
              <button
                type="button"
                onClick={handleJumpToUpload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-[#925A7A] border border-[#F7DCE8] text-xs font-medium shadow-xs transition-all hover:scale-102 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#BD779A]" />
                <span>Add Memory</span>
              </button>

              {/* Close Album Button */}
              <button
                type="button"
                onClick={handleCloseAlbum}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 text-stone-700 hover:text-[#BD779A] border border-[#F7DCE8] text-xs font-medium shadow-sm transition-all hover:scale-105 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#BD779A]" />
                <span>Close Book</span>
              </button>
            </div>
          </div>

          {/* 3D Realistic Open Album Book Spread Container */}
          <div
            className="perspective-1800 relative w-full flex justify-center py-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            {/* The Realistic Open Book Spread */}
            <div
              className={`relative w-full max-w-4xl min-h-[520px] sm:min-h-[580px] md:min-h-[620px] rounded-3xl bg-[#FBF8F3] shadow-[0_25px_60px_-15px_rgba(81,62,81,0.35)] border border-[#E8DFD3] flex flex-row overflow-hidden preserve-3d transition-transform duration-300 ${
                flipDirection ? 'pointer-events-none' : ''
              }`}
            >
              {/* Center Binding Crease & Realistic Spine Shadow */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 book-spine-shadow z-30 pointer-events-none" />

              {/* Center Stitched Thread Accent */}
              <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-0.5 border-l border-dashed border-stone-300/80 z-30 pointer-events-none" />

              {/* -------------------------------------------------------- */}
              {/* LEFT PAGE: 2 Items on the Page (Images / Slots)           */}
              {/* -------------------------------------------------------- */}
              <div className="w-1/2 p-3 sm:p-5 md:p-6 flex flex-col justify-between book-page-texture relative border-r border-[#EFE8DD]">
                {/* Minimal Page Header */}
                <div className="flex items-center justify-between text-stone-400 text-[10px] sm:text-xs pb-2 border-b border-stone-200/60 font-serif italic">
                  <span className="flex items-center gap-1 text-[#925A7A]">
                    <Sparkles className="w-3 h-3 text-[#BD779A]" />
                    <span>Memory Album</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-stone-400">
                    Page {leftPageNumber}
                  </span>
                </div>

                {/* Left Page: 2 Photos Stacked */}
                <div className="my-auto py-2 flex flex-col gap-3 sm:gap-4">
                  {renderSlot(leftIndexTop, 'rotate-[-0.5deg]')}
                  {renderSlot(leftIndexBottom, 'rotate-[0.5deg]')}
                </div>

                {/* Left Page Footer */}
                <div className="pt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400 font-mono">
                  <span>Kavisha's Keepsake</span>
                  <span>Tap to view full screen</span>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* RIGHT PAGE: 2 Items on the Page (Images / Upload Slot)   */}
              {/* -------------------------------------------------------- */}
              <div className="w-1/2 p-3 sm:p-5 md:p-6 flex flex-col justify-between book-page-texture relative">
                {/* Minimal Page Header */}
                <div className="flex items-center justify-between text-stone-400 text-[10px] sm:text-xs pb-2 border-b border-stone-200/60 font-serif italic">
                  <span className="flex items-center gap-1 text-[#925A7A]">
                    <Sparkles className="w-3 h-3 text-[#BD779A]" />
                    <span>Cherished Moments</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-stone-400">
                    Page {rightPageNumber}
                  </span>
                </div>

                {/* Right Page: 2 Photos / Upload Stacked */}
                <div className="my-auto py-2 flex flex-col gap-3 sm:gap-4">
                  {renderSlot(rightIndexTop, 'rotate-[0.5deg]')}
                  {renderSlot(rightIndexBottom, 'rotate-[-0.5deg]')}
                </div>

                {/* Right Page Footer */}
                <div className="pt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400 font-mono">
                  <span>Chapter 19</span>
                  <span>Spread {currentSpread + 1} / {totalSpreads}</span>
                </div>
              </div>

              {/* Realistic 3D Page Flip Overlay when transitioning */}
              {flipDirection === 'next' && (
                <div
                  className="absolute inset-y-0 right-0 w-1/2 origin-left bg-gradient-to-r from-stone-200/60 via-[#FDFAF5] to-white shadow-2xl z-40 animate-out fade-out duration-400 border-l border-stone-300"
                  style={{
                    transform: 'rotateY(-180deg)',
                    transition: 'transform 0.4s ease-in-out',
                    transformStyle: 'preserve-3d',
                  }}
                />
              )}

              {flipDirection === 'prev' && (
                <div
                  className="absolute inset-y-0 left-0 w-1/2 origin-right bg-gradient-to-l from-stone-200/60 via-[#FDFAF5] to-white shadow-2xl z-40 animate-out fade-out duration-400 border-r border-stone-300"
                  style={{
                    transform: 'rotateY(180deg)',
                    transition: 'transform 0.4s ease-in-out',
                    transformStyle: 'preserve-3d',
                  }}
                />
              )}
            </div>

            {/* Left Page Turn Button (Prev) */}
            <button
              type="button"
              onClick={handlePrevPage}
              aria-label="Previous Page"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#513E51] shadow-xl border border-rose-200 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-[#BD779A]" />
            </button>

            {/* Right Page Turn Button (Next) */}
            <button
              type="button"
              onClick={handleNextPage}
              aria-label="Next Page"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#513E51] shadow-xl border border-rose-200 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-[#BD779A]" />
            </button>
          </div>

          {/* Quick Page Scrubber & Thumbnails Ribbon */}
          <div className="w-full max-w-2xl mt-4 px-4 py-3 rounded-2xl glass-panel flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 w-full max-w-md overflow-x-auto justify-center py-1">
              {photos.map((photo, idx) => {
                const photoSpread = Math.floor(idx / PHOTOS_PER_SPREAD);
                const isSelected = photoSpread === currentSpread;
                return (
                  <button
                    key={photo.id || idx}
                    type="button"
                    onClick={() => {
                      if (photoSpread !== currentSpread) {
                        playPageTurnSound();
                        setCurrentSpread(photoSpread);
                      }
                    }}
                    className={`group relative rounded-lg overflow-hidden transition-all duration-300 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'w-12 h-12 ring-2 ring-[#BD779A] shadow-md scale-105'
                        : 'w-9 h-9 opacity-60 hover:opacity-100 hover:scale-102'
                    }`}
                    title={`Photo ${idx + 1}`}
                  >
                    {photo.src ? (
                      <img src={photo.src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-rose-100 flex items-center justify-center text-xs">
                        🌸
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-mono text-center">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}

              {/* Dedicated Upload Thumbnail Button at End of Scrubber */}
              <button
                type="button"
                onClick={handleJumpToUpload}
                className="w-9 h-9 rounded-lg border-2 border-dashed border-[#BD779A] bg-rose-50/70 hover:bg-rose-100 flex items-center justify-center text-[#BD779A] shrink-0 transition-transform hover:scale-105 cursor-pointer"
                title="Add photo & tag to book"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between w-full text-xs text-stone-500 font-mono px-2">
              <span>Swipe or use Left / Right arrows to flip</span>
              <button
                type="button"
                onClick={handleCloseAlbum}
                className="text-[#925A7A] hover:underline font-serif font-medium cursor-pointer"
              >
                Close 3D Album ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: Inline Tag Editor for Kavisha                           */}
      {/* ============================================================== */}
      {editingPhoto && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5 text-[#925A7A] font-serif font-semibold">
                <Edit2 className="w-4 h-4 text-[#BD779A]" />
                <span>Edit Photo Tag</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-600 block">
                Choose or type a new tag for this picture:
              </label>
              <input
                type="text"
                value={editedTagText}
                onChange={(e) => setEditedTagText(e.target.value)}
                placeholder="e.g. Besties 💕"
                maxLength={30}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD779A]"
                autoFocus
              />
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1">
              <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">Quick Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setEditedTagText(tag)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-[#925A7A] border border-rose-200 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSavePhotoTag}
                disabled={isSavingTag}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#BD779A] hover:bg-[#A86487] text-white text-xs font-semibold shadow-sm transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                {isSavingTag ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Tag...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Tag</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
