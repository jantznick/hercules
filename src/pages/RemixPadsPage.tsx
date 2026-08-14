import { Link } from "react-router-dom";
import { RelatedExtras } from "../components/RelatedExtras";
import { TechniqueCatalog } from "../components/TechniqueCatalog";
import { PageHeader } from "./HomePage";

const PAD_FX_IDS = ["echo-word", "stutter-cue", "backspin-echo", "noise-fader", "slicer-chop"];

export function RemixPadsPage() {
  return (
    <>
      <PageHeader
        eyebrow="DJing · Remix"
        title="Pads / FX"
        description="One-song decorations: stutter from CUE, slicer chops, echo a word, backspin with Echo, noise on a build. Then reset the mode to HOT CUE."
        actions={
          <Link to="/djing/remix" className="text-back">
            Remix
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <p>
          These are fills on <em>this</em> track. Echo here does not pull the fader (that’s an
          echo-out to another song). One trick, then home: Filter at 12, Neural pads dark, mode =
          HOT CUE. For every pad mode, use the lab — not this page.{" "}
          <Link to="/labs/pads">Pad modes lab</Link>.
        </p>
      </div>

      <nav className="technique-toc" aria-label="Pad and FX techniques">
        <a href="#echo-word">Echo a word</a>
        <a href="#stutter-cue">Stutter</a>
        <a href="#backspin-echo">Backspin</a>
        <a href="#noise-fader">Noise</a>
        <a href="#slicer-chop">Slicer</a>
      </nav>

      <TechniqueCatalog groupIds={["one-song"]} techniqueIds={PAD_FX_IDS} />

      <RelatedExtras
        links={[
          {
            to: "/tutorials/remix-flare-kit",
            label: "Drill: flare kit",
            blurb: "Echo a word, mute vocals, optional slicer — then reset",
          },
          {
            to: "/tutorials/stutter-cue",
            label: "Drill: stutter from CUE",
            blurb: "SHIFT + Play taps from the home marker",
          },
          {
            to: "/tutorials/remix-backspin-echo",
            label: "Drill: backspin with Echo",
            blurb: "Hold Echo, spin, let go",
          },
          {
            to: "/tutorials/remix-noise-fader",
            label: "Drill: noise / riser chops",
            blurb: "Empty deck or Sampler — watch volume",
          },
          {
            to: "/labs/pads",
            label: "Lab: Pad modes",
            blurb: "How to enter FX, Slicer, Sampler — click around",
          },
        ]}
      />
    </>
  );
}
