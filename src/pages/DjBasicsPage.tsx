import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

export function DjBasicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="DJing 101"
        title="How mixing actually works"
        description="Independent of any one button: beats, phrases, EQ, and what “a good transition” is trying to do. Pair this with the labs and tutorials."
      />

      <div className="info-stack">
        <section className="info-block">
          <h2>BPM & tempo</h2>
          <p>
            <strong>BPM</strong> (beats per minute) is how fast the song is. Matching BPM (with SYNC
            or the tempo fader) keeps kicks from drifting apart. Close BPMs are easier; huge jumps
            (80 → 140) are advanced or “crash” mixes on purpose.
          </p>
          <ul>
            <li>Hip-hop / R&B often ~80–100</li>
            <li>House / techno often ~120–130</li>
            <li>Drum & bass much faster (~160–175)</li>
          </ul>
          <p>
            On Mix Ultra: <strong>SYNC</strong> helps; the <strong>tempo fader</strong> fine-tunes.
            Center click on the fader = original speed.
          </p>
        </section>

        <section className="info-block">
          <h2>Bars, phrases, and “the One”</h2>
          <p>
            Most dance music is in <strong>4/4</strong>: count 1–2–3–4, repeat. A{" "}
            <strong>bar</strong> is those four beats. DJs think in <strong>phrases</strong> of 8, 16,
            or 32 bars — places where the song “breathes” (intro → verse → drop → breakdown).
          </p>
          <p>
            <strong>“The One”</strong> is beat 1 of a bar/phrase — where you’d usually start the
            incoming track so both songs’ structures line up. Hot cues and the main CUE are tools to
            hit that One without scrubbing under pressure.
          </p>
        </section>

        <section className="info-block">
          <h2>Two decks, one story</h2>
          <p>
            <strong>Outgoing</strong> = what’s in the room now. <strong>Incoming</strong> = what
            you’re bringing in (often in headphones first). Your job is a handoff that feels
            intentional: energy up, energy down, or a smooth same-energy blend.
          </p>
          <ul>
            <li>
              <strong>Channel faders</strong> — volume of each deck
            </li>
            <li>
              <strong>Crossfader</strong> — blends left deck ↔ right deck
            </li>
            <li>
              <strong>EQ / Filter</strong> — carve space so two basslines don’t fight
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>EQ mixing (the real beginner skill)</h2>
          <p>
            Two full basslines at once usually sound muddy. Classic move: turn{" "}
            <strong>LOW down on the incoming</strong> track as it enters, keep outgoing bass for a
            bit, then swap — kill outgoing lows as you restore incoming lows. Mids/highs can overlap
            more. Filter is the dramatic cousin of EQ (muffle or thin a whole deck at once).
          </p>
          <p>
            Practice: <Link to="/labs/filter">Filter lab</Link> · tutorial{" "}
            <Link to="/tutorials/two-deck-blend">First two-deck blend</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Headphones (pre-cue)</h2>
          <p>
            Pros line up the next track in headphones while the room hears only the master. Play
            starts the song; faders decide if the room hears it; the two headphone buttons decide if
            you hear it in cue. Full explainer: <Link to="/pre-cue">Pre-cueing</Link>.
            Start with <Link to="/tutorials/pre-cue-hear-first">Hear it first</Link> (no splitter
            required if you’re on a Mac with two audio devices).
          </p>
        </section>

        <section className="info-block">
          <h2>What “good” sounds like at 101</h2>
          <ul>
            <li>Beats stay together (or you recover quickly)</li>
            <li>You enter on a phrase, not mid-word by accident</li>
            <li>Bass isn’t a war zone</li>
            <li>You can still hear the vocal/hook you care about</li>
            <li>You leave controls centered when you’re done with a trick</li>
          </ul>
          <p>
            Fancy pads are seasoning. Timing + EQ + confidence on Cue/Hot Cue matter more.
          </p>
        </section>

        <section className="info-block">
          <h2>A simple practice loop (30 minutes)</h2>
          <ol>
            <li>
              5 min — <Link to="/labs/cue">Cue lab</Link> + set a real cue on Deck 1
            </li>
            <li>
              5 min — Hot cues on a drop (<Link to="/labs/hot-cue">lab</Link>)
            </li>
            <li>10 min — same-genre two-track blend with lows swapped</li>
            <li>5 min — one echo-out or filter open (not both)</li>
            <li>5 min — free play, then reset every knob/fader to center</li>
          </ol>
        </section>
      </div>

      <p className="footer-note">
        Ready for hardware steps? Start <Link to="/tutorials/cue-home">Plant your home CUE</Link>{" "}
        or browse all <Link to="/tutorials">Tutorials</Link>.
      </p>
    </>
  );
}
