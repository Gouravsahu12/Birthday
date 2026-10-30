import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_BIRTHDAY_ISO,
  getTimeRemaining,
  padZero,
  parseTargetDate,
} from './countdown.ts';

test('DEFAULT_BIRTHDAY_ISO resolves to 2026-10-29T18:30:00.000Z (midnight IST)', () => {
  const targetMs = parseTargetDate(DEFAULT_BIRTHDAY_ISO);
  const utcDate = new Date(targetMs).toISOString();
  assert.equal(utcDate, '2026-10-29T18:30:00.000Z');
});

test('padZero formats numbers with leading zeros correctly', () => {
  assert.equal(padZero(0), '00');
  assert.equal(padZero(5), '05');
  assert.equal(padZero(19), '19');
  assert.equal(padZero(100), '100');
});

test('getTimeRemaining computes accurate days, hours, minutes, seconds', () => {
  // Target: 2026-10-29T18:30:00.000Z
  // Test Now: 2 days, 3 hours, 4 minutes, 5 seconds prior
  const targetMs = new Date('2026-10-29T18:30:00.000Z').getTime();
  const testNowMs =
    targetMs -
    (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;

  const res = getTimeRemaining(DEFAULT_BIRTHDAY_ISO, testNowMs);

  assert.equal(res.isUnlocked, false);
  assert.equal(res.days, 2);
  assert.equal(res.hours, 3);
  assert.equal(res.minutes, 4);
  assert.equal(res.seconds, 5);
  assert.equal(res.formattedDays, '02');
  assert.equal(res.formattedHours, '03');
  assert.equal(res.formattedMinutes, '04');
  assert.equal(res.formattedSeconds, '05');
});

test('getTimeRemaining unlocks exactly when current time reaches target', () => {
  const targetMs = new Date(DEFAULT_BIRTHDAY_ISO).getTime();

  // Exactly at target
  const atTarget = getTimeRemaining(DEFAULT_BIRTHDAY_ISO, targetMs);
  assert.equal(atTarget.isUnlocked, true);
  assert.equal(atTarget.days, 0);
  assert.equal(atTarget.hours, 0);
  assert.equal(atTarget.minutes, 0);
  assert.equal(atTarget.seconds, 0);
  assert.equal(atTarget.formattedSeconds, '00');

  // 1 minute after target
  const afterTarget = getTimeRemaining(DEFAULT_BIRTHDAY_ISO, targetMs + 60000);
  assert.equal(afterTarget.isUnlocked, true);
});

test('getTimeRemaining handles invalid string fallback safely', () => {
  const fallback = getTimeRemaining('invalid-date-string', 0);
  assert.equal(typeof fallback.totalSeconds, 'number');
  assert.equal(fallback.isUnlocked, false);
});
