import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTurntableSession } from "../audio/useTurntableSession";
import { useBlendMotionRecorder, usePublishDeckState } from "../deck/hooks";
import { trackById } from "../audio/tracks";
import { judgeBlendSession, MIX_ZONES } from "../mix/timingFeedback";
import { useCcZonePass } from "../midi/useCcZonePass";
import { useLiveController, type LiveDeckValues } from "../midi/useLiveController";
import type { DeckHighlight } from "./MixUltraDeck";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { HowToUse, WhatItDoes } from "./HowToUse";
import { MixUltraDeck } from "./MixUltraDeck";
import { TrackPickerBar } from "./TrackPickerBar";
import { WaveformStrip } from "./WaveformStrip";

const { center, centerTol, killMax, xfLeftMax, xfRightMin } = MIX_ZONES;

type StepId = "setup" | "killD2Low" | "xfCenter" | "finish";

type Step = {
  id: StepId;
  prompt: string;
  highlight: DeckHighlight;
  /** Primary CC for dwell re-trigger */
  watch: (v: LiveDeckValues) => number | undefined;
  pass: (v: LiveDeckValues) => boolean;
};

const STEPS: Step[] = [
  {
    id: "setup",
    prompt: "Crossfader left · Deck 2 LOW at 12 o’clock · both decks playing",
    highlight: "crossfader",
    watch: (v) => v.crossfader,
    pass: (v) => {
      const xf = v.crossfader ?? 64;
      const low = v["deck2.low"] ?? 64;
      return xf <= xfLeftMax && Math.abs(low - center) <= centerTol;
    },
  },
  {
    id: "killD2Low",
    prompt: "Kill Deck 2 LOW (fully left) — make room for the blend",
    highlight: "deck2.low",
    watch: (v) => v["deck2.low"],
    pass: (v) => (v["deck2.low"] ?? 64) <= killMax,
  },
  {
    id: "xfCenter",
    prompt: "Ease the crossfader toward center (both in the room)",
    highlight: "crossfader",
    watch: (v) => v.crossfader,
    pass: (v) => Math.abs((v.crossfader ?? 0) - center) <= centerTol,
  },
  {
    id: "finish",
    prompt: "Kill Deck 1 LOW and slide the crossfader full right",
    highlight: "deck1.low",
    watch: (v) => {
      const a = v["deck1.low"] ?? 0;
      const b = v.crossfader ?? 0;
      return a * 128 + b;
    },
    pass: (v) =>
      (v["deck1.low"] ?? 64) <= killMax && (v.crossfader ?? 0) >= xfRightMin,
  },
];

/** Learn: short copy pointing at EQ / Crossfader labs — no grading. */
export function BlendLearn() {
  return (
    <div className="lab">
      <WhatItDoes>
        <p>
          A <strong>two-deck blend</strong> is EQ + faders in a phrase: clear the incoming bass,
          open the room to both decks, then hand off. This lab grades those motions on the Mix Ultra
          with laptop audio — not kick alignment or SYNC.
        </p>
      </WhatItDoes>

      <HowToUse>
        <ol>
          <li>
            Warm up on{" "}
            <Link to="/labs/eq">Bass kill (LOW)</Link> and{" "}
            <Link to="/labs/crossfader">Crossfader</Link> if the knobs still feel new.
          </li>
          <li>
            Switch to <strong>On hardware</strong>: quit djay, connect MIDI, arm audio, then follow
            the four steps. You’ll get separate timing tips for bass kill and the crossfader.
          </li>
          <li>
            Later, do the same idea in djay with real songs (
            <Link to="/tutorials">Tutorials</Link> / <Link to="/djing/blend">Blend</Link>).
          </li>
        </ol>
      </HowToUse>

      <p className="footer-note">
        Practice surface only — beatmatching stays in the tutorials.
      </p>
    </div>
  );
}

