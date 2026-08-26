/** Catalog of practice tracks. Drop files in /public/tracks/ and list them here. */

export type TrackId = string;

export type TrackSource = "bundled" | "tidal";

export type TrackInfo = {
  id: TrackId;
  title: string;
  bpm: number;
  /** Practice beds are bundled loops; Tidal rows are metadata-only references. */
  source: TrackSource;
  /** Path under public/, e.g. /tracks/house.mp3 — omit to use synth fallback */
  file?: string;
  /** Synth style used only when file is missing */
  synth?: "house" | "deep" | "breaks" | "tech";
};

/** Tidal track attached to a deck for reference listening / metadata — not turntable audio. */
export type TidalTrackRef = {
  id: string;
  title: string;
  artists: string[];
  bpm: number | null;
  durationSeconds: number | null;
  keyLabel: string | null;
  camelot: string | null;
  isrc: string | null;
};

/** Deck pick: bundled bed drives Web Audio EQ; optional Tidal ref for catalog context. */
export type DeckTrackSelection = {
  bedId: TrackId;
  tidal?: TidalTrackRef | null;
};

/**
 * Add your own loops: put mp3/wav/ogg in public/tracks/, then add a row here.
 * Example: { id: "my-loop", title: "My loop", bpm: 124, file: "/tracks/my-loop.mp3" }
 */
export const TRACK_CATALOG: TrackInfo[] = [
  { id: "house", title: "House", bpm: 124, source: "bundled", file: "/tracks/house.mp3", synth: "house" },
  { id: "deep", title: "Deep", bpm: 118, source: "bundled", file: "/tracks/deep.mp3", synth: "deep" },
  { id: "breaks", title: "Breaks", bpm: 138, source: "bundled", file: "/tracks/breaks.mp3", synth: "breaks" },
  { id: "tech", title: "Tech", bpm: 128, source: "bundled", file: "/tracks/tech.mp3", synth: "tech" },
  /** Blend / beatmatch pair — similar BPM (~126 vs 128). Synth beds until CC0 mp3s land. */
  { id: "blend-a", title: "Blend A", bpm: 126, source: "bundled", file: "/tracks/blend-a.mp3", synth: "house" },
  { id: "blend-b", title: "Blend B", bpm: 128, source: "bundled", file: "/tracks/blend-b.mp3", synth: "tech" },
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

export function getBundledTracks(): TrackInfo[] {
  return TRACK_CATALOG.filter((t) => t.source === "bundled");
}

export function deckSelection(bedId: TrackId, tidal?: TidalTrackRef | null): DeckTrackSelection {
  return tidal ? { bedId, tidal } : { bedId };
}

export function attachTidalToDeckSelection(
  selection: DeckTrackSelection,
  tidal: TidalTrackRef,
): DeckTrackSelection {
  return { ...selection, tidal };
}

export function clearTidalFromDeckSelection(selection: DeckTrackSelection): DeckTrackSelection {
  return { bedId: selection.bedId, tidal: null };
}

export function tidalRefFromApiTrack(track: {
  id: string;
  title: string;
  artists: string[];
  bpm: number | null;
  durationSeconds: number | null;
  keyLabel?: string | null;
  camelot?: string | null;
  isrc?: string | null;
}): TidalTrackRef {
  return {
    id: track.id,
    title: track.title,
    artists: track.artists,
    bpm: track.bpm,
    durationSeconds: track.durationSeconds,
    keyLabel: track.keyLabel ?? null,
    camelot: track.camelot ?? null,
    isrc: track.isrc ?? null,
  };
}

export function formatTidalKeyMeta(ref: Pick<TidalTrackRef, "keyLabel" | "camelot">): string {
  if (ref.keyLabel && ref.camelot) return `${ref.keyLabel} (${ref.camelot})`;
  return ref.keyLabel || ref.camelot || "";
}

export function formatTidalRefLabel(ref: TidalTrackRef): string {
  const artist = ref.artists[0] ?? "Unknown artist";
  const bpm = ref.bpm != null ? ` · ${Math.round(ref.bpm)} BPM` : "";
  const key = formatTidalKeyMeta(ref);
  const keyPart = key ? ` · ${key}` : "";
  const dur =
    ref.durationSeconds != null && Number.isFinite(ref.durationSeconds)
      ? ` · ${formatTrackDuration(ref.durationSeconds)}`
      : "";
  return `${artist} — ${ref.title}${bpm}${keyPart}${dur}`;
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
