# Practice tracks

## Bundled catalog

Drop loopable audio here (`mp3`, `wav`, or `ogg`), then register each file in:

`src/audio/tracks.ts`

```ts
{ id: "my-loop", title: "My loop", bpm: 124, file: "/tracks/my-loop.mp3" }
```

Suggested: short 4–8 bar seamless loops, roughly matched BPM per vibe.

If a file is missing, the app falls back to a simple synthesized bed for that catalog entry.

## Add from the app

In **Free play** (or any hardware lab with the track bar), use **Add file** on Deck 1 or 2. Imports stay in the browser session only (not uploaded, not written to this folder).
