import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { Router, type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { clearSessionCookieOptions, sessionCookieName } from '../lib/sessionCookie.js';
import { rateLimitAuth } from '../middleware/rateLimitAuth.js';
import { isResendConfigured, sendMagicLinkEmail } from '../services/email/resend.js';

const router = Router();

const TOKEN_TTL_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT = 10;
const AUTH_RATE_WINDOW_MS = 15 * 60 * 1000;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSelect = {
  id: true,
  email: true,
  createdAt: true,
};

type PublicUser = {
  id: string;
  email: string;
  createdAt: Date;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeToken(token: unknown): string {
  if (Array.isArray(token)) {
    return token.join('');
  }
  return String(token).trim();
}

function generateSixDigitCode(): string {
  return String(crypto.randomInt(100000, 1000000));
}

function generateLinkToken(): string {
  return crypto.randomUUID();
}

async function cleanupExpiredTokens(): Promise<void> {
  try {
    await prisma.magicToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch (error) {
    console.error('Error cleaning up expired magic tokens:', error);
  }
}

setInterval(() => {
  void cleanupExpiredTokens();
}, 5 * 60 * 1000);

function saveSession(req: Request, res: Response, user: PublicUser): void {
  req.session.userId = user.id;
  req.session.email = user.email;

  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      res.status(500).json({ error: 'Failed to save session' });
      return;
    }

    res.json({ user });
  });
}

async function regenerateSession(req: Request): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function findOrCreateUser(email: string) {
  const normalizedEmail = normalizeEmail(email);

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email: normalizedEmail },
    });
  }

  return user;
}

async function completeMagicLogin(req: Request, res: Response, email: string): Promise<void> {
  const user = await findOrCreateUser(email);
  await regenerateSession(req);
  saveSession(req, res, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  });
}

async function issueMagicTokens(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const sixDigitCode = generateSixDigitCode();
  const linkToken = generateLinkToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.magicToken.deleteMany({
    where: { email: normalizedEmail },
  });

  await prisma.magicToken.createMany({
    data: [
      { token: sixDigitCode, email: normalizedEmail, expiresAt },
      { token: linkToken, email: normalizedEmail, expiresAt },
    ],
  });

  return { sixDigitCode, linkToken, expiresAt };
}

function frontendUrl(): string {
  const fromList = (process.env.FRONTEND_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)[0];

  return (fromList || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: userSelect,
    });

    await regenerateSession(req);
    saveSession(req, res, user);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post(
  '/login',
  rateLimitAuth(AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS),
  async (req, res) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const normalizedEmail = normalizeEmail(email);

      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user || !user.password) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      await regenerateSession(req);
      saveSession(req, res, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  },
);

router.post(
  '/magic-token/request',
  rateLimitAuth(AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS),
  async (req, res) => {
    try {
      const { email } = req.body as { email?: string };

      if (!email || !emailRegex.test(email)) {
        res.status(400).json({ error: 'Please enter a valid email address' });
        return;
      }

      if (!isResendConfigured() && process.env.NODE_ENV === 'production') {
        res.status(503).json({ error: 'Email sign-in is not configured' });
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const { sixDigitCode, linkToken, expiresAt } = await issueMagicTokens(normalizedEmail);

      const loginUrl = `${frontendUrl()}/login?token=${linkToken}`;

      try {
        await sendMagicLinkEmail({
          to: normalizedEmail,
          loginUrl,
          code: sixDigitCode,
          expiresMinutes: Math.round(TOKEN_TTL_MS / 60000),
        });
      } catch (emailError) {
        console.error('Failed to send magic link email:', emailError);
        if (process.env.NODE_ENV === 'production') {
          throw emailError;
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log('\n=== MAGIC TOKEN ===');
        console.log(`Email: ${normalizedEmail}`);
        console.log(`6-Digit Code: ${sixDigitCode}`);
        console.log(`Login Link: ${loginUrl}`);
        console.log(`Link Token: ${linkToken}`);
        console.log(`Expires at: ${expiresAt.toISOString()}`);
        console.log('===================\n');
      }

      res.json({
        message: 'If that email is valid, we sent a sign-in link and code.',
      });
    } catch (error) {
      console.error('Magic token request error:', error);
      res.status(500).json({ error: 'Failed to send sign-in email' });
    }
  },
);

router.post('/magic-token/login', async (req, res) => {
  try {
    const token = normalizeToken(req.body?.token);

    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    const magicToken = await prisma.magicToken.findUnique({
      where: { token },
    });

    if (!magicToken) {
      res.status(401).json({ error: 'Invalid or expired sign-in link' });
      return;
    }

    if (magicToken.expiresAt < new Date()) {
      await prisma.magicToken.delete({ where: { id: magicToken.id } });
      res.status(401).json({ error: 'Sign-in link has expired' });
      return;
    }

    await prisma.magicToken.delete({ where: { id: magicToken.id } });

    await completeMagicLogin(req, res, magicToken.email);
  } catch (error) {
    console.error('Magic token login error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to logout' });
      return;
    }
    res.clearCookie(sessionCookieName, clearSessionCookieOptions());
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/me', async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: userSelect,
    });

    if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;
