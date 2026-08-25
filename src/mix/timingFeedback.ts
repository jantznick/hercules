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
  label?: string;
};

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
  if (durationMs < lo) {
    return {
      verdict: "too-fast",
      durationMs,
      tip: `${label} took ${(durationMs / 1000).toFixed(1)}s — slow it down (aim ~${(lo / 1000).toFixed(0)}–${(hi / 1000).toFixed(0)}s).`,
    };
  }
  if (durationMs > hi) {
    return {
      verdict: "too-slow",
      durationMs,
      tip: `${label} took ${(durationMs / 1000).toFixed(1)}s — a bit quicker (aim ~${(lo / 1000).toFixed(0)}–${(hi / 1000).toFixed(0)}s).`,
    };
  }
  return {
    verdict: "ok",
    durationMs,
    tip: `${label} timing looks good (${(durationMs / 1000).toFixed(1)}s).`,
  };
}

/** Common blend windows (phrase-ish). Tune per tutorial later. */
export const MIX_WINDOWS = {
  /** Soft bass kill while crossfading */
  bassSwap: { idealMs: [4000, 12000] as [number, number] },
  /** Full crossfader travel */
  crossfader: { idealMs: [2000, 8000] as [number, number] },
  /** Filter open into a drop */
  filterOpen: { idealMs: [1500, 6000] as [number, number] },
} as const;

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
 */
export function judgeBlendSession(samples: BlendSessionSamples): BlendSessionJudgment {
  const { center, centerTol, killMax, xfLeftMax, xfRightMin } = MIX_ZONES;
  const bass = judgeCcRamp(samples.low, {
    startZone: (v) => Math.abs(v - center) <= centerTol,
    endZone: (v) => v <= killMax,
    idealMs: MIX_WINDOWS.bassSwap.idealMs,
    label: "Deck 2 bass kill",
  });
  const crossfader = judgeCcRamp(samples.crossfader, {
    startZone: (v) => v <= xfLeftMax,
    endZone: (v) => v >= xfRightMin,
    idealMs: MIX_WINDOWS.crossfader.idealMs,
    label: "Crossfader blend",
  });
  return {
    bass,
    crossfader,
    complete: bass.verdict !== "incomplete" && crossfader.verdict !== "incomplete",
  };
}
