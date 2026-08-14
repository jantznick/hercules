import { Link } from "react-router-dom";
import { SectionCards } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function ControlsHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="2 · The controller"
        title="How this deck works"
        description="The Mix Ultra sends button presses. djay makes the sound. Use the cheat sheet for every control, then click the labs until the lights make sense."
      />

      <SectionCards
        items={[
          {
            to: "/cheatsheet",
            pill: "1",
            title: "Cheat sheet",
            blurb: "Play, CUE, pads, Filter, EQ, Neural Mix, faders — what each control does.",
          },
          {
            to: "/labs",
            pill: "2",
            title: "Labs",
            blurb: "Click-around: CUE, hot cues, Filter, pads — until the lights make sense.",
          },
        ]}
      />

      <p className="footer-note">
        CUE vs hot-cue pads, and why Play blinks when paused:{" "}
        <Link to="/djing/cueing">Which cues to set</Link> · <Link to="/labs/cue">CUE lab</Link>.
        Headphones without the room: <Link to="/pre-cue">Headphones</Link>. Box and djay:{" "}
        <Link to="/gear">Gear</Link>. Mixing and remix: <Link to="/djing">DJing</Link>. Same labs
        as practice: <Link to="/labs">Labs</Link> · <Link to="/tutorials">Tutorials</Link>.
      </p>
    </>
  );
}
