import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function LoopingPage() {
  const { guide } = useGenre();
  return (
    <>
      <PageHeader
        eyebrow="DJing · Next"
        title="Looping"
        description="Repeat a phrase to buy time or extend a hook. On Mix Ultra, loop pads start from the playhead — not from the hot cue you just hit."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What a loop is for</h2>
          <p>{guide.loop}</p>
          <p>
            On Mix Ultra: press <strong>LOOP</strong>, tap a length pad once (it stays on), tap the
            lit pad again to exit on a One. Lengths and the eight pads:{" "}
            <Link to="/labs/pads">Pad modes</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Three jobs, one button</h2>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>What you’re doing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Buy time</td>
                  <td>
                    The old song is about to run out and the new one isn’t ready. Loop 2–4 bars of
                    beat on the <em>outgoing</em> deck. That’s a mix tool.{" "}
                    <Link to="/djing/blend">The two-deck blend</Link>.
                  </td>
                </tr>
                <tr>
                  <td>Extend a hook</td>
                  <td>
                    The chorus/drop is the product and you want another 8 bars. That’s a one-song
                    performance. <Link to="/djing/remix">Remix one song</Link>.
                  </td>
                </tr>
                <tr>
                  <td>Hold a bed</td>
                  <td>
                    Loop drums while you mute a vocal, or while you find hot cue 1 on the other deck
                    in headphones. Exit on beat 1 or people notice the repeat.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Panic-looping the same 2 bars until you think of a song is how the room gets restless.
            Pick the next file first: <Link to="/djing/choose">Pick the next song</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Why Play-then-LOOP starts late</h2>
          <p>
            LOOP pads are auto-loops from <strong>right now</strong>. They do not start from
            “whatever hot cue I just hit.” Pads are also one mode at a time: the first rubber pad is
            a hot cue only in HOT CUE mode; to loop you press LOOP, then a length pad. The song keeps
            running during that switch. That’s expected, not a broken cue.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block" id="loop-from-cue">
          <h2>Arm the loop while paused (exact start)</h2>
          <ol>
            <li>
              HOT CUE → jump to hot cue 1 (or jog there). <strong>Pause</strong> on beat 1 of that
              bar.
            </li>
            <li>Press LOOP. Tap 2-bar or 4-bar once. The in-point is the paused playhead.</li>
            <li>Press Play. You are looping the phrase that starts on the cue.</li>
          </ol>
          <p>
            Do this in headphones during prep, or on the outgoing deck while the other track still
            fills the room.
          </p>
        </section>

        <section className="info-block">
          <h2>Live: catch the next One</h2>
          <p>
            Already playing from hot cue 1? Don’t chase the bar you left. Switch to LOOP, wait for
            the next beat 1, tap 4-bar. The loop starts on a chunk, just not the one you jumped from.
          </p>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Save a cue-loop on hot cue 1</h2>
          <p>
            djay → Settings → Advanced → <strong>Save active loop when setting cue point</strong>.
            Pause on beat 1 → LOOP → 4-bar → HOT CUE → tap (or re-tap) hot cue 1. That pad jumps{" "}
            <em>and</em> brings the loop back, so you don’t race the mode buttons live.
          </p>
          <p>
            Turn the setting off afterward or every new hot cue will swallow a loop.{" "}
            <Link to="/settings">djay settings</Link>.
          </p>
          <p>
            Drill: <Link to="/tutorials/loop-from-cue">Loop from a cue</Link>. In a mix:{" "}
            <Link to="/djing/blend">The two-deck blend</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
