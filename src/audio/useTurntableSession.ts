import { useCallback, useEffect, useRef, useState } from "react";
import { identifyMixUltra } from "../midi/mixUltraMap";
import type { LiveDeckValues, PadCueEvent } from "../midi/useLiveController";
import { useMidiMessages } from "../midi/useMidiBus";
import { TRACK_CATALOG } from "./tracks";
import {
  applyLiveMix,
  createTurntable,
  cueStopDeck,
  disposeTurntable,
  ensureAudio,
  getHotCues,
  handleJog,
  handlePad,
  loadTrack,
  setDeckPlaying,
  type TrackId,
  type TurntableEngine,
} from "./turntable";

export function useTurntableSession(opts: {
  values: LiveDeckValues;
  midiEnabled: boolean;
  transportFromMidi?: boolean;
}) {
  const engineRef = useRef<TurntableEngine | null>(null);
  const [booted, setBooted] = useState(false);
  const [playing1, setPlaying1] = useState(false);
  const [playing2, setPlaying2] = useState(false);
  const [track1, setTrack1] = useState<TrackId>("house");
  const [track2, setTrack2] = useState<TrackId>("deep");
  const [cues1, setCues1] = useState<(number | null)[]>(() => Array(8).fill(null));
  const [cues2, setCues2] = useState<(number | null)[]>(() => Array(8).fill(null));
  const [error, setError] = useState<string | null>(null);
  const valuesRef = useRef(opts.values);
  valuesRef.current = opts.values;

  useEffect(() => {
    return () => {
      void disposeTurntable(engineRef.current);
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current || !booted) return;
    applyLiveMix(engineRef.current, opts.values);
  }, [opts.values, booted]);

  const boot = useCallback(async () => {
    try {
      setError(null);
      if (!engineRef.current) {
        engineRef.current = await createTurntable();
      }
      await ensureAudio(engineRef.current);
      applyLiveMix(engineRef.current, valuesRef.current);
      setBooted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const playDeck = useCallback(
    async (deck: 1 | 2) => {
      if (!engineRef.current) await boot();
      const eng = engineRef.current;
      if (!eng) return;
      await ensureAudio(eng);
      setDeckPlaying(eng, deck, true);
      if (deck === 1) setPlaying1(true);
      else setPlaying2(true);
    },
    [boot],
  );

  const stopDeck = useCallback((deck: 1 | 2) => {
    if (!engineRef.current) return;
    cueStopDeck(engineRef.current, deck);
    if (deck === 1) setPlaying1(false);
    else setPlaying2(false);
  }, []);

  const setTrack = useCallback(
    async (deck: 1 | 2, id: TrackId) => {
      if (!engineRef.current) await boot();
      const eng = engineRef.current;
      if (!eng) return;
      await loadTrack(eng, deck, id);
      if (deck === 1) {
        setTrack1(id);
        setCues1(getHotCues(eng, 1));
      } else {
        setTrack2(id);
        setCues2(getHotCues(eng, 2));
      }
    },
    [boot],
  );

  const onPad = useCallback(async (ev: PadCueEvent) => {
    if (!engineRef.current) await boot();
    const eng = engineRef.current;
    if (!eng) return;
    await ensureAudio(eng);
    const cues = handlePad(eng, ev.deck, ev.pad, ev.clear);
    if (ev.deck === 1) {
      setCues1(cues);
      setPlaying1(eng.deck1.playing);
    } else {
      setCues2(cues);
      setPlaying2(eng.deck2.playing);
    }
  }, [boot]);

  const onJog = useCallback((deck: 1 | 2, delta: number) => {
    if (!engineRef.current) return;
    handleJog(engineRef.current, deck, delta);
  }, []);

  useMidiMessages(
    (msg) => {
      if (!opts.transportFromMidi || !opts.midiEnabled) return;
      const id = identifyMixUltra(msg);
      if (!id || msg.kind !== "noteon") return;
      if (id === "deck1.play") {
        if (engineRef.current?.deck1.playing) stopDeck(1);
        else void playDeck(1);
      }
      if (id === "deck2.play") {
        if (engineRef.current?.deck2.playing) stopDeck(2);
        else void playDeck(2);
      }
      // CUE while playing: stop + return to cue (startOffset / hot main)
      if (id === "deck1.cue") {
        if (engineRef.current?.deck1.playing) stopDeck(1);
      }
      if (id === "deck2.cue") {
        if (engineRef.current?.deck2.playing) stopDeck(2);
      }
    },
    opts.midiEnabled && opts.transportFromMidi !== false,
  );

  return {
    booted,
    error,
    boot,
    playDeck,
    stopDeck,
    setTrack,
    onPad,
    onJog,
    playing1,
    playing2,
    track1,
    track2,
    cues1,
    cues2,
    tracks: TRACK_CATALOG,
  };
}
