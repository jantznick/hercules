import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tidalAPI } from "../api/client";
import {
  formatTidalKeyMeta,
  formatTrackDuration,
  getCachedBuffer,
  type TidalTrackRef,
  type TrackId,
  type TrackInfo,
} from "../audio/tracks";
import { useAuth } from "../context/AuthContext";
import { FreePlayTidalBrowser } from "./FreePlayTidalBrowser";

type Props = {
  tracks: TrackInfo[];
  track1: TrackId;
  track2: TrackId;
  onSelect: (deck: 1 | 2, id: TrackId) => void;
  hint?: string;
  /** Controlled Tidal refs (Free Play lifts these for deck UI + player). */
  tidal1?: TidalTrackRef | null;
  tidal2?: TidalTrackRef | null;
  onTidalSelect?: (deck: 1 | 2, ref: TidalTrackRef | null) => void;
  /** Emphasize search → song on deck as the primary free-play path. */
  freePlayMode?: boolean;
};

function trackLabel(t: TrackInfo): string {
  const buf = getCachedBuffer(t.id);
  const dur = buf ? formatTrackDuration(buf.duration) : "";
  const parts = [t.title, String(t.bpm)];
  if (dur) parts.push(dur);
  return parts.join(" · ");
}

function bundledTracks(tracks: TrackInfo[]): TrackInfo[] {
  return tracks.filter((t) => t.source === "bundled");
}

function DeckLoadedCard({
  deck,
  tidalRef,
  onClear,
}: {
  deck: 1 | 2;
  tidalRef: TidalTrackRef;
  onClear: () => void;
}) {
  const artist = tidalRef.artists[0] ?? "Unknown artist";
  const key = formatTidalKeyMeta(tidalRef);
  const bpm = tidalRef.bpm != null ? `${Math.round(tidalRef.bpm)} BPM` : "";

  return (
    <div className="track-tidal-card deck-loaded">
      {tidalRef.coverArtUrl ? (
        <img className="track-tidal-card-art" src={tidalRef.coverArtUrl} alt="" loading="lazy" />
      ) : (
        <div className="track-tidal-card-art track-tidal-card-art-fallback" aria-hidden="true" />
      )}
      <div className="track-tidal-card-body">
        <p className="track-tidal-deck-label">Deck {deck}</p>
        <p className="track-tidal-card-title">{tidalRef.title}</p>
        <p className="track-tidal-card-artist">{artist}</p>
        <p className="track-tidal-card-meta">
          {[bpm, key].filter(Boolean).join(" · ") || "Loaded — press PLAY to hear it"}
        </p>
      </div>
      <button type="button" className="track-tidal-clear" onClick={onClear}>
        Eject
      </button>
    </div>
  );
}

type DeckTidalSearchProps = {
  deck: 1 | 2;
  tidalRef: TidalTrackRef | null;
  onSelectRef: (ref: TidalTrackRef | null) => void;
  freePlayMode: boolean;
};

