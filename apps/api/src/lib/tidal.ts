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
  /** Musical key root from Open API (e.g. A, FSharp). */
  key: string | null;
  /** Scale / mode from Open API (e.g. MAJOR, MINOR). */
  keyScale: string | null;
  /** Display key, e.g. "Am" / "F#m". */
  keyLabel: string | null;
  /** Camelot code when major/minor mapping is known (e.g. "8A"). */
  camelot: string | null;
  isrc: string | null;
  popularity: number | null;
  mediaTags: string[];
  /** Deprecated Open API availability flags (STREAM / DJ / STEM). */
  availability: string[];
  /** Album cover thumbnail URL when include pulls coverArt. */
  coverArtUrl: string | null;
};

export type TidalPlaylistSummary = {
  id: string;
  name: string;
  description: string | null;
  numberOfItems: number | null;
  coverArtUrl: string | null;
};

export type TidalTrackListResult = {
  tracks: TidalTrackSummary[];
  nextCursor: string | null;
};

export type TidalPlaylistListResult = {
  playlists: TidalPlaylistSummary[];
  nextCursor: string | null;
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
  links?: { next?: string; meta?: { nextCursor?: string } };
};

type JsonApiResourceWithRels = JsonApiResource & {
  relationships?: Record<string, { data?: JsonApiResource | JsonApiResource[] }>;
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
    },
  });

  const rawText = await response.text();
  let payload: JsonApiDocument & { errors?: Array<{ detail?: string; title?: string; code?: string }> } = {};
  try {
    payload = rawText ? (JSON.parse(rawText) as typeof payload) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const detail =
      payload.errors?.[0]?.detail ||
      payload.errors?.[0]?.title ||
      payload.errors?.[0]?.code ||
      response.statusText;
    const bodySnippet = rawText.replace(/\s+/g, ' ').slice(0, 400);
    console.error(`Tidal API ${response.status} ${url.pathname}?${url.searchParams.toString()}: ${detail}`, bodySnippet);
    throw new Error(`Tidal API ${response.status}: ${detail}`);
  }

  return payload;
}

/** Primary searchResults resource from a collection document (exactly one per query). */
function primarySearchResult(doc: JsonApiDocument): JsonApiResource | null {
  const data = doc.data;
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.find((item) => item.type === 'searchResults') ?? data[0] ?? null;
  }
  return data.type === 'searchResults' || !data.type ? data : null;
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

/** Open API duration is ISO 8601 (e.g. PT2M58S); some payloads may send seconds. */
export function parseTidalDurationSeconds(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
    return raw;
  }
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const n = Number.parseFloat(trimmed);
    return Number.isFinite(n) ? n : null;
  }

  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i.exec(trimmed);
  if (!match) return null;
  const days = Number.parseInt(match[1] || '0', 10);
  const hours = Number.parseInt(match[2] || '0', 10);
  const minutes = Number.parseInt(match[3] || '0', 10);
  const seconds = Number.parseFloat(match[4] || '0');
  const total = days * 86400 + hours * 3600 + minutes * 60 + seconds;
  return Number.isFinite(total) ? total : null;
}

const KEY_DISPLAY: Record<string, string> = {
  C: 'C',
  CSharp: 'C#',
  D: 'D',
  Eb: 'Eb',
  E: 'E',
  F: 'F',
  FSharp: 'F#',
  G: 'G',
  Ab: 'Ab',
  A: 'A',
  Bb: 'Bb',
  B: 'B',
};

/** Camelot for common major/minor (and aeolian ≈ minor) pairs. */
const CAMELOT_MAJOR: Record<string, string> = {
  C: '8B',
  G: '9B',
  D: '10B',
  A: '11B',
  E: '12B',
  B: '1B',
  FSharp: '2B',
  Db: '3B',
  CSharp: '3B',
  Ab: '4B',
  Eb: '5B',
  Bb: '6B',
  F: '7B',
};

