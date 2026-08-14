import { Link } from "react-router-dom";
import { CueLab } from "../components/CueLab";
import { HotCueLab } from "../components/HotCueLab";
import { FilterLab } from "../components/FilterLab";
import { NeuralMixGuide, PadModes } from "../components/PadModes";
import { NeuralMixPadsLab } from "../components/NeuralMixPadsLab";
import { RelatedExtras } from "../components/RelatedExtras";
import { PageHeader } from "./HomePage";

export function CueLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="The CUE button"
        description="Pause → scrub → CUE to plant. Play → CUE to snap back and stop."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <CueLab />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/first-session",
            label: "Tutorial: First session",
            blurb: "Pair Mix Ultra, play one song in the room",
          },
          {
            to: "/tutorials/cue-home",
            label: "Tutorial: Plant your home CUE",
            blurb: "Same ideas on the real Mix Ultra",
          },
          {
            to: "/djing/phrasing",
            label: "Phrases & the One",
            blurb: "Why a home cue on “the One” matters",
          },
          {
            to: "/djing/cueing",
            label: "Which cues to set",
            blurb: "Mix-in, drop, vocal, mix-out",
          },
        ]}
      />
    </>
  );
}

export function HotCueLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Hot cues"
        description="Press HOT CUE on the controller first. Empty pad = set. Lit pad = jump + play. SHIFT + pad = erase."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <HotCueLab />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/hot-cues",
            label: "Tutorial: Hot cues jump map",
            blurb: "Build intro / drop / breakdown pads",
          },
          {
            to: "/tutorials/quantize-snap",
            label: "Tutorial: Quantize tap vs hold",
            blurb: "Snap to the beat without hunting djay’s Q switch",
          },
          {
            to: "/tutorials/mix-beat-grid",
            label: "Tutorial: When the grid is wrong",
            blurb: "Numbers match, kicks still walk — tap/adjust in djay, don’t press SYNC",
          },
          {
            to: "/djing/remix",
            label: "Remix one song",
            blurb: "Why those jump points matter on one song",
          },
          {
            to: "/djing/cueing",
            label: "Which cues to set",
            blurb: "Mix-in / mix-out maps vs remix jump maps",
          },
        ]}
      />
    </>
  );
}

export function FilterLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Filter"
        description="Left muffles (low-pass). Right thins (high-pass). Center is open. Different from High/Mid/Low EQ."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <FilterLab />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/filter-sweep",
            label: "Tutorial: Filter sweep",
            blurb: "Feel left vs right on one deck",
          },
          {
            to: "/tutorials/remix-filter-own-drop",
            label: "Remix: Filter-open your own drop",
            blurb: "Same gesture, no second track",
          },
          {
            to: "/tutorials/adv-filter-open",
            label: "Advanced: Filter-open into a drop",
            blurb: "Song-style transition recipe",
          },
          {
            to: "/djing/filter",
            label: "Filter as a performance tool",
            blurb: "One-song: close the breakdown, open your drop",
          },
          {
            to: "/djing/eq",
            label: "EQ, Filter, HIGH / MID / LOW",
            blurb: "What the knobs change in the song — not just the lab",
          },
        ]}
      />
    </>
  );
}

export function NeuralLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="HIGH / MID / LOW"
        description="Center N button: HIGH/MID/LOW become stem volumes. Different from Neural Mix pad mode."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <NeuralMixGuide />
      <RelatedExtras
        links={[
          {
            to: "/labs/neural-pads",
            label: "Neural Mix pads & lights",
            blurb: "Top solo / bottom mute — what lit vs dark means (extra lab)",
          },
          {
            to: "/tutorials/eq-vs-neural",
            label: "Tutorial: EQ vs Neural Mix knobs",
            blurb: "Do it on the hardware",
          },
          {
            to: "/tutorials/mix-gain",
            label: "Tutorial: Gain (loudness, not EQ)",
            blurb: "SHIFT+HIGH — don’t clip the bedroom",
          },
          {
            to: "/djing/neural",
            label: "Neural Mix (remix)",
            blurb: "Mute vocals for a phrase on one song",
          },
          {
            to: "/djing/eq",
            label: "EQ, Filter, HIGH / MID / LOW",
            blurb: "What the three knobs mean, and the Neural Mix trap",
          },
        ]}
      />
    </>
  );
}

export function NeuralPadsLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Neural Mix pads"
        description="Top = solo, bottom = mute; lit = action ON. Deep dive when pad LEDs feel backwards."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <NeuralMixPadsLab />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/neural-pad-lights",
            label: "Tutorial: read the lights",
            blurb: "Step through solo/mute on the controller",
          },
          {
            to: "/tutorials/remix-flare-kit",
            label: "Remix: mute vocals for a phrase",
            blurb: "One-song flare, then all-dark",
          },
          {
            to: "/tutorials/adv-vocal-swap",
            label: "Advanced: vocal swap mashup",
            blurb: "Use mutes in a real transition",
          },
          {
            to: "/labs/neural",
            label: "HIGH / MID / LOW",
            blurb: "Center N button / stem volumes",
          },
          {
            to: "/djing/neural",
            label: "Neural Mix (remix)",
            blurb: "One-song mute as a performance trick",
          },
        ]}
      />
    </>
  );
}

