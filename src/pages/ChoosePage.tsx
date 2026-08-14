import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { CHOOSE } from "../djing/choose";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function ChoosePage() {
  const { guide, genre } = useGenre();
  const pick = CHOOSE[genre];

  return (
    <>
      <PageHeader
        eyebrow="DJing · Next"
        title="Pick the next song"
        description="Two decks means one next file. Speed, vocals, how busy the songs are, and which version you loaded matter more than “I like both.” The style menu rewrites what “good next” usually means."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>Songs that can sit next to each other</h2>
        <p>{pick.neighborhood}</p>
      </div>

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Four checks before you load</h2>
          <p>
            You already know the pieces inside a file (
            <Link to="/djing/songs">How songs are built</Link>). This is whether{" "}
            <em>that</em> file can sit next to the one in the room.
          </p>
          <div className="eq-bands two-up">
            {pick.checks.map((row) => (
              <div className="eq-band" key={row.name}>
                <span className="eq-band-name">{row.name}</span>
                <p>{row.ask}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="info-block">
          <h2>Energy</h2>
          <p>{pick.energy}</p>
        </section>

        <section className="info-block">
          <h2>Who’s singing</h2>
          <p>{pick.vocal}</p>
        </section>

        <section className="info-block">
          <h2>Speed</h2>
          <p>{pick.bpm}</p>
          <p>
            Counting and BPM: <Link to="/djing/phrasing">Phrases & beat 1</Link>. SYNC matches the
            number; it does not make a jump feel small.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What usually works next</h2>
          <p>
            {genre === "any"
              ? "Pick a style above for a tighter list. These are the defaults."
              : `Typical “yes” in ${guide.name}:`}
          </p>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Load this</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                {pick.goodNext.map((row) => (
                  <tr key={row.pick}>
                    <td>{row.pick}</td>
                    <td>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="info-block">
          <h2>What to skip (or only do on purpose)</h2>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>If you load this</th>
                  <th>What happens</th>
                </tr>
              </thead>
              <tbody>
                {pick.skipNext.map((row) => (
                  <tr key={row.pick}>
                    <td>{row.pick}</td>
                    <td>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="info-block">
          <h2>Which version of the title</h2>
          <p>{pick.versions}</p>
          <p>
            After it loads, look: <Link to="/djing/waveform">Read the waveform</Link>. Then mark:{" "}
            <Link to="/djing/cueing">Which cues to set</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Getting the next song ready on Mix Ultra</h2>
          <p>{pick.crate}</p>
        </section>

        <section className="info-block">
          <h2>Shape of the night</h2>
          <p>{pick.nightShape}</p>
          <p>
            Once the file is on the deck, the hands: <Link to="/djing/blend">The two-deck blend</Link>
            . Which sections to overlap: <Link to="/djing/mixing">Mix in / mix out</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
