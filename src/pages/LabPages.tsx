import { Link } from "react-router-dom";
import { BeatmatchHardware, BeatmatchLearn } from "../components/BeatmatchPracticeLab";
import { BlendHardware, BlendLearn } from "../components/BlendPracticeLab";
import { CrossfaderLab } from "../components/CrossfaderLab";
import { CueLab } from "../components/CueLab";
import { EqLab } from "../components/EqLab";
import { FilterLab } from "../components/FilterLab";
import { HardwareCrossfaderLab } from "../components/HardwareCrossfaderLab";
import { HardwareEqLab } from "../components/HardwareEqLab";
import { HardwareFilterLab } from "../components/HardwareFilterLab";
import { HardwareFreePlay } from "../components/HardwareFreePlay";
import { HardwareHotCueLab } from "../components/HardwareHotCueLab";
import { HardwareIncomingCueLab, IncomingCueLearn } from "../components/IncomingCueLab";
import { HardwarePlayCueLab } from "../components/HardwarePlayCueLab";
import { HotCueLab } from "../components/HotCueLab";
import { LabModeShell } from "../components/LabModeShell";
import { MidiMonitor } from "../components/MidiMonitor";
import { NeuralMixGuide, PadModes } from "../components/PadModes";
import { NeuralMixPadsLab } from "../components/NeuralMixPadsLab";
import { RelatedExtras } from "../components/RelatedExtras";
import { PageHeader } from "./HomePage";

const HW_NOTE =
  "Quit djay so it isn’t holding the Mix Ultra. Connect MIDI, then use the box — laptop plays the demo bed.";

export function MidiProbePage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Controller live"
        description="Pair the Mix Ultra over Bluetooth MIDI, then watch every button, fader, and knob show up here."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <MidiMonitor />
      <RelatedExtras
        links={[
          {
            to: "/labs/cue?mode=hardware",
            label: "Play & CUE",
            blurb: "Graded Deck 1 button drill",
          },
          {
            to: "/labs/filter?mode=hardware",
            label: "Filter",
            blurb: "Graded FILTER positions",
          },
          {
            to: "/cheatsheet",
            label: "Cheat sheet",
            blurb: "Button names",
          },
        ]}
      />
    </>
  );
}

export function FreePlayLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Free play"
        description="Full live Mix Ultra mirror with waveforms. Pick a catalog bed or add your own audio file per deck."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <HardwareFreePlay />
      <RelatedExtras
        links={[
          {
            to: "/labs/filter?mode=hardware",
            label: "Filter",
            blurb: "Graded FILTER drill",
          },
          {
            to: "/labs/eq?mode=hardware",
            label: "Bass kill",
            blurb: "Graded LOW EQ drill",
          },
          {
            to: "/tutorials",
            label: "Tutorials",
            blurb: "Same skills later in djay with real songs",
          },
        ]}
      />
    </>
  );
}

export function CueLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="The CUE button"
        description="Pause → scrub → CUE to plant. Play → CUE to snap back and stop. Switch to On hardware for a graded Mix Ultra drill."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <LabModeShell
        hardwareNote={HW_NOTE}
        learn={<CueLab />}
        hardware={<HardwarePlayCueLab />}
      />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/cue-home?mode=drill",
            label: "Tutorial drill: Plant your home CUE",
            blurb: "Same graded shell inside the tutorial",
          },
          {
            to: "/tutorials/first-session",
            label: "Tutorial: First session",
            blurb: "Pair Mix Ultra, play one song in the room",
          },
          {
            to: "/tutorials/cue-home",
            label: "Full steps: Plant your home CUE",
            blurb: "Same ideas on the real Mix Ultra in djay",
          },
          {
            to: "/labs/free",
            label: "Free play",
            blurb: "Drive both decks with waveforms",
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
        description="Press HOT CUE on the controller first. Empty pad = set. Lit pad = jump + play. SHIFT + pad = erase. On hardware: a short graded drill on Deck 1."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <LabModeShell
        hardwareNote={HW_NOTE + " Pads light when a cue is set."}
        learn={<HotCueLab />}
        hardware={<HardwareHotCueLab />}
      />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/hot-cues?mode=drill",
            label: "Tutorial drill: Hot cues",
            blurb: "Same graded shell inside the tutorial",
          },
          {
            to: "/tutorials/hot-cues",
            label: "Full steps: Hot cues jump map",
            blurb: "Build intro / drop / breakdown pads in djay",
          },
          {
            to: "/labs/free",
            label: "Free play",
            blurb: "Same deck surface, no mode toggle",
          },
          {
            to: "/djing/remix",
            label: "Remix one song",
            blurb: "Why those jump points matter on one song",
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
        description="Left muffles (low-pass). Right thins (high-pass). Center is open. On hardware: hear a demo loop while you twist Deck 1 FILTER."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <LabModeShell
        hardwareNote={HW_NOTE}
        learn={<FilterLab />}
        hardware={<HardwareFilterLab />}
      />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/filter-sweep?mode=drill",
            label: "Tutorial drill: Filter sweep",
            blurb: "Same graded shell inside the tutorial",
          },
          {
            to: "/tutorials/filter-sweep",
            label: "Full steps: Filter sweep",
            blurb: "Feel left vs right on one deck in djay",
          },
          {
            to: "/labs/eq",
            label: "Bass kill (LOW)",
            blurb: "EQ kill vs filter sweep",
          },
          {
            to: "/djing/filter",
            label: "Filter as a performance tool",
            blurb: "One-song: close the breakdown, open your drop",
          },
        ]}
      />
    </>
  );
}

