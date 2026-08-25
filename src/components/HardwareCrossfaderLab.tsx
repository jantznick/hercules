import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTurntableSession } from "../audio/useTurntableSession";
import { useMotionRecorder, usePublishDeckState } from "../deck/hooks";
import { judgeCcRamp, MIX_WINDOWS } from "../mix/timingFeedback";
import { useCcZonePass } from "../midi/useCcZonePass";
import { useLiveController } from "../midi/useLiveController";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";
import { WaveformStrip } from "./WaveformStrip";

const LEFT_MAX = 18;
const RIGHT_MIN = 109;
const CENTER = 64;
const CENTER_TOL = 12;

type StepId = "left" | "center1" | "right" | "center2";

const STEPS: { id: StepId; prompt: string; pass: (v: number) => boolean }[] = [
  { id: "left", prompt: "Crossfader all the way to Deck 1", pass: (v) => v <= LEFT_MAX },
  {
    id: "center1",
    prompt: "Bring crossfader to the middle",
    pass: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
  },
  { id: "right", prompt: "Slide all the way to Deck 2", pass: (v) => v >= RIGHT_MIN },
  {
    id: "center2",
    prompt: "Back to center",
    pass: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
  },
];

export function HardwareCrossfaderLab() {
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

  const value = live.values.crossfader;
  const step = STEPS[stepIndex]!;
  const inZone = value != null && step.pass(value);

  const { samples, reset: resetMotion } = useMotionRecorder(
    value,
    live.ready && !finished,
  );

  const timing = useMemo(() => {
    if (!finished) return null;
    return judgeCcRamp(samples, {
      startZone: (v) => v <= LEFT_MAX,
      endZone: (v) => v >= RIGHT_MIN,
      idealMs: MIX_WINDOWS.crossfader.idealMs,
      label: "Left → right crossfader",
    });
  }, [finished, samples]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setFinished(false);
    resetMotion();
    tt.stopDeck(1);
    tt.stopDeck(2);
  }, [resetMotion, tt.stopDeck]);

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
    value: value ?? null,
    inZone,
    enabled: live.ready && !finished,
    dwellMs: 200,
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
    syncLeds: true,
  });

  return (
    <HardwareLabShell
      onRestart={reset}
      extraToolbar={
        <button
          type="button"
          className={tt.booted ? "active" : ""}
          onClick={() =>
            void tt.boot().then(() => {
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
        <span>xf {value ?? "—"}</span>
      </div>

      {tt.booted && (
        <div className="wave-stack">
          <WaveformStrip
            label="Deck 1"
            peaks={tt.peaks1}
            playhead={tt.playhead1}
            duration={tt.duration1}
            playing={tt.playing1}
          />
          <WaveformStrip
            label="Deck 2"
            peaks={tt.peaks2}
            playhead={tt.playhead2}
            duration={tt.duration2}
            playing={tt.playing2}
          />
        </div>
      )}

      <MixUltraDeck
        highlight={finished ? null : "crossfader"}
        values={live.values}
        pressed={live.pressed}
        playing1={tt.playing1}
        playing2={tt.playing2}
        prompt={finished ? "Crossfader mapped" : step.prompt}
        status={
          inZone
            ? "Hold it… locking in"
            : "Hear Deck 1 vs Deck 2 as you slide — glow is the crossfader"
        }
      />

      {finished && (
        <HardwareGrade pass>
          <p>
            <strong>Pass.</strong> Free play lets you pick different beds per deck.
          </p>
          {timing && (
            <p className={`mix-timing-tip ${timing.verdict}`}>
              Timing coach: {timing.tip}
            </p>
          )}
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
