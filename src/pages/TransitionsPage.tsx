import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { TRANSITION_FLAVOR } from "../djing/transitions";
import { HotCueExplain } from "../components/HotCueExplain";
import { YouTubeEmbed } from "../components/YouTubeEmbed";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function TransitionsPage() {
  const { guide, genre } = useGenre();
  const flavor = TRANSITION_FLAVOR[genre];

  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="Same-speed mixes"
        description="When both songs are the same speed, you have a few ways to switch: a long blend, swapping the bass, skipping their drop, echoing the last word, or a quick cut on the crossfader."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>Same ideas, this controller</h2>
        <p>
          Channel faders are each deck’s volume. The crossfader is the long slider between them. LOW
          is the bass knob (there isn’t a separate “bass EQ”). Echo lives on an FX pad — you hold it.
          Headphones first. Match speed with the tempo fader (or SYNC if you want the shortcut).
          Which sections to overlap:{" "}
          <Link to="/djing/mixing">Mix in / mix out</Link>. The full hand loop:{" "}
          <Link to="/djing/blend">The two-deck blend</Link>. When the next song is a different
          speed: <Link to="/djing/jumps">When speeds don’t match</Link>. Techniques:{" "}
          <Link to="/djing/techniques">Techniques</Link>.
        </p>
      </div>

      <YouTubeEmbed video="blakey5" />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Speeds together, then phrases together</h2>
          <p>
            Both songs need to run at the same speed or the kicks drift. On Mix Ultra, match that
            with the <strong>tempo fader</strong> (and a jog nudge) —{" "}
            <Link to="/djing/beatmatch">Match the speed yourself</Link>.{" "}
            <strong>SYNC</strong> on the incoming deck is the shortcut (the tempo fader is still
            there for tiny tweaks). Matching speed is not the same as starting in the right place.
          </p>
          <p>
            Dance music usually changes every <strong>8 bars</strong>. That’s the same as{" "}
            <strong>32 beats</strong> (4 beats in a bar × 8 bars). A new drum sound, a vocal, or a
            drop almost always arrives on beat 1 after those 32 beats. Start the incoming song on
            that beat 1 so both songs change together. Full counting:{" "}
            <Link to="/djing/phrasing">Phrases & beat 1</Link>.
          </p>
          <p>
            Do not tap the <strong>CUE</strong> button in time while the incoming song is playing —
            on Mix Ultra that usually <em>stops</em> the track and jumps back. Hear the incoming
            song in headphones, then start it with Play or hot cue 1. If the kicks are a little
            off, nudge the jog wheel.
          </p>
          <HotCueExplain compact />
        </section>

        <section className="info-block">
          <h2>Which mix to reach for</h2>
          <p>{flavor.defaultMove}</p>
          <p>
            {genre === "any"
              ? "Pick a style above if you want this list to pick a default for house, hip-hop, pop/kids, or drum & bass."
              : `This page’s examples follow ${guide.name}.`}
          </p>
        </section>
      </div>

      <LevelBand>The mixes</LevelBand>
      <div className="info-stack">
        <section className="info-block" id="long-blend">
          <h2>1. Long blend (channel faders only)</h2>
          <p>
            The incoming song comes up slowly, the outgoing song goes down slowly. No EQ, no Echo,
            no Filter. It sounds simple because it is — and it teaches control. Fast fader moves
            make it obvious you’re mixing. Slow ones make one song turn into the other.
          </p>
          <ol>
            <li>Outgoing song in the room, incoming fader down, incoming in headphones. Speeds matched (tempo fader or SYNC).</li>
            <li>
              On beat 1 of a new 8-bar chunk, start the incoming song (Play or hot cue 1). Raise
              its channel fader gradually.
            </li>
            <li>
              Over many bars, ease the outgoing fader down while the incoming one finishes coming
              up. Leave while the old song still has a kick — not in the last quiet seconds.
            </li>
          </ol>
          <p>{flavor.longBlend}</p>
          <p>
            Tutorial: <Link to="/tutorials/mix-long-blend">Long blend: Saving Up → Turn Off The Lights</Link>
            . Graded practice: <Link to="/labs/transition">Transition grade</Link>.
          </p>
        </section>

        <section className="info-block" id="bass-swap">
          <h2>2. Bass swap (the LOW knobs)</h2>
          <p>
            Same idea as the long blend, but you keep <em>one</em> bassline. Both channel faders can
            be up; only one deck’s LOW knob sits at 12 o’clock. Two full basslines with both faders
            up is how a mix gets muddy, and how a speaker can distort.
          </p>
          <ol>
            <li>
              Incoming LOW turned left (less bass) before that song is heard in the room. Optional:
              Filter a little to the right instead — same idea, one knob.{" "}
              <Link to="/djing/eq">EQ, bass & filter</Link>.
            </li>
            <li>Start the incoming song on beat 1 and raise its fader. Old song still has the bass.</li>
            <li>
              On a later beat 1: old LOW left, incoming LOW back to 12 o’clock, together. Then fade
              the old fader out.
            </li>
          </ol>
          <p>{flavor.bassSwap}</p>
          <p>
            Tutorial: <Link to="/tutorials/mix-bass-swap">Bass swap: Losing It → Ferrari</Link>.
            Graded practice: <Link to="/labs/transition">Transition grade</Link>.
          </p>
        </section>

        <section className="info-block" id="drop-mix">
          <h2>3. Drop mix (don’t let their payoff hit)</h2>
          <p>
            The outgoing song is in a quieter stretch that is building toward a drop or a chorus.
            The room thinks that payoff is coming. You pull the old fader down on beat 1 and start
            the incoming song on <em>its</em> drop or chorus instead. The timing has to be exact —
            if you start two beats late, it feels drunk even when the BPMs match.
          </p>
          <ol>
            <li>
              Mark the new song’s drop or first chorus as hot cue 2 (or hot cue 1 on pop files
              where the chorus is the mix-in).{" "}
              <Link to="/djing/cueing">Which cues to set</Link>.
            </li>
            <li>
              Old song playing in the room, in the breakdown / build / last bars before the
              chorus. Incoming ready in headphones, fader down.
            </li>
            <li>
              On beat 1 — the moment the old payoff would have hit — old fader down, hit the new
              drop/chorus, incoming fader up. You skipped their climax and landed yours.
            </li>
          </ol>
          <p>{flavor.dropMix}</p>
          <p>
            Tutorial: <Link to="/tutorials/mix-drop-mix">Drop mix: skip their payoff, land yours</Link>.
          </p>
        </section>

        <section className="info-block" id="echo-out">
          <h2>4. Echo-out</h2>
          <p>
            You add Echo to the outgoing song, pull its fader down, and the echo keeps repeating
            for a moment so the ending has a tail. Then you start the next song. This is the most
            common “I need a clean exit” move. It still works if the next song is a little faster
            or slower — you are not blending two kicks for a minute.
          </p>
          <ol>
            <li>
              In djay, open the FX panel and put <strong>Echo</strong> on one slot (remember which
              pad — often FX pad 1). Mix Ultra does not print “Echo” on the hardware.
            </li>
            <li>
              Sound settings: <strong>FX routing = Post fader</strong> so the echo dies as you pull
              the fader. Pre fader keeps ringing with the fader down.{" "}
              <Link to="/settings">djay settings</Link>.
            </li>
            <li>
              A one-beat echo is a longer tail (often cleaner for a handoff). A half-beat echo is
              shorter and snappier. Set that in djay’s FX panel, not on the Mix Ultra.
            </li>
            <li>
              Press <strong>FX</strong> so that mode is on. At the end of the line or phrase: hold
              the Echo pad, pull the outgoing fader down, let go as the tail fades. Start the
              incoming song on beat 1 (hot cue 1).
            </li>
          </ol>
          <p>{flavor.echoOut}</p>
          <p>
            Echo on a word while the same song keeps playing is a remix decoration, not this
            transition. Remix:             <Link to="/djing/remix">Remix one song</Link>. Pad layout:{" "}
            <Link to="/labs/pads">Pad modes</Link>. Tutorial:{" "}
            <Link to="/tutorials/mix-echo-out">Echo-out: Don’t Start Now → Head & Heart</Link>.
          </p>
        </section>

        <section className="info-block" id="crossfader-cut">
          <h2>5. Crossfader cut</h2>
          <p>
            Both songs are already playing a loud part. Both channel faders are up. HIGH / MID /
            LOW at 12 o’clock. The crossfader decides which deck the room hears: all the way to
            one side = that deck only; middle = both. Throwing it from the old side to the new
            side is a hard cut. Chopping it back and forth a few times is a short “both songs as
            one moment.”
          </p>
          <ol>
            <li>Both drops or choruses running, lined up on beat 1, speeds matched.</li>
            <li>Channel faders up. Crossfader on the outgoing side.</li>
            <li>
              On a phrase or even on a beat: throw the crossfader to the incoming side — or chop a
              few times, then park it on the new song.
            </li>
          </ol>
          <p>{flavor.xfaderCut}</p>
          <p>
            djay Sound settings: <strong>Crossfader curve</strong> — Cut is a sharp edge (this
            move); Default/Linear is gentler (long blend). If a paused deck suddenly starts when
            you move the crossfader, that’s <strong>Auto-play when moving crossfader</strong> —{" "}
            <Link to="/settings">djay settings</Link>. Tutorial:{" "}
            <Link to="/tutorials/mix-xfader-cut">Crossfader cut: Ferrari vs Turn Off The Lights</Link>.
            Graded practice: <Link to="/labs/transition">Transition grade</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Don’t collect more moves yet</h2>
          <p>
            Echo-out and the crossfader cut are easy to lean on because they sound “like a DJ.”
            Using only those two for a whole night gets dull. Get the long blend and the bass swap
            clean first. Then drop mix, echo-out, and the crossfader cut are choices, not a
            personality.
          </p>
        </section>

        <section className="info-block">
          <h2>A practice order</h2>
          <ol>
            <li>Long blend until slow fader moves feel normal (same-style songs, similar speed).</li>
            <li>Same pair: add the bass swap. Listen for mud, then for one bass.</li>
            <li>Echo-out a last line, then a new chorus or intro.</li>
            <li>Drop mix: old build, skip their payoff, land yours on beat 1.</li>
            <li>Crossfader cut last, and only for a few bars.</li>
          </ol>
          <p>
            Hands-on, in that order:{" "}
            <Link to="/tutorials/mix-long-blend">Long blend</Link> ·{" "}
            <Link to="/tutorials/mix-bass-swap">Bass swap</Link> ·{" "}
            <Link to="/tutorials/mix-echo-out">Echo-out</Link> ·{" "}
            <Link to="/tutorials/mix-drop-mix">Drop mix</Link> ·{" "}
            <Link to="/tutorials/mix-xfader-cut">Crossfader cut</Link>. Also:{" "}
            <Link to="/tutorials/mix-32-window">32-beat intro over a chorus</Link> ·{" "}
            <Link to="/tutorials/two-deck-blend">First two-deck blend</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>When the next song is a different speed</h2>
          <p>
            These mixes assume both files can share a BPM. If they can’t — a ballad into a banger, 90
            hip-hop into 124 house — use a stop, a tempo walk, or a loop-bridge instead of forcing a
            long blend. <Link to="/djing/jumps">When speeds don’t match</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
