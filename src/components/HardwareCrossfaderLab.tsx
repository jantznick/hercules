import { useCallback, useEffect, useRef, useState } from "react";
import { useTurntableSession } from "../audio/useTurntableSession";
import { useCcZonePass } from "../midi/useCcZonePass";
import { useLiveController } from "../midi/useLiveController";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";

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

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setFinished(false);
  }, []);

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

  return (
    <HardwareLabShell
      onRestart={reset}
      extraToolbar={
        <button type="button" className={tt.booted ? "active" : ""} onClick={() => void tt.boot().then(() => { void tt.playDeck(1); void tt.playDeck(2); })}>
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
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
