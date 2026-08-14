import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

const LABS = [
  {
    to: "/labs/cue",
    title: "CUE button",
    blurb: "Pause → plant. Play → return and stop.",
  },
  {
    to: "/labs/hot-cue",
    title: "Hot cues",
    blurb: "Empty pad sets. Lit pad jumps and keeps playing. SHIFT+pad erases.",
  },
  {
    to: "/labs/filter",
    title: "Filter",
    blurb: "Left muffles. Right thins. Center is open.",
  },
  {
    to: "/labs/neural",
    title: "HIGH / MID / LOW",
    blurb: "Center N remaps HIGH/MID/LOW to stem volumes.",
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
];

export function LabsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Click until the lights make sense"
        description="No headphones needed. Then do the same thing on the Mix Ultra."
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
