# A Little World for Kavisha 🌸 (19th Birthday Celebration)

**Project Codename:** A Little World for Kavisha  
**Recipient:** Kavisha, turning 19 on 30 October 2026 (12:00 AM IST)  
**Creator:** Gourav (close college friend)  
**Creative Direction:** Dreamy floral, soft blush pink, dusty rose, lavender, warm ivory, translucent frosted-glass surfaces, slow drifting flower petals, elegant typography, respectful, warm, and heartfelt tone.

---

## ✨ Features & User Journey

1. **State A — Pre-Birthday Countdown (Strict Gating before 30 October 2026 00:00 IST)**
   - Elegant landing page with brand label: *"a little world for kavisha"*.
   - Central frosted-glass countdown card computing exact days, hours, minutes, and seconds to **2026-10-30T00:00:00+05:30** (UTC equivalent: `2026-10-29T18:30:00.000Z`).
   - Re-computed on page load, window focus, visibility change, and interval ticks.
   - Discreet "Preview Unlock" button and `?previewUnlock=1` URL query parameter for creator testing.
   - Zero access or links to birthday letters, timelines, or secrets prior to release.

2. **State B — Birthday Reveal Sequence**
   - Soft fireworks and golden/pink sparkle animation on canvas.
   - Headline: *"HAPPY 19TH BIRTHDAY, KAVISHA! 🎂🌷"*.
   - Primary button: *"Open Your Little World ✨"*.
   - Plays once per session with skip button and prefers-reduced-motion compliance.

3. **Main Birthday Experience (7 Ordered Sections)**
   - **Section 1 (Hero):** *"Happy 19th Birthday, Kavisha!"*, delicate glass photo frame slot, floral filigree, scroll cue.
   - **Section 2 (Floating Photo Gallery):** 6 responsive glass cards with soft tilt, enlarge preview, and full keyboard-accessible Lightbox (Escape, Arrow Left/Right, Close).
   - **Section 3 (Interactive Birthday Letter):** Wax-sealed envelope with heart seal; clicking unrolls the letter with clean accessible typography and re-fold action.
   - **Section 4 (Memories Timeline):** 5 college milestone chapters ("The Beginning", "The Little Things", "A Memory Worth Keeping", "My Favourite Moments", "And the Story Continues…") with media modal viewer.
   - **Section 5 (Mini Interactions):**
     - *Tap-to-Bloom Flower:* Interactive blossoming bud revealing uplifting notes.
     - *Jar of 19 Birthday Wishes:* Draw a tailored wish for each year of life.
     - *19th Birthday Candle:* Cupcake with flame; blow out candle to release sparkles.
   - **Section 6 (Password-Protected Secret Letter):** Glass card *"One last little secret... 💌"*. Protected via server-side endpoint `/api/secret-letter` with rate limiting and password hashing so the private message is never exposed in client source code. Demo password: `kavisha19`.
   - **Section 7 (Ending):** Calm dreamy garden scene, *"And the story continues..."*, animated sequential lines, *"FOREVER CONTINUES..."*, and *"Replay the Birthday Magic ✨"* action.

4. **Honest Audio System**
   - Floating music toggle with transparent status.
   - Uses built-in Web Audio API soothing pentatonic chime synthesizer.
   - User-initiated only; audio never autoplays. Easily swappable for custom MP3 in `public/audio/`.

---

## 🛠️ Architecture & Files Created

| Path | Description |
|------|-------------|
| `src/data/birthdayContent.ts` | **Central content file** containing all texts, timeline items, wishes, and asset paths |
| `src/utils/countdown.ts` | Timezone calculation logic (Asia/Kolkata UTC+05:30) with zero padding |
| `src/utils/countdown.test.ts` | Node native unit tests (`node:test`) verifying countdown math and unlock triggers |
| `src/components/FloatingPetals.tsx` | High performance drifting petals/stars canvas with reduced motion support |
| `src/components/MusicToggle.tsx` | Honest audio controller with Web Audio API chime generator |
| `src/components/CountdownCard.tsx` | Frosted glass countdown card for State A |
| `src/components/FireworksReveal.tsx` | Celebratory fireworks canvas and reveal sequence for State B |
| `src/components/HeroSection.tsx` | Hero greeting, floating photo frame placeholder, and scroll cue |
| `src/components/PhotoGallery.tsx` | Responsive 6-card gallery with hover overlays |
| `src/components/LightboxModal.tsx` | Accessible photo lightbox with keyboard navigation |
| `src/components/BirthdayEnvelope.tsx` | Wax-seal interactive unfolding envelope |
| `src/components/MemoriesTimeline.tsx` | Alternating vertical timeline of 5 college chapters |
| `src/components/MiniInteractions.tsx` | 3 delightful interactive activities (blossom, wish jar, candle) |
| `src/components/SecretLetterModal.tsx` | Keyword-protected modal with backend verification & rate-limiting |
| `src/components/FinalSection.tsx` | Final garden closing scene with replay button |
| `src/components/CreatorGuideModal.tsx` | Floating helper modal for Gourav with instructions |
| `server.ts` | Express backend serving Vite and secure `/api/secret-letter` endpoint |

---

## 🚀 How to Run & Build

### 1. Run Unit Tests (Logic First)
```bash
npm run test
# Runs node:test natively
```

### 2. Start Development Server
```bash
npm run dev
# Starts full-stack server on http://localhost:3000
```

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```

---

## 📝 Creator Content Replacement (For Gourav)

### 1. Update Text & Captions
Open `src/data/birthdayContent.ts` and modify any text directly. All copy, captions, and wishes are organized clearly.

### 2. Add Photos & Media
Place files in:
- `public/images/gallery/photo-01.jpg` ... `photo-06.jpg`
- `public/images/hero/hero-kavisha.jpg`
- `public/images/timeline/memory-chapter-1.jpg`

Then set the corresponding `src` paths in `src/data/birthdayContent.ts`.

### 3. Secure Secret Letter
In production, set the following environment variables (or configure in `server.ts`):
```env
SECRET_LETTER_PASSWORD="your-private-keyword"
SECRET_LETTER_CONTENT="Your genuine personal message for Kavisha..."
```
This ensures the letter content is only ever transmitted from the server over HTTPS when the exact password is provided.

---

## ✅ QA Verification Checklist

- [x] Countdown accurately targets 30 October 2026 at 12:00 AM IST (2026-10-29T18:30:00.000Z).
- [x] Pure logic unit tests pass via `node:test`.
- [x] State A hides all birthday sections and secret letters from the unauthenticated user.
- [x] State B celebratory fireworks reveal sequence plays smoothly once with skip option.
- [x] All 7 requested sections render in exact order on mobile (390px, 320px) and desktop (1440px).
- [x] Envelope unrolls and re-folds cleanly with full accessibility.
- [x] Lightbox modal opens, responds to Esc and Arrow keys, and closes properly.
- [x] Audio toggle is honest and user-initiated with no surprise autoplay.
- [x] Secret letter modal supports keyword entry, error states, and server verification.
- [x] Replay magic button smoothly brings the user back to the top of the celebration.
