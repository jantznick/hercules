# Practice tracks

## Bundled catalog (curators)

Drop loopable audio here (`mp3`, `wav`, or `ogg`), then register each file in:

`src/audio/tracks.ts`

```ts
{ id: "my-loop", title: "My loop", bpm: 124, file: "/tracks/my-loop.mp3" }
```

Suggested: short 4–8 bar seamless loops, roughly matched BPM per vibe.

If a file is missing, the app falls back to a simple synthesized bed for that catalog entry.
