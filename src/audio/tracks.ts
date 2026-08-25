/** Catalog of practice tracks. Drop files in /public/tracks/ and list them here. */

export type TrackId = string;

export type TrackInfo = {
  id: TrackId;
  title: string;
  bpm: number;
  /** Path under public/, e.g. /tracks/house.mp3 — omit to use synth fallback */
  file?: string;
  /** Synth style used only when file is missing */
  synth?: "house" | "deep" | "breaks" | "tech";
  /** User-imported (not in public/) */
  user?: boolean;
};

/**
 * Add your own loops: put mp3/wav/ogg in public/tracks/, then add a row here.
 * Example: { id: "my-loop", title: "My loop", bpm: 124, file: "/tracks/my-loop.mp3" }
 */
export const TRACK_CATALOG: TrackInfo[] = [
  { id: "house", title: "House", bpm: 124, file: "/tracks/house.mp3", synth: "house" },
  { id: "deep", title: "Deep", bpm: 118, file: "/tracks/deep.mp3", synth: "deep" },
  { id: "breaks", title: "Breaks", bpm: 138, file: "/tracks/breaks.mp3", synth: "breaks" },
  { id: "tech", title: "Tech", bpm: 128, file: "/tracks/tech.mp3", synth: "tech" },
];

const userTracks: TrackInfo[] = [];
const bufferCache = new Map<string, AudioBuffer>();
const catalogListeners = new Set<() => void>();

let catalogSnapshot: TrackInfo[] = [...TRACK_CATALOG];

function rebuildCatalog() {
  catalogSnapshot = [...TRACK_CATALOG, ...userTracks];
  for (const fn of catalogListeners) fn();
}

export function subscribeCatalog(fn: () => void): () => void {
  catalogListeners.add(fn);
  return () => catalogListeners.delete(fn);
}

export function getTrackCatalog(): TrackInfo[] {
  return catalogSnapshot;
}

export function trackById(id: TrackId): TrackInfo {
  return getTrackCatalog().find((t) => t.id === id) ?? TRACK_CATALOG[0]!;
}

export function getCachedBuffer(id: TrackId): AudioBuffer | undefined {
  return bufferCache.get(id);
}

export function cacheTrackBuffer(id: TrackId, buffer: AudioBuffer) {
  bufferCache.set(id, buffer);
}

/** Decode a local file into the catalog (session-only; not persisted). */
export async function importUserTrack(
  file: File,
  ctx: AudioContext,
  bpm = 124,
): Promise<TrackInfo> {
  const ab = await file.arrayBuffer();
  const buffer = await ctx.decodeAudioData(ab.slice(0));
  const base = file.name.replace(/\.[^.]+$/, "") || "import";
  const id = `user-${Date.now()}-${base}`.replace(/[^a-zA-Z0-9_-]/g, "-");
  const info: TrackInfo = {
    id,
    title: base.slice(0, 40),
    bpm,
    user: true,
  };
  cacheTrackBuffer(id, buffer);
  userTracks.push(info);
  rebuildCatalog();
  return info;
}