const CAMELOT_MINOR: Record<string, string> = {
  A: '8A',
  E: '9A',
  B: '10A',
  FSharp: '11A',
  CSharp: '12A',
  GSharp: '1A',
  Ab: '1A',
  Eb: '2A',
  DSharp: '2A',
  Bb: '3A',
  F: '4A',
  C: '5A',
  G: '6A',
  D: '7A',
};

function normalizeKeyToken(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  if (!t || t.toUpperCase() === 'UNKNOWN') return null;
  return t;
}

export function formatTidalKeyLabel(key: string | null, keyScale: string | null): string | null {
  if (!key) return null;
  const root = KEY_DISPLAY[key] ?? key;
  const scale = (keyScale || '').toUpperCase();
  if (!scale || scale === 'UNKNOWN' || scale === 'MAJOR') return root;
  if (scale === 'MINOR' || scale === 'AEOLIAN' || scale === 'HARMONIC_MINOR' || scale === 'MELODIC_MINOR') {
    return `${root}m`;
  }
  const pretty = scale
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return `${root} ${pretty}`;
}

export function tidalKeyToCamelot(key: string | null, keyScale: string | null): string | null {
  if (!key) return null;
  const scale = (keyScale || 'MAJOR').toUpperCase();
  if (scale === 'MAJOR' || scale === 'UNKNOWN' || !keyScale) {
    return CAMELOT_MAJOR[key] ?? null;
  }
  if (scale === 'MINOR' || scale === 'AEOLIAN' || scale === 'HARMONIC_MINOR' || scale === 'MELODIC_MINOR') {
    return CAMELOT_MINOR[key] ?? null;
  }
  return null;
}

function stringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === 'string' && v.length > 0);
}

function relationshipRefs(resource: JsonApiResource, relName: string): JsonApiResource[] {
  const rel = (resource as JsonApiResourceWithRels).relationships?.[relName]?.data;
  if (!rel) return [];
  return Array.isArray(rel) ? rel : [rel];
}

type ArtworkFileEntry = { href?: string; meta?: { width?: number; height?: number } };

function artworkUrlFromResource(artwork: JsonApiResource | undefined): string | null {
  if (!artwork) return null;
  const files = artwork.attributes?.files;
  if (!Array.isArray(files) || files.length === 0) return null;
  const entries = files.filter(
    (f): f is ArtworkFileEntry => typeof f === 'object' && f !== null && typeof (f as ArtworkFileEntry).href === 'string',
  );
  if (entries.length === 0) return null;
  const target = 160;
  const sorted = [...entries].sort((a, b) => {
    const aw = a.meta?.width ?? 9999;
    const bw = b.meta?.width ?? 9999;
    return Math.abs(aw - target) - Math.abs(bw - target);
  });
  return sorted[0]?.href ?? null;
}

function coverArtUrlForAlbum(
  album: JsonApiResource | undefined,
  artworksById: Map<string, JsonApiResource>,
): string | null {
  if (!album) return null;
  for (const artRef of relationshipRefs(album, 'coverArt')) {
    const url = artworkUrlFromResource(artworksById.get(artRef.id));
    if (url) return url;
  }
  return null;
}

function coverArtUrlForTrack(track: JsonApiResource, included: JsonApiResource[] | undefined): string | null {
  const albumsById = includedByType(included, 'albums');
  const artworksById = includedByType(included, 'artworks');
  for (const albumRef of relationshipRefs(track, 'albums')) {
    const url = coverArtUrlForAlbum(albumsById.get(albumRef.id), artworksById);
    if (url) return url;
  }
  return null;
}

function coverArtUrlForPlaylist(playlist: JsonApiResource, included: JsonApiResource[] | undefined): string | null {
  const artworksById = includedByType(included, 'artworks');
  for (const artRef of relationshipRefs(playlist, 'coverArt')) {
    const url = artworkUrlFromResource(artworksById.get(artRef.id));
    if (url) return url;
  }
  return null;
}

