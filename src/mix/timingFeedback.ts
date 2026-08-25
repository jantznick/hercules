/**
 * Scaffolding for mix tutorials: judge how fast/slow a fader/EQ move was.
 * Feed CC samples while the user blends; call judgeCcRamp when they hit the end zone.
 */

export type MotionPoint = { t: number; value: number };

export type RampVerdict = "too-fast" | "too-slow" | "ok" | "incomplete";

export type RampJudgment = {
  verdict: RampVerdict;
  durationMs: number | null;
  tip: string;
};

export type RampOpts = {
  /** Start of the move (e.g. full bass / crossfader left) */
  startZone: (v: number) => boolean;
  /** Target end (e.g. bass killed / crossfader right) */
  endZone: (v: number) => boolean;
  /** Ideal duration window in ms [min, max] for "ok" */
  idealMs: [number, number];
  /** When set with phraseBars, tips say "~2 bars at 124 BPM" instead of seconds */
  phraseBpm?: number;
  phraseBars?: [number, number];
  label?: string;
};

/** Duration in ms for N bars of 4/4 at the given BPM. */
export function idealMsFromBars(bpm: number, bars: number): number {
  return (bars * 4 * 60 * 1000) / bpm;
}

/** Human phrase for a bar-count window at a tempo (e.g. "~2–6 bars at 124 BPM"). */
export function formatPhraseAim(bpm: number, barsLo: number, barsHi: number): string {
  const tempo = Math.round(bpm);
  if (barsLo === barsHi) {
    const unit = barsLo === 1 ? "bar" : "bars";
    return `~${barsLo} ${unit} at ${tempo} BPM`;
  }
  return `~${barsLo}–${barsHi} bars at ${tempo} BPM`;
}

function rampAimPhrase(opts: RampOpts, lo: number, hi: number): string {
  if (opts.phraseBpm != null && opts.phraseBars) {
    return formatPhraseAim(opts.phraseBpm, opts.phraseBars[0], opts.phraseBars[1]);
  }
  return `~${(lo / 1000).toFixed(0)}–${(hi / 1000).toFixed(0)}s`;
}

/**
 * Find first time in startZone, then first later time in endZone; compare duration.
 */
export function judgeCcRamp(points: MotionPoint[], opts: RampOpts): RampJudgment {
  const label = opts.label ?? "that move";
  if (points.length < 2) {
    return {
      verdict: "incomplete",
      durationMs: null,
      tip: `Keep moving — need a clear start and finish for ${label}.`,
    };
  }

  let startT: number | null = null;
  let endT: number | null = null;
  for (const p of points) {
    if (startT == null && opts.startZone(p.value)) startT = p.t;
    if (startT != null && opts.endZone(p.value)) {
      endT = p.t;
      break;
    }
  }

  if (startT == null || endT == null) {
    return {
      verdict: "incomplete",
      durationMs: null,
      tip: `Finish ${label} — park clearly in the start zone, then the end zone.`,
    };
  }

  const durationMs = endT - startT;
  const [lo, hi] = opts.idealMs;
  const aim = rampAimPhrase(opts, lo, hi);
  if (durationMs < lo) {
    return {
      verdict: "too-fast",
      durationMs,
      tip: `${label} took ${(durationMs / 1000).toFixed(1)}s — slow it down (aim ${aim}).`,
    };
  }
  if (durationMs > hi) {
    return {
      verdict: "too-slow",
      durationMs,
      tip: `${label} took ${(durationMs / 1000).toFixed(1)}s — a bit quicker (aim ${aim}).`,
    };
  }
  return {
    verdict: "ok",
    durationMs,
    tip: `${label} timing looks good (${(durationMs / 1000).toFixed(1)}s — ${aim}).`,
  };
}

/** Phrase bar counts for blend coaching (4/4). */
export const BLEND_PHRASE_BARS = {
  /** Soft bass kill while crossfading */
  bassSwap: [2, 6] as [number, number],
  /** Full crossfader travel */
  crossfader: [1, 4] as [number, number],
} as const;

