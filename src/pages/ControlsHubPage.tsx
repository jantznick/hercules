import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

export function ControlsHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="2 · The controller"
        title="How this deck works"
        description="What each Mix Ultra control does in djay. Tabs above are every topic in this section — CUE, hot cues, Filter, the three EQ knobs, pads."
      />

      <div className="callout accent" style={{ marginBottom: "1.25rem" }}>
        <h2>Two different “cues”</h2>
        <ul>
          <li>
            <strong>CUE button</strong> — one home marker. Paused: plants it. Playing: usually stops
            and returns.
          </li>
          <li>
            <strong>Hot Cue pads</strong> — up to eight jumps that keep playing.
          </li>
        </ul>
        <p style={{ margin: "0.6rem 0 0" }}>
          Blinking Play while paused is normal. It does not mean a cue is set.
        </p>
      </div>

      <div className="info-stack">
        <section className="info-block">
          <h2>Use the tabs</h2>
          <ul>
            <li>
              <strong>Cheat sheet</strong> — one-screen list of Mix Ultra controls.
            </li>
            <li>
              <strong>CUE / Hot cues</strong> — click-around labs for the two kinds of markers.
            </li>
            <li>
              <strong>Filter</strong> — left muffles, right thins, center is the full song.
            </li>
            <li>
              <strong>HIGH / MID / LOW</strong> — the three EQ knobs, and how Neural Mix hijacks
              them. What they <em>mean</em> in a mix:{" "}
              <Link to="/djing/eq">EQ & Filter</Link>.
            </li>
            <li>
              <strong>Pads</strong> — all eight pad modes (Loop, FX, Slicer, …).
            </li>
          </ul>
        </section>
      </div>

      <p className="footer-note">
        Box, pairing, djay preferences: <Link to="/gear">Gear</Link>. What to mark on a song:{" "}
        <Link to="/djing">DJing</Link>. Filter and EQ as mixing tools:{" "}
        <Link to="/djing/eq">EQ & Filter</Link>.
      </p>
    </>
  );
}
