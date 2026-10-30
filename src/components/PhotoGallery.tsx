import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { BIRTHDAY_CONFIG, GalleryPhoto } from '../data/birthdayContent';
import { LightboxModal } from './LightboxModal';
import { usePhotos } from '../hooks/usePhotos';
import { PhotoAlbum3D } from './PhotoAlbum3D';

export const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const { gallery } = BIRTHDAY_CONFIG;
  const { photos } = usePhotos();

  return (
    <section 
      id="gallery-section" 
      aria-labelledby="gallery-heading" 
      className="py-16 px-4 sm:px-6 max-w-6xl mx-auto relative select-none"
    >
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#F7DCE8] text-[#925A7A] text-xs uppercase tracking-wider font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Memory Gallery</span>
        </div>
        <h2 id="gallery-heading" className="font-serif text-3xl sm:text-4xl text-[#513E51]">
          {gallery.sectionTitle}
        </h2>
        <p className="text-sm text-stone-500">
          {gallery.sectionSubtitle}
        </p>
      </div>

      {/* 3D Photo Album Tab - Opens dynamically and turns pages like a real book */}
      <PhotoAlbum3D
        photos={photos}
        onOpenLightbox={(photo) => setSelectedPhoto(photo)}
      />

      {/* Lightbox modal for high-res photo inspection */}
      <LightboxModal
        photo={selectedPhoto}
        photos={photos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />
    </section>
  );
};
