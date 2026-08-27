import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { trackById } from "../audio/tracks";
import { useTurntableSession } from "../audio/useTurntableSession";
import { usePublishDeckState, useTransitionMotionRecorder } from "../deck/hooks";
import {
  judgeBasicTransition,
  MIX_ZONES,
  pushPlayheadSample,
  TRANSITION_RECIPES,
  type PlayheadSample,
  type TransitionRecipeId,
} from "../mix/timingFeedback";
import { useCcZonePass } from "../midi/useCcZonePass";
import { useLiveController, type LiveDeckValues } from "../midi/useLiveController";
import { markLabPass } from "../tutorials/labPass";
import type { DeckHighlight } from "./MixUltraDeck";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { HowToUse, WhatItDoes } from "./HowToUse";
import { MixUltraDeck } from "./MixUltraDeck";
import { TrackPickerBar } from "./TrackPickerBar";
import { WaveformStrip } from "./WaveformStrip";

const { center, centerTol, killMax, xfLeftMax, xfRightMin } = MIX_ZONES;

type StepId = string;

type Step = {
  id: StepId;
  prompt: string;
  highlight: DeckHighlight;
  watch: (v: LiveDeckValues) => number | undefined;
  pass: (v: LiveDeckValues) => boolean;
};

const RECIPE_STEPS: Record<TransitionRecipeId, Step[]> = {
  "long-blend": [
    {
      id: "setup",
      prompt: "Crossfader left · both LOWs at 12 o’clock · both decks playing",
      highlight: "crossfader",
      watch: (v) => v.crossfader,
      pass: (v) => {
        const xf = v.crossfader ?? 64;
        const l1 = v["deck1.low"] ?? 64;
        const l2 = v["deck2.low"] ?? 64;
        return (
          xf <= xfLeftMax &&
          Math.abs(l1 - center) <= centerTol &&
          Math.abs(l2 - center) <= centerTol
        );
      },
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
      prompt: "Slide the crossfader full right — Deck 2 owns the room",
      highlight: "crossfader",
      watch: (v) => v.crossfader,
      pass: (v) => (v.crossfader ?? 0) >= xfRightMin,
    },
  ],
  "bass-swap": [
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
      prompt: "Kill Deck 2 LOW (fully left) — carve space for the blend",
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
  ],
  "filter-open": [
    {
      id: "setup",
      prompt: "Crossfader left · Deck 2 Filter right (thin) · LOW killed on Deck 2",
      highlight: "deck2.filter",
      watch: (v) => {
        const f = v["deck2.filter"] ?? 0;
        const low = v["deck2.low"] ?? 0;
        const xf = v.crossfader ?? 0;
        return f * 128 + low + xf;
      },
      pass: (v) =>
        (v.crossfader ?? 64) <= xfLeftMax &&
        (v["deck2.filter"] ?? 64) >= 88 &&
        (v["deck2.low"] ?? 64) <= killMax,
    },
    {
      id: "xfCenter",
      prompt: "Bring the crossfader toward center while Deck 2 stays thin",
      highlight: "crossfader",
      watch: (v) => v.crossfader,
      pass: (v) => Math.abs((v.crossfader ?? 0) - center) <= centerTol,
    },
    {
      id: "open",
      prompt: "Sweep Deck 2 Filter back to 12 o’clock (open the drop)",
      highlight: "deck2.filter",
      watch: (v) => v["deck2.filter"],
      pass: (v) => Math.abs((v["deck2.filter"] ?? 0) - center) <= centerTol,
    },
    {
      id: "finish",
      prompt: "Park crossfader full right — new song owns the room",
      highlight: "crossfader",
      watch: (v) => v.crossfader,
      pass: (v) => (v.crossfader ?? 0) >= xfRightMin,
    },
  ],
  "xfader-cut": [
    {
      id: "setup",
      prompt: "Both decks playing · EQ near 12 o’clock · crossfader left",
      highlight: "crossfader",
      watch: (v) => v.crossfader,
      pass: (v) => {
        const xf = v.crossfader ?? 64;
        const l1 = v["deck1.low"] ?? 64;
        const l2 = v["deck2.low"] ?? 64;
        return (
          xf <= xfLeftMax &&
          Math.abs(l1 - center) <= centerTol + 8 &&
          Math.abs(l2 - center) <= centerTol + 8
        );
      },
    },
    {
      id: "throw",
      prompt: "Throw the crossfader full right — a cut, not a long blend",
      highlight: "crossfader",
      watch: (v) => v.crossfader,
      pass: (v) => (v.crossfader ?? 0) >= xfRightMin,
    },
  ],
};