export function PadsLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Pad modes"
        description="All 8 modes: how to enter, what each pad does, TAP vs HOLD, how to leave."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <PadModes />
      <RelatedExtras
        links={[
          {
            to: "/labs/neural-pads",
            label: "Neural Mix pads & lights",
            blurb: "Extra simulator for the confusing LED behavior",
          },
          {
            to: "/tutorials/loop-from-cue",
            label: "Tutorial: Loop from a cue",
            blurb: "Arm the loop paused so it starts on the pad, not late",
          },
          {
            to: "/djing/looping",
            label: "Looping",
            blurb: "Why Play-then-LOOP starts late",
          },
          {
            to: "/tutorials/remix-flare-kit",
            label: "Tutorial: a small flare kit",
            blurb: "Echo, vocal mute, optional chop — one song",
          },
          {
            to: "/djing/pads-fx",
            label: "Pads / FX",
            blurb: "Stutter, slicer, echo, backspin, noise",
          },
          {
            to: "/djing/remix",
            label: "Remix one song",
            blurb: "One-song jumps and decorations",
          },
        ]}
      />
    </>
  );
}

export function CheatSheetPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mix Ultra"
        title="Cheat sheet"
        description="What each Mix Ultra control does in djay."
        actions={
          <Link to="/labs" className="text-back">
            Labs
          </Link>
        }
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Control</th>
              <th>Does</th>
              <th>Remember</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Play / Pause</td>
              <td>Start or stop the deck</td>
              <td>Solid = playing · blinking = paused (on beat)</td>
            </tr>
            <tr>
              <td>CUE</td>
              <td>Set or return to one main cue</td>
              <td>Paused sets · playing returns &amp; stops</td>
            </tr>
            <tr>
              <td>SHIFT + CUE</td>
              <td>Play from track start</td>
              <td>Different from returning to the cue point</td>
            </tr>
            <tr>
              <td>Hot Cue pads</td>
              <td>Up to 8 jump points</td>
              <td>Press = play from there · SHIFT+pad = erase · remix map: intro / verse / drop / breakdown</td>
            </tr>
            <tr>
              <td>CUE / hot cue hold</td>
              <td>While setting: hold snaps to the beatgrid even if Quantize is off</td>
              <td>Quick tap = exact playhead. Mix Ultra has no Quantize button</td>
            </tr>
            <tr>
              <td>Quantize (djay Q)</td>
              <td>Snaps setting + triggering cues/loops to the grid</td>
              <td>Tools bar / Cue points. Set size to 1 beat if you want the One</td>
            </tr>
            <tr>
              <td>Filter</td>
              <td>Sweep brightness</td>
              <td>Left muffles · right thins · center open</td>
            </tr>
            <tr>
              <td>HIGH / MID / LOW</td>
              <td>3-band EQ</td>
              <td>With center Neural Mix ON → stem volumes instead</td>
            </tr>
            <tr>
              <td>Neural Mix pads</td>
              <td>Solo (top) / mute (bottom)</td>
              <td>Lit = action ON · all dark = full mix · bottom lit = stem cut</td>
            </tr>
            <tr>
              <td>SHIFT + HIGH</td>
              <td>Gain</td>
              <td>Loudness before the channel fader</td>
            </tr>
            <tr>
              <td>Crossfader</td>
              <td>Blend deck 1 ↔ deck 2</td>
              <td>Left = only 1 · right = only 2 · middle = both</td>
            </tr>
            <tr>
              <td>SYNC</td>
              <td>Match BPM (and optionally beats)</td>
              <td>Behavior depends on djay sync settings</td>
            </tr>
            <tr>
              <td>Headphones (PFL)</td>
              <td>Preview a deck in headphones</td>
              <td>Needs splitter cable + “split output” in djay</td>
            </tr>
            <tr>
              <td>Jog wheel</td>
              <td>Nudge, scrub, scratch</td>
              <td>Top vs rim + play vs pause change the feel</td>
            </tr>
            <tr>
              <td>Pitch Play (SHIFT+HOT CUE)</td>
              <td>Replay a hot cue at ± pitch</td>
              <td>Pad 1 = original pitch (stay in the mode). Tempo fader = speed, not this.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <RelatedExtras
        links={[
          { to: "/settings", label: "djay settings", blurb: "What the switches mean + iCloud" },
          { to: "/djing", label: "DJing", blurb: "Phrases, mix-in, cueing, remix" },
          { to: "/labs", label: "Labs", blurb: "Click-around simulators" },
          {
            to: "/labs/neural-pads",
            label: "Neural pads lab",
            blurb: "Extra — LED decoder",
          },
        ]}
      />
      <p className="footer-note">
        Behavior matches the official{" "}
        <a
          href="https://ts.hercules.com/download/sound/manuals/DJC_Mix_Ultra/DJControl_Mix_Ultra_user_manual_EN.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Mix Ultra user manual
        </a>{" "}
        with djay.
      </p>
    </>
  );
}
