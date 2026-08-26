import { useCallback, useEffect, useRef, useState } from "react";
import { useTurntableSession } from "../audio/useTurntableSession";
import { usePublishDeckState } from "../deck/hooks";
import {
  identifyHotCuePad,
  isNonHotCuePad,
} from "../midi/mixUltraMap";
import { useLiveController } from "../midi/useLiveController";
import { useMidiMessages } from "../midi/useMidiBus";
import { markLabPass } from "../tutorials/labPass";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";
import { WaveformStrip } from "./WaveformStrip";

type StepId = "mode" | "set" | "jump" | "clear";

const STEPS: { id: StepId; prompt: string }[] = [
  { id: "mode", prompt: "Press HOT CUE mode on Deck 1 (button stays solid)" },
  { id: "set", prompt: "Tap pad 1 to plant a hot cue" },
  { id: "jump", prompt: "Tap pad 1 again to jump + play" },
  { id: "clear", prompt: "SHIFT + pad 1 to erase the cue" },
];

export function HardwareHotCueLab() {
  const live = useLiveController(true);
  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: live.ready,
    transportFromMidi: true,
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<StepId[]>([]);
  const [misses, setMisses] = useState(0);
  const [status, setStatus] = useState("Press HOT CUE mode first — LOOP pads won’t set cues here.");
  const [finished, setFinished] = useState(false);
  const [hotCueMode, setHotCueMode] = useState(false);
  const stepIndexRef = useRef(0);
  const finishedRef = useRef(false);
  const hotCueModeRef = useRef(false);
  const cues1Ref = useRef(tt.cues1);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  useEffect(() => {
    hotCueModeRef.current = hotCueMode;
  }, [hotCueMode]);
  useEffect(() => {
    cues1Ref.current = tt.cues1;
  }, [tt.cues1]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setMisses(0);
    setFinished(false);
    setHotCueMode(false);
    hotCueModeRef.current = false;
    setStatus("Press HOT CUE mode first — LOOP pads won’t set cues here.");
    tt.stopDeck(1);
  }, [tt]);

  const advance = useCallback((id: StepId, nextStatus: string) => {
    setDone((d) => (d.includes(id) ? d : [...d, id]));
    const i = stepIndexRef.current;
    if (i + 1 >= STEPS.length) {
      setFinished(true);
      setStatus(nextStatus);
    } else {
      setStepIndex(i + 1);
      setStatus(nextStatus);
    }
  }, []);

  useMidiMessages(
    (msg) => {
      if (finishedRef.current || msg.kind !== "noteon") return;

      if (isNonHotCuePad(msg)) {
        setStatus("Press HOT CUE mode first — that was another pad mode (e.g. LOOP).");
        setHotCueMode(false);
        hotCueModeRef.current = false;
        setMisses((m) => m + 1);
        return;
      }

      const hot = identifyHotCuePad(msg);
      if (!hot || hot.deck !== 1) return;

      const i = stepIndexRef.current;
      const step = STEPS[i];
      if (!step) return;

      if (step.id === "mode") {
        setHotCueMode(true);
        hotCueModeRef.current = true;
        advance("mode", "Good — HOT CUE pads are live. Tap pad 1 to set.");
        return;
      }

      if (!hotCueModeRef.current) {
        setStatus("Press HOT CUE mode first.");
        return;
      }

      if (step.id === "set") {
        if (hot.pad !== 0 || hot.clear) {
          setMisses((m) => m + 1);
          setStatus(hot.clear ? "Don’t clear yet — tap pad 1 alone to set." : "Use pad 1 (first pad).");
          return;
        }
        void tt.onPad({ deck: 1, pad: 0, clear: false });
        advance("set", "Cue planted. Tap pad 1 again to jump.");
        return;
      }

      if (step.id === "jump") {
        if (hot.pad !== 0 || hot.clear) {
          setMisses((m) => m + 1);
          setStatus("Tap pad 1 (no SHIFT) to jump.");
          return;
        }
        if (cues1Ref.current[0] == null) {
          setStatus("No cue on pad 1 — Restart and set it again.");
          return;
        }
        void tt.onPad({ deck: 1, pad: 0, clear: false });
        advance("jump", "Jumped. Now SHIFT + pad 1 to erase.");
        return;
      }

      if (step.id === "clear") {
        if (hot.pad !== 0 || !hot.clear) {
          setMisses((m) => m + 1);
          setStatus("Hold SHIFT and tap pad 1 to clear.");
          return;
        }
        void tt.onPad({ deck: 1, pad: 0, clear: true });
        advance("clear", "Pad cleared. Hot cues jump and keep playing — unlike CUE.");
      }
    },
    live.ready && !finished,
  );

  const step = STEPS[stepIndex]!;
  const score = finished
    ? Math.max(0, Math.round((done.length / STEPS.length) * 100 - misses * 8))
    : null;

  usePublishDeckState({
    playing1: tt.playing1,
    playing2: tt.playing2,
    cues1: tt.cues1,
    cues2: tt.cues2,
    values: live.values,
    pressed: live.pressed,
    pads1: live.pads1,
    pads2: live.pads2,
    midiReady: live.ready,
    audioReady: tt.booted,
    highlight: finished ? null : step.id === "mode" ? null : "deck1.play",
    syncLeds: true,
  });

  useEffect(() => {
    if (finished && (score ?? 0) >= 70) markLabPass("/labs/hot-cue");
  }, [finished, score]);

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
      {!hotCueMode && (
        <p className="midi-banner warn">
          Press <strong>HOT CUE</strong> on Deck 1 first. Pads in LOOP / FX / NEURAL won’t set cues
          here.
        </p>
      )}

      <div className="hw-score-strip">
        <span>
          {done.length}/{STEPS.length}
        </span>
        <span>
          {misses} miss{misses === 1 ? "" : "es"}
        </span>
        <span>{hotCueMode ? "HOT CUE on" : "mode?"}</span>
        {score != null && <span>Score {score}</span>}
      </div>

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
        </div>
      )}

      <MixUltraDeck
        highlight={null}
        values={live.values}
        pressed={live.pressed}
        playing1={tt.playing1}
        playing2={tt.playing2}
        pads1={live.pads1}
        pads2={live.pads2}
        cues1={tt.cues1}
        cues2={tt.cues2}
        padMode1={hotCueMode ? "HOT CUE" : "—"}
        prompt={finished ? "Hot cue drill complete" : step.prompt}
        status={status}
      />

      {finished && (
        <HardwareGrade pass={(score ?? 0) >= 70}>
          <p>
            {(score ?? 0) >= 70 ? (
              <>
                <strong>Pass.</strong> Empty pad sets · lit pad jumps · SHIFT+pad erases.
              </>
            ) : (
              <>
                <strong>Try again.</strong> Hit Restart — stay in HOT CUE mode the whole time.
              </>
            )}
          </p>
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
