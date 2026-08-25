import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTurntableSession } from "../audio/useTurntableSession";
import { usePublishDeckState } from "../deck/hooks";
import {
  identifyHotCuePad,
  isNonHotCuePad,
} from "../midi/mixUltraMap";
import { useLiveController } from "../midi/useLiveController";
import { useMidiMessages } from "../midi/useMidiBus";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { HowToUse, WhatItDoes } from "./HowToUse";
import { MixUltraDeck } from "./MixUltraDeck";
import { WaveformStrip } from "./WaveformStrip";

type StepId = "mode" | "set" | "jump";

const STEPS: { id: StepId; prompt: string }[] = [
  { id: "mode", prompt: "Press HOT CUE mode on Deck 2 (button stays solid)" },
  { id: "set", prompt: "Scrub to the mix-in phrase, then tap pad 1 to set incoming cue" },
  { id: "jump", prompt: "Tap pad 1 again — jump + play (how you’ll restart in headphones)" },
];

/** Learn: why Deck 2 gets a hot cue before the blend lab. */
export function IncomingCueLearn() {
  return (
    <div className="lab">
      <WhatItDoes>
        <p>
          Before a two-deck blend, mark the <strong>incoming song’s entry</strong> on Deck 2 —
          usually hot cue pad 1 on the first useful kick or DJ intro. You’ll restart from that pad
          in headphones while Deck 1 plays in the room.
        </p>
      </WhatItDoes>

      <HowToUse>
        <ol>
          <li>
            Know hot cues on Deck 1 first?{" "}
            <Link to="/labs/hot-cue">Hot cues lab</Link> covers empty pad = set, lit pad = jump.
          </li>
          <li>
            Switch to <strong>On hardware</strong>: quit djay, connect MIDI, arm audio, then plant
            pad 1 on Deck 2. This is prep — not graded EQ or crossfader yet.
          </li>
          <li>
            When pad 1 jumps reliably, move to the graded{" "}
            <Link to="/labs/blend?mode=hardware">Two-deck blend</Link> lab (LOW + crossfader).
          </li>
        </ol>
      </HowToUse>

      <p className="footer-note">
        In djay later: same pad 1 on the incoming track before you match speed or fade in.
      </p>
    </div>
  );
}

/** On hardware: Deck 2 hot cue pad 1 for incoming mix-in — prep before blend lab. */
export function HardwareIncomingCueLab() {
  const live = useLiveController(true);
  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: live.ready,
    transportFromMidi: true,
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<StepId[]>([]);
  const [misses, setMisses] = useState(0);
  const [status, setStatus] = useState(
    "Press HOT CUE on Deck 2 first — you’re marking the incoming song’s entry.",
  );
  const [finished, setFinished] = useState(false);
  const [hotCueMode, setHotCueMode] = useState(false);
  const stepIndexRef = useRef(0);
  const finishedRef = useRef(false);
  const hotCueModeRef = useRef(false);
  const cues2Ref = useRef(tt.cues2);

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
    cues2Ref.current = tt.cues2;
  }, [tt.cues2]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setDone([]);
    setMisses(0);
    setFinished(false);
    setHotCueMode(false);
    hotCueModeRef.current = false;
    setStatus("Press HOT CUE on Deck 2 first — you’re marking the incoming song’s entry.");
    tt.stopDeck(2);
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
        setStatus("Press HOT CUE mode on Deck 2 first — that was another pad mode.");
        setHotCueMode(false);
        hotCueModeRef.current = false;
        setMisses((m) => m + 1);
        return;
      }

      const hot = identifyHotCuePad(msg);
      if (!hot || hot.deck !== 2) return;

      const i = stepIndexRef.current;
      const step = STEPS[i];
      if (!step) return;

      if (step.id === "mode") {
        setHotCueMode(true);
        hotCueModeRef.current = true;
        advance("mode", "Good — Deck 2 HOT CUE pads are live. Find the mix-in, tap pad 1.");
        return;
      }

      if (!hotCueModeRef.current) {
        setStatus("Press HOT CUE mode on Deck 2 first.");
        return;
      }

      if (step.id === "set") {
        if (hot.pad !== 0 || hot.clear) {
          setMisses((m) => m + 1);
          setStatus(hot.clear ? "Don’t clear yet — tap pad 1 alone to set." : "Use pad 1 (first pad).");
          return;
        }
        void tt.onPad({ deck: 2, pad: 0, clear: false });
        advance("set", "Incoming cue set. Tap pad 1 again to jump — like restarting in headphones.");
        return;
      }

      if (step.id === "jump") {
        if (hot.pad !== 0 || hot.clear) {
          setMisses((m) => m + 1);
          setStatus("Tap pad 1 (no SHIFT) to jump.");
          return;
        }
        if (cues2Ref.current[0] == null) {
          setStatus("No cue on pad 1 — Restart and set it again.");
          return;
        }
        void tt.onPad({ deck: 2, pad: 0, clear: false });
        advance("jump", "That’s your incoming restart. Next: EQ + crossfader in the blend lab.");
      }
    },
    live.ready && !finished,
  );

  const step = STEPS[stepIndex]!;
  const score = finished
    ? Math.max(0, Math.round((done.length / STEPS.length) * 100 - misses * 10))
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
    highlight: finished ? null : step.id === "mode" ? null : "deck2.play",
    syncLeds: true,
  });

  return (
    <HardwareLabShell
      onRestart={reset}
      extraToolbar={
        <button
          type="button"
          className={tt.playing2 ? "active" : ""}
          onClick={() => void (tt.playing2 ? tt.stopDeck(2) : tt.playDeck(2))}
        >
          {tt.playing2 ? "Stop demo" : "Start demo D2"}
        </button>
      }
    >
      {!hotCueMode && (
        <p className="midi-banner warn">
          Press <strong>HOT CUE</strong> on Deck 2 first. Pads in LOOP / FX / NEURAL won’t set cues
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
        <span>{hotCueMode ? "HOT CUE on D2" : "mode?"}</span>
        {score != null && <span>Score {score}</span>}
      </div>

      {tt.booted && (
        <div className="wave-stack">
          <WaveformStrip
            label="Deck 2 (incoming)"
            peaks={tt.peaks2}
            playhead={tt.playhead2}
            duration={tt.duration2}
            cues={tt.cues2}
            playing={tt.playing2}
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
        padMode2={hotCueMode ? "HOT CUE" : "—"}
        prompt={finished ? "Incoming cue ready" : step.prompt}
        status={status}
      />

      {finished && (
        <HardwareGrade pass={(score ?? 0) >= 70}>
          <p>
            {(score ?? 0) >= 70 ? (
              <>
                <strong>Pass.</strong> Pad 1 on Deck 2 = your mix-in restart. Next:{" "}
                <Link to="/labs/blend?mode=hardware">Two-deck blend</Link> (LOW + crossfader).
              </>
            ) : (
              <>
                <strong>Try again.</strong> Hit Restart — stay in HOT CUE on Deck 2 the whole time.
              </>
            )}
          </p>
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}