export function EqLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Bass kill (LOW)"
        description="Kill Deck 1 LOW so kicks don’t fight when blending. On hardware you hear the drop-out — and a timing tip on how fast you killed."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <LabModeShell
        hardwareNote={HW_NOTE}
        learn={<EqLab />}
        hardware={<HardwareEqLab />}
      />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/eq-vs-neural?mode=drill",
            label: "Tutorial drill: EQ vs Neural Mix",
            blurb: "Graded LOW kill inside the tutorial",
          },
          {
            to: "/tutorials/mix-bass-swap?mode=drill",
            label: "Tutorial drill: Bass swap",
            blurb: "Same LOW kill shell before the song sheet",
          },
          {
            to: "/djing/eq",
            label: "EQ & Filter",
            blurb: "Why you kill bass when blending",
          },
          {
            to: "/labs/crossfader",
            label: "Crossfader",
            blurb: "Where the room hears each deck",
          },
          {
            to: "/tutorials/eq-vs-neural",
            label: "Full steps: EQ vs Neural Mix",
            blurb: "Do it in djay next",
          },
        ]}
      />
    </>
  );
}

export function CrossfaderLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Crossfader"
        description="Left / center / right — which deck the room hears. On hardware both beds play; finish the drill for a simple timing coach."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <LabModeShell
        hardwareNote={HW_NOTE}
        learn={<CrossfaderLab />}
        hardware={<HardwareCrossfaderLab />}
      />
      <RelatedExtras
        links={[
          {
            to: "/tutorials/mix-xfader-cut?mode=drill",
            label: "Tutorial drill: Crossfader cut",
            blurb: "Same graded shell inside the tutorial",
          },
          {
            to: "/tutorials/mix-xfader-cut",
            label: "Full steps: Crossfader cut",
            blurb: "Throw between two drops in djay",
          },
          {
            to: "/labs/free",
            label: "Free play",
            blurb: "Two decks, pick beds, mix freely",
          },
          {
            to: "/labs/eq",
            label: "Bass kill",
            blurb: "Combine with a slow LOW kill",
          },
          {
            to: "/djing/blend",
            label: "Blend",
            blurb: "Longer mix strategy",
          },
        ]}
      />
    </>
  );
}

export function BeatmatchLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Beatmatch"
        description="Tempo fader until speeds match, jog until kicks lock. Learn the controls, then On hardware for tempo + jog motion tips — not kick grading."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <LabModeShell
        hardwareNote={HW_NOTE}
        learn={<BeatmatchLearn />}
        hardware={<BeatmatchHardware />}
      />
      <RelatedExtras
        links={[
          {
            to: "/djing/beatmatch",
            label: "Match the speed yourself",
            blurb: "Full steps — Key Lock, SYNC off",
          },
          {
            to: "/tutorials/mix-manual-beatmatch?mode=drill",
            label: "Tutorial drill: Match BPM by hand",
            blurb: "Same graded shell inside the tutorial",
          },
          {
            to: "/tutorials/mix-manual-beatmatch",
            label: "Full steps: Match BPM by hand",
            blurb: "djay walkthrough with real songs",
          },
          {
            to: "/labs/blend",
            label: "Two-deck blend",
            blurb: "After speeds match — EQ + crossfader",
          },
          {
            to: "/labs/free",
            label: "Free play",
            blurb: "Both decks, no grade",
          },
        ]}
      />
    </>
  );
}

export function IncomingCueLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Incoming cue (Deck 2)"
        description="Mark hot cue pad 1 on the incoming song before a blend — restart from there in headphones while Deck 1 plays in the room."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <LabModeShell
        hardwareNote={HW_NOTE + " Focus on Deck 2 — pad 1 is your mix-in restart."}
        learn={<IncomingCueLearn />}
        hardware={<HardwareIncomingCueLab />}
      />
      <RelatedExtras
        links={[
          {
            to: "/labs/hot-cue",
            label: "Hot cues",
            blurb: "Full Deck 1 drill — mode, set, jump, clear",
          },
          {
            to: "/labs/blend?mode=hardware",
            label: "Two-deck blend",
            blurb: "Graded LOW + crossfader after cue prep",
          },
          {
            to: "/tutorials/two-deck-blend?mode=drill",
            label: "Tutorial drill: First two-deck blend",
            blurb: "Same graded blend shell inside the tutorial",
          },
          {
            to: "/tutorials/two-deck-blend",
            label: "Full steps: First two-deck blend",
            blurb: "djay walkthrough with real songs",
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

export function BlendLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Two-deck blend"
        description="Phrase-ish EQ + crossfader handoff on laptop audio. Prep incoming cue on Deck 2 first, then On hardware for graded timing tips — not beatmatching."
        actions={
          <Link to="/labs" className="text-back">
            All labs
          </Link>
        }
      />
      <LabModeShell
        hardwareNote={HW_NOTE}
        learn={<BlendLearn />}
        hardware={<BlendHardware />}
      />
      <RelatedExtras
        links={[
          {
            to: "/labs/incoming-cue",
            label: "Incoming cue (Deck 2)",
            blurb: "Hot cue pad 1 before this drill",
          },
          {
            to: "/labs/eq",
            label: "Bass kill (LOW)",
            blurb: "Single-knob drill first",
          },
          {
            to: "/labs/crossfader",
            label: "Crossfader",
            blurb: "Left / center / right alone",
          },
          {
            to: "/djing/blend",
            label: "Blend",
            blurb: "Longer mix strategy",
          },
          {
            to: "/tutorials/two-deck-blend?mode=drill",
            label: "Tutorial drill: First two-deck blend",
            blurb: "Same graded shell inside the tutorial",
          },
          {
            to: "/labs/free",
            label: "Free play",
            blurb: "Same deck, no grade",
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
