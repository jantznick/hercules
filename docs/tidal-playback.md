# Tidal playback (hybrid model)

Hercules practice labs need **full Web Audio routing** (EQ, filter, crossfader, waveforms, grading). Tidal streams are **DRM-protected** and may only be decoded through TIDAL’s official **Player SDK** (`@tidal-music/player`). Those two paths do not merge into one turntable graph today.

This document locks the **hybrid** approach used across labs, search, and reference listening.

---

## Two audio paths

| Path | Source | Used for |
|------|--------|----------|
| **Turntable bed** | Bundled CC0 loops in `public/tracks/` (+ synth fallback) | Graded labs: blend, beatmatch, EQ/XF, free play, hot-cue drills |
| **Tidal reference** | Player SDK streamed bytes (Shaka/browser player) | Hear the real track; title/BPM/metadata from Open API |

**Do not** fetch manifests or stream URLs and pipe them into `AudioContext.decodeAudioData` or the turntable engine. Unofficial proxies violate TIDAL ToS and will not reliably decode DRM.

---

## What Tidal is for in Hercules

1. **Reference listening** — sidecar player (`TidalPlayerPanel`) while you practice on bundled beds.
2. **Catalog metadata** — search, title, artist, album, duration, **BPM** via backend Open API (`GET /api/tidal/search`, `GET /api/tidal/tracks/:id`).
3. **Track identity** — associate a lab session with a Tidal track id for display; the **audio engine still loads the bundled bed** (T2 picker).

Tidal is **not** a drop-in replacement for turntable buffers until/unless the Player SDK exposes routable PCM or a mixable output node.

---

## Architecture

```mermaid
flowchart LR
  subgraph spa [Vite SPA]
    Labs[Turntable labs]
    Picker[Track picker]
    Sidecar[TidalPlayerPanel]
    SDK["@tidal-music/player"]
  end
  subgraph api [apps/api]
    TidalRoutes["/api/tidal/*"]
    Tokens[TidalToken encrypted]
  end
  Labs --> bundled["public/tracks + Web Audio"]
  Picker --> TidalRoutes
  Picker --> bundled
  Sidecar --> SDK
  Sidecar --> TidalRoutes
  SDK --> TidalRoutes
  TidalRoutes --> Tokens
```

- **Layer 1:** Hercules session cookie (`connect.sid`) — all `/api/tidal/*` routes use `requireAuth`.
- **Layer 2:** Per-user `TidalToken` (PKCE OAuth, encrypted at rest). Refresh happens server-side.
- **Player bridge:** `GET /api/tidal/player-session` returns `{ clientId, accessToken, expiresAt }` for the logged-in user so the browser Player SDK can call `setCredentialsProvider` without storing Tidal secrets in `localStorage`.

Tokens are short-lived and session-gated; the frontend never sees the refresh token.

---

## Player SDK spike (T3)

Package: [`@tidal-music/player`](https://github.com/tidal-music/tidal-sdk-web/tree/main/packages/player) (evaluated at v0.20.1).

Minimal integration:

1. `bootstrap({ outputDevices: false, players: [{ itemTypes: ['track'], player: 'shaka' }, { itemTypes: ['track'], player: 'browser' }] })`
2. `setCredentialsProvider({ bus, getCredentials })` — `getCredentials` calls `/api/tidal/player-session`.
3. `load({ productId, productType: 'track', sourceId: 'hercules', sourceType: 'reference' })` then `play()`.
4. Audio renders via SDK `HTMLMediaElement` (sidecar `<audio>`), **not** the turntable graph.

Implementation: `src/components/TidalPlayerPanel.tsx` (Settings → reference player when Tidal is connected).

### Spike findings

| Topic | Status |
|-------|--------|
| Official SDK on npm | Yes — `@tidal-music/player@0.20.1` |
| DRM / playback | Requires SDK; no raw URL in Web Audio |
| Credentials | Server-stored OAuth; bridge endpoint for `getCredentials` |
| Routable Web Audio tap | **Not available** in spike — sidecar `<audio>` only |
| HTTPS | TIDAL dev demos use `https://dev.tidal.com`; production Hercules should serve HTTPS |
| Event telemetry | SDK supports `setEventSender` (@tidal-music/event-producer); omitted in spike |

---

## Lab behavior (unchanged)

- **Blend / beatmatch / EQ labs:** deck selects may show a Tidal track label, but **playback and grading use the bundled bed** at matching BPM.
- **Waveforms and mix coach:** derived from bundled buffers, not Tidal streams.
- **Reference player:** optional; open Settings or follow the track-picker link to hear the Tidal version.

---

## Out of scope

- Unofficial stream proxies or manifest scraping
- Replacing bundled beds with Tidal audio in graded labs
- Offline / download (Player offline engine)
- Spotify / Apple Music
- Routing Player SDK output into the crossfader

---

## Related files

- Backend OAuth + search: `apps/api/src/routes/tidal.ts`, `apps/api/src/lib/tidal.ts`
- Frontend API: `src/api/client.ts`
- Sidecar UI: `src/components/TidalPlayerPanel.tsx`
- Bundled catalog: `src/audio/tracks.ts`, `public/tracks/README.md`
- Master plan: `docs/plans/hercules-master-roadmap.md`
