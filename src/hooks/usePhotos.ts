import { useState, useEffect, useCallback } from 'react';
import { BIRTHDAY_CONFIG, GalleryPhoto } from '../data/birthdayContent';

export function usePhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(BIRTHDAY_CONFIG.gallery.photos);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (data.success && Array.isArray(data.photos) && data.photos.length > 0) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.warn('Failed to fetch dynamic photos, fallback to static:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();

    const handleUpdated = () => {
      fetchPhotos();
    };

    window.addEventListener('photos-updated', handleUpdated);
    return () => window.removeEventListener('photos-updated', handleUpdated);
  }, [fetchPhotos]);

  return { photos, loading, refreshPhotos: fetchPhotos };
}