function tipClass(verdict: string): string {
  if (verdict === "ok" || verdict === "aligned") return "ok";
  if (verdict === "incomplete" || verdict === "n/a") return "incomplete";
  if (verdict === "warn" || verdict === "offset" || verdict === "too-slow") return "too-slow";
  return "too-fast";
}

/** Learn: named basic transitions get a numeric grade on hardware. */
export function TransitionLearn() {
  return (
    <div className="lab">
      <WhatItDoes>
        <p>
          <strong>Transition grade</strong> scores a same-speed handoff on the Mix Ultra with laptop
          audio: crossfader (or channel faders), LOW / MID / HIGH, Filter, tempo fader closeness, and
          an experimental kick scaffold. Neural Mix stems and djay SYNC are not graded here — leave
          SYNC off; stem mutes stay in the Neural labs.
        </p>
      </WhatItDoes>

      <HowToUse>
        <ol>
          <li>
            Warm up:{" "}
            <Link to="/labs/blend">Two-deck blend</Link>,{" "}
            <Link to="/labs/eq">Bass kill</Link>,{" "}
            <Link to="/labs/filter">Filter</Link>,{" "}
            <Link to="/labs/beatmatch">Beatmatch</Link>.
          </li>
          <li>
            Switch to <strong>On hardware</strong>, pick a move (long blend, bass swap, filter open,
            or cut), finish the steps, then read the score (pass ≥ 70).
          </li>
          <li>
            Same ideas with real songs:{" "}
            <Link to="/djing/transitions">Same-speed mixes</Link> ·{" "}
            <Link to="/tutorials/mix-long-blend">Long blend</Link> ·{" "}
            <Link to="/tutorials/mix-bass-swap">Bass swap</Link>.
          </li>
        </ol>
      </HowToUse>

      <p className="footer-note">
        Grading uses demo beds + MIDI motion — not a spectral “mud” meter for Tidal/djay streams.
      </p>
    </div>
  );
}