function nextCursorFromDoc(doc: JsonApiDocument): string | null {
  const fromMeta = doc.links?.meta?.nextCursor;
  if (typeof fromMeta === 'string' && fromMeta.length > 0) return fromMeta;
  const next = doc.links?.next;
  if (typeof next !== 'string' || !next) return null;
  try {
    const url = next.startsWith('http') ? new URL(next) : new URL(next, TIDAL_API_BASE);
    return url.searchParams.get('page[cursor]');
  } catch {
    return null;
  }
}

function mapTrackResource(
  track: JsonApiResource,
  included: JsonApiResource[] | undefined,
): TidalTrackSummary {
  const artistsById = includedByType(included, 'artists');
  const albumsById = includedByType(included, 'albums');
  const attrs = track.attributes ?? {};
  const durationSeconds = parseTidalDurationSeconds(attrs.duration);
  const bpm = typeof attrs.bpm === 'number' ? attrs.bpm : typeof attrs.bpm === 'string' ? Number.parseFloat(attrs.bpm) : null;
  const key = normalizeKeyToken(attrs.key);
  const keyScale = normalizeKeyToken(attrs.keyScale);
  const popularity =
    typeof attrs.popularity === 'number'
      ? attrs.popularity
      : typeof attrs.popularity === 'string'
        ? Number.parseFloat(attrs.popularity)
        : null;

  return {
    id: track.id,
    title: typeof attrs.title === 'string' ? attrs.title : 'Unknown track',
    durationSeconds,
    explicit: Boolean(attrs.explicit),
    artists: artistNamesFromRelationships(track, artistsById),
    album: albumTitleFromRelationships(track, albumsById),
    bpm: Number.isFinite(bpm) ? bpm : null,
    key,
    keyScale,
    keyLabel: formatTidalKeyLabel(key, keyScale),
    camelot: tidalKeyToCamelot(key, keyScale),
    isrc: typeof attrs.isrc === 'string' ? attrs.isrc : null,
    popularity: Number.isFinite(popularity) ? popularity : null,
    mediaTags: stringList(attrs.mediaTags),
    availability: stringList(attrs.availability),
    coverArtUrl: coverArtUrlForTrack(track, included),
  };
}

function mapPlaylistResource(playlist: JsonApiResource, included: JsonApiResource[] | undefined): TidalPlaylistSummary {
  const attrs = playlist.attributes ?? {};
  const numberOfItems =
    typeof attrs.numberOfItems === 'number'
      ? attrs.numberOfItems
      : typeof attrs.numberOfItems === 'string'
        ? Number.parseInt(attrs.numberOfItems, 10)
        : null;

  return {
    id: playlist.id,
    name: typeof attrs.name === 'string' ? attrs.name : 'Untitled playlist',
    description: typeof attrs.description === 'string' ? attrs.description : null,
    numberOfItems: Number.isFinite(numberOfItems) ? numberOfItems : null,
    coverArtUrl: coverArtUrlForPlaylist(playlist, included),
  };
}

