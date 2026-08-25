import { useRef } from "react";
import { useTurntableSession } from "../audio/useTurntableSession";
import { useLiveController } from "../midi/useLiveController";
import { HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";

export function HardwareFreePlay() {
  const ttRef = useRef<ReturnType<typeof useTurntableSession> | null>(null);

  // Session first so pad/jog callbacks exist — but we need live to call tt.
  // Use refs for callbacks to avoid circular init.
  const padRef = useRef<(ev: { deck: 1 | 2; pad: number; clear: boolean }) => void>(() => {});
  const jogRef = useRef<(deck: 1 | 2, delta: number) => void>(() => {});

  const live = useLiveController(
    true,
    (ev) => padRef.current(ev),
    (deck, delta) => jogRef.current(deck, delta),
  );

  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: live.ready,
    transportFromMidi: true,
  });
  ttRef.current = tt;
  padRef.current = (ev) => {
    void tt.onPad(ev);
  };
  jogRef.current = (deck, delta) => {
    tt.onJog(deck, delta);
  };

  const arm = async () => {
    await live.connect();
    await tt.boot();
  };

  return (
    <HardwareLabShell
      onRestart={() => {
        tt.stopDeck(1);
        tt.stopDeck(2);
      }}
      extraToolbar={
        <button
          type="button"
          className={live.ready && tt.booted ? "active" : ""}
          onClick={() => void arm()}
        >
          {live.ready && tt.booted ? "Ready" : "Connect + arm audio"}
        </button>
      }
    >
      {tt.error && <p className="midi-banner warn">{tt.error}</p>}

      <div className="hw-free-bar">
        <label>
          Deck 1
          <select value={tt.track1} onChange={(e) => void tt.setTrack(1, e.target.value)}>
            {tt.tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} · {t.bpm}
              </option>
            ))}
          </select>
        </label>
        <label>
          Deck 2
          <select value={tt.track2} onChange={(e) => void tt.setTrack(2, e.target.value)}>
            {tt.tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} · {t.bpm}
              </option>
            ))}
          </select>
        </label>
        <span className="hw-free-hint">Play toggles pause · pads = hot cues · jog nudges</span>
      </div>

      <MixUltraDeck
        values={live.values}
        pressed={live.pressed}
        playing1={tt.playing1}
        playing2={tt.playing2}
        pads1={live.pads1}
        pads2={live.pads2}
        cues1={tt.cues1}
        cues2={tt.cues2}
        jogAngle1={live.jogAngle1}
        jogAngle2={live.jogAngle2}
      />
    </HardwareLabShell>
  );
}
