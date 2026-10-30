import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseParagraphToSegments,
  splitIntoGraphemes,
  buildGraphemeStream,
  reconstructTypedParagraphs,
  getTypingDelay,
} from './typewriter';

test('parseParagraphToSegments extracts bold, italic and normal text accurately', () => {
  const text = 'Hello **Kavisha**! You are *magical* 🎂.';
  const segments = parseParagraphToSegments(text);

  assert.equal(segments.length, 5);
  assert.deepEqual(segments[0], { text: 'Hello ', isBold: false, isItalic: false });
  assert.deepEqual(segments[1], { text: 'Kavisha', isBold: true, isItalic: false });
  assert.deepEqual(segments[2], { text: '! You are ', isBold: false, isItalic: false });
  assert.deepEqual(segments[3], { text: 'magical', isBold: false, isItalic: true });
  assert.deepEqual(segments[4], { text: ' 🎂.', isBold: false, isItalic: false });
});

test('splitIntoGraphemes keeps multi-character emojis intact', () => {
  const text = '🎂❤️🌷🫶🏻';
  const graphemes = splitIntoGraphemes(text);

  assert.equal(graphemes.length, 4);
  assert.equal(graphemes[0], '🎂');
  assert.equal(graphemes[1], '❤️');
  assert.equal(graphemes[2], '🌷');
  assert.equal(graphemes[3], '🫶🏻');
});

test('getTypingDelay applies longer pauses to punctuation and paragraph endings', () => {
  assert.equal(getTypingDelay('.', false), 240);
  assert.equal(getTypingDelay('!', false), 240);
  assert.equal(getTypingDelay(',', false), 110);
  assert.equal(getTypingDelay('a', false), 20);
  assert.equal(getTypingDelay('z', true), 320); // paragraph end
});

test('buildGraphemeStream creates full sequence with metadata', () => {
  const paragraphs = [
    '**Hello** Kavisha',
    'Stay crazy! 🌷',
  ];
  const stream = buildGraphemeStream(paragraphs);

  // Paragraph 0: 'Hello' (5 chars, bold) + ' Kavisha' (8 chars, normal) = 13
  // Paragraph 1: 'Stay crazy! 🌷' (13 chars)
  assert.equal(stream.length, 26);
  assert.equal(stream[0].char, 'H');
  assert.equal(stream[0].isBold, true);
  assert.equal(stream[0].paragraphIndex, 0);

  // Check last char of first paragraph has isParagraphEnd: true
  const lastCharP0 = stream[12];
  assert.equal(lastCharP0.char, 'a');
  assert.equal(lastCharP0.isParagraphEnd, true);
  assert.equal(lastCharP0.paragraphIndex, 0);

  // Check second paragraph
  assert.equal(stream[13].char, 'S');
  assert.equal(stream[13].paragraphIndex, 1);
});

test('reconstructTypedParagraphs correctly reconstructs partial slices without corrupted tags', () => {
  const paragraphs = [
    '**Happy** Birthday!',
  ];
  const stream = buildGraphemeStream(paragraphs);

  // Slice first 3 characters: "Hap" (bold)
  const partial3 = reconstructTypedParagraphs(paragraphs, 3, stream);
  assert.equal(partial3.visibleParagraphs.length, 1);
  assert.equal(partial3.visibleParagraphs[0].segments.length, 1);
  assert.equal(partial3.visibleParagraphs[0].segments[0].text, 'Hap');
  assert.equal(partial3.visibleParagraphs[0].segments[0].isBold, true);

  // Full reconstruction
  const full = reconstructTypedParagraphs(paragraphs, stream.length, stream);
  assert.equal(full.visibleParagraphs.length, 1);
  assert.equal(full.visibleParagraphs[0].segments[0].text, 'Happy');
  assert.equal(full.visibleParagraphs[0].segments[1].text, ' Birthday!');
});