function DeckTidalSearch({ deck, tidalRef, onSelectRef, freePlayMode }: DeckTidalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TidalTrackRef[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    setSearchError(null);
    const handle = window.setTimeout(() => {
      tidalAPI
        .search(trimmed, 8)
        .then((data) => {
          setResults(data.tracks.map((t) => ({
            id: t.id,
            title: t.title,
            artists: t.artists,
            bpm: t.bpm,
            durationSeconds: t.durationSeconds,
            keyLabel: t.keyLabel,
            camelot: t.camelot,
            isrc: t.isrc,
            coverArtUrl: t.coverArtUrl,
          })));
          setOpen(true);
        })
        .catch(() => {
          setResults([]);
          setSearchError("Search failed");
        })
        .finally(() => setSearching(false));
    }, 320);

    return () => window.clearTimeout(handle);
  }, [query]);

  const pick = useCallback(
    (ref: TidalTrackRef) => {
      onSelectRef(ref);
      setQuery("");
      setResults([]);
      setOpen(false);
    },
    [onSelectRef],
  );

  const artist = tidalRef?.artists[0] ?? "Unknown artist";
  const key = tidalRef ? formatTidalKeyMeta(tidalRef) : "";
  const bpm = tidalRef?.bpm != null ? `${Math.round(tidalRef.bpm)} BPM` : "";

  return (
    <div className={`track-tidal-deck-search${freePlayMode ? " free-play" : ""}`}>
      <label htmlFor={`tidal-search-d${deck}`}>
        {freePlayMode ? `Deck ${deck}` : `Tidal · Deck ${deck}`}
      </label>
      <input
        id={`tidal-search-d${deck}`}
        type="search"
        className="track-tidal-input"
        placeholder="Search songs…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {searching ? <span className="track-tidal-status">Searching…</span> : null}
      {searchError ? <span className="track-tidal-status warn">{searchError}</span> : null}
      {open && results.length > 0 ? (
        <ul className="track-tidal-results" role="listbox">
          {results.map((r) => {
            const rArtist = r.artists[0] ?? "Unknown artist";
            const rKey = formatTidalKeyMeta(r);
            const rBpm = r.bpm != null ? `${Math.round(r.bpm)} BPM` : "";
            return (
              <li key={r.id}>
                <button type="button" role="option" onClick={() => pick(r)}>
                  <span className="track-tidal-result-title">{r.title}</span>
                  <span className="track-tidal-result-meta">
                    {rArtist}
                    {rBpm ? ` · ${rBpm}` : ""}
                    {rKey ? ` · ${rKey}` : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      {tidalRef ? (
        <div className="track-tidal-card">
          <div className="track-tidal-card-body">
            <p className="track-tidal-card-title">{tidalRef.title}</p>
            <p className="track-tidal-card-artist">{artist}</p>
            <p className="track-tidal-card-meta">
              {bpm || key ? [bpm, key].filter(Boolean).join(" · ") : "On this deck"}
            </p>
          </div>
          <button type="button" className="track-tidal-clear" onClick={() => onSelectRef(null)}>
            Clear
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function TrackPickerBar({
  tracks,
  track1,
  track2,
  onSelect,
  hint,
  tidal1: tidal1Prop,
  tidal2: tidal2Prop,
  onTidalSelect,
  freePlayMode = false,
}: Props) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();
  const [tidalConnected, setTidalConnected] = useState(false);
  const [tidalStatusLoading, setTidalStatusLoading] = useState(false);
  const [tidal1Local, setTidal1Local] = useState<TidalTrackRef | null>(null);
  const [tidal2Local, setTidal2Local] = useState<TidalTrackRef | null>(null);

  const controlled = typeof onTidalSelect === "function";
  const tidal1 = controlled ? (tidal1Prop ?? null) : tidal1Local;
  const tidal2 = controlled ? (tidal2Prop ?? null) : tidal2Local;

  const setTidal = useCallback(
    (deck: 1 | 2, ref: TidalTrackRef | null) => {
      if (controlled) {
        onTidalSelect(deck, ref);
        return;
      }
      if (deck === 1) setTidal1Local(ref);
      else setTidal2Local(ref);
    },
    [controlled, onTidalSelect],
  );

  const beds = bundledTracks(tracks);

  useEffect(() => {
    if (!isAuthenticated) {
      setTidalConnected(false);
      if (!controlled) {
        setTidal1Local(null);
        setTidal2Local(null);
      }
      return;
    }

    let cancelled = false;
    setTidalStatusLoading(true);
    tidalAPI
      .status()
      .then((status) => {
        if (!cancelled) setTidalConnected(status.connected);
      })
      .catch(() => {
        if (!cancelled) setTidalConnected(false);
      })
      .finally(() => {
        if (!cancelled) setTidalStatusLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, controlled]);

  const tidalReady = isAuthenticated && tidalConnected && !tidalStatusLoading;
  const showPracticeBed1 = !freePlayMode || !tidalReady || !tidal1;
  const showPracticeBed2 = !freePlayMode || !tidalReady || !tidal2;

  return (
    <div className={`hw-free-bar track-picker-bar${freePlayMode ? " free-play" : ""}`}>
      {!freePlayMode && tidalReady ? (
        <p className="track-picker-hybrid-note">
          Practice beds drive EQ, crossfader, and waveforms. Tidal picks are catalog metadata — use
          the reference player to hear the real track.
        </p>
      ) : null}

      {freePlayMode && tidalReady ? (
        <FreePlayTidalBrowser
          tidal1={tidal1}
          tidal2={tidal2}
          onLoad={(deck, ref) => setTidal(deck, ref)}
        />
      ) : null}

      <div className="track-picker-decks">
        <div className="track-picker-deck">
          {freePlayMode && tidalReady && tidal1 ? (
            <DeckLoadedCard deck={1} tidalRef={tidal1} onClear={() => setTidal(1, null)} />
          ) : null}

          {!freePlayMode && tidalReady ? (
            <DeckTidalSearch
              deck={1}
              tidalRef={tidal1}
              onSelectRef={(ref) => setTidal(1, ref)}
              freePlayMode={freePlayMode}
            />
          ) : null}

          {showPracticeBed1 ? (
            <label>
              {freePlayMode ? "Deck 1 · practice tones" : "Deck 1 · practice bed"}
              <select value={track1} onChange={(e) => onSelect(1, e.target.value)}>
                {beds.map((t) => (
                  <option key={t.id} value={t.id}>
                    {trackLabel(t)}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <details className="track-picker-advanced">
              <summary>Use practice tones instead</summary>
              <label>
                Deck 1 tones
                <select value={track1} onChange={(e) => onSelect(1, e.target.value)}>
                  {beds.map((t) => (
                    <option key={t.id} value={t.id}>
                      {trackLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
              {tidal1 ? (
                <p className="track-picker-advanced-note">
                  EQ &amp; pads stay quiet under your song. Clear the song to hear these tones.
                </p>
              ) : null}
            </details>
          )}
        </div>

        <div className="track-picker-deck">
          {freePlayMode && tidalReady && tidal2 ? (
            <DeckLoadedCard deck={2} tidalRef={tidal2} onClear={() => setTidal(2, null)} />
          ) : null}

          {!freePlayMode && tidalReady ? (
            <DeckTidalSearch
              deck={2}
              tidalRef={tidal2}
              onSelectRef={(ref) => setTidal(2, ref)}
              freePlayMode={freePlayMode}
            />
          ) : null}

          {showPracticeBed2 ? (
            <label>
              {freePlayMode ? "Deck 2 · practice tones" : "Deck 2 · practice bed"}
              <select value={track2} onChange={(e) => onSelect(2, e.target.value)}>
                {beds.map((t) => (
                  <option key={t.id} value={t.id}>
                    {trackLabel(t)}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <details className="track-picker-advanced">
              <summary>Use practice tones instead</summary>
              <label>
                Deck 2 tones
                <select value={track2} onChange={(e) => onSelect(2, e.target.value)}>
                  {beds.map((t) => (
                    <option key={t.id} value={t.id}>
                      {trackLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
              {tidal2 ? (
                <p className="track-picker-advanced-note">
                  EQ &amp; pads stay quiet under your song. Clear the song to hear these tones.
                </p>
              ) : null}
            </details>
          )}
        </div>
      </div>

      {!isLoading && !isAuthenticated ? (
        <button type="button" className="track-tidal-stub" onClick={() => openAuthModal("login")}>
          Sign in for Tidal tracks
        </button>
      ) : null}

      {!isLoading && isAuthenticated && !tidalStatusLoading && !tidalConnected ? (
        <Link to="/settings" className="track-tidal-stub">
          Connect Tidal in Settings
        </Link>
      ) : null}

      {hint && <span className="hw-free-hint">{hint}</span>}
    </div>
  );
}
