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
  /** Blend / beatmatch pair — similar BPM (~126 vs 128). Synth beds until CC0 mp3s land. */
  { id: "blend-a", title: "Blend A", bpm: 126, file: "/tracks/blend-a.mp3", synth: "house" },
  { id: "blend-b", title: "Blend B", bpm: 128, file: "/tracks/blend-b.mp3", synth: "tech" },
];

const bufferCache = new Map<string, AudioBuffer>();
const catalogListeners = new Set<() => void>();

export function subscribeCatalog(fn: () => void): () => void {
  catalogListeners.add(fn);
  return () => catalogListeners.delete(fn);
}

export function getTrackCatalog(): TrackInfo[] {
  return TRACK_CATALOG;
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

/** Format buffer length for track menus (e.g. 0:08). */
export function formatTrackDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
