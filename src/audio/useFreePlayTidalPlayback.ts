import { useCallback, useEffect, useRef, useState } from "react";
import type { TidalTrackRef } from "./tracks";
import {
  ensureTidalPlayerSdk,
  loadTidalTrack,
  mountTidalMediaElement,
  pauseTidalPlayback,
} from "../tidal/playerSdk";

/**
 * One Player SDK stream for Free Play — play/pause follows deck transport, not load.
 */
export function useFreePlayTidalPlayback(deck1: TidalTrackRef | null, deck2: TidalTrackRef | null) {
  const [playingDeck, setPlayingDeck] = useState<1 | 2 | null>(null);
  const [loadingDeck, setLoadingDeck] = useState<1 | 2 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioHostRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef<{ deck: 1 | 2; id: string } | null>(null);

  const deckRef = useCallback(
    (deck: 1 | 2) => (deck === 1 ? deck1 : deck2),
    [deck1, deck2],
  );

  const pause = useCallback(async () => {
    try {
      await pauseTidalPlayback();
    } catch {
      /* SDK may not be bootstrapped yet */
    }
    setPlayingDeck(null);
  }, []);

  const stopDeck = useCallback(
    async (deck: 1 | 2) => {
      if (playingDeck !== deck) return;
      await pause();
    },
    [pause, playingDeck],
  );

  const playDeck = useCallback(
    async (deck: 1 | 2) => {
      const ref = deckRef(deck);
      if (!ref) return;

      if (playingDeck && playingDeck !== deck) {
        await pause();
      }

      setLoadingDeck(deck);
      setError(null);
      try {
        const needsLoad = loadedRef.current?.id !== ref.id || loadedRef.current?.deck !== deck;
        if (needsLoad) {
          await loadTidalTrack(ref.id, `hercules-free-d${deck}`, audioHostRef.current);
          loadedRef.current = { deck, id: ref.id };
        } else {
          const mod = await ensureTidalPlayerSdk();
          mountTidalMediaElement(mod, audioHostRef.current);
        }
        const mod = await ensureTidalPlayerSdk();
        await mod.play();
        setPlayingDeck(deck);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Playback failed");
        setPlayingDeck(null);
      } finally {
        setLoadingDeck(null);
      }
    },
    [deckRef, pause, playingDeck],
  );

  // Unload / swap track on deck — stop if that deck was playing.
  useEffect(() => {
    const loaded = loadedRef.current;
    if (!loaded) return;
    const current = deckRef(loaded.deck);
    if (!current || current.id !== loaded.id) {
      loadedRef.current = null;
      if (playingDeck === loaded.deck) {
        void pause();
      }
    }
  }, [deck1, deck2, deckRef, pause, playingDeck]);

  useEffect(() => {
    if (deck1 || deck2) return;
    loadedRef.current = null;
    void pause();
  }, [deck1, deck2, pause]);

  const isPlaying = useCallback((deck: 1 | 2) => playingDeck === deck, [playingDeck]);
  const hasTidal = useCallback((deck: 1 | 2) => Boolean(deckRef(deck)), [deckRef]);

  return {
    audioHostRef,
    playDeck,
    stopDeck,
    pause,
    isPlaying,
    hasTidal,
    loadingDeck,
    playingDeck,
    error,
  };
}
