import crypto from 'node:crypto';
import prisma from './prisma.js';
import { decryptToken, encryptToken } from './tokenCrypto.js';

const TIDAL_AUTH_BASE = 'https://login.tidal.com/authorize';
const TIDAL_TOKEN_URL = 'https://auth.tidal.com/v1/oauth2/token';
const TIDAL_API_BASE = 'https://openapi.tidal.com/v2';
/** Modern OpenAPI scopes. Legacy `r_usr` / `w_usr` often trigger authorize Error 1002 (invalid_scope). */
const DEFAULT_TIDAL_SCOPES = 'search.read playback';
const TOKEN_REFRESH_SKEW_MS = 60_000;

export type TidalConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  countryCode: string;
  /** Space-separated scopes enabled on the Tidal developer app. */
  scopes: string;
};

export type TidalOAuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export type TidalTrackSummary = {
  id: string;
  title: string;
  durationSeconds: number | null;
  explicit: boolean;
  artists: string[];
  album: string | null;
  bpm: number | null;
  isrc: string | null;
};

type TidalTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
};

type JsonApiResource = {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
};

type JsonApiDocument = {
  data?: JsonApiResource | JsonApiResource[] | null;
  included?: JsonApiResource[];
};

function resolveScopes(): string {
  const fromEnv = (process.env.TIDAL_SCOPES || '').trim();
  return fromEnv || DEFAULT_TIDAL_SCOPES;
}

function requireTidalConfig(): TidalConfig {
  const clientId = (process.env.TIDAL_CLIENT_ID || '').trim();
  const clientSecret = (process.env.TIDAL_CLIENT_SECRET || '').trim();
  const redirectUri = (process.env.TIDAL_REDIRECT_URI || '').trim();
  const countryCode = (process.env.TIDAL_COUNTRY_CODE || 'US').trim().toUpperCase();
  const scopes = resolveScopes();

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Tidal OAuth is not configured (TIDAL_CLIENT_ID, TIDAL_CLIENT_SECRET, TIDAL_REDIRECT_URI)');
  }

  return { clientId, clientSecret, redirectUri, countryCode, scopes };
}

function base64Url(buffer: Buffer): string {
  return buffer.toString('base64url');
}

export function createPkcePair(): { verifier: string; challenge: string } {
  const verifier = base64Url(crypto.randomBytes(32));
  const challenge = base64Url(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

export function createOAuthState(): string {
  return base64Url(crypto.randomBytes(16));
}

export function buildAuthorizeUrl(challenge: string, state: string): string {
  const { clientId, redirectUri, scopes } = requireTidalConfig();
  // Official authorize params only — do not add geo/campaignId (login.tidal.com may append those on error pages).
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
  });
  if (scopes) {
    params.set('scope', scopes);
  }
  return `${TIDAL_AUTH_BASE}?${params.toString()}`;
}

async function tidalTokenRequest(body: URLSearchParams): Promise<TidalTokenResponse> {
  const { clientId, clientSecret } = requireTidalConfig();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(TIDAL_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });

  const payload = (await response.json().catch(() => ({}))) as TidalTokenResponse & { error?: string; error_description?: string };
  if (!response.ok) {
    const detail = payload.error_description || payload.error || response.statusText;
    throw new Error(`Tidal token request failed: ${detail}`);
  }

  if (!payload.access_token) {
    throw new Error('Tidal token response missing access_token');
  }

  return payload;
}

export async function exchangeAuthorizationCode(code: string, verifier: string): Promise<TidalOAuthTokens> {
  const { clientId, redirectUri } = requireTidalConfig();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const tokens = await tidalTokenRequest(body);
  if (!tokens.refresh_token) {
    throw new Error('Tidal token response missing refresh_token');
  }

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<TidalOAuthTokens> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const tokens = await tidalTokenRequest(body);
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || refreshToken,
    expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
  };
}

export async function saveTidalTokens(userId: string, tokens: TidalOAuthTokens): Promise<void> {
  await prisma.tidalToken.upsert({
    where: { userId },
    create: {
      userId,
      accessToken: encryptToken(tokens.accessToken),
      refreshToken: encryptToken(tokens.refreshToken),
      expiresAt: tokens.expiresAt,
    },
    update: {
      accessToken: encryptToken(tokens.accessToken),
      refreshToken: encryptToken(tokens.refreshToken),
      expiresAt: tokens.expiresAt,
    },
  });
}

export async function deleteTidalTokens(userId: string): Promise<void> {
  await prisma.tidalToken.deleteMany({ where: { userId } });
}

export async function getTidalConnectionStatus(userId: string): Promise<{ connected: boolean; expiresAt: string | null }> {
  const row = await prisma.tidalToken.findUnique({
    where: { userId },
    select: { expiresAt: true },
  });

  return {
    connected: Boolean(row),
    expiresAt: row?.expiresAt.toISOString() ?? null,
  };
}

