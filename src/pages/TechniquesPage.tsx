import { Link } from "react-router-dom";
import { TechniqueCatalog } from "../components/TechniqueCatalog";
import { useGenre } from "../djing/GenreContext";
import { MIX_TECHNIQUE_GROUP_IDS, TECHNIQUE_GROUPS, TECHNIQUE_INTRO } from "../djing/techniques";
import { PageHeader } from "./HomePage";

export function TechniquesPage() {
  const { guide, genre } = useGenre();
  const mixGroups = TECHNIQUE_GROUPS.filter((g) => MIX_TECHNIQUE_GROUP_IDS.includes(g.id));

  return (
    <>
      <PageHeader
        eyebrow="DJing · Mix"
        title="Named techniques"
        description="Two-song jobs: match speed, blend or cut, leave when BPM won’t share. Each named mix is when you’d use it, then the Mix Ultra steps."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <p>
          {genre === "any"
            ? TECHNIQUE_INTRO.any
            : `${guide.name}: ${TECHNIQUE_INTRO[genre]}`}
        </p>
        <p>
          Leave SYNC off. Tempo fader + jog:{" "}
          <Link to="/djing/beatmatch">Match the speed yourself</Link>. Same BPM:{" "}
          <Link to="/djing/transitions">Same-speed mixes</Link>. Different BPM:{" "}
          <Link to="/djing/jumps">When speeds don’t match</Link>. One song (loop, jump, echo):{" "}
          <Link to="/djing/remix">Remix</Link>.
        </p>
      </div>

      <nav className="technique-toc" aria-label="Technique groups">
        {mixGroups.map((g) => (
          <a key={g.id} href={`#${g.id}`}>
            {g.title}
          </a>
        ))}
        <Link to="/djing/remix">One song</Link>
      </nav>

      <TechniqueCatalog
        groupIds={MIX_TECHNIQUE_GROUP_IDS}
        extraBlurb={{
          "match-speed": (
            <>
              {" "}
              Longer pages: <Link to="/djing/beatmatch">Match the speed yourself</Link>.
            </>
          ),
          "same-speed": (
            <>
              {" "}
              Longer pages: <Link to="/djing/transitions">Same-speed mixes</Link>.
            </>
          ),
          jump: (
            <>
              {" "}
              Longer pages: <Link to="/djing/jumps">When speeds don’t match</Link>.
            </>
          ),
        }}
      />
    </>
  );
}
