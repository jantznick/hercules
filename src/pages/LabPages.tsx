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
        eyebrow="Interactive lab"
        title="The CUE button"
        description="Pause → scrub → CUE to plant. Play → CUE to snap back and stop. Compare with the blinking Play LED."
      />
      <CueLab />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/cue-home",
            label: "Tutorial: Plant your home CUE",
            blurb: "Same ideas on the real Mix Ultra",
          },
          {
            to: "/dj-basics",
            label: "DJ basics",
            blurb: "Why a home cue on “the One” matters",
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
        eyebrow="Interactive lab"
        title="Hot cues"
        description="Press HOT CUE on the controller first. Empty pad = set. Lit pad = jump + play. SHIFT + pad = erase."
      />
      <HotCueLab />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/hot-cues",
            label: "Tutorial: Hot cues jump map",
            blurb: "Build intro / drop / breakdown pads",
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
        eyebrow="Interactive lab"
        title="Filter"
        description="Left muffles (low-pass). Right thins (high-pass). Center is open. Different from High/Mid/Low EQ."
      />
      <FilterLab />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/filter-sweep",
            label: "Tutorial: Filter sweep",
            blurb: "Feel LPF vs HPF on one deck",
          },
          {
            to: "/tutorials/adv-filter-open",
            label: "Advanced: Filter-open into a drop",
            blurb: "Song-style transition recipe",
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
        eyebrow="Interactive lab"
        title="EQ vs Neural Mix knobs"
        description="Center N button: HIGH/MID/LOW become stem volumes. Different from Neural Mix pad mode."
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
        ]}
      />
    </>
  );
}

export function NeuralPadsLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Extra lab"
        title="Neural Mix pads & lights"
        description="Not in the main menu on purpose — it’s a deep dive when pad LEDs feel backwards. Top = solo, bottom = mute; lit = action ON."
        actions={
          <Link to="/labs/pads" className="text-back">
            Back to pad modes
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
            to: "/tutorials/adv-vocal-swap",
            label: "Advanced: vocal swap mashup",
            blurb: "Use mutes in a real transition",
          },
          {
            to: "/labs/neural",
            label: "Neural knobs",
            blurb: "Center N button / stem volumes",
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
        eyebrow="Deep dive"
        title="Pad modes"
        description="All 8 modes: how to enter, configure in djay, why you’d use them, and transition recipes."
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
            to: "/tutorials/pads-transition",
            label: "Tutorial: pads in a simple transition",
            blurb: "Hot Cue + Loop + optional echo",
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
        eyebrow="Reference"
        title="Cheat sheet"
        description="Controls that trip people up on Mix Ultra + djay."
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
              <td>Press = play from there · SHIFT+pad = erase</td>
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
              <td>Preview a deck in cans</td>
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
          { to: "/gear", label: "Gear & setup", blurb: "Charging, pairing, audio" },
          { to: "/dj-basics", label: "DJ basics", blurb: "Phrases, EQ, practice loop" },
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
