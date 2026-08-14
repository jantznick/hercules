import { useState } from "react";

type ModeId =
  | "hot"
  | "loop"
  | "fx"
  | "neural"
  | "pitch"
  | "bounce"
  | "slicer"
  | "sampler";

type PressKind = "tap" | "hold" | "tap-toggle";

type PadMode = {
  id: ModeId;
  name: string;
  enter: string;
  led: string;
  exit: string;
  oneLiner: string;
  /** Short label shown as a pill: TAP / HOLD / TAP TOGGLE */
  pressKind: PressKind;
  pressPill: string;
  /** Plain-English: what your finger does */
  finger: string[];
  /** What each pad represents when you hit it */
  padMeaning: string;
  pads: string[];
  how: string[];
  configure: string[];
  why: string[];
  recipe: { title: string; steps: string[] };
};

const MODES: PadMode[] = [
  {
    id: "hot",
    name: "Hot Cue",
    enter: "Press HOT CUE",
    led: "HOT CUE solid",
    exit: "Switch to another mode button",
    oneLiner: "Jump map: up to 8 bookmarks. Hitting a set pad jumps there and keeps playing.",
    pressKind: "tap",
    pressPill: "TAP once (don’t hold)",
    finger: [
      "Tap and release — do not hold the pad down.",
      "Dark/empty pad: one tap stores a hot cue at wherever the playhead is right now (playing or paused).",
      "Lit pad: one tap jumps the track to that spot and playback continues (it does not stop like the CUE button).",
      "Hold SHIFT and tap a lit pad: erase that hot cue (pad goes dark).",
    ],
    padMeaning:
      "Each pad is its own bookmark (Hot Cue 1–8). They are independent places in the song.",
    pads: ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8"],
    how: [
      "Only that deck’s pads affect that deck’s track.",
      "Unlike the main CUE button: hot cues keep playing after you jump.",
    ],
    configure: [
      "Nothing to assign on the hardware — which pad you use is the “slot.”",
      "In djay you can also edit cue markers on the waveform.",
      "Suggested map: 1 intro · 2 verse · 3 drop · 4 breakdown · 5 outro.",
      "Local files usually save cues; streaming may not.",
    ],
    why: [
      "Start the incoming track on the exact phrase every time.",
      "Skip a boring intro without scrubbing.",
      "Rearrange one song: skip the verse, replay the drop, jump to the breakdown.",
    ],
    recipe: {
      title: "101 transition use",
      steps: [
        "Deck 2: scrub to the entry phrase → tap pad 1 once (sets it).",
        "Later: tap pad 1 once again to jump there and play.",
        "Bring Deck 2 in with fader/crossfader.",
      ],
    },
  },
  {
    id: "loop",
    name: "Loop",
    enter: "Press LOOP",
    led: "LOOP solid",
    exit: "Tap the lit loop pad again to exit the loop",
    oneLiner: "Repeat a chunk of the track (length = which pad) so you can set up the other deck.",
    pressKind: "tap-toggle",
    pressPill: "TAP to start · TAP again to stop",
    finger: [
      "Tap once to turn that length loop ON. Keep your finger off — it stays looping by itself.",
      "The pad lights while the loop is active.",
      "Tap the same lit pad once more to turn the loop OFF; the song continues from there.",
      "Tap a different length pad to switch to that loop size (behavior can feel like replacing the loop).",
      "Not a hold mode — holding does nothing special; it’s on/off taps.",
    ],
    padMeaning:
      "Each pad is a different auto-loop length (very short → several bars), measured in beats/bars from the beat grid.",
    pads: ["1/32", "1/16", "1/8", "1/4", "1/2", "1 bar", "2 bar", "4 bar"],
    how: [
      "Shorter pads = tight stutter-y loops; 2–4 bar pads = time to mix.",
      "If the loop feels lopsided, the beat grid may be off — exit and re-enter on a downbeat.",
      "The loop starts at the playhead, not at a hot cue. HOT CUE and LOOP are different pad modes, so Play-then-LOOP is always a little late.",
      "Exact start: pause on the cue → LOOP → length pad → Play. Or save a cue-loop (see Which cues).",
    ],
    configure: [
      "Length = which pad you tap. That’s the config.",
      "djay landscape can nudge loop in/out on screen if you need precision.",
      "Settings → Advanced → “Save active loop when setting cue point” makes a hot cue recall the loop.",
    ],
    why: [
      "Buy time on the outgoing track while you cue/EQ the next one.",
      "Extend a hook you love on the same song.",
      "Build tension, then exit the loop into the next phrase or track.",
    ],
    recipe: {
      title: "Hold the outro, mix in",
      steps: [
        "Deck 1 playing → LOOP mode → tap a 2- or 4-bar pad once (loop stays on).",
        "Prep Deck 2 (hot cue, sync, lows down).",
        "Bring Deck 2 in → tap the lit loop pad again to exit → fade Deck 1 out.",
        "Need the loop to start on a cue? Pause on that cue first, then tap the length pad — don’t Play then LOOP.",
      ],
    },
  },
  {
    id: "fx",
    name: "FX",
    enter: "Press FX",
    led: "FX solid",
    exit: "Let go of the pad — effect stops when you release",
    oneLiner: "Momentary effects: echo, reverb, etc. while your finger is down.",
    pressKind: "hold",
    pressPill: "HOLD to apply · RELEASE to stop",
    finger: [
      "Press and hold the pad for as long as you want the effect.",
      "While held, that FX slot is on (pad lit).",
      "Release your finger — effect turns off.",
      "This is the opposite of Loop: do not tap-and-forget; if you only tap quickly you’ll get a blip.",
      "One pad at a time is the sane 101 habit.",
    ],
    padMeaning:
      "Each pad is one FX slot (FX1–FX8). What that slot actually is (echo, reverb, …) is chosen in djay — not printed on the hardware.",
    pads: ["FX1", "FX2", "FX3", "FX4", "FX5", "FX6", "FX7", "FX8"],
    how: [
      "Effects apply to that deck’s audio.",
      "Use short holds for accents; long holds for washes (echo-out).",
    ],
    configure: [
      "Landscape in djay → FX panel → assign effects to slots.",
      "Memorize 2–3 pads (e.g. pad 1 = echo) instead of all eight.",
    ],
    why: [
      "Echo the last word of a line while the beat keeps going (same song).",
      "Echo-out the last vocal while fading a track.",
      "Short FX hit into a drop.",
      "Cover a slightly messy transition with a wash, then release.",
    ],
    recipe: {
      title: "Echo-out handoff",
      steps: [
        "Assign Echo to FX pad 1 in djay.",
        "At the end of a line: HOLD pad 1, pull the channel fader down, RELEASE as the echo dies.",
        "Incoming track should already be coming up underneath.",
      ],
    },
  },
  {
    id: "neural",
    name: "Neural Mix (pads)",
    enter: "Press NEURAL MIX (deck mode button)",
    led: "NEURAL MIX solid (not flashing)",
    exit: "Tap lit pads off until all dark = full mix again",
    oneLiner: "Top pads solo a stem; bottom pads mute a stem. Lights = action on.",
    pressKind: "tap-toggle",
    pressPill: "TAP to toggle on/off (don’t hold)",
    finger: [
      "Tap once to turn that pad’s action ON (pad lights). Tap the same pad again to turn it OFF (pad goes dark).",
      "You do not hold these pads — they’re latches, like light switches.",
      "Top row ON = solo that stem (hear mainly drums/bass/melody/vocals).",
      "Bottom row ON = mute/cut that stem out of the full mix.",
      "All pads dark = normal full track. That is home base.",
      "Bottom lit means muted (cut), not “I can hear it.”",
    ],
    padMeaning:
      "With 4 stems: top = Solo Drums/Bass/Melody/Vocals, bottom = Mute those same four. With 3 stems, one column may be unused — check djay’s stem order.",
    pads: [
      "Solo drums",
      "Solo bass",
      "Solo melody",
      "Solo vocals",
      "Mute drums",
      "Mute bass",
      "Mute melody",
      "Mute vocals",
    ],
    how: [
      "If NEURAL MIX is flashing, you’re in Sampler — press NEURAL MIX for solid pad mode.",
      "Center N button is different (knobs become stem volumes).",
      "Deep dive: /labs/neural-pads",
    ],
    configure: [
      "In djay, choose 3 vs 4 Neural Mix parts and confirm stem order on screen.",
      "Pad 1 is usually the first stem (often drums).",
    ],
    why: [
      "Mute vocals for an 8-beat instrumental (same song) or a blend.",
      "Solo drums as a breakdown, then all-dark.",
      "Mashup: beat from one track, voice from another.",
    ],
    recipe: {
      title: "Instrumental bridge",
      steps: [
        "Overlap both decks quietly.",
        "Deck 1 Neural Mix → tap bottom vocals once (lights = mute on).",
        "Let Deck 2’s vocal ride → fade Deck 1 → tap mute off (dark) when done.",
      ],
    },
  },
  {
    id: "pitch",
    name: "Pitch Play",
    enter: "SHIFT + HOT CUE",
    led: "HOT CUE flashing",
    exit: "Press HOT CUE (solid) to leave Pitch Play",
    oneLiner: "Replay one hot cue as different musical pitches (same timing, different note).",
    pressKind: "tap",
    pressPill: "TAP to trigger at that pitch",
    finger: [
      "Tap a pad once — it triggers the selected hot cue at that pad’s pitch and plays.",
      "You don’t hold the pad to “sustain a note” in the basic Hercules mapping; each tap is a trigger (like hitting a sample).",
      "Pad 1 = original pitch of that cue. Tap it to get back to normal pitch without leaving the mode.",
      "Pads 2–8 = other pitches (± semitones). Tap them to fire the same cue transposed.",
      "All 8 pads are pitches of ONE cue — not eight different hot cues.",
    ],
    padMeaning:
      "Default Hercules layout: pad 1 original, then +1 +2 +3, then −4 −3 −2 −1. djay Pitch Cue can change the musical scale.",
    pads: ["Orig", "+1", "+2", "+3", "-4", "-3", "-2", "-1"],
    how: [
      "Set a hot cue first (short vocal/melody works best).",
      "To use another hot cue: pick it in djay’s Pitch Cue UI, or Hot Cue mode → trigger that cue → re-enter Pitch Play.",
      "Not the tempo fader — tempo fader changes speed; these pads change key of the cue hit.",
    ],
    configure: [
      "djay Pitch Cue panel: which cue is active + scale (chromatic / major / minor / blues).",
      "No continuous pitch slider on Mix Ultra without remapping tempo→key.",
    ],
    why: [
      "Mini melody / fills from one hot-cued hit.",
      "Performance candy — optional for mixing.",
    ],
    recipe: {
      title: "Reset without leaving the mode",
      steps: [
        "Hot-cue a short vocal → SHIFT + HOT CUE.",
        "Tap +1 / −1 pads to play around.",
        "Tap pad 1 (Orig) for normal pitch → press HOT CUE to leave the mode.",
      ],
    },
  },
  {
    id: "bounce",
    name: "Bounce Loop",
    enter: "SHIFT + LOOP",
    led: "LOOP flashing",
    exit: "Tap lit pad to stop bounce; press LOOP to leave the mode",
    oneLiner: "Like Loop, but the song keeps advancing underneath — exit and you’re further along.",
    pressKind: "tap-toggle",
    pressPill: "TAP to start · TAP again to stop",
    finger: [
      "Tap once to start a bounce loop of that length (pad lights). Do not hold.",
      "While bouncing, you hear the loop, but djay keeps the “real” playhead moving forward in the background.",
      "Tap the same lit pad again to exit: playback jumps to where the track would have been if you’d never looped.",
      "Same finger habit as Loop — on/off taps — different exit behavior.",
    ],
    padMeaning: "Same idea as Loop pads: each pad = a different loop length.",
    pads: ["1/32", "1/16", "1/8", "1/4", "1/2", "1 bar", "2 bar", "4 bar"],
    how: [
      "Use when you want a hold/stutter without freezing your place in the arrangement forever.",
      "Press LOOP (no shift) when you want to leave Bounce mode entirely.",
    ],
    configure: ["Length = which pad you tap."],
    why: [
      "Tension in a build without getting stuck repeating the same 4 bars forever.",
      "Exit closer to the real drop timing.",
    ],
    recipe: {
      title: "Tension without getting stuck",
      steps: [
        "SHIFT + LOOP → tap a 1- or 2-bar pad once during a build.",
        "Twist Filter; prep the other deck.",
        "Tap the lit pad again to exit bounce → finish the mix nearer the drop.",
      ],
    },
  },
  {
    id: "slicer",
    name: "Slicer",
    enter: "SHIFT + FX",
    led: "FX flashing",
    exit: "Release pads; press FX to leave Slicer mode",
    oneLiner: "Chop the current loop region into 8 slices — stutter a slice while you hold its pad.",
    pressKind: "hold",
    pressPill: "HOLD to stutter that slice · RELEASE to stop",
    finger: [
      "Press and hold a pad to loop/stutter that slice.",
      "Keep holding for as long as you want that chop; the pad stays active while held.",
      "Release — that slice stops.",
      "Move between pads (hold different ones) for glitchy fills.",
      "Like FX: this is a hold mode, not tap-and-forget.",
      "Works best when a loop is already happening (or on the active loop region).",
    ],
    padMeaning:
      "Pads 1–8 = consecutive slices of the looped section (start → end of the loop window).",
    pads: ["Slice1", "Slice2", "Slice3", "Slice4", "Slice5", "Slice6", "Slice7", "Slice8"],
    how: [
      "101 flow: LOOP a 1-bar groove → enter Slicer → hold slices for a phrase → leave Slicer → exit loop.",
      "Use briefly (4–8 beats) or it turns into noise.",
    ],
    configure: [
      "Slice count is fixed to the 8 pads.",
      "Get a clean loop first so slices land on musical pieces.",
    ],
    why: [
      "Drum-machine-style fill before a drop — this song or the next one.",
      "High-energy moment — then get out of the way.",
    ],
    recipe: {
      title: "Pre-drop chop",
      steps: [
        "LOOP 1 bar → SHIFT + FX.",
        "HOLD different slice pads for one phrase.",
        "Release, leave Slicer (press FX), exit loop, hit the next drop.",
      ],
    },
  },
  {
    id: "sampler",
    name: "Sampler",
    enter: "SHIFT + NEURAL MIX",
    led: "NEURAL MIX flashing",
    exit: "Press NEURAL MIX to leave Sampler mode",
    oneLiner: "Fire samples (airs, risers, one-shots) on top of the mix from pads.",
    pressKind: "tap",
    pressPill: "TAP to trigger (usually don’t hold)",
    finger: [
      "Tap once to fire the sample loaded in that slot.",
      "Pad lights while that sample is playing (per Hercules).",
      "Basic one-shots: tap and let go — the sample plays through on its own.",
      "Some looping samples in djay may behave more like toggles (tap again to stop) depending on how the pack/slot is set in the Sampler panel — check on screen if a sample won’t stop.",
      "You can use sampler pads from either deck’s pad bank (manual).",
    ],
    padMeaning:
      "Each pad is sample slot 1–8. Empty slots do nothing until you load a pack in djay.",
    pads: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"],
    how: [
      "Samples layer over whatever decks are playing — watch volume.",
      "Leave Sampler mode when done so you don’t air-horn mid-blend by accident.",
    ],
    configure: [
      "djay landscape → Looper/Sampler → load a sample pack into the slots.",
      "Start simple: kick, clap, shout, riser, noise sweep.",
    ],
    why: [
      "Riser into a drop (this song’s drop, or a new track).",
      "Percussion fills / party one-shots.",
    ],
    recipe: {
      title: "Riser into the drop",
      steps: [
        "Load a riser into sample pad 1.",
        "SHIFT + NEURAL MIX → tap pad 1 once as the phrase ends → bring the new drop in.",
        "Press NEURAL MIX / HOT CUE to leave Sampler.",
      ],
    },
  },
];

