import { Link } from "react-router-dom";
import { SectionCards } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function PracticeHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="3 · Practice"
        title="Labs & tutorials"
        description="If a button still confuses you, click a lab first. Then do the tutorials on the Mix Ultra."
      />

      <SectionCards
        items={[
          {
            to: "/labs",
            pill: "1",
            title: "Labs",
            blurb: "CUE, hot cues, Filter, Neural Mix, pads — click until the lights make sense.",
          },
          {
            to: "/tutorials",
            pill: "2",
            title: "Tutorials",
            blurb: "Do these on the Mix Ultra, in order. Leave the SYNC button off.",
          },
        ]}
      />

      <div className="callout accent" style={{ marginTop: "1.5rem" }}>
        <h2>Learn a new move</h2>
        <p>
          After <Link to="/tutorials">Start here</Link> and Basics, pick a named move. Two songs:{" "}
          <Link to="/djing/techniques">Mix techniques</Link>. One song:{" "}
          <Link to="/djing/remix">Remix</Link>. Open Full steps, then the linked tutorial or lab.
        </p>
      </div>

      <p className="footer-note">
        Why you’d do a move: <Link to="/djing">DJing</Link>. What each button is:{" "}
        <Link to="/cheatsheet">Cheat sheet</Link>.
      </p>
    </>
  );
}
