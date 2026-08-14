import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

export function PreCuePage() {
  return (
    <>
      <PageHeader
        eyebrow="Gear · audio"
        title="Pre-cueing"
        description="Hear the next song in your headphones while the room keeps dancing to the current one. This page is the idea; the tutorials are the hands-on drills."
        actions={
          <Link to="/gear" className="text-back">
            Gear
          </Link>
        }
      />

      <div className="intro-grid">
        <div className="callout accent">
          <h2>The job in one sentence</h2>
          <p>
            Line up Deck 2 (tempo, cue point, EQ) in <strong>your ears</strong> before anyone else
            hears it. Then fade it in on purpose.
          </p>
        </div>
        <div className="callout warn">
          <h2>Play is not “headphones only”</h2>
          <p>
            Pressing Play starts the track. Whether the <em>room</em> hears it is the channel fader
            and crossfader. Headphones are a separate listen path (PFL — pre-fader listen).
          </p>
        </div>
      </div>

      <div className="info-stack">
        <section className="info-block">
          <h2>Two paths of sound</h2>
          <p>
            Think of djay as sending audio down two pipes. They are independent. Mixing them up is
            why cue “doesn’t work.”
          </p>
          <ul>
            <li>
              <strong>Main / master</strong> — the mix. Speakers, a Bluetooth speaker, a booth.
              Controlled by channel faders, crossfader, and MASTER. Guests hear this.
            </li>
            <li>
              <strong>Pre-cue</strong> — your DJ headphones (or the green half of the splitter).
              Controlled by the two <strong>headphone / monitor</strong> buttons on the Mix Ultra.
              Silent when both buttons are dark.
            </li>
          </ul>
          <p>
            The Mix Ultra is not a sound card. It only presses those cue buttons (and the rest of
            MIDI). djay on the phone or Mac is what actually routes audio.
          </p>
        </section>

        <section className="info-block">
          <h2>The two headphone buttons</h2>
          <p>They do not pick “AirPods vs speakers.” The audio dropdowns already did that.</p>
          <ul>
            <li>
              <strong>Lit</strong> — that deck is sent to pre-cue (your cans).
            </li>
            <li>
              <strong>Dark</strong> — that deck is not in headphones.
            </li>
            <li>
              <strong>Both lit</strong> — both decks in your ears, to check they’re lined up.
            </li>
            <li>
              <strong>Both dark</strong> — cue device stays quiet. The room still plays.
            </li>
          </ul>
          <p>
            Cue the <strong>incoming</strong> deck — the one that is not filling the room yet. If
            Deck 1 is live, light <strong>only Deck 2</strong>.
          </p>
        </section>

        <section className="info-block">
          <h2>Keep the incoming track out of the room</h2>
          <p>
            You can Play Deck 2 all day with the room still on Deck 1, if Deck 2 can’t reach master:
          </p>
          <ol>
            <li>Crossfader all the way toward the live deck (left if Deck 1 is live).</li>
            <li>Incoming <strong>channel fader down</strong> (belt and suspenders).</li>
            <li>Light only the incoming deck’s headphone button.</li>
            <li>Play, scrub, set CUE, SYNC, EQ — all in cans.</li>
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
              tighter. Drill:{" "}
              <Link to="/tutorials/pre-cue-mac">Mac: speakers + headphones</Link>.
            </li>
            <li>
              <strong>One analog jack + Hercules Y-cable:</strong> Main = that headphone/output.
              Pre-Cueing = <strong>Split Output</strong>. Green = your cans (cue). Black = speakers
              (live). Works on phone or Mac. Drill:{" "}
              <Link to="/tutorials/pre-cue-split">Test the splitter</Link>.
            </li>
            <li>
              <strong>iPhone / iPad without a splitter:</strong> one Bluetooth stream. Cue buttons
              won’t send AirPods one song and a speaker another. Practice with the incoming fader
              down, or get the cable.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>What “Split Output” actually is</h2>
          <p>
            It is not a second Bluetooth device. It means: take <em>one</em> stereo jack and put the
            mix on one side of the Y-cable and cue on the other.
          </p>
          <ul>
            <li>
              <strong>Green</strong> → headphones (cue)
            </li>
            <li>
              <strong>Black</strong> → speakers (master)
            </li>
          </ul>
          <p>
            If Main is Bluetooth headphones and Pre-Cueing is Split Output, you usually get mix in
            one ear and cue in the other of <em>the same</em> cans — not a booth. For a real room vs
            DJ split: wired jack + Y-cable, or (Mac) two separate devices without Split Output.
          </p>
        </section>

        <section className="info-block">
          <h2>djay Audio panel (Mac)</h2>
          <p>
            Mixer Mode: <strong>Internal</strong>. Mix Ultra is MIDI, not a hardware mixer.
          </p>
          <ul>
            <li>
              <strong>Main Output</strong> — what guests hear.
            </li>
            <li>
              <strong>Pre-Cueing</strong> — your DJ headphones, or Split Output if using the
              Y-cable.
            </li>
            <li>
              <strong>Booth</strong> — extra copy of master. Leave None unless you have a third
              speaker.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Cue lights jumping by themselves</h2>
          <p>
            That’s djay <strong>Auto Select</strong>, not the Mix Ultra guessing. It flips headphone
            cue toward whichever deck isn’t fully in the mix as you move faders.
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
              djay’s <strong>pre-cueing volume</strong> slider — main control for cans vs the mix.
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
        <Link to="/gear">Gear</Link>.
      </p>
    </>
  );
}
