import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function QuantizePage() {
  const { guide } = useGenre();
  return (
    <>
      <PageHeader
        eyebrow="DJing · Hear"
        title="Quantize"
        description="Quantize snaps the cues and loops you set to the nearest beat. It is a setting, not a remix trick. Mix Ultra has no Q button — you turn it on in djay. Leave it off until you want that snap."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What it does (two jobs)</h2>
          <p>
            Quantize is the “auto snap cue” switch. Hercules did not put it on this controller. It
            does two jobs, which is why leaving it on all the time feels annoying:
          </p>
          <ul>
            <li>
              <strong>Setting</strong> — a new CUE / hot cue jumps to the nearest grid line, even if
              your finger was a little early or late.
            </li>
            <li>
              <strong>Triggering</strong> — hitting a cue or loop while playing waits for the next
              grid line so the jump stays in time. Great for drops. Bad for an off-beat vocal stab
              that should fire <em>now</em>.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Don’t toggle — tap vs hold</h2>
          <p>
            Leave Quantize <strong>off</strong>, then choose per cue with how long you press
            (Algoriddim’s hold-to-snap):
          </p>
          <ul>
            <li>
              <strong>Quick tap</strong> CUE or an empty hot-cue pad — plants exactly where the
              song is right now (talking, or a lyric that isn’t on the kick).
            </li>
            <li>
              <strong>Hold a moment</strong> while setting — jumps to the nearest beat{" "}
              <em>even with Quantize off</em>. Same on Mix Ultra pads/CUE as in the djay app.
            </li>
          </ul>
          <p>
            {guide.quantize} Tutorial:{" "}
            <Link to="/tutorials/quantize-snap">Quantize: tap vs hold</Link>. If kicks still walk
            after the numbers match:{" "}
            <Link to="/tutorials/mix-beat-grid">When the grid is wrong</Link>. Lab:{" "}
            <Link to="/labs/hot-cue">Hot cues</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Where the on/off switch is</h2>
          <ul>
            <li>
              <strong>Mac:</strong> Tools bar or Tools panel (cue/loop strip at the top). The{" "}
              <strong>Q</strong> switch turns snap on; the dropdown next to it is the snap size.
            </li>
            <li>
              <strong>iPhone / iPad:</strong> Tools → Cue points. Look for a circled{" "}
              <strong>Q</strong> (often near Sync — easy to miss). Toggle, then pick the snap value.
            </li>
          </ul>
          <p>
            If you want “start of a beat,” set the value to <strong>1 beat</strong>, not 1/4 or
            those finer values still snap to the grid, but not necessarily to beat 1.
          </p>
          <p>
            Mac’s <strong>Q</strong> key is “jump to start CUE,” not this switch.{" "}
            <Link to="/settings">djay settings</Link> if you want a shortcut or MIDI map.
          </p>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>A dedicated toggle (optional)</h2>
          <p>Most people never need this if tap-vs-hold is working. Two ways if you do:</p>
          <ol>
            <li>
              <strong>Mac keyboard:</strong> djay Pro → Settings → Shortcuts → New Shortcut Set (or
              Edit). Find Quantize and assign something that isn’t already Q — e.g.{" "}
              <strong>⌥⌘Q</strong>.
            </li>
            <li>
              <strong>MIDI on Mix Ultra:</strong> Settings → MIDI devices → DJCONTROL MIX ULTRA →
              add/edit mapping → MIDI Learn a combo Hercules doesn’t already use (try{" "}
              <strong>SHIFT + LOAD</strong> or <strong>SHIFT + SYNC</strong>, then confirm you
              didn’t steal erase-pad or Pitch Play). Target the deck or General → Quantize. Save.
            </li>
          </ol>
          <p>
            Mapping is for when you want Quantize <em>on</em> for a whole run of drop jumps, then
            off for vocal work.
          </p>
        </section>

        <section className="info-block">
          <h2>When snapping fights you</h2>
          <ul>
            <li>
              Grid is wrong (live intro, rubato, talking) — Quantize parks the cue on a fake beat.
              Fix the grid or plant with Quantize off.
            </li>
            <li>
              First beat of the file — older djay versions could snap <em>past</em> beat 1.
              Workaround: Q off, or sit the playhead a hair after the kick, then hold-to-snap.
            </li>
            <li>
              You wanted beat 1 but Q is set to 1/4 — it looks “almost on” the kick. Change
              snap size to 1 beat.
            </li>
          </ul>
          <p>
            Which spots to mark once they snap: <Link to="/djing/cueing">Which cues to set</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
