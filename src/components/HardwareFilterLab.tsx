import { useCallback, useEffect, useRef, useState } from "react";
import { useTurntableSession } from "../audio/useTurntableSession";
import { usePublishDeckState } from "../deck/hooks";
import { useCcZonePass } from "../midi/useCcZonePass";
import { useLiveController } from "../midi/useLiveController";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";
import { WaveformStrip } from "./WaveformStrip";

const CENTER = 64;
const CENTER_TOL = 10;
const LEFT_MAX = 14;
const RIGHT_MIN = 113;

type StepId = "center1" | "left" | "center2" | "right" | "center3";

const STEPS: { id: StepId; prompt: string; pass: (v: number) => boolean }[] = [
  {
    id: "center1",
    prompt: "Park FILTER at 12 o’clock — hear the full loop",
    pass: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
  },
  {
    id: "left",
    prompt: "Twist Deck 1 FILTER fully left — highs disappear",
    pass: (v) => v <= LEFT_MAX,
  },
  {
    id: "center2",
    prompt: "Back to 12 o’clock — open again",
    pass: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
  },
  {
    id: "right",
    prompt: "Twist fully right — bass thins out",
    pass: (v) => v >= RIGHT_MIN,
  },
  {
    id: "center3",
    prompt: "Home to center",
    pass: (v) => Math.abs(v - CENTER) <= CENTER_TOL,
  },
];

function zoneLabel(v: number | null | undefined): string {
  if (v == null) return "move FILTER";
  if (v <= LEFT_MAX) return "full left";
  if (v >= RIGHT_MIN) return "full right";
  if (Math.abs(v - CENTER) <= CENTER_TOL) return "center ✓";
  if (v < CENTER) return "left of center";
  return "right of center";
}

export function HardwareFilterLab() {
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

  const value = live.values["deck1.filter"];
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

  usePublishDeckState({
    playing1: tt.playing1,
    playing2: tt.playing2,
    cues1: tt.cues1,
    cues2: tt.cues2,
    values: live.values,
    midiReady: live.ready,
    audioReady: tt.booted,
    highlight: finished ? null : "deck1.filter",
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
        <p className="midi-banner warn">
          Start demo D1 to hear FILTER. The whole deck still mirrors your hardware live.
        </p>
      )}

      <div className="hw-score-strip">
        <span>
          {done.length}/{STEPS.length}
        </span>
        <span>{zoneLabel(value)}</span>
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
        highlight={finished ? null : "deck1.filter"}
        values={live.values}
        pressed={live.pressed}
        playing1={tt.playing1}
        playing2={tt.playing2}
        prompt={finished ? "Filter sweep complete" : step.prompt}
        status={
          finished
            ? "Center open · left muffles · right thins"
            : inZone
              ? "Hold it… locking in"
              : "Glow = target. Every other control still moves live."
        }
      />

      {finished && (
        <HardwareGrade pass>
          <p>
            <strong>Pass.</strong> Try Free play next to mix two beds with EQ + crossfader.
          </p>
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
