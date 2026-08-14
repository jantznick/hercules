import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { BLEND } from "../djing/blend";
import { HotCueExplain } from "../components/HotCueExplain";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function BlendPage() {
  const { genre } = useGenre();
  const blend = BLEND[genre];

  return (
    <>
      <PageHeader
        eyebrow="DJing · Next"
        title="The two-deck blend"
        description="Hear the next song in headphones, match its speed, then bring it into the room with the faders. A long blend is one option — you can also just cut."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout warn" style={{ marginBottom: "1rem" }}>
        <h2>Play is not “in the room”</h2>
        <p>
          Pressing Play starts the file. Whether guests hear it is the channel fader and crossfader.
          Headphones are a third path. Mixing those up is why cue “doesn’t work.”{" "}
          <Link to="/pre-cue">Gear → Pre-cue</Link>.
        </p>
      </div>

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What this loop is</h2>
          <p>{blend.idea}</p>
          <p>{blend.skipIf}</p>
        </section>

        <section className="info-block">
          <h2>Channel faders</h2>
          <p>{blend.faders}</p>
        </section>

        <section className="info-block">
          <h2>Crossfader</h2>
          <p>{blend.crossfader}</p>
        </section>

        <section className="info-block">
          <h2>Headphones, then match the speed</h2>
          <p>{blend.headphones}</p>
          <p>{blend.sync}</p>
          <p>
            Hands without SYNC: <Link to="/djing/beatmatch">Match the speed yourself</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>The loop, in order</h2>
          <HotCueExplain compact />
          <ol className="blend-steps">
            {blend.steps.map((step, i) => (
              <li key={step.title}>
                <strong>
                  {i + 1}. {step.title}
                </strong>
                <span>{step.do}</span>
              </li>
            ))}
          </ol>
          <p>
            LOW / Filter during that loop: <Link to="/djing/eq">EQ, bass & filter</Link>. Which
            blocks you’re overlapping: <Link to="/djing/mixing">Mix in / mix out</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Four ways to leave — and two more</h2>
          <p>
            Same hands; different length. The named catalog (including the drop mix and the
            crossfader cut) is <Link to="/djing/transitions">Same-speed mixes</Link>. If you only
            remember one thing: pick the move that matches the file, not the move that looks the
            most like “DJing.”
          </p>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Move</th>
                  <th>When</th>
                  <th>On Mix Ultra</th>
                </tr>
              </thead>
              <tbody>
                {blend.leaveMoves.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.when}</td>
                    <td>{row.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Reset the empty deck</h2>
          <p>{blend.reset}</p>
        </section>

        <section className="info-block">
          <h2>If you need a second</h2>
          <p>
            Loop 2–4 bars on the <em>old</em> song so you don’t run out of music while the new one
            isn’t ready. Exit on beat 1. That’s looping as a mix tool, not a remix.{" "}
            <Link to="/djing/looping">Looping</Link>. Tutorial:{" "}
            <Link to="/tutorials/mix-loop-bridge">Loop-bridge into the next intro</Link>.
            Different BPMs: <Link to="/djing/jumps">When speeds don’t match</Link>.
          </p>
          <p>
            Hands-on: <Link to="/tutorials/two-deck-blend">First two-deck blend</Link> ·{" "}
            <Link to="/tutorials/mix-manual-beatmatch">Match BPM by hand</Link> ·{" "}
            <Link to="/tutorials/mix-gain">Gain</Link> ·{" "}
            <Link to="/tutorials/pre-cue-hear-first">Hear it first</Link>. Picking the file:{" "}
            <Link to="/djing/choose">Pick the next song</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