/** Common blend windows at 120 BPM (phrase-ish). Tune per tutorial later. */
export const MIX_WINDOWS = {
  /** Soft bass kill while crossfading — ~2–6 bars @ 120 */
  bassSwap: {
    idealMs: [
      idealMsFromBars(120, BLEND_PHRASE_BARS.bassSwap[0]),
      idealMsFromBars(120, BLEND_PHRASE_BARS.bassSwap[1]),
    ] as [number, number],
  },
  /** Full crossfader travel — ~1–4 bars @ 120 */
  crossfader: {
    idealMs: [
      idealMsFromBars(120, BLEND_PHRASE_BARS.crossfader[0]),
      idealMsFromBars(120, BLEND_PHRASE_BARS.crossfader[1]),
    ] as [number, number],
  },
  /** Filter open into a drop */
  filterOpen: { idealMs: [1500, 6000] as [number, number] },
} as const;

export function blendWindowsForBpm(bpm: number) {
  const [bassLo, bassHi] = BLEND_PHRASE_BARS.bassSwap;
  const [xfLo, xfHi] = BLEND_PHRASE_BARS.crossfader;
  return {
    bassSwap: {
      idealMs: [idealMsFromBars(bpm, bassLo), idealMsFromBars(bpm, bassHi)] as [number, number],
      phraseBars: BLEND_PHRASE_BARS.bassSwap,
    },
    crossfader: {
      idealMs: [idealMsFromBars(bpm, xfLo), idealMsFromBars(bpm, xfHi)] as [number, number],
      phraseBars: BLEND_PHRASE_BARS.crossfader,
    },
  };
}

/** Append a sample; keep a rolling window (default 30s). */
export function pushSample(
  buf: MotionPoint[],
  value: number,
  maxAgeMs = 30_000,
): MotionPoint[] {
  const t = performance.now();
  const next = [...buf, { t, value }];
  const cutoff = t - maxAgeMs;
  return next.filter((p) => p.t >= cutoff);
}

/** Shared MIDI zones for blend / EQ / XF labs (0–127). */
export const MIX_ZONES = {
  center: 64,
  centerTol: 12,
  killMax: 14,
  xfLeftMax: 18,
  xfRightMin: 109,
} as const;

export type BlendSessionSamples = {
  /** Deck 2 LOW (or incoming-deck bass) over the session */
  low: MotionPoint[];
  crossfader: MotionPoint[];
};

export type BlendSessionJudgment = {
  bass: RampJudgment;
  crossfader: RampJudgment;
  /** Both series completed a clear start→end ramp (timing may still be fast/slow). */
  complete: boolean;
};

/**
 * Score a phrase-ish blend: Deck 2 LOW kill + full left→right crossfader travel.
 * Does not grade beatmatching / kick alignment.
 * Pass deck BPM for bar-aware ideal windows and coach copy.
 */
export function judgeBlendSession(
  samples: BlendSessionSamples,
  bpm?: number,
): BlendSessionJudgment {
  const { center, centerTol, killMax, xfLeftMax, xfRightMin } = MIX_ZONES;
  const windows = bpm != null ? blendWindowsForBpm(bpm) : null;
  const bass = judgeCcRamp(samples.low, {
    startZone: (v) => Math.abs(v - center) <= centerTol,
    endZone: (v) => v <= killMax,
    idealMs: windows?.bassSwap.idealMs ?? MIX_WINDOWS.bassSwap.idealMs,
    phraseBpm: bpm,
    phraseBars: windows?.bassSwap.phraseBars,
    label: "Deck 2 bass kill",
  });
  const crossfader = judgeCcRamp(samples.crossfader, {
    startZone: (v) => v <= xfLeftMax,
    endZone: (v) => v >= xfRightMin,
    idealMs: windows?.crossfader.idealMs ?? MIX_WINDOWS.crossfader.idealMs,
    phraseBpm: bpm,
    phraseBars: windows?.crossfader.phraseBars,
    label: "Crossfader blend",
  });
  return {
    bass,
    crossfader,
    complete: bass.verdict !== "incomplete" && crossfader.verdict !== "incomplete",
  };
}
