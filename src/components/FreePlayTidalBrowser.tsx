import { useCallback, useEffect, useState } from "react";
import { tidalAPI, type TidalPlaylistSummary, type TidalTrackSummary } from "../api/client";
import {
  formatTidalKeyMeta,
  tidalRefFromApiTrack,
  type TidalTrackRef,
} from "../audio/tracks";

type Tab = "search" | "playlists" | "saved";

type Props = {
  onLoad: (deck: 1 | 2, ref: TidalTrackRef) => void;
  tidal1: TidalTrackRef | null;
  tidal2: TidalTrackRef | null;
};

function trackMetaLine(track: Pick<TidalTrackSummary, "artists" | "bpm" | "keyLabel" | "camelot">): string {
  const artist = track.artists[0] ?? "Unknown artist";
  const bpm = track.bpm != null ? `${Math.round(track.bpm)} BPM` : "";
  const key = formatTidalKeyMeta(track);
  return [artist, bpm, key].filter(Boolean).join(" · ");
}

function TidalTrackCard({
  track,
  onLoadDeck1,
  onLoadDeck2,
  loadedOn,
}: {
  track: TidalTrackSummary;
  onLoadDeck1: () => void;
  onLoadDeck2: () => void;
  loadedOn?: 1 | 2 | null;
}) {
  return (
    <li className="tidal-track-card">
      <div className="tidal-track-card-main">
        {track.coverArtUrl ? (
          <img className="tidal-track-card-art" src={track.coverArtUrl} alt="" loading="lazy" />
        ) : (
          <div className="tidal-track-card-art tidal-track-card-art-fallback" aria-hidden="true" />
        )}
        <div className="tidal-track-card-body">
          <p className="tidal-track-card-title">{track.title}</p>
          <p className="tidal-track-card-meta">{trackMetaLine(track)}</p>
        </div>
      </div>
      <div className="tidal-track-card-actions">
        <button
          type="button"
          className={loadedOn === 1 ? "active" : ""}
          onClick={onLoadDeck1}
        >
          Deck 1
        </button>
        <button
          type="button"
          className={loadedOn === 2 ? "active" : ""}
          onClick={onLoadDeck2}
        >
          Deck 2
        </button>
      </div>
    </li>
  );
}

