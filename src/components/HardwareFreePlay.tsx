import { useRef } from "react";
import { useTurntableSession } from "../audio/useTurntableSession";
import { usePublishDeckState } from "../deck/hooks";
import { useLiveController } from "../midi/useLiveController";
import { HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";
import { TrackPickerBar } from "./TrackPickerBar";
import { WaveformStrip } from "./WaveformStrip";

export function HardwareFreePlay() {
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
  padRef.current = (ev) => {
    void tt.onPad(ev);
  };
  jogRef.current = (deck, delta) => {
    tt.onJog(deck, delta);
  };

  usePublishDeckState({
    playing1: tt.playing1,
    playing2: tt.playing2,
    track1: tt.track1,
    track2: tt.track2,
    cues1: tt.cues1,
    cues2: tt.cues2,
    values: live.values,
    pressed: live.pressed,
    pads1: live.pads1,
    pads2: live.pads2,
    midiReady: live.ready,
    audioReady: tt.booted,
    syncLeds: true,
  });

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

      <TrackPickerBar
        tracks={tt.tracks}
        track1={tt.track1}
        track2={tt.track2}
        onSelect={(deck, id) => void tt.setTrack(deck, id)}
        onImport={(deck, file) => void tt.importFile(deck, file)}
        hint="Play toggles · pads = hot cues · jog nudges · LEDs follow play/cues"
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
