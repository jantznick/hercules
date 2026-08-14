import { Link } from "react-router-dom";
import { RelatedExtras } from "../components/RelatedExtras";
import { TechniqueCatalog } from "../components/TechniqueCatalog";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function RemixFilterPage() {
  return (
    <>
      <PageHeader
        eyebrow="DJing · Remix"
        title="Filter as a performance tool"
        description="One knob on this song: muffle a breakdown, then open it as the drop hits. You are not mixing in a second file."
        actions={
          <Link to="/djing/remix" className="text-back">
            Remix
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <p>
          Filter is not a fourth EQ band. Left of 12 o’clock muffles (bass stays, sparkle goes).
          Right of 12 thins (hats stay, kick goes). Center is “leave the song alone.” Always park
          it at 12 when you’re done. Mixing two songs with Filter still lives on{" "}
          <Link to="/djing/eq#filter">EQ & Filter</Link> — this page is the one-song version.
        </p>
      </div>

      <LevelBand>Beginner</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What to do on one deck</h2>
          <ol>
            <li>Play into a quiet bit or a build. Filter at 12 o’clock.</li>
            <li>Turn Filter left so the breakdown feels covered. Count with the phrase.</li>
            <li>
              As this song’s drop (or chorus) hits — beat 1 — return Filter to 12 o’clock. The
              song “opens.”
            </li>
          </ol>
          <p>
            Same gesture as bringing a new song in, but you never leave this file. If you also
            looped the breakdown, exit the loop on that same beat 1.{" "}
            <Link to="/labs/filter">Filter lab</Link>.
          </p>
        </section>
      </div>

      <TechniqueCatalog groupIds={["one-song"]} techniqueIds={["filter-own-drop"]} />

      <RelatedExtras
        links={[
          {
            to: "/tutorials/filter-sweep",
            label: "Drill: Filter sweep",
            blurb: "Feel left vs right on one deck",
          },
          {
            to: "/tutorials/remix-filter-own-drop",
            label: "Drill: Filter-open your own drop",
            blurb: "Close the breakdown, open on beat 1",
          },
          {
            to: "/tutorials/remix-party-hook",
            label: "Drill: party hook",
            blurb: "Loop + filter on a song people know",
          },
          {
            to: "/labs/filter",
            label: "Lab: Filter",
            blurb: "Drag the knob; watch the curve",
          },
          {
            to: "/djing/eq#filter",
            label: "EQ page (two-song Filter)",
            blurb: "Match group — don’t start there for remix",
          },
        ]}
      />
    </>
  );
}
