import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Calendar,
  BookOpen,
  X,
  Film,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Tag,
  Maximize2,
  Play,
  ExternalLink,
  Cloud,
  Monitor,
} from 'lucide-react';
import { BIRTHDAY_CONFIG, TimelineEntry, TimelineMediaItem, CHAPTER_DATES } from '../data/birthdayContent';
import { playAlbumOpenSound } from '../utils/audioEffects';
import { getDrivePreviewUrl, getDriveDirectFileUrl } from '../data/driveMediaCatalog';

const CHAPTER_SIDE_GIFS: Record<number, { src: string; label: string; animationClass: string }> = {
  1: {
    src: '/images/background/G.gif',
    label: 'Groovy Cat 🎶',
    animationClass: 'animate-timeline-float',
  },
  3: {
    src: '/images/background/A.gif',
    label: 'Party Kitty 🐾',
    animationClass: 'animate-timeline-float-alt',
  },
  6: {
    src: '/images/background/B.gif',
    label: 'Birthday Vibe 🎂',
    animationClass: 'animate-timeline-float',
  },
  9: {
    src: '/images/background/C.gif',
    label: 'Chaos Cat 😹',
    animationClass: 'animate-timeline-float-alt',
  },
  10: {
    src: '/images/background/H.gif',
    label: 'Crown Kitty 👑',
    animationClass: 'animate-timeline-float',
  },
  12: {
    src: '/images/background/D.gif',
    label: 'Make A Wish 🍰',
    animationClass: 'animate-timeline-float-alt',
  },
  15: {
    src: '/images/background/E.gif',
    label: 'Playful Paws ✨',
    animationClass: 'animate-timeline-float',
  },
  18: {
    src: '/images/background/F.gif',
    label: 'Dance Kitty 💃',
    animationClass: 'animate-timeline-float-alt',
  },
  19: {
    src: '/images/background/I.gif',
    label: 'Celebration Sparkle 🌸',
    animationClass: 'animate-timeline-float',
  },
};

function getVideoThumbnail(src?: string): string {
  if (!src) return '';
  const filename = src.split('/').pop()?.replace(/\.mp4$/i, '.jpg');
  return filename ? `/videos/thumbnails/${filename}` : '';
}

