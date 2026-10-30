/**
 * Countdown logic and timezone calculation for Kavisha's 19th Birthday
 * Target: 30 October 2026 at 12:00 AM IST (Asia/Kolkata, UTC+05:30)
 * Fixed UTC timestamp: 2026-10-29T18:30:00.000Z
 */

export const DEFAULT_BIRTHDAY_ISO = '2026-10-30T00:00:00+05:30';

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isUnlocked: boolean;
  formattedDays: string;
  formattedHours: string;
  formattedMinutes: string;
  formattedSeconds: string;
}

/**
 * Format a number with leading zero if needed
 */
export function padZero(val: number): string {
  const clamped = Math.max(0, Math.floor(val));
  return clamped < 10 ? `0${clamped}` : `${clamped}`;
}

/**
 * Parses target date string safely
 */
export function parseTargetDate(target: string | Date): number {
  if (target instanceof Date) {
    return target.getTime();
  }
  const parsed = new Date(target).getTime();
  if (Number.isNaN(parsed)) {
    // Fallback to default timestamp
    return new Date(DEFAULT_BIRTHDAY_ISO).getTime();
  }
  return parsed;
}

/**
 * Calculate remaining time between now and target
 * Supports injectable 'now' for testing, preview query parameters, and determinism
 */
export function getTimeRemaining(
  target: string | Date = DEFAULT_BIRTHDAY_ISO,
  nowInput?: Date | number
): TimeRemaining {
  const targetMs = parseTargetDate(target);
  const nowMs = typeof nowInput === 'number' 
    ? nowInput 
    : nowInput instanceof Date 
      ? nowInput.getTime() 
      : Date.now();

  const diffMs = targetMs - nowMs;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isUnlocked: true,
      formattedDays: '00',
      formattedHours: '00',
      formattedMinutes: '00',
      formattedSeconds: '00',
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isUnlocked: false,
    formattedDays: padZero(days),
    formattedHours: padZero(hours),
    formattedMinutes: padZero(minutes),
    formattedSeconds: padZero(seconds),
  };
}
