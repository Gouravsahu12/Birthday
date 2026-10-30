/**
 * =========================================================================
 * KAVISHA'S 19TH BIRTHDAY - MASTER CONTENT & CONFIGURATION
 * =========================================================================
 * Project Codename: A Little World for Kavisha
 * Recipient: Kavisha (turning 19)
 * Creator: Gourav (close college friend)
 *
 * TO THE CREATOR (Gourav):
 * This single file controls all the text, photo captions, timeline milestones,
 * and placeholders. You can edit any string or asset path here anytime!
 */

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  src?: string; // Path relative to public/ e.g. "/images/gallery/photo-01.jpg"
  placeholderLabel: string;
  aspect: 'square' | 'portrait' | 'landscape';
  tag: string;
}

export interface SlideshowPhoto {
  id: string;
  title: string;
  src: string;
  tag?: string;
}

export interface TimelineMediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  title?: string;
  caption: string;
  tag?: string;
  driveRef?: string; // Numbered file reference from Google Drive (e.g. "1.jpg", "4.mp4")
  driveFileId?: string; // Direct Google Drive file ID
  drivePreviewUrl?: string; // Direct Google Drive embedded stream preview URL
  thumbnailSrc?: string; // High-resolution video snapshot thumbnail
}

export interface TimelineEntry {
  id: string;
  chapter: string;
  chapterNumber: number;
  date?: string;
  title: string;
  tag: string;
  message: string;
  thumbnailSrc?: string;
  mediaList: TimelineMediaItem[];
  photoSrc?: string; // Backward compatibility
  videoSrc?: string;
  placeholderHint?: string;
}

export interface BirthdayWish {
  id: number;
  year: number;
  wish: string;
  icon: string;
}

export const CHAPTER_DATES: Record<number, string> = {
  1: '13 Sep,2025',
  2: '24 Sep,2025',
  3: '14 Nov,2025',
  4: '21 Nov,2025',
  5: '19 Dec,2025',
  6: '31 Dec,2025',
  7: '03 Jan,2026',
  8: '9 Mar,2026',
  9: '28 Mar,2026',
  10: '18 Apr,2026',
  11: '25 Apr,2026',
  12: '29 Apr,2026',
  13: '06 May,2026',
  14: '09 May,2026',
  15: '19 Jun,2026',
  16: '01 Jul,2025',
  17: '31 Aug,2026',
  18: '20 Sep,2026',
  19: '17 Oct,2026',
};