export const MemoriesTimeline: React.FC = () => {
  const { timeline } = BIRTHDAY_CONFIG;
  const [activeChapter, setActiveChapter] = useState<TimelineEntry | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoPlayerMode, setVideoPlayerMode] = useState<'drive' | 'local'>('local');
  const [scrollProgress, setScrollProgress] = useState(0);

  const timelineSectionRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const svgPathRef = useRef<SVGPathElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [pathTotalLength, setPathTotalLength] = useState(0);
  const [followerPoint, setFollowerPoint] = useState<{ x: number; y: number } | null>(null);

  // Responsive mobile check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Measure timeline cards container pixel dimensions
  useEffect(() => {
    const updateSize = () => {
      if (cardsContainerRef.current) {
        const w = cardsContainerRef.current.clientWidth || (isMobile ? 360 : 900);
        const h = cardsContainerRef.current.clientHeight || 5000;
        setContainerDimensions({ width: w, height: h });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    const observer = new ResizeObserver(updateSize);
    if (cardsContainerRef.current) {
      observer.observe(cardsContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      observer.disconnect();
    };
  }, [isMobile, timeline.entries.length]);

  // Track scroll progress along the timeline section
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineSectionRef.current) return;
      const rect = timelineSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height;
      // Start progressing as timeline enters viewport, reach 100% when bottom is near view
      const currentDist = windowHeight * 0.5 - rect.top;
      const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Measure SVG path length and update follower position
  useEffect(() => {
    if (svgPathRef.current) {
      try {
        const len = svgPathRef.current.getTotalLength();
        if (len > 0) {
          setPathTotalLength(len);
          const pt = svgPathRef.current.getPointAtLength(len * scrollProgress);
          if (pt) {
            setFollowerPoint({ x: pt.x, y: pt.y });
          }
        }
      } catch (e) {
        // Fallback length
      }
    }
  }, [scrollProgress, containerDimensions]);

  // Open Chapter Modal with transition and sound
  const handleOpenChapterModal = (chapter: TimelineEntry, initialIndex: number = 0) => {
    playAlbumOpenSound();
    setActiveChapter(chapter);
    setActiveMediaIndex(initialIndex);
    setVideoPlayerMode('local');
  };

  const handleCloseModal = () => {
    setActiveChapter(null);
    setActiveMediaIndex(0);
    setVideoPlayerMode('local');
  };

  // Next / Prev media navigation inside modal
  const handleNextMedia = useCallback(() => {
    if (!activeChapter || !activeChapter.mediaList || activeChapter.mediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev + 1) % activeChapter.mediaList.length);
    setVideoPlayerMode('local');
  }, [activeChapter]);

  const handlePrevMedia = useCallback(() => {
    if (!activeChapter || !activeChapter.mediaList || activeChapter.mediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev - 1 + activeChapter.mediaList.length) % activeChapter.mediaList.length);
    setVideoPlayerMode('local');
  }, [activeChapter]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!activeChapter) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
      if (e.key === 'ArrowRight') handleNextMedia();
      if (e.key === 'ArrowLeft') handlePrevMedia();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChapter, handleNextMedia, handlePrevMedia]);

  // Generate a winding SVG curve path using exact pixel dimensions
  const generateCurvePath = () => {
    const { width, height } = containerDimensions;
    const totalEntries = timeline.entries.length;
    if (totalEntries === 0 || height <= 0) return '';

    const centerX = isMobile ? 24 : width / 2;
    const stepY = height / totalEntries;
    let d = `M ${centerX} 0`;

    for (let i = 0; i < totalEntries; i++) {
      const startY = i * stepY;
      const endY = (i + 1) * stepY;
      // Winding amplitude: swings ±28px on desktop, or ±6px on mobile
      const waveOffset = isMobile
        ? (i % 2 === 0 ? centerX + 8 : centerX - 6)
        : (i % 2 === 0 ? centerX + 34 : centerX - 34);

      d += ` C ${waveOffset} ${startY + stepY * 0.25}, ${waveOffset} ${startY + stepY * 0.75}, ${centerX} ${endY}`;
    }
    return d;
  };

  const curveD = generateCurvePath();
  const currentMedia = activeChapter?.mediaList?.[activeMediaIndex] || null;
  const isChapterWithDriveOption =
    activeChapter?.chapterNumber === 3 || activeChapter?.chapterNumber === 11;
  const drivePreviewUrl =
    isChapterWithDriveOption && currentMedia
      ? currentMedia.drivePreviewUrl || getDrivePreviewUrl(currentMedia.src)
      : null;
  const driveFileLink =
    isChapterWithDriveOption && currentMedia
      ? getDriveDirectFileUrl(currentMedia.src)
      : null;

  return (
    <section
      id="timeline-section"
      aria-labelledby="timeline-heading"
      ref={timelineSectionRef}
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto relative select-none"
    >
      {/* Background Soft Ambient Light */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-rose-100/30 via-purple-100/20 to-transparent blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#F7DCE8] text-[#925A7A] text-xs uppercase tracking-wider font-semibold shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-[#BD779A]" />
          <span>The 19 Chapters · Milestone Journey</span>
        </div>

        <h2 id="timeline-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#513E51] font-semibold">
          {timeline.sectionTitle}
        </h2>

        <p className="text-sm sm:text-base text-stone-500 font-light max-w-xl mx-auto">
          {timeline.sectionSubtitle}
        </p>

      </div>

      {/* ============================================================== */}
      {/* TIMELINE CONTAINER WITH DYNAMIC CURVING MOVING LINE            */}
      {/* ============================================================== */}
      <div ref={cardsContainerRef} className="relative">
        {/* SVG Curving Animated Line Canvas */}
        {containerDimensions.height > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none -z-0 overflow-visible"
            width={containerDimensions.width}
            height={containerDimensions.height}
            viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="curveBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F7DCE8" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#BD779A" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#DCD3F5" stopOpacity="0.45" />
              </linearGradient>

              <linearGradient id="curveActiveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#BD779A" />
                <stop offset="30%" stopColor="#E08BAF" />
                <stop offset="70%" stopColor="#C4739E" />
                <stop offset="100%" stopColor="#8C4A73" />
              </linearGradient>

              {/* Glowing filter for follower light */}
              <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Underlying Dotted Curving Track */}
            <path
              d={curveD}
              fill="none"
              stroke="url(#curveBaseGrad)"
              strokeWidth={isMobile ? 2 : 3}
              strokeDasharray="4 5"
              strokeLinecap="round"
            />

            {/* 2. Active Moving Scroll Progress Path (Reveals dynamically as you scroll) */}
            <path
              ref={svgPathRef}
              d={curveD}
              fill="none"
              stroke="url(#curveActiveGrad)"
              strokeWidth={isMobile ? 3 : 4}
              strokeLinecap="round"
              style={{
                strokeDasharray: pathTotalLength,
                strokeDashoffset: Math.max(0, pathTotalLength * (1 - scrollProgress)),
                transition: 'stroke-dashoffset 0.08s ease-out',
              }}
            />

            {/* 3. Glowing Follower Particle that glides along the curve as you scroll */}
            {scrollProgress > 0.02 && followerPoint && (
              <g
                transform={`translate(${followerPoint.x}, ${followerPoint.y})`}
                filter="url(#glowFilter)"
                className="transition-transform duration-75"
              >
                <circle r="7" fill="#BD779A" opacity="0.4" />
                <circle r="4.5" fill="#FFFFFF" stroke="#BD779A" strokeWidth="2" />
              </g>
            )}
          </svg>
        )}

        {/* ------------------------------------------------------------ */}
        {/* 19 CHAPTER CARDS ALONG THE CURVING LINE                      */}
        {/* ------------------------------------------------------------ */}
        <div className="space-y-16 sm:space-y-20 relative z-10">
          {timeline.entries.map((entry, index) => {
            const isEven = index % 2 === 0;
            const chapterProgressRatio = index / (timeline.entries.length - 1);
            const isPassed = scrollProgress >= chapterProgressRatio * 0.92;
            const mediaCount = entry.mediaList ? entry.mediaList.length : 1;
            const hasVideo = entry.mediaList ? entry.mediaList.some((m) => m.type === 'video') : false;
            const sideGif = CHAPTER_SIDE_GIFS[entry.chapterNumber];

            return (
              <div
                key={entry.id || entry.chapterNumber || index}
                className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Milestone Node on the curve */}
                <div
                  className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center z-20 transition-all duration-500 shadow-md ${
                    isPassed
                      ? 'bg-gradient-to-tr from-[#BD779A] to-[#925A7A] text-white ring-4 ring-rose-200/80 scale-110 shadow-[0_0_20px_rgba(189,119,154,0.5)]'
                      : 'bg-white text-[#925A7A] border-2 border-rose-200 ring-2 ring-white/80'
                  }`}
                  aria-label={`${entry.chapter} Milestone`}
                >
                  <span className="font-mono text-xs font-bold">
                    {String(entry.chapterNumber).padStart(2, '0')}
                  </span>
                </div>

                {/* Chapter Card (takes half width on desktop) */}
                <div className="ml-14 md:ml-0 md:w-1/2 md:px-10 w-full">
                  <div
                    className={`glass-panel rounded-3xl p-5 sm:p-7 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group/card ${
                      isPassed
                        ? 'border-rose-200/90 shadow-lg bg-white/95'
                        : 'border-white/80 shadow-md bg-white/85'
                    }`}
                  >
                    {/* Chapter Header: Badge, Date & Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#925A7A] border border-rose-200 text-xs font-semibold tracking-wide font-mono uppercase">
                          {entry.chapter}
                        </span>
                      </div>

                      {/* Tag Pill */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-medium">
                        <Tag className="w-2.5 h-2.5 text-amber-600" />
                        {entry.tag}
                      </span>
                    </div>

                    {/* Chapter Heading */}
                    <h3 className="font-serif text-xl sm:text-2xl text-[#513E51] font-semibold mb-3 group-hover/card:text-[#BD779A] transition-colors">
                      {entry.title}
                    </h3>

                    {/* Thumbnail / Main Image on Chapter Card */}
                    {(() => {
                      const thumbIdx = entry.mediaList?.findIndex((m) => m.src === entry.thumbnailSrc) ?? 0;
                      const initialIdx = thumbIdx >= 0 ? thumbIdx : 0;
                      const primaryMedia = entry.mediaList?.[initialIdx] || entry.mediaList?.[0];
                      const displayThumb =
                        entry.thumbnailSrc ||
                        primaryMedia?.thumbnailSrc ||
                        (primaryMedia?.type === 'video' ? getVideoThumbnail(primaryMedia.src) : primaryMedia?.src);
                      const isThumbVideo = primaryMedia?.type === 'video' || (displayThumb && displayThumb.includes('/thumbnails/'));

                      return (
                        <div
                          onClick={() => handleOpenChapterModal(entry, initialIdx)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Open ${entry.chapter} media`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleOpenChapterModal(entry, initialIdx);
                            }
                          }}
                          className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-rose-50/50 mb-4 border border-stone-200/80 shadow-xs group/thumb cursor-pointer"
                        >
                      {displayThumb ? (
                        <>
                          <img
                            src={displayThumb}
                            alt={entry.title}
                            className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 group-hover/thumb:scale-105"
                          />
                          {isThumbVideo && (
                            <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                              <div className="w-11 h-11 rounded-full bg-white/90 text-[#925A7A] flex items-center justify-center shadow-lg transform transition-transform group-hover/thumb:scale-110">
                                <Play className="w-5 h-5 ml-0.5 fill-[#925A7A]" />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center space-y-1">
                          <span className="text-3xl">🌸</span>
                          <p className="font-serif text-sm text-[#925A7A]">{entry.title}</p>
                          <span className="text-[10px] text-stone-400">Precious memory moment</span>
                        </div>
                      )}

                      {/* Media Count Badge Floating on Thumbnail */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium border border-white/20 shadow-xs">
                          {hasVideo ? (
                            <Film className="w-3 h-3 text-rose-300" />
                          ) : (
                            <ImageIcon className="w-3 h-3 text-rose-300" />
                          )}
                          <span>
                            {mediaCount} {mediaCount === 1 ? 'media' : 'memories'}
                          </span>
                        </span>
                      </div>

                      {/* Quick Hover Zoom Icon */}
                      <div className="absolute bottom-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 text-stone-800 shadow-sm opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5 text-[#BD779A]" />
                      </div>
                    </div>
                  );
                })()}

                    {/* Interactive "View Memory Media & Story" Button */}
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleOpenChapterModal(entry)}
                        aria-label={`View memory media and story for ${entry.chapter}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#BD779A] via-[#A86487] to-[#925A7A] hover:from-[#A86487] hover:to-[#7E436A] shadow-md hover:shadow-lg transition-all hover:scale-103 cursor-pointer"
                      >
                        {hasVideo ? (
                          <Film className="w-3.5 h-3.5 text-amber-200" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        )}
                        <span>View memory media & story</span>
                      </button>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/90 text-[#925A7A] border border-rose-200/70 text-xs font-mono font-medium shadow-2xs">
                        <Calendar className="w-3 h-3 text-[#BD779A]" />
                        <span>{CHAPTER_DATES[entry.chapterNumber] || entry.date}</span>
                      </span>
                    </div>
                  </div>

                  {/* Mobile Blank Space Floating GIF below chapter card (blended with background) */}
                  {sideGif && (
                    <div className="md:hidden flex items-center justify-center pt-3 pb-1 select-none pointer-events-none">
                      <div className={`pointer-events-auto flex flex-col items-center justify-center ${sideGif.animationClass}`}>
                        <img
                          src={sideGif.src}
                          alt={sideGif.label}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-[0_6px_14px_rgba(189,119,154,0.18)]"
                          loading="lazy"
                        />
                        <span className="mt-1 text-[10px] font-sans font-medium text-[#925A7A]/80 bg-white/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-rose-200/30">
                          {sideGif.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Blank Space Complement (floating side-wise, blended with background) */}
                <div className="hidden md:flex md:w-1/2 md:px-10 items-center justify-center select-none pointer-events-none">
                  {sideGif ? (
                    <div className={`pointer-events-auto flex flex-col items-center justify-center ${sideGif.animationClass}`}>
                      <img
                        src={sideGif.src}
                        alt={sideGif.label}
                        className="w-28 h-28 lg:w-36 lg:h-36 object-contain filter drop-shadow-[0_10px_22px_rgba(189,119,154,0.2)] hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="mt-2 text-[11px] font-sans font-medium text-[#925A7A]/80 bg-white/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-rose-200/40 shadow-2xs">
                        {sideGif.label}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* HIGHLIGHTED POP-UP MODAL (TRANSITION, SOUND, VIDEOS & DESCRIPTIONS) */}
      {/* ============================================================== */}
      {activeChapter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#20101C]/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chapter-modal-title"
        >
          {/* Backdrop Click to Close */}
          <div className="absolute inset-0" onClick={handleCloseModal} aria-hidden="true" />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-3xl my-auto bg-white/98 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(189,119,154,0.4)] border border-rose-200/80 animate-in zoom-in-95 duration-300 flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Top Close Button */}
            <button
              onClick={handleCloseModal}
              type="button"
              aria-label="Close chapter memory modal"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer z-30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Chapter Header */}
            <div className="mb-4 pr-10 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100/80 text-[#925A7A] border border-rose-200 text-xs font-mono font-semibold">
                  {activeChapter.chapter}
                </span>
                <span className="text-xs text-stone-400 font-mono hidden sm:inline-block">
                  · {CHAPTER_DATES[activeChapter.chapterNumber] || activeChapter.date}
                </span>
              </div>

              <h3 id="chapter-modal-title" className="font-serif text-2xl sm:text-3xl text-[#513E51] font-semibold">
                {activeChapter.title}
              </h3>
            </div>

            {/* Chapter Narrative Story Text (when no media items are present) */}
            {activeChapter.message && (!activeChapter.mediaList || activeChapter.mediaList.length === 0) && (
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#FFF8FA] to-[#FFFDF9] border border-rose-100 shadow-2xs">
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-light">
                  {activeChapter.message}
                </p>
              </div>
            )}

            {/* ============================================================== */}
            {/* MEDIA VIEWER: IMAGES & VIDEOS WITH SOUND                       */}
            {/* ============================================================== */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-stone-900 border border-rose-200 shadow-inner flex flex-col items-center justify-center min-h-[240px] sm:min-h-[300px]">
              {currentMedia ? (
                currentMedia.type === 'video' ? (
                  <div className="relative w-full h-64 sm:h-80 md:h-[390px] bg-black flex items-center justify-center">
                    {isChapterWithDriveOption && drivePreviewUrl && videoPlayerMode === 'drive' ? (
                      /* High-Performance Google Drive Embedded Stream */
                      <iframe
                        key={drivePreviewUrl}
                        src={drivePreviewUrl}
                        title={currentMedia.title || activeChapter.title}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      /* Native HTML5 Video Player with Controls */
                      <>
                        <video
                          key={currentMedia.src}
                          src={currentMedia.src}
                          controls
                          autoPlay={false}
                          muted={isMuted}
                          playsInline
                          preload="auto"
                          poster={currentMedia.thumbnailSrc || getVideoThumbnail(currentMedia.src) || activeChapter.thumbnailSrc}
                          className="w-full h-full object-contain"
                        >
                          <source src={currentMedia.src} type="video/mp4" />
                          Your browser does not support this video.
                        </video>

                        {/* Mute/Sound Toggle Helper */}
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                          title={isMuted ? 'Unmute video' : 'Mute video'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  /* High-Res Photo Display */
                  <div className="relative w-full h-56 sm:h-72 md:h-80 bg-stone-950 flex items-center justify-center p-2">
                    <img
                      src={currentMedia.src}
                      alt={currentMedia.title || activeChapter.title}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                )
              ) : (
                /* Fallback */
                <div className="text-center p-8 space-y-2 text-white/90">
                  <span className="text-4xl">🌸✨</span>
                  <p className="font-serif text-lg">Treasured Memory</p>
                  <p className="text-xs text-stone-300 max-w-sm mx-auto">
                    A special chapter in our milestone journey.
                  </p>
                </div>
              )}

              {/* Navigation Arrows for Media */}
              {activeChapter.mediaList && activeChapter.mediaList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevMedia}
                    aria-label="Previous media"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextMedia}
                    aria-label="Next media"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* ============================================================== */}
            {/* PARTICULAR DESCRIPTION FOR PARTICULAR MEDIA ITEM               */}
            {/* ============================================================== */}
            {currentMedia && (
              <div className="mt-4 p-4 rounded-2xl bg-white border border-rose-100 shadow-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#BD779A] text-xs font-semibold">
                      {currentMedia.type === 'video' ? (
                        <>
                          <Film className="w-3 h-3" />
                          <span>Video Memory</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3" />
                          <span>Photo Memory</span>
                        </>
                      )}
                    </span>

                    {/* ONLY FOR CHAPTER 3 AND CHAPTER 11: Option of Drive Stream or Direct MP4 */}
                    {isChapterWithDriveOption && currentMedia.type === 'video' && drivePreviewUrl && (
                      <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-stone-100 border border-stone-200 text-xs">
                        <button
                          type="button"
                          onClick={() => setVideoPlayerMode('local')}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                            videoPlayerMode === 'local'
                              ? 'bg-[#BD779A] text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          <Monitor className="w-3 h-3" />
                          <span>Direct MP4</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoPlayerMode('drive')}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                            videoPlayerMode === 'drive'
                              ? 'bg-[#BD779A] text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          <Cloud className="w-3 h-3" />
                          <span>Drive Stream</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Media Counter & (ONLY FOR CHAPTER 3 & 11) Drive Link */}
                  <div className="flex items-center gap-2">
                    {isChapterWithDriveOption && currentMedia.type === 'video' && driveFileLink && (
                      <a
                        href={driveFileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#925A7A] hover:text-[#BD779A] hover:underline cursor-pointer"
                      >
                        <span>Open in Drive</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    <span className="text-xs font-mono text-stone-400">
                      {activeMediaIndex + 1} of {activeChapter.mediaList.length}
                    </span>
                  </div>
                </div>

                {/* The Particular Description of this Image/Video */}
                <p className="text-sm text-stone-700 leading-relaxed font-light italic">
                  "{currentMedia.caption}"
                </p>
              </div>
            )}

            {/* Thumbnails Ribbon for multiple media items */}
            {activeChapter.mediaList && activeChapter.mediaList.length > 1 && (
              <div className="mt-4 flex items-center gap-2 overflow-x-auto py-1">
                {activeChapter.mediaList.map((media, idx) => {
                  const isSelected = idx === activeMediaIndex;
                  return (
                    <button
                      key={media.id || idx}
                      type="button"
                      onClick={() => {
                        setActiveMediaIndex(idx);
                        setVideoPlayerMode('local');
                      }}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#BD779A] ring-2 ring-rose-300 scale-105'
                          : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                      title={media.title || `Media ${idx + 1}`}
                    >
                      {media.type === 'video' ? (
                        <div className="relative w-full h-full bg-stone-900 flex items-center justify-center overflow-hidden">
                          <img
                            src={media.thumbnailSrc || getVideoThumbnail(media.src)}
                            alt={media.title || 'Video thumbnail'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                            <div className="w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-2xs shadow-xs">
                              <Film className="w-2.5 h-2.5 text-rose-300" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img src={media.src} alt="" className="w-full h-full object-cover" />
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-mono text-center">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
