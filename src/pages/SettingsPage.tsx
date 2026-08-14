import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

export function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gear · djay"
        title="djay settings"
        description="What the switches actually do, Mix Ultra–relevant defaults, and what does (and does not) follow you between phone and Mac."
        actions={
          <Link to="/gear" className="text-back">
            Gear
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>Where this lives</h2>
        <p>
          <strong>Mac:</strong> djay Pro → Settings, or ⌘,. <strong>iPhone / iPad:</strong> tap the
          djay icon (yellow) → Settings. The Mix Ultra has no settings menu — it only sends MIDI.
          Names move around a little (Mac “Devices / General / Advanced” vs iOS “Sound / MIDI /
          Advanced”), but the jobs are the same.
        </p>
      </div>

      <div className="info-stack">
        <section className="info-block">
          <h2>Do first (Mix Ultra)</h2>
          <p>These are the ones that change whether the deck feels usable.</p>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Setting</th>
                  <th>Where</th>
                  <th>Means</th>
                  <th>Starter</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bluetooth MIDI / MIDI devices</td>
                  <td>iOS: MIDI devices · Mac: MIDI</td>
                  <td>Pair DJCONTROL MIX ULTRA every session. Audio is still from the phone/Mac, not the box.</td>
                  <td>Scan → select the controller. Steady Bluetooth LED = connected.</td>
                </tr>
                <tr>
                  <td>Mixer mode</td>
                  <td>Mac: Devices · iOS: Sound / audio</td>
                  <td>Internal = djay mixes to one stereo out. External = each deck to a hardware mixer (not this controller).</td>
                  <td>Internal. Mix Ultra is not a sound card.</td>
                </tr>
                <tr>
                  <td>Main vs Pre-Cueing</td>
                  <td>Mac: Devices · iOS: audio / Pre-cueing</td>
                  <td>Main = the room. Pre-Cueing = your headphones. Two different devices on a Mac; phone usually needs the green/black splitter + Split Output.</td>
                  <td>
                    See <Link to="/pre-cue">Pre-cue</Link>. Don’t put both on the same Bluetooth gadget.
                  </td>
                </tr>
                <tr>
                  <td>Split Output</td>
                  <td>Pre-cueing / Devices</td>
                  <td>Uses the Hercules Y-cable: green = cue, black = master. Often hidden until the controller is connected.</td>
                  <td>On for phone + splitter. Off if Mac is already sending Main and Pre-Cueing to two devices.</td>
                </tr>
                <tr>
                  <td>Auto Select</td>
                  <td>iOS: Sound → Pre-cueing · Mac: headphone icon or Advanced → Pre-Cueing</td>
                  <td>djay flips which deck is in your headphones when you move the crossfader / faders.</td>
                  <td>
                    <strong>Off</strong> until you like it. Tutorial:{" "}
                    <Link to="/tutorials/pre-cue-auto-select">Tame Auto Select</Link>.
                  </td>
                </tr>
                <tr>
                  <td>Sync type</td>
                  <td>General → Sync mode</td>
                  <td>Tempo = same BPM, you still line up the kicks. Beat sync = BPM + downbeats locked.</td>
                  <td>
                    Beat sync while learning if you use SYNC. Tempo-only if you want to practice
                    nudging. Or skip SYNC:{" "}
                    <Link to="/djing/beatmatch">Match the speed yourself</Link>.
                  </td>
                </tr>
                <tr>
                  <td>Quantize (Q)</td>
                  <td>Tools / Cue points — not a Preferences row</td>
                  <td>Snaps setting and triggering cues/loops to the grid. Mix Ultra has no Q button.</td>
                  <td>
                    Off + hold-to-snap. <Link to="/djing/quantize">Quantize</Link>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="info-block">
          <h2>General — how tracks load and SYNC behaves</h2>
          <h3>Song loading</h3>
          <ul>
            <li>
              <strong>Start playback</strong> — song starts the instant it loads. Off is safer so
              Deck 2 doesn’t blast the room if a fader is up.
            </li>
            <li>
              <strong>Reset EQ, FX, tempo</strong> — new track comes in with knobs “home.” On,
              unless you like leftover filter from the last song.
            </li>
            <li>
              <strong>Reset Neural Mix controls</strong> — stems back to full mix on load. On —
              leftover vocal mutes are a classic trap.
            </li>
            <li>
              <strong>Protect active deck</strong> — won’t replace the track that’s playing. On.
            </li>
            <li>
              <strong>Jump to cue point</strong> — load at file start, Start Cue, or a numbered hot
              cue. Off until you trust your cues; then Start Cue or Cue 1 is a nice “always mix-in.”
            </li>
            <li>
              <strong>Activate loop</strong> — auto-arms a saved loop when the track loads. Off
              unless you prepped loop-in points on purpose.
            </li>
          </ul>
          <h3>Sync mode</h3>
          <ul>
            <li>
              <strong>Beat Sync interval</strong> — lock to 1 beat or 1 bar (4 beats) when beat-sync
              is on.
            </li>
            <li>
              <strong>Resume sync after pause / scratch / cue jump</strong> — SYNC stays on after
              you stop or jump. On is easier; off if you want to drop out of lock when you scratch.
            </li>
            <li>
              <strong>Maintain sync on song load</strong> — new track inherits SYNC. Handy in a set;
              confusing while practicing load mistakes.
            </li>
            <li>
              <strong>Reset tempo when turning sync off</strong> — fader jumps back to 0% / original
              BPM. On, so you don’t leave a track permanently pitched.
            </li>
          </ul>
          <h3>Tempo slider</h3>
          <ul>
            <li>
              <strong>Slider range</strong> — how far the Mix Ultra tempo fader can stretch (±8% up
              through huge ranges). Smaller = finer control; Mix Ultra can be assigned several
              scales in hardware docs (8%–75%).
            </li>
            <li>
              <strong>Invert slider</strong> — vinyl-style reverse. Leave off unless that’s how you
              learned.
            </li>
          </ul>
          <h3>Play / Pause &amp; crossfader FX</h3>
          <ul>
            <li>
              <strong>Start / stop time</strong> — vinyl motor spin-up/down. 0 = instant (normal DJ
              controller). Above 0 for an echo-then-pause exit:{" "}
              <Link to="/tutorials/mix-brake-cut">Echo + brake cut</Link>.
            </li>
            <li>
              <strong>Auto-play when moving crossfader</strong> — paused deck starts when you fade
              toward it. Needs Crossfader FX on; can surprise you.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Sound / mixer (mostly iOS “Sound”)</h2>
          <ul>
            <li>
              <strong>EQ type — Classic vs Isolator</strong> — Classic never fully kills a band.
              Isolator can silence bass completely (the “EQ kill” people mean in tutorials).
              Isolator is the better blend tool.
            </li>
            <li>
              <strong>Neural Mix EQ layout</strong> — HIGH/MID/LOW as Vocals/Instruments/Drums or
              a four-stem split (drums/bass/melodic). Match what you see on the Mix Ultra pads.
            </li>
            <li>
              <strong>Filter resonance</strong> — how “whistle-y” the Filter knob gets. Low = smooth
              party; High = acid/screamy. Medium is fine.
            </li>
            <li>
              <strong>FX routing — Pre vs Post fader</strong> — Post = echo dies as you pull the
              fader (classic echo-out). Pre = effect keeps ringing even with the fader down.
            </li>
            <li>
              <strong>Auto gain</strong> — djay matches loudness on load. On for mixed libraries;
              off if you want SHIFT+HIGH gain to be the whole story.
            </li>
            <li>
              <strong>Save/restore gain</strong> — remembers per-track gain. Useful once you’ve
              trimmed a library.
            </li>
            <li>
              <strong>Unlink controller gain</strong> — hardware gain won’t yank the on-screen
              number (avoids jumps with Auto Gain).
            </li>
            <li>
              <strong>Audio limiter / headroom</strong> — limiter catches clips; headroom turns the
              whole mix down a bit so two tracks have space. If the mix sounds crushed, try more
              headroom rather than slamming MASTER.
            </li>
            <li>
              <strong>Mono output</strong> — same signal both sides. Only for a mono PA.
            </li>
            <li>
              <strong>Crossfader curve</strong> — Default/Linear for blends; Cut for scratch-style
              sharp edges.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Library, key, BPM</h2>
          <ul>
            <li>
              <strong>BPM analysis range</strong> — stops house from being detected at half-time
              (~62) or double (~250). Set a range that matches what you play.
            </li>
            <li>
              <strong>Tempo change detection</strong> — follows songs that speed up. Off for most
              club tracks with a steady grid.
            </li>
            <li>
              <strong>Key format / match</strong> — Camelot/Open Key vs musical names; Exact vs
              Fuzzy (nearby keys). Display only — it doesn’t mix for you.
            </li>
            <li>
              <strong>Remove from Queue when played</strong> — tidy Queue. Preference.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Advanced — cues, loops, Neural Mix</h2>
          <ul>
            <li>
              <strong>Auto-play when triggering cue point</strong> — hot cue starts playback. On
              matches Mix Ultra pads (jump and play). Off is more CDJ “preview.”
            </li>
            <li>
              <strong>Save active loop when setting cue point</strong> — cue recalls a loop. Use
              this to loop <em>from</em> a hot cue without racing the LOOP button. Details:{" "}
              <Link to="/djing/looping#loop-from-cue">loop from a cue</Link>. Off if you don’t want every
              new pad to swallow a loop.
            </li>
            <li>
              <strong>Set Start Cue at loop beginning</strong> — loop in becomes the home CUE.
            </li>
            <li>
              <strong>Deactivate loop when jumping outside</strong> — hot-cueing out of a loop
              exits it. On, so you don’t stay trapped in 4 bars.
            </li>
            <li>
              <strong>Always quantize loops to the beat</strong> — loop in/out snap to the grid.
              On for 101. Separate from the Tools <strong>Q</strong> switch for cues.
            </li>
            <li>
              <strong>Neural Mix quality</strong> — often automatic from device CPU. Lower if the
              phone gets hot or audio glitches.
            </li>
            <li>
              <strong>Recording format</strong> — AAC smaller, WAV nicer. Only if you record sets.
            </li>
          </ul>
          <p>
            Mac also has shortcut sets (Settings → Shortcuts). Default <strong>Q</strong> is jump
            to start CUE, not Quantize. You can assign Quantize to ⌥⌘Q — see{" "}
            <Link to="/djing/quantize">Quantize</Link>.
          </p>
        </section>

        <section className="info-block">
          <h2>Will settings follow my account to another device?</h2>
          <p>
            <strong>Short answer: not the settings.</strong> There is no “djay account” that copies
            Quantize, Auto Select, audio devices, or MIDI maps to your phone. Subscription login
            unlocks the app; it does not roam preferences.
          </p>
          <p>
            What <em>can</em> follow you is <strong>Apple ID + iCloud Drive</strong>, and only for
            some per-song data:
          </p>
          <div className="table-wrap" style={{ margin: "0.75rem 0" }}>
            <table>
              <thead>
                <tr>
                  <th>Follows via iCloud</th>
                  <th>Stays on that device</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Hot cues / cue points and saved loop regions, if the song’s title/artist/duration
                    match
                  </td>
                  <td>
                    App settings (audio, Auto Select, SYNC mode, Q, EQ type, gain, MIDI maps,
                    keyboard shortcuts)
                  </td>
                </tr>
                <tr>
                  <td>Status: djay → Settings → Advanced → iCloud syncing</td>
                  <td>BPM / beatgrid / waveform analysis (each device analyzes again)</td>
                </tr>
                <tr>
                  <td>—</td>
                  <td>Playlists in My Collection (Algoriddim does not iCloud those)</td>
                </tr>
                <tr>
                  <td>Streaming playlists live in Apple Music / TIDAL / etc.</td>
                  <td>Custom MIDI mappings (export .djayMidiMapping if you need a copy)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>Turn iCloud on</h3>
          <ol>
            <li>Same Apple ID on Mac and iPhone/iPad. iCloud Drive enabled.</li>
            <li>
              Mac: System Settings → Apple ID → iCloud → Saved to iCloud → <strong>djay Pro</strong>{" "}
              on. iOS: Settings → your name → iCloud → Saved to iCloud → <strong>djay</strong> on.
            </li>
            <li>Mac App Store build of djay (not a random copy) if Mac cues never appear on phone.</li>
            <li>
              Plant a cue, load a different track (that triggers a sync), then open the same song on
              the other device. Check Advanced → iCloud syncing for last-updated time.
            </li>
          </ol>
          <p>
            Streaming tracks still need the same service logged in. A cue on a TIDAL file will not
            show up on a different Apple Music file of the “same” song.
          </p>
          <h3>Moving a whole Mac library</h3>
          <p>
            That’s a folder copy, not an account: quit djay, copy <code>~/Music/djay/</code> (and
            related Algoriddim support folders if you care about analysis) to the same place on the
            new Mac. Details: Algoriddim’s “where does djay store data” article. iPhone cannot
            receive that dump the same way.
          </p>
        </section>
      </div>

      <p className="footer-note">
        Hardware pairing and the splitter: <Link to="/gear">Gear</Link> ·{" "}
        <Link to="/pre-cue">Pre-cue</Link>. Then <Link to="/controls">The controller</Link> and{" "}
        <Link to="/djing">DJing</Link>.
      </p>
    </>
  );
}
