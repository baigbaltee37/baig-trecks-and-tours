import express from 'express';
import path from 'path';
import fs from 'fs';
import { app } from './api/index';

// In Cloud Run environments, PORT is set (e.g. 8080).
// In local/development environments, default to 3000.
const PORT = Number(process.env.PORT) || 3000;

// Health check endpoints for Cloud Run, load balancers, and monitoring
app.get(['/health', '/api/health', '/_healthz'], (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Primary listener on the environment PORT (e.g., 8080 on Cloud Run, or 3000 locally)
  const primaryServer = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Baig Treks & Tours server running on http://0.0.0.0:${PORT}`);
  });

  primaryServer.on('error', (err: any) => {
    console.error(`Primary server error on port ${PORT}:`, err);
  });

  // If the primary PORT is not 3000 (e.g. Cloud Run using 8080), also attempt listening on 3000
  // so any hardcoded port 3000 health-checks or iframe runners also succeed
  if (PORT !== 3000) {
    const fallbackServer = app.listen(3000, '0.0.0.0', () => {
      console.log(`Baig Treks & Tours also listening on fallback port http://0.0.0.0:3000`);
    });

    fallbackServer.on('error', (err: any) => {
      console.warn(`Fallback port 3000 listener note:`, err.message);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export { app };
export default app;