const REMIX_RECIPES = [
  {
    title: "Replay the drop",
    tags: ["Hot Cue"],
    body: "Map pad 3 (or 1) on the chorus/drop One. Play, then tap that pad again after 8–16 beats. Same song, new arrangement. Land on the One.",
  },
  {
    title: "Loop the hook",
    tags: ["Loop", "Hot Cue"],
    body: "On a chorus One: LOOP → tap 2- or 4-bar once. Ride it twice. Tap the lit pad to exit, then Hot Cue the drop again if you want a second hit.",
  },
  {
    title: "Filter-open your own drop",
    tags: ["Filter", "Hot Cue"],
    body: "In the breakdown: Filter left (muffle) or right (thin). On the drop One, sweep back to 12 o’clock over 8–16 beats. Park Filter at center.",
  },
  {
    title: "Echo a word (not an echo-out)",
    tags: ["FX"],
    body: "FX mode: at the end of a vocal line, HOLD echo 1–2 beats, RELEASE. Leave the fader up — you’re decorating this track, not washing it away.",
  },
  {
    title: "8-beat instrumental",
    tags: ["Neural Mix"],
    body: "All pads dark. Tap bottom vocals once (lit = mute). Count 8 beats. Tap dark. Solo drums (top) is the same idea — spotlight, then home.",
  },
  {
    title: "Chop then same drop",
    tags: ["Loop", "Slicer"],
    body: "1-bar loop → SHIFT+FX → HOLD slices for ~4 beats → leave Slicer → exit loop. Optional: Hot Cue the drop. Keep it short.",
  },
];

