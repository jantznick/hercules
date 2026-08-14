import { Link } from "react-router-dom";
import { PageHeader } from "./HomePage";

const GEAR_PAGES = [
  {
    to: "/gear/box",
    title: "The box",
    blurb: "Charge, pair Bluetooth, battery LEDs, and where sound comes from.",
  },
  {
    to: "/pre-cue",
    title: "Headphones",
    blurb: "Hear the next song in your ears while the room keeps the current one.",
  },
  {
    to: "/settings",
    title: "djay settings",
    blurb: "Mix Ultra defaults in djay, and what follows you between phone and Mac.",
  },
];

export function GearPage() {
  return (
    <>
      <PageHeader
        eyebrow="1 · Gear"
        title="Mix Ultra + djay"
        description="This guide is for the Hercules DJControl Mix Ultra with djay Pro AI. Set up the box, headphones, and djay — then mix."
      />

      <div className="home-cards">
        {GEAR_PAGES.map((page) => (
          <Link key={page.to} to={page.to} className="home-card">
            <h3>{page.title}</h3>
            <p>{page.blurb}</p>
          </Link>
        ))}
      </div>

      <p className="footer-note">
        First night on the box: <Link to="/tutorials/first-session">First session</Link>. Button
        names: <Link to="/cheatsheet">Cheat sheet</Link>. Then <Link to="/djing">DJing</Link>.
      </p>
    </>
  );
}

export function GearBoxPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gear · the box"
        title="The Mix Ultra"
        description="Charge the box, pair Bluetooth, and set up speakers vs headphones."
      />

      <div className="info-stack">
        <section className="info-block">
          <h2>Power & charging</h2>
          <ul>
            <li>
              Built-in battery (~1000 mAh). Hercules rates about <strong>up to 10 hours</strong> of
              normal use; LEDs and heavy scratching use more juice.
            </li>
            <li>
              Charge with the included <strong>USB-A → USB-C</strong> cable to a phone charger, USB
              hub, or power bank. Off ≈ faster charge (~30 min–1 h depending on source); on while
              charging is fine but slower.
            </li>
            <li>
              Dead battery? You can still use it <strong>plugged in</strong> while charging.
            </li>
            <li>
              Tip for dual-jog scratching: Hercules notes you may need USB power connected to scratch
              both jog wheels at once.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Battery LED meanings</h2>
          <ul>
            <li>
              <strong>Green</strong> — roughly 50–100%
            </li>
            <li>
              <strong>Orange</strong> — roughly 20–50%
            </li>
            <li>
              <strong>Red</strong> — under ~20%
            </li>
            <li>
              <strong>Flashing red</strong> — nearly empty; plug in soon
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Bluetooth pairing with djay (every session)</h2>
          <ul>
            <li>
              Mix Ultra uses <strong>Bluetooth LE MIDI</strong> paired to the <em>djay app</em>, not
              a permanent system Bluetooth speaker-style pair.
            </li>
            <li>
              Typical flow: power on controller → open djay → Settings → MIDI / Bluetooth MIDI →
              scan → select <strong>DJCONTROL MIX ULTRA</strong>.
            </li>
            <li>
              If you close djay or the phone sleeps hard, you’ll usually need to{" "}
              <strong>pair again</strong> next time. That’s expected.
            </li>
            <li>
              Bluetooth LED on the unit: steady = connected, flashing = not connected.
            </li>
            <li>
              You can still use a Bluetooth speaker for <em>audio</em> at the same time — that’s a
              different Bluetooth layer than the controller’s LE MIDI.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Where the sound comes from</h2>
          <ul>
            <li>
              The Mix Ultra is <strong>not a sound card</strong>. Audio always plays from the
              phone/tablet (built-in speaker, wired out, Bluetooth speaker, or AirPlay).
            </li>
            <li>
              <strong>Lowest latency:</strong> phone speaker or wired output. Bluetooth/AirPlay
              speakers add delay — fine for parties, harder for tight scratching.
            </li>
            <li>
              <strong>Headphones + speakers together:</strong> on a <strong>Mac</strong>, djay can
              send Main to speakers and Pre-Cueing to headphones (two devices). On a{" "}
              <strong>phone</strong>, use the included splitter (green = headphones, black = speakers) and
              Split Output. Explainer: <Link to="/pre-cue">Pre-cueing</Link>.
            </li>
            <li>
              Two Bluetooth devices on iPhone/iPad share one mix — they won’t split cue vs room.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Cover & how to sit</h2>
          <ul>
            <li>
              Cover protects the unit and flips into a <strong>phone stand</strong>.
            </li>
            <li>
              Hercules’ tip: for standing/table mixing, put phone flat and controller on the table
              out of the cover. Use the cradle setup more for couch / lap / travel tray.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Phone hygiene for long sessions</h2>
          <ul>
            <li>
              Turn <strong>Auto-Lock / screen timeout</strong> to Never (or longer than your
              longest track) while practicing — sleep can drop the MIDI pair.
            </li>
            <li>Keep djay in the foreground when possible.</li>
            <li>
              This controller is for <strong>phones/tablets + djay</strong>, not Serato/Rekordbox
              on a laptop. USB to a computer is mainly charge/diagnostics.
            </li>
          </ul>
        </section>

        <section className="info-block">
          <h2>Travel & care</h2>
          <ul>
            <li>
              Battery is small enough for typical airline rules (cabin or hold is generally fine at
              this capacity — still follow current airline guidance).
            </li>
            <li>Not water/dust proof — cover on when you’re done.</li>
            <li>Faders are among the replaceable wear parts if yours get scratchy years later.</li>
          </ul>
        </section>
      </div>

      <p className="footer-note">
        First night on the box: <Link to="/tutorials/first-session">First session</Link>. Button
        names: <Link to="/cheatsheet">Cheat sheet</Link>. Then <Link to="/djing">DJing</Link>.
        Official{" "}
        <a
          href="https://ts.hercules.com/download/sound/manuals/DJC_Mix_Ultra/DJControl_Mix_Ultra_user_manual_EN.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Mix Ultra manual
        </a>
        .
      </p>
    </>
  );
}
