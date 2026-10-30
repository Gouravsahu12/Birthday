import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Check,
  Camera,
  RefreshCw,
  FolderUp,
  Trash2,
  Sparkles,
  Plus,
} from 'lucide-react';
import { BIRTHDAY_CONFIG, GalleryPhoto } from '../data/birthdayContent';
import { usePhotos } from '../hooks/usePhotos';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosUpdated?: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onPhotosUpdated,
}) => {
  const { recipient } = BIRTHDAY_CONFIG;
  const { photos, refreshPhotos } = usePhotos();
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const multiFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Single photo replacement
  const handleReplacePhoto = (photoId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      await uploadPhotos([{ replaceId: photoId, dataUrl }]);
    };
    reader.readAsDataURL(file);
  };

  // Add multiple new photos (unlimited)
  const handleAddNewPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    let loadedCount = 0;
    const payload: { title: string; dataUrl: string }[] = [];

    setUploading(true);
    fileArray.forEach((file, i) => {
      const reader = new FileReader();
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      reader.onload = async () => {
        payload.push({
          title: cleanTitle || `Memory Moment #${photos.length + i + 1}`,
          dataUrl: reader.result as string,
        });
        loadedCount++;
        if (loadedCount === fileArray.length) {
          await uploadPhotos(payload);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadPhotos = async (payload: { replaceId?: string; title?: string; dataUrl: string }[]) => {
    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/upload-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: payload,
          creatorKey: 'gourav', // Authorized creator key
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Successfully uploaded ${payload.length} photo(s)!`);
        await refreshPhotos();
        if (onPhotosUpdated) {
          onPhotosUpdated();
        }
        window.dispatchEvent(new CustomEvent('photos-updated'));
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(data.error || 'Failed to upload photos.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error while uploading photos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (photos.length <= 1) {
      setErrorMessage('Please keep at least one photo in the collection.');
      return;
    }

    setUploading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, creatorKey: 'gourav' }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Photo deleted successfully.');
        await refreshPhotos();
        if (onPhotosUpdated) {
          onPhotosUpdated();
        }
        window.dispatchEvent(new CustomEvent('photos-updated'));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(data.error || 'Failed to delete photo.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error while deleting photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-50 text-stone-400 hover:text-stone-700 transition cursor-pointer"
          aria-label="Close photo manager"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#925A7A] text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#BD779A]" />
            <span>Creator Studio · Private Photo Manager</span>
          </div>
          <h2 id="upload-modal-title" className="font-serif text-2xl sm:text-3xl text-[#513E51]">
            Manage Photos for {recipient.name}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Upload as many photos as you like. They will automatically be displayed in the smooth-transition Hero tab and the Memory Gallery.
          </p>
          <div className="pt-1">
            <span className="inline-block px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono text-[11px] font-medium border border-purple-200">
              Total photos in collection: {photos.length}
            </span>
          </div>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <X className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Add New Photos Action Bar (Unlimited photos) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-50/70 via-purple-50/50 to-rose-50/70 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left text-xs">
            <span className="font-semibold text-stone-700 block">
              Add More Photos (No Limit!)
            </span>
            <span className="text-stone-500 text-[11px]">
              Select 1, 5, 10 or 20+ photos at once from your device.
            </span>
          </div>

          <input
            type="file"
            ref={multiFileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAddNewPhotos(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => multiFileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BD779A] hover:bg-[#925A7A] text-white text-xs font-medium tracking-wide shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {uploading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Add Photos Now</span>
          </button>
        </div>

        {/* Grid of All Photos (Unlimited) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {photos.map((photo, index) => (
            <div
              key={photo.id || index}
              className="relative p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center text-center space-y-2 group shadow-2xs"
            >
              <div className="relative w-full h-28 rounded-xl overflow-hidden bg-stone-200">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/50 text-white text-[9px] font-mono">
                  #{index + 1}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  title="Delete this photo"
                  aria-label={`Delete photo ${index + 1}`}
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-rose-600 text-white transition cursor-pointer opacity-80 hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="w-full">
                <p className="text-xs font-medium text-stone-700 truncate">
                  {photo.title}
                </p>
                <label className="mt-1.5 inline-flex items-center justify-center gap-1 w-full py-1 rounded-lg bg-white border border-rose-200 text-[#BD779A] hover:bg-rose-50 text-[10px] font-medium transition cursor-pointer shadow-2xs">
                  <Upload className="w-3 h-3" />
                  <span>Replace</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleReplacePhoto(photo.id, file);
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>Private Creator Studio · Only accessible by Gourav</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-[#BD779A] hover:bg-[#925A7A] text-white text-xs font-medium transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
