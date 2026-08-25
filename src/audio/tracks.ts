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
];

export function trackById(id: TrackId): TrackInfo {
  return TRACK_CATALOG.find((t) => t.id === id) ?? TRACK_CATALOG[0]!;
}
