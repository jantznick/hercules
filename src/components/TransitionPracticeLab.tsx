import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatTidalKeyMeta,
  trackById,
  type TidalTrackRef,
} from "../audio/tracks";
import { useTurntableSession } from "../audio/useTurntableSession";
import { placeholderPeaks } from "../audio/waveform";
import { usePublishDeckState, useTransitionMotionRecorder } from "../deck/hooks";
import { GENRE_OPTIONS, type GenreId } from "../djing/genres";
import { GENRE_DECK_PAIRS } from "../mix/genrePresets";
import {
  judgeBasicTransition,
  pushPlayheadSample,
  TRANSITION_RECIPES,
  type PlayheadSample,
  type TransitionJudgment,
  type TransitionRecipeId,
} from "../mix/timingFeedback";
import { markLabPass } from "../tutorials/labPass";
import { useLiveController } from "../midi/useLiveController";
import { HardwareGrade, HardwareLabShell } from "./HardwareLabShell";
import { MixUltraDeck } from "./MixUltraDeck";
import { TrackPickerBar } from "./TrackPickerBar";
import { WaveformStrip } from "./WaveformStrip";

type SessionPhase = "idle" | "recording" | "graded";

/** Full steps / technique / tutorial for each graded recipe. */
const RECIPE_LINKS: Partial<
  Record<
    TransitionRecipeId,
    {
      fullSteps?: { to: string; label: string };
      technique?: { to: string; label: string };
      tutorial?: { to: string; label: string };
      drill?: { to: string; label: string };
    }
  >
> = {
  free: {
    fullSteps: { to: "/djing/transitions", label: "Same-speed mixes" },
    technique: { to: "/djing/techniques#same-speed", label: "Techniques" },
  },
  "long-blend": {
    fullSteps: { to: "/djing/transitions#long-blend", label: "Full steps" },
    technique: { to: "/djing/techniques#long-blend", label: "Technique" },
    tutorial: { to: "/tutorials/mix-long-blend", label: "Tutorial" },
    drill: { to: "/tutorials/mix-long-blend?mode=drill", label: "Drill" },
  },
  "bass-swap": {
    fullSteps: { to: "/djing/transitions#bass-swap", label: "Full steps" },
    technique: { to: "/djing/techniques#bass-swap", label: "Technique" },
    tutorial: { to: "/tutorials/mix-bass-swap", label: "Tutorial" },
    drill: { to: "/tutorials/mix-bass-swap?mode=drill", label: "Drill" },
  },
  "filter-open": {
    fullSteps: { to: "/djing/eq", label: "EQ & Filter" },
    technique: { to: "/djing/techniques#filter-open-in", label: "Technique" },
    tutorial: { to: "/tutorials/adv-filter-open", label: "Tutorial" },
    drill: { to: "/tutorials/filter-sweep?mode=drill", label: "Filter drill" },
  },
  "xfader-cut": {
    fullSteps: { to: "/djing/transitions#crossfader-cut", label: "Full steps" },
    technique: { to: "/djing/techniques#xfader-cut", label: "Technique" },
    tutorial: { to: "/tutorials/mix-xfader-cut", label: "Tutorial" },
    drill: { to: "/tutorials/mix-xfader-cut?mode=drill", label: "Drill" },
  },
};

function RecipeLearnLinks({ recipe }: { recipe: TransitionRecipeId }) {
  const links = RECIPE_LINKS[recipe];
  if (!links) return null;
  return (
    <p className="technique-links">
      <span className="technique-links-label">Learn</span>
      {links.fullSteps && <Link to={links.fullSteps.to}>{links.fullSteps.label}</Link>}
      {links.technique && <Link to={links.technique.to}>{links.technique.label}</Link>}
      {links.tutorial && <Link to={links.tutorial.to}>{links.tutorial.label}</Link>}
      {links.drill && <Link to={links.drill.to}>{links.drill.label}</Link>}
    </p>
  );
}