function tracksFromItemRefs(
  itemRefs: JsonApiResource[],
  included: JsonApiResource[] | undefined,
  limit: number,
): TidalTrackSummary[] {
  const tracksById = includedByType(included, 'tracks');
  const tracks: TidalTrackSummary[] = [];
  for (const ref of itemRefs) {
    if (ref.type !== 'tracks') continue;
    const track = tracksById.get(ref.id);
    if (track) tracks.push(mapTrackResource(track, included));
    if (tracks.length >= limit) break;
  }
  return tracks;
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

  // Official catalog API (tidal-api-oas): GET /searchResults?filter[query]=…
  // Path /searchResults/{id} expects an opaque result id, not the free-text query
  // (that shape returns 400 "Invalid resource ID").
  // Nested includes pull artist/album titles for matched tracks.
  const include = 'tracks,tracks.artists,tracks.albums,tracks.albums.coverArt';
  let doc: JsonApiDocument;
  try {
    doc = await tidalApiFetch('/searchResults', accessToken, {
      'filter[query]': trimmed.slice(0, 256),
      countryCode,
      include,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    // Some tenants reject nested include paths; retry with fewer includes.
    if (message.includes('400') && include.includes('.')) {
      doc = await tidalApiFetch('/searchResults', accessToken, {
        'filter[query]': trimmed.slice(0, 256),
        countryCode,
        include: 'tracks,tracks.artists,tracks.albums',
      });
    } else {
      throw err;
    }
  }

  const searchResult = primarySearchResult(doc);
  if (!searchResult) {
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
    include: 'artists,albums,albums.coverArt',
  });

  const data = doc.data;
  if (!data || Array.isArray(data)) {
    throw new Error('Track not found');
  }

  return mapTrackResource(data, doc.included);
}

export async function listUserPlaylists(
  userId: string,
  limit = 30,
  cursor?: string | null,
): Promise<TidalPlaylistListResult> {
  const { countryCode } = requireTidalConfig();
  const accessToken = await getValidAccessToken(userId);
  const pageSize = Math.min(Math.max(limit, 1), 50);

  const params: Record<string, string> = {
    'filter[owners.id]': 'me',
    countryCode,
    include: 'coverArt',
    sort: '-lastModifiedAt',
  };
  if (cursor) params['page[cursor]'] = cursor;

  const doc = await tidalApiFetch('/playlists', accessToken, params);
  const data = doc.data;
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  const included = doc.included ?? [];

  return {
    playlists: rows.filter((r) => r.type === 'playlists').slice(0, pageSize).map((r) => mapPlaylistResource(r, included)),
    nextCursor: nextCursorFromDoc(doc),
  };
}

export async function getPlaylistTracks(
  userId: string,
  playlistId: string,
  limit = 50,
  cursor?: string | null,
): Promise<TidalTrackListResult> {
  const { countryCode } = requireTidalConfig();
  const accessToken = await getValidAccessToken(userId);
  const pageSize = Math.min(Math.max(limit, 1), 50);

  const params: Record<string, string> = {
    countryCode,
    include: 'items.tracks,items.tracks.artists,items.tracks.albums,items.tracks.albums.coverArt',
  };
  if (cursor) params['page[cursor]'] = cursor;

  let doc: JsonApiDocument;
  try {
    doc = await tidalApiFetch(`/playlists/${encodeURIComponent(playlistId)}`, accessToken, params);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('400')) {
      doc = await tidalApiFetch(`/playlists/${encodeURIComponent(playlistId)}`, accessToken, {
        countryCode,
        include: 'items.tracks,items.tracks.artists,items.tracks.albums',
      });
    } else {
      throw err;
    }
  }

  const playlist = doc.data;
  if (!playlist || Array.isArray(playlist)) {
    throw new Error('Playlist not found');
  }

  const itemRefs = relationshipRefs(playlist, 'items');
  return {
    tracks: tracksFromItemRefs(itemRefs, doc.included, pageSize),
    nextCursor: nextCursorFromDoc(doc),
  };
}

export async function listCollectionTracks(
  userId: string,
  limit = 50,
  cursor?: string | null,
): Promise<TidalTrackListResult> {
  const { countryCode } = requireTidalConfig();
  const accessToken = await getValidAccessToken(userId);
  const pageSize = Math.min(Math.max(limit, 1), 50);

  const params: Record<string, string> = {
    countryCode,
    include: 'items,items.artists,items.albums,items.albums.coverArt',
  };
  if (cursor) params['page[cursor]'] = cursor;

  let doc: JsonApiDocument;
  try {
    doc = await tidalApiFetch('/userCollectionTracks/me', accessToken, params);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('400')) {
      doc = await tidalApiFetch('/userCollectionTracks/me', accessToken, {
        countryCode,
        include: 'items,items.artists,items.albums',
      });
    } else {
      throw err;
    }
  }

  const collection = doc.data;
  if (!collection || Array.isArray(collection)) {
    return { tracks: [], nextCursor: null };
  }

  const itemRefs = relationshipRefs(collection, 'items');
  return {
    tracks: tracksFromItemRefs(itemRefs, doc.included, pageSize),
    nextCursor: nextCursorFromDoc(doc),
  };
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
