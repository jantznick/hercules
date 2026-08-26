import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTurntableSession } from "../audio/useTurntableSession";
import { useMotionRecorder, usePublishDeckState } from "../deck/hooks";
import { trackById } from "../audio/tracks";
import {
  judgeCcRamp,
  judgeKickAlignment,
  pushPlayheadSample,
  type PlayheadSample,
} from "../mix/timingFeedback";
import { markLabPass } from "../tutorials/labPass";
import { useCcZonePass } from "../midi/useCcZonePass";
import { useLiveController } from "../midi/useLiveController";
import type { DeckHighlight } from "./MixUltraDeck";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { HowToUse, WhatItDoes } from "./HowToUse";
import { MixUltraDeck } from "./MixUltraDeck";
import { WaveformStrip } from "./WaveformStrip";

const CENTER = 64;
const CENTER_TOL = 10;
const OFF_CENTER_MIN = 16;

type StepId = "center1" | "tempo" | "jog" | "center2";

type Step = {
  id: StepId;
  prompt: string;
  highlight: DeckHighlight;
  pass: (pitch: number | undefined, jogNudges: number) => boolean;
  ccPass?: boolean;
};

const STEPS: Step[] = [
  {
    id: "center1",
    prompt: "Deck 2 tempo at center (original speed)",
    highlight: "deck2.pitch",
    pass: (pitch) => pitch != null && Math.abs(pitch - CENTER) <= CENTER_TOL,
    ccPass: true,
  },
  {
    id: "tempo",
    prompt: "Move Deck 2 tempo off center — like matching BPM by ear",
    highlight: "deck2.pitch",
    pass: (pitch) => pitch != null && Math.abs(pitch - CENTER) >= OFF_CENTER_MIN,
    ccPass: true,
  },
  {
    id: "jog",
    prompt: "Nudge Deck 2 jog wheel — small pushes, not a scratch",
    highlight: "deck2.jog",
    pass: (_pitch, jogNudges) => jogNudges >= 8,
    ccPass: false,
  },
  {
    id: "center2",
    prompt: "Return Deck 2 tempo to center",
    highlight: "deck2.pitch",
    pass: (pitch) => pitch != null && Math.abs(pitch - CENTER) <= CENTER_TOL,
    ccPass: true,
  },
];

/** Learn: tempo fader + jog — no grading. */
export function BeatmatchLearn() {
  return (
    <div className="lab">
      <WhatItDoes>
        <p>
          <strong>Beatmatching</strong> is two jobs: same speed (tempo fader next to the jog) and
          kicks hitting together (nudge the jog top). Leave SYNC off in djay — this lab maps those
          controls on the Mix Ultra with laptop audio. It does not grade kick alignment.
        </p>
      </WhatItDoes>

      <HowToUse>
        <ol>
          <li>
            Read{" "}
            <Link to="/djing/beatmatch">Match the speed yourself</Link> for the full idea — Key Lock
            holds pitch while you beatmatch, not a pitch SYNC.
          </li>
          <li>
            Switch to <strong>On hardware</strong>: both demo beds play, crossfader stays left so
            Deck 2 is “in headphones.” Finish the four steps for tempo + jog motion tips.
          </li>
          <li>
            Then try it in djay:{" "}
            <Link to="/tutorials/mix-manual-beatmatch">Full steps</Link> ·{" "}
            <Link to="/tutorials/mix-manual-beatmatch?mode=drill">Drill on hardware</Link>.
          </li>
        </ol>
      </HowToUse>

      <p className="footer-note">
        EQ / crossfader blending: <Link to="/labs/blend">Two-deck blend</Link> ·{" "}
        <Link to="/labs/free">Free play</Link>
      </p>
    </div>
  );
}

