import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTurntableSession } from "../audio/useTurntableSession";
import { useMotionRecorder, usePublishDeckState } from "../deck/hooks";
import { judgeCcRamp, MIX_WINDOWS } from "../mix/timingFeedback";
import { useCcZonePass } from "../midi/useCcZonePass";
import { useLiveController } from "../midi/useLiveController";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";
import { WaveformStrip } from "./WaveformStrip";

const CENTER = 64;
const CENTER_TOL = 10;
const KILL_MAX = 14;

type StepId = "center1" | "kill" | "center2";

const STEPS: { id: StepId; prompt: string; pass: (v: number) => boolean }[] = [
  {
    id: "center1",
    prompt: "Set Deck 1 LOW to 12 o’clock",
    pass: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
  },
  {
    id: "kill",
    prompt: "Turn LOW fully left — kill the bass",
    pass: (v) => v <= KILL_MAX,
  },
  {
    id: "center2",
    prompt: "Bring LOW back to center",
    pass: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
  },
];

export function HardwareEqLab() {
  const live = useLiveController(true);
  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: true,
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

  const value = live.values["deck1.low"];
  const step = STEPS[stepIndex]!;
  const inZone = value != null && step.pass(value);

  const { samples, reset: resetMotion } = useMotionRecorder(
    value,
    !finished,
  );

  const timing = useMemo(() => {
    if (!finished) return null;
    return judgeCcRamp(samples, {
      startZone: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
      endZone: (v) => v <= KILL_MAX,
      idealMs: MIX_WINDOWS.bassSwap.idealMs,
      label: "Bass kill",
    });
  }, [finished, samples]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setFinished(false);
    resetMotion();
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
    value: value ?? null,
    inZone,
    enabled: !finished,
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
    highlight: finished ? null : "deck1.low",
    syncLeds: true,
  });

  return (
    <HardwareLabShell
      onRestart={reset}
      extraToolbar={
        <button
          type="button"
          className={tt.playing1 ? "active" : ""}
          onClick={() => void (tt.playing1 ? tt.stopDeck(1) : tt.playDeck(1))}
        >
          {tt.playing1 ? "Stop demo" : "Start demo D1"}
        </button>
      }
    >
      {!tt.playing1 && (
        <p className="midi-banner warn">Start demo D1 — bass kill is obvious with the kick in.</p>
      )}

      <div className="hw-score-strip">
        <span>
          {done.length}/{STEPS.length}
        </span>
        <span>{value ?? "—"}</span>
        {live.lastControl && <span>last: {live.lastControl}</span>}
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
        </div>
      )}

      <MixUltraDeck
        interactive
        highlight={finished ? null : "deck1.low"}
        values={live.values}
        pressed={live.pressed}
        playing1={tt.playing1}
        playing2={tt.playing2}
        prompt={finished ? "Bass kill locked in" : step.prompt}
        status={inZone ? "Hold it… locking in" : "Glow = LOW. Rest of the deck is live."}
      />

      {finished && (
        <HardwareGrade pass>
          <p>
            <strong>Pass.</strong> That’s the EQ kill for blending.
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
