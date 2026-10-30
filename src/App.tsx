/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BIRTHDAY_CONFIG } from './data/birthdayContent';
import { getTimeRemaining, TimeRemaining } from './utils/countdown';
import { FloatingPetals } from './components/FloatingPetals';
import { FloatingCatBackground } from './components/FloatingCatBackground';
import { MusicToggle } from './components/MusicToggle';
import { CountdownCard } from './components/CountdownCard';
import { FireworksReveal } from './components/FireworksReveal';
import { HeroSection } from './components/HeroSection';
import { MemoryBookSection } from './components/MemoryBookSection';
import { BirthdayEnvelope } from './components/BirthdayEnvelope';
import { MemoriesTimeline } from './components/MemoriesTimeline';
import { MiniInteractions } from './components/MiniInteractions';
import { SecretLetterModal } from './components/SecretLetterModal';
import { NewWorldTransition } from './components/NewWorldTransition';
import { NewWorldPage } from './components/NewWorldPage';
import { FinalSection } from './components/FinalSection';
import { Lock, Sparkles, RefreshCw } from 'lucide-react';
import { startMediaPreloading } from './utils/mediaPreloader';

type AppState = 'COUNTDOWN' | 'REVEAL' | 'MAIN_WORLD' | 'TRANSITION_NEW_WORLD' | 'NEW_WORLD';

export default function App() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    getTimeRemaining(BIRTHDAY_CONFIG.recipient.targetIso)
  );
  const [appState, setAppState] = useState<AppState>('COUNTDOWN');
  const [isPreviewUnlocked, setIsPreviewUnlocked] = useState(false);
  const [hasRevealedOnce, setHasRevealedOnce] = useState(false);

  // Start preloading all images and videos immediately when website starts
  useEffect(() => {
    startMediaPreloading();
  }, []);

  // Parse URL search params on mount to support ?previewUnlock=1, ?autostart=1, or ?page=new-world
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart') === '1' || params.get('previewUnlock') === '1' || params.get('preview') === 'true';
    const isNewWorld = params.get('page') === 'new-world' || params.get('newworld') === '1';

    if (isNewWorld) {
      setIsPreviewUnlocked(true);
      setAppState('NEW_WORLD');
    } else if (autostart) {
      setIsPreviewUnlocked(true);
      setAppState('MAIN_WORLD');
    }
  }, []);

  // Update countdown timer on interval, focus, and visibilitychange
  const updateTimer = useCallback(() => {
    const remaining = getTimeRemaining(BIRTHDAY_CONFIG.recipient.targetIso);
    setTimeRemaining(remaining);

    // If unlocked by real timestamp and not already in reveal or main world
    if (remaining.isUnlocked && !isPreviewUnlocked && appState === 'COUNTDOWN') {
      setAppState('REVEAL');
    }
  }, [appState, isPreviewUnlocked]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    const handleFocus = () => updateTimer();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateTimer();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [updateTimer]);

  // Handlers for state transitions
  const handlePreviewUnlock = () => {
    setIsPreviewUnlocked(true);
    setAppState('REVEAL');
  };

  const handleEnterWorld = () => {
    setHasRevealedOnce(true);
    setAppState('MAIN_WORLD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayMagic = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAppState('REVEAL');
  };

  const handleTransitionComplete = useCallback(() => {
    setAppState('NEW_WORLD');
  }, []);

  const handleReturnToCountdown = () => {
    setIsPreviewUnlocked(false);
    setAppState('COUNTDOWN');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isUnlocked = timeRemaining.isUnlocked || isPreviewUnlocked;

  return (
    <div className="relative min-h-screen text-[#513E51] font-sans antialiased selection:bg-[#F7DCE8] selection:text-[#925A7A]">
      {/* Background Floral Petals Canvas */}
      <FloatingPetals />

      {/* Floating Sidewise Ambient GIFs - Only on Main Page (removed from Countdown and Intro) */}
      {(appState === 'MAIN_WORLD' || appState === 'NEW_WORLD') && (
        <FloatingCatBackground />
      )}

      {/* Floating Sound Toggle */}
      <MusicToggle />

      {/* STATE A: Pre-Birthday Countdown Screen */}
      {appState === 'COUNTDOWN' && !isUnlocked && (
        <main className="relative z-10">
          <CountdownCard
            timeRemaining={timeRemaining}
            onPreviewUnlock={handlePreviewUnlock}
            isPreviewMode={isPreviewUnlocked}
          />
        </main>
      )}

      {/* STATE B: Celebration Fireworks & Reveal Sequence */}
      {appState === 'REVEAL' && (
        <main className="relative z-10">
          <FireworksReveal
            onEnterWorld={handleEnterWorld}
            onSkip={handleEnterWorld}
          />
        </main>
      )}

      {/* MAIN BIRTHDAY EXPERIENCE (7 Ordered Sections) */}
      {appState === 'MAIN_WORLD' && (
        <main className="relative z-10 animate-in fade-in duration-500">
          {/* Section 1: Hero */}
          <HeroSection />

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 py-6 text-stone-300" aria-hidden="true">
            <span>───</span>
            <span className="text-[#BD779A] text-sm">🌸</span>
            <span>───</span>
          </div>

          {/* Section 2: Interactive Birthday Letter */}
          <BirthdayEnvelope />

          {/* Interactive Memory Book Button (Magical Animation on Click) after Letter */}
          <MemoryBookSection />

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 py-6 text-stone-300" aria-hidden="true">
            <span>───</span>
            <span className="text-[#BD779A] text-sm">✨</span>
            <span>───</span>
          </div>

          {/* Section 3: Memories Timeline */}
          <MemoriesTimeline />

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 py-6 text-stone-300" aria-hidden="true">
            <span>───</span>
            <span className="text-[#BD779A] text-sm">🌿</span>
            <span>───</span>
          </div>

          {/* Section 5: Mini Interactions */}
          <MiniInteractions />

          {/* Section 6: Ending */}
          <FinalSection onReplay={handleReplayMagic} />

          {/* Hidden Easter Egg at last: The answers to all those question.... Opens when it was the right time */}
          <SecretLetterModal onUnlockSuccess={() => setAppState('TRANSITION_NEW_WORLD')} />
        </main>
      )}

      {/* Cinematic Dimensional Transition to NEW WORLD */}
      {appState === 'TRANSITION_NEW_WORLD' && (
        <NewWorldTransition onComplete={handleTransitionComplete} />
      )}

      {/* NEW WORLD Page */}
      {appState === 'NEW_WORLD' && (
        <div className="animate-in fade-in duration-700">
          <NewWorldPage onReturnToMain={() => setAppState('MAIN_WORLD')} />
        </div>
      )}
    </div>
  );
}
