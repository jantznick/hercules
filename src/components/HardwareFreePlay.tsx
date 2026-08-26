import { useCallback, useRef, useState } from "react";
import { useFreePlayTidalPlayback } from "../audio/useFreePlayTidalPlayback";
import { formatTidalKeyMeta, type TidalTrackRef } from "../audio/tracks";
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
  const key = formatTidalKeyMeta(tidal);
  const keyPart = key ? ` · ${key}` : "";
  const artist = tidal.artists[0] ?? "Unknown";
  return `D${deck} · ${artist} — ${tidal.title}${bpm}${keyPart}`;
}

function deckTrackLabel(tidal: TidalTrackRef | null): string | null {
  if (!tidal) return null;
  const artist = tidal.artists[0] ?? "Unknown";
  return `${artist} — ${tidal.title}`;
}

export function HardwareFreePlay() {
  const padRef = useRef<(ev: { deck: 1 | 2; pad: number; clear: boolean }) => void>(() => {});
  const jogRef = useRef<(deck: 1 | 2, delta: number) => void>(() => {});
  const [padModeHint, setPadModeHint] = useState<string | null>(null);
  const [tidal1, setTidal1] = useState<TidalTrackRef | null>(null);
  const [tidal2, setTidal2] = useState<TidalTrackRef | null>(null);

  const tidalPlayback = useFreePlayTidalPlayback(tidal1, tidal2);

  const live = useLiveController(
    true,
    (ev) => padRef.current(ev),
    (deck, delta) => jogRef.current(deck, delta),
  );

  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: true,
    transportFromMidi: true,
    muteBed1: !!tidal1,
    muteBed2: !!tidal2,
    tidalTransport: {
      hasTidal: tidalPlayback.hasTidal,
      playTidal: (deck) => void tidalPlayback.playDeck(deck),
      stopTidal: (deck) => void tidalPlayback.stopDeck(deck),
      isTidalPlaying: tidalPlayback.isPlaying,
    },
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

  const playing1 = tidal1 ? tidalPlayback.isPlaying(1) : tt.playing1;
  const playing2 = tidal2 ? tidalPlayback.isPlaying(2) : tt.playing2;

  usePublishDeckState({
    playing1,
    playing2,
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

  const onTidalSelect = useCallback(
    (deck: 1 | 2, ref: TidalTrackRef | null) => {
      if (deck === 1) setTidal1(ref);
      else setTidal2(ref);
      if (tidalPlayback.isPlaying(deck)) {
        void tidalPlayback.stopDeck(deck);
      }
      if (!ref) {
        tt.stopDeck(deck);
      }
    },
    [tidalPlayback, tt.stopDeck],
  );

  return (
    <HardwareLabShell
      onRestart={() => {
        void tidalPlayback.pause();
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
        onTidalSelect={onTidalSelect}
        freePlayMode
        hint="Load a track, then PLAY on the deck · HOT CUE pads = cues · SHIFT+pad clears · jog nudges"
      />

      <FreePlayTidalReference audioHostRef={tidalPlayback.audioHostRef} error={tidalPlayback.error} />

      {tt.booted && (
        <div className="wave-stack">
          <WaveformStrip
            label={deckWaveLabel(1, tidal1)}
            peaks={tt.peaks1}
            playhead={tt.playhead1}
            duration={tt.duration1}
            cues={tt.cues1}
            playing={playing1}
          />
          <WaveformStrip
            label={deckWaveLabel(2, tidal2)}
            peaks={tt.peaks2}
            playhead={tt.playhead2}
            duration={tt.duration2}
            cues={tt.cues2}
            playing={playing2}
          />
        </div>
      )}

      <MixUltraDeck
        interactive
        values={live.values}
        pressed={live.pressed}
        playing1={playing1}
        playing2={playing2}
        pads1={live.pads1}
        pads2={live.pads2}
        cues1={tt.cues1}
        cues2={tt.cues2}
        jogAngle1={live.jogAngle1}
        jogAngle2={live.jogAngle2}
        trackLabel1={deckTrackLabel(tidal1)}
        trackLabel2={deckTrackLabel(tidal2)}
      />
    </HardwareLabShell>
  );
}
