export type SourceVideoId = "blakey5" | "carlo3";

export type SourceVideo = {
  id: string;
  watchUrl: string;
  title: string;
  credit: string;
};

export const SOURCE_VIDEOS: Record<SourceVideoId, SourceVideo> = {
  blakey5: {
    id: "my9n3W3uJDE",
    watchUrl: "https://www.youtube.com/watch?v=my9n3W3uJDE",
    title: "Five beginner DJ transitions",
    credit: "Blakey — Pioneer / rekordbox in the video. Steps on this site are Mix Ultra + djay.",
  },
  carlo3: {
    id: "B8DzneBmgYU",
    watchUrl: "https://www.youtube.com/watch?v=B8DzneBmgYU",
    title: "Mixing techniques (same speed, jumps, hype)",
    credit:
      "Controller / rekordbox in the video. Ignore record-pool and extra-app plugs — Mix Ultra + djay only here.",
  },
};
