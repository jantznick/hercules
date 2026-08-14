import { Link } from "react-router-dom";
import { RelatedExtras } from "../components/RelatedExtras";
import { TechniqueCatalog } from "../components/TechniqueCatalog";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function RemixNeuralPage() {
  return (
    <>
      <PageHeader
        eyebrow="DJing · Remix"
        title="Neural Mix"
        description="Mute vocals or drums for a phrase on this song, then bring them back. Same pads as a two-song vocal swap — used here as a one-song trick."
        actions={
          <Link to="/djing/remix" className="text-back">
            Remix
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <p>
          NEURAL MIX pad mode: solid LED, not flashing Sampler. Top pads solo a stem; bottom pads
          mute a stem. Lit = that action is on. Home is <strong>all pads dark</strong> (full mix).
          The center N button turns HIGH / MID / LOW into stem knobs — a different control. Leave
          SYNC out of this; you’re not matching a second song.
        </p>
      </div>

      <LevelBand>Beginner</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Mute the singer for eight beats</h2>
          <ol>
            <li>Press NEURAL MIX so the LED is solid. All performance pads dark.</li>
            <li>On a chorus you know: tap the bottom vocals pad (it lights = mute on).</li>
            <li>Count 8 beats. Tap it dark again. Confirm every Neural pad is dark.</li>
          </ol>
          <p>
            Solo drums (top row) is the same idea: spotlight, then all-dark. If the wrong stem
            died, tap off and try the neighbor. Press HOT CUE when you’re done so pads are jumps
            again.
          </p>
        </section>
      </div>

      <TechniqueCatalog groupIds={["one-song"]} techniqueIds={["mute-vocal"]} />

      <RelatedExtras
        links={[
          {
            to: "/tutorials/neural-pad-lights",
            label: "Drill: read the lights",
            blurb: "Lit mute ≠ ‘vocals present’",
          },
          {
            to: "/tutorials/eq-vs-neural",
            label: "Drill: EQ vs Neural knobs",
            blurb: "Center N is stem volumes, not treble/mids/bass",
          },
          {
            to: "/tutorials/remix-flare-kit",
            label: "Drill: flare kit",
            blurb: "Mute vocals for a phrase, then reset",
          },
          {
            to: "/labs/neural-pads",
            label: "Lab: Neural Mix pads",
            blurb: "Click until solo/mute lights make sense",
          },
          {
            to: "/labs/neural",
            label: "Lab: HIGH / MID / LOW",
            blurb: "Same three knobs, different job",
          },
        ]}
      />
    </>
  );
}
