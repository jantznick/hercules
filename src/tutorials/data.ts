export type Side = "hardware" | "djay" | "lab" | "listen";

export type TutorialStep = {
  title: string;
  hardware?: string;
  djay?: string;
  lab?: string;
  listen?: string;
  expect: string;
  tip?: string;
};

export type Tutorial = {
  id: string;
  title: string;
  time: string;
  level: "Start here" | "Basics" | "Mixing" | "Advanced";
  summary: string;
  needs: string[];
  steps: TutorialStep[];
  /** Optional “pick tracks like…” framing for song-style tutorials */
  trackRecipe?: string;
};

export const TUTORIALS: Tutorial[] = [
  {
    id: "cue-home",
    title: "Plant your home CUE",
    time: "~3 min",
    level: "Start here",
    summary:
      "Learn why Play blinks when paused, how to set the one main cue, and how CUE behaves differently while playing.",
    needs: ["Mix Ultra powered on + paired", "djay open with a track on Deck 1"],
    steps: [
      {
        title: "Load a track on Deck 1",
        hardware:
          "Turn the BROWSER knob to scroll. Press the left LOAD button (under Deck 1) to load the highlighted track.",
        djay: "You should see the waveform appear on the left deck.",
        expect: "Deck 1 has a song. Play/Pause LED is blinking (paused).",
      },
      {
        title: "Notice the blink — it’s normal",
        hardware: "Look at Play/Pause on Deck 1. Don’t press anything yet.",
        expect:
          "The light blinks to the beat while paused. That does NOT mean a cue is set — it’s just “ready.”",
        tip: "In the lab, the Play button also shows blinking when paused.",
        lab: "Open the Cue section above and confirm the Play LED status says blinking.",
      },
      {
        title: "Find a good “home” spot",
        hardware:
          "With the track paused, touch the top of the jog wheel and spin to scrub. Land near the start of a phrase, vocal, or drop you always want to return to.",
        djay: "Watch the playhead move on the waveform.",
        lab: "In Cue Lab: drag the waveform to ~ a few seconds in, stay paused.",
        expect: "Playhead is where you want your home marker. Still paused.",
      },
      {
        title: "Set the main CUE",
        hardware: "Press the CUE button once (next to Play on that deck).",
        djay: "A white triangle cue marker should appear at the playhead.",
        lab: "Click CUE in Cue Lab while paused.",
        expect: "One main cue is planted. Pads are unrelated — this is only the CUE button.",
      },
      {
        title: "Play, then return with CUE",
        hardware: "Press Play. Let it run a few seconds. Then press CUE.",
        djay: "Playback should stop and the playhead should jump back to the white triangle.",
        lab: "Play → wait → CUE. Watch the log explain “return & stop.”",
        expect:
          "Track stops on your cue point. This is the big difference from hot cues (which keep playing).",
      },
      {
        title: "Bonus: SHIFT + CUE vs CUE",
        hardware: "Hold SHIFT and press CUE.",
        expect: "Track plays from the very beginning — not from your cue point.",
        tip: "Use main CUE as “my drop.” Use SHIFT+CUE when you want the true start.",
        lab: "Try Shift + CUE in the lab.",
      },
    ],
  },
  {
    id: "hot-cues",
    title: "Hot cues: jump map",
    time: "~5 min",
    level: "Basics",
    summary:
      "Enter HOT CUE mode, plant a few pads, jump around while playing, then erase one with SHIFT.",
    needs: ["Track loaded on Deck 1", "You already understand the main CUE button"],
    steps: [
      {
        title: "Enter HOT CUE mode",
        hardware:
          "On Deck 1’s mode row, press HOT CUE. The HOT CUE button should stay lit (solid).",
        expect: "Pads are now hot-cue pads for that deck — not loops or FX.",
        lab: "Scroll to Hot Cue Lab — it assumes HOT CUE mode is already on.",
      },
      {
        title: "Set pad 1 at the intro",
        hardware:
          "Pause (or scrub) near the intro. Press performance pad 1 (top-left of that deck’s pad bank).",
        djay: "A colored hot-cue marker appears. Pad 1 lights up.",
        lab: "Scrub near the start → click Pad 1.",
        expect: "Hot cue 1 is set. Empty pads stay dark; set pads light up.",
      },
      {
        title: "Set pad 2 on the drop / chorus",
        hardware: "Scrub or play forward to the drop. Press pad 2.",
        expect: "Two hot cues set. You’re building a jump map.",
        tip: "Common map: 1 intro · 2 drop · 3 breakdown · 4 outro.",
      },
      {
        title: "Jump while playing",
        hardware: "Press Play, then slap pad 1, then pad 2.",
        djay: "Playhead jumps instantly and keeps playing.",
        lab: "With cues set, click a lit pad — it jumps and stays playing.",
        expect:
          "Unlike the CUE button, hot cues do NOT stop the deck. They’re for live jumps.",
      },
      {
        title: "Erase a hot cue",
        hardware: "Hold SHIFT and press the pad you want to clear.",
        djay: "That hot-cue marker disappears; pad goes dark.",
        lab: "Hold Shift (button) then click a set pad.",
        expect: "Only that pad is cleared. Others remain.",
      },
    ],
  },
  {
    id: "filter-sweep",
    title: "Filter sweep (one deck)",
    time: "~4 min",
    level: "Basics",
    summary:
      "Feel low-pass vs high-pass on one track so the Filter knob stops being mysterious.",
    needs: ["Track playing on Deck 1", "Channel fader up", "Crossfader toward that deck"],
    steps: [
      {
        title: "Start with Filter centered",
        hardware: "Find the FILTER knob for Deck 1 (above the channel fader). Set it to 12 o’clock.",
        expect: "Full, normal sound — no muffling, no thinness.",
        lab: "In Filter Lab, drag the slider to center.",
      },
      {
        title: "Turn Filter left (low-pass)",
        hardware: "Slowly twist FILTER counterclockwise while the track plays.",
        listen: "Highs disappear — muffled / underwater. Kick and bass remain longer.",
        expect: "You’re cutting treble. This is the classic “bury the outgoing track” move.",
        lab: "Drag Filter left and watch the frequency curve drop on the right side.",
      },
      {
        title: "Return to center, then turn right (high-pass)",
        hardware: "Back to 12 o’clock, then slowly twist clockwise.",
        listen: "Bass and kick thin out; sound gets tinny / airy.",
        expect: "You’re cutting lows. Great for bringing a new track in without bass clash.",
        lab: "Drag Filter right — left side of the curve drops.",
      },
      {
        title: "Practice a mini transition gesture",
        hardware:
          "With the track playing: Filter right (thin) → slowly open to center over 8–16 beats.",
        expect: "Sounds like a track “opening up.” You’ll use this on the incoming deck later.",
        tip: "Always park Filter back at center when you’re done — easy to leave it half-cut by accident.",
      },
    ],
  },
  {
    id: "eq-vs-neural",
    title: "EQ vs Neural Mix knobs",
    time: "~5 min",
    level: "Basics",
    summary:
      "Same HIGH / MID / LOW knobs, two jobs: frequency EQ, or stem volumes when Neural Mix is on.",
    needs: ["Track on Deck 1 that has clear vocals + drums (pop/electronic works well)"],
    steps: [
      {
        title: "Confirm Neural Mix is OFF",
        hardware:
          "Center NEURAL MIX button should be off (not lit for stem mode). HIGH/MID/LOW are normal EQ.",
        djay: "Stems shouldn’t be in “knob takeover” mode yet.",
        lab: "Neural / EQ section: leave Neural Mix OFF.",
        expect: "HIGH = treble, MID = mids, LOW = bass of the whole track.",
      },
      {
        title: "Kill the bass with LOW",
        hardware: "Play the track. Turn LOW fully left, then back to center.",
        listen: "Kick/bass disappear, then return. Classic “EQ kill” for blending.",
        expect: "You shaped frequencies — you did not isolate vocals.",
      },
      {
        title: "Turn Neural Mix ON",
        hardware: "Press the center NEURAL MIX (N) button so stem mode engages.",
        djay: "HIGH/MID/LOW now control vocals / instruments / drums volumes.",
        lab: "Toggle Neural Mix ON in the lab and watch the knob labels change.",
        expect: "Same knobs, new job. This is the free Neural Mix unlock with Mix Ultra.",
      },
      {
        title: "Pull vocals out",
        hardware: "Turn HIGH (now Vocals) down. Leave MID and LOW up.",
        listen: "Instrumental-ish version — vocals fade, beat stays.",
        expect: "Stem volume, not EQ. Great for mashups / acapella moments.",
      },
      {
        title: "Solo the drums",
        hardware: "Bring HIGH and MID down; leave LOW (Drums) up — or use Neural pad mode for solos.",
        tip: "Pad mode NEURAL MIX: top pads solo a stem, bottom pads mute a stem.",
        expect: "You can ride stems live. When finished, turn Neural Mix off and return knobs to center.",
      },
    ],
  },
  {
    id: "two-deck-blend",
    title: "First two-deck blend",
    time: "~8 min",
    level: "Mixing",
    summary:
      "Match tempo, cue the incoming track, EQ the bass clash away, then crossfade. Hardware + djay together.",
    needs: [
      "Two tracks in similar BPM/genre",
      "Splitter cable + headphones strongly recommended",
      "djay: enable Split output if using the Hercules splitter",
    ],
    steps: [
      {
        title: "Deck 1 is the outgoing track",
        hardware: "Load Track A on Deck 1. Crossfader hard LEFT. Channel 1 fader up. Play Deck 1.",
        expect: "Only Deck 1 in the room / master.",
      },
      {
        title: "Load Deck 2 and sync",
        hardware:
          "Load Track B on Deck 2. Press SYNC on Deck 2 (or sync in djay) so BPMs match. Keep Deck 2 channel fader down or crossfader left so B isn’t in the mix yet.",
        djay: "BPMs should look matched. Fine-tune with the tempo fader if needed.",
        expect: "Two tracks ready; only A is audible on master.",
      },
      {
        title: "Headphones: preview Deck 2",
        hardware:
          "If using the splitter: headphones in green, speakers in black. Press Deck 2’s headphone (PFL/monitor) button.",
        djay: "Settings → enable Split output for pre-cueing with audio adapter.",
        expect: "You hear B in headphones while A plays to the room. Skip this step if you’re practicing without cans — just keep B’s fader down.",
        tip: "No splitter? Practice the motions silently on B, then bring volume carefully.",
      },
      {
        title: "Set a cue / hot cue on the incoming drop",
        hardware:
          "On Deck 2: pause on the phrase you want to enter on. Press CUE (home) and/or set Hot Cue pad 1.",
        expect: "You can restart B from the same spot every time while you practice the blend.",
      },
      {
        title: "EQ: make room for bass",
        hardware:
          "On Deck 2 (incoming), turn LOW down a bit before it enters. Optionally high-pass FILTER a little to the right.",
        expect: "When B fades in, two kicks won’t fight as hard.",
      },
      {
        title: "Line up “the One” and fade in",
        hardware:
          "In headphones, start B so its downbeat matches A. Raise Deck 2 channel fader, then ease the crossfader toward the center / right over several bars.",
        listen: "Both tracks briefly together, then B takes over.",
        expect: "Smooth-ish blend. Don’t chase perfection — feel the 4-beat phrases.",
      },
      {
        title: "Finish the handoff",
        hardware:
          "Turn Deck 1 LOW down, move crossfader fully to Deck 2, pause/stop Deck 1, reset Deck 1’s EQ/Filter to center, load the next track.",
        expect: "Clean exit. You’re ready to repeat the other direction.",
      },
    ],
  },
  {
    id: "stutter-cue",
    title: "Stutter from the CUE",
    time: "~3 min",
    level: "Mixing",
    summary: "Use SHIFT + Play taps to stutter from your main cue — a classic build/FX gesture.",
    needs: ["Main CUE already set on a strong hit (kick or vocal)"],
    steps: [
      {
        title: "Confirm a cue is planted",
        hardware: "Paused on your hit → press CUE if needed. Play once to verify CUE returns you there.",
        expect: "CUE reliably snaps back to the same spot.",
        lab: "Cue Lab: set cue, play, CUE to return.",
      },
      {
        title: "Stutter",
        hardware:
          "Hold SHIFT and rapidly tap Play/Pause several times. Each tap restarts from the cue.",
        listen: "Chopped / stuttered restart of the same hit.",
        expect: "Faster taps = tighter stutter. Release into normal Play when you want the phrase to run.",
        tip: "Manual: SHIFT + Play/Pause repeatedly. Needs a cue set first.",
      },
    ],
  },
  {
    id: "pads-transition",
    title: "Pads in a simple transition",
    time: "~10 min",
    level: "Mixing",
    summary:
      "Use Hot Cue + Loop + one FX echo the way a beginner actually mixes — mode switches included.",
    needs: [
      "Two similar-BPM tracks",
      "Comfortable with Play, Cue, and crossfader",
      "Optional: headphones + splitter",
    ],
    steps: [
      {
        title: "Prep Hot Cue on the incoming track",
        hardware:
          "Deck 2: press HOT CUE (solid LED). Scrub to the entry phrase. Press pad 1 to set Hot Cue 1.",
        djay: "Confirm a hot-cue marker on Deck 2.",
        expect: "You can restart Deck 2’s entry anytime by hitting pad 1.",
      },
      {
        title: "Hold the outgoing track with Loop",
        hardware:
          "Deck 1 playing. Press LOOP. Hit a 2-bar or 4-bar pad so Deck 1 repeats safely.",
        expect: "Deck 1 is on autopilot — you have time to work on Deck 2.",
        tip: "If the loop feels off-beat, exit and retry on a downbeat (“the One”).",
      },
      {
        title: "Line up Deck 2 from the hot cue",
        hardware:
          "Stay in HOT CUE on Deck 2 (press HOT CUE if you left it). Headphones on Deck 2 if you have them. Hit pad 1 so it starts on the phrase. SYNC if needed. Lows down a little on Deck 2.",
        expect: "Deck 2 is ready; Deck 1 still looping in the room.",
      },
      {
        title: "Blend, then leave the loop",
        hardware:
          "Raise Deck 2 fader / ease crossfader toward Deck 2. On Deck 1, press the lit loop pad to exit the loop, then fade Deck 1 out.",
        expect: "Handoff complete. You used pads for timing + buying time — not for decoration.",
      },
      {
        title: "Optional polish: echo-out",
        hardware:
          "Next time: before fading Deck 1, press FX, hold an Echo pad while pulling Deck 1’s fader down, then release.",
        djay: "Landscape → FX panel → put Echo on pad 1 so you know which pad is which.",
        expect: "Outgoing track washes away instead of hard-cutting. Then slap HOT CUE so you’re not stuck in FX mode.",
      },
    ],
  },
  {
    id: "neural-pad-lights",
    title: "Neural Mix pads: read the lights",
    time: "~6 min",
    level: "Basics",
    summary:
      "Stop guessing whether a lit pad means ‘on’ or ‘I can hear it.’ Walk the solo/mute LEDs on the real controller.",
    needs: [
      "Track with clear vocals + drums playing on Deck 1",
      "NEURAL MIX mode (solid LED) — not flashing Sampler",
    ],
    steps: [
      {
        title: "Enter pad mode (not the center N)",
        hardware:
          "On the deck, press NEURAL MIX so the mode button is solid. Do not hold SHIFT (that’s Sampler — flashing).",
        tip: "Center N button is different — it remaps the EQ knobs. Leave it alone for this tutorial.",
        lab: "Open /labs/neural-pads and keep it beside you.",
        expect: "Pads are solo/mute. Mode LED solid blue/lit.",
      },
      {
        title: "Find the ‘home’ light pattern",
        hardware: "Turn off any lit performance pads until they are all dark (press lit ones again).",
        listen: "Full track — drums, melody, vocals (and bass if 4-stem).",
        expect:
          "All pads dark = full mix. Memorize this. You are not trying to light everything up.",
      },
      {
        title: "Solo drums (top row)",
        hardware: "Press the top-left pad (usually Solo Drums). It should light up.",
        listen: "Mostly drums; other parts drop away.",
        expect: "Top pad LIT = solo action ON. You’re hearing mainly that stem.",
        lab: "In the lab, tap Solo Drums and watch LIT + the audible meters.",
      },
      {
        title: "Leave solo — back to all dark",
        hardware: "Press the same lit top pad again so it goes dark.",
        listen: "Full mix returns.",
        expect: "Solo off. Lights home base again.",
      },
      {
        title: "Mute vocals (bottom row) — the confusing one",
        hardware: "Press the bottom pad under vocals (often bottom-right with 3 stems). It lights up.",
        listen: "Instrumental-ish — vocals gone, beat/melody remain.",
        expect:
          "Bottom pad LIT means mute is ON (stem cut). Lit ≠ ‘vocals present.’ This is the gotcha.",
        tip: "If you mentally map ‘light = I hear it,’ the bottom row will always feel backwards.",
      },
      {
        title: "Unmute and park",
        hardware: "Press the lit mute pad again → dark. Confirm all pads dark.",
        expect: "Full mix. Habit: return to all-dark before the next transition so you don’t leave a mute stuck on.",
        lab: "Use Reset = full mix in the Neural pads lab anytime you get lost.",
      },
    ],
  },
  {
    id: "adv-filter-open",
    title: "Song recipe: filter-open into a drop",
    time: "~12 min",
    level: "Advanced",
    trackRecipe:
      "Pick Track A (outgoing) with a clear 8–16 bar build before a drop. Track B (incoming) same genre, BPM within ~3, with a strong drop. Electronic / house / pop-EDM work great.",
    summary:
      "Buy time with a loop, thin the incoming track with Filter, then open the filter as B’s drop hits — a club-style energy lift.",
    needs: [
      "Comfortable with Hot Cue, Loop, Filter, crossfader",
      "Two similar-energy dance tracks",
      "Headphones recommended",
    ],
    steps: [
      {
        title: "Cast your two songs",
        djay: "Load A on Deck 1, B on Deck 2. Note BPMs — SYNC Deck 2 if needed.",
        expect: "Same-ish tempo. You’re aiming for a phrase-aligned handoff, not a trainwreck.",
        tip: "Follow the track recipe at the top of this tutorial when picking A and B.",
      },
      {
        title: "Mark the moments",
        hardware:
          "Deck 1 HOT CUE: pad 1 = start of build, pad 2 = drop. Deck 2 HOT CUE: pad 1 = first beat of B’s drop (or the bar before if you like a runaway).",
        expect: "You can restart either climax without scrubbing.",
      },
      {
        title: "Play A into the build; freeze if you need time",
        hardware:
          "Deck 1 playing toward the build. If you’re not ready, LOOP a 2- or 4-bar pad during the build groove.",
        expect: "A is stable. Crossfader still favoring Deck 1.",
      },
      {
        title: "Prep B thin",
        hardware:
          "Deck 2: from Hot Cue 1, start in headphones. Turn FILTER clockwise a bit (high-pass / thin). Pull LOW down slightly. Channel fader ready but not blasting.",
        listen: "B should sound lighter — less bass clash when it enters.",
        expect: "B is cued on the drop phrase, EQ/filter making room.",
      },
      {
        title: "Handoff on the phrase",
        hardware:
          "On A’s phrase boundary (or exit loop on the One), start/bring B. Ease crossfader toward Deck 2 over 8–16 beats while slowly returning B’s FILTER to center and LOW up. Fade/EQ out A.",
        listen: "B “opens up” into the drop as the filter clears — energy rises.",
        expect: "Drop feels intentional. Reset Filter/EQ on both decks to center afterward.",
      },
    ],
  },
  {
    id: "adv-echo-vocal",
    title: "Song recipe: echo out a vocal into the next hook",
    time: "~10 min",
    level: "Advanced",
    trackRecipe:
      "Track A: song with a sung last line or catchphrase before an outro. Track B: another song whose hook/vocal can start cleanly. Hip-hop, pop, and R&B shine here.",
    summary:
      "End A on a memorable line, wash it with echo while fading, and land B’s vocal/hook so the room never sits in silence.",
    needs: ["FX pad assigned to Echo in djay", "Two vocal-led tracks", "Main cues/hot cues on both hooks"],
    steps: [
      {
        title: "Assign Echo",
        djay: "Landscape → FX → put Echo on Deck 1’s FX pad 1 (remember which pad).",
        hardware: "Press FX mode (solid). You’ll hold pad 1 later.",
        expect: "You know which pad is echo before the mix gets busy.",
      },
      {
        title: "Mark the last line + the next hook",
        hardware:
          "Deck 1: Hot Cue or CUE on the downbeat of A’s final vocal line. Deck 2: Hot Cue 1 on B’s hook/chorus downbeat.",
        expect: "Both moments are one pad away.",
      },
      {
        title: "Ride A to the line",
        hardware: "Deck 1 in the room. Deck 2 ready in headphones, synced, lows tucked a little.",
        expect: "You’re counting phrases so the last line isn’t a surprise.",
      },
      {
        title: "Echo + fade A, start B",
        hardware:
          "As the last syllable hits: hold FX Echo on Deck 1, pull Deck 1 channel fader down, release echo as it dies. Hit Deck 2 Hot Cue 1 / bring fader up so B’s hook takes the space.",
        listen: "A’s vocal trails into space; B’s hook arrives in the pocket.",
        expect: "No awkward mute hole. Leave FX mode (press HOT CUE) so you don’t echo by accident next song.",
      },
    ],
  },
  {
    id: "adv-vocal-swap",
    title: "Song recipe: Neural vocal swap mashup",
    time: "~12 min",
    level: "Advanced",
    trackRecipe:
      "Two songs in related keys/BPM if possible — or just practice with anything and forgive the clashes. Best: Track A instrumental-friendly beat, Track B strong vocal. Or two choruses you wish existed as a mashup.",
    summary:
      "Overlap both decks, mute vocals on one with Neural Mix pads, and let the other voice ride — live mashup without prep stems.",
    needs: [
      "Neural Mix pad mode understood (lit = mute ON on bottom row)",
      "Two tracks that can tolerate a few bars together",
    ],
    steps: [
      {
        title: "Get both drops/hooks under hot cues",
        hardware: "Hot Cue 1 on each deck at the section you’ll mash (chorus/drop).",
        expect: "Instant restarts while you experiment.",
        lab: "Optional: /labs/neural-pads to rehearse mute lights first.",
      },
      {
        title: "Start the bed",
        hardware:
          "Play Deck 1 full mix (Neural pads all dark). Bring Deck 2 in softly with lows down so it doesn’t explode.",
        expect: "Both audible enough to judge the mash — volumes careful.",
      },
      {
        title: "Mute A’s vocals",
        hardware:
          "Deck 1 → NEURAL MIX mode (solid). Press bottom vocals pad so it lights. A becomes instrumental-ish.",
        listen: "B’s vocal (or full B) sits over A’s beat/instruments.",
        expect: "Bottom pad LIT = mute on. You’re not hunting for ‘all pads lit.’",
      },
      {
        title: "Optional: mute B’s drums",
        hardware:
          "Deck 2 Neural Mix → mute drums (bottom drums lit) so A’s kick leads while B’s voice/melody stays.",
        expect: "Classic ‘beat from A, voice from B’ bed. Tweak channel faders until it feels like one record.",
      },
      {
        title: "Exit clean",
        hardware:
          "Decide a winner: fade the other deck out, turn every Neural pad dark on both decks, restore EQ/Filter, load the next track.",
        expect: "No stuck mutes next song. Mashup was a moment, not a permanent setting.",
      },
    ],
  },
  {
    id: "adv-double-drop",
    title: "Song recipe: double-drop with hot cues",
    time: "~10 min",
    level: "Advanced",
    trackRecipe:
      "Two big electronic/pop drops at nearly the same BPM. Think festival energy — both kicks hit together on purpose for 8–16 beats, then you peel one away.",
    summary:
      "Line up both drops on Hot Cue 1, hit them together, ride the chaos briefly, then EQ one out so it feels huge instead of messy.",
    needs: ["Solid beatmatching/SYNC", "Hot cues on both drops", "Willingness to practice timing"],
    steps: [
      {
        title: "Mark both drops",
        hardware: "Deck 1 & 2: HOT CUE pad 1 exactly on the first kick of each drop.",
        expect: "Pad 1 = nuclear button for each climax.",
      },
      {
        title: "Build with A; standby B",
        hardware:
          "A playing the build in the room. B paused/cued on Hot Cue 1 in headphones, synced, fader down or crossfader left.",
        expect: "You’re waiting for A’s One into the drop.",
      },
      {
        title: "Trigger together",
        hardware:
          "On the drop: hit Deck 1 if needed to be on the drop, and Deck 2 Hot Cue 1 + raise fader / move crossfader so both drops slam.",
        listen: "Double impact — exciting if aligned, messy if a beat off. Retry from cues until it’s tight.",
        expect: "Both kicks on the One. Keep it short (8–16 beats).",
      },
      {
        title: "Peel out of the double",
        hardware:
          "Kill LOW on the deck you’re removing (or mute its drums via Neural), fade that channel, leave the keeper’s drop running.",
        expect: "Crowd (or you) gets the stunt, then clarity returns. Reset EQ/Neural pads.",
      },
    ],
  },
];