/** On hardware: recipe steps → numeric multi-dimension transition grade. */
export function TransitionHardware({
  initialRecipe = "bass-swap",
}: {
  initialRecipe?: TransitionRecipeId;
}) {
  const live = useLiveController(true);
  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: true,
    transportFromMidi: true,
  });
  const [recipe, setRecipe] = useState<TransitionRecipeId>(initialRecipe);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<StepId[]>([]);
  const [finished, setFinished] = useState(false);
  const [alignSamples, setAlignSamples] = useState<PlayheadSample[]>([]);
  const stepIndexRef = useRef(0);
  const finishedRef = useRef(false);

  const steps = RECIPE_STEPS[recipe];

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  const startedBoth = useRef(false);
  useEffect(() => {
    if (!tt.booted || startedBoth.current) return;
    startedBoth.current = true;
    void tt.playDeck(1);
    void tt.playDeck(2);
  }, [tt.booted, tt.playDeck]);

  const step = steps[stepIndex]!;
  const inZone = step.pass(live.values);
  const watchValue = step.watch(live.values);

  const { samples: motion, reset: resetMotion } = useTransitionMotionRecorder(
    {
      crossfader: live.values.crossfader,
      deck1Low: live.values["deck1.low"],
      deck2Low: live.values["deck2.low"],
      deck1Mid: live.values["deck1.mid"],
      deck2Mid: live.values["deck2.mid"],
      deck1High: live.values["deck1.high"],
      deck2High: live.values["deck2.high"],
      deck1Filter: live.values["deck1.filter"],
      deck2Filter: live.values["deck2.filter"],
      deck1Volume: live.values["deck1.volume"],
      deck2Volume: live.values["deck2.volume"],
      deck1Pitch: live.values["deck1.pitch"],
      deck2Pitch: live.values["deck2.pitch"],
    },
    !finished,
  );

  const pitch1 = live.values["deck1.pitch"] ?? 64;
  const pitch2 = live.values["deck2.pitch"] ?? 64;

  useEffect(() => {
    if (!tt.booted || finished || !tt.playing1 || !tt.playing2) return;
    const bpm1 = trackById(tt.track1).bpm;
    const bpm2 = trackById(tt.track2).bpm;
    setAlignSamples((prev) =>
      pushPlayheadSample(prev, {
        playhead1: tt.playhead1,
        playhead2: tt.playhead2,
        pitch1,
        pitch2,
        bpm1,
        bpm2,
      }),
    );
  }, [
    tt.booted,
    finished,
    tt.playing1,
    tt.playing2,
    tt.playhead1,
    tt.playhead2,
    tt.track1,
    tt.track2,
    pitch1,
    pitch2,
  ]);

  const grade = useMemo(() => {
    if (!finished) return null;
    return judgeBasicTransition(
      recipe,
      { ...motion, playheads: alignSamples },
      {
        bpm1: trackById(tt.track1).bpm,
        bpm2: trackById(tt.track2).bpm,
      },
    );
  }, [finished, recipe, motion, alignSamples, tt.track1, tt.track2]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setFinished(false);
    setAlignSamples([]);
    resetMotion();
    startedBoth.current = false;
  }, [resetMotion]);

  const changeRecipe = (id: TransitionRecipeId) => {
    setRecipe(id);
    setStepIndex(0);
    setDone([]);
    setFinished(false);
    setAlignSamples([]);
    resetMotion();
  };

  const advance = useCallback(() => {
    if (finishedRef.current) return;
    const i = stepIndexRef.current;
    const list = RECIPE_STEPS[recipe];
    const s = list[i];
    if (!s) return;
    setDone((d) => (d.includes(s.id) ? d : [...d, s.id]));
    if (i + 1 >= list.length) setFinished(true);
    else setStepIndex(i + 1);
  }, [recipe]);

  useCcZonePass({
    value: watchValue ?? null,
    inZone,
    enabled: !finished,
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
    try {
      await live.connect();
    } catch {
      /* MIDI optional */
    }
    await tt.boot();
    void tt.playDeck(1);
    void tt.playDeck(2);
  };

  useEffect(() => {
    if (finished && grade?.passed) markLabPass("/labs/transition");
  }, [finished, grade?.passed]);

  return (
    <HardwareLabShell
      onRestart={reset}
      extraToolbar={
        <button
          type="button"
          className={tt.booted ? "active" : ""}
          onClick={() => void arm()}
        >
          {tt.booted ? "Both decks on" : "Arm audio"}
        </button>
      }
    >
      {tt.error && <p className="midi-banner warn">{tt.error}</p>}
      {tt.booted && (!tt.playing1 || !tt.playing2) && (
        <p className="midi-banner warn">Start both decks — Play on D1 and D2, or re-arm.</p>
      )}

      <div className="lab-mode-toggle" role="tablist" aria-label="Transition recipe">
        {TRANSITION_RECIPES.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            className={recipe === r.id ? "active" : ""}
            aria-selected={recipe === r.id}
            disabled={finished && recipe === r.id}
            onClick={() => changeRecipe(r.id)}
          >
            {r.title}
          </button>
        ))}
      </div>
      <p className="lab-mode-note">{TRANSITION_RECIPES.find((r) => r.id === recipe)?.blurb}</p>

      <TrackPickerBar
        tracks={tt.tracks}
        track1={tt.track1}
        track2={tt.track2}
        onSelect={(deck, id) => void tt.setTrack(deck, id)}
        hint="Leave SYNC off — grade EQ / Filter / XF + tempo scaffold"
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
          {done.length}/{steps.length}
        </span>
        <span>xf {live.values.crossfader ?? "—"}</span>
        <span>D2 low {live.values["deck2.low"] ?? "—"}</span>
        <span>D2 filter {live.values["deck2.filter"] ?? "—"}</span>
        {grade && <span>score {grade.score}</span>}
      </div>

      <MixUltraDeck
        interactive
        highlight={finished ? null : step.highlight}
        values={live.values}
        pressed={live.pressed}
        playing1={tt.playing1}
        playing2={tt.playing2}
        prompt={finished ? "Transition locked — read the grade" : step.prompt}
        status={
          inZone
            ? "Hold it… locking in"
            : "Glow = this step’s control. Full score after the last park."
        }
      />

      {finished && grade && (
        <HardwareGrade pass={grade.passed}>
          <p>
            <strong>{grade.passed ? "Pass" : "Retry"}.</strong> {grade.summary}
          </p>
          {grade.dimensions.map((d) => (
            <p key={d.id} className={`mix-timing-tip ${tipClass(d.verdict)}`}>
              {d.label} ({d.score}): {d.tip}
            </p>
          ))}
          <p className="footer-note">
            Kick line is a playhead/BPM scaffold, not audio kick detection. Neural Mix pads:{" "}
            <Link to="/labs/neural-pads">Neural Mix pads</Link>.
          </p>
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