function tipClass(verdict: string): string {
  if (verdict === "ok" || verdict === "aligned") return "ok";
  if (verdict === "incomplete" || verdict === "n/a") return "incomplete";
  if (verdict === "warn" || verdict === "offset" || verdict === "too-slow") return "too-slow";
  return "too-fast";
}

function deckWaveLabel(deck: 1 | 2, tidal: TidalTrackRef | null, bedTitle: string): string {
  if (!tidal) return `Deck ${deck} · ${bedTitle}`;
  const bpm = tidal.bpm != null ? ` · ${Math.round(tidal.bpm)} BPM` : "";
  const key = formatTidalKeyMeta(tidal);
  const keyPart = key ? ` · ${key}` : "";
  const artist = tidal.artists[0] ?? "Unknown";
  return `D${deck} · ${artist} — ${tidal.title}${bpm}${keyPart}`;
}

function deckTrackLabel(tidal: TidalTrackRef | null, bedTitle: string): string | null {
  if (tidal) {
    const artist = tidal.artists[0] ?? "Unknown";
    return `${artist} — ${tidal.title}`;
  }
  return bedTitle;
}

/**
 * Practice turntable: full Mix Ultra mirror, pick style/songs, Start → mix → End → grade.
 */
export function TransitionTurntable({
  initialTarget = "free",
}: {
  initialTarget?: TransitionRecipeId;
}) {
  const live = useLiveController(true);
  const tt = useTurntableSession({
    values: live.values,
    midiEnabled: true,
    transportFromMidi: true,
    muteBed1: false,
    muteBed2: false,
  });

  const [genre, setGenre] = useState<GenreId>("any");
  const [target, setTarget] = useState<TransitionRecipeId>(initialTarget);
  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [grade, setGrade] = useState<TransitionJudgment | null>(null);
  const [alignSamples, setAlignSamples] = useState<PlayheadSample[]>([]);
  const [tidal1, setTidal1] = useState<TidalTrackRef | null>(null);
  const [tidal2, setTidal2] = useState<TidalTrackRef | null>(null);

  const recording = phase === "recording";
  const locked = phase !== "idle";

  const pitch1 = live.values["deck1.pitch"] ?? 64;
  const pitch2 = live.values["deck2.pitch"] ?? 64;

  const { samples: motion, reset: resetMotion } = useTransitionMotionRecorder(
    {
      crossfader: live.values.crossfader,
      deck1Low: live.values["deck1.low"],
      deck2Low: live.values["deck2.low"],
      deck1Mid: live.values["deck1.mid"],
      deck2Mid: live.values["deck2.mid"],
      deck1High: live.values["deck1.high"],
      deck2High: live.values["deck2.high"],
      deck1Filter: live.values["deck1.filter"],
      deck2Filter: live.values["deck2.filter"],
      deck1Volume: live.values["deck1.volume"],
      deck2Volume: live.values["deck2.volume"],
      deck1Pitch: live.values["deck1.pitch"],
      deck2Pitch: live.values["deck2.pitch"],
    },
    recording,
  );

  useEffect(() => {
    if (!recording || !tt.booted || !tt.playing1 || !tt.playing2) return;
    const bpm1 = trackById(tt.track1).bpm;
    const bpm2 = trackById(tt.track2).bpm;
    setAlignSamples((prev) =>
      pushPlayheadSample(prev, {
        playhead1: tt.playhead1,
        playhead2: tt.playhead2,
        pitch1,
        pitch2,
        bpm1,
        bpm2,
      }),
    );
  }, [
    recording,
    tt.booted,
    tt.playing1,
    tt.playing2,
    tt.playhead1,
    tt.playhead2,
    tt.track1,
    tt.track2,
    pitch1,
    pitch2,
  ]);

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
    playhead1: tt.playhead1,
    playhead2: tt.playhead2,
    midiReady: live.ready,
    audioReady: tt.booted,
    syncLeds: true,
  });

  const applyGenrePreset = useCallback(
    (g: GenreId) => {
      const pair = GENRE_DECK_PAIRS[g];
      void tt.setTrack(1, pair.deck1);
      void tt.setTrack(2, pair.deck2);
    },
    [tt.setTrack],
  );

  useEffect(() => {
    if (!tt.booted || locked) return;
    applyGenrePreset(genre);
  }, [genre, tt.booted, locked, applyGenrePreset]);

  const arm = async () => {
    try {
      await live.connect();
    } catch {
      /* MIDI optional */
    }
    await tt.boot();
  };

  const resetSession = useCallback(() => {
    setPhase("idle");
    setGrade(null);
    setAlignSamples([]);
    resetMotion();
  }, [resetMotion]);

  const startSession = async () => {
    if (!tt.booted) await arm();
    resetMotion();
    setAlignSamples([]);
    setGrade(null);
    setPhase("recording");
    void tt.playDeck(1);
    void tt.playDeck(2);
  };

  const endSession = () => {
    const judgment = judgeBasicTransition(
      target,
      { ...motion, playheads: alignSamples },
      {
        bpm1: trackById(tt.track1).bpm,
        bpm2: trackById(tt.track2).bpm,
      },
    );
    setGrade(judgment);
    setPhase("graded");
    if (judgment.passed) markLabPass("/labs/transition");
  };

  const targetMeta = TRANSITION_RECIPES.find((r) => r.id === target);
  const bed1 = trackById(tt.track1);
  const bed2 = trackById(tt.track2);

  const peaks1 = tidal1 ? placeholderPeaks(tidal1.id) : tt.peaks1;
  const peaks2 = tidal2 ? placeholderPeaks(tidal2.id) : tt.peaks2;

  return (
    <HardwareLabShell
      onRestart={() => {
        tt.stopDeck(1);
        tt.stopDeck(2);
        resetSession();
      }}
      extraToolbar={
        <>
          <button
            type="button"
            className={tt.booted ? "active" : ""}
            disabled={locked}
            onClick={() => void arm()}
          >
            {tt.booted ? "Audio on" : "Arm audio"}
          </button>
          {phase === "idle" && (
            <button type="button" className="active" onClick={() => void startSession()}>
              Start transition
            </button>
          )}
          {phase === "recording" && (
            <button type="button" className="active transition-recording-btn" onClick={endSession}>
              End & grade
            </button>
          )}
          {phase === "graded" && (
            <button type="button" onClick={resetSession}>Try again</button>
          )}
        </>
      }
    >
      {tt.error && <p className="midi-banner warn">{tt.error}</p>}
      {recording && (
        <p className="midi-banner transition-recording-banner">
          Recording — mix with the box (or on-screen deck). Hit <strong>End & grade</strong> when
          Deck 2 owns the room.
        </p>
      )}

      <div className="transition-setup-row">
        <label className="genre-bar-label">
          <span>Style</span>
          <select
            value={genre}
            disabled={locked}
            onChange={(e) => setGenre(e.target.value as GenreId)}
            aria-label="Practice style — loads a default bed pair"
          >
            {GENRE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label} ({opt.tag})
              </option>
            ))}
          </select>
        </label>
        <p className="genre-bar-hint">
          Style picks default demo beds — or choose tracks below.{" "}
          <Link to="/djing/transitions">Same-speed mixes</Link>.
        </p>
      </div>

      <div className="lab-mode-toggle" role="tablist" aria-label="Transition target">
        {TRANSITION_RECIPES.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            className={target === r.id ? "active" : ""}
            aria-selected={target === r.id}
            disabled={locked}
            onClick={() => setTarget(r.id)}
          >
            {r.title}
          </button>
        ))}
      </div>
      <p className="lab-mode-note">{targetMeta?.blurb}</p>
      <RecipeLearnLinks recipe={target} />

      <TrackPickerBar
        tracks={tt.tracks}
        track1={tt.track1}
        track2={tt.track2}
        onSelect={(deck, id) => {
          if (!locked) void tt.setTrack(deck, id);
        }}
        tidal1={tidal1}
        tidal2={tidal2}
        onTidalSelect={(deck, ref) => {
          if (!locked) {
            if (deck === 1) setTidal1(ref);
            else setTidal2(ref);
          }
        }}
        freePlayMode
        hint={
          locked
            ? "Finish this attempt before changing tracks"
            : "Catalog beds drive the grade · Tidal is reference listening (EQ grade uses beds)"
        }
      />

      {tt.booted && (
        <div className="wave-stack">
          <WaveformStrip
            label={deckWaveLabel(1, tidal1, bed1.title)}
            peaks={peaks1}
            playhead={tt.playhead1}
            duration={tt.duration1}
            cues={tt.cues1}
            playing={tt.playing1}
          />
          <WaveformStrip
            label={deckWaveLabel(2, tidal2, bed2.title)}
            peaks={peaks2}
            playhead={tt.playhead2}
            duration={tt.duration2}
            cues={tt.cues2}
            playing={tt.playing2}
          />
        </div>
      )}

      <div className="hw-score-strip">
        <span>{phase === "recording" ? "Recording…" : phase === "graded" ? "Graded" : "Ready"}</span>
        <span>xf {live.values.crossfader ?? "—"}</span>
        <span>D2 low {live.values["deck2.low"] ?? "—"}</span>
        {grade && <span>score {grade.score}</span>}
      </div>

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
        trackLabel1={deckTrackLabel(tidal1, bed1.title)}
        trackLabel2={deckTrackLabel(tidal2, bed2.title)}
        prompt={
          phase === "recording"
            ? `Mixing: ${targetMeta?.title ?? "transition"} — EQ · Filter · XF · tempo`
            : phase === "graded"
              ? "Read the grade below — Try again for another pass"
              : `Pick a move, load decks, hit Start — then ${targetMeta?.title ?? "mix"}`
        }
        status={
          phase === "recording"
            ? "Leave SYNC off · grade reads your CC motion"
            : "Full Mix Ultra mirror — match djay hands on the box"
        }
      />

      {grade && (
        <HardwareGrade pass={grade.passed}>
          <p>
            <strong>{grade.passed ? "Pass" : "Retry"}.</strong> {grade.summary}
          </p>
          {grade.dimensions.map((d) => (
            <p key={d.id} className={`mix-timing-tip ${tipClass(d.verdict)}`}>
              {d.label} ({d.score}): {d.tip}
            </p>
          ))}
          <p className="footer-note">
            Score is MIDI motion + tempo scaffold on demo beds — not spectral audio analysis. Real
            songs: use the tutorial links above in djay.
          </p>
        </HardwareGrade>
      )}
    </HardwareLabShell>
  );
}

/** Tutorial drill embed — same turntable. */
export function TransitionHardware({
  initialRecipe = "free",
}: {
  initialRecipe?: TransitionRecipeId;
}) {
  return <TransitionTurntable initialTarget={initialRecipe} />;
}

/** Brief intro (optional Learn tab). */
export function TransitionLearn() {
  return (
    <div className="lab">
      <p>
        The <strong>Transition grade</strong> lab is a full Mix Ultra turntable on laptop audio —
        like free play, but you pick a move (or Free), hit <strong>Start transition</strong>, mix,
        then <strong>End & grade</strong>.
      </p>
      <p>
        Open <Link to="/labs/transition?mode=hardware">On hardware</Link> for the deck. Overview:{" "}
        <Link to="/djing/transitions">Same-speed mixes</Link> ·{" "}
        <Link to="/djing/techniques">Techniques</Link>.
      </p>
    </div>
  );
}
