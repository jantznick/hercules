import { useEffect, useState, useSyncExternalStore } from "react";
import { applyLedState, clearLedCache, ledsFromSession, type LedId } from "../midi/leds";
import type { LiveDeckValues, LivePressed, PadBank } from "../midi/useLiveController";
import type { TrackId } from "../audio/tracks";
import {
  getDeckSnapshot,
  patchDeckSnapshot,
  subscribeDeckSnapshot,
  type DeckSnapshot,
} from "./state";

export function useDeckSnapshot(): DeckSnapshot {
  return useSyncExternalStore(subscribeDeckSnapshot, getDeckSnapshot, getDeckSnapshot);
}

type PublishArgs = {
  playing1: boolean;
  playing2: boolean;
  track1?: TrackId;
  track2?: TrackId;
  cues1: (number | null)[];
  cues2: (number | null)[];
  values?: LiveDeckValues;
  pressed?: LivePressed;
  pads1?: PadBank;
  pads2?: PadBank;
  playhead1?: number;
  playhead2?: number;
  duration1?: number;
  duration2?: number;
  midiReady?: boolean;
  audioReady?: boolean;
  syncLeds?: boolean;
  highlight?: string | null;
};

/** Push session fields into the global deck snapshot + optional MIDI LEDs. */
export function usePublishDeckState(args: PublishArgs) {
  const syncLeds = args.syncLeds !== false;
  const cues1Key = args.cues1.map((c) => c ?? "n").join(",");
  const cues2Key = args.cues2.map((c) => c ?? "n").join(",");

  useEffect(() => {
    const leds = ledsFromSession({
      playing1: args.playing1,
      playing2: args.playing2,
      cues1: args.cues1,
      cues2: args.cues2,
      highlight: args.highlight,
    });
    patchDeckSnapshot({
      playing1: args.playing1,
      playing2: args.playing2,
      track1: args.track1,
      track2: args.track2,
      cues1: args.cues1,
      cues2: args.cues2,
      values: args.values,
      pressed: args.pressed,
      pads1: args.pads1,
      pads2: args.pads2,
      playhead1: args.playhead1,
      playhead2: args.playhead2,
      duration1: args.duration1,
      duration2: args.duration2,
      midiReady: args.midiReady,
      audioReady: args.audioReady,
      leds,
    });
    if (syncLeds && args.midiReady) {
      applyLedState(leds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by cues*Key + primitives
  }, [
    args.playing1,
    args.playing2,
    args.track1,
    args.track2,
    cues1Key,
    cues2Key,
    args.playhead1,
    args.playhead2,
    args.midiReady,
    args.audioReady,
    args.highlight,
    syncLeds,
  ]);

  useEffect(() => {
    return () => {
      clearLedCache();
      const off: Partial<Record<LedId, boolean>> = {
        "deck1.play": false,
        "deck2.play": false,
        "deck1.cue": false,
        "deck2.cue": false,
      };
      for (let i = 0; i < 8; i++) {
        off[`deck1.pad.${i}` as LedId] = false;
        off[`deck2.pad.${i}` as LedId] = false;
      }
      applyLedState(off);
    };
  }, []);
}

/** Subscribe to CC motion for mix timing feedback (scaffolding). */
export function useMotionRecorder(value: number | undefined, enabled: boolean) {
  const [samples, setSamples] = useState<{ t: number; value: number }[]>([]);

  useEffect(() => {
    if (!enabled || value == null) return;
    setSamples((prev) => {
      const t = performance.now();
      const next = [...prev, { t, value }];
      const cutoff = t - 30_000;
      return next.filter((p) => p.t >= cutoff);
    });
  }, [value, enabled]);

  const reset = () => setSamples([]);
  return { samples, reset };
}
