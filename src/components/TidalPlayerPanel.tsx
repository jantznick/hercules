import { useCallback, useEffect, useRef, useState } from "react";
import { tidalAPI, type TidalTrackSummary } from "../api/client";

type PlayerModule = typeof import("@tidal-music/player");

type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

let playerModulePromise: Promise<PlayerModule> | null = null;

function loadPlayerModule(): Promise<PlayerModule> {
  if (!playerModulePromise) {
    playerModulePromise = import("@tidal-music/player");
  }
  return playerModulePromise;
}

function formatArtists(track: TidalTrackSummary): string {
  return track.artists.length ? track.artists.join(", ") : "Unknown artist";
}

function formatDuration(seconds: number | null): string {
  if (seconds == null || !Number.isFinite(seconds)) return "";
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function TidalPlayerPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TidalTrackSummary[]>([]);
  const [selected, setSelected] = useState<TidalTrackSummary | null>(null);
  const [searching, setSearching] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [sdkVersion, setSdkVersion] = useState<string | null>(null);
  const audioHostRef = useRef<HTMLDivElement>(null);
  const sdkReadyRef = useRef(false);
  const searchTimerRef = useRef<number | null>(null);

  const ensureSdk = useCallback(async (): Promise<PlayerModule> => {
    const mod = await loadPlayerModule();

    if (!sdkReadyRef.current) {
      mod.bootstrap({
        outputDevices: false,
        players: [
          { itemTypes: ["track"], player: "shaka" },
          { itemTypes: ["track"], player: "browser" },
        ],
      });

      mod.setCredentialsProvider({
        bus: () => {},
        getCredentials: async () => {
          const session = await tidalAPI.playerSession();
          return {
            clientId: session.clientId,
            token: session.accessToken,
            requestedScopes: ["r_usr", "search.read"],
            expires: new Date(session.expiresAt).getTime(),
          };
        },
      });

      sdkReadyRef.current = true;
      setSdkVersion(mod.getPlayerVersion());
    }

    return mod;
  }, []);

  const mountMediaElement = useCallback((mod: PlayerModule) => {
    const host = audioHostRef.current;
    const el = mod.getMediaElement();
    if (!host || !el) return;
    if (el.parentElement !== host) {
      host.replaceChildren(el);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current != null) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    setStatusNote(null);
    try {
      const { tracks } = await tidalAPI.search(trimmed, 8);
      setResults(tracks);
      if (!tracks.length) {
        setStatusNote("No tracks found.");
      }
    } catch (err) {
      setResults([]);
      setStatusNote(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearching(false);
    }
  }, []);

  const onQueryChange = (value: string) => {
    setQuery(value);
    if (searchTimerRef.current != null) {
      window.clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = window.setTimeout(() => {
      void runSearch(value);
    }, 350);
  };

  const playTrack = async (track: TidalTrackSummary) => {
    setSelected(track);
    setPlaybackState("loading");
    setStatusNote(null);

    try {
      const mod = await ensureSdk();
      mod.load({
        productId: track.id,
        productType: "track",
        sourceId: "hercules-reference",
        sourceType: "settings-sidecar",
      });
      await mod.play();
      mountMediaElement(mod);
      setPlaybackState(mod.getPlaybackState() === "PLAYING" ? "playing" : "paused");
    } catch (err) {
      setPlaybackState("error");
      setStatusNote(err instanceof Error ? err.message : "Playback failed");
    }
  };

  const togglePlayback = async () => {
    if (!selected) return;
    try {
      const mod = await ensureSdk();
      const state = mod.getPlaybackState();
      if (state === "PLAYING") {
        mod.pause();
        setPlaybackState("paused");
      } else if (state === "IDLE") {
        await playTrack(selected);
      } else {
        await mod.play();
        mountMediaElement(mod);
        setPlaybackState("playing");
      }
    } catch (err) {
      setPlaybackState("error");
      setStatusNote(err instanceof Error ? err.message : "Playback failed");
    }
  };

  return (
    <section className="info-block tidal-player-panel" id="tidal-reference">
      <h2>Tidal reference player</h2>
      <p>
        Hear the real track via TIDAL&apos;s Player SDK. Turntable labs still use bundled loops for
        EQ and grading — see <code>docs/tidal-playback.md</code>.
      </p>
      {sdkVersion ? (
        <p className="tidal-player-meta">Player SDK v{sdkVersion} (spike)</p>
      ) : null}

      <label className="tidal-player-search">
        Search Tidal
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Title or artist"
          autoComplete="off"
        />
      </label>

      {searching ? <p className="tidal-player-meta">Searching…</p> : null}

      {results.length > 0 ? (
        <ul className="tidal-player-results">
          {results.map((track) => (
            <li key={track.id}>
              <button type="button" className="tidal-player-result" onClick={() => void playTrack(track)}>
                <span className="tidal-player-result-title">{track.title}</span>
                <span className="tidal-player-result-meta">
                  {formatArtists(track)}
                  {track.bpm != null ? ` · ${Math.round(track.bpm)} BPM` : ""}
                  {track.durationSeconds != null ? ` · ${formatDuration(track.durationSeconds)}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {selected ? (
        <div className="tidal-player-now">
          <p>
            <strong>{selected.title}</strong> — {formatArtists(selected)}
            {selected.bpm != null ? ` · ${Math.round(selected.bpm)} BPM` : ""}
          </p>
          <div className="auth-inline-actions">
            <button type="button" className="auth-inline-btn primary" onClick={() => void togglePlayback()}>
              {playbackState === "playing" ? "Pause" : "Play"}
            </button>
          </div>
        </div>
      ) : null}

      <div ref={audioHostRef} className="tidal-player-audio-host" aria-hidden="true" />

      {statusNote ? <p className="auth-inline-note">{statusNote}</p> : null}
      {playbackState === "loading" ? <p className="tidal-player-meta">Loading stream…</p> : null}
    </section>
  );
}
