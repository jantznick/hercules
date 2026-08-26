/**
 * Local dev: empty VITE_API_URL → Vite proxy `/api` → apps/api on :3001.
 * Production: set VITE_API_URL to the public API origin (we append `/api` unless it already ends with it).
 */
function resolveApiBase(): string {
  const raw = (import.meta.env.VITE_API_URL || "").trim();
  if (!raw) return "/api";
  const base = raw.replace(/\/$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

const API_BASE = resolveApiBase();

/** Absolute API path for full-page navigations (OAuth redirects). Uses VITE_API_URL in prod. */
export function apiHref(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (API_BASE.startsWith("http")) {
    return `${API_BASE.replace(/\/$/, "")}${p}`;
  }
  return `${API_BASE}${p}`;
}

export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 25_000);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      signal: controller.signal,
    });
  } catch (err) {
    window.clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timed out — try again");
    }
    throw err;
  }
  window.clearTimeout(timeout);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    const body = error as { error?: string; detail?: string };
    throw new Error(body.detail || body.error || "Request failed");
  }
  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

export const authAPI = {
  register: (email: string, password: string) =>
    request<{ user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  requestMagicToken: (email: string, intent: "login" | "register" = "login") =>
    request<{ message: string }>("/auth/magic-token/request", {
      method: "POST",
      body: JSON.stringify({ email, intent }),
    }),
  loginWithMagicToken: (token: string) =>
    request<{ user: AuthUser }>("/auth/magic-token/login", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  me: () => request<{ user: AuthUser }>("/auth/me"),
};

export type TidalConnectionStatus = {
  connected: boolean;
  expiresAt: string | null;
};

export type TidalPlayerSession = {
  clientId: string;
  accessToken: string;
  expiresAt: string;
};

export type TidalTrackSummary = {
  id: string;
  title: string;
  durationSeconds: number | null;
  explicit: boolean;
  artists: string[];
  album: string | null;
  bpm: number | null;
  key: string | null;
  keyScale: string | null;
  keyLabel: string | null;
  camelot: string | null;
  isrc: string | null;
  popularity: number | null;
  mediaTags: string[];
  availability: string[];
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

export const tidalAPI = {
  status: () => request<TidalConnectionStatus>("/tidal/status"),
  disconnect: () => request<{ message: string }>("/tidal/disconnect", { method: "POST" }),
  search: (q: string, limit?: number) => {
    const params = new URLSearchParams({ q });
    if (limit != null) params.set("limit", String(limit));
    return request<{ tracks: TidalTrackSummary[] }>(`/tidal/search?${params.toString()}`);
  },
  getTrack: (id: string) =>
    request<{ track: TidalTrackSummary }>(`/tidal/tracks/${encodeURIComponent(id)}`),
  /** @deprecated Use getTrack */
  track: (id: string) =>
    request<{ track: TidalTrackSummary }>(`/tidal/tracks/${encodeURIComponent(id)}`),
  playerSession: () => request<TidalPlayerSession>("/tidal/player-session"),
  playlists: (limit?: number, cursor?: string) => {
    const params = new URLSearchParams();
    if (limit != null) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    const q = params.toString();
    return request<TidalPlaylistListResult>(`/tidal/playlists${q ? `?${q}` : ""}`);
  },
  playlistTracks: (id: string, limit?: number, cursor?: string) => {
    const params = new URLSearchParams();
    if (limit != null) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    const q = params.toString();
    return request<TidalTrackListResult>(
      `/tidal/playlists/${encodeURIComponent(id)}/tracks${q ? `?${q}` : ""}`,
    );
  },
  collectionTracks: (limit?: number, cursor?: string) => {
    const params = new URLSearchParams();
    if (limit != null) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    const q = params.toString();
    return request<TidalTrackListResult>(`/tidal/collection/tracks${q ? `?${q}` : ""}`);
  },
};

export type PracticeKind = "lab" | "tutorial" | "drill";

export type PracticeEvent = {
  id: string;
  userId: string;
  kind: PracticeKind | string;
  targetId: string;
  passed: boolean | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
};

export type PracticeSummaryItem = {
  kind: PracticeKind | string;
  targetId: string;
  passed: boolean | null;
  createdAt: string;
  meta: Record<string, unknown> | null;
};

export type RecordPracticeEventInput = {
  kind: PracticeKind;
  targetId: string;
  passed?: boolean | null;
  meta?: Record<string, unknown>;
};

export const practiceAPI = {
  recordEvent: (input: RecordPracticeEventInput) =>
    request<{ event: PracticeEvent }>("/practice/events", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listEvents: (limit?: number) => {
    const params = limit != null ? `?limit=${limit}` : "";
    return request<{ events: PracticeEvent[] }>(`/practice/events${params}`);
  },
  summary: () => request<{ summary: PracticeSummaryItem[] }>("/practice/summary"),
};