export function FreePlayTidalBrowser({ onLoad, tidal1, tidal2 }: Props) {
  const [tab, setTab] = useState<Tab>("search");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TidalTrackSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [playlists, setPlaylists] = useState<TidalPlaylistSummary[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [playlistsError, setPlaylistsError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<TidalPlaylistSummary | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<TidalTrackSummary[]>([]);
  const [playlistTracksLoading, setPlaylistTracksLoading] = useState(false);

  const [savedTracks, setSavedTracks] = useState<TidalTrackSummary[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  const loadedDeckFor = useCallback(
    (trackId: string): 1 | 2 | null => {
      if (tidal1?.id === trackId) return 1;
      if (tidal2?.id === trackId) return 2;
      return null;
    },
    [tidal1, tidal2],
  );

  const loadDeck = useCallback(
    (deck: 1 | 2, track: TidalTrackSummary) => {
      onLoad(deck, tidalRefFromApiTrack(track));
    },
    [onLoad],
  );

  useEffect(() => {
    const trimmed = query.trim();
    if (tab !== "search" || trimmed.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    setSearchError(null);
    const handle = window.setTimeout(() => {
      tidalAPI
        .search(trimmed, 12)
        .then((data) => setSearchResults(data.tracks))
        .catch(() => {
          setSearchResults([]);
          setSearchError("Search failed");
        })
        .finally(() => setSearching(false));
    }, 320);

    return () => window.clearTimeout(handle);
  }, [query, tab]);

  useEffect(() => {
    if (tab !== "playlists") return;
    let cancelled = false;
    setPlaylistsLoading(true);
    setPlaylistsError(null);
    tidalAPI
      .playlists(40)
      .then((data) => {
        if (!cancelled) setPlaylists(data.playlists);
      })
      .catch(() => {
        if (!cancelled) {
          setPlaylists([]);
          setPlaylistsError("Could not load playlists");
        }
      })
      .finally(() => {
        if (!cancelled) setPlaylistsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => {
    if (tab !== "saved") return;
    let cancelled = false;
    setSavedLoading(true);
    setSavedError(null);
    tidalAPI
      .collectionTracks(50)
      .then((data) => {
        if (!cancelled) setSavedTracks(data.tracks);
      })
      .catch(() => {
        if (!cancelled) {
          setSavedTracks([]);
          setSavedError("Could not load saved tracks");
        }
      })
      .finally(() => {
        if (!cancelled) setSavedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => {
    if (!selectedPlaylist) {
      setPlaylistTracks([]);
      return;
    }
    let cancelled = false;
    setPlaylistTracksLoading(true);
    tidalAPI
      .playlistTracks(selectedPlaylist.id, 50)
      .then((data) => {
        if (!cancelled) setPlaylistTracks(data.tracks);
      })
      .catch(() => {
        if (!cancelled) setPlaylistTracks([]);
      })
      .finally(() => {
        if (!cancelled) setPlaylistTracksLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedPlaylist]);

  return (
    <div className="free-play-tidal-browser">
      <p className="track-picker-lead">
        Browse Tidal, load a track to a deck, then hit PLAY on the deck to hear it.
      </p>

      <div className="free-play-tidal-tabs" role="tablist" aria-label="Tidal browse">
        {(["search", "playlists", "saved"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t === "search" ? "Search" : t === "playlists" ? "Playlists" : "Saved"}
          </button>
        ))}
      </div>

      {tab === "search" ? (
        <div className="free-play-tidal-panel" role="tabpanel">
          <label className="free-play-tidal-search-label" htmlFor="free-play-tidal-search">
            Search Tidal
          </label>
          <input
            id="free-play-tidal-search"
            type="search"
            className="track-tidal-input"
            placeholder="Title or artist…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {searching ? <p className="track-tidal-status">Searching…</p> : null}
          {searchError ? <p className="track-tidal-status warn">{searchError}</p> : null}
          {searchResults.length > 0 ? (
            <ul className="tidal-track-card-list">
              {searchResults.map((track) => (
                <TidalTrackCard
                  key={track.id}
                  track={track}
                  loadedOn={loadedDeckFor(track.id)}
                  onLoadDeck1={() => loadDeck(1, track)}
                  onLoadDeck2={() => loadDeck(2, track)}
                />
              ))}
            </ul>
          ) : query.trim().length >= 2 && !searching ? (
            <p className="track-tidal-status">No tracks found.</p>
          ) : null}
        </div>
      ) : null}

      {tab === "playlists" ? (
        <div className="free-play-tidal-panel free-play-tidal-playlists" role="tabpanel">
          {playlistsLoading ? <p className="track-tidal-status">Loading playlists…</p> : null}
          {playlistsError ? <p className="track-tidal-status warn">{playlistsError}</p> : null}
          <div className="free-play-playlist-layout">
            <ul className="free-play-playlist-list">
              {playlists.map((pl) => (
                <li key={pl.id}>
                  <button
                    type="button"
                    className={`free-play-playlist-row${selectedPlaylist?.id === pl.id ? " active" : ""}`}
                    onClick={() => setSelectedPlaylist(pl)}
                  >
                    {pl.coverArtUrl ? (
                      <img className="free-play-playlist-art" src={pl.coverArtUrl} alt="" loading="lazy" />
                    ) : (
                      <div className="free-play-playlist-art free-play-playlist-art-fallback" aria-hidden="true" />
                    )}
                    <span className="free-play-playlist-name">{pl.name}</span>
                    {pl.numberOfItems != null ? (
                      <span className="free-play-playlist-count">{pl.numberOfItems}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
            <div className="free-play-playlist-tracks">
              {!selectedPlaylist ? (
                <p className="track-tidal-status">Pick a playlist</p>
              ) : playlistTracksLoading ? (
                <p className="track-tidal-status">Loading tracks…</p>
              ) : playlistTracks.length === 0 ? (
                <p className="track-tidal-status">No tracks in this playlist.</p>
              ) : (
                <ul className="tidal-track-card-list">
                  {playlistTracks.map((track) => (
                    <TidalTrackCard
                      key={track.id}
                      track={track}
                      loadedOn={loadedDeckFor(track.id)}
                      onLoadDeck1={() => loadDeck(1, track)}
                      onLoadDeck2={() => loadDeck(2, track)}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "saved" ? (
        <div className="free-play-tidal-panel" role="tabpanel">
          {savedLoading ? <p className="track-tidal-status">Loading saved tracks…</p> : null}
          {savedError ? <p className="track-tidal-status warn">{savedError}</p> : null}
          {savedTracks.length > 0 ? (
            <ul className="tidal-track-card-list">
              {savedTracks.map((track) => (
                <TidalTrackCard
                  key={track.id}
                  track={track}
                  loadedOn={loadedDeckFor(track.id)}
                  onLoadDeck1={() => loadDeck(1, track)}
                  onLoadDeck2={() => loadDeck(2, track)}
                />
              ))}
            </ul>
          ) : !savedLoading && !savedError ? (
            <p className="track-tidal-status">No saved tracks yet.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
