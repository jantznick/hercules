import { useCallback, useEffect, useRef, useState } from "react";
import { useTurntableSession } from "../audio/useTurntableSession";
import { usePublishDeckState } from "../deck/hooks";
import { identifyMixUltraNote, type MixUltraControl } from "../midi/mixUltraMap";
import { useLiveController } from "../midi/useLiveController";
import { useMidiMessages } from "../midi/useMidiBus";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";
import { WaveformStrip } from "./WaveformStrip";

type StepId = "play1" | "cue" | "play2";

const STEPS: { id: StepId; expect: "deck1.play" | "deck1.cue"; prompt: string }[] = [
  { id: "play1", expect: "deck1.play", prompt: "Press PLAY on Deck 1" },
  { id: "cue", expect: "deck1.cue", prompt: "Press CUE on Deck 1" },
  { id: "play2", expect: "deck1.play", prompt: "Press PLAY again" },
];

const LABELS: Partial<Record<MixUltraControl, string>> = {
  "deck1.play": "Deck 1 Play",
  "deck1.cue": "Deck 1 CUE",
  "deck2.play": "Deck 2 Play",
  "deck2.cue": "Deck 2 CUE",
  "deck1.sync": "SYNC",
  "deck2.sync": "Deck 2 SYNC",
};

export function HardwarePlayCueLab() {
  const live = useLiveController(true);
  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: live.ready,
    transportFromMidi: false,
  });
  const { playDeck, stopDeck, playing1, playing2 } = tt;
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<StepId[]>([]);
  const [misses, setMisses] = useState(0);
  const [status, setStatus] = useState("Glow = target. Knobs/faders still mirror live.");
  const [finished, setFinished] = useState(false);
  const stepIndexRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setMisses(0);
    setFinished(false);
    setStatus("Glow = target. Knobs/faders still mirror live.");
    stopDeck(1);
  }, [stopDeck]);

  useMidiMessages(
    (msg) => {
      if (finishedRef.current || msg.kind !== "noteon") return;
      if (msg.channel == null || msg.number == null) return;
      const i = stepIndexRef.current;
      const step = STEPS[i];
      if (!step) return;

      const known = identifyMixUltraNote(msg.channel, msg.number);
      if (known === step.expect) {
        if (step.expect === "deck1.play") void playDeck(1);
        if (step.expect === "deck1.cue") stopDeck(1);
        setDone((d) => [...d, step.id]);
        if (i + 1 >= STEPS.length) {
          setFinished(true);
          setStatus("Play starts the bed · CUE stops it.");
        } else {
          setStepIndex(i + 1);
          setStatus("Good — next control is lit.");
        }
        return;
      }
      if (!known) return;
      setMisses((m) => m + 1);
      setStatus(`That was ${LABELS[known] ?? known} — look for the glow.`);
    },
    live.ready && !finished,
  );

  const step = STEPS[stepIndex]!;
  const score = finished
    ? Math.max(0, Math.round((done.length / STEPS.length) * 100 - misses * 8))
    : null;

  usePublishDeckState({
    playing1,
    playing2,
    cues1: tt.cues1,
    cues2: tt.cues2,
    values: live.values,
    pressed: live.pressed,
    midiReady: live.ready,
    audioReady: tt.booted,
    highlight: finished ? null : step.expect,
    syncLeds: true,
  });

  return (
    <HardwareLabShell onRestart={reset}>
      <div className="hw-score-strip">
        <span>
          {done.length}/{STEPS.length}
        </span>
        <span>
          {misses} miss{misses === 1 ? "" : "es"}
        </span>
        <span>{playing1 ? "playing" : "stopped"}</span>
        {score != null && <span>Score {score}</span>}
      </div>

      {tt.booted && (
        <div className="wave-stack">
          <WaveformStrip
            label="Deck 1"
            peaks={tt.peaks1}
            playhead={tt.playhead1}
            duration={tt.duration1}
            playing={playing1}
          />
        </div>
      )}

      <MixUltraDeck
        highlight={finished ? null : step.expect}
        values={live.values}
        pressed={live.pressed}
        playing1={playing1}
        playing2={playing2}
        prompt={finished ? "Drill complete" : step.prompt}
        status={status}
      />

      {finished && (
        <HardwareGrade pass={(score ?? 0) >= 70}>
          <p>
            {(score ?? 0) >= 70 ? (
              <>
                <strong>Pass.</strong> Head to Free play to drive both decks.
              </>
            ) : (
              <>
                <strong>Try again.</strong> Hit Restart.
              </>
            )}
          </p>
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
