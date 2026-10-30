import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server-side secret letter config - never exposed in client bundles
const SECRET_PASSWORD = (process.env.SECRET_LETTER_PASSWORD || 'feelings').toLowerCase();
const SECRET_MESSAGE = process.env.SECRET_LETTER_CONTENT || `Hey, Kavisha ❤️🌷

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
Gourav`;

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  // In AI Studio Build, the dev server must always run on port 3000.
  // The container environment sets process.env.PORT=8080 for Nginx, which proxies to port 3000.
  return 3000;
}

async function startServer() {
  const app = express();
  const PORT = getPort();

  app.use(express.json({ limit: '50mb' }));

  // Helper to read/write gallery manifest
  const getManifest = async () => {
    const fs = await import('fs/promises');
    const manifestPath = path.resolve(__dirname, 'public', 'images', 'gallery', 'manifest.json');
    try {
      const data = await fs.readFile(manifestPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const saveManifest = async (photos: unknown[]) => {
    const fs = await import('fs/promises');
    const manifestPath = path.resolve(__dirname, 'public', 'images', 'gallery', 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(photos, null, 2), 'utf-8');
  };

  // GET /api/photos: Fetch all photos dynamically
  app.get('/api/photos', async (_req: Request, res: Response): Promise<void> => {
    try {
      const photos = await getManifest();
      res.json({ success: true, photos });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to load photos' });
    }
  });

  // POST /api/upload-photos: Unlimited photo uploads restricted to Creator
  app.post('/api/upload-photos', async (req: Request, res: Response): Promise<void> => {
    try {
      const { photos, creatorKey } = req.body;
      const cleanKey = typeof creatorKey === 'string' ? creatorKey.trim().toLowerCase() : '';
      if (cleanKey && cleanKey !== 'gourav' && cleanKey !== 'kavisha19' && cleanKey !== 'kavisha') {
        res.status(401).json({ success: false, error: 'Unauthorized: Only the creator (Gourav) or Kavisha can upload photos.' });
        return;
      }

      if (!Array.isArray(photos) || photos.length === 0) {
        res.status(400).json({ success: false, error: 'Expected photos array' });
        return;
      }

      const fs = await import('fs/promises');
      const galleryDir = path.resolve(__dirname, 'public', 'images', 'gallery');
      const heroDir = path.resolve(__dirname, 'public', 'images', 'hero');
      await fs.mkdir(galleryDir, { recursive: true });
      await fs.mkdir(heroDir, { recursive: true });

      const currentManifest = await getManifest();

      for (let i = 0; i < photos.length; i++) {
        const item = photos[i];
        if (!item.dataUrl || typeof item.dataUrl !== 'string') continue;
        const base64Data = item.dataUrl.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        if (item.replaceId) {
          // Replace specific existing photo
          const existing = currentManifest.find((p: { id: string }) => p.id === item.replaceId);
          if (existing) {
            const relPath = existing.src.replace(/^\//, '');
            await fs.writeFile(path.resolve(__dirname, 'public', relPath), buffer);
            continue;
          }
        }

        // New photo: add with unique filename
        const newNum = currentManifest.length + 1;
        const padNum = String(newNum).padStart(2, '0');
        const filename = `photo-${padNum}-${Date.now()}.jpg`;
        await fs.writeFile(path.join(galleryDir, filename), buffer);

        currentManifest.push({
          id: `photo-${newNum}-${Date.now()}`,
          title: item.title || `Memory #${newNum}`,
          caption: item.caption || 'A special moment captured in time with warmth and joy.',
          src: `/images/gallery/${filename}`,
          tag: item.tag || 'Cherished Memory',
        });
      }

      await saveManifest(currentManifest);
      res.json({ success: true, count: photos.length, photos: currentManifest });
    } catch (err) {
      console.error('Failed to save photos:', err);
      res.status(500).json({ success: false, error: 'Failed to save photos' });
    }
  });

  // POST /api/update-photo-tag: Edit photo tag by Kavisha / user
  app.post('/api/update-photo-tag', async (req: Request, res: Response): Promise<void> => {
    try {
      const { photoId, tag } = req.body;
      if (!photoId || typeof tag !== 'string') {
        res.status(400).json({ success: false, error: 'photoId and tag are required' });
        return;
      }
      const currentManifest = await getManifest();
      const photo = currentManifest.find((p: { id: string }) => p.id === photoId);
      if (!photo) {
        res.status(404).json({ success: false, error: 'Photo not found' });
        return;
      }
      photo.tag = tag.trim() || 'Memory';
      await saveManifest(currentManifest);
      res.json({ success: true, photo, photos: currentManifest });
    } catch (err) {
      console.error('Failed to update photo tag:', err);
      res.status(500).json({ success: false, error: 'Failed to update photo tag' });
    }
  });

  // POST /api/delete-photo: Delete a photo (Restricted to Creator)
  app.post('/api/delete-photo', async (req: Request, res: Response): Promise<void> => {
    try {
      const { photoId, creatorKey } = req.body;
      const cleanKey = typeof creatorKey === 'string' ? creatorKey.trim().toLowerCase() : '';
      if (cleanKey && cleanKey !== 'gourav' && cleanKey !== 'kavisha19' && cleanKey !== 'kavisha') {
        res.status(401).json({ success: false, error: 'Unauthorized: Only the creator (Gourav) can delete photos.' });
        return;
      }

      if (!photoId) {
        res.status(400).json({ success: false, error: 'photoId is required' });
        return;
      }

      const currentManifest = await getManifest();
      const photoToDelete = currentManifest.find((p: { id: string; src: string }) => p.id === photoId);
      if (!photoToDelete) {
        res.status(404).json({ success: false, error: 'Photo not found' });
        return;
      }

      const updated = currentManifest.filter((p: { id: string }) => p.id !== photoId);
      await saveManifest(updated);

      try {
        const fs = await import('fs/promises');
        const relPath = photoToDelete.src.replace(/^\//, '');
        await fs.unlink(path.resolve(__dirname, 'public', relPath));
      } catch {
        // file unlinked or not on disk
      }

      res.json({ success: true, photos: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to delete photo' });
    }
  });

  // Password-protected endpoint for secret letter
  // Rate-limiting / brute-force delay
  let attempts = 0;
  setInterval(() => { attempts = 0; }, 60000); // reset every minute

  app.post('/api/secret-letter', async (req: Request, res: Response): Promise<void> => {
    attempts++;
    if (attempts > 15) {
      res.status(429).json({
        success: false,
        error: 'Too many attempts. Please take a breath and try again in a minute.',
      });
      return;
    }

    // Artificial timing delay to prevent high-speed automated attacks
    await new Promise((resolve) => setTimeout(resolve, 350));

    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      res.status(400).json({ success: false, error: 'Password keyword is required' });
      return;
    }

    const cleanInput = password.trim().toLowerCase();

    // Check against secret password for What If page: 'feelings'
    if (
      cleanInput === 'feelings' ||
      cleanInput === SECRET_PASSWORD
    ) {
      res.json({
        success: true,
        content: SECRET_MESSAGE,
        author: 'Gourav',
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: 'Remember our memories and dates we never went to.',
    });
  });

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // High-performance byte-range video streaming for instant zero-lag playback (RFC 7233 compliant)
  app.get('/videos/*', async (req: Request, res: Response) => {
    const videoRelative = req.path.replace(/^\/videos\//, '');
    const fs = await import('fs');
    let videoPath = path.resolve(__dirname, 'public', 'videos', videoRelative);

    if (!fs.existsSync(videoPath)) {
      videoPath = path.resolve(__dirname, 'dist', 'videos', videoRelative);
    }

    if (!fs.existsSync(videoPath)) {
      res.status(404).send('Video not found');
      return;
    }

    res.sendFile(videoPath, {
      acceptRanges: true,
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  });

  // Serve static assets from public folder
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Vite development mode vs production static
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
