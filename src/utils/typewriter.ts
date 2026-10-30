/**
 * Typewriter logic and markdown/emoji token stream for realistic, human-paced typing.
 */

export interface TextSegment {
  text: string;
  isBold: boolean;
  isItalic: boolean;
}

export interface TypewriterParagraph {
  segments: TextSegment[];
}

export interface TypewriterGrapheme {
  char: string;
  paragraphIndex: number;
  segmentIndex: number;
  isBold: boolean;
  isItalic: boolean;
  pauseMs: number;
  isParagraphEnd?: boolean;
}

/**
 * Safely split text into unicode graphemes (preserving multi-byte emojis, skin-tone modifiers, ZWJ sequences)
 */
export function splitIntoGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    } catch {
      // Fallback below
    }
  }
  return Array.from(text);
}

/**
 * Parse a single paragraph with markdown bold (**text**) and italic (*text*) into styled segments.
 */
export function parseParagraphToSegments(paragraph: string): TextSegment[] {
  const parts = paragraph.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  const segments: TextSegment[] = [];

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      segments.push({
        text: part.slice(2, -2),
        isBold: true,
        isItalic: false,
      });
    } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      segments.push({
        text: part.slice(1, -1),
        isBold: false,
        isItalic: true,
      });
    } else {
      segments.push({
        text: part,
        isBold: false,
        isItalic: false,
      });
    }
  }

  return segments;
}

/**
 * Calculate natural human pause duration for a given character
 */
export function getTypingDelay(char: string, isParagraphEnd: boolean): number {
  if (isParagraphEnd) return 320;
  if (['.', '!', '?'].includes(char)) return 240;
  if ([',', ';', ':', '—', '-'].includes(char)) return 110;
  if (char === ' ') return 25;
  // Natural subtle human variance between 18ms and 28ms
  return 20;
}

/**
 * Build flat stream of graphemes across all paragraphs
 */
export function buildGraphemeStream(paragraphs: string[]): TypewriterGrapheme[] {
  const stream: TypewriterGrapheme[] = [];

  paragraphs.forEach((para, pIdx) => {
    const segments = parseParagraphToSegments(para);
    const isLastParagraph = pIdx === paragraphs.length - 1;

    segments.forEach((seg, sIdx) => {
      const chars = splitIntoGraphemes(seg.text);
      const isLastSegment = sIdx === segments.length - 1;

      chars.forEach((c, cIdx) => {
        const isLastCharOfPara = isLastSegment && cIdx === chars.length - 1;
        stream.push({
          char: c,
          paragraphIndex: pIdx,
          segmentIndex: sIdx,
          isBold: seg.isBold,
          isItalic: seg.isItalic,
          pauseMs: getTypingDelay(c, isLastCharOfPara && !isLastParagraph),
          isParagraphEnd: isLastCharOfPara,
        });
      });
    });
  });

  return stream;
}

/**
 * Reconstruct visible paragraphs from a slice of typed graphemes.
 */
export function reconstructTypedParagraphs(
  allParagraphs: string[],
  visibleCount: number,
  stream: TypewriterGrapheme[]
): {
  visibleParagraphs: {
    paragraphIndex: number;
    segments: TextSegment[];
  }[];
  activeParagraphIndex: number;
  activeSegmentIndex: number;
} {
  if (visibleCount <= 0 || stream.length === 0) {
    return {
      visibleParagraphs: [],
      activeParagraphIndex: 0,
      activeSegmentIndex: 0,
    };
  }

  const clampedCount = Math.min(visibleCount, stream.length);
  const activeGrapheme = stream[clampedCount - 1];

  // Map paragraphs up to activeParagraphIndex
  const pMap = new Map<number, Map<number, { text: string; isBold: boolean; isItalic: boolean }>>();

  for (let i = 0; i < clampedCount; i++) {
    const g = stream[i];
    if (!pMap.has(g.paragraphIndex)) {
      pMap.set(g.paragraphIndex, new Map());
    }
    const segMap = pMap.get(g.paragraphIndex)!;
    if (!segMap.has(g.segmentIndex)) {
      segMap.set(g.segmentIndex, {
        text: '',
        isBold: g.isBold,
        isItalic: g.isItalic,
      });
    }
    const segObj = segMap.get(g.segmentIndex)!;
    segObj.text += g.char;
  }

  const visibleParagraphs: { paragraphIndex: number; segments: TextSegment[] }[] = [];

  // Preserve ordered keys
  Array.from(pMap.keys())
    .sort((a, b) => a - b)
    .forEach((pIdx) => {
      const segMap = pMap.get(pIdx)!;
      const segments: TextSegment[] = [];
      Array.from(segMap.keys())
        .sort((a, b) => a - b)
        .forEach((sIdx) => {
          segments.push(segMap.get(sIdx)!);
        });
      visibleParagraphs.push({
        paragraphIndex: pIdx,
        segments,
      });
    });

  return {
    visibleParagraphs,
    activeParagraphIndex: activeGrapheme.paragraphIndex,
    activeSegmentIndex: activeGrapheme.segmentIndex,
  };
}
