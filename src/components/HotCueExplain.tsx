import { Link } from "react-router-dom";

/** CUE button vs hot cue pads — the mix-up these pages keep causing. */
export function HotCueExplain({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p>
        <strong>Hot cue 1</strong> means the first rubber pad after you press{" "}
        <strong>HOT CUE</strong> (that mode button stays lit). It is a saved jump that keeps
        playing. It is not the <strong>CUE</strong> button next to Play — that one is a single home
        marker, and while the song is playing it usually stops and returns. The usual map:{" "}
        <Link to="/djing/cueing">Which cues to set</Link>.
      </p>
    );
  }

  return (
    <div className="callout accent" style={{ marginBottom: "1rem" }}>
      <h2>When we say “hot cue 1”</h2>
      <p>Mix Ultra has two different kinds of saved spots. They are easy to mix up.</p>
      <ul>
        <li>
          <strong>CUE</strong> — the button next to Play. One home marker per deck. Press it while
          paused to plant it. Press it while playing and the song usually <em>stops</em> and jumps
          back to that marker.
        </li>
        <li>
          <strong>Hot cue pads</strong> — the eight rubber pads. First press <strong>HOT CUE</strong>{" "}
          so that mode is on (the HOT CUE button stays lit). Each pad is then a bookmark that{" "}
          <em>jumps and keeps playing</em>.
        </li>
      </ul>
      <p>
        <strong>Hot cue 1</strong> is the first of those pads (top-left of the bank). These pages
        treat it as “where I start this song when I mix it in.” Hot cue 2 is often the loud part
        (chorus or drop), hot cue 3 a vocal or quiet middle, hot cue 4 where you plan to leave.
        Full map and how to find the spots: <Link to="/djing/cueing">Which cues to set</Link>.
      </p>
    </div>
  );
}
