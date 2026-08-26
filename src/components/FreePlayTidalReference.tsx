import { useCallback, useEffect, useRef, useState } from "react";
import type { TidalTrackRef } from "../audio/tracks";
import { formatTidalKeyMeta } from "../audio/tracks";
import {
  ensureTidalPlayerSdk,
  mountTidalMediaElement,
  playTidalTrack,
} from "../tidal/playerSdk";

type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

type Props = {
  deck1: TidalTrackRef | null;
  deck2: TidalTrackRef | null;
  /** Which deck’s song the single Player SDK stream should follow. */
  listeningDeck: 1 | 2;
  onListeningDeckChange: (deck: 1 | 2) => void;
};

/**
 * Free Play deck audio: one Tidal Player SDK stream, focused on the active deck.
 * Practice-bed EQ/pads stay muted separately when a Tidal track is loaded.
 */
export function FreePlayTidalReference({
  deck1,
  deck2,
  listeningDeck,
  onListeningDeckChange,
}: Props) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const audioHostRef = useRef<HTMLDivElement>(null);
  const playingIdRef = useRef<string | null>(null);
  const autoPlayedKeyRef = useRef<string | null>(null);

  const track = listeningDeck === 1 ? deck1 : deck2;
  const other = listeningDeck === 1 ? deck2 : deck1;
  const trackId = track?.id ?? null;

  useEffect(() => {
    if (track) return;
    if (other) onListeningDeckChange(listeningDeck === 1 ? 2 : 1);
  }, [track, other, listeningDeck, onListeningDeckChange]);

  useEffect(() => {
    if (track) return;
    playingIdRef.current = null;
    autoPlayedKeyRef.current = null;
    setPlaybackState("idle");
    void ensureTidalPlayerSdk()
      .then((mod) => {
        mod.pause();
      })
      .catch(() => {});
  }, [track]);

  const playActive = useCallback(async (deck: 1 | 2, ref: TidalTrackRef) => {
    setPlaybackState("loading");
    setStatusNote(null);
    try {
      const mod = await playTidalTrack(ref.id, `hercules-free-d${deck}`, audioHostRef.current);
      playingIdRef.current = ref.id;
      setPlaybackState(mod.getPlaybackState() === "PLAYING" ? "playing" : "paused");
    } catch (err) {
      setPlaybackState("error");
      setStatusNote(err instanceof Error ? err.message : "Playback failed");
    }
  }, []);

  // Selecting a song (or switching listening deck) starts that deck’s track.
  useEffect(() => {
    if (!track || !trackId) return;
    const key = `${listeningDeck}:${trackId}`;
    if (autoPlayedKeyRef.current === key) return;
    autoPlayedKeyRef.current = key;
    void playActive(listeningDeck, track);
  }, [listeningDeck, track, trackId, playActive]);

  const toggle = async () => {
    if (!track) return;
    try {
      const mod = await ensureTidalPlayerSdk();
      const state = mod.getPlaybackState();
      if (state === "PLAYING" && playingIdRef.current === track.id) {
        mod.pause();
        setPlaybackState("paused");
        return;
      }
      if (playingIdRef.current === track.id && state !== "IDLE") {
        await mod.play();
        mountTidalMediaElement(mod, audioHostRef.current);
        setPlaybackState("playing");
        return;
      }
      await playActive(listeningDeck, track);
    } catch (err) {
      setPlaybackState("error");
      setStatusNote(err instanceof Error ? err.message : "Playback failed");
    }
  };

  if (!deck1 && !deck2) {
    return null;
  }

  const artist = track?.artists[0] ?? "Unknown artist";
  const key = track ? formatTidalKeyMeta(track) : "";
  const bpm = track?.bpm != null ? `${Math.round(track.bpm)} BPM` : "";

  return (
    <div className="free-tidal-ref">
      <div className="free-tidal-ref-decks" role="tablist" aria-label="Listening deck">
        <button
          type="button"
          role="tab"
          aria-selected={listeningDeck === 1}
          className={listeningDeck === 1 ? "active" : ""}
          disabled={!deck1}
          onClick={() => onListeningDeckChange(1)}
        >
          Deck 1 listening
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={listeningDeck === 2}
          className={listeningDeck === 2 ? "active" : ""}
          disabled={!deck2}
          onClick={() => onListeningDeckChange(2)}
        >
          Deck 2 listening
        </button>
      </div>

      {track ? (
        <div className="free-tidal-ref-now">
          <div className="free-tidal-ref-now-meta">
            <p className="free-tidal-ref-title">{track.title}</p>
            <p className="free-tidal-ref-artist">
              {artist}
              {bpm ? ` · ${bpm}` : ""}
              {key ? ` · ${key}` : ""}
            </p>
          </div>
          <button
            type="button"
            className="auth-inline-btn primary"
            onClick={() => void toggle()}
            disabled={playbackState === "loading"}
          >
            {playbackState === "loading"
              ? "Loading…"
              : playbackState === "playing" && playingIdRef.current === track.id
                ? "Pause"
                : "Play"}
          </button>
        </div>
      ) : null}

      {deck1 && deck2 ? (
        <p className="free-tidal-ref-note">
          One song at a time — switch listening to hear the other deck.
        </p>
      ) : null}

      <div ref={audioHostRef} className="tidal-player-audio-host" aria-hidden="true" />
      {statusNote ? <p className="auth-inline-note">{statusNote}</p> : null}
    </div>
  );
}