const TRANSITION_RECIPES = [
  {
    title: "Beginner: loop + crossfade",
    tags: ["Loop", "Hot Cue", "EQ"],
    body: "Outgoing: LOOP 4 bars (tap on, tap off later). Incoming: Hot Cue 1, lows down. Raise fader, crossfade, exit loop, fade out. No FX required.",
  },
  {
    title: "Echo out",
    tags: ["FX", "Fader"],
    body: "FX mode: HOLD echo pad, pull outgoing fader down, RELEASE. Incoming already in. Hold ≠ tap.",
  },
  {
    title: "Filter + bounce tension",
    tags: ["Bounce Loop", "Filter"],
    body: "SHIFT+LOOP → tap bounce 2 bars on. Filter left then open. Tap bounce off so the song has progressed. Bring new track in.",
  },
  {
    title: "Stem swap mashup",
    tags: ["Neural Mix", "Hot Cue"],
    body: "Overlap decks. TAP mute vocals on A (lights on). Optional mute drums on B. Tap pads dark when finished.",
  },
  {
    title: "Chop then drop",
    tags: ["Loop", "Slicer", "Hot Cue"],
    body: "Tap loop on → HOLD slicer pads for a phrase → release → exit loop → Hot Cue the incoming drop.",
  },
];

export function PadModes() {
  const [active, setActive] = useState<ModeId>("hot");
  const mode = MODES.find((m) => m.id === active)!;

  return (
    <div className="pad-deep">
      <div className="callout" style={{ marginBottom: "0.9rem" }}>
        <h2>Pad modes 101</h2>
        <p>
          The eight pads change meaning with the mode buttons. First check the{" "}
          <strong>TAP vs HOLD</strong> pill for each mode — FX and Slicer are hold; Hot Cue, Loop,
          Neural, Pitch Play, Bounce, and Sampler are mostly taps.
        </p>
      </div>

      <div className="lab">
        <div className="mode-tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={active === m.id ? "active" : undefined}
              onClick={() => setActive(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="log">
          <div>
            <em>Enter:</em> {mode.enter} · <em>LED:</em> {mode.led}
          </div>
          <div style={{ marginTop: "0.35rem" }}>
            <em>Leave:</em> {mode.exit}
          </div>
          <div style={{ marginTop: "0.35rem" }}>{mode.oneLiner}</div>
        </div>

        <div className={`press-banner press-${mode.pressKind}`}>
          <strong>{mode.pressPill}</strong>
          <span>{mode.padMeaning}</span>
        </div>

        <div className="pad-grid">
          {mode.pads.map((label, i) => (
            <button key={i} type="button" className="pad active">
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="pad-detail-grid">
        <div className="pad-detail interaction">
          <h3>What your finger does</h3>
          <ul>
            {mode.finger.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="pad-detail">
          <h3>Extra technical notes</h3>
          <ul>
            {mode.how.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="pad-detail">
          <h3>How to configure it</h3>
          <ul>
            {mode.configure.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="pad-detail">
          <h3>Why you’d use it</h3>
          <ul>
            {mode.why.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="pad-detail recipe">
          <h3>{mode.recipe.title}</h3>
          <ol>
            {mode.recipe.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="section-head" style={{ marginTop: "1.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Quick finger cheat sheet</h2>
          <p style={{ margin: "0.25rem 0 0" }}>All eight modes at a glance.</p>
        </div>
      </div>
      <div className="table-wrap" style={{ marginBottom: "1.25rem" }}>
        <table>
          <thead>
            <tr>
              <th>Mode</th>
              <th>Finger</th>
              <th>In one line</th>
            </tr>
          </thead>
          <tbody>
            {MODES.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.pressPill}</td>
                <td>{m.oneLiner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-head">
        <div>
          <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Remix recipes (one song)</h2>
          <p style={{ margin: "0.25rem 0 0" }}>
            Stay on Deck 1. Jump, loop, filter, or decorate — then reset. Not a second-deck mix.
          </p>
        </div>
      </div>

      <div className="recipe-cards" style={{ marginBottom: "1.5rem" }}>
        {REMIX_RECIPES.map((r) => (
          <article key={r.title} className="recipe-card">
            <h3>{r.title}</h3>
            <div className="recipe-tags">
              {r.tags.map((t) => (
                <span key={t} className="pill">
                  {t}
                </span>
              ))}
            </div>
            <p>{r.body}</p>
          </article>
        ))}
      </div>

      <div className="section-head">
        <div>
          <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Transition recipes</h2>
          <p style={{ margin: "0.25rem 0 0" }}>
            Learn Loop + Hot Cue + Filter first; add FX hold and Neural taps next.
          </p>
        </div>
      </div>

      <div className="recipe-cards">
        {TRANSITION_RECIPES.map((r) => (
          <article key={r.title} className="recipe-card">
            <h3>{r.title}</h3>
            <div className="recipe-tags">
              {r.tags.map((t) => (
                <span key={t} className="pill">
                  {t}
                </span>
              ))}
            </div>
            <p>{r.body}</p>
          </article>
        ))}
      </div>

      <div className="explain" style={{ marginTop: "1rem" }}>
        <details open>
          <summary>Mode switching without getting lost</summary>
          <ul>
            <li>Solid mode LED = Hot Cue / Loop / FX / Neural Mix pads.</li>
            <li>Flashing = Pitch Play / Bounce / Slicer / Sampler.</li>
            <li>Leave a shift-mode by pressing the parent button (e.g. LOOP exits Bounce).</li>
            <li>Habit: return to HOT CUE after a trick so pads are jump markers again.</li>
          </ul>
        </details>
      </div>
    </div>
  );
}

export function NeuralMixGuide() {
  const [neural, setNeural] = useState(false);
  const [high, setHigh] = useState(80);
  const [mid, setMid] = useState(80);
  const [low, setLow] = useState(80);

  return (
    <div>
      <div className="lab">
        <div className="lab-toolbar">
          <button
            type="button"
            className={neural ? "active" : undefined}
            onClick={() => setNeural((v) => !v)}
          >
            {neural ? "Neural Mix ON (center N)" : "Neural Mix OFF — EQ mode"}
          </button>
        </div>
        <div className="knob-row">
          {(
            [
              ["HIGH", high, setHigh, neural ? "Vocals" : "Treble EQ"],
              ["MID", mid, setMid, neural ? "Instruments / melody" : "Mid EQ"],
              ["LOW", low, setLow, neural ? "Drums" : "Bass EQ"],
            ] as const
          ).map(([name, val, setVal, role]) => (
            <div className="knob-block" key={name}>
              <label>
                <span>
                  {name} → {role}
                </span>
                <span>{val}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={val}
                onChange={(e) => setVal(Number(e.target.value))}
              />
            </div>
          ))}
        </div>
        <div className="log" style={{ marginTop: "0.75rem" }}>
          {neural ? (
            <>
              <em>Neural Mix:</em> the three knobs become stem volumes (vocals / instruments /
              drums), not EQ.
            </>
          ) : (
            <>
              <em>Normal EQ:</em> HIGH / MID / LOW shape frequency bands. SHIFT + HIGH = gain.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
