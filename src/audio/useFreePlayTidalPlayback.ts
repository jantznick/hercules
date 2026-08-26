import { useCallback, useEffect, useRef, useState } from "react";
import type { PadCueEvent } from "../midi/useLiveController";
import {
  ensureTidalPlayerSdk,
  getCachedTidalPlayerModule,
  getTidalPlaybackDuration,
  getTidalPlaybackPosition,
  loadTidalTrack,
  mountTidalMediaElement,
  pauseTidalPlayback,
  preloadTidalTrack,
  seekTidalPlayback,
} from "../tidal/playerSdk";
import type { TidalTrackRef } from "./tracks";

/**
 * One Player SDK stream for Free Play — play/pause follows deck transport, not load.
 */
export function useFreePlayTidalPlayback(deck1: TidalTrackRef | null, deck2: TidalTrackRef | null) {
  const [playingDeck, setPlayingDeck] = useState<1 | 2 | null>(null);
  const [loadingDeck, setLoadingDeck] = useState<1 | 2 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playhead, setPlayhead] = useState(0);
  const [cues1, setCues1] = useState<(number | null)[]>(() => Array(8).fill(null));
  const [cues2, setCues2] = useState<(number | null)[]>(() => Array(8).fill(null));
  const audioHostRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef<{ deck: 1 | 2; id: string } | null>(null);

  const deckRef = useCallback(
    (deck: 1 | 2) => (deck === 1 ? deck1 : deck2),
    [deck1, deck2],
  );

  const cuesFor = useCallback(
    (deck: 1 | 2) => (deck === 1 ? cues1 : cues2),
    [cues1, cues2],
  );

  const setCuesFor = useCallback((deck: 1 | 2, next: (number | null)[]) => {
    if (deck === 1) setCues1(next);
    else setCues2(next);
  }, []);

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

  const ensureLoaded = useCallback(
    async (deck: 1 | 2, ref: TidalTrackRef) => {
      const needsLoad = loadedRef.current?.id !== ref.id || loadedRef.current?.deck !== deck;
      if (!needsLoad) {
        const mod = getCachedTidalPlayerModule() ?? (await ensureTidalPlayerSdk());
        mountTidalMediaElement(mod, audioHostRef.current);
        return mod;
      }
      setLoadingDeck(deck);
      try {
        const mod = await loadTidalTrack(ref.id, `hercules-free-d${deck}`, audioHostRef.current);
        loadedRef.current = { deck, id: ref.id };
        return mod;
      } finally {
        setLoadingDeck(null);
      }
    },
    [],
  );

  const preloadDeck = useCallback(
    async (deck: 1 | 2) => {
      const ref = deckRef(deck);
      if (!ref) return;
      setError(null);
      try {
        await preloadTidalTrack(ref.id, `hercules-free-d${deck}`, audioHostRef.current);
        loadedRef.current = { deck, id: ref.id };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Preload failed");
      }
    },
    [deckRef],
  );

  const playDeck = useCallback(
    (deck: 1 | 2) => {
      const ref = deckRef(deck);
      if (!ref) return;

      const needsLoad = loadedRef.current?.id !== ref.id || loadedRef.current?.deck !== deck;
      const cached = getCachedTidalPlayerModule();

      // Gesture-safe path: if already loaded, play synchronously in this tick.
      if (!needsLoad && cached) {
        if (playingDeck && playingDeck !== deck) {
          cached.pause();
        }
        mountTidalMediaElement(cached, audioHostRef.current);
        void cached
          .play()
          .then(() => setPlayingDeck(deck))
          .catch((err: unknown) => {
            setError(err instanceof Error ? err.message : "Playback failed");
            setPlayingDeck(null);
          });
        return;
      }

      if (playingDeck && playingDeck !== deck) {
        void pause();
      }

      setLoadingDeck(deck);
      setError(null);
      void (async () => {
        try {
          const mod = await ensureLoaded(deck, ref);
          await mod.play();
          setPlayingDeck(deck);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Playback failed");
          setPlayingDeck(null);
        } finally {
          setLoadingDeck(null);
        }
      })();
    },
    [deckRef, ensureLoaded, pause, playingDeck],
  );

  const onPad = useCallback(
    async (ev: PadCueEvent) => {
      const ref = deckRef(ev.deck);
      if (!ref) return;

      const cues = cuesFor(ev.deck).slice();
      if (ev.clear) {
        cues[ev.pad] = null;
        setCuesFor(ev.deck, cues);
        return;
      }

      const existing = cues[ev.pad];
      if (existing == null) {
        const pos =
          loadedRef.current?.deck === ev.deck && loadedRef.current.id === ref.id
            ? getTidalPlaybackPosition()
            : 0;
        cues[ev.pad] = pos;
        setCuesFor(ev.deck, cues);
        return;
      }

      setError(null);
      setLoadingDeck(ev.deck);
      try {
        const mod = await ensureLoaded(ev.deck, ref);
        await seekTidalPlayback(existing);
        await mod.play();
        setPlayingDeck(ev.deck);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Hot cue jump failed");
      } finally {
        setLoadingDeck(null);
      }
    },
    [cuesFor, deckRef, ensureLoaded, setCuesFor],
  );

  // Preload when a Tidal track is assigned to a deck (load-to-deck click keeps user gesture).
  useEffect(() => {
    if (deck1) void preloadDeck(1);
  }, [deck1?.id, preloadDeck]);

  useEffect(() => {
    if (deck2) void preloadDeck(2);
  }, [deck2?.id, preloadDeck]);

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
    if (!deck1) setCues1(Array(8).fill(null));
  }, [deck1]);

  useEffect(() => {
    if (!deck2) setCues2(Array(8).fill(null));
  }, [deck2]);

  useEffect(() => {
    if (deck1 || deck2) return;
    loadedRef.current = null;
    void pause();
  }, [deck1, deck2, pause]);

  useEffect(() => {
    if (!playingDeck) {
      setPlayhead(0);
      return;
    }
    let raf = 0;
    const tick = () => {
      setPlayhead(getTidalPlaybackPosition());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playingDeck]);

  const isPlaying = useCallback((deck: 1 | 2) => playingDeck === deck, [playingDeck]);
  const hasTidal = useCallback((deck: 1 | 2) => Boolean(deckRef(deck)), [deckRef]);

  const tidalDuration = useCallback(
    (deck: 1 | 2): number => {
      const ref = deckRef(deck);
      if (!ref) return 1;
      if (playingDeck === deck) {
        const live = getTidalPlaybackDuration();
        if (live != null && Number.isFinite(live) && live > 0) return live;
      }
      return ref.durationSeconds != null && ref.durationSeconds > 0 ? ref.durationSeconds : 240;
    },
    [deckRef, playingDeck],
  );

  const tidalPlayhead = useCallback(
    (deck: 1 | 2): number => (playingDeck === deck ? playhead : 0),
    [playhead, playingDeck],
  );

  return {
    audioHostRef,
    playDeck,
    stopDeck,
    pause,
    preloadDeck,
    onPad,
    isPlaying,
    hasTidal,
    loadingDeck,
    playingDeck,
    error,
    cues1,
    cues2,
    tidalDuration,
    tidalPlayhead,
  };
}
