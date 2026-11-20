import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { generatePersonalizedLesson } from './src/server/lessonGenerator.ts';
import { LessonRequestSchema } from './src/types/neura.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WaitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const waitlistEmails = new Set<string>();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'neura' });
  });

  app.post('/api/lessons', async (req, res) => {
    try {
      // Strip any identifying fields if accidentally included by a client
      const {
        age,
        grade,
        curriculum,
        subject,
        topic,
        interests,
        methods,
        difficulty,
        specificNeed,
        priorMastery,
      } = req.body ?? {};

      const parsedReq = LessonRequestSchema.safeParse({
        age,
        grade,
        curriculum,
        subject,
        topic,
        interests,
        methods,
        difficulty,
        specificNeed,
        priorMastery,
      });

      if (!parsedReq.success) {
        res.status(400).json({
          error: 'Invalid lesson configuration',
          details: parsedReq.error.issues.map((i) => i.message),
        });
        return;
      }

      const result = await generatePersonalizedLesson(parsedReq.data);
      res.json(result);
    } catch (error) {
      console.error('Lesson generation error:', error);
      res.status(500).json({
        error: 'Unable to build lesson right now. Please try again.',
      });
    }
  });

  app.post('/api/waitlist', (req, res) => {
    const parsed = WaitlistSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0]?.message ?? 'Invalid email',
      });
      return;
    }

    const email = parsed.data.email.trim().toLowerCase();
    waitlistEmails.add(email);
    res.json({
      ok: true,
      message: "You're on the early-family waitlist! Early-family perks are locked in for your browser.",
      count: waitlistEmails.size,
    });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found');
      }
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Neura server running at http://localhost:${port}`);
  });
}

startServer();
