import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { SONG_ANATOMY, TWO_STYLES } from "../djing/songParts";
import { HotCueExplain } from "../components/HotCueExplain";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function SongPartsPage() {
  const { guide, genre } = useGenre();
  const song = SONG_ANATOMY[genre];

  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="How songs are built"
        description="Songs are built from parts — intro, verse, chorus, drop. Some parts sit next to each other well when two songs play at once; others clash."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>You’re not producing</h2>
        <p>
          The file is already arranged. Your job is to pick which part of this song plays in the
          room, and which part of the next song to bring in next to it. Names (verse, chorus, drop)
          are just so you and the waveform are talking about the same blocks.
        </p>
      </div>

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Layers, then a timeline</h2>
          <p>{song.howBuilt}</p>
          <p>
            Typical length for this music: {song.length} Neural Mix on Mix Ultra splits some of
            those layers (vocals / instruments / drums) so you can hear them. EQ splits by pitch
            (LOW / MID / HIGH) instead. <Link to="/djing/eq">EQ & Filter</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>The 8-bar brick</h2>
          <p>{song.eightBar}</p>
          <p>
            Counting those bricks: <Link to="/djing/phrasing">Phrases & beat 1</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Why the quiet parts exist</h2>
          <p>{song.whyContrast}</p>
          <div className="song-energy" aria-hidden="true">
            {song.energyCurve.map((pt, i) => (
              <div key={`${pt.label}-${i}`} className="song-energy-col">
                <div className="song-energy-bar" style={{ height: `${pt.height}%` }} />
              </div>
            ))}
          </div>
          <div className="song-energy-labels" aria-hidden="true">
            {song.energyCurve.map((pt, i) => (
              <span key={`${pt.label}-l-${i}`}>{pt.label}</span>
            ))}
          </div>
          <p className="wave-caption">{song.energyCaption}</p>
        </section>

        <section className="info-block">
          <h2>The layers (what’s stacked)</h2>
          <p>
            You don’t need to produce. You do need to hear which layer is “on” in a section — that’s
            how you know if two songs will fight.
          </p>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>What it’s doing</th>
                </tr>
              </thead>
              <tbody>
                {song.layers.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.job}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="info-block">
          <h2>The sections (what order they come in)</h2>
          <p>
            Names get reused: pop says chorus, dance music often says drop for the loud payoff. Same
            idea — the part people came for.{" "}
            {genre === "any"
              ? "Pick a style above to see a typical order for that music. This list is the dictionary."
              : `Typical order in ${guide.name}:`}
          </p>
          <HotCueExplain compact />
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Section</th>
                  <th>What it is</th>
                  <th>How long</th>
                  <th>What you do with it</th>
                </tr>
              </thead>
              <tbody>
                {song.order.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.what}</td>
                    <td>{row.howLong}</td>
                    <td>{row.djUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Seeing those blocks on the file: <Link to="/djing/waveform">Read the waveform</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Three jobs when you mix</h2>
          <p>
            Default: put a quieter or thinner part of the new song on a still-loud part of the old
            one — or put a new loud part into a hole the old song already made. Keep one bass and
            one lead vocal.
          </p>
          <div className="eq-bands">
            {song.mixJobs.map((row) => (
              <div className="eq-band" key={row.job}>
                <span className="eq-band-name">{row.job}</span>
                <p>{row.means}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="info-block">
          <h2>Which parts mix well</h2>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Bring this in</th>
                  <th>Over this</th>
                  <th>Why it works</th>
                  <th>On Mix Ultra</th>
                </tr>
              </thead>
              <tbody>
                {song.mixPairs.map((row) => (
                  <tr key={`${row.from}-${row.onto}`}>
                    <td>{row.from}</td>
                    <td>{row.onto}</td>
                    <td>{row.why}</td>
                    <td>{row.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="info-block">
          <h2>Which parts fight</h2>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>If you bring this in</th>
                  <th>Over this</th>
                  <th>What happens</th>
                  <th>Do this instead</th>
                </tr>
              </thead>
              <tbody>
                {song.avoidPairs.map((row) => (
                  <tr key={`${row.from}-${row.onto}`}>
                    <td>{row.from}</td>
                    <td>{row.onto}</td>
                    <td>{row.why}</td>
                    <td>{row.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            More on energy: <Link to="/djing/mixing">Mix in / mix out</Link>. Bass fights:{" "}
            <Link to="/djing/eq">EQ, bass & filter</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>What to listen for (then mark it)</h2>
          <ul>
            {song.listenFor.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            Pad map for this music: <Link to="/djing/cueing">Which cues to set</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Same title, different file</h2>
          <p>{song.versions}</p>
          <p>
            That choice is part of picking the next file:{" "}
            <Link to="/djing/choose">Pick the next song</Link>. Two styles in one mix still need a
            leave move: <Link to="/djing/blend">The two-deck blend</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Two different kinds of song in one mix</h2>
          <p>
            House into hip-hop still uses verse, chorus, drop. What changes is how long you overlap
            and whether the speeds even match.
          </p>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>From → into</th>
                  <th>What changes</th>
                </tr>
              </thead>
              <tbody>
                {TWO_STYLES.map((row) => (
                  <tr key={row.from}>
                    <td>{row.from}</td>
                    <td>{row.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="info-block">
          <h2>You can also rearrange one song</h2>
          <p>
            Jump chorus to chorus, skip a verse, loop a hook — that’s performing one file, not a
            two-deck mix. Same section names; extra pads.{" "}
            <Link to="/djing/remix">Remix one song</Link>. Choosing what to play after this file:{" "}
            <Link to="/djing/choose">Pick the next song</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
