import path from 'node:path';
import { fileURLToPath } from 'node:url';
import connectPgSimple from 'connect-pg-simple';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { Pool } from 'pg';
import { sessionCookieName, sessionCookieOptions } from './lib/sessionCookie.js';
import authRoutes from './routes/auth.js';
import practiceRoutes from './routes/practice.js';
import tidalRoutes from './routes/tidal.js';

// Monorepo: load repo-root `.env` (cwd may be apps/api when using workspaces).
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../.env'),
});

const app = express();
const PORT = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
  const secret = (process.env.SESSION_SECRET || '').trim();
  if (!secret || secret === 'change-this-in-development' || secret === 'dev-secret-change-me') {
    console.error('SESSION_SECRET must be set to a strong value in production');
    process.exit(1);
  }
}

function resolveCorsOrigins(): string[] {
  const normalize = (s: string) => s.trim().replace(/\/$/, '');
  const fromList = (process.env.FRONTEND_URLS || '')
    .split(',')
    .map(normalize)
    .filter(Boolean);
  if (fromList.length) return fromList;

  const single = normalize(process.env.FRONTEND_URL || '');
  if (single) return [single];

  return ['http://localhost:5173'];
}

const corsOrigins = resolveCorsOrigins();
console.log(`CORS allowlist: ${corsOrigins.join(', ') || '(empty)'}`);

app.use(
  cors({
    origin(origin, callback) {
      // Cookie Domain is unrelated — browsers send Origin; it must match FRONTEND_URLS exactly.
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      console.warn(`CORS rejected origin: ${origin}`);
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(cookieParser());

const PgSession = connectPgSimple(session);
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX || 3),
  idleTimeoutMillis: Number(process.env.PG_POOL_IDLE_MS || 10_000),
});

app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: 'session',
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET || (isProduction ? '' : 'dev-secret-change-me'),
    resave: false,
    saveUninitialized: false,
    name: sessionCookieName,
    cookie: sessionCookieOptions(),
    proxy: isProduction,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/tidal', tidalRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'hercules-api', date: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Hercules API running on port ${PORT}`);
});

export default app;
