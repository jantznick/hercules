import { Link } from "react-router-dom";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function BeatmatchPage() {
  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="Match the speed yourself"
        description="Leave the SYNC button off. Move the tempo fader until both songs run at the same speed, then nudge the jog wheel so the kicks hit together. Key Lock keeps this song’s notes from going thin and high while you change speed."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>You don’t have to press SYNC</h2>
        <p>
          Same-speed mixes still need both songs at the same speed, or the kicks drift. You can get
          there with <strong>SYNC</strong> on the incoming deck, or you can do it with your hands.
          Learning the hands means you’ll hear when SYNC is lying (a wrong beat grid, a song that
          shouldn’t be stretched). Use SYNC on a gig if you want. Practice without it.
        </p>
        <p>
          The beginner transitions video matches BPM with the tempo slider first, then nudges the
          jog — not a SYNC button. That’s the same idea on Mix Ultra.
        </p>
      </div>

      <YouTubeEmbed video="blakey5" />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block" id="two-jobs">
          <h2>Two jobs, not one button</h2>
          <ol>
            <li>
              <strong>Same speed (BPM)</strong> — beats per minute. The incoming song has to run as
              fast as the one in the room, or they pull apart. That’s the{" "}
              <strong>tempo fader</strong> on that deck (the slider next to the jog). Center is the
              song’s original speed.
            </li>
            <li>
              <strong>Kicks together</strong> — even at the same BPM, one kick can sit a little
              early or late. Nudge the top of the <strong>jog wheel</strong> forward or back until
              the kicks hit as one. Then start the incoming song on beat 1.
            </li>
          </ol>
          <p>
            SYNC can do job 1, and (if djay’s Sync type is Beat sync) job 2 as well. It still
            doesn’t pick a section, set a cue, or move the fader.{" "}
            <Link to="/settings">djay settings</Link> → Sync type. For this page, leave SYNC off.
          </p>
        </section>

        <section className="info-block" id="pitch">
          <h2>There is no pitch SYNC</h2>
          <p>
            You cannot “manually sync pitch” the way you match BPM. Beatmatching is speed.{" "}
            <strong>Key Lock</strong> is a helper for that: it holds this song’s notes still so
            speeding up or slowing down doesn’t make voices go thin and high. It does not line two
            songs’ keys up.
          </p>
          <p>Three different ideas get called pitch. Only one is the tempo fader.</p>
          <ul>
            <li>
              <strong>Speed vs how high the notes sound.</strong> On vinyl, the “pitch fader”{" "}
              <em>is</em> the speed control — faster also meant higher notes. On Mix Ultra the same
              slider is the tempo fader. If <strong>Key Lock</strong> is off (the musical-note
              control in djay), speeding up still makes voices go thin and high. Key Lock on = same
              notes, different speed. That is not matching two songs’ keys. It’s “don’t make this
              one file go thin and high while I change BPM.”
            </li>
            <li>
              <strong>Matching keys</strong> (sometimes called harmonic mixing) — picking songs
              whose musical keys sit well together. djay can show a key on each deck. There is{" "}
              <em>no</em> Mix Ultra button that “SYNC”s keys. You choose the next file, or you
              ignore keys and mix anyway (lots of parties do).
            </li>
            <li>
              <strong>Pitch Play pads</strong> — a remix mode that jumps the key of a loop. That’s
              decoration on one song, not lining two tempos up.{" "}
              <Link to="/labs/pads">Pad modes</Link>.
            </li>
          </ul>
          <p>
            So: match <em>BPM</em> with the tempo fader (practice without SYNC). Turn Key Lock on
            whenever you move that fader, so you’re judging kicks, not chipmunks. Matching keys is a
            later, optional taste choice — picking files — not a SYNC mode.
          </p>
        </section>

        <section className="info-block">
          <h2>On Mix Ultra, in order</h2>
          <ol>
            <li>
              Old song in the room. Incoming channel fader down. Headphones on the incoming deck
              only.
            </li>
            <li>
              Look at both BPM numbers in djay. Move the <em>incoming</em> tempo fader until the
              numbers match (or until it <em>feels</em> the same in your ears — trust ears over the
              last decimal).
            </li>
            <li>
              If the fader can’t reach, widen the tempo range in djay. Mix Ultra has no Pioneer-style
              wide/plus/minus button — it’s a software range.
            </li>
            <li>
              Turn <strong>Key Lock</strong> on first so you’re judging speed, not “did the singer
              get higher.” That is the only pitch job on this page.
            </li>
            <li>
              Start the incoming song in headphones (Play or hot cue 1). Do{" "}
              <em>not</em> tap the CUE button in time while it’s playing — on Mix Ultra that usually
              stops and returns. That’s a Pioneer habit from some videos.
            </li>
            <li>
              If the kicks drift, nudge the incoming jog a little. If they keep drifting, the BPMs
              still don’t match — go back to the tempo fader.
            </li>
            <li>
              When it holds for a few bars in headphones, you’re matched. Now do a long blend or
              bass swap as usual.
            </li>
          </ol>
          <p>
            Center the tempo fader when you’re done with that file (or turn on “Reset EQ, FX, tempo”
            on load). A leftover +4% is how the next song comes in already fast.
          </p>
        </section>

        <section className="info-block" id="beat-grid">
          <h2>When the numbers match but the kicks walk</h2>
          <p>
            djay guesses a <strong>beat grid</strong> so the BPM readout and the Play blink have
            something to follow. If that guess is wrong, the numbers can agree after you move the
            tempo fader while the kicks still drift. That’s a grid problem, not a reason to press
            SYNC.
          </p>
          <ol>
            <li>Leave SYNC off. Match BPM with the incoming tempo fader. Key Lock on so you’re judging speed, not chipmunks.</li>
            <li>Start the incoming song in headphones on a kick. Wait a phrase.</li>
            <li>If kicks walk, nudge the jog. If they keep walking, tap or adjust the grid in djay on that file, then match again.</li>
          </ol>
          <p>
            Tutorial: <Link to="/tutorials/mix-beat-grid">When the grid is wrong</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Practice</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Tutorials</h2>
          <p>
            Match BPM by hand: <Link to="/tutorials/mix-manual-beatmatch">Match BPM by hand</Link>
            . Hear what Key Lock is for:{" "}
            <Link to="/tutorials/mix-key-lock">Tempo vs how high the notes sound</Link>. Grid vs
            numbers: <Link to="/tutorials/mix-beat-grid">When the grid is wrong</Link>. Then a mix
            that uses matching: <Link to="/tutorials/mix-long-blend">Long blend</Link>.
          </p>
          <p>
            Same-speed mix pages still mention SYNC as the fast path. Skip that button and do this
            page’s loop instead. <Link to="/djing/transitions">Same-speed mixes</Link> ·{" "}
            <Link to="/djing/techniques">Techniques</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
