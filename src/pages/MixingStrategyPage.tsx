import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { GUIDES, type GenreId } from "../djing/genres";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function MixingStrategyPage() {
  const { guide, genre } = useGenre();

  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="Mix in / mix out"
        description="Which sections to overlap so energy stays up. Buttons stay the same; the length of the mix and what you stack change with the music."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout warn" style={{ marginBottom: "1rem" }}>
        <h2>{guide.mixProblemTitle}</h2>
        <p>{guide.mixProblem}</p>
      </div>

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Two jobs, not one fade</h2>
          <p>
            A transition is two decisions. Mixing <strong>in</strong> = where the new track is
            allowed to start being heard. Mixing <strong>out</strong> = where the old track is
            allowed to leave. They do not have to be “the file start” and “the file end.”
          </p>
          <ul>
            <li>
              <strong>Mix-in point</strong> — {guide.waveformMixIn}
            </li>
            <li>
              <strong>Mix-out point</strong> — {guide.waveformMixOut}
            </li>
          </ul>
          <p>Usual overlap for this music: {guide.overlap}</p>
        </section>

        <section className="info-block">
          <h2>Loud parts vs quiet parts</h2>
          <p>{guide.busyNote}</p>
        </section>

        <section className="info-block">
          <h2>What to actually do</h2>
          <p>{guide.mixDefault}</p>
        </section>

        <section className="info-block">
          <h2>Named ways to leave</h2>
          <p>
            “Which sections” is half. The other half is the <em>shape</em> of the handoff: long
            blend, bass swap, drop mix, echo-out, crossfader cut. Full Mix Ultra steps:{" "}
            <Link to="/djing/transitions">Same-speed mixes</Link>. What each named move is for:{" "}
            <Link to="/djing/techniques">Named techniques</Link>. A common house window is{" "}
            <Link to="/tutorials/mix-32-window">32 beats of new intro over the old chorus</Link>.
            The order of hands around any of them: <Link to="/djing/blend">The two-deck blend</Link>.
            Different BPMs: <Link to="/djing/jumps">When speeds don’t match</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Phrase alignment (why beat 1 matters)</h2>
          <p>
            SYNC only lines up the kicks. <strong>Phrasing</strong> is lining up the story: both
            songs change on the same beat 1.
          </p>
          <p>{guide.countTip}</p>
          <p>
            Drill: <Link to="/tutorials/count-phrases">Count phrases</Link>. Full counting page:{" "}
            <Link to="/djing/phrasing">Phrases & the One</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>{genre === "any" ? "Different music, different defaults" : "Other styles (for later)"}</h2>
          {genre === "any" ? (
            <>
              <p>
                House and hip-hop are not mixed the same way. The buttons stay the same; the{" "}
                <em>length</em> of the overlap and <em>which sections</em> you stack change. Pick a
                style above to rewrite this page — or skim:
              </p>
              <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Style</th>
                      <th>Usual overlap</th>
                      <th>What usually goes wrong</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.keys(GUIDES) as GenreId[])
                      .filter((id) => id !== "any")
                      .map((id) => (
                        <tr key={id}>
                          <td>{GUIDES[id].name}</td>
                          <td>{GUIDES[id].overlap}</td>
                          <td>{GUIDES[id].wrecks[0]}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <p>
                If the two songs are different styles: keep the overlap short, or just cut / echo
                the last word. Or play a song in between that sits in the middle (speed and energy).
              </p>
            </>
          ) : (
            <p>
              This page is written for {guide.name}. Switch the menu at the top to see house,
              hip-hop, pop/kids, or drum & bass. Full version:{" "}
              <Link to="/djing/style">How this music works</Link>.
            </p>
          )}
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What “good” is trying to do</h2>
          <ul>
            {guide.good.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h3>What usually goes wrong</h3>
          <ul>
            {guide.wrecks.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="info-block">
          <h2>Practice on the Mix Ultra</h2>
          <p>{guide.tutorialHint}</p>
          <ol>
            <li>
              <Link to="/tutorials/count-phrases">Count phrases</Link>
            </li>
            <li>
              <Link to="/tutorials/read-waveform">Read the waveform</Link>
            </li>
            <li>
              <Link to="/tutorials/mix-manual-beatmatch">Match BPM by hand</Link> ·{" "}
              <Link to="/tutorials/mix-key-lock">Tempo vs how high the notes sound</Link>
            </li>
            <li>
              <Link to="/tutorials/mix-in-mix-out">Mix in / mix out without killing energy</Link>{" "}
              (house/techno version)
            </li>
            <li>
              <Link to="/tutorials/vocal-handoff">Hand off vocal tracks</Link> (pop / hip-hop /
              Disney)
            </li>
            <li>
              <Link to="/tutorials/mix-long-blend">Long blend</Link> ·{" "}
              <Link to="/tutorials/mix-bass-swap">Bass swap</Link> ·{" "}
              <Link to="/tutorials/mix-echo-out">Echo-out</Link> (beginner song sheets)
            </li>
            <li>
              <Link to="/tutorials/mix-brake-cut">Echo + brake cut</Link> when speeds don’t match
            </li>
          </ol>
        </section>
      </div>

      <p className="footer-note">
        Why those sections exist: <Link to="/djing/songs">How songs are built</Link>. Named handoffs:{" "}
        <Link to="/djing/transitions">Same-speed mixes</Link>. Speeds don’t match:{" "}
        <Link to="/djing/jumps">When speeds don’t match</Link>. Which file:{" "}
        <Link to="/djing/choose">Pick the next song</Link>. The hands:{" "}
        <Link to="/djing/blend">The two-deck blend</Link>. Finding the actual spots:{" "}
        <Link to="/djing/cueing">Which cues to set</Link>. EQ / bass:{" "}
        <Link to="/djing/eq">EQ, bass & filter</Link>. Jumping around one song:{" "}
        <Link to="/djing/remix">Remix one song</Link>.
      </p>
    </>
  );
}
