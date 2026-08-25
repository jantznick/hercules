# Practice tracks

Bundled loops drive turntable labs (blend, beatmatch, EQ, free play). Tidal streams stay separate — see [`docs/tidal-playback.md`](../docs/tidal-playback.md).

## Curator workflow

1. **Source CC0 or owned loops** — short 4–8 bar seamless loops, steady kick, no long intros. Good fits: house/tech beds in the ~120–128 BPM range for blend and beatmatch drills.
2. **Drop files here** — `mp3`, `wav`, or `ogg` under `public/tracks/`. Keep filenames stable (kebab-case, match catalog `id`).
3. **Register in the catalog** — add or update a row in `src/audio/tracks.ts`:

```ts
{ id: "my-loop", title: "My loop", bpm: 124, file: "/tracks/my-loop.mp3", synth: "house" }
```

4. **Set `synth`** — one of `house`, `deep`, `breaks`, `tech`. Used only when the file is missing or fails to decode.
5. **Verify in app** — `/labs/free` or `/labs/blend`, pick the track on each deck, confirm loop length and BPM feel right.
6. **Commit mp3 + catalog row together** when adding real audio (keeps CI and fresh clones in sync).

## Blend / beatmatch pair

For two-deck matching and phrase blends, use the paired catalog ids:

| id        | file                 | BPM | synth fallback |
| --------- | -------------------- | --- | -------------- |
| `blend-a` | `/tracks/blend-a.mp3` | 126 | `house`        |
| `blend-b` | `/tracks/blend-b.mp3` | 128 | `tech`         |

Pick **Blend A** on Deck 1 and **Blend B** on Deck 2 in the track picker — close BPM, different timbre so kicks are easy to hear apart while matching.

Until those mp3 files are committed, the app **synth-only fallback** still works: each row’s `file` path is tried first; on 404 or decode error, Web Audio generates an 8-bar bed at the listed BPM using `synth`. No upload flow — curators drop files in-repo.

## Synth-only fallback (no mp3 yet)

If a catalog `file` is absent, labs are usable immediately:

- Fetch fails → `loadTrackBuffer` in `src/audio/turntable.ts` falls back to synthesized loops.
- Menu labels show BPM; duration appears once a buffer is cached.
- Adding the real mp3 later requires **no code change** if the path matches the catalog row.

To test fallback: run the app without dropping mp3s; select catalog entries in any lab with a track picker.

## Adding more beds

Duplicate the pattern above. Prefer matched pairs (similar BPM, different character) for beatmatch tutorials. Single vibes (breaks, deep) stay fine for EQ-only drills.

Suggested: tag CC0 source and license in the commit message when importing third-party loops.
