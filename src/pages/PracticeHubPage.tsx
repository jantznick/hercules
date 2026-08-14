import { Link } from "react-router-dom";
import { SectionCards } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function PracticeHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="4 · Practice"
        title="Labs & tutorials"
        description="Labs are click-around simulators. Tutorials are do-this-on-the-Mix-Ultra walkthroughs. Tabs above switch between them."
      />

      <SectionCards
        items={[
          {
            to: "/labs",
            pill: "Click",
            title: "Labs",
            blurb: "Cue, hot cue, filter, Neural Mix, pad modes — until the lights make sense.",
          },
          {
            to: "/tutorials",
            pill: "Hardware",
            title: "Tutorials",
            blurb: "Start here → Basics → Remix → Mixing → Advanced, with song sheets on the hard ones.",
          },
        ]}
      />

      <p className="footer-note">
        Why you’d do a move: <Link to="/djing">DJing</Link>. What the button is:{" "}
        <Link to="/controls">The controller</Link>.
      </p>
    </>
  );
}
