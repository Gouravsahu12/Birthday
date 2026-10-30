import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  buildGraphemeStream,
  reconstructTypedParagraphs,
  TypewriterGrapheme,
} from '../utils/typewriter';
import { playTypewriterClick } from '../utils/audioEffects';

export interface UseTypewriterOptions {
  paragraphs: string[];
  isActive: boolean;
  soundEnabled?: boolean;
  onComplete?: () => void;
  speedMultiplier?: number;
}

export function useTypewriter({
  paragraphs,
  isActive,
  soundEnabled = false,
  onComplete,
  speedMultiplier = 1,
}: UseTypewriterOptions) {
  const stream = useMemo(() => buildGraphemeStream(paragraphs), [paragraphs]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const totalChars = stream.length;

  const skipToEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisibleCount(totalChars);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [totalChars]);

  const restart = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisibleCount(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisibleCount(0);
      setIsComplete(false);
      return;
    }

    if (visibleCount >= totalChars) {
      setIsComplete(true);
      return;
    }

    const currentGrapheme: TypewriterGrapheme = stream[visibleCount];
    const delay = Math.max(
      8,
      Math.round((currentGrapheme?.pauseMs ?? 20) / Math.max(0.5, speedMultiplier))
    );

    timerRef.current = setTimeout(() => {
      if (soundEnabled && currentGrapheme) {
        playTypewriterClick(currentGrapheme.isParagraphEnd);
      }

      const nextCount = visibleCount + 1;
      setVisibleCount(nextCount);

      if (nextCount >= totalChars) {
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, visibleCount, totalChars, stream, speedMultiplier, soundEnabled]);

  const reconstructed = useMemo(() => {
    return reconstructTypedParagraphs(paragraphs, visibleCount, stream);
  }, [paragraphs, visibleCount, stream]);

  return {
    visibleParagraphs: reconstructed.visibleParagraphs,
    activeParagraphIndex: reconstructed.activeParagraphIndex,
    activeSegmentIndex: reconstructed.activeSegmentIndex,
    visibleCount,
    totalChars,
    isComplete,
    isTyping: isActive && !isComplete && visibleCount < totalChars,
    skipToEnd,
    restart,
  };
}
