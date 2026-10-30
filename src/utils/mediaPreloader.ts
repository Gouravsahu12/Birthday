/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BIRTHDAY_CONFIG } from '../data/birthdayContent';
import { DRIVE_MEDIA_CATALOG } from '../data/driveMediaCatalog';

export interface PreloadStatus {
  total: number;
  loaded: number;
  percent: number;
  isComplete: boolean;
  activeItem?: string;
}

type PreloadListener = (status: PreloadStatus) => void;

const listeners = new Set<PreloadListener>();

let preloadStarted = false;
let statusState: PreloadStatus = {
  total: 0,
  loaded: 0,
  percent: 0,
  isComplete: false,
};

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(statusState);
    } catch {
      // ignore listener errors
    }
  });
}

/**
 * Collect all images across hero slideshow, memory book, and timeline
 */
export function getAllAppImages(): string[] {
  const images = new Set<string>();

  // Slideshow photos
  BIRTHDAY_CONFIG.slideshowPhotos.forEach((p) => {
    if (p.src) images.add(p.src);
  });

  // Gallery memory book photos
  BIRTHDAY_CONFIG.gallery.photos.forEach((p) => {
    if (p.src) images.add(p.src);
  });

  // Top slideshow photos
  BIRTHDAY_CONFIG.slideshowPhotos?.forEach((p) => {
    if (p.src) images.add(p.src);
  });

  // Timeline entry thumbnails and image media items
  BIRTHDAY_CONFIG.timeline.entries.forEach((entry) => {
    if (entry.thumbnailSrc) images.add(entry.thumbnailSrc);
    entry.mediaList?.forEach((media) => {
      if (media.type === 'image' && media.src) {
        images.add(media.src);
      }
      if (media.thumbnailSrc) {
        images.add(media.thumbnailSrc);
      }
    });
  });

  // Also include background cat meme gifs (A through I)
  images.add('/images/background/A.gif');
  images.add('/images/background/B.gif');
  images.add('/images/background/C.gif');
  images.add('/images/background/D.gif');
  images.add('/images/background/E.gif');
  images.add('/images/background/F.gif');
  images.add('/images/background/G.gif');
  images.add('/images/background/H.gif');
  images.add('/images/background/I.gif');

  return Array.from(images);
}

/**
 * Collect all videos across the application
 */
export function getAllAppVideos(): string[] {
  const videos = new Set<string>();

  // Timeline videos
  BIRTHDAY_CONFIG.timeline.entries.forEach((entry) => {
    entry.mediaList?.forEach((media) => {
      if (media.type === 'video' && media.src) {
        videos.add(media.src);
      }
    });
  });

  // Also include catalog videos
  Object.values(DRIVE_MEDIA_CATALOG).forEach((item) => {
    if (item.type === 'video' && item.src) {
      videos.add(item.src);
    }
  });

  return Array.from(videos);
}

/**
 * Preload a single image with decoding
 */
function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    const onFinish = () => {
      if ('decode' in img) {
        img.decode().then(() => resolve(true)).catch(() => resolve(true));
      } else {
        resolve(true);
      }
    };

    if (img.complete) {
      onFinish();
    } else {
      img.onload = () => onFinish();
      img.onerror = () => resolve(false);
    }
  });
}

/**
 * Preload initial faststart chunk & initialize decoder for a video
 */
function preloadVideo(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        video.onloadeddata = null;
        video.oncanplay = null;
        video.onerror = null;
        video.src = '';
        try {
          video.load();
        } catch {
          // ignore
        }
        resolve(true);
      }
    };

    // 1. Warm up browser HTTP cache with the first 1.5MB range
    try {
      fetch(src, {
        headers: { Range: 'bytes=0-1572864' },
      }).catch(() => {});
    } catch {
      // non-blocking
    }

    // 2. Headless video element to warm up media subsystem
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => finish();
    video.oncanplay = () => finish();
    video.onerror = () => finish();

    // Timeout safety fallback so slow connection never hangs preloader
    setTimeout(finish, 2500);

    video.src = src;
    video.load();
  });
}

/**
 * Batch processor with concurrency limiter
 */
async function processBatch<T>(
  items: T[],
  limit: number,
  handler: (item: T) => Promise<unknown>,
  onItemDone: (item: T) => void
): Promise<void> {
  const executing: Promise<unknown>[] = [];
  for (const item of items) {
    const p = Promise.resolve().then(() => handler(item)).then(() => onItemDone(item));
    executing.push(p);

    if (limit <= items.length) {
      const e: Promise<unknown> = p.then(() => executing.splice(executing.indexOf(e), 1));
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  await Promise.all(executing);
}

/**
 * Start preloading all images and videos when website starts.
 * Runs non-blocking in background, prioritized for smooth UX.
 */
export function startMediaPreloading(): void {
  if (preloadStarted || typeof window === 'undefined') return;
  preloadStarted = true;

  const images = getAllAppImages();
  const videos = getAllAppVideos();
  const total = images.length + videos.length;
  let loaded = 0;

  statusState = {
    total,
    loaded: 0,
    percent: 0,
    isComplete: false,
  };
  notifyListeners();

  const handleItemDone = (item: string) => {
    loaded++;
    const percent = Math.min(100, Math.round((loaded / total) * 100));
    statusState = {
      total,
      loaded,
      percent,
      isComplete: loaded >= total,
      activeItem: item,
    };
    notifyListeners();
  };

  // Run in background with small delay to let main thread finish initial React render
  setTimeout(async () => {
    // 1. High-priority: Slideshow images and first 5 timeline thumbnails
    const highPriorityImages = images.slice(0, 10);
    const remainingImages = images.slice(10);

    await processBatch(highPriorityImages, 4, preloadImage, handleItemDone);

    // 2. Next: Preload all remaining images with 6 parallel connections
    processBatch(remainingImages, 6, preloadImage, handleItemDone);

    // 3. Simultaneously preload video initial segments with 3 parallel connections
    processBatch(videos, 3, preloadVideo, handleItemDone);
  }, 100);
}

/**
 * Subscribe to preload status updates
 */
export function subscribeToMediaPreload(callback: PreloadListener): () => void {
  listeners.add(callback);
  callback(statusState);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Get current preload snapshot
 */
export function getMediaPreloadStatus(): PreloadStatus {
  return statusState;
}
