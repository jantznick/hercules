import { useEffect, useRef, useState } from "react";
import type { TidalTrackRef } from "../audio/tracks";
import { formatTidalRefLabel } from "../audio/tracks";
import {
  ensureTidalPlayerSdk,
  mountTidalMediaElement,
  playTidalTrack,
} from "../tidal/playerSdk";

type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

type Props = {
  deck1: TidalTrackRef | null;
  deck2: TidalTrackRef | null;
};

/**
 * Free-play sidecar: play the Tidal track loaded on either deck via Player SDK.
 * Turntable EQ/pads still use the bundled practice bed.
 */
export function FreePlayTidalReference({ deck1, deck2 }: Props) {
  const [activeDeck, setActiveDeck] = useState<1 | 2>(1);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const audioHostRef = useRef<HTMLDivElement>(null);
  const playingIdRef = useRef<string | null>(null);

  const track = activeDeck === 1 ? deck1 : deck2;
  const other = activeDeck === 1 ? deck2 : deck1;

  useEffect(() => {
    if (track) return;
    if (other) setActiveDeck(activeDeck === 1 ? 2 : 1);
  }, [track, other, activeDeck]);

  useEffect(() => {
    if (track) return;
    playingIdRef.current = null;
    setPlaybackState("idle");
    void ensureTidalPlayerSdk()
      .then((mod) => {
        mod.pause();
      })
      .catch(() => {});
  }, [track]);

  const playActive = async () => {
    if (!track) return;
    setPlaybackState("loading");
    setStatusNote(null);
    try {
      const mod = await playTidalTrack(track.id, `hercules-free-d${activeDeck}`, audioHostRef.current);
      playingIdRef.current = track.id;
      setPlaybackState(mod.getPlaybackState() === "PLAYING" ? "playing" : "paused");
    } catch (err) {
      setPlaybackState("error");
      setStatusNote(err instanceof Error ? err.message : "Playback failed");
    }
  };

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
      await playActive();
    } catch (err) {
      setPlaybackState("error");
      setStatusNote(err instanceof Error ? err.message : "Playback failed");
    }
  };

  if (!deck1 && !deck2) {
    return (
      <div className="free-tidal-ref empty">
        <p>Search Tidal on a deck above, then play the real track here (Player SDK).</p>
      </div>
    );
  }

  return (
    <div className="free-tidal-ref">
      <div className="free-tidal-ref-head">
        <h3>Tidal reference</h3>
        <p className="free-tidal-ref-note">
          Tidal audio via Player SDK · deck pads/EQ/Neural Mix stay on the practice bed (no Tidal
          stems)
        </p>
      </div>

      <div className="free-tidal-ref-decks" role="tablist" aria-label="Reference deck">
        <button
          type="button"
          role="tab"
          aria-selected={activeDeck === 1}
          className={activeDeck === 1 ? "active" : ""}
          disabled={!deck1}
          onClick={() => setActiveDeck(1)}
        >
          Deck 1{deck1 ? `: ${deck1.title}` : ""}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeDeck === 2}
          className={activeDeck === 2 ? "active" : ""}
          disabled={!deck2}
          onClick={() => setActiveDeck(2)}
        >
          Deck 2{deck2 ? `: ${deck2.title}` : ""}
        </button>
      </div>

      {track ? (
        <div className="free-tidal-ref-now">
          <p className="free-tidal-ref-label">{formatTidalRefLabel(track)}</p>
          <button
            type="button"
            className="auth-inline-btn primary"
            onClick={() => void toggle()}
            disabled={playbackState === "loading"}
          >
            {playbackState === "loading"
              ? "Loading…"
              : playbackState === "playing" && playingIdRef.current === track.id
                ? "Pause reference"
                : "Play reference"}
          </button>
        </div>
      ) : null}

      <div ref={audioHostRef} className="tidal-player-audio-host" aria-hidden="true" />
      {statusNote ? <p className="auth-inline-note">{statusNote}</p> : null}
    </div>
  );
}
