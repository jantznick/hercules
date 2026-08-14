import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { GENRE_OPTIONS, GUIDES, type GenreId } from "../djing/genres";
import { LevelBand } from "../components/SectionCards";
import { WaveShape } from "./WaveformPage";
import { PageHeader } from "./HomePage";

export function StylePage() {
  const { genre, setGenre, guide } = useGenre();

  if (genre === "any") {
    return (
      <>
        <PageHeader
          eyebrow="DJing · This music"
          title="Pick a style"
          description="Same Mix Ultra, different music. Pick house, hip-hop, pop, or drum & bass — the examples on the DJing pages change; the buttons don’t."
          actions={
            <Link to="/djing" className="text-back">
              DJing
            </Link>
          }
        />

        <div className="home-cards">
          {GENRE_OPTIONS.filter((o) => o.id !== "any").map((opt) => {
            const g = GUIDES[opt.id];
            return (
              <button
                key={opt.id}
                type="button"
                className="home-card genre-pick-card"
                onClick={() => setGenre(opt.id)}
              >
                <span className="pill">{opt.tag}</span>
                <h3>{opt.label}</h3>
                <p>{g.styleIntro.split(".")[0]}.</p>
              </button>
            );
          })}
        </div>

        <h2 className="home-section-title" style={{ marginTop: "1.5rem" }}>
          At a glance
        </h2>
        <div className="table-wrap">
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
                    <td>
                      <button type="button" className="text-btn" onClick={() => setGenre(id)}>
                        {GUIDES[id].name}
                      </button>
                    </td>
                    <td>{GUIDES[id].overlap}</td>
                    <td>{GUIDES[id].wrecks[0]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="footer-note">
          If the two songs are different styles: keep the overlap short, or just cut / echo the last
          word. Or play a song in between that sits in the middle (speed and energy). More on that
          pick: <Link to="/djing/choose">Pick the next song</Link>.
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="DJing · This music"
        title={GENRE_OPTIONS.find((o) => o.id === genre)?.label ?? guide.name}
        description={guide.styleIntro}
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>How a track is usually built</h2>
          <ul>
            {guide.structure.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            <strong>BPM:</strong> {guide.bpm}
          </p>
          <p>
            <strong>Phrases:</strong> {guide.phraseLen}
          </p>
        </section>

        <section className="info-block">
          <h2>What the waveform tends to look like</h2>
          <WaveShape heights={guide.waveformShape} />
          <p>{guide.waveformOverview}</p>
          <p>
            Full read: <Link to="/djing/waveform">Read the waveform</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Pad map</h2>
          <p>{guide.padIntro}</p>
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
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>How you mix</h2>
          <p>
            <strong>{guide.mixProblemTitle}.</strong> {guide.mixProblem}
          </p>
          <p>{guide.mixDefault}</p>
          <ul>
            {guide.howYouMix.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            Overlap: {guide.overlap} EQ: {guide.eqWhen}
          </p>
          <p>
            Which file: <Link to="/djing/choose">Pick the next song</Link>. The hands:{" "}
            <Link to="/djing/blend">The two-deck blend</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>How you cue</h2>
          <ul>
            {guide.howYouCue.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Remix / flare on one song</h2>
          <ul>
            {guide.howYouRemix.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>{guide.remixFlare}</p>
        </section>

        <section className="info-block">
          <h2>What “good” sounds like</h2>
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
          <p>{guide.tutorialHint}</p>
        </section>
      </div>

      <p className="footer-note">
        Same ideas spread across <Link to="/djing/phrasing">phrases</Link>,{" "}
        <Link to="/djing/songs">songs</Link>, <Link to="/djing/cueing">cues</Link>,{" "}
        <Link to="/djing/mixing">mix in/out</Link>, <Link to="/djing/techniques">techniques</Link>,{" "}
        <Link to="/djing/choose">pick</Link>,{" "}
        <Link to="/djing/blend">the blend</Link>, <Link to="/djing/eq">EQ</Link>,{" "}
        <Link to="/djing/remix">remix</Link>. Switch the menu above anytime.
      </p>
    </>
  );
}
