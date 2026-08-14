import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

export function PreCuePage() {
  return (
    <>
      <PageHeader
        eyebrow="Gear · audio"
        title="Headphones"
        description="Hear the next song in your headphones while the room keeps dancing to the current one."
        actions={
          <Link to="/gear" className="text-back">
            Gear
          </Link>
        }
      />

      <div className="intro-grid">
        <div className="callout accent">
          <h2>What’s in the room vs what’s in your ears</h2>
          <p>
            The <strong>room</strong> (speakers, a Bluetooth speaker, a booth) hears the mix: channel
            faders, crossfader, and MASTER. <strong>Your headphones</strong> are a second listen
            path. You can Play the next song, set a cue, and match speed without putting it in the
            room.
          </p>
        </div>
        <div className="callout warn">
          <h2>Play is not “headphones only”</h2>
          <p>
            Pressing Play starts the track. Whether the room hears it is the channel fader and
            crossfader. Headphones are separate (PFL — pre-fader listen). Dark headphone buttons =
            quiet cue; the room still plays.
          </p>
        </div>
      </div>

      <div className="info-stack">
        <section className="info-block">
          <h2>The two headphone buttons (Mix Ultra)</h2>
          <p>
            Each deck has a headphone / monitor button. They do not pick “AirPods vs speakers” —
            djay’s audio settings already did that. They pick <em>which deck</em> you hear in cue.
          </p>
          <ul>
            <li>
              <strong>Lit</strong> — that deck is in your headphones.
            </li>
            <li>
              <strong>Dark</strong> — that deck is not in headphones.
            </li>
            <li>
              <strong>Both lit</strong> — both decks in your ears, to check they’re lined up.
            </li>
            <li>
              <strong>Both dark</strong> — headphones stay quiet. The room still plays.
            </li>
          </ul>
          <p>
            Cue the <strong>incoming</strong> deck — the one that is not filling the room yet. If
            Deck 1 is live, light <strong>only Deck 2</strong>.
          </p>
        </section>

        <section className="info-block">
          <h2>Keep the next song out of the room</h2>
          <ol>
            <li>Park the crossfader all the way toward the live deck (left if Deck 1 is live).</li>
            <li>Pull the incoming <strong>channel fader down</strong>.</li>
            <li>Light only the incoming deck’s headphone button.</li>
            <li>Play, scrub, set a home CUE, match tempo, EQ — all in headphones.</li>
            <li>When you’re ready, raise the fader and/or move the crossfader.</li>
          </ol>
          <p>
            Beginners: do both (fader down + crossfader parked). Then bring the new song in on
            purpose.
          </p>
        </section>

        <section className="info-block">
          <h2>Pick one listening setup</h2>
          <p>Use exactly one of these. Mixing them (Split Output plus a second Bluetooth cue) fights itself.</p>
          <ul>
            <li>
              <strong>Mac, two devices (easiest at home):</strong> Main = speakers. Pre-Cueing =
              AirPods or wired headphones — <em>not</em> Split Output. Live always plays; cue device
              only when a headphone button is lit. AirPods will feel late vs speakers; wired cue is
              tighter. Tutorial:{" "}
              <Link to="/tutorials/pre-cue-mac">Mac: speakers + headphones</Link>.
            </li>
            <li>
              <strong>Splitter (green / black):</strong> if you have the Hercules Y-cable, Main =
              that headphone/output jack. Pre-Cueing = <strong>Split Output</strong>. Green = your
              headphones (cue). Black = speakers (the room). Works on phone or Mac. Tutorial:{" "}
              <Link to="/tutorials/pre-cue-split">Test the splitter</Link>.
            </li>
            <li>
              <strong>iPhone / iPad without a splitter:</strong> one Bluetooth stream. Cue buttons
              won’t send AirPods one song and a speaker another. Practice with the incoming fader
              down, or use the cable.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>djay split output</h2>
          <p>
            Split Output is not a second Bluetooth device. It takes <em>one</em> stereo jack and
            puts the mix on one side of the Y-cable and cue on the other.
          </p>
          <ul>
            <li>
              <strong>Green</strong> → headphones (cue)
            </li>
            <li>
              <strong>Black</strong> → speakers (the room)
            </li>
          </ul>
          <p>
            If Main is Bluetooth headphones and Pre-Cueing is Split Output, you usually get mix in
            one ear and cue in the other of <em>the same</em> headphones — not a booth. For a real
            room vs DJ split: wired jack + Y-cable, or (Mac) two separate devices without Split
            Output.
          </p>
        </section>

        <section className="info-block">
          <h2>djay Audio panel (Mac)</h2>
          <p>
            Mixer Mode: <strong>Internal</strong>. Mix Ultra is MIDI, not a hardware mixer. djay
            on the phone or Mac is what actually routes audio.
          </p>
          <ul>
            <li>
              <strong>Main Output</strong> — what the room hears.
            </li>
            <li>
              <strong>Pre-Cueing</strong> — your headphones, or Split Output if using the Y-cable.
            </li>
            <li>
              <strong>Booth</strong> — extra copy of the mix. Leave None unless you have a third
              speaker.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Cue lights jumping by themselves</h2>
          <p>
            That’s djay <strong>Auto Select</strong>. It flips headphone cue toward whichever deck
            isn’t fully in the mix as you move faders.
          </p>
          <ul>
            <li>
              <strong>Mac:</strong> headphone icon at the top of djay → uncheck Auto Select. Or
              Settings → Advanced → Pre-Cueing → Auto Select off.
            </li>
            <li>
              <strong>iPhone/iPad:</strong> Settings → Sound or Advanced → Pre-Cueing → Auto Select
              off.
            </li>
          </ul>
          <p>
            With it off, the two monitor buttons stay where you leave them. Walkthrough:{" "}
            <Link to="/tutorials/pre-cue-auto-select">Tame Auto Select</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>How loud is cue?</h2>
          <p>Mix Ultra has no dedicated cue-volume knob. Loudness lives in djay and the OS.</p>
          <ul>
            <li>
              djay’s <strong>pre-cueing volume</strong> slider — main control for headphones vs the mix.
            </li>
            <li>
              OS volume of the cue device (AirPods, headphones). Mix Ultra <strong>MASTER</strong> is
              the live mix, not cue.
            </li>
            <li>
              Channel faders do <strong>not</strong> change cue level (that’s the point of PFL).
              GAIN (SHIFT + HIGH) and EQ usually do, because they sit before the fader.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>CUE button vs headphones</h2>
          <p>
            The headphone buttons choose what you <em>hear</em> privately. The <strong>CUE</strong>{" "}
            button next to Play is a home marker on the song (while playing it usually stops and
            returns). Those are different jobs.{" "}
            <Link to="/djing/cueing">Which cues to set</Link> · <Link to="/labs/cue">CUE lab</Link>.
          </p>
        </section>
      </div>

      <p className="footer-note">
        Guided practice:{" "}
        <Link to="/tutorials/pre-cue-hear-first">Hear it first</Link>
        {" · "}
        <Link to="/tutorials/pre-cue-mac">Mac two devices</Link>
        {" · "}
        <Link to="/tutorials/pre-cue-split">Splitter</Link>
        {" · "}
        <Link to="/settings">djay settings</Link>
        {" · "}
        <Link to="/gear/box">The box</Link>.
      </p>
    </>
  );
}
