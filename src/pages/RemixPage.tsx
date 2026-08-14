import { Link } from "react-router-dom";
import { RelatedExtras } from "../components/RelatedExtras";
import { TechniqueCatalog } from "../components/TechniqueCatalog";
import { useGenre } from "../djing/GenreContext";
import { TECHNIQUES } from "../djing/techniques";
import { PageHeader } from "./HomePage";

const ONE_SONG = TECHNIQUES.filter((t) => t.group === "one-song");

export function RemixPage() {
  const { guide } = useGenre();
  return (
    <>
      <PageHeader
        eyebrow="DJing · Remix"
        title="Named techniques"
        description="Beginner intro: these are one-song moves — jump, loop, filter, echo, mute — on a single file. No second track. Practice this before two-deck blends if you want — no headphones split, no SYNC."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <p>
          <strong>Mix</strong> is two songs. <strong>Remix</strong> is one song: rearrange it or
          decorate it, then reset. One trick at a time. Loop lengths:{" "}
          <Link to="/djing/looping">Looping</Link>. Filter on a build:{" "}
          <Link to="/djing/filter">Filter as a performance tool</Link>. Pad tricks:{" "}
          <Link to="/djing/pads-fx">Pads / FX</Link>. Mute a stem:{" "}
          <Link to="/djing/neural">Neural Mix</Link>.
        </p>
      </div>

      <nav className="technique-toc" aria-label="One-song techniques">
        {ONE_SONG.map((t) => (
          <a key={t.id} href={`#${t.id}`}>
            {t.title}
          </a>
        ))}
      </nav>

      <TechniqueCatalog
        groupIds={["one-song"]}
        extraBlurb={{
          "one-song": (
            <>
              {" "}
              A useful hot-cue map for this music:{" "}
              {guide.remixPads.map((row, i) => (
                <span key={row.pad}>
                  {i > 0 ? " · " : ""}
                  <strong>pad {row.pad}</strong> {row.usually}
                </span>
              ))}
              . How to plant them: <Link to="/djing/cueing">Which cues to set</Link>.
            </>
          ),
        }}
      />

      <RelatedExtras
        links={[
          {
            to: "/djing/looping",
            label: "Looping",
            blurb: "Repeat a few bars, then exit on beat 1",
          },
          {
            to: "/djing/filter",
            label: "Filter as a performance tool",
            blurb: "Close in the breakdown, open on your own drop",
          },
          {
            to: "/djing/pads-fx",
            label: "Pads / FX",
            blurb: "Stutter, slicer, echo a word, backspin, noise",
          },
          {
            to: "/djing/neural",
            label: "Neural Mix",
            blurb: "Mute vocals or drums for a phrase, then all-dark",
          },
          {
            to: "/djing/techniques",
            label: "Two-song techniques",
            blurb: "Long blend, bass swap, echo-out — Mix, not remix",
          },
        ]}
      />
    </>
  );
}
