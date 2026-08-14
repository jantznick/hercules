import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function PhrasingPage() {
  const { guide } = useGenre();

  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="Phrases & the One"
        description="The counting that makes mixes feel musical. Matching speed lines up kicks; starting on beat 1 lines up the song structure."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>BPM & tempo</h2>
          <p>{guide.bpm}</p>
          <p>
            On Mix Ultra: <strong>SYNC</strong> matches tempo (and optionally beats — that’s a{" "}
            <Link to="/settings">djay setting</Link>). The tempo fader fine-tunes. Center click =
            original speed.
          </p>
        </section>

        <section className="info-block">
          <h2>Bars and “the One”</h2>
          <p>
            Most dance music is <strong>4/4</strong>: count 1–2–3–4. Those four beats are a{" "}
            <strong>bar</strong>. Beat 1 of a bar is where you’d usually start the incoming track so
            both songs’ structures line up. DJs sometimes call that beat <strong>the One</strong> —
            these pages mostly just say beat 1.
          </p>
          <p>{guide.phraseLen}</p>
          <p>
            Mixes that ignore this feel off even when the kicks match — the new song’s chorus (or
            drop) arrives while the old one is still in a verse (or intro).
          </p>
        </section>

        <section className="info-block">
          <h2>How to count</h2>
          <p>{guide.countTip}</p>
          <p>
            Drill: <Link to="/tutorials/count-phrases">Count phrases</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What you do with this</h2>
          <p>
            See it on the file: <Link to="/djing/waveform">Read the waveform</Link>. What the
            sections are called: <Link to="/djing/songs">How songs are built</Link>. Hot cues exist
            so you can hit beat 1 without scrubbing. Which spots to mark:{" "}
            <Link to="/djing/cueing">Which cues to set</Link>. Which sections to overlap:{" "}
            <Link to="/djing/mixing">Mix in / mix out</Link>. For this music:{" "}
            <Link to="/djing/style">How this music works</Link>. Then pick a file and do the hands:{" "}
            <Link to="/djing/choose">Pick the next song</Link> ·{" "}
            <Link to="/djing/blend">The two-deck blend</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
