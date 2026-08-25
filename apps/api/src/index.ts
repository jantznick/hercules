import 'dotenv/config';
import connectPgSimple from 'connect-pg-simple';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { Pool } from 'pg';
import { sessionCookieName, sessionCookieOptions } from './lib/sessionCookie.js';
import authRoutes from './routes/auth.js';
import tidalRoutes from './routes/tidal.js';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}

function resolveCorsOrigins(): string[] {
  const fromList = (process.env.FRONTEND_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromList.length) return fromList;

  const single = (process.env.FRONTEND_URL || '').trim();
  if (single) return [single];

  return ['http://localhost:5173'];
}

const corsOrigins = resolveCorsOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
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
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    name: sessionCookieName,
    cookie: sessionCookieOptions(),
    proxy: isProduction,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/tidal', tidalRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'hercules-api', date: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Hercules API running on port ${PORT}`);
});

export default app;
