import { Router, type Request, type Response } from 'express';
import {
  buildAuthorizeUrl,
  createOAuthState,
  createPkcePair,
  deleteTidalTokens,
  exchangeAuthorizationCode,
  frontendSettingsUrl,
  getPlayerSession,
  getTidalConnectionStatus,
  getTrackMetadata,
  saveTidalTokens,
  searchTracks,
} from '../lib/tidal.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

function isTidalConfigured(): boolean {
  return Boolean(
    (process.env.TIDAL_CLIENT_ID || '').trim() &&
      (process.env.TIDAL_CLIENT_SECRET || '').trim() &&
      (process.env.TIDAL_REDIRECT_URI || '').trim(),
  );
}

router.use((_req, res, next) => {
  if (!isTidalConfigured()) {
    res.status(503).json({ error: 'Tidal integration is not configured' });
    return;
  }
  next();
});

router.get('/login', requireAuth, (req: Request, res: Response) => {
  const { verifier, challenge } = createPkcePair();
  const state = createOAuthState();

  req.session.tidalPkceVerifier = verifier;
  req.session.tidalOAuthState = state;

  req.session.save((err) => {
    if (err) {
      console.error('Failed to save Tidal OAuth session:', err);
      res.status(500).json({ error: 'Failed to start Tidal login' });
      return;
    }

    res.redirect(buildAuthorizeUrl(challenge, state));
  });
});

router.get('/callback', (req: Request, res: Response) => {
  const userId = req.session?.userId;
  if (!userId) {
    res.redirect(frontendSettingsUrl({ tidal: 'error', reason: 'session' }));
    return;
  }

  const error = typeof req.query.error === 'string' ? req.query.error : null;
  if (error) {
    res.redirect(frontendSettingsUrl({ tidal: 'error', reason: error }));
    return;
  }

  const code = typeof req.query.code === 'string' ? req.query.code : '';
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  const expectedState = req.session.tidalOAuthState;
  const verifier = req.session.tidalPkceVerifier;

  delete req.session.tidalOAuthState;
  delete req.session.tidalPkceVerifier;

  if (!code || !state || !expectedState || state !== expectedState || !verifier) {
    res.redirect(frontendSettingsUrl({ tidal: 'error', reason: 'state' }));
    return;
  }

  void (async () => {
    try {
      const tokens = await exchangeAuthorizationCode(code, verifier);
      await saveTidalTokens(userId, tokens);
      res.redirect(frontendSettingsUrl({ tidal: 'connected' }));
    } catch (err) {
      console.error('Tidal OAuth callback failed:', err);
      res.redirect(frontendSettingsUrl({ tidal: 'error', reason: 'exchange' }));
    }
  })();
});

router.get('/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const status = await getTidalConnectionStatus(req.session.userId!);
    res.json(status);
  } catch (err) {
    console.error('Tidal status error:', err);
    res.status(500).json({ error: 'Failed to load Tidal status' });
  }
});

router.post('/disconnect', requireAuth, async (req: Request, res: Response) => {
  try {
    await deleteTidalTokens(req.session.userId!);
    res.json({ message: 'Tidal disconnected' });
  } catch (err) {
    console.error('Tidal disconnect error:', err);
    res.status(500).json({ error: 'Failed to disconnect Tidal' });
  }
});

router.get('/search', requireAuth, async (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const limitRaw = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : 20;
  const limit = Number.isFinite(limitRaw) ? limitRaw : 20;

  if (!q.trim()) {
    res.status(400).json({ error: 'Query parameter q is required' });
    return;
  }

  try {
    const tracks = await searchTracks(req.session.userId!, q, limit);
    res.json({ tracks });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed';
    if (message === 'Tidal account not connected') {
      res.status(403).json({ error: message });
      return;
    }
    console.error('Tidal search error:', err);
    res.status(502).json({ error: 'Tidal search failed' });
  }
});

router.get('/player-session', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = await getPlayerSession(req.session.userId!);
    res.json(session);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Player session failed';
    if (message === 'Tidal account not connected') {
      res.status(403).json({ error: message });
      return;
    }
    console.error('Tidal player-session error:', err);
    res.status(502).json({ error: 'Tidal player session failed' });
  }
});

router.get('/tracks/:id', requireAuth, async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const trackId = (Array.isArray(rawId) ? rawId[0] : rawId)?.trim();
  if (!trackId) {
    res.status(400).json({ error: 'Track id is required' });
    return;
  }

  try {
    const track = await getTrackMetadata(req.session.userId!, trackId);
    res.json({ track });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Track lookup failed';
    if (message === 'Tidal account not connected') {
      res.status(403).json({ error: message });
      return;
    }
    if (message === 'Track not found') {
      res.status(404).json({ error: message });
      return;
    }
    console.error('Tidal track error:', err);
    res.status(502).json({ error: 'Tidal track lookup failed' });
  }
});

export default router;
