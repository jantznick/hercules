import { useRef, useState } from "react";
import { formatTidalRefLabel, type TidalTrackRef } from "../audio/tracks";
import { useTurntableSession } from "../audio/useTurntableSession";
import { usePublishDeckState } from "../deck/hooks";
import { isNonHotCuePad } from "../midi/mixUltraMap";
import { useLiveController } from "../midi/useLiveController";
import { useMidiMessages } from "../midi/useMidiBus";
import { FreePlayTidalReference } from "./FreePlayTidalReference";
import { HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";
import { TrackPickerBar } from "./TrackPickerBar";
import { WaveformStrip } from "./WaveformStrip";

function deckWaveLabel(deck: 1 | 2, tidal: TidalTrackRef | null): string {
  if (!tidal) return `Deck ${deck}`;
  const bpm = tidal.bpm != null ? ` · ${Math.round(tidal.bpm)} BPM` : "";
  const artist = tidal.artists[0] ?? "Unknown";
  return `D${deck} · ${artist} — ${tidal.title}${bpm}`;
}

export function HardwareFreePlay() {
  const padRef = useRef<(ev: { deck: 1 | 2; pad: number; clear: boolean }) => void>(() => {});
  const jogRef = useRef<(deck: 1 | 2, delta: number) => void>(() => {});
  const [padModeHint, setPadModeHint] = useState<string | null>(null);
  const [tidal1, setTidal1] = useState<TidalTrackRef | null>(null);
  const [tidal2, setTidal2] = useState<TidalTrackRef | null>(null);

  const live = useLiveController(
    true,
    (ev) => padRef.current(ev),
    (deck, delta) => jogRef.current(deck, delta),
  );

  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: true,
    transportFromMidi: true,
  });
  padRef.current = (ev) => {
    setPadModeHint(null);
    void tt.onPad(ev);
  };
  jogRef.current = (deck, delta) => {
    tt.onJog(deck, delta);
  };

  useMidiMessages((msg) => {
    if (msg.kind !== "noteon") return;
    if (isNonHotCuePad(msg)) {
      setPadModeHint("Press HOT CUE mode first — LOOP/FX pads aren’t treated as cues.");
    }
  }, true);

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
    try {
      await live.connect();
    } catch {
      /* MIDI optional */
    }
    await tt.boot();
  };

  return (
    <HardwareLabShell
      onRestart={() => {
        tt.stopDeck(1);
        tt.stopDeck(2);
        setPadModeHint(null);
      }}
      extraToolbar={
        <button
          type="button"
          className={tt.booted ? "active" : ""}
          onClick={() => void arm()}
        >
          {tt.booted ? (live.ready ? "Ready" : "Audio ready") : "Arm audio"}
        </button>
      }
    >
      {tt.error && <p className="midi-banner warn">{tt.error}</p>}
      {padModeHint && <p className="midi-banner warn">{padModeHint}</p>}

      <TrackPickerBar
        tracks={tt.tracks}
        track1={tt.track1}
        track2={tt.track2}
        onSelect={(deck, id) => void tt.setTrack(deck, id)}
        tidal1={tidal1}
        tidal2={tidal2}
        onTidalSelect={(deck, ref) => {
          if (deck === 1) setTidal1(ref);
          else setTidal2(ref);
        }}
        freePlayMode
        hint="Click the deck or use Mix Ultra · Play toggles · HOT CUE pads = cues · SHIFT+pad clears · jog nudges"
      />

      {(tidal1 || tidal2) && (
        <div className="free-tidal-deck-labels">
          {tidal1 ? (
            <p>
              <span className="free-tidal-deck-tag">D1</span> {formatTidalRefLabel(tidal1)}
            </p>
          ) : null}
          {tidal2 ? (
            <p>
              <span className="free-tidal-deck-tag">D2</span> {formatTidalRefLabel(tidal2)}
            </p>
          ) : null}
        </div>
      )}

      <FreePlayTidalReference deck1={tidal1} deck2={tidal2} />

      {tt.booted && (
        <div className="wave-stack">
          <WaveformStrip
            label={deckWaveLabel(1, tidal1)}
            peaks={tt.peaks1}
            playhead={tt.playhead1}
            duration={tt.duration1}
            cues={tt.cues1}
            playing={tt.playing1}
          />
          <WaveformStrip
            label={deckWaveLabel(2, tidal2)}
            peaks={tt.peaks2}
            playhead={tt.playhead2}
            duration={tt.duration2}
            cues={tt.cues2}
            playing={tt.playing2}
          />
        </div>
      )}

      <MixUltraDeck
        interactive
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
