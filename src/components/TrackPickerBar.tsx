import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tidalAPI } from "../api/client";
import {
  formatTidalRefLabel,
  formatTrackDuration,
  getCachedBuffer,
  tidalRefFromApiTrack,
  type TidalTrackRef,
  type TrackId,
  type TrackInfo,
} from "../audio/tracks";
import { useAuth } from "../context/AuthContext";

type Props = {
  tracks: TrackInfo[];
  track1: TrackId;
  track2: TrackId;
  onSelect: (deck: 1 | 2, id: TrackId) => void;
  hint?: string;
  /** Controlled Tidal refs (Free Play lifts these for deck UI + reference player). */
  tidal1?: TidalTrackRef | null;
  tidal2?: TidalTrackRef | null;
  onTidalSelect?: (deck: 1 | 2, ref: TidalTrackRef | null) => void;
  /** Emphasize Tidal search as the primary free-play path. */
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

type DeckTidalSearchProps = {
  deck: 1 | 2;
  tidalRef: TidalTrackRef | null;
  onSelectRef: (ref: TidalTrackRef | null) => void;
};

function DeckTidalSearch({ deck, tidalRef, onSelectRef }: DeckTidalSearchProps) {
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
          setResults(data.tracks.map(tidalRefFromApiTrack));
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

  return (
    <div className="track-tidal-deck-search">
      <label htmlFor={`tidal-search-d${deck}`}>Tidal · Deck {deck}</label>
      <input
        id={`tidal-search-d${deck}`}
        type="search"
        className="track-tidal-input"
        placeholder="Search title or artist…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {searching ? <span className="track-tidal-status">Searching…</span> : null}
      {searchError ? <span className="track-tidal-status warn">{searchError}</span> : null}
      {open && results.length > 0 ? (
        <ul className="track-tidal-results" role="listbox">
          {results.map((r) => (
            <li key={r.id}>
              <button type="button" role="option" onClick={() => pick(r)}>
                {formatTidalRefLabel(r)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {tidalRef ? (
        <p className="track-tidal-selected">
          <span>{formatTidalRefLabel(tidalRef)}</span>
          <button type="button" className="track-tidal-clear" onClick={() => onSelectRef(null)}>
            Clear
          </button>
        </p>
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

  return (
    <div className={`hw-free-bar track-picker-bar${freePlayMode ? " free-play" : ""}`}>
      {tidalReady ? (
        <p className="track-picker-hybrid-note">
          {freePlayMode
            ? "Load a Tidal track onto each deck, then Play reference below. Pads, EQ, and waveforms still run on the practice bed."
            : "Practice beds drive EQ, crossfader, and waveforms. Tidal picks are catalog metadata — use the reference player to hear the real track."}
        </p>
      ) : null}

      <div className="track-picker-decks">
        <div className="track-picker-deck">
          {tidalReady ? (
            <DeckTidalSearch deck={1} tidalRef={tidal1} onSelectRef={(ref) => setTidal(1, ref)} />
          ) : null}
          <label>
            Deck 1 · practice bed
            <select value={track1} onChange={(e) => onSelect(1, e.target.value)}>
              {beds.map((t) => (
                <option key={t.id} value={t.id}>
                  {trackLabel(t)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="track-picker-deck">
          {tidalReady ? (
            <DeckTidalSearch deck={2} tidalRef={tidal2} onSelectRef={(ref) => setTidal(2, ref)} />
          ) : null}
          <label>
            Deck 2 · practice bed
            <select value={track2} onChange={(e) => onSelect(2, e.target.value)}>
              {beds.map((t) => (
                <option key={t.id} value={t.id}>
                  {trackLabel(t)}
                </option>
              ))}
            </select>
          </label>
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
