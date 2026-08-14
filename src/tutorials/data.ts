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
  level: "Start here" | "Basics" | "Remix" | "Mixing" | "Advanced";
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
    id: "pre-cue-hear-first",
    title: "Hear it first (pre-cue)",
    time: "~6 min",
    level: "Start here",
    summary:
      "The core DJ move: play the next track in headphones (or quietly) while the room stays on Deck 1. Learn what the headphone buttons actually do.",
    needs: [
      "Two different songs loaded (Deck 1 and Deck 2)",
      "Some way to hear master (speakers or laptop)",
      "Headphones if you have them — Mac can use AirPods as Pre-Cueing; phone usually needs the splitter tutorial next",
    ],
    steps: [
      {
        title: "Make Deck 1 the only thing in the room",
        hardware:
          "Crossfader hard LEFT. Deck 1 channel fader up. Deck 2 channel fader all the way down. Play Deck 1.",
        expect: "Guests / speakers = Track A only. Deck 2 can be loaded but must be silent in the room.",
        tip: "If you still hear Deck 2 in the room, its fader isn’t fully down or the crossfader isn’t parked.",
      },
      {
        title: "Light only Deck 2’s headphone button",
        hardware:
          "Find the two small headphone / monitor buttons (one per deck). Turn Deck 1’s off (dark). Turn Deck 2’s on (lit).",
        djay:
          "Mac: Audio panel — Main = speakers, Pre-Cueing = your headphones (not Split Output unless you’re on the Y-cable). Phone: you’ll only hear a real split with the green/black cable.",
        expect:
          "Those buttons are on/off gates for cue — they do not pick which Bluetooth gadget is ‘the room.’",
      },
      {
        title: "Play Deck 2 with its fader still down",
        hardware: "Press Play on Deck 2. Do not raise its channel fader. Do not move the crossfader.",
        listen:
          "Headphones / pre-cue device should get Track B. Speakers should still be Track A. If both places play B, Deck 2 is leaking into master — fader down, crossfader left.",
        expect:
          "Play started the song. Faders kept it out of the room. Cue let you hear it. That’s pre-cue (PFL).",
      },
      {
        title: "Both headphone buttons on, then off",
        hardware:
          "Light Deck 1’s headphone button too — both decks in cans so you can check if they’re lined up. Then turn both off.",
        listen: "Both on = A+B in ears. Both off = cue silent; room still plays A.",
        expect: "Cue can go fully quiet without stopping the party.",
      },
      {
        title: "Bring Deck 2 into the room on purpose",
        hardware:
          "Leave Deck 2 playing. Raise its channel fader slowly, then ease the crossfader toward the center.",
        listen: "B appears in the room when you choose — not when you pressed Play ten steps ago.",
        expect: "You now have the loop you’ll use all night: cue incoming → line up → fade in.",
        tip: "Read the Pre-cue page if Auto Select keeps flipping the lights for you.",
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
        expect: "Sounds like a track “opening up.” You’ll use this on an incoming deck later — and on this same song’s drop when remixing.",
        tip: "Always park Filter back at center when you’re done — easy to leave it half-cut by accident. One-song version: close Filter in a breakdown, open it as your drop hits.",
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
        tip: "Next skill: don’t wait for the dying outro — Mix in / mix out without killing energy.",
      },
    ],
  },
  {
    id: "pre-cue-split",
    title: "Test the splitter (pre-cue)",
    time: "~8 min",
    level: "Basics",
    summary:
      "Prove that headphones (green) can hear the next track while speakers (black) keep playing the mix — and that two Bluetooth audio devices cannot do this.",
    needs: [
      "Mix Ultra paired in djay",
      "Included splitter cable",
      "Wired headphones",
      "Phone 3.5 mm jack OR USB-C/Lightning → 3.5 mm dongle",
      "Something in the black jack: computer speakers, a mini speaker, or a second cheap 3.5 mm headset",
    ],
    steps: [
      {
        title: "Wire it like a tiny DJ booth",
        hardware:
          "Phone (or dongle) ← splitter plug. GREEN → your headphones. BLACK → speakers (aux in). Do not Bluetooth the speakers for this test.",
        djay: "Controller paired. Settings → Pre-cueing / Audio → enable Split output (often hidden until Mix Ultra is connected).",
        expect: "Physical split is in. Split output is on.",
        tip: "Charge-only USB-C dongles fail here — you need one that actually carries headphone audio.",
      },
      {
        title: "Two different songs",
        hardware:
          "Load Track A on Deck 1, Track B on Deck 2. Crossfader LEFT. Deck 1 fader up, Deck 2 fader DOWN. Play Deck 1.",
        listen: "Speakers (black) should be Track A only.",
        expect: "Room = A. Deck 2 is loaded but silent in the room.",
      },
      {
        title: "Cue Deck 2 in headphones",
        hardware:
          "Put headphones on. Press the Deck 2 headphone (monitor) button. Play Deck 2 (it can play even with its channel fader down).",
        listen:
          "Green/headphones = Track B (or A+B). Black/speakers should still be A only — guests don’t hear you hunting for the drop.",
        expect: "That’s pre-cue. The two buttons choose which deck is in your ears, not which Bluetooth gadget.",
      },
      {
        title: "Toggle Deck 1 phones",
        hardware:
          "Press Deck 1’s headphone button too. Both on = both decks in cans so you can check if they’re lined up. Turn Deck 2 phones off: cans should follow Deck 1 / master-ish cue.",
        expect: "Buttons are PFL selects. They don’t route to two wireless devices.",
      },
      {
        title: "What not to expect from Bluetooth",
        djay: "If you unplug the splitter and connect a Bluetooth speaker + Bluetooth headphones, both will play the same mix. Cue buttons won’t split them.",
        expect:
          "For real cue vs room: wired split. Bluetooth speaker is OK as master only if you skip PFL or mix with faders down.",
        tip: "On a Mac you can skip the cable: Main = speakers, Pre-Cueing = headphones. See the Mac two-devices tutorial.",
      },
    ],
  },
  {
    id: "pre-cue-mac",
    title: "Mac: speakers + headphones",
    time: "~5 min",
    level: "Basics",
    summary:
      "Use djay on a Mac to send the mix to one device and pre-cue to another — without the Y-cable. iPhone generally cannot do this with two Bluetooth gadgets.",
    needs: [
      "djay on Mac",
      "Speakers or laptop speakers for the room",
      "Headphones (wired is tighter; AirPods work but lag)",
      "Two tracks loaded",
    ],
    steps: [
      {
        title: "Open djay’s Audio panel",
        djay: "Mixer Mode = Internal. Booth = None unless you have a third speaker.",
        expect: "You’re routing in software. Mix Ultra is only MIDI here.",
      },
      {
        title: "Assign two different devices",
        djay:
          "Main Output = the room (MacBook speakers, monitor, Bluetooth speaker). Pre-Cueing = your headphones — pick the actual device name, not Split Output.",
        expect: "Two destinations. Split Output is only for the green/black analog cable.",
        tip: "Do not put AirPods on Main and Split Output on Pre-Cueing if you want a real booth.",
      },
      {
        title: "Prove master is independent",
        hardware:
          "Crossfader left, Deck 1 fader up, play Deck 1. Turn both Mix Ultra headphone buttons OFF.",
        listen: "Speakers play Track A. Headphones should be silent.",
        expect: "Cue is gated by the buttons. The party doesn’t need them on.",
      },
      {
        title: "Prove cue is independent",
        hardware:
          "Deck 2 fader down. Light only Deck 2 phones. Play Deck 2.",
        listen: "Headphones = Track B. Speakers still = Track A.",
        expect: "That’s the Mac two-device booth. AirPods will feel late vs speakers — normal Bluetooth latency.",
      },
      {
        title: "When you’d still use the splitter",
        djay:
          "One analog jack (Mac headphone port or USB dongle): Main = that output, Pre-Cueing = Split Output, green = cans, black = speakers.",
        expect: "Same PFL idea, different wire. Phone/tablet almost always needs this for a real split.",
      },
    ],
  },
  {
    id: "pre-cue-auto-select",
    title: "Tame Auto Select",
    time: "~4 min",
    level: "Basics",
    summary:
      "If the headphone lights jump when you move the crossfader, that’s djay Auto Select — turn it off so cue stays on the deck you chose.",
    needs: ["djay open", "Both decks loaded", "Pre-cue already working (Mac two devices or splitter)"],
    steps: [
      {
        title: "Watch it steal your cue",
        hardware:
          "Light only Deck 2’s headphone button. Slowly move the crossfader from left to right and back.",
        expect:
          "If Auto Select is on, the lights (and what you hear in cans) may flip by themselves. That’s djay, not a broken controller.",
      },
      {
        title: "Turn Auto Select off",
        djay:
          "Mac: click the headphone icon at the top of the window → uncheck Auto Select. Or Settings → Advanced → Pre-Cueing → Auto Select off. iOS: Settings → Sound or Advanced → Pre-Cueing.",
        expect: "The setting is in djay, not on the Mix Ultra.",
      },
      {
        title: "Confirm the buttons stay put",
        hardware:
          "Light only Deck 2 phones. Move faders and the crossfader. The Deck 2 cue light should stay lit until you press it.",
        expect: "You choose when to listen to the incoming track. Cue the incoming deck, not whichever djay thinks is ‘active.’",
        tip: "You can leave Auto Select on later if you like it — just know why the lights move.",
      },
    ],
  },
  {
    id: "stutter-cue",
    title: "Stutter from the CUE",
    time: "~3 min",
    level: "Remix",
    summary: "Use SHIFT + Play taps to stutter from your main cue — a classic one-song flare gesture.",
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
    id: "remix-cue-map",
    title: "Map a song for remixing",
    time: "~8 min",
    level: "Remix",
    summary:
      "Plant five hot cues as a jump map, then rearrange one song live: skip ahead, replay the drop, hit the breakdown.",
    needs: [
      "One song you already know (clear verse / chorus / drop)",
      "Deck 1 loaded, HOT CUE mode",
      "You can set a hot cue (Basics: Hot cues jump map)",
    ],
    steps: [
      {
        title: "Pick a song you can hum",
        hardware: "Load it on Deck 1. Crossfader toward Deck 1. Channel fader up. Ignore Deck 2.",
        expect: "One deck, one song. Remixing does not need a second track.",
        tip: "A 3–4 minute pop/dance song with an obvious chorus is easier than a long DJ-tool intro.",
      },
      {
        title: "Pad 1 = intro / start",
        hardware:
          "HOT CUE (solid). Scrub to where you’d usually let the song start for a crowd → tap pad 1.",
        djay: "A hot-cue marker appears near the beginning (not necessarily 0:00).",
        expect: "Pad 1 is “play this song from a useful start.”",
      },
      {
        title: "Pad 2 = verse or first hook",
        hardware: "Find the first verse or the first time the hook appears → beat 1 of that phrase → tap pad 2.",
        expect: "You can skip the intro anytime.",
      },
      {
        title: "Pad 3 = drop / chorus (your replay button)",
        hardware:
          "Find the big energy hit (chorus or drop). Land on beat 1 of that bar → tap pad 3. Play from pad 3 once to confirm it slams on the One.",
        expect: "Pad 3 is the remix detonator — you’ll hit this more than once.",
      },
      {
        title: "Pad 4 = breakdown · Pad 5 = a vocal or drum hit",
        hardware:
          "Breakdown / bridge / quiet bit → pad 4 on a One. Then find a short vocal word or kick you might want to jump to → pad 5 (doesn’t have to be a full phrase).",
        expect: "Five bookmarks. That’s enough of a remix map.",
        lab: "Hot Cue Lab: plant a few pads and jump while playing — same idea, fake waveform.",
      },
      {
        title: "Rearrange it live",
        hardware:
          "Play from pad 1. After a few bars, tap pad 3 (drop). Let it run 8–16 beats. Tap pad 4 (breakdown). Then tap pad 3 again (replay the drop). Let the song run.",
        listen: "You changed the arrangement without touching Deck 2. Jumps should land on phrase starts, not mid-word.",
        expect: "That’s live remixing: same file, different order. If a jump felt early/late, nudge that cue and retry.",
        tip: "Local files usually save hot cues; streaming may not — remap if they vanish next session.",
      },
    ],
  },
  {
    id: "remix-loop-replay",
    title: "Loop a hook, replay the drop",
    time: "~8 min",
    level: "Remix",
    summary:
      "Extend a chorus with a 2- or 4-bar loop, exit on the One, then jump the drop again — classic one-song remix.",
    needs: [
      "Song with a mapped drop/chorus hot cue (do “Map a song for remixing” first)",
      "LOOP mode + HOT CUE mode",
    ],
    steps: [
      {
        title: "Start from the drop / chorus",
        hardware: "HOT CUE. Tap your drop pad (often pad 3). Let the hook play in the room.",
        expect: "You’re in the part people sing. Crossfader still on this deck.",
      },
      {
        title: "Catch a 2- or 4-bar loop",
        hardware:
          "On a One (beat 1 of the bar): press LOOP, then tap the 2-bar or 4-bar pad once. Take your finger off — it stays looping.",
        listen: "The hook repeats. If it feels lopsided, tap the lit pad to exit and retry on a downbeat.",
        expect: "Loop pad lit. You bought extra chorus without loading another track.",
        tip: "Shorter pads (1/4, 1/2) are stutter-y; 2–4 bars are “keep dancing.”",
      },
      {
        title: "Ride it, then exit on a One",
        hardware:
          "Let the loop run 2–4 times. On a downbeat, tap the same lit loop pad once to exit. The song continues from there.",
        expect: "You’re out of the loop, still in the same song. Don’t leave LOOP mode forever — you’ll want HOT CUE next.",
      },
      {
        title: "Replay the drop",
        hardware: "Press HOT CUE. Tap the drop pad again so the chorus/drop hits a second time.",
        listen: "Hook extended → drop (or chorus) again. That’s a tiny remix, not a transition.",
        expect: "One song, rearranged. Park in HOT CUE so pads are jump markers again.",
      },
    ],
  },
  {
    id: "loop-from-cue",
    title: "Loop from a cue (not late)",
    time: "~6 min",
    level: "Remix",
    summary:
      "LOOP pads start from the playhead, not from the hot cue you just hit — and you have to leave HOT CUE mode to loop. Arm the loop while paused, or save a cue-loop.",
    needs: ["A hot cue already planted on a clear One (intro or chorus)", "LOOP + HOT CUE modes"],
    steps: [
      {
        title: "See why Play-then-LOOP is late",
        hardware:
          "HOT CUE → tap pad 1 so it plays. Then press LOOP, then tap 4-bar (or 2-bar).",
        listen: "The loop starts wherever you landed — a bar or two after the cue — because the song kept running while you changed modes.",
        expect: "That’s normal. Pads are one mode at a time. LOOP is “from now,” not “from pad 1.”",
      },
      {
        title: "Arm it paused (exact start)",
        hardware:
          "Tap the lit loop pad to exit. HOT CUE → pad 1, then Pause on that One. LOOP → tap 4-bar once. Play.",
        listen: "The repeating phrase starts on the cue, not after it.",
        expect: "In-point = paused playhead. This is the prep move. Exit the loop (tap lit pad) when you’re done.",
      },
      {
        title: "Optional: save a cue-loop on pad 1",
        djay: "Settings → Advanced → turn ON “Save active loop when setting cue point.”",
        hardware:
          "Paused on the One with the 4-bar loop still active: HOT CUE → tap pad 1 (sets/overwrites). Play from somewhere else, then tap pad 1.",
        expect: "Pad 1 jumps and the loop comes back — no mode race. Turn that setting OFF again so later cues don’t all become loops.",
        tip: "If pad 1 didn’t keep the loop, the setting was off or you set the cue before the loop.",
      },
      {
        title: "Live recovery: next One",
        hardware:
          "Exit any loop. HOT CUE → pad 1 and let it play. Press LOOP, wait for the next downbeat, tap 4-bar.",
        listen: "Loop starts on a phrase, just not the one you jumped from. Still musical.",
        expect: "You stopped chasing the past bar. That’s what you do in a set when you didn’t prep.",
      },
    ],
  },
  {
    id: "remix-filter-own-drop",
    title: "Filter-open your own drop",
    time: "~6 min",
    level: "Remix",
    summary:
      "Same filter gesture as a two-deck mix, but you open into this song’s drop — one deck, one Filter knob.",
    needs: ["Track with a breakdown then a drop/chorus", "Filter knob + a drop hot cue"],
    steps: [
      {
        title: "Park in the breakdown",
        hardware:
          "Play into the quiet/build section (or jump your breakdown hot cue). Filter at 12 o’clock. Finger ready on FILTER and on the drop pad.",
        listen: "Energy dipped. You’re about to fake a “new track arriving” using the same song.",
        expect: "Breakdown, Filter centered, drop pad armed.",
        lab: "Filter Lab: remember left = muffle, right = thin, center = open.",
      },
      {
        title: "Close the filter",
        hardware:
          "Twist FILTER left (muffled) or right (thin) — pick one. Hold it there for 4–8 beats of the breakdown.",
        listen: "Track sounds buried or skinny. That’s tension, not a broken speaker.",
        expect: "Filter is away from center on purpose.",
      },
      {
        title: "Open into the drop",
        hardware:
          "On the One into the drop: tap your drop hot cue (or let the real drop arrive) and sweep FILTER back to 12 o’clock over 8–16 beats.",
        listen: "The song “blooms” into the drop. Same move as bringing a new track in — you just never left this one.",
        expect: "Filter parked at center when the drop is fully in. Easy to forget and leave it half-cut.",
        tip: "If you also used LOOP in the breakdown, exit the loop on that same One so the drop isn’t still repeating.",
      },
    ],
  },
  {
    id: "remix-flare-kit",
    title: "A small flare kit (one song)",
    time: "~10 min",
    level: "Remix",
    summary:
      "Three decorations, one at a time: echo a word, mute vocals for a phrase, optional 4-beat slicer chop — then reset.",
    needs: [
      "Same mapped song on Deck 1",
      "FX: Echo assigned to pad 1 in djay",
      "Optional: Neural Mix pads + a 1-bar loop for Slicer",
    ],
    steps: [
      {
        title: "Rule: one trick, then home",
        hardware:
          "Before anything: Filter at center. Neural pads all dark. Mode = HOT CUE. You’ll return here after each move.",
        expect: "Home base. Flare is seasoning — leftover mute/filter is how tracks “mysteriously” sound wrong.",
      },
      {
        title: "Echo the last word of a line",
        hardware:
          "Play a vocal phrase. At the end of the last word: press FX, HOLD pad 1 (echo), keep holding ~1–2 beats, RELEASE. Do not pull the fader (that’s an echo-out to another song).",
        djay: "Landscape → FX → Echo on slot 1 if you haven’t already.",
        listen: "The word washes; the beat keeps going under it. Same song, still playing.",
        expect: "Hold ≠ tap. Then press HOT CUE so you’re not stuck in FX mode.",
      },
      {
        title: "Instrumental for 8 beats",
        hardware:
          "NEURAL MIX (solid, not flashing Sampler). During a chorus: tap bottom VOCALS once (lights = mute on). Count 8 beats. Tap it dark again.",
        listen: "Hook becomes a bed, then the singer returns. If the wrong stem died, tap off and try the neighboring bottom pad.",
        expect: "Mute was a moment. All Neural pads dark before you continue.",
        lab: "/labs/neural-pads if lights still feel backwards.",
        tip: "Solo drums (top drums lit) for a bar is the same idea — spotlight, then all-dark.",
      },
      {
        title: "Optional: 4-beat chop, then get out",
        hardware:
          "On a groove: LOOP → tap the 1-bar pad. SHIFT + FX (Slicer). HOLD a few slice pads for about 4 beats. Release, press FX to leave Slicer, tap the lit loop pad to exit the loop.",
        listen: "A short glitchy fill, then the song continues. Longer than a phrase turns into noise.",
        expect: "Chop was a fill, not a new genre. Back to HOT CUE. Filter still center.",
      },
    ],
  },
  {
    id: "remix-party-hook",
    title: "Remix one anthem: Can’t Stop the Feeling!",
    time: "~12 min",
    level: "Remix",
    trackRecipe:
      "SONG SHEET — one deck only (no second track).\n\nJustin Timberlake – Can’t Stop the Feeling! (Trolls / radio) · ~113 BPM · ~3:56\n• Hot Cue 1 → first chorus downbeat (“I got this feeling in my body…” — often ~0:45–1:05 on radio edits)\n• Hot Cue 2 → a later chorus / last full hook (~2:30–3:00)\n• Hot Cue 3 → a quieter verse or pre-chorus you can use as a fake breakdown (~1:20–1:40)\n\nConfirm on the waveform — sing-along vs radio vs movie edits move by a few seconds.\n\nBackup one-song remix: Shakira – Try Everything, or Encanto – We Don’t Talk About Bruno (same idea: chorus replay + loop + filter).",
    summary:
      "Concrete one-song remix: loop the chorus, replay it, filter-open from a quieter bit back into the hook.",
    needs: [
      "Can’t Stop the Feeling! in djay (very common on Apple Music)",
      "Hot Cue + Loop + Filter on Deck 1",
    ],
    steps: [
      {
        title: "Load only this track",
        djay: "Deck 1: Can’t Stop the Feeling! Ignore Deck 2. Key Lock on is fine but you won’t SYNC anyone.",
        hardware: "Crossfader toward Deck 1. Channel up.",
        expect: "Party anthem, one deck. Times below are radio-ish — trust the chorus downbeat.",
      },
      {
        title: "Plant the remix map",
        hardware:
          "HOT CUE. First “feeling in my body” chorus → pad 1 on beat 1. Later chorus → pad 2. A quieter verse/pre-chorus → pad 3.",
        expect: "Pad 1 = replay button. Pad 2 = late chorus. Pad 3 = fake breakdown.",
      },
      {
        title: "Loop the first chorus",
        hardware:
          "Play from pad 1. On a One in the hook: LOOP → tap 4-bar (or 2-bar) once. Ride it twice, then tap the lit pad to exit.",
        listen: "Kids-floor chorus lasts longer. Exit should feel like the song continued, not a stall.",
        expect: "Extended hook. Press HOT CUE again after you exit.",
      },
      {
        title: "Replay the chorus, then dip",
        hardware: "Tap pad 1 again (second chorus hit). After 8–16 beats, tap pad 3 to jump to the quieter bit.",
        listen: "Hook → hook again → verse-ish dip. You rearranged the radio edit.",
        expect: "Jumps on the One. If pad 3 landed mid-line, nudge it and retry.",
      },
      {
        title: "Filter-open back into the hook",
        hardware:
          "In that quieter bit: FILTER left or right a little. On a One, tap pad 1 (or pad 2) and sweep Filter to center over 8 beats.",
        listen: "Breakdown-ish → chorus bloom. Same filter-open as a mix, never left the song.",
        expect: "Filter at 12 o’clock. HOT CUE mode. That’s a full mini-remix you can repeat on any anthem.",
      },
    ],
  },
  {
    id: "count-phrases",
    title: "Count phrases (the One)",
    time: "~6 min",
    level: "Basics",
    summary:
      "Count 8-bar blocks out loud, feel where songs change, and plant a cue on beat 1 — the skill that makes mixes feel musical instead of merely in time.",
    needs: ["One dance-ish track on Deck 1 (house, pop, or a kids anthem with a clear kick)"],
    steps: [
      {
        title: "Find beat 1 by ear",
        hardware:
          "Load Deck 1. Play from the start (SHIFT + CUE if you already have a cue). Nod to the kick. The heaviest beat of each bar is usually “1.”",
        listen: "1-2-3-4, 1-2-3-4. If you lose it, wait for a crash, a new instrument, or a vocal starting — that’s often a One.",
        expect: "You can point at beat 1 without looking at the screen.",
      },
      {
        title: "Count bars, not just beats",
        hardware: "Keep it playing. Say the bar number on each downbeat: 1-2-3-4, 2-2-3-4, … 8-2-3-4.",
        listen:
          "After “8,” something usually changes: hats, bass, a vocal, a fill. That’s a phrase boundary — DJs mix on those, not on bar 5.",
        expect: "8 bars felt like a sentence. The next 1 felt like a new sentence.",
        tip: "House/techno often stack two of these into a 16-bar section. Pop and hip-hop may change every 8 — or even 4.",
      },
      {
        title: "Watch the waveform confirm it",
        djay: "Overview waveform: fat blocks vs thin dips often line up with your 8-counts. Zoom in: the cue should sit on a kick spike, not the swell before it.",
        expect: "Your ear and the picture agree. If they don’t, trust the ear and move the marker.",
      },
      {
        title: "Plant a cue on a One",
        hardware:
          "Pause. Jog to the downbeat of a new phrase (first kick of a drop, chorus, or intro groove). Press CUE. Optionally HOT CUE → pad 1 on the same spot.",
        expect: "Home cue / pad 1 restarts that phrase, not a random beat in the middle.",
        lab: "Cue lab: scrub, plant, Play, then CUE to return.",
      },
      {
        title: "Practice launching on the One",
        hardware:
          "Play a few bars past the cue. Press CUE to return and stop. Then Play from the cue (or CUE + Play). Do it until the first kick always feels like “1,” not a pickup.",
        expect: "You can hit the phrase start on purpose. That’s the whole game for mix-ins later.",
        tip: "Want snap-to-beat only sometimes? Leave Quantize off and hold the pad/CUE to snap — tutorial Quantize: tap vs hold.",
      },
    ],
  },
  {
    id: "quantize-snap",
    title: "Quantize: tap vs hold",
    time: "~5 min",
    level: "Basics",
    summary:
      "Mix Ultra has no Quantize button. Leave djay’s Q switch off, then tap for exact cues and hold to snap to the beat — plus where the real on/off lives if you want a toggle.",
    needs: [
      "Track with a clear kick AND a vocal that starts off the kick (pop/house vocal works)",
      "djay open so you can see the cue marker on the waveform",
    ],
    steps: [
      {
        title: "Find the Q switch (and leave it off)",
        djay: "Mac: Tools / cue-loop strip at the top — Q plus a snap-size dropdown. iPhone/iPad: Tools → Cue points; circled Q, often near Sync. Turn Q OFF for this drill.",
        expect: "You know where the global switch is. Mix Ultra does not have this button.",
        tip: "If you want “start of a beat,” set the dropdown to 1 beat — not 1/4 — before you ever turn Q on.",
      },
      {
        title: "Tap = exact (no snap)",
        hardware:
          "HOT CUE mode. Pause. Jog so the playhead sits a little before a kick — not on it. Quick-tap pad 1 (don’t hold).",
        djay: "The hot-cue marker should sit where you were, slightly early — not sucked onto the kick.",
        expect: "That’s the “I don’t want auto-snap” cue. Good for pickups and off-beat vocals.",
      },
      {
        title: "Hold = snap to the beat (Q still off)",
        hardware:
          "SHIFT + pad 1 to erase. Same early playhead. Now HOLD pad 2 for a beat until it registers.",
        djay: "Marker should jump to the nearest grid line / kick even though Quantize is off.",
        expect: "Hold-to-snap is the quick toggle. You did not hunt for Q.",
      },
      {
        title: "Feel why global Q can annoy you",
        djay: "Turn Q ON (1 beat). Play the track. Tap a hot cue a little late on purpose.",
        listen: "The jump may wait for the next beat instead of firing immediately. That’s trigger-quantize — great for drops, mushy for a spoken stab.",
        expect: "Q on = setting AND triggering wait for the grid. Turn Q back OFF when you’re done.",
        tip: "Want a dedicated flip? Mac: Settings → Shortcuts → assign Quantize to ⌥⌘Q (plain Q is already “jump to start CUE”). Or MIDI-learn SHIFT+LOAD on Mix Ultra to Quantize.",
      },
    ],
  },
  {
    id: "read-waveform",
    title: "Read the waveform (find the parts)",
    time: "~8 min",
    level: "Basics",
    summary:
      "Use djay’s waveform — and Neural Mix vocals — to find intro, drop, vocal entry, breakdown, and the last full groove. Mix Ultra does not auto-mark these.",
    needs: [
      "A track with a clear drop or chorus AND some singing (house vocal or a pop/kids song)",
      "Comfortable jogging / pausing",
    ],
    steps: [
      {
        title: "Read energy at a glance",
        djay: "Look at the overview waveform without playing. Fat/tall = busy (drop, chorus, full bass). Thin = sparse (intro, breakdown, outro tail).",
        expect: "You can point at “the loud middle” and “the skinny ending” before you hear them.",
        tip: "The mix-out you want is usually the last fat block — not the skinny tail after the song has already left.",
      },
      {
        title: "Mark mix-in (first useful kick)",
        hardware:
          "HOT CUE. Jog from 0:00. Skip silence or talking. Land on the first repeating kick on beat 1 → pad 1.",
        djay: "Zoom until you see a transient peak. If the first downbeat is quiet, that’s still the mix-in — intros are supposed to be sparse.",
        expect: "Pad 1 is “I am willing to start this track here,” not necessarily the drop.",
      },
      {
        title: "Mark the drop / chorus",
        hardware: "Scrub to the first fat block. Land on beat 1 of that phrase → pad 2.",
        listen: "Energy jumps. That’s the payoff people came for — don’t mix another drop over it by accident.",
        expect: "Pad 2 is the nuclear button. Play it once to confirm it slams on the One.",
      },
      {
        title: "Find where vocals come in (Neural Mix)",
        hardware:
          "Press NEURAL MIX (solid pad mode) or the center N knob mode. Solo Vocals (top vocal pad, or turn HIGH/Vocals up and the others down). Scrub from the start.",
        listen: "Silence, then a voice. That’s vocal entry — the line you must not cover with another singer.",
        djay: "On Mac / some iPad layouts you can split the waveform into stems: the vocal lane jumping from flat to busy is the same moment.",
        expect: "You know the clock time / phrase where singing starts. Leave Neural pads all dark when you’re done hunting.",
        tip: "Plant pad 3 on the downbeat of that vocal phrase (beat 1 of the bar), not halfway through the first word.",
      },
      {
        title: "Mark mix-out (last full groove)",
        hardware:
          "Look at the last fat block before the waveform thins out for good. Pad 4 on beat 1 of that phrase — while there is still a kick.",
        expect: "Pad 4 is “leave now, while it still has body.” The skinny outro is optional lull, not the default exit.",
      },
      {
        title: "Jump the map",
        hardware: "Play pad 1 → 2 → 3 → 4. Confirm each lands on a One and matches intro / payoff / vocal / last groove.",
        expect: "You prepped a mix map without any auto-cue feature. Next mix, you already know where to start and leave.",
        lab: "Hot Cue lab if pad set/erase still feels fuzzy.",
      },
    ],
  },
  {
    id: "mix-in-mix-out",
    title: "Mix in / mix out without killing energy",
    time: "~12 min",
    level: "Mixing",
    trackRecipe:
      "Use two similar-BPM house/techno (or tech-house) tracks with visible intros, a drop, a mid-track breakdown, and an outro. DJ/extended mixes beat radio edits.\n\nDeck 1 (outgoing): anything with a fat groove that later thins (e.g. FISHER – Losing It).\nDeck 2 (incoming): similar energy, similar BPM (e.g. James Hype – Ferrari, or another ~125 track).\n\nYou need four landmarks (confirm on the waveform, not the clock):\n• A last FULL groove on Deck 1 (still has kick+bass) — not the dying last 20 seconds\n• A mid-track breakdown on Deck 1 (optional second mix-out)\n• Deck 2 intro / first kick\n• Deck 2 first drop\n\nBackup: two tracks from the same playlist you already mix. Same idea: busy vs sparse.",
    summary:
      "The r/Beatmatch lesson: intro-over-dying-outro stacks two empty sections. Mix the new intro over the last full groove — or over a breakdown — so a kick stays in the room.",
    needs: [
      "Two similar-BPM house/techno tracks (DJ/extended if you have them)",
      "Hot Cue + SYNC + LOW EQ + headphones strongly recommended",
      "You can already do a basic two-deck blend",
    ],
    steps: [
      {
        title: "Hear the energy crash (on purpose)",
        hardware:
          "Deck 1 only. Play into the skinny outro (waveform is thin, few instruments left). That’s the section beginners wait for before mixing.",
        listen: "The floor would already be cooling off. Mixing a second intro on top of this is two empties.",
        expect: "You felt why “wait until the end” is boring — even before Deck 2 exists.",
      },
      {
        title: "Mark the real mix-out (last full groove)",
        hardware:
          "Rewind. Find the last fat phrase that still has kick + bass — often 32–64 bars before the true end, or the groove after the last drop. HOT CUE pad 4 on that One.",
        djay: "Last tall block, not the tail. If this is a 7-minute techno track, you may leave at minute 4–5. That’s normal.",
        expect: "Pad 4 = “I am allowed to leave.” You will not wait for the leftover hiss.",
      },
      {
        title: "Mark incoming intro and first drop",
        hardware:
          "Deck 2 HOT CUE: pad 1 = first useful kick / DJ intro. Pad 2 = first drop (first fat kick of the payoff). SYNC Deck 2. Lows down a bit on Deck 2.",
        expect: "Pad 1 is mix-in (sparse). Pad 2 is the new busy section you’ll time toward.",
      },
      {
        title: "Blend: sparse over busy (the workhorse)",
        hardware:
          "Room = Deck 1 playing toward pad 4’s groove (crossfader left). Headphones on Deck 2. On Deck 1’s mix-out One: start Deck 2 from pad 1, raise channel / ease crossfader. Keep Deck 1 LOW up at first; Deck 2 LOW still down.",
        listen: "New hats/groove over a still-moving bass. Kick never left. This is intro-over-groove, not intro-over-outro.",
        expect: "Energy held. You are mixing in while the old track still has dignity.",
      },
      {
        title: "Bass swap on a phrase, then leave",
        hardware:
          "On the next One (8 or 16 bars later): Deck 1 LOW down, Deck 2 LOW up together. Fade Deck 1 out before it thins to nothing. Reset EQ.",
        listen: "Handoff. Optional: time Deck 2’s pad 2 drop to land as Deck 1 leaves — extra lift, still one bassline.",
        expect: "Same genre as the Reddit thread (techno/prog/house) without the lull. Contrast can wait for a breakdown next time.",
        tip: "Want a dip on purpose? Mix over a mid-track breakdown instead of the last groove — busy incoming over sparse outgoing. Don’t do sparse over sparse unless the night needs a reset.",
      },
    ],
  },
  {
    id: "vocal-handoff",
    title: "Hand off vocal tracks (don’t stack singers)",
    time: "~10 min",
    level: "Mixing",
    trackRecipe:
      "Two songs people actually sing — pop, vocal house, Disney, kids party. Radio edits are fine; intros will be short.\n\nExample pair (or any two you know):\nDeck 1: Calvin Harris & Dua Lipa – One Kiss (or Shakira – Try Everything)\nDeck 2: Joel Corry – Head & Heart (or Justin Timberlake – Can’t Stop the Feeling!)\n\nMark:\n• Deck 1 last chorus downbeat (mix-out) and the lyric you might echo\n• Deck 2 first chorus downbeat (mix-in for a cut) AND the first vocal if it starts earlier\n\nSYNC + Key Lock. This is not a 32-bar techno blend.",
    summary:
      "Pop, hip-hop, and kids bangers don’t get house-length overlays. Protect the chorus, don’t mix two lead vocals, and leave on a short phrase — cut or echo.",
    needs: [
      "Two vocal-heavy tracks close-ish in BPM (or accept SYNC stretch + Key Lock)",
      "Hot Cue + channel fader; optional FX Echo",
      "Headphones recommended",
    ],
    steps: [
      {
        title: "Mark the forbidden overlap",
        hardware:
          "On each deck, find where the lead vocal starts (Neural Mix solo vocals if you need to hunt). Hot Cue that phrase’s downbeat. Play both in headphones for a second with faders down — two voices talking.",
        listen: "That’s the wreck. Hip-hop and pop treat this as the main rule: one MC / one singer at a time.",
        expect: "You know the bars you must not layer. House DJs can stack drums; vocal DJs usually cannot stack words.",
      },
      {
        title: "Respect the chorus on the way out",
        hardware:
          "Deck 1: plant Hot Cue on the LAST full chorus downbeat. Play it in the room. Do not start Deck 2’s vocal during this chorus.",
        listen: "People are singing. Mixing over it buries the reason you played the song.",
        expect: "Mix out of the chorus (as it ends), not over it. Same idea as “don’t mix over the drop” in techno.",
      },
      {
        title: "Short handoff — cut or 8 bars, not 32",
        hardware:
          "Deck 2 waiting on first chorus (or first sung downbeat) in headphones, LOW a bit down. At the end of Deck 1’s last chorus One: start Deck 2, raise fader, fade Deck 1 within ~8 bars (or cut on the One).",
        listen: "Old hook finishes → new hook (or new verse) arrives. Radio-edit timing. No long percussion runway.",
        expect: "Open-format default. If it felt rushed, the edit has no intro — that’s the genre, not a failure.",
        tip: "Optional polish: HOLD FX Echo on Deck 1 as you pull the fader after the last word, then tap Deck 2’s chorus cue into the hole. See the Echo-out advanced tutorial.",
      },
      {
        title: "If you must overlap, hide a vocal",
        hardware:
          "Retry once: Deck 1 NEURAL MIX → mute vocals (bottom pad LIT) for the 8-bar overlap only, then fade Deck 1 and darken all Neural pads.",
        listen: "Groove continues; only one singer. This is a mashup-ish cheat, not the default.",
        expect: "You have an escape hatch. Default remains: don’t stack singers. Reset Neural pads to all dark.",
      },
    ],
  },
  {
    id: "adv-filter-open",
    title: "Filter-open: Losing It → Ferrari",
    time: "~15 min",
    level: "Advanced",
    trackRecipe:
      "SONG SHEET (use these exact titles in Apple Music / TIDAL / Beatport inside djay — prefer Original/Extended when both exist; times below are for the common ~3–4 min streaming masters — always confirm on the waveform).\n\nDeck 1 (outgoing): FISHER – Losing It · ~125 BPM\n• Hot Cue 1 → first kick of DROP 1 (~0:58–1:05) — big bass enters after the “whoa” tease\n• Hot Cue 2 → first kick of DROP 2 (~1:55–2:05)\n• Practice zone: the 8–16 bar build into Drop 2 (~1:40–2:00)\n\nDeck 2 (incoming): James Hype & Miggy Dela Rosa – Ferrari · ~125–126 BPM\n• Hot Cue 1 → first kick of the MAIN DROP (often ~0:48–1:05 after the “Ferrari” vocal hook — zoom the waveform and land on beat 1 of that phrase)\n\nBackup pair if you can’t find those: Dom Dolla – Saving Up (A) → Chris Lake – Turn Off The Lights (feat. stef) (B), same idea (build → thin filter → open on B’s drop).",
    summary:
      "Concrete club move: hold Losing It’s build, bring Ferrari in thin, open the filter as Ferrari’s drop hits.",
    needs: [
      "Hot Cue + Loop + Filter + crossfader",
      "Headphones + split output strongly recommended",
      "Both tracks loaded from a streaming service djay supports",
    ],
    steps: [
      {
        title: "Load the exact tracks",
        djay: "Deck 1: FISHER – Losing It. Deck 2: James Hype – Ferrari. Check BPM readouts (~125). Turn Key Lock on (musical note) so SYNC doesn’t wreck the key.",
        hardware: "Browser → load left, then right. Crossfader hard LEFT. Deck 1 channel up, Deck 2 channel down.",
        expect: "Two tech/house bangers, nearly the same tempo.",
      },
      {
        title: "Plant Losing It cues (Deck 1)",
        hardware:
          "HOT CUE mode. Scrub/jog to ~1:00 — find the first fat kick of Drop 1 → tap pad 1. Scrub to ~2:00 — first kick of Drop 2 → tap pad 2. Play from pad 1 once to verify it slams on the One.",
        djay: "You should see two hot-cue markers. If your edit’s times differ, trust the waveform peaks, not the clock.",
        expect: "Pad 1 = Drop 1, Pad 2 = Drop 2.",
      },
      {
        title: "Plant Ferrari’s drop (Deck 2)",
        hardware:
          "Deck 2 HOT CUE. Find the main drop (after the vocal says “Ferrari” / energy jumps). Land on beat 1 of that bar → tap pad 1. Press SYNC on Deck 2.",
        expect: "Deck 2 Hot Cue 1 is a nuclear drop button. BPMs matched.",
      },
      {
        title: "Ride Losing It into the Drop-2 build",
        hardware:
          "Crossfader left. Play Deck 1 from somewhere before Drop 2 (e.g. after Drop 1, ~1:30). When you hit the build (~1:40+), if you need time: LOOP → tap the 2-bar or 4-bar pad once and hold the groove.",
        listen: "Energy rising, still only Losing It in the room.",
        expect: "You’re parked in the build (or looping it). Don’t go into Drop 2 yet unless you’re ready.",
      },
      {
        title: "Prep Ferrari thin in headphones",
        hardware:
          "Headphones on Deck 2. From Hot Cue 1, start Ferrari. FILTER: turn clockwise ~1/4–1/3 (high-pass / thin). LOW: turn down a bit. Keep Deck 2 channel fader low / crossfader left so the room doesn’t hear it yet.",
        listen: "In cans: Ferrari sounds lighter — kick/bass reduced. That’s intentional.",
        expect: "B is armed on the drop, EQ/filter making room for a bass handoff.",
      },
      {
        title: "Open the filter into Ferrari’s drop (8–16 beats)",
        hardware:
          "On a phrase boundary (exit the Losing It loop on a One if you used one): hit Deck 2 Hot Cue 1 + raise Deck 2 channel / ease crossfader toward center→right. Over the next 8–16 beats: slowly return FILTER to 12 o’clock and bring LOW back up. Fade Deck 1 out (or kill Deck 1 LOW first).",
        listen: "Ferrari “blooms” from thin → full as the drop lands. Losing It leaves without a bass fight.",
        expect: "Clean energy lift. Reset both decks’ Filter + EQ to center. Press HOT CUE so you’re not stuck in LOOP.",
        tip: "If the drops felt early/late, only move Hot Cue 1 on Ferrari by a beat and retry from Losing It pad 2’s build — don’t change ten things at once.",
      },
    ],
  },
  {
    id: "adv-echo-vocal",
    title: "Echo-out: One Kiss → Head & Heart",
    time: "~12 min",
    level: "Advanced",
    trackRecipe:
      "SONG SHEET (common radio/streaming edits — confirm lines on the waveform).\n\nDeck 1 (outgoing): Calvin Harris & Dua Lipa – One Kiss · ~124 BPM · ~3:40\n• Find the LAST full chorus before the outro (often ~2:30–3:10). Landmark lyric: “One kiss is all it takes”\n• Hot Cue 1 → downbeat (beat 1) of that final chorus phrase you want to echo out of\n• Hot Cue 2 (optional) → start of the outro / last “one kiss…” if you want a shorter sting\n\nDeck 2 (incoming): Joel Corry x MNEK – Head & Heart · ~123 BPM\n• Hot Cue 1 → downbeat of the FIRST chorus (the “Oh na-na…” / “head and my heart” hook — often ~0:45–1:05 on radio edits; Extended mixes place it later)\n\nBackup: Dua Lipa – Don’t Start Now (A, last “don’t start now” chorus) → The Weeknd – Blinding Lights (B, chorus downbeat) — use SYNC + Key Lock; BPMs differ more.",
    summary:
      "Wash Dua Lipa’s last “One kiss…” with echo while Head & Heart’s chorus takes the room.",
    needs: [
      "FX mode with Echo assigned to pad 1 in djay",
      "Headphones recommended",
      "Comfortable with Hot Cue + channel fader",
    ],
    steps: [
      {
        title: "Assign Echo to FX pad 1",
        djay: "Rotate to landscape → open FX → set Deck 1 slot 1 to Echo (or Delay). Remember: pad 1 = echo.",
        hardware: "Press FX (solid LED). Tap-hold pad 1 once briefly to confirm you hear echo, then release.",
        expect: "You know which pad is echo before the mix.",
      },
      {
        title: "Mark One Kiss’s last chorus",
        hardware:
          "Deck 1 HOT CUE. Scrub until you hear the late chorus “One kiss is all it takes” that leads toward the end. Jog to beat 1 of that bar → tap pad 1. Play from pad 1 to confirm Dua’s line starts on the One.",
        expect: "Pad 1 always restarts that last-chorus phrase.",
        tip: "If you grabbed a mid-song chorus by mistake, keep scrubbing later — you want the one that doesn’t have a full drop after it.",
      },
      {
        title: "Mark Head & Heart’s chorus",
        hardware:
          "Deck 2 HOT CUE. Find first chorus hook → beat 1 → tap pad 1. Press SYNC. Key Lock on.",
        djay: "BPMs should read close (~123–124). Headphones cue Deck 2.",
        expect: "Deck 2 pad 1 = chorus nuclear button.",
      },
      {
        title: "Practice the echo gesture alone",
        hardware:
          "Only Deck 1 in the room. From Hot Cue 1, play the line. At the end of “takes” (or end of the phrase): HOLD FX pad 1, pull Deck 1 channel fader down smoothly, RELEASE echo as trails die. Don’t bring Deck 2 in yet.",
        listen: "Vocal should wash into space, not cut like a mute button.",
        expect: "Echo timing feels natural. Reset fader up, leave FX mode only after you’re happy.",
      },
      {
        title: "Full handoff into Head & Heart",
        hardware:
          "Deck 1 playing the last chorus in the room. Deck 2 waiting on Hot Cue 1 in headphones, channel ready, LOW slightly down. When the echo-out starts: HOLD echo → fade Deck 1 → RELEASE. Almost simultaneously tap Deck 2 Hot Cue 1 and raise Deck 2 so MNEK’s chorus enters in the hole.",
        listen: "“One kiss…” trails → “head and my heart” / na-na hook arrives. No silent gap.",
        expect: "Radio-style vocal handoff. Press HOT CUE on Deck 1 so you’re not stuck in FX. Reset EQ.",
      },
    ],
  },
  {
    id: "adv-vocal-swap",
    title: "Neural mashup: Head & Heart × One Kiss",
    time: "~15 min",
    level: "Advanced",
    trackRecipe:
      "SONG SHEET — same two vocals as the echo tutorial, different technique.\n\nDeck 1 (bed / beat): Joel Corry x MNEK – Head & Heart · ~123 BPM\n• Hot Cue 1 → downbeat of a CHORUS (same landmark as before, ~0:45–1:05 on many radio edits)\n• You’ll MUTE VOCALS on this deck (bottom Neural pad lit) so the groove stays\n\nDeck 2 (guest vocal): Calvin Harris & Dua Lipa – One Kiss · ~124 BPM\n• Hot Cue 1 → downbeat of a CHORUS (“One kiss is all it takes”)\n• Keep vocals; optionally MUTE DRUMS on Deck 2 so Head & Heart’s kick leads\n\nSYNC Deck 2 to Deck 1, Key Lock on. Practice 8–16 bars of overlap, not a whole song.\n\nBackup mashup: Meduza – Piece Of Your Heart (bed, mute vocals) × Meduza / Goodboys – Lose Control (keep vocals).",
    summary:
      "Mute MNEK’s vocal, ride Dua Lipa over Head & Heart’s beat — live mashup with Neural Mix pads.",
    needs: [
      "Neural Mix pad mode (solid LED) — know bottom lit = mute ON",
      "Optional: /labs/neural-pads first",
      "Both tracks available in djay",
    ],
    steps: [
      {
        title: "Load + cue the choruses",
        hardware:
          "Deck 1: Head & Heart → Hot Cue 1 on chorus One. Deck 2: One Kiss → Hot Cue 1 on chorus One. SYNC Deck 2. Crossfader center-ish for practice, or keep 2 low until ready.",
        expect: "Both pads restart chorus downbeats. Tempos locked.",
        lab: "Skim /labs/neural-pads if mute lights still feel backwards.",
      },
      {
        title: "Start the bed (full mix, all Neural pads dark)",
        hardware:
          "Deck 1 Neural pads: all dark. Play from Hot Cue 1 — full Head & Heart chorus in the room. Deck 2 still down.",
        expect: "Normal chorus. Home base = all pads dark.",
      },
      {
        title: "Mute Head & Heart vocals",
        hardware:
          "Deck 1 → NEURAL MIX (solid, not flashing). Tap the bottom VOCALS pad once so it LIGHTS. (If stem order is 3-part, vocals are usually the rightmost bottom pad — watch djay’s stem labels.)",
        listen: "MNEK’s vocal drops out; drums/music continue. If the wrong stem died, tap that pad off and try the neighboring bottom pad.",
        expect: "Bottom vocals LIT = mute on. Instrumental-ish bed.",
      },
      {
        title: "Bring One Kiss vocals over the bed",
        hardware:
          "Deck 2 from Hot Cue 1 on the One. Raise channel / ease in. Optional: Deck 2 NEURAL MIX → tap bottom DRUMS so it LIGHTS (mute Deck 2 kick) so you don’t get double kick.",
        listen: "Dua Lipa over Joel Corry’s groove. Adjust channel faders until it feels like one record.",
        expect: "Mashup pocket for ~8–16 bars. If keys clash badly, bail earlier — still good practice.",
      },
      {
        title: "Exit clean (don’t leave mutes on)",
        hardware:
          "Pick a winner (usually fade Deck 1). On BOTH decks: tap every lit Neural pad until ALL DARK. Restore LOW/Filter. Leave Neural mode (HOT CUE).",
        expect: "Next song won’t mysteriously miss vocals/drums. Mashup was a moment.",
      },
    ],
  },
  {
    id: "adv-double-drop",
    title: "Double-drop: Losing It × Drugs From Amsterdam",
    time: "~12 min",
    level: "Advanced",
    trackRecipe:
      "SONG SHEET — peak-time tech house stunt (loud — watch gain).\n\nDeck 1: FISHER – Losing It · ~125 BPM\n• Hot Cue 1 → first kick of DROP 1 (~0:58–1:05)\n• Hot Cue 2 → ~8–16 bars BEFORE that drop (start of the build / last “whoa” section) so you can ride the build live\n\nDeck 2: Mau P – Drugs From Amsterdam · ~126 BPM (Original/Extended if available)\n• Hot Cue 1 → first kick of the MAIN DROP (commonly ~0:55–1:10 — find the moment the bassline fully locks in; Extended mixes shift later)\n\nSYNC Deck 2, Key Lock on. You’re aiming for both drop kicks on the same One for 8–16 beats only.\n\nBackup pair: Martin Garrix – Animals (A, drop ~1:00–1:05) × R3HAB – Soundwave or another ~128 BPM big-room drop (B).",
    summary:
      "Line up two famous drops on Hot Cue 1, slam them together for a phrase, then peel one away.",
    needs: [
      "SYNC + Hot Cue confidence",
      "Headphones",
      "Willingness to retry timing 5–10 times",
    ],
    steps: [
      {
        title: "Mark both drop kicks",
        hardware:
          "Deck 1: Losing It Hot Cue 1 on Drop 1’s first kick; Hot Cue 2 on the build before it. Deck 2: Drugs From Amsterdam Hot Cue 1 on main drop’s first kick. SYNC Deck 2.",
        djay: "Zoom waveforms — the cue triangle/marker should sit on a transient peak, not a soft lead-in.",
        expect: "Each pad 1 is a drop detonator.",
      },
      {
        title: "Rehearse each drop alone",
        hardware:
          "Tap Deck 1 pad 1 — confirm Losing It explodes on the One. Tap Deck 2 pad 1 in headphones — same. If either feels early, nudge the cue one beat later and retest.",
        expect: "Solo drops feel locked before you combine them.",
      },
      {
        title: "Ride the Losing It build",
        hardware:
          "Room = Deck 1 only (crossfader left). Start from Hot Cue 2 (build). Deck 2 paused on Hot Cue 1 in headphones, channel fader down, finger ready on pad 1 + fader.",
        listen: "Build tension. Count 1–2–3–4 into the drop.",
        expect: "You’re waiting for Losing It’s Drop 1 One — not guessing.",
      },
      {
        title: "Detonate together (8–16 beats max)",
        hardware:
          "On the One into Losing It’s drop: Deck 1 is already hitting pad 1 / natural drop. Simultaneously tap Deck 2 Hot Cue 1 and slam Deck 2 channel up (or crossfader to center). Ride BOTH for only 8–16 beats (2–4 bars × 2).",
        listen: "Double kick impact. If it’s a flammed mess, kill Deck 2, fix cue by ±1 beat, retry from Hot Cue 2.",
        expect: "Tight double for a short phrase — then get out. Longer = muddy.",
      },
      {
        title: "Peel to one drop",
        hardware:
          "Choose a keeper (usually Deck 2 for the fresher track). On the outgoing deck: turn LOW fully down or Neural-mute drums, then fade that channel. Leave the keeper’s drop running. Reset EQ/Neural; back to HOT CUE.",
        listen: "Stunt → clarity. One bassline returns.",
        expect: "Festival toy used with taste. Practice until the double is tight before showing anyone.",
      },
    ],
  },
  {
    id: "adv-kpdh-filter",
    title: "KPop Demon Hunters: Soda Pop → Golden",
    time: "~15 min",
    level: "Advanced",
    trackRecipe:
      "SONG SHEET — search the KPop Demon Hunters soundtrack in Apple Music / TIDAL (not always on every service).\n\nDeck 1 (outgoing): Saja Boys – Soda Pop · ~126 BPM · ~2:30\n• Hot Cue 1 → first chorus downbeat (the big “soda pop” hook — often ~0:28–0:40)\n• Hot Cue 2 → second chorus / last full hook before the end (~1:20–1:40)\n• Practice from Cue 2 so you have a short runway\n\nDeck 2 (incoming): HUNTR/X – Golden · ~123 BPM · ~3:14\n• Hot Cue 1 → first chorus / “golden” hook downbeat (often ~0:40–0:55 — land on beat 1 of the phrase, not the pre-chorus)\n• Hot Cue 2 (optional) → drop/energy jump if your edit has a clearer second hit (~1:30–1:50)\n\nSYNC Deck 2 to Deck 1. Key Lock ON. Times move around by a few seconds on sing-along vs original — trust the waveform peak.\n\nBackup: HUNTR/X – Takedown (~140 BPM) as Deck 2 if Golden isn’t in your library (SYNC will stretch more).",
    summary:
      "Party soundtrack mix: loop Soda Pop’s hook, bring Golden in thin, open the filter as the HUNTR/X chorus hits.",
    needs: [
      "KPop Demon Hunters OST in djay",
      "Hot Cue + Loop + Filter + SYNC",
      "Headphones recommended",
    ],
    steps: [
      {
        title: "Load Soda Pop and Golden",
        djay: "Search “KPop Demon Hunters”. Deck 1: Soda Pop (Saja Boys). Deck 2: Golden (HUNTR/X). Key Lock on. Note BPMs (~126 vs ~123).",
        hardware: "Load left then right. Crossfader LEFT. Deck 1 up, Deck 2 down.",
        expect: "Two OST bangers, close enough for SYNC.",
      },
      {
        title: "Mark Soda Pop’s hooks",
        hardware:
          "Deck 1 HOT CUE. Scrub to the first big chorus (~0:30) → tap pad 1 on beat 1. Scrub to the later chorus (~1:30) → tap pad 2. Play pad 1 to confirm the hook starts on the One.",
        expect: "Pad 1 = first hook, Pad 2 = later hook (your mix-out).",
      },
      {
        title: "Mark Golden’s chorus",
        hardware:
          "Deck 2 HOT CUE. Find the first “golden” chorus downbeat → tap pad 1. Press SYNC. Play pad 1 in headphones — it should slam on the One.",
        expect: "Deck 2 pad 1 is Golden’s chorus detonator.",
      },
      {
        title: "Ride Soda Pop; loop if you need time",
        hardware:
          "Play Deck 1 from pad 2 (later hook). LOOP → tap the 2-bar or 4-bar pad once if you need extra bars of “soda pop” groove.",
        listen: "Kids/party energy, still only Saja Boys in the room.",
        expect: "Stable hook. Crossfader still left.",
      },
      {
        title: "Prep Golden thin in headphones",
        hardware:
          "Cue Deck 2 headphones. From Hot Cue 1, start Golden. FILTER clockwise ~1/4 (thin). LOW down a little. Channel still down.",
        listen: "In cans: Golden sounds lighter so two choruses don’t fight on bass.",
        expect: "Armed on the chorus, filter/EQ making space.",
      },
      {
        title: "Open into Golden (8–16 beats)",
        hardware:
          "On a One (exit Soda Pop loop if you used one): tap Deck 2 pad 1, raise Deck 2 / ease crossfader right. Over 8–16 beats, FILTER back to center and LOW up. Fade Soda Pop out.",
        listen: "Saja Boys groove → HUNTR/X chorus blooms. Soundtrack-set energy lift.",
        expect: "Clean OST handoff. Reset Filter/EQ. Back to HOT CUE.",
        tip: "If Golden felt late, your chorus cue is probably in the pre-chorus — nudge pad 1 later onto the first chorus kick.",
      },
    ],
  },
  {
    id: "adv-kpdh-neural",
    title: "KPop Demon Hunters mashup: Golden × Soda Pop",
    time: "~15 min",
    level: "Advanced",
    trackRecipe:
      "SONG SHEET — same two KPDH tracks, Neural Mix this time.\n\nDeck 1 (bed): HUNTR/X – Golden · ~123 BPM\n• Hot Cue 1 → chorus downbeat (~0:40–0:55)\n• You will MUTE VOCALS (bottom Neural pad LIT) so the instrumental/groove stays\n\nDeck 2 (guest vocal): Saja Boys – Soda Pop · ~126 BPM\n• Hot Cue 1 → chorus downbeat (~0:28–0:40)\n• Keep vocals; optionally MUTE DRUMS on Deck 2 so Golden’s beat leads\n\nSYNC Soda Pop to Golden. Key Lock ON. Mash only 8–16 bars — keys may clash; that’s OK for practice.\n\nBonus if you have instrumentals: the OST includes Golden / Soda Pop instrumentals — even cleaner beds.\n\nBackup: mute vocals on How It’s Done (~160 BPM) and ride Golden (~123) — wider BPM stretch; SYNC + Key Lock required.",
    summary:
      "Mute HUNTR/X vocals, ride Saja Boys’ hook over Golden’s beat — live OST mashup.",
    needs: [
      "Neural Mix pads (bottom lit = mute ON)",
      "Golden + Soda Pop in djay",
    ],
    steps: [
      {
        title: "Cue both choruses",
        hardware:
          "Deck 1 Golden Hot Cue 1 on chorus One. Deck 2 Soda Pop Hot Cue 1 on chorus One. SYNC Deck 2.",
        expect: "Both pads restart hooks. Tempos locked.",
        lab: "/labs/neural-pads if mute lights still feel backwards.",
      },
      {
        title: "Play Golden full (all pads dark)",
        hardware:
          "Deck 1 Neural pads dark. Play Golden from pad 1. Deck 2 down. Crossfader left or center-low.",
        expect: "Normal Golden chorus. Home = all dark.",
      },
      {
        title: "Mute Golden vocals",
        hardware:
          "Deck 1 NEURAL MIX (solid). Tap bottom VOCALS once so it LIGHTS. Watch djay stem labels if the wrong part vanished.",
        listen: "Golden continues as a bed; lead vocal gone.",
        expect: "Instrumental-ish HUNTR/X groove.",
      },
      {
        title: "Bring Soda Pop vocals over it",
        hardware:
          "Deck 2 from Hot Cue 1 on the One. Raise in. Optional: Deck 2 Neural Mix → tap bottom DRUMS LIT so you don’t get two kicks.",
        listen: "Saja Boys hook over Golden’s production. Ride faders 8–16 bars.",
        expect: "Silly/fun mashup pocket. Bail if it turns to soup.",
      },
      {
        title: "Exit — all Neural pads dark",
        hardware:
          "Fade one deck. Tap every lit Neural pad on BOTH decks until dark. HOT CUE mode. Reset EQ.",
        expect: "Next song has vocals and drums again.",
      },
    ],
  },
  {
    id: "adv-disney-bruno",
    title: "Disney Encanto: Bruno echo → Surface Pressure",
    time: "~12 min",
    level: "Advanced",
    trackRecipe:
      "SONG SHEET — Encanto soundtrack (search “From Encanto”).\n\nDeck 1 (outgoing): Encanto Cast – We Don’t Talk About Bruno · ~103 BPM · ~3:36\n• Landmark: the group chorus “We don’t talk about Bruno, no, no, no…”\n• Hot Cue 1 → downbeat of a MID-SONG chorus (often ~0:50–1:10 after Pepa’s verse)\n• Hot Cue 2 → a LATE chorus before the ending pile-up (~2:20–2:50) — use this for the echo-out\n• Don’t cue the spoken/theatrical intro — you want the sung hook on beat 1\n\nDeck 2 (incoming): Jessica Darrow – Surface Pressure · ~90–91 BPM · ~3:20\n• Landmark: first big “pressure like a drip, drip, drip…” chorus\n• Hot Cue 1 → chorus downbeat (often ~0:45–1:05)\n\nBPM gap is real (~103 → ~91). SYNC Deck 2 + Key Lock ON so Surface Pressure doesn’t chipmunk/slow-warble more than needed. Practice the echo on Bruno alone first.\n\nBackup same-movie: Bruno → The Family Madrigal (closer energy, still theatrical).",
    summary:
      "Echo out Encanto’s Bruno hook, then land Surface Pressure’s chorus — Disney-night vocal handoff.",
    needs: [
      "Encanto OST in djay",
      "FX Echo on pad 1",
      "SYNC + Key Lock (BPM gap)",
    ],
    steps: [
      {
        title: "Load Encanto tracks + Echo",
        djay: "Deck 1: We Don’t Talk About Bruno. Deck 2: Surface Pressure. Landscape → FX → Echo on Deck 1 slot 1. Key Lock on.",
        hardware: "Crossfader left. Confirm FX pad 1 with a short HOLD (you should hear echo), then release.",
        expect: "Echo assigned. Two Encanto bangers loaded.",
      },
      {
        title: "Mark Bruno’s late chorus",
        hardware:
          "Deck 1 HOT CUE. Scrub until the full-cast “We don’t talk about Bruno, no, no, no” that sits late (not the first tiny hit). Jog to beat 1 → tap pad 2. Earlier chorus → pad 1 for practice.",
        expect: "Pad 2 = mix-out chorus. Pad 1 = easier rehearsal chorus.",
        tip: "If you landed on dialogue, keep jogging — you want sung downbeat, not a spoken pickup.",
      },
      {
        title: "Mark Surface Pressure’s chorus",
        hardware:
          "Deck 2 HOT CUE. Find the first full “pressure” chorus → beat 1 → tap pad 1. Press SYNC.",
        expect: "Deck 2 pad 1 = Luisa’s chorus. BPM pulled toward Bruno.",
      },
      {
        title: "Practice echo-out on Bruno only",
        hardware:
          "Play Deck 1 from pad 2. At the end of “no, no, no”: HOLD FX pad 1, pull Deck 1 fader down, RELEASE as the trail dies. Don’t bring Deck 2 yet.",
        listen: "Hook washes away instead of a hard mute — very “end of the number.”",
        expect: "Echo timing feels theatrical-on-purpose.",
      },
      {
        title: "Handoff into Surface Pressure",
        hardware:
          "Deck 1 on the late chorus in the room. Deck 2 waiting on pad 1 in headphones, LOW a bit down. Echo-out Bruno → tap Deck 2 pad 1 and raise fader so Luisa’s chorus fills the space.",
        listen: "Bruno trail → Surface Pressure chorus. Family-movie DJ night.",
        expect: "No silent hole. Leave FX (press HOT CUE). Reset EQ. Expect a little tempo stretch — that’s the Encanto tax.",
      },
    ],
  },
  {
    id: "adv-kids-party",
    title: "Kids party: Try Everything → Can’t Stop the Feeling!",
    time: "~12 min",
    level: "Advanced",
    trackRecipe:
      "SONG SHEET — easy BPM pair for a birthday / Disney-adjacent set.\n\nDeck 1 (outgoing): Shakira – Try Everything (Zootopia) · ~115 BPM · ~3:16\n• Landmark: chorus “I won’t give up, no I won’t give in…” / title hook\n• Hot Cue 1 → first chorus downbeat (often ~0:40–0:55)\n• Hot Cue 2 → last full chorus before the end (~2:20–2:40)\n\nDeck 2 (incoming): Justin Timberlake – Can’t Stop the Feeling! (Trolls / radio) · ~113 BPM · ~3:56\n• Landmark: “I got this feeling in my body…” chorus\n• Hot Cue 1 → first chorus downbeat (often ~0:45–1:05 on radio edits)\n\nSYNC Deck 2. Key Lock ON. Filter-open or simple EQ blend — both are upbeat kids-floor tracks.\n\nBackup: Try Everything → Moana – You’re Welcome (~97 BPM, bigger stretch) or Encanto – We Don’t Talk About Bruno (~103).",
    summary:
      "Zootopia into Trolls: last Try Everything chorus, thin-filter Can’t Stop the Feeling, open as the hook hits.",
    needs: [
      "Both songs in djay (very common on Apple Music)",
      "Hot Cue + Filter + SYNC",
    ],
    steps: [
      {
        title: "Load the party pair",
        djay: "Deck 1: Try Everything (Zootopia). Deck 2: Can’t Stop the Feeling! Key Lock on. BPMs ~115 and ~113.",
        hardware: "Crossfader left. Deck 1 up.",
        expect: "Two “kids will scream” choruses, almost the same tempo.",
      },
      {
        title: "Plant Shakira’s choruses",
        hardware:
          "Deck 1 HOT CUE. First chorus (~0:45) → pad 1 on beat 1. Last full chorus (~2:30) → pad 2.",
        expect: "Pad 2 is your mix-out.",
      },
      {
        title: "Plant Timberlake’s chorus",
        hardware:
          "Deck 2 HOT CUE. First “feeling in my body” chorus → pad 1. SYNC.",
        expect: "Deck 2 pad 1 = party detonator.",
      },
      {
        title: "Ride Try Everything into the last chorus",
        hardware:
          "Play from pad 2. Optional: LOOP 4 bars on the chorus if you need time to cue Deck 2.",
        listen: "Room is still Zootopia. Count phrases (8 or 16 bars).",
        expect: "You’re not mixing from a verse by accident.",
      },
      {
        title: "Bring in Can’t Stop the Feeling thin, then open",
        hardware:
          "Headphones Deck 2 from pad 1. FILTER right a bit, LOW down. On a One: start Deck 2, raise fader / crossfader. Over 8–16 beats, FILTER to center, LOW up, fade Shakira.",
        listen: "Try Everything → Trolls chorus bloom. Birthday-mode successful.",
        expect: "Simple, loud, on-phrase. Reset Filter/EQ.",
      },
    ],
  },
];
