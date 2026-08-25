import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

const LABS = [
  {
    to: "/labs/free",
    title: "Free play",
    blurb: "Full live deck, waveforms, your files or demo beds.",
  },
  {
    to: "/labs/cue",
    title: "CUE / Play",
    blurb: "Learn the button, or drill it on the Mix Ultra.",
  },
  {
    to: "/labs/hot-cue",
    title: "Hot cues",
    blurb: "Empty pad sets. Lit pad jumps. SHIFT+pad erases.",
  },
  {
    to: "/labs/filter",
    title: "Filter",
    blurb: "Left muffles · right thins · hear it on hardware.",
  },
  {
    to: "/labs/eq",
    title: "Bass kill (LOW)",
    blurb: "Why you kill bass when blending — graded on box.",
  },
  {
    to: "/labs/crossfader",
    title: "Crossfader",
    blurb: "Left / center / right — timing tip when you finish.",
  },
  {
    to: "/labs/neural",
    title: "HIGH / MID / LOW",
    blurb: "Center N remaps knobs to stem volumes.",
  },
  {
    to: "/labs/pads",
    title: "Pad modes",
    blurb: "All eight modes: enter, TAP vs HOLD, what each pad does.",
  },
  {
    to: "/labs/neural-pads",
    title: "Neural Mix pads",
    blurb: "Top = solo, bottom = mute, lit = action on.",
  },
  {
    to: "/labs/midi",
    title: "Controller live",
    blurb: "Raw Bluetooth MIDI — see every message.",
  },
];

export function LabsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Click until the lights make sense"
        description="Each lab can stay click-around (Learn) or switch to On hardware for Mix Ultra + laptop audio. Free play is the full mirror."
      />

      <div className="home-cards">
        {LABS.map((lab) => (
          <Link key={lab.to} to={lab.to} className="home-card">
            <h3>{lab.title}</h3>
            <p>{lab.blurb}</p>
          </Link>
        ))}
      </div>

      <p className="footer-note">
        Matching tutorials: <Link to="/tutorials/cue-home">Plant your home CUE</Link> ·{" "}
        <Link to="/tutorials/hot-cues">Hot cues</Link> ·{" "}
        <Link to="/tutorials/filter-sweep">Filter sweep</Link> ·{" "}
        <Link to="/tutorials/eq-vs-neural">EQ vs Neural Mix</Link> ·{" "}
        <Link to="/tutorials/neural-pad-lights">Neural pad lights</Link> ·{" "}
        <Link to="/tutorials/loop-from-cue">Loop from a cue</Link>. Pages:{" "}
        <Link to="/djing/cueing">Cues</Link> · <Link to="/djing/eq">EQ & Filter</Link> ·{" "}
        <Link to="/djing/remix">Remix</Link> · <Link to="/djing/looping">Looping</Link> ·{" "}
        <Link to="/djing/filter">Filter</Link> · <Link to="/djing/pads-fx">Pads / FX</Link> ·{" "}
        <Link to="/djing/neural">Neural Mix</Link>.
      </p>
    </>
  );
}
