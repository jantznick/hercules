import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { TECHNIQUE_GROUPS, TECHNIQUE_INTRO, TECHNIQUES } from "../djing/techniques";
import { SOURCE_VIDEOS } from "../djing/videos";
import { TUTORIALS } from "../tutorials/data";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

function tutorialLabel(id: string) {
  return TUTORIALS.find((t) => t.id === id)?.title ?? id;
}

export function TechniquesPage() {
  const { guide, genre } = useGenre();

  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="Named techniques"
        description="Short version of each move: what it is, when to use it, how it looks on Mix Ultra. Full steps live on the match-speed, same-speed, and BPM-jump pages. Song-sheet drills are the tutorials."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>Pick a move, then open the long page</h2>
        <p>
          This is the list. Each card is a synopsis. <strong>Full steps</strong> opens the longer
          writeup for that mix (faders, knobs, what to listen for).{" "}
          <Link to="/djing/beatmatch">Match the speed yourself</Link> is tempo fader + jog, not
          always SYNC. <Link to="/djing/transitions">Same-speed mixes</Link> covers long blend, bass
          swap, drop mix, echo-out, and the crossfader cut.{" "}
          <Link to="/djing/jumps">When speeds don’t match</Link> covers the stop, the tempo walk,
          and the loop-bridge.
        </p>
        <p>
          {genre === "any"
            ? TECHNIQUE_INTRO.any
            : `${guide.name}: ${TECHNIQUE_INTRO[genre]}`}
        </p>
      </div>

      <nav className="technique-toc" aria-label="Technique groups">
        {TECHNIQUE_GROUPS.map((g) => (
          <a key={g.id} href={`#${g.id}`}>
            {g.title}
          </a>
        ))}
      </nav>

      {TECHNIQUE_GROUPS.map((group) => {
        const items = TECHNIQUES.filter((t) => t.group === group.id);
        return (
          <div key={group.id}>
            <LevelBand>{group.title}</LevelBand>
            <p className="technique-group-blurb" id={group.id}>
              {group.blurb}
              {group.id === "match-speed" && (
                <>
                  {" "}
                  Longer pages: <Link to="/djing/beatmatch">Match the speed yourself</Link>.
                </>
              )}
              {group.id === "same-speed" && (
                <>
                  {" "}
                  Longer pages: <Link to="/djing/transitions">Same-speed mixes</Link>.
                </>
              )}
              {group.id === "jump" && (
                <>
                  {" "}
                  Longer pages: <Link to="/djing/jumps">When speeds don’t match</Link>.
                </>
              )}
              {group.id === "one-song" && (
                <>
                  {" "}
                  One-deck map: <Link to="/djing/remix">Remix one song</Link>.
                </>
              )}
            </p>
            <div className="info-stack">
              {items.map((tech) => (
                <section className="info-block" id={tech.id} key={tech.id}>
                  <h2>{tech.title}</h2>
                  <p>{tech.what}</p>
                  <p>
                    <strong>Good for.</strong> {tech.goodFor}
                  </p>
                  <p>
                    <strong>On Mix Ultra.</strong> {tech.mixUltra}
                  </p>
                  {tech.more && tech.more.length > 0 && (
                    <p className="technique-links">
                      <span className="technique-links-label">More info</span>
                      {tech.more.map((m) => (
                        <Link key={m.to} to={m.to}>
                          {m.label}
                        </Link>
                      ))}
                    </p>
                  )}
                  <p className="technique-links">
                    <span className="technique-links-label">Practice</span>
                    {tech.tutorials.map((id) => (
                      <Link key={id} to={`/tutorials/${id}`}>
                        {tutorialLabel(id)}
                      </Link>
                    ))}
                  </p>
                  {tech.sourceVideos && tech.sourceVideos.length > 0 && (
                    <p className="technique-links">
                      <span className="technique-links-label">Video</span>
                      {tech.sourceVideos.map((vid) => {
                        const src = SOURCE_VIDEOS[vid];
                        return (
                          <a key={vid} href={src.watchUrl} target="_blank" rel="noreferrer">
                            {src.title}
                          </a>
                        );
                      })}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
