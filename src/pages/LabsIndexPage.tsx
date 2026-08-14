import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

const LABS = [
  {
    to: "/labs/cue",
    title: "CUE button",
    blurb: "Pause → plant. Play → return and stop. Blinking Play is not a cue.",
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
    title: "EQ vs Neural knobs",
    blurb: "Center N remaps HIGH/MID/LOW to stem volumes.",
  },
  {
    to: "/labs/pads",
    title: "Pad modes",
    blurb: "All eight modes, plus mix and remix recipes.",
  },
  {
    to: "/labs/neural-pads",
    title: "Neural Mix pad lights",
    blurb: "Extra: top = solo, bottom = mute, lit = action on.",
  },
];

export function LabsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="4 · Practice"
        title="Labs"
        description="Simulators for the controls that confuse people. Do these when a tutorial’s hardware step doesn’t click yet — then go back to the Mix Ultra."
        actions={
          <Link to="/practice" className="text-back">
            Practice
          </Link>
        }
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
        Guided version of the same ideas: <Link to="/tutorials">Tutorials</Link>. Why you’d cue or
        mix a certain way: <Link to="/djing">DJing</Link>. All practice:{" "}
        <Link to="/practice">Labs & tutorials</Link>.
      </p>
    </>
  );
}
