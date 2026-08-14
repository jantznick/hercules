import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { LevelBand } from "../components/SectionCards";
import { HotCueExplain } from "../components/HotCueExplain";
import { PageHeader } from "./HomePage";

export function CueingPage() {
  const { guide, genre } = useGenre();

  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="Which cues to set"
        description="A reusable map of four hot cues: where you start the song in a mix, the loud part, the vocal or quiet middle, and where you leave. Then how to find those spots. Quantize and looping are their own pages — they come after this."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="intro-grid">
        <div className="callout accent">
          <h2>Three different “cues”</h2>
          <ul>
            <li>
              <strong>Pre-cue</strong> — hear a deck in headphones before the room does. That’s{" "}
              <Link to="/pre-cue">Gear → Headphones</Link>.
            </li>
            <li>
              <strong>CUE button</strong> — next to Play. One home marker. While playing, it usually
              stops and returns.
            </li>
            <li>
              <strong>Hot cue pads</strong> — the eight rubber pads in HOT CUE mode. Jump and keep
              playing. “Hot cue 1” on these pages means the first of those pads.
            </li>
          </ul>
        </div>
        <div className="callout warn">
          <h2>No auto “vocal in” button</h2>
          <p>
            Mix Ultra does not detect verses, drops, or vocals for you. djay does not auto-plant
            mix-in / mix-out / vocal-start cues. You mark them. Waveform + Neural Mix are how you
            find them faster.
          </p>
        </div>
      </div>

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Why cue at all?</h2>
          <p>
            Live, you are busy. A cue is a decision you already made: “when I hit this, the song
            starts in a useful place.” Without that, you either start from silence at 0:00 or you
            scramble on the jog while the other track is running out.
          </p>
          <ul>
            <li>
              <strong>Skip silence / skip talking at the start</strong> — the mix-in is the first
              real beat 1, not 0:00.
            </li>
            <li>
              <strong>Mix-in</strong> — where the room is allowed to start hearing this track.
            </li>
            <li>
              <strong>First vocal / hook</strong> — so you don’t layer two singers, and so you can
              cut or echo the last word of a line people know.
            </li>
            <li>
              <strong>Drop / chorus</strong> — the loud fun part. Jump here on purpose.
            </li>
            <li>
              <strong>Mix-out</strong> — where you plan to leave, while the track still has a kick.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>A simple hot-cue map (same way every time)</h2>
          <p>{guide.padIntro}</p>
          <HotCueExplain compact />
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Hot cue pad</th>
                  <th>Usually mark this</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                {guide.pads.map((row) => (
                  <tr key={row.pad}>
                    <td>Hot cue {row.pad}</td>
                    <td>{row.usually}</td>
                    <td>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            The <strong>CUE</strong> button can sit on the same place as hot cue 1 if you want a
            “stop and return home” version of that spot. Hot cues are the ones you hit when you
            mean “start playing from here.”
            {genre === "any"
              ? " Pick a style above to swap this map for house, hip-hop, pop, or drum & bass."
              : ""}
          </p>
          <p>
            Hardware walkthrough: <Link to="/tutorials/hot-cues">Hot cues: jump map</Link>. How
            phrases and beat 1 work: <Link to="/djing/phrasing">Phrases & beat 1</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>How to find the spots</h2>
          <p>
            Names for the blocks: <Link to="/djing/songs">How songs are built</Link>. Overview
            waveform is energy; zoom in for beat 1; Neural Mix finds vocals. Full page:{" "}
            <Link to="/djing/waveform">Read the waveform</Link>.
          </p>
          <ul>
            <li>
              <strong>Mix-in:</strong> {guide.waveformMixIn}
            </li>
            <li>
              <strong>Mix-out:</strong> {guide.waveformMixOut}
            </li>
            <li>
              <strong>Vocals:</strong> {guide.waveformVocals}
            </li>
          </ul>
          <p>
            Drill: <Link to="/tutorials/read-waveform">Read the waveform</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>How DJs cue the incoming track</h2>
          <ol>
            <li>Outgoing track is in the room. Incoming fader down.</li>
            <li>
              Headphones on the incoming deck only (<Link to="/pre-cue">pre-cue</Link>).
            </li>
            <li>Hit hot cue 1 (or CUE then Play) so it starts on beat 1 of the mix-in.</li>
            <li>SYNC or nudge until kicks sit together. Check a phrase — they should stay together.</li>
            <li>
              {genre === "hiphop" || genre === "pop"
                ? "If you’re cutting or echoing the last word, you may barely touch EQ. If you’re overlapping a few bars, turn LOW left on the incoming deck (less bass) so two basslines don’t pile up."
                : "If you are overlapping the two songs, turn LOW left on the incoming deck (less bass) so two basslines don’t pile up. You can skip that if you are cutting."}
            </li>
            <li>
              Wait until the outgoing track reaches the place you marked as mix-out. Start the
              incoming song on that beat 1, then raise its fader — or cut / echo the last word if
              that’s how this style leaves.
            </li>
          </ol>
          <p>
            <strong>Play starts the song</strong>; faders decide whether the room hears it; CUE
            while playing <em>stops and returns</em>; a hot cue <em>jumps and keeps playing</em>. Use
            hot cues when you mean “go.”
          </p>
          <p>
            Which sections to overlap: <Link to="/djing/mixing">Mix in / mix out</Link>. Bass / EQ:{" "}
            <Link to="/djing/eq">EQ, bass & filter</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>{genre === "any" ? "This map changes with the music" : `Notes for ${guide.name}`}</h2>
          {genre === "any" ? (
            <p>
              House/techno: long drum intros, last full beat. Hip-hop: verses and hooks, cuts beat
              long fades. Pop/kids/Disney: choruses, short mixes, echo the last line. Drum & bass:
              same four pads as house, less clock time. Pick a style above, or read{" "}
              <Link to="/djing/style">How this music works</Link>.
            </p>
          ) : (
            <ul>
              {guide.howYouCue.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block" id="quantize">
          <h2>Snapping to the beat</h2>
          <p>
            Mix Ultra has no Q button. In djay, leave Quantize off and <strong>hold</strong> CUE or
            a pad to snap, <strong>tap</strong> to plant exactly. Full switch, snap size, and MIDI
            mapping: <Link to="/djing/quantize">Quantize</Link>.
          </p>
        </section>

        <section className="info-block" id="loop-from-cue">
          <h2>Looping from a cue (not late)</h2>
          <p>
            LOOP pads start from the playhead, not from the hot cue you just hit. Pause on the cue,
            then arm the loop — or save a cue-loop in settings. That’s{" "}
            <Link to="/djing/looping#loop-from-cue">Looping</Link>, not part of planting the four
            pads.
          </p>
        </section>

        <section className="info-block">
          <h2>Same pads, remix job</h2>
          <p>
            Pads 1–4 can stay your mix map (hot cue 1 mix-in, 2 loud part, and so on). Extra pads
            (5+) are for performing one song: replay the drop, jump a short vocal line. That’s{" "}
            <Link to="/djing/remix">Remix one song</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>What Mix Ultra + djay actually automate</h2>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>What it does</th>
                  <th>What it is not</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Beatgrid + BPM</td>
                  <td>Guesses tempo so SYNC and the Play LED have a grid</td>
                  <td>Not a map of verses/drops. Grids can be wrong on odd intros</td>
                </tr>
                <tr>
                  <td>Quantize</td>
                  <td>
                    Optional snap when setting or triggering.{" "}
                    <Link to="/djing/quantize">Quantize page</Link>
                  </td>
                  <td>Not “find the vocal.” Wrong grid = snapped to the wrong place</td>
                </tr>
                <tr>
                  <td>Main CUE / hot cues</td>
                  <td>You set them; djay can remember them in your library</td>
                  <td>Not auto-written on first analyze</td>
                </tr>
                <tr>
                  <td>Neural Mix</td>
                  <td>Separates vocals / instruments / drums so you can hear or see parts</td>
                  <td>Not auto-cues. Isolation can smear — confirm by ear</td>
                </tr>
                <tr>
                  <td>Automix</td>
                  <td>djay picking mix points when it is mixing for you</td>
                  <td>Not a live “smart cue” on the controller</td>
                </tr>
                <tr>
                  <td>CUE + Play / SHIFT + CUE</td>
                  <td>CUE+Play jumps home and plays. SHIFT+CUE plays from file start</td>
                  <td>SHIFT+CUE is not “my mix-in.” Plant a real cue</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Rekordbox phrase labels and Mixed In Key auto-cues are other ecosystems. On this deck:
            load once, listen once, plant four pads.
          </p>
        </section>
      </div>

      <p className="footer-note">
        Next: <Link to="/djing/waveform">Read the waveform</Link> ·{" "}
        <Link to="/djing/mixing">Mix in / mix out</Link> ·{" "}
        <Link to="/djing/blend">The two-deck blend</Link>. Hands-on:{" "}
        <Link to="/tutorials/hot-cues">Hot cues</Link> ·{" "}
        <Link to="/tutorials/quantize-snap">Quantize: tap vs hold</Link> ·{" "}
        <Link to="/labs/hot-cue">Hot cue lab</Link>.
      </p>
    </>
  );
}
