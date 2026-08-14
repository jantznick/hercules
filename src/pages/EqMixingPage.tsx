import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function EqMixingPage() {
  const { guide } = useGenre();

  return (
    <>
      <PageHeader
        eyebrow="DJing · Basics"
        title="EQ, Filter, HIGH / MID / LOW"
        description="What those three knobs actually change in the song, how Filter is different, and the Mix Ultra trap: the same knobs become stem volumes when Neural Mix is on."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Where they are on Mix Ultra</h2>
          <p>
            Each deck has its own <strong>HIGH</strong>, <strong>MID</strong>, and <strong>LOW</strong>{" "}
            knobs, plus a <strong>Filter</strong> knob. They sit in the mixer in the middle of the
            controller. 12 o’clock (straight up — often a little click) is “leave the song alone.”
            Turn left = less of that. Turn right = more of that.
          </p>
          <p>
            They only change <em>that deck</em>. Turning Deck 2’s LOW does nothing to Deck 1.
          </p>
        </section>

        <section className="info-block">
          <h2>What HIGH, MID, and LOW are</h2>
          <p>
            A song is a pile of pitches stacked together: rumble at the bottom, voices in the
            middle, sparkle on top. Each knob turns one slice of that pile up or down — not the
            whole volume (that’s the channel fader). Which layers are even <em>on</em> in a section
            (kick vs vocal vs riff): <Link to="/djing/songs">How songs are built</Link>.
          </p>
          <div className="eq-bands" aria-hidden="true">
            <div className="eq-band">
              <span className="eq-band-name">LOW</span>
              <span className="eq-band-feel">Thump / weight</span>
              <p>Kick drum punch, bass guitar, 808s, the rumble you feel in the chest.</p>
            </div>
            <div className="eq-band">
              <span className="eq-band-name">MID</span>
              <span className="eq-band-feel">Body / voices</span>
              <p>Most singing, rap, guitars, synths, snare “crack.” This is where the song lives.</p>
            </div>
            <div className="eq-band">
              <span className="eq-band-name">HIGH</span>
              <span className="eq-band-feel">Air / sparkle</span>
              <p>Hi-hats, cymbals, “sss” in vocals, brightness. Kill HIGH and it sounds muffled.</p>
            </div>
          </div>
          <ul>
            <li>
              <strong>LOW all the way left</strong> — the beat loses weight. Useful so two kicks
              don’t fight. The song can still be heard (hats, vocal).
            </li>
            <li>
              <strong>MID all the way left</strong> — voices and melody get thin or disappear. Easy
              way to accidentally mute the thing people came to hear.
            </li>
            <li>
              <strong>HIGH all the way left</strong> — dull, like a blanket. Sometimes used to make
              the old song feel like it’s leaving.
            </li>
            <li>
              <strong>All three at 12 o’clock</strong> — reset. Do this when you’re done with a mix,
              or the next song inherits a scooped bass by accident.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Why “one bassline at a time”</h2>
          <p>
            Low sounds take most of the speaker’s energy. Two kicks and two basses at once don’t
            get twice as loud — they get muddy, and the whole mix can feel quieter and messier.
            That’s why the usual move is: new song comes in with its LOW turned down (or Filter a
            little to the right). Old song keeps the thump. On beat 1 of a chunk, trade: old LOW
            down, new LOW up together. Then fade the rest of the old song.
          </p>
          <p>{guide.eq}</p>
        </section>

        <section className="info-block">
          <h2>Filter — one knob, whole song</h2>
          <p>
            Filter is not a fourth EQ band. It’s one control that sweeps brightness of the{" "}
            <em>entire</em> track.
          </p>
          <ul>
            <li>
              <strong>12 o’clock</strong> — off. Full song.
            </li>
            <li>
              <strong>Left of 12</strong> — keeps the bass, removes sparkle. Sounds muffled, like a
              pillow over the speaker. DJs use this to bury a song that’s leaving, or to build
              tension in a quiet section.
            </li>
            <li>
              <strong>Right of 12</strong> — keeps hats and air, removes bass. Sounds thin / tinny.
              DJs use this to bring a new song in without its kick fighting the old one.
            </li>
          </ul>
          <p>
            Filter is faster and more dramatic than twisting three EQ knobs. EQ is more precise
            (kill only bass, keep the vocal). You can use both: LOW left <em>and</em> Filter a
            little right on the incoming deck.
          </p>
          <p>
            Always park Filter at 12 o’clock when you’re done. Easy to leave it half-cut and wonder
            why the next song sounds wrong.
          </p>
          <p>
            Feel it: <Link to="/labs/filter">Filter lab</Link> (the curve moves as you drag).
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>The Mix Ultra trap: Neural Mix uses the same knobs</h2>
          <p>
            The round <strong>N</strong> button in the middle of the mixer (Neural Mix) does{" "}
            <em>not</em> add a fourth EQ. When it’s on, HIGH / MID / LOW stop being treble / mids /
            bass. They become <strong>volumes for parts of the song</strong> (stems):
          </p>
          <ul>
            <li>
              <strong>HIGH</strong> → usually <strong>Vocals</strong> (you can swap the layout in{" "}
              <Link to="/settings">djay settings</Link> — “Neural Mix EQ layout”)
            </li>
            <li>
              <strong>MID</strong> → usually instruments / melody
            </li>
            <li>
              <strong>LOW</strong> → usually drums
            </li>
          </ul>
          <p>
            So if Neural Mix is on and you turn LOW left thinking you’re scooping bass, you may be{" "}
            <strong>muting the drums</strong> instead. The light on the N button is the tell. Off =
            EQ. On = stem volumes.
          </p>
          <p>
            Neural Mix <em>pads</em> (top = solo, bottom = mute) are a different control — same
            idea, buttons instead of knobs. Lab: <Link to="/labs/neural">EQ vs Neural Mix knobs</Link>
            .
          </p>
        </section>

        <section className="info-block">
          <h2>GAIN is not EQ</h2>
          <p>
            <strong>SHIFT + HIGH</strong> is Gain — overall loudness of that deck{" "}
            <em>before</em> the channel fader. Use it if one song is recorded quieter than the
            other. It is not HIGH EQ. Don’t turn Gain up to “win” a bass fight; you’ll distort.
            Match loudness roughly, then use LOW / Filter to carve.
          </p>
        </section>

        <section className="info-block">
          <h2>Isolator vs Classic (a djay setting)</h2>
          <p>
            djay Sound settings: EQ type. <strong>Classic</strong> never fully silences a band —
            LOW all the way left still leaks a little bass. <strong>Isolator</strong> can kill a
            band completely (true “bass off”). Isolator is easier when two songs overlap for more
            than a few seconds. <Link to="/settings">djay settings</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>When to move them</h2>
          <p>{guide.eqWhen}</p>
          <p>A simple two-deck sequence:</p>
          <ol>
            <li>Old song in the room. New song in headphones, fader down.</li>
            <li>
              On the new song: turn LOW a bit left (less bass), or Filter a little to the right (thin). HIGH and MID
              can stay near center so you still hear the vocal/hats.
            </li>
            <li>Start the new song on beat 1, raise its fader. Both playing; old song still has the bass.</li>
            <li>
              On the next beat 1: old LOW left, new LOW up (and Filter back to 12). Then fade the
              old fader out.
            </li>
            <li>Reset every knob on the old deck to 12 o’clock before you load the next track.</li>
          </ol>
          <p>
            Short pop/hip-hop mixes: you may skip the long trade and just cut, or only Filter for a
            few seconds. The whole hand loop (headphones, faders, reset):{" "}
            <Link to="/djing/blend">The two-deck blend</Link>. Which sections to overlap:{" "}
            <Link to="/djing/mixing">Mix in / mix out</Link>.
          </p>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Quick “what did I just do?”</h2>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Control</th>
                  <th>What you hear</th>
                  <th>Typical use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LOW left</td>
                  <td>Less kick / bass</td>
                  <td>New song entering, or old song leaving</td>
                </tr>
                <tr>
                  <td>MID left</td>
                  <td>Less voice / melody</td>
                  <td>Rare for 101 — easy to lose the hook</td>
                </tr>
                <tr>
                  <td>HIGH left</td>
                  <td>Muffled, less hats</td>
                  <td>Make the old song feel like it’s receding</td>
                </tr>
                <tr>
                  <td>Filter left</td>
                  <td>Whole song muffled</td>
                  <td>Build, or bury the outgoing track</td>
                </tr>
                <tr>
                  <td>Filter right</td>
                  <td>Whole song thin, no bass</td>
                  <td>Bring a new song in without a bass fight</td>
                </tr>
                <tr>
                  <td>N button on</td>
                  <td>Knobs are stem volumes, not EQ</td>
                  <td>Mute vocals / isolate drums — different job</td>
                </tr>
                <tr>
                  <td>SHIFT + HIGH</td>
                  <td>Whole deck louder/quieter</td>
                  <td>Match song loudness, not tone</td>
                </tr>
                <tr>
                  <td>Channel fader</td>
                  <td>Deck volume in the mix</td>
                  <td>Whether the room hears it at all</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Hands-on: <Link to="/labs/filter">Filter lab</Link> ·{" "}
            <Link to="/labs/neural">HIGH / MID / LOW lab</Link> ·{" "}
            <Link to="/tutorials/eq-vs-neural">EQ vs Neural Mix tutorial</Link> ·{" "}
            <Link to="/tutorials/two-deck-blend">First two-deck blend</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
