import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { JUMP_FLAVOR } from "../djing/jumps";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function JumpsPage() {
  const { guide, genre } = useGenre();
  const flavor = JUMP_FLAVOR[genre];

  return (
    <>
      <PageHeader
        eyebrow="DJing · Next"
        title="When speeds don’t match"
        description="How you leave when the next song is a different speed or a different kind of file — plus Filter, a backspin, and noise to hype a build. Short versions are on Named techniques."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>You are allowed to stop the old song</h2>
        <p>
          A smooth 32-bar blend is not the only professional-sounding exit. Stopping on a phrase,
          with Echo, then starting the next song on beat 1, is a real mix. It is often the{" "}
          <em>right</em> mix when the files have no extra drums, or the speeds are far apart.
        </p>
      </div>

      <YouTubeEmbed video="carlo3" />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What this page is for</h2>
          <p>{flavor.intro}</p>
          <p>
            Long blend, bass swap, drop mix, echo-out, crossfader cut:{" "}
            <Link to="/djing/transitions">Same-speed mixes</Link>. Short list of every move:{" "}
            <Link to="/djing/techniques">Named techniques</Link>. Hands:{" "}
            <Link to="/djing/blend">The two-deck blend</Link>.{" "}
            {genre === "any"
              ? "Pick a style above to hear which of these is the usual escape."
              : `Notes below follow ${guide.name}.`}
          </p>
        </section>

        <section className="info-block" id="brake">
          <h2>1. Echo, then a vinyl-style stop</h2>
          <p>
            No beat matching. You decide the last moment of the old song (usually the end of a
            chorus, a breakdown, or a title line). Hold Echo, pause the deck so it spins down, start
            the next song on its chorus or first beat.
          </p>
          <ol>
            <li>
              In djay, set <strong>Start / stop time</strong> above 0 (a fraction of a second to
              about a second). 0 is an instant pause — that’s the usual Mix Ultra default.{" "}
              <Link to="/settings">djay settings</Link>.
            </li>
            <li>
              FX: Echo on a pad, Post fader. Incoming song cued on hot cue 1, fader down,{" "}
              <em>not</em> necessarily SYNC’d.
            </li>
            <li>
              At the last beat 1 you care about: hold Echo, press Pause on the old deck, raise the
              new fader and hit Play or hot cue 1.
            </li>
            <li>Put start/stop time back to 0 when you’re done practicing, or every pause will drag.</li>
          </ol>
          <p>{flavor.brake}</p>
          <p>
            Drill: <Link to="/tutorials/mix-brake-cut">Echo + brake cut</Link>.
          </p>
        </section>

        <section className="info-block" id="stretch">
          <h2>2. Match by hand, then walk the tempo toward the new song</h2>
          <p>
            Both songs play together for a while. Match speed with the tempo fader and jog — leave
            SYNC off. <strong>Key Lock</strong> (the musical-note control in djay) only keeps
            voices from going thin and high while you change speed. It is not a pitch SYNC and it
            does not match two songs’ keys. While they overlap, walk <em>both</em> tempo faders
            toward the new song’s original BPM, nudging the jogs if the kicks drift. Then echo or
            Filter the old song away and let the new one run at its real speed.
          </p>
          <ol>
            <li>
              Key Lock on (holds pitch while you beatmatch). Incoming in headphones, fader down.
              Match the incoming deck by hand.
            </li>
            <li>
              If the tempo fader can’t reach, widen the tempo range in djay (the fader’s % range).
              Mix Ultra doesn’t have a “wide / plus / minus” button like some Pioneer decks — it’s a
              software range.
            </li>
            <li>
              Start the incoming intro or chorus on beat 1. Raise its fader. Slowly walk both
              tempo faders toward the incoming song’s number so the kicks stay together.
            </li>
            <li>Echo or Filter-right the old song, fader down. Let the new song run at its real speed.</li>
          </ol>
          <p>{flavor.stretch}</p>
          <p>
            Drill: <Link to="/tutorials/mix-bpm-stretch">Walk the tempo across a BPM jump</Link>.
          </p>
        </section>

        <section className="info-block" id="loop-bridge">
          <h2>3. Loop the old song so you have time</h2>
          <p>
            The old file is about to run out, or you need a steady bar while the new intro arrives.
            Loop 1 or 4 bars on beat 1, blend the new song over that loop, then echo and Filter the
            loop away. LOOP pads start from the playhead — pause on beat 1 first if you need that
            bar exactly. <Link to="/djing/looping">Looping</Link>.
          </p>
          <p>{flavor.loopBridge}</p>
          <p>
            Drill: <Link to="/tutorials/mix-loop-bridge">Loop-bridge into the next intro</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Hype the build (same song, or during a mix)</h2>
          <p>
            Two Mix Ultra versions of “make the breakdown more exciting before the drop”:
          </p>
          <ul>
            <li>
              <strong>Filter to the right</strong> (thinner, less bass) during the build, back to 12
              o’clock as the drop hits. Same gesture as bringing a new song in.{" "}
              <Link to="/tutorials/remix-filter-own-drop">Filter-open your own drop</Link>.
            </li>
            <li>
              <strong>Echo, then a backspin</strong> — hold Echo, spin the jog wheel backward, let
              go. Without Echo it often just sounds like you bumped the platter.{" "}
              <Link to="/tutorials/remix-backspin-echo">Backspin with Echo</Link>.
            </li>
            <li>
              <strong>Noise / riser on the empty deck</strong> — load a DJ tool, white-noise, or
              riser loop on the deck that isn’t the song, chop its channel fader during the build.
              Or fire a Sampler pad (SHIFT + NEURAL MIX, flashing). Watch volume.{" "}
              <Link to="/tutorials/remix-noise-fader">Noise chops on the empty deck</Link>.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>What this controller does not copy from Pioneer + rekordbox</h2>
          <p>
            Some videos teach a “3/4 roll” pad effect so a 130 BPM house track feels like 174 drum
            & bass (because 130.5 ÷ 0.75 = 174). Mix Ultra has no rekordbox pad-FX Roll. Don’t spend
            a night hunting for that button. Use a brake cut, a song in between, or the loop-bridge
            — then start the 170 track on its drop.
          </p>
        </section>
      </div>
    </>
  );
}
