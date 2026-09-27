import express from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const SHARED_STATE_FILE = path.join(os.tmpdir(), 'btt-shared-state.json');

interface SharedAppState {
  updatedAt: number;
  tours?: unknown[];
  destinations?: unknown[];
  blogPosts?: unknown[];
  gallery?: unknown[];
  reviews?: unknown[];
  inquiries?: unknown[];
  bookings?: unknown[];
  users?: unknown[];
  settings?: Record<string, unknown>;
}

function readSharedStateFromDisk(): SharedAppState {
  try {
    if (fs.existsSync(SHARED_STATE_FILE)) {
      const raw = fs.readFileSync(SHARED_STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as SharedAppState;
      }
    }
  } catch (err) {
    console.warn('[State Sync] Could not read shared state file:', err);
  }
  return { updatedAt: 0 };
}

function writeSharedStateToDisk(nextState: SharedAppState): SharedAppState {
  try {
    fs.writeFileSync(SHARED_STATE_FILE, JSON.stringify(nextState, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[State Sync] Could not write shared state file:', err);
  }
  return nextState;
}

// Simple in-memory rate limiter per IP for email/inquiry endpoints
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(ip: string, maxRequests = 15, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

async function sendNotificationEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpFrom = process.env.SMTP_FROM || 'Baig Trecks & Tours <no-reply@baigtrecks.com>';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn(
      `[Email Service] SMTP credentials not configured in environment variables. Logged notification intended for ${to} with subject "${subject}".`
    );
    return { sent: false, reason: 'smtp_not_configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[Email Service] Failed to send email notification:', err);
    return { sent: false, reason: 'smtp_send_error' };
  }
}

async function startServer() {
  const app = express();
  // Allow up to 8MB JSON payloads so uploaded base64 tour images sync across mobile, tablet, and laptop tabs
  app.use(express.json({ limit: '8mb' }));

  // 0. Cross-Device & Cross-Tab Shared State Endpoint (syncs Laptop, Tablet, and Mobile automatically)
  app.get('/api/shared-state', (_req, res) => {
    const state = readSharedStateFromDisk();
    res.setHeader('Cache-Control', 'no-store');
    res.json(state);
  });

  app.post('/api/shared-state', (req, res) => {
    const current = readSharedStateFromDisk();
    const incoming = req.body || {};
    const merged: SharedAppState = {
      ...current,
      ...incoming,
      updatedAt: Date.now(),
    };
    writeSharedStateToDisk(merged);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ ok: true, updatedAt: merged.updatedAt });
  });

  // 1. Server-side Customer Registration Notification to skardubhai1@gmail.com
  app.post('/api/notify-signup', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip, 10, 60_000)) {
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      return;
    }

    const { displayName, email, phone, uid, status } = req.body || {};
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Valid customer email is required.' });
      return;
    }

    const sanitizedName = String(displayName || 'Traveler').slice(0, 100);
    const sanitizedEmail = String(email).slice(0, 160);
    const sanitizedPhone = String(phone || 'Not provided').slice(0, 40);
    const sanitizedStatus = String(status || 'active').slice(0, 20);
    const registrationTime = new Date().toISOString();
    const targetEmail = process.env.SIGNUP_NOTIFICATION_EMAIL || 'skardubhai1@gmail.com';
    const subject = 'New Customer Registration — Baig Trecks & Tours';

    const text = [
      'New Customer Registration — Baig Trecks & Tours',
      '------------------------------------------------',
      `Customer Name: ${sanitizedName}`,
      `Email: ${sanitizedEmail}`,
      `User ID: ${String(uid || 'N/A').slice(0, 128)}`,
      `Phone / WhatsApp: ${sanitizedPhone}`,
      `Registration Date/Time: ${registrationTime}`,
      `Account Status: ${sanitizedStatus}`,
    ].join('\n');

    const html = `
      <div style="font-family: sans-serif; color: #0B0F14; max-width: 600px; padding: 24px; border: 1px solid #E2E8F0;">
        <h2 style="margin-top: 0;">New Customer Registration — Baig Trecks &amp; Tours</h2>
        <p>A new customer account has been registered on the platform:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; font-weight: bold;">Customer Name:</td><td>${sanitizedName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${sanitizedEmail}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td><td>${sanitizedPhone}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Registration Date/Time:</td><td>${registrationTime}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Account Status:</td><td>${sanitizedStatus}</td></tr>
        </table>
      </div>
    `;

    const result = await sendNotificationEmail({
      to: targetEmail,
      subject,
      text,
      html,
    });

    res.json({
      recorded: true,
      emailNotificationSent: result.sent,
      recipient: targetEmail,
      note: result.sent
        ? 'Notification email dispatched to administration.'
        : 'Account registered. Server-side email notification queued/logged (configure SMTP_HOST/SMTP_USER/SMTP_PASS for live dispatch).',
    });
  });

  // 2. Server-side SEO Sitemap
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const routes = [
      '/',
      '/tours',
      '/tours/hunza-valley-discovery',
      '/tours/skardu-deosai-expedition',
      '/tours/hunza-skardu-grand-karakoram',
      '/tours/fairy-meadows-nanga-parbat-trek',
      '/destinations',
      '/experiences',
      '/about',
      '/gallery',
      '/travel-guides',
      '/contact',
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // 3. Server-side robots.txt
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.header('Content-Type', 'text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /customer\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Baig Trecks & Tours server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