async function tidalApiFetch(path: string, accessToken: string, searchParams?: Record<string, string>): Promise<JsonApiDocument> {
  const url = new URL(`${TIDAL_API_BASE}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  });

  const payload = (await response.json().catch(() => ({}))) as JsonApiDocument & { errors?: Array<{ detail?: string }> };
  if (!response.ok) {
    const detail = payload.errors?.[0]?.detail || response.statusText;
    throw new Error(`Tidal API ${response.status}: ${detail}`);
  }

  return payload;
}

function includedByType(included: JsonApiResource[] | undefined, type: string): Map<string, JsonApiResource> {
  const map = new Map<string, JsonApiResource>();
  for (const item of included ?? []) {
    if (item.type === type) {
      map.set(item.id, item);
    }
  }
  return map;
}

function artistNamesFromRelationships(
  track: JsonApiResource,
  artistsById: Map<string, JsonApiResource>,
): string[] {
  const rels = (track as JsonApiResource & { relationships?: Record<string, { data?: JsonApiResource | JsonApiResource[] }> })
    .relationships?.artists?.data;

  const refs = Array.isArray(rels) ? rels : rels ? [rels] : [];
  return refs
    .map((ref) => {
      const artist = artistsById.get(ref.id);
      const title = artist?.attributes?.title ?? artist?.attributes?.name;
      return typeof title === 'string' ? title : null;
    })
    .filter((name): name is string => Boolean(name));
}

function albumTitleFromRelationships(
  track: JsonApiResource,
  albumsById: Map<string, JsonApiResource>,
): string | null {
  const rel = (track as JsonApiResource & { relationships?: Record<string, { data?: JsonApiResource | JsonApiResource[] }> })
    .relationships?.albums?.data;
  const ref = Array.isArray(rel) ? rel[0] : rel;
  if (!ref) return null;
  const album = albumsById.get(ref.id);
  const title = album?.attributes?.title;
  return typeof title === 'string' ? title : null;
}

function mapTrackResource(
  track: JsonApiResource,
  included: JsonApiResource[] | undefined,
): TidalTrackSummary {
  const artistsById = includedByType(included, 'artists');
  const albumsById = includedByType(included, 'albums');
  const attrs = track.attributes ?? {};
  const duration = typeof attrs.duration === 'string' ? Number.parseInt(attrs.duration, 10) : typeof attrs.duration === 'number' ? attrs.duration : null;
  const bpm = typeof attrs.bpm === 'number' ? attrs.bpm : typeof attrs.bpm === 'string' ? Number.parseFloat(attrs.bpm) : null;

  return {
    id: track.id,
    title: typeof attrs.title === 'string' ? attrs.title : 'Unknown track',
    durationSeconds: Number.isFinite(duration) ? duration : null,
    explicit: Boolean(attrs.explicit),
    artists: artistNamesFromRelationships(track, artistsById),
    album: albumTitleFromRelationships(track, albumsById),
    bpm: Number.isFinite(bpm) ? bpm : null,
    isrc: typeof attrs.isrc === 'string' ? attrs.isrc : null,
  };
}

export async function getValidAccessToken(userId: string): Promise<string> {
  const row = await prisma.tidalToken.findUnique({ where: { userId } });
  if (!row) {
    throw new Error('Tidal account not connected');
  }

  const accessToken = decryptToken(row.accessToken);
  const refreshToken = decryptToken(row.refreshToken);
  const needsRefresh = row.expiresAt.getTime() - Date.now() <= TOKEN_REFRESH_SKEW_MS;

  if (!needsRefresh) {
    return accessToken;
  }

  const refreshed = await refreshAccessToken(refreshToken);
  await saveTidalTokens(userId, refreshed);
  return refreshed.accessToken;
}

export async function searchTracks(userId: string, query: string, limit = 20): Promise<TidalTrackSummary[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const { countryCode } = requireTidalConfig();
  const accessToken = await getValidAccessToken(userId);
  const encodedQuery = encodeURIComponent(trimmed);

  const doc = await tidalApiFetch(`/searchResults/${encodedQuery}`, accessToken, {
    countryCode,
    include: 'tracks,artists,albums',
  });

  const searchResult = doc.data;
  if (!searchResult || Array.isArray(searchResult)) {
    return [];
  }

  const trackRefs = (
    searchResult as JsonApiResource & { relationships?: Record<string, { data?: JsonApiResource | JsonApiResource[] }> }
  ).relationships?.tracks?.data;

  const refs = Array.isArray(trackRefs) ? trackRefs : trackRefs ? [trackRefs] : [];
  const included = doc.included ?? [];
  const tracksById = includedByType(included, 'tracks');
  const pageSize = Math.min(Math.max(limit, 1), 50);

  const tracks: TidalTrackSummary[] = [];
  for (const ref of refs.slice(0, pageSize)) {
    const track = tracksById.get(ref.id);
    if (track) {
      tracks.push(mapTrackResource(track, included));
    }
  }

  return tracks;
}

export async function getTrackMetadata(userId: string, trackId: string): Promise<TidalTrackSummary> {
  const { countryCode } = requireTidalConfig();
  const accessToken = await getValidAccessToken(userId);

  const doc = await tidalApiFetch(`/tracks/${encodeURIComponent(trackId)}`, accessToken, {
    countryCode,
    include: 'artists,albums',
  });

  const data = doc.data;
  if (!data || Array.isArray(data)) {
    throw new Error('Track not found');
  }

  return mapTrackResource(data, doc.included);
}

export type TidalPlayerSession = {
  clientId: string;
  accessToken: string;
  expiresAt: string;
};

/** Short-lived access token for browser Player SDK (session-gated route only). */
export async function getPlayerSession(userId: string): Promise<TidalPlayerSession> {
  const { clientId } = requireTidalConfig();
  const accessToken = await getValidAccessToken(userId);
  const row = await prisma.tidalToken.findUnique({
    where: { userId },
    select: { expiresAt: true },
  });
  if (!row) {
    throw new Error('Tidal account not connected');
  }

  return {
    clientId,
    accessToken,
    expiresAt: row.expiresAt.toISOString(),
  };
}

export function frontendSettingsUrl(query?: Record<string, string>): string {
  const fromList = (process.env.FRONTEND_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)[0];
  const base = (process.env.FRONTEND_URL || fromList || 'http://localhost:5173').trim();
  const url = new URL('/settings', base.replace(/\/$/, ''));
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
