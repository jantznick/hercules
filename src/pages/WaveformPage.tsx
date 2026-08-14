import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function WaveShape({ heights }: { heights: number[] }) {
  return (
    <div className="wave-demo" aria-hidden="true">
      {heights.map((h, i) => (
        <span key={i} className="wave-col" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export function WaveformPage() {
  const { guide, genre } = useGenre();

  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="Read the waveform"
        description="djay’s overview is an energy map. Tall is usually loud. Thin is usually quiet. That’s how you find where to start, the chorus/drop, singing, and where to leave — before you hear the whole file."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What you’re looking at</h2>
          <p>
            The little landscape above the deck is not decoration. Fat / tall ≈ loud (often kick +
            bass: drops, choruses, full grooves). Thin / quiet ≈ intro, breakdown, outro, talking.
            Color and stem lanes (if you turn them on) are extra; energy is the first read.
          </p>
          <WaveShape heights={guide.waveformShape} />
          <p className="wave-caption">
            {genre === "any"
              ? "A typical dance file: quiet intro, a tall drop, a dip, another peak, a thin tail."
              : `A ${guide.name} file, roughly: ${guide.waveformOverview}`}
          </p>
        </section>

        <section className="info-block">
          <h2>Overview (energy)</h2>
          <p>{guide.waveformOverview}</p>
          <ul>
            <li>
              <strong>Mix-in:</strong> {guide.waveformMixIn}
            </li>
            <li>
              <strong>Mix-out:</strong> {guide.waveformMixOut}
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Zoomed (beat 1)</h2>
          <p>
            Plant cues on a transient peak — the kick (or first drum hit) that starts the bar — not
            a soft swell leading into it. If the cue feels early, you’re usually in the last beat of
            the previous bar. Nudge later onto beat 1.
          </p>
          <p>
            Hold-to-snap while setting if you want that peak on the grid.{" "}
            <Link to="/djing/quantize">Quantize</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Vocals (Neural Mix)</h2>
          <p>{guide.waveformVocals}</p>
          <ul>
            <li>
              <strong>Pads or knobs:</strong> solo Vocals (or mute drums) and scrub.
            </li>
            <li>
              <strong>Stem waveforms</strong> (Mac / larger iPad): the vocal lane staying flat then
              jumping up is “vocals come in.” Phone layouts may not show all lanes; soloing still
              works.
            </li>
          </ul>
          <p>
            Mix Ultra does not auto-plant vocal cues. Isolation can smear — confirm by ear.{" "}
            <Link to="/controls">The controller</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Count, then look again</h2>
          <p>{guide.countTip}</p>
          <p>
            After the first kick, 8-bar blocks are where vocals, bass, and drops usually arrive.
            Waveform + counting together beat either one alone.{" "}
            <Link to="/djing/phrasing">Phrases & the One</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What you do with the spots</h2>
          <p>
            Names for those blocks: <Link to="/djing/songs">How songs are built</Link>. Mark them:{" "}
            <Link to="/djing/cueing">Which cues to set</Link>. Decide which tall/thin blocks to
            overlap: <Link to="/djing/mixing">Mix in / mix out</Link>. For this music:{" "}
            <Link to="/djing/style">How this music works</Link>.
          </p>
          <p>
            Drill: <Link to="/tutorials/read-waveform">Read the waveform</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