/** On hardware: graded phrase-ish blend (Deck 2 LOW + crossfader timing). */
export function BlendHardware() {
  const live = useLiveController(true);
  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: live.ready,
    transportFromMidi: true,
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<StepId[]>([]);
  const [finished, setFinished] = useState(false);
  const stepIndexRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  const startedBoth = useRef(false);
  useEffect(() => {
    if (!live.ready || !tt.booted || startedBoth.current) return;
    startedBoth.current = true;
    void tt.playDeck(1);
    void tt.playDeck(2);
  }, [live.ready, tt.booted, tt.playDeck]);

  const step = STEPS[stepIndex]!;
  const inZone = step.pass(live.values);
  const watchValue = step.watch(live.values);

  const { samples, reset: resetMotion } = useBlendMotionRecorder(
    live.values["deck2.low"],
    live.values.crossfader,
    live.ready && !finished,
  );

  const blendBpm = useMemo(() => trackById(tt.track2).bpm, [tt.track2]);

  const timing = useMemo(() => {
    if (!finished) return null;
    return judgeBlendSession(samples, blendBpm);
  }, [finished, samples.low, samples.crossfader, blendBpm]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setFinished(false);
    resetMotion();
    startedBoth.current = false;
  }, [resetMotion]);

  const advance = useCallback(() => {
    if (finishedRef.current) return;
    const i = stepIndexRef.current;
    const s = STEPS[i];
    if (!s) return;
    setDone((d) => (d.includes(s.id) ? d : [...d, s.id]));
    if (i + 1 >= STEPS.length) setFinished(true);
    else setStepIndex(i + 1);
  }, []);

  useCcZonePass({
    value: watchValue ?? null,
    inZone,
    enabled: live.ready && !finished,
    dwellMs: 220,
    onPass: advance,
  });

  usePublishDeckState({
    playing1: tt.playing1,
    playing2: tt.playing2,
    track1: tt.track1,
    track2: tt.track2,
    cues1: tt.cues1,
    cues2: tt.cues2,
    values: live.values,
    playhead1: tt.playhead1,
    playhead2: tt.playhead2,
    duration1: tt.duration1,
    duration2: tt.duration2,
    midiReady: live.ready,
    audioReady: tt.booted,
    highlight: finished ? null : step.highlight,
    syncLeds: true,
  });

  const arm = async () => {
    await live.connect();
    await tt.boot();
    void tt.playDeck(1);
    void tt.playDeck(2);
  };

  return (
    <HardwareLabShell
      onRestart={reset}
      extraToolbar={
        <button
          type="button"
          className={live.ready && tt.booted ? "active" : ""}
          onClick={() => void arm()}
        >
          {live.ready && tt.booted ? "Both decks on" : "Connect + arm audio"}
        </button>
      }
    >
      {tt.error && <p className="midi-banner warn">{tt.error}</p>}
      {live.ready && tt.booted && (!tt.playing1 || !tt.playing2) && (
        <p className="midi-banner warn">Start both decks — Play on D1 and D2, or re-arm.</p>
      )}

      <TrackPickerBar
        tracks={tt.tracks}
        track1={tt.track1}
        track2={tt.track2}
        onSelect={(deck, id) => void tt.setTrack(deck, id)}
        hint="Leave SYNC out of this — grade EQ + crossfader only"
      />

      {tt.booted && (
        <div className="wave-stack">
          <WaveformStrip
            label="Deck 1"
            peaks={tt.peaks1}
            playhead={tt.playhead1}
            duration={tt.duration1}
            cues={tt.cues1}
            playing={tt.playing1}
          />
          <WaveformStrip
            label="Deck 2"
            peaks={tt.peaks2}
            playhead={tt.playhead2}
            duration={tt.duration2}
            cues={tt.cues2}
            playing={tt.playing2}
          />
        </div>
      )}

      <div className="hw-score-strip">
        <span>
          {done.length}/{STEPS.length}
        </span>
        <span>xf {live.values.crossfader ?? "—"}</span>
        <span>D2 low {live.values["deck2.low"] ?? "—"}</span>
        <span>D1 low {live.values["deck1.low"] ?? "—"}</span>
      </div>

      <MixUltraDeck
        highlight={finished ? null : step.highlight}
        values={live.values}
        pressed={live.pressed}
        playing1={tt.playing1}
        playing2={tt.playing2}
        prompt={finished ? "Blend locked in" : step.prompt}
        status={
          inZone
            ? "Hold it… locking in"
            : "Glow = this step’s control. Timing tips after the last park."
        }
      />

      {finished && timing && (
        <HardwareGrade pass>
          <p>
            <strong>Pass.</strong> That’s the EQ + crossfader handoff — practice kicks in djay next.
          </p>
          <p className={`mix-timing-tip ${timing.bass.verdict}`}>
            Bass: {timing.bass.tip}
          </p>
          <p className={`mix-timing-tip ${timing.crossfader.verdict}`}>
            Crossfader: {timing.crossfader.tip}
          </p>
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
