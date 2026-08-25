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
/** MIDI pitch CC → playback rate (matches turntable applyDeckPitch). */
export function pitchCcToRate(cc: number): number {
  return 1 + ((cc - 64) / 64) * 0.08;
}

/** Fractional beat position (0–1) from playhead seconds and effective tempo. */
export function beatPhaseFromPlayhead(playheadSec: number, bpm: number, pitchCc: number): number {
  const beats = (playheadSec * bpm * pitchCcToRate(pitchCc)) / 60;
  return beats - Math.floor(beats);
}

/** Shortest signed phase delta in beats (−0.5…0.5). */
export function wrapBeatPhaseDelta(phaseA: number, phaseB: number): number {
  let d = phaseB - phaseA;
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  return d;
}

export type PlayheadSample = {
  t: number;
  playhead1: number;
  playhead2: number;
  pitch1: number;
  pitch2: number;
  bpm1: number;
  bpm2: number;
};

export type KickAlignGrade = "aligned" | "offset" | "drifting";

export type KickAlignJudgment = {
  /** True when both decks ran long enough to compare playhead drift vs BPM scaffold. */
  hasSignal: boolean;
  grade: KickAlignGrade | null;
  offsetBeats: number | null;
  driftBeatsPerSec: number | null;
  tip: string;
  /** Always true — best-effort scaffold, not spectral kick detection. */
  experimental: true;
};

const KICK_ALIGN_MIN_SAMPLES = 4;
const KICK_ALIGN_MIN_WINDOW_MS = 2000;
const KICK_ALIGN_DRIFT_THRESHOLD = 0.025;
const KICK_ALIGN_OFFSET_THRESHOLD = 0.1;

/** Rolling playhead snapshots for beatmatch kick scaffold (default ~10 Hz, 30s window). */
export function pushPlayheadSample(
  buf: PlayheadSample[],
  sample: Omit<PlayheadSample, "t">,
  maxAgeMs = 30_000,
  minIntervalMs = 100,
): PlayheadSample[] {
  const t = performance.now();
  const last = buf[buf.length - 1];
  if (last && t - last.t < minIntervalMs) return buf;
  const next = [...buf, { ...sample, t }];
  const cutoff = t - maxAgeMs;
  return next.filter((p) => p.t >= cutoff);
}

/**
 * Experimental kick-alignment hint: compare deck playhead drift against catalog BPM + pitch CC.
 * Does not analyze audio — only a tempo/phase scaffold for practice feedback.
 */
export function judgeKickAlignment(samples: PlayheadSample[]): KickAlignJudgment {
  const experimental = true as const;
  const silent = (tip: string): KickAlignJudgment => ({
    hasSignal: false,
    grade: null,
    offsetBeats: null,
    driftBeatsPerSec: null,
    tip,
    experimental,
  });

  if (samples.length < KICK_ALIGN_MIN_SAMPLES) {
    return silent("Need more play time with both decks running.");
  }

  const first = samples[0]!;
  const last = samples[samples.length - 1]!;
  const windowMs = last.t - first.t;
  if (windowMs < KICK_ALIGN_MIN_WINDOW_MS) {
    return silent("Keep both decks playing a bit longer.");
  }

  const beatsAdvanced = (playhead: number, bpm: number, pitch: number, base: number) =>
    ((playhead - base) * bpm * pitchCcToRate(pitch)) / 60;

  const deltaBeats1 = beatsAdvanced(last.playhead1, last.bpm1, last.pitch1, first.playhead1);
  const deltaBeats2 = beatsAdvanced(last.playhead2, last.bpm2, last.pitch2, first.playhead2);
  if (Math.abs(deltaBeats1) < 0.5 || Math.abs(deltaBeats2) < 0.5) {
    return silent("Both decks need to be playing.");
  }

  const beatSlip = deltaBeats2 - deltaBeats1;
  const driftBeatsPerSec = beatSlip / (windowMs / 1000);

  const phase1 = beatPhaseFromPlayhead(last.playhead1, last.bpm1, last.pitch1);
  const phase2 = beatPhaseFromPlayhead(last.playhead2, last.bpm2, last.pitch2);
  const signedOffset = wrapBeatPhaseDelta(phase1, phase2);
  const offsetBeats = Math.abs(signedOffset);

  if (Math.abs(driftBeatsPerSec) > KICK_ALIGN_DRIFT_THRESHOLD) {
    const dir = driftBeatsPerSec > 0 ? "fast" : "slow";
    return {
      hasSignal: true,
      grade: "drifting",
      offsetBeats,
      driftBeatsPerSec,
      tip: `Playheads drifting — Deck 2 may be ${dir} vs the BPM scaffold. Re-check the tempo fader.`,
      experimental,
    };
  }

  if (offsetBeats > KICK_ALIGN_OFFSET_THRESHOLD) {
    const effBpm2 = last.bpm2 * pitchCcToRate(last.pitch2);
    const ms = Math.round((offsetBeats * 60_000) / effBpm2);
    const earlyLate = signedOffset > 0 ? "late" : "early";
    return {
      hasSignal: true,
      grade: "offset",
      offsetBeats,
      driftBeatsPerSec,
      tip: `~${ms} ms ${earlyLate} on the beat grid — try a small jog nudge on Deck 2.`,
      experimental,
    };
  }

  return {
    hasSignal: true,
    grade: "aligned",
    offsetBeats,
    driftBeatsPerSec,
    tip: "Kick scaffold looks tight for this window — still trust your ears in djay.",
    experimental,
  };
}

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