export const BIRTHDAY_CONFIG = {
  // Recipient details
  recipient: {
    name: 'Kavisha',
    fullName: 'Kavisha',
    turningAge: 19,
    birthdayDateFormatted: '30 October 2026',
    // Exact target: 30 October 2026 at 12:00 AM IST (UTC+05:30)
    // Equivalent UTC: 2026-10-29T18:30:00.000Z
    targetIso: '2026-10-30T00:00:00+05:30',
  },

  // Creator details (optional sign-off)
  creator: {
    name: 'Gourav',
    showSignOff: true,
  },

  // Audio configuration
  audio: {
    // Leave empty or set to "/audio/birthday-ambient.mp3" when audio file is supplied
    src: '', 
    title: 'Dreamy Chimes & Soft Harp',
    description: 'Calm ambient chords for Kavisha (User-controlled)',
  },

  // Pre-Birthday Countdown Screen copy
  preBirthday: {
    brandLabel: 'a little world for kavisha',
    headline: 'Something lovely is waiting for you.',
    subhead:
      'A little world filled with memories, flowers, and all the things that make you you.',
    cardHeading: 'Until your special day',
    cardSubhead: '30 October 2026 · 19th birthday',
    waitingNote: 'Some surprises are worth waiting for.',
    lockedPill: 'Your little surprise is still tucked away.',
    timeZoneNote: 'Counting down to 12:00 AM IST',
  },

  // Birthday Reveal Screen copy (Triggered at 00:00 IST)
  reveal: {
    badge: '19 Years of Sunshine 🌸',
    headline: 'HAPPY 19TH BIRTHDAY, KAVISHA! 🎂🌷',
    subhead: `Today is all about you.
I've made a little something to celebrate the person who has made so many ordinary college days feel special.
Ready to see it?`,
    primaryButton: 'Open Your Little World ✨',
  },

  // Section 1: Hero
  hero: {
    greeting: 'Happy 19th Birthday, Kavisha!',
    subtitle: '19 looks like another beautiful chapter waiting to happen.',
    scrollCue: "Let's take a little trip down memory lane",
    welcomeNote:
      'Welcome to your personal sanctuary—crafted with soft colors, gentle petals, and heartfelt moments.',
  },

  // Dedicated Top Slideshow Photos (All 7 real photos of Kavisha - AI generated photo removed)
  slideshowPhotos: [
    {
      id: 'slide-childhood',
      title: 'Childhood Birthday Sunshine',
      src: '/assets/aistudio/1792523031809_9f939f49.png',
      tag: 'Little Sunshine',
    },
    {
      id: 'slide-photo-1',
      title: 'Celebration Moments',
      src: '/images/gallery/photo-01.jpg',
      tag: 'Celebration',
    },
    {
      id: 'slide-photo-2',
      title: 'Laughter Over Chai',
      src: '/images/gallery/photo-02.jpg',
      tag: 'Little Things',
    },
    {
      id: 'slide-photo-3',
      title: 'Radiant Smile',
      src: '/images/gallery/photo-03.jpg',
      tag: 'Pure Joy',
    },
    {
      id: 'slide-photo-4',
      title: 'Golden Hour Walk',
      src: '/images/gallery/photo-04.jpg',
      tag: 'Serenity',
    },
    {
      id: 'slide-photo-5',
      title: 'College Days',
      src: '/images/gallery/photo-05.jpg',
      tag: 'College Life',
    },
    {
      id: 'slide-photo-6',
      title: 'Here’s to Nineteen',
      src: '/images/gallery/photo-06.jpg',
      tag: 'Milestone 19',
    },
    {
      id: 'slide-photo-7',
      title: 'Candid Warmth',
      src: '/images/gallery/photo-07.png',
      tag: 'Special Memories',
    },
    {
      id: 'slide-photo-8',
      title: 'Joyful Moments',
      src: '/images/gallery/photo-08.jpg',
      tag: 'Everyday Smiles',
    },
    {
      id: 'slide-photo-9',
      title: 'Radiant Spirit',
      src: '/images/gallery/photo-09.png',
      tag: 'Sunshine',
    },
    {
      id: 'slide-photo-10',
      title: 'Golden Days',
      src: '/images/gallery/photo-10.jpg',
      tag: 'Good Times',
    },
    {
      id: 'slide-photo-11',
      title: 'Forever Friends',
      src: '/images/gallery/photo-11.jpg',
      tag: 'Besties',
    },
    {
      id: 'slide-photo-12',
      title: 'Sweet 19',
      src: '/images/gallery/photo-12.png',
      tag: 'Nineteen',
    },
  ] as SlideshowPhoto[],

  // Section 2: Memory Gallery (Memory Book - 12 photos across interactive spreads)
  gallery: {
    sectionTitle: 'Moments Frozen in Petals',
    sectionSubtitle: 'A collection of smiles, candid laughter, and everyday memories.',
    photos: [
      {
        id: 'photo-1',
        title: 'College Mornings',
        caption: 'That effortless radiant smile that brightens up even early morning lectures.',
        src: '/images/gallery/photo-01.jpg',
        placeholderLabel: 'Add Photo 01: College Mornings',
        aspect: 'portrait',
        tag: 'Campus Days',
      },
      {
        id: 'photo-2',
        title: 'Laughter Over Chai',
        caption: 'Where two minutes turned into two hours of non-stop talking and shared jokes.',
        src: '/images/gallery/photo-02.jpg',
        placeholderLabel: 'Add Photo 02: Chai & Catchups',
        aspect: 'landscape',
        tag: 'Little Things',
      },
      {
        id: 'photo-3',
        title: 'The Best Candid',
        caption: 'Caught mid-laugh without a care in the world. Always preserve this joy.',
        src: '/images/gallery/photo-03.jpg',
        placeholderLabel: 'Add Photo 03: Candid Smiles',
        aspect: 'square',
        tag: 'Pure Joy',
      },
      {
        id: 'photo-4',
        title: 'Golden Hour Walk',
        caption: 'Quiet strolls where the sky matched your calm, gentle energy.',
        src: '/images/gallery/photo-04.jpg',
        placeholderLabel: 'Add Photo 04: Golden Hour',
        aspect: 'portrait',
        tag: 'Serenity',
      },
      {
        id: 'photo-5',
        title: 'Exam Season Survival',
        caption: 'Shared panic, notes exchanged at 2 AM, and victorious treats after.',
        src: '/images/gallery/photo-05.jpg',
        placeholderLabel: 'Add Photo 05: Surviving Exams',
        aspect: 'landscape',
        tag: 'College Life',
      },
      {
        id: 'photo-6',
        title: 'Here’s to Nineteen',
        caption: 'Stepping into 19 with grace, kindness, and boundless dreams ahead.',
        src: '/images/gallery/photo-06.jpg',
        placeholderLabel: 'Add Photo 06: Milestone 19',
        aspect: 'square',
        tag: 'Chapter 19',
      },
      {
        id: 'photo-7',
        title: 'Candid Warmth',
        caption: 'Genuine moments of laughter that remind me why you make every day so bright.',
        src: '/images/gallery/photo-07.png',
        placeholderLabel: 'Add Photo 07: Candid Warmth',
        aspect: 'portrait',
        tag: 'Special Memories',
      },
      {
        id: 'photo-8',
        title: 'Joyful Moments',
        caption: 'Unfiltered happiness and good times that make college unforgettable.',
        src: '/images/gallery/photo-08.jpg',
        placeholderLabel: 'Add Photo 08: Joyful Moments',
        aspect: 'portrait',
        tag: 'Everyday Smiles',
      },
      {
        id: 'photo-9',
        title: 'Radiant Spirit',
        caption: 'Your calm, positive energy brings warmth wherever you are.',
        src: '/images/gallery/photo-09.png',
        placeholderLabel: 'Add Photo 09: Radiant Spirit',
        aspect: 'portrait',
        tag: 'Sunshine',
      },
      {
        id: 'photo-10',
        title: 'Golden Days',
        caption: 'Looking back at moments that turned into our favorite inside jokes.',
        src: '/images/gallery/photo-10.jpg',
        placeholderLabel: 'Add Photo 10: Golden Days',
        aspect: 'portrait',
        tag: 'Good Times',
      },
      {
        id: 'photo-11',
        title: 'Forever Friends',
        caption: 'Through thick and thin, through chaotic assignments and late night chats.',
        src: '/images/gallery/photo-11.jpg',
        placeholderLabel: 'Add Photo 11: Forever Friends',
        aspect: 'portrait',
        tag: 'Besties',
      },
      {
        id: 'photo-12',
        title: 'Sweet 19',
        caption: 'Stepping into 19 with all the magic and wonderful adventures waiting for you.',
        src: '/images/gallery/photo-12.png',
        placeholderLabel: 'Add Photo 12: Sweet 19',
        aspect: 'portrait',
        tag: 'Nineteen',
      },
    ] as GalleryPhoto[],
  },

  // Section 3: Interactive Birthday Letter
  letter: {
    sectionTitle: 'A Note For You',
    sectionSubtitle: 'Tap the wax seal to unfold your birthday letter.',
    envelopePrompt: 'Open Letter',
    salutation: 'Dearest Kavisha,',
    paragraphs: [
      '**Firstly, happiest birthday to you, Kavisha! 🎂❤️🌷**',
      'I hope the coming years of your life are filled with joy, happiness, and success. May your NIMBU MIRCH always stay strong 😂🌶️. You deserve a beautiful year ahead!',
      "Honestly, as you're the close friend I've ever had like this, I've had so much fun with you. Sometimes, you even make my entire day better without even realizing it. 🥹❤️ Classes feel so boring without you, and I guess it's because you've become such a special part of my everyday life. You're like a little light that makes my days brighter. ✨",
      "I've learned so much from you, and I'm still learning. One thing I can say with complete confidence is that you're the best girl I've ever met. 🫶🏻 Even though you tease me sometimes it's fine… I'll manage somehow! 🤡",
      "And as I've told you before, I don't need a whole group of friends when I have one bestie like you. 💗 Quality over quantity, right? 😌🤝🏻",
      "There are so many things I want to say about you, but honestly, I can't type them all here. This note would turn into a whole book! 😂📖",
      "I know your birthday is a special day for you, and I'll always try my best to make you feel special—not just this year, but Forever. 🥹💝 Always stay the same happy, crazy, fun-loving person you are. Never lose that *mastii* of yours! 😂✨",
      "And remember, I'm always here for you whenever you need me, wherever you are and whenever that may be. You don't have to face everything alone. ❤️🫂",
      'Never doubt your capabilities. Stay true to the lovely person you are, and keep chasing whatever makes your heart light up. You have so much potential, and I genuinely hope life gives you countless reasons to smile. 🌷✨',
      '**Once again, happiest 19th birthday 🎉❤️**',
    ],
    signoff: 'Yours lovely,',
    author: 'Gourav',
    postscript: '',
  },

  // Section 4: Memories Timeline
  timeline: {
    sectionTitle: 'Our Journey Across Time',
    sectionSubtitle: 'Nineteen chapters celebrating your journey, our closest friendship, laughter, and beautiful milestones.',
    entries: [
      {
        id: 'chapter-01',
        chapter: 'Chapter 01',
        chapterNumber: 1,
        date: '13 Sep,2025',
        title: 'Our First Meet through SIH',
        tag: 'First Hello',
        message: 'This was the first hackathon of out life where we failed but Somehow I won ....😊',
        thumbnailSrc: '/images/timeline/11.jpg',
        mediaList: [
          {
            id: 'ch1-m1',
            type: 'image',
            src: '/images/timeline/11.jpg',
            title: 'Our First Meet through SIH',
            caption: 'This was the first hackathon of out life where we failed but Somehow I won ....😊',
            tag: 'First Hello',
            driveRef: '11.jpg',
          },
        ],
      },
      {
        id: 'chapter-02',
        chapter: 'Chapter 02',
        chapterNumber: 2,
        date: '24 Sep,2025',
        title: 'MF Workshop',
        tag: 'Majdoori',
        message: 'Look at the happiness after cutting a unnecessary iron piece😂btw I also helped in it.',
        thumbnailSrc: '/images/timeline/24.png',
        mediaList: [
          {
            id: 'ch2-m1',
            type: 'video',
            src: '/videos/timeline/21-video.mp4',
            thumbnailSrc: '/videos/thumbnails/21-video.jpg',
            title: 'MF Workshop',
            caption: 'Look at the happiness after cutting a unnecessary iron piece😂btw I also helped in it.',
            tag: 'Majdoori',
          },
          {
            id: 'ch2-m2',
            type: 'video',
            src: '/videos/timeline/22-video.mp4',
            thumbnailSrc: '/videos/thumbnails/22-video.jpg',
            title: 'MF Workshop',
            caption: 'Look at my dedication in doing this non-sense stuff😐',
            tag: 'Majdoori',
          },
          {
            id: 'ch2-m3',
            type: 'video',
            src: '/videos/timeline/23.mp4',
            thumbnailSrc: '/videos/thumbnails/23.jpg',
            title: 'Drilling Operation',
            caption: 'This was the last time when we visited the workshop and we actually done the drilling operation.',
            tag: 'Majdoori',
          },
          {
            id: 'ch2-m4',
            type: 'image',
            src: '/images/timeline/24.png',
            title: 'MF Workshop',
            caption: 'Look at that proud smile with the hacksaw after all our workshop majdoori! 😄🪚',
            tag: 'Majdoori',
          },
        ],
      },
      {
        id: 'chapter-03',
        chapter: 'Chapter 03',
        chapterNumber: 3,
        date: '14 Nov,2025',
        title: 'Commerce Fest',
        tag: 'Party time',
        message: 'First fest in our collage, by GGTC😂 and we were so happy that day enjoying roming everywhere',
        thumbnailSrc: '/images/timeline/41.jpg',
        mediaList: [
          {
            id: 'ch3-m1',
            type: 'image',
            src: '/images/timeline/41.jpg',
            title: 'Commerce Fest',
            caption: 'First fest in our collage, by GGTC😂 and we were so happy that day enjoying roming everywhere',
            tag: 'Party time',
          },
          {
            id: 'ch3-m2',
            type: 'image',
            src: '/images/timeline/42.jpg',
            title: 'Photo session',
            caption: 'Photo session',
            tag: 'Party time',
          },
          {
            id: 'ch3-m3',
            type: 'image',
            src: '/images/timeline/43.jpg',
            title: 'DND Japu',
            caption: 'DND 🤫Japu is sleeping😴',
            tag: 'Party time',
          },
          {
            id: 'ch3-m4',
            type: 'video',
            src: '/videos/timeline/44.mp4',
            thumbnailSrc: '/videos/thumbnails/44.jpg',
            driveFileId: '1lAxv6wdXM-_FOYAvtZQXIo-jmu6E3dWu',
            drivePreviewUrl: 'https://drive.google.com/file/d/1lAxv6wdXM-_FOYAvtZQXIo-jmu6E3dWu/preview',
            title: 'Game time',
            caption: 'Game time , last stage me unka dart hi kharab tha nhi toh jeet jaate',
            tag: 'Party time',
          },
        ],
      },
      {
        id: 'chapter-04',
        chapter: 'Chapter 04',
        chapterNumber: 4,
        date: '21 Nov,2025',
        title: 'Serious Fight',
        tag: 'Fight-Fair',
        message: 'I remember each and every word you said at that day, and Honestly if you hadn\'t cleared things up that day, I wouldn\'t have brought it up later either and genuinely my ego was hust that day.\nBut jsut like you I was also happy that thing happen.',
        thumbnailSrc: '/images/timeline/48.png',
        mediaList: [
          {
            id: 'ch4-m1',
            type: 'image',
            src: '/images/timeline/48.png',
            title: 'Serious Fight',
            caption: 'I remember each and every word you said at that day, and Honestly if you hadn\'t cleared things up that day, I wouldn\'t have brought it up later either and genuinely my ego was hust that day.\nBut jsut like you I was also happy that thing happen.',
            tag: 'Fight-Fair',
          },
          {
            id: 'ch4-m2',
            type: 'image',
            src: '/images/timeline/49.png',
            title: 'Chats & Happy Ending',
            caption: 'Whenever we\'ll get time, we will read these chats.\nwhich has Happy Ending...of that part',
            tag: 'Fight-Fair',
          },
        ],
      },
      {
        id: 'chapter-05',
        chapter: 'Chapter 05',
        chapterNumber: 5,
        date: '19 Dec,2025',
        title: 'Swatch Bharat',
        tag: 'Acting',
        message: 'Planted a plant which is already planted',
        thumbnailSrc: '/images/timeline/52.jpg',
        mediaList: [
          {
            id: 'ch5-m1',
            type: 'image',
            src: '/images/timeline/52.jpg',
            title: 'Plantation Acting',
            caption: 'Planted a plant which is already planted',
            tag: 'Acting',
          },
          {
            id: 'ch5-m2',
            type: 'image',
            src: '/images/timeline/51.jpg',
            title: 'Peak Acting',
            caption: 'What a peak acting we did for just 10-20 marks. I thing u are looking something to eat😂😂',
            tag: 'Acting',
          },
          {
            id: 'ch5-m3',
            type: 'image',
            src: '/images/timeline/53.jpg',
            title: 'Hand Wash Tutorial',
            caption: 'How not to wash our Hands',
            tag: 'Acting',
          },
        ],
      },
      {
        id: 'chapter-06',
        chapter: 'Chapter 06',
        chapterNumber: 6,
        date: '31 Dec,2025',
        title: 'Bunking collage for the first time',
        tag: 'Ghumi-Ghumi',
        message: 'Seriously we went outside of our collage after bunking classes for a lunch.',
        thumbnailSrc: '/images/timeline/61.jpg',
        mediaList: [
          {
            id: 'ch6-m1',
            type: 'image',
            src: '/images/timeline/61.jpg',
            title: 'Bunking for Lunch',
            caption: 'Seriously we went outside of our collage after bunking classes for a lunch.',
            tag: 'Ghumi-Ghumi',
          },
          {
            id: 'ch6-m2',
            type: 'image',
            src: '/images/timeline/62.jpg',
            title: 'College Life Vibes',
            caption: 'we actually liked collage life that day.',
            tag: 'Ghumi-Ghumi',
          },
        ],
      },
      {
        id: 'chapter-07',
        chapter: 'Chapter 07',
        chapterNumber: 7,
        date: '03 Jan,2026',
        title: 'Winter Breeze',
        tag: '3 happiness',
        message: 'Remember we were so nervous at the beginning because the result of Techsprint Hackathon was about to come anytime and U also asked a question to Chetan Bhagat which nobody listened😁.',
        thumbnailSrc: '/images/timeline/71.jpg',
        mediaList: [
          {
            id: 'ch7-m1',
            type: 'image',
            src: '/images/timeline/71.jpg',
            title: 'Techsprint & Chetan Bhagat',
            caption: 'Remember we were so nervous at the beginning because the result of Techsprint Hackathon was about to come anytime and U also asked a question to Chetan Bhagat which nobody listened😁.',
            tag: '3 happiness',
          },
          {
            id: 'ch7-m2',
            type: 'image',
            src: '/images/timeline/72.jpg',
            title: 'Enjoyment',
            caption: 'Enjoyment',
            tag: '3 happiness',
          },
          {
            id: 'ch7-m3',
            type: 'image',
            src: '/images/timeline/73.jpg',
            title: 'Next',
            caption: 'Next',
            tag: '3 happiness',
          },
          {
            id: 'ch7-m4',
            type: 'image',
            src: '/images/timeline/74.jpg',
            title: 'Forgiveness & Friendship',
            caption: 'Do u remember the count of SORRY I said at that last moment of fest where I genuinely felt guilty and sad, idk that word came out of frustration I guess... but nice part is u forgive me😊',
            tag: '3 happiness',
          },
        ],
      },
      {
        id: 'chapter-08',
        chapter: 'Chapter 08',
        chapterNumber: 8,
        date: '9 Mar,2026',
        title: 'Small Happiness',
        tag: 'Fries',
        message: 'Chilling eating french fries  which was brought by me',
        thumbnailSrc: '/videos/thumbnails/91.jpg',
        mediaList: [
          {
            id: 'ch8-m1',
            type: 'video',
            src: '/videos/timeline/91.mp4',
            thumbnailSrc: '/videos/thumbnails/91.jpg',
            title: 'Small Happiness',
            caption: 'Chilling eating french fries  which was brought by me',
            tag: 'Fries',
          },
        ],
      },
      {
        id: 'chapter-09',
        chapter: 'Chapter 09',
        chapterNumber: 9,
        date: '28 Mar,2026',
        title: 'Foss Hackathon',
        tag: 'coders',
        message: 'We finally did something unique at that time and deployed our first website and we were so confident at that time but we got to know about harsh reality of collage politics and came back with lot of disappointments...',
        thumbnailSrc: '/images/timeline/103.jpg',
        mediaList: [
          {
            id: 'ch9-m1',
            type: 'image',
            src: '/images/timeline/103.jpg',
            title: 'Foss Hackathon',
            caption: 'We finally did something unique at that time and deployed our first website and we were so confident at that time but we got to know about harsh reality of collage politics and came back with lot of disappointments...',
            tag: 'coders',
          },
          {
            id: 'ch9-m2',
            type: 'image',
            src: '/images/timeline/101.jpg',
            title: 'Deploying First Website',
            caption: 'We finally did something unique at that time and deployed our first website and we were so confident at that time but we got to know about harsh reality of collage politics and came back with lot of disappointments...',
            tag: 'coders',
          },
          {
            id: 'ch9-m3',
            type: 'image',
            src: '/images/timeline/102.jpg',
            title: 'Coders at Work',
            caption: 'We finally did something unique at that time and deployed our first website and we were so confident at that time but we got to know about harsh reality of collage politics and came back with lot of disappointments...',
            tag: 'coders',
          },
        ],
      },
      {
        id: 'chapter-10',
        chapter: 'Chapter 10',
        chapterNumber: 10,
        date: '18 Apr,2026',
        title: 'Sheesha',
        tag: 'Dance',
        message: 'Nice dance, ig u can teach me how to dance in entire collage time....And then I can add another skill in resume😂',
        thumbnailSrc: '/videos/thumbnails/111.jpg',
        mediaList: [
          {
            id: 'ch10-m1',
            type: 'video',
            src: '/videos/timeline/111.mp4',
            thumbnailSrc: '/videos/thumbnails/111.jpg',
            title: 'Sheesha Dance',
            caption: 'Nice dance, ig u can teach me how to dance in entire collage time....And then I can add another skill in resume😂',
            tag: 'Dance',
          },
        ],
      },
      {
        id: 'chapter-11',
        chapter: 'Chapter 11',
        chapterNumber: 11,
        date: '25 Apr,2026',
        title: 'Playing games after bunking',
        tag: 'Masti',
        message: 'Playing UNO...',
        thumbnailSrc: '/images/timeline/122.jpg',
        mediaList: [
          {
            id: 'ch11-m1',
            type: 'image',
            src: '/images/timeline/122.jpg',
            title: 'Playing UNO',
            caption: 'Playing UNO...',
            tag: 'Masti',
          },
          {
            id: 'ch11-m2',
            type: 'video',
            src: '/videos/timeline/121.mp4',
            thumbnailSrc: '/videos/thumbnails/121.jpg',
            driveFileId: '1ideoFEBuyeXXKDFZzGzHk9FPbXGZx_oS',
            drivePreviewUrl: 'https://drive.google.com/file/d/1ideoFEBuyeXXKDFZzGzHk9FPbXGZx_oS/preview',
            title: 'Dum Sharaarat',
            caption: 'Dum sharaarat where u are putting all ur energy to make them guess...😄',
            tag: 'Masti',
          },
        ],
      },
      {
        id: 'chapter-12',
        chapter: 'Chapter 12',
        chapterNumber: 12,
        date: '29 Apr,2026',
        title: 'Japneet\'s Birthday',
        tag: 'Cake',
        message: 'I think something stuckked in ur teeth...😂but honestly ur are PHOTOGENIC🤩',
        thumbnailSrc: '/images/timeline/132.jpg',
        mediaList: [
          {
            id: 'ch12-m1',
            type: 'image',
            src: '/images/timeline/132.jpg',
            title: 'Photogenic Smile',
            caption: 'I think something stuckked in ur teeth...😂but honestly ur are PHOTOGENIC🤩',
            tag: 'Cake',
          },
          {
            id: 'ch12-m2',
            type: 'image',
            src: '/images/timeline/131.jpg',
            title: 'Skin Care Started',
            caption: 'Skin care started👍🏻🥲',
            tag: 'Cake',
          },
          {
            id: 'ch12-m3',
            type: 'image',
            src: '/images/timeline/133.jpg',
            title: 'Same Cake Celebration',
            caption: 'Cut the same cake, mera kharcha kam hoga😁',
            tag: 'Cake',
          },
        ],
      },
      {
        id: 'chapter-13',
        chapter: 'Chapter 13',
        chapterNumber: 13,
        date: '06 May,2026',
        title: 'First Song',
        tag: 'Singing',
        message: '🎤Song was still incomplete, but karenge ek din issko complete.',
        thumbnailSrc: '/videos/thumbnails/141_-_song.jpg',
        mediaList: [
          {
            id: 'ch13-m1',
            type: 'video',
            src: '/videos/timeline/141_-_song.mp4',
            thumbnailSrc: '/videos/thumbnails/141_-_song.jpg',
            title: 'First Song',
            caption: '🎤Song was still incomplete, but karenge ek din issko complete.',
            tag: 'Singing',
          },
        ],
      },
      {
        id: 'chapter-14',
        chapter: 'Chapter 14',
        chapterNumber: 14,
        date: '09 May,2026',
        title: 'GD Competition',
        tag: '1st Price',
        message: 'first time u got 1st price in something,and  ig u still didn\'t get the certificate??',
        thumbnailSrc: '/images/timeline/152.png',
        mediaList: [
          {
            id: 'ch14-m1',
            type: 'image',
            src: '/images/timeline/152.png',
            title: 'GD Competition 1st Price',
            caption: 'first time u got 1st price in something,and  ig u still didn\'t get the certificate??',
            tag: '1st Price',
          },
          {
            id: 'ch14-m2',
            type: 'video',
            src: '/videos/timeline/151.mp4',
            thumbnailSrc: '/videos/thumbnails/151.jpg',
            title: 'GD Competition Celebration',
            caption: 'first time u got 1st price in something,and  ig u still didn\'t get the certificate??',
            tag: '1st Price',
          },
        ],
      },
      {
        id: 'chapter-15',
        chapter: 'Chapter 15',
        chapterNumber: 15,
        date: '19 Jun,2026',
        title: 'Haddi and Preeti Battle',
        tag: 'Role-play',
        message: 'An English lab activity of roleplay of different characters,\nPreeti rosted haddi💀 but i somehow defended.',
        thumbnailSrc: '/images/timeline/158.jpg',
        mediaList: [
          {
            id: 'ch15-m1',
            type: 'image',
            src: '/images/timeline/158.jpg',
            title: 'Haddi and Preeti Battle',
            caption: 'An English lab activity of roleplay of different characters,\nPreeti rosted haddi💀 but i somehow defended.',
            tag: 'Role-play',
            driveRef: '158.jpg',
          },
          {
            id: 'ch15-m2',
            type: 'video',
            src: '/videos/timeline/159.mp4',
            thumbnailSrc: '/videos/thumbnails/159.jpg',
            title: 'Preeti Roasted Haddi',
            caption: 'An English lab activity of roleplay of different characters,\nPreeti rosted haddi💀 but i somehow defended.',
            tag: 'Role-play',
            driveRef: '159.mp4',
          },
        ],
      },
      {
        id: 'chapter-16',
        chapter: 'Chapter 16',
        chapterNumber: 16,
        date: '01 Jul,2025',
        title: 'Open Day',
        tag: 'Masti',
        message: 'Another fun day',
        thumbnailSrc: '/images/timeline/161.jpg',
        mediaList: [
          {
            id: 'ch16-m1',
            type: 'image',
            src: '/images/timeline/161.jpg',
            title: 'Open Day Memories',
            caption: 'Another fun day',
            tag: 'Masti',
            driveRef: '161.jpg',
          },
          {
            id: 'ch16-m2',
            type: 'image',
            src: '/images/timeline/162.jpg',
            title: 'Campus Fun',
            caption: 'Another fun day',
            tag: 'Masti',
            driveRef: '162.jpg',
          },
          {
            id: 'ch16-m3',
            type: 'image',
            src: '/images/timeline/163.jpg',
            title: 'Working on it',
            caption: 'Working on it',
            tag: 'Masti',
            driveRef: '163.jpg',
          },
          {
            id: 'ch16-m4',
            type: 'image',
            src: '/images/timeline/164.jpg',
            title: 'IYKYK',
            caption: 'IYKYK',
            tag: 'Masti',
            driveRef: '164.jpg',
          },
        ],
      },
      {
        id: 'chapter-17',
        chapter: 'Chapter 17',
        chapterNumber: 17,
        date: '31 Aug,2026',
        title: 'SIH 26',
        tag: 'Hackathon',
        message: 'Somehow we created a SIH team choose a PS and made INSPECTRA and we got Selected🥳  for 2nd round and still waiting for results...',
        thumbnailSrc: '/images/timeline/171.jpg',
        mediaList: [
          {
            id: 'ch17-m1',
            type: 'image',
            src: '/images/timeline/171.jpg',
            title: 'INSPECTRA Team',
            caption: 'Somehow we created a SIH team choose a PS and made INSPECTRA and we got Selected🥳  for 2nd round and still waiting for results...',
            tag: 'Hackathon',
            driveRef: '171.jpg',
          },
        ],
      },
      {
        id: 'chapter-18',
        chapter: 'Chapter 18',
        chapterNumber: 18,
        date: '20 Sep,2026',
        title: 'Finally Movie Time',
        tag: 'Movie',
        message: 'Finally Movie Time',
        thumbnailSrc: '/images/timeline/181.jpg',
        mediaList: [
          {
            id: 'ch18-m1',
            type: 'image',
            src: '/images/timeline/181.jpg',
            title: 'Finally Movie Time',
            caption: 'Finally Movie Time',
            tag: 'Movie',
            driveRef: '181.jpg',
          },
          {
            id: 'ch18-m2',
            type: 'image',
            src: '/images/timeline/182.jpg',
            title: 'Nimbu Mirchi Plan',
            caption: 'I was so happy finally my plan worked with help of ur nimbu mirchi idk, we had so much fun, rain ruined the another plan but its okkk.',
            tag: 'Movie',
            driveRef: '182.jpg',
          },
          {
            id: 'ch18-m3',
            type: 'image',
            src: '/images/timeline/183.jpg',
            title: 'Money Follows',
            caption: 'Money Follows.....🤑',
            tag: 'Movie',
            driveRef: '183.jpg',
          },
          {
            id: 'ch18-m4',
            type: 'image',
            src: '/images/timeline/184.jpg',
            title: 'DHBHA 86 Spotting',
            caption: 'Smarty😎 Boy spotted at DHBHA 86',
            tag: 'Movie',
            driveRef: '184.jpg',
          },
          {
            id: 'ch18-m5',
            type: 'video',
            src: '/videos/timeline/185.mp4',
            thumbnailSrc: '/videos/thumbnails/185.jpg',
            title: 'Hiii Bolooo',
            caption: 'Hiii bolooo',
            tag: 'Movie',
            driveRef: '185.mp4',
          },
        ],
      },
      {
        id: 'chapter-19',
        chapter: 'Chapter 19',
        chapterNumber: 19,
        date: '17 Oct,2026',
        title: 'Garba Night',
        tag: 'twirling',
        message: 'Doing everything except garba😁.',
        thumbnailSrc: '/images/timeline/191.jpg',
        mediaList: [
          {
            id: 'ch19-m1',
            type: 'image',
            src: '/images/timeline/191.jpg',
            title: 'Garba Night Twirls',
            caption: 'Doing everything except garba😁.',
            tag: 'twirling',
            driveRef: '191.jpg',
          },
          {
            id: 'ch19-m2',
            type: 'image',
            src: '/images/timeline/192.jpg',
            title: 'Garba Celebrations',
            caption: 'Doing everything except garba😁.',
            tag: 'twirling',
            driveRef: '192.jpg',
          },
          {
            id: 'ch19-m3',
            type: 'image',
            src: '/images/timeline/193.jpg',
            title: 'Unexplainable Story',
            caption: 'The story behind this photo is so unexplainable, I didn\'t felt bad for that particular thing but idk as an overthinker I notice every little gestures and when u asked me what happen i felt so stupid telling u that bcq of this small thing i get upset, so I try not to get affected by those things, but.......to be continue',
            tag: 'twirling',
            driveRef: '193.jpg',
          },
          {
            id: 'ch19-m4',
            type: 'image',
            src: '/images/timeline/194.jpg',
            title: 'Garba Moments',
            caption: 'Doing everything except garba😁.',
            tag: 'twirling',
            driveRef: '194.jpg',
          },
          {
            id: 'ch19-m5',
            type: 'image',
            src: '/images/timeline/195.jpg',
            title: 'Twirling Night Finale',
            caption: 'Doing everything except garba😁.',
            tag: 'twirling',
            driveRef: '195.jpg',
          },
        ],
      },
    ] as TimelineEntry[],
  },

  // Section 5: Mini Interactions
  miniInteractions: {
    sectionTitle: 'Little Moments of Joy',
    sectionSubtitle: 'Three gentle interactive treats created for you.',
    // 19 wishes in the jar
    wishes: [
      'Infinite moments of pure laughter',
      'Peace of mind during hectic exam weeks',
      'Endless cups of comforting tea/coffee',
      'Exciting new adventures & travels',
      'Friendships that cherish and uplift you',
      'Courage to chase your wildest dreams',
      'Cozy rainy evenings with your favorite books/music',
      'Opportunities that recognize your talents',
      'A heart that stays soft and fearless',
      'Unconditional health and boundless vitality',
      'Sweet unexpected surprises throughout the year',
      'Confidence in every choice you make',
      'Days filled with sunny walks and blooming gardens',
      'Deep, restful sleep every single night',
      'Victory over every challenge you face',
      'Warm hugs from the people who love you',
      'Freedom to be wholly, unapologetically yourself',
      'Memories you will smile back at years from now',
      'A 19th year that is as beautiful as your soul',
    ],
    // Tap to bloom notes
    bloomNotes: [
      'You bring warmth to everyone around you 🌸',
      'Never stop believing in your quiet strength ✨',
      'Your kindness leaves a lasting impression 🌷',
      'You deserve every bit of happiness today 🌿',
      'May your smile stay as radiant as ever ✨',
    ],
  },

  // Section 6: Password-Protected Secret Letter - Easter Egg
  secretLetter: {
    teaserTitle: 'The answers to all those question....',
    teaserSubtitle: 'Opens when it was the right time',
    modalTitle: 'The answers to all those question....',
    modalDescription: 'Opens when it was the right time',
    inputPlaceholder: 'Enter keyword...',
    submitButton: 'Unlock note',
    wrongKeywordMessage: 'Remember our memories and dates we never went to.',
    // Safe protected note for the secret letter
    placeholderMessage: `Hey, Kavisha ❤️🌷

First of all, I'm really lucky to have you in my life. You're someone I can share almost anything with, but when it comes to talking about you and my own feelings, things suddenly become difficult. Maybe because you matter to me more than I usually express, and I don't always know how to put everything into words.

You already know I'm an overthinker. I notice little things, changes in behaviour, and small actions, especially when it comes to people I care about. Sometimes, if something feels a little off, I start thinking about it too much and assume the worst without even knowing the actual reason. Instead of asking you directly, I choose to stay silent and end up blaming myself for overthinking.

I always try to make you feel comfortable and happy. Sometimes, when I feel that my mood is affecting yours, I prefer not to say anything because I don't want you to get upset or irritated because of me. And honestly, after being good friends for almost a year, there's a part of me that sometimes expects you to understand when something is bothering me. That's why, when you ask me what's wrong, I usually end up saying, "Uhhh, leave it, it's nothing." 😂

But I know you can't understand everything unless I actually tell you, and maybe it's time I stop expecting you to understand things that I've never properly explained.

Do you remember the conversation we had around the middle of July?

At that time, I had some doubts in my mind because of something someone else had told me. After talking to you, those doubts were cleared. But later, when we were talking normally, another thought came into my mind, and I started questioning myself again.

We had started talking almost every day, sometimes for hours, and somewhere along the way, I became emotionally attached to our conversations and to the bond we share. I still remember you saying that if we ever stopped talking like that, it might hurt me more than it would hurt you. That conversation made me think about a lot of things, and we discussed many questions and doubts from both sides.

Eventually, we decided to go with the flow, and I genuinely wanted to do that. We also talked about it again after the FOSS hackathon and tried to clear things up. I know we have already spent hours discussing this, and I don't want to make you feel that all those conversations meant nothing.

But the truth is, even after all that, I still have some feelings that I haven't been able to explain properly.

I don't know exactly when it happened or how things changed, but somewhere between our daily conversations, random talks, jokes, and all those little moments, you became more than just another person I talk to every day.

**And I think the reason I've been overthinking all of this is that somewhere along the way, I started liking you as more than just a friend.** ❤️

I've wanted to tell you this for quite some time, but I never really had the courage to say it directly. I kept thinking about what might happen afterward, whether things would become awkward, or whether I might end up changing a friendship that genuinely means a lot to me.

But keeping everything inside and acting like nothing is happening hasn't exactly helped either. 😭

So, I want to be honest with you: **I have feelings for you, and I think that's something you deserve to know.**

I'm not telling you this because I expect you to feel the same way. I'm not asking for a commitment or asking you to decide anything right now. I just wanted you to understand why I sometimes overthink little things, why certain situations affect me more than they probably should, and why I've found it so difficult to talk about this.

And if I've ever made you uncomfortable, confused you with my behaviour, or unintentionally made things awkward, I'm genuinely sorry. My intentions were never to hurt you. I never wanted my feelings to become a burden on you or ruin the friendship we've built.

I completely respect your feelings and your perspective. If you're not in the same place emotionally, or if you see me only as a friend, it's okay. I'd rather we be honest with each other than have either of us pretend to feel something we don't.

Of course, I might need a little time to understand my own thoughts, too, but I don't want you to feel responsible for them. They're my feelings, and it's my responsibility to handle them maturely.

The one thing I do hope for is that we can talk openly about this instead of leaving each other with doubts or assumptions. A little clarity and understanding would mean a lot to me.

Because, honestly, our friendship matters to me. I value our random conversations, our jokes, the time we spend talking, and all the little things that have made this past year special. I don't want one honest conversation to make us forget all of that.

I know things might feel a little awkward for a moment, and maybe we won't have the perfect words to say everything immediately. That's okay. We don't have to figure out everything in one conversation. I just want us to understand each other.

And now, since you've actually read this entire essay while I'm sitting right in front of you, 😂❤️, I think it's only fair that we have a proper conversation.

There's no need to give me a perfect answer or say what you think I want to hear. Just tell me honestly what you feel. I'll listen.

Thank you for reading this and for being someone who has become so important to me.

Whatever happens, I hope we can handle it with the same honesty and understanding that I've always wanted between us.

And please don't make fun of me too much for writing such a long letter. I already overthink enough. 😭😂❤️

Yours,  
Gourav`,
  },

  // Section 7: Ending
  ending: {
    title: 'And the story continues...',
    paragraphs: [
      'More conversations. More laughter. More silly moments. More memories we haven’t made yet.',
      'Here’s to your 19th year, Kavisha — may it bring you the happiness, peace, and beautiful surprises you deserve.',
    ],
    animatedLines: [
      'More memories.',
      'More little moments.',
      'More chapters to come.',
    ],
    largeText: 'FOREVER CONTINUES...',
    replayButton: 'Replay the Birthday Magic ✨',
  },
};