/** On hardware: tempo CC + jog motion tips (not kick alignment). */
export function BeatmatchHardware() {
  const jogRef = useRef<(deck: 1 | 2, delta: number) => void>(() => {});
  const live = useLiveController(true, undefined, (deck, delta) => jogRef.current(deck, delta));
  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: live.ready,
    transportFromMidi: true,
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<StepId[]>([]);
  const [finished, setFinished] = useState(false);
  const [jogNudges, setJogNudges] = useState(0);
  const [alignSamples, setAlignSamples] = useState<PlayheadSample[]>([]);
  const stepIndexRef = useRef(0);
  const finishedRef = useRef(false);
  const jogNudgesRef = useRef(0);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  useEffect(() => {
    jogNudgesRef.current = jogNudges;
  }, [jogNudges]);

  const startedBoth = useRef(false);
  useEffect(() => {
    if (!live.ready || !tt.booted || startedBoth.current) return;
    startedBoth.current = true;
    void tt.playDeck(1);
    void tt.playDeck(2);
  }, [live.ready, tt.booted, tt.playDeck]);

  const pitch = live.values["deck2.pitch"];
  const pitch1 = live.values["deck1.pitch"] ?? 64;
  const step = STEPS[stepIndex]!;
  const inZone = step.pass(pitch, jogNudges);

  useEffect(() => {
    if (!live.ready || !tt.booted || finished || !tt.playing1 || !tt.playing2) return;
    const bpm1 = trackById(tt.track1).bpm;
    const bpm2 = trackById(tt.track2).bpm;
    setAlignSamples((prev) =>
      pushPlayheadSample(prev, {
        playhead1: tt.playhead1,
        playhead2: tt.playhead2,
        pitch1,
        pitch2: pitch ?? 64,
        bpm1,
        bpm2,
      }),
    );
  }, [
    live.ready,
    tt.booted,
    finished,
    tt.playing1,
    tt.playing2,
    tt.playhead1,
    tt.playhead2,
    tt.track1,
    tt.track2,
    pitch1,
    pitch,
  ]);

  const { samples: pitchSamples, reset: resetPitchMotion } = useMotionRecorder(
    pitch,
    live.ready && !finished,
  );
  const { samples: jogSamples, reset: resetJogMotion } = useMotionRecorder(
    live.jogAngle2,
    live.ready && !finished,
  );

  const tempoTiming = useMemo(() => {
    if (!finished) return null;
    return judgeCcRamp(pitchSamples, {
      startZone: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
      endZone: (v) => Math.abs(v - CENTER) >= OFF_CENTER_MIN,
      idealMs: [2000, 10000],
      label: "Tempo fader move",
    });
  }, [finished, pitchSamples]);

  const jogTip = useMemo(() => {
    if (!finished) return null;
    if (jogSamples.length < 2) {
      return "Nudge the jog top while both decks play — small pushes until kicks lock.";
    }
    const spread =
      Math.max(...jogSamples.map((s) => s.value)) - Math.min(...jogSamples.map((s) => s.value));
    if (spread < 30) {
      return "Light jog nudges — in djay, listen for one kick, not a scratch.";
    }
    return "Jog motion logged — in djay, nudge until kicks hit as one.";
  }, [finished, jogSamples]);

  const kickAlign = useMemo(() => {
    if (!finished) return null;
    return judgeKickAlignment(alignSamples);
  }, [finished, alignSamples]);

  const kickAlignTipClass =
    kickAlign?.grade === "aligned"
      ? "ok"
      : kickAlign?.grade === "offset"
        ? "too-slow"
        : kickAlign?.grade === "drifting"
          ? "too-fast"
          : "";

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setFinished(false);
    setJogNudges(0);
    setAlignSamples([]);
    jogNudgesRef.current = 0;
    resetPitchMotion();
    resetJogMotion();
    startedBoth.current = false;
    tt.stopDeck(1);
    tt.stopDeck(2);
  }, [resetPitchMotion, resetJogMotion, tt.stopDeck]);

  const advance = useCallback(() => {
    if (finishedRef.current) return;
    const i = stepIndexRef.current;
    const s = STEPS[i];
    if (!s) return;
    setDone((d) => (d.includes(s.id) ? d : [...d, s.id]));
    if (i + 1 >= STEPS.length) setFinished(true);
    else {
      if (s.id === "tempo") setJogNudges(0);
      setStepIndex(i + 1);
    }
  }, []);

  jogRef.current = (deck, delta) => {
    tt.onJog(deck, delta);
    if (deck !== 2 || finishedRef.current || stepIndexRef.current !== 2) return;
    const next = jogNudgesRef.current + Math.abs(delta);
    jogNudgesRef.current = next;
    setJogNudges(next);
    if (next >= 8) advance();
  };

  useCcZonePass({
    value: pitch ?? null,
    inZone: step.ccPass === true && inZone,
    enabled: live.ready && !finished && step.ccPass === true,
    dwellMs: 220,
    onPass: advance,
  });

  usePublishDeckState({
    playing1: tt.playing1,
    playing2: tt.playing2,
    cues1: tt.cues1,
    cues2: tt.cues2,
    values: live.values,
    midiReady: live.ready,
    audioReady: tt.booted,
    highlight: finished ? null : step.highlight,
    syncLeds: true,
  });

  useEffect(() => {
    if (finished) markLabPass("/labs/beatmatch");
  }, [finished]);

  return (
    <HardwareLabShell
      onRestart={reset}
      extraToolbar={
        <button
          type="button"
          className={tt.booted ? "active" : ""}
          onClick={() =>
            void tt.boot().then(() => {
              startedBoth.current = true;
              void tt.playDeck(1);
              void tt.playDeck(2);
            })
          }
        >
          {tt.booted ? "Both decks on" : "Enable + play both"}
        </button>
      }
    >
      <div className="hw-score-strip">
        <span>
          {done.length}/{STEPS.length}
        </span>
        <span>tempo {pitch ?? "—"}</span>
        {step.id === "jog" && <span>jog nudges {jogNudges}</span>}
      </div>

      {tt.booted && (
        <div className="wave-stack">
          <WaveformStrip
            label="Deck 1 (room)"
            peaks={tt.peaks1}
            playhead={tt.playhead1}
            duration={tt.duration1}
            playing={tt.playing1}
          />
          <WaveformStrip
            label="Deck 2 (match this)"
            peaks={tt.peaks2}
            playhead={tt.playhead2}
            duration={tt.duration2}
            playing={tt.playing2}
          />
        </div>
      )}

      <MixUltraDeck
        highlight={finished ? null : step.highlight}
        values={live.values}
        pressed={live.pressed}
        playing1={tt.playing1}
        playing2={tt.playing2}
        jogAngle1={live.jogAngle1}
        jogAngle2={live.jogAngle2}
        prompt={finished ? "Tempo + jog mapped" : step.prompt}
        status={
          inZone
            ? step.id === "jog"
              ? "Good nudges — keep going"
              : "Hold it… locking in"
            : step.id === "jog"
              ? "Spin the jog top lightly — glow follows Deck 2"
              : "Glow = Deck 2 tempo. Crossfader left = headphones drill"
        }
      />

      {finished && (
        <HardwareGrade pass>
          <p>
            <strong>Pass.</strong> Tempo fader + jog are the beatmatch controls — kick alignment
            stays in the tutorials.
          </p>
          {tempoTiming && (
            <p className={`mix-timing-tip ${tempoTiming.verdict}`}>
              Tempo coach: {tempoTiming.tip}
            </p>
          )}
          {jogTip && <p className="mix-timing-tip ok">Jog coach: {jogTip}</p>}
          {kickAlign?.hasSignal && (
            <p className={`mix-timing-tip ${kickAlignTipClass}`}>
              <span className="experimental-badge">Experimental</span> Kick scaffold: {kickAlign.tip}
            </p>
          )}
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
