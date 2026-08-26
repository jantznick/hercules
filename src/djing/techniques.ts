import type { GenreId } from "./genres";
import type { SourceVideoId } from "./videos";

export type TechniqueGroupId = "match-speed" | "same-speed" | "jump" | "vocal-peak" | "one-song";

export type NamedTechnique = {
  id: string;
  group: TechniqueGroupId;
  title: string;
  what: string;
  goodFor: string;
  mixUltra: string;
  more?: { to: string; label: string }[];
  labs?: { to: string; label: string }[];
  tutorials: string[];
  sourceVideos?: SourceVideoId[];
};

/** Two-song Mix index. One-song lives on `/djing/remix`. */
export const MIX_TECHNIQUE_GROUP_IDS: TechniqueGroupId[] = [
  "match-speed",
  "same-speed",
  "jump",
  "vocal-peak",
];

export function techniquePath(tech: NamedTechnique): string {
  return tech.group === "one-song" ? `/djing/remix#${tech.id}` : `/djing/techniques#${tech.id}`;
}

export const TECHNIQUE_GROUPS: {
  id: TechniqueGroupId;
  title: string;
  blurb: string;
}[] = [
  {
    id: "match-speed",
    title: "Match the speed",
    blurb:
      "Two jobs: same BPM, and kicks hitting together. SYNC is a shortcut. The tempo fader and jog wheel are the real controls.",
  },
  {
    id: "same-speed",
    title: "Same speed, two songs",
    blurb:
      "Both songs running at the same speed — matched by hand, or with SYNC if you want the shortcut.",
  },
  {
    id: "jump",
    title: "When speeds don’t match",
    blurb:
      "A ballad into a banger, 90 into 124 — you still leave on purpose.",
  },
  {
    id: "vocal-peak",
    title: "Vocals, two songs at once, loud moments",
    blurb:
      "One singer at a time unless you meant to stack them on purpose. Two drops at once is a few bars, not a whole song.",
  },
  {
    id: "one-song",
    title: "One song (remix & hype)",
    blurb:
      "No second track required. Jump, loop, filter, echo, mute — then reset. One trick at a time.",
  },
];

export const TECHNIQUE_INTRO: Record<GenreId, string> = {
  any: "Match speed first with the tempo fader and jog. Leave SYNC off. Then the same-speed mixes until slow faders feel normal. When the next file can’t share a speed, stop it on purpose, walk the tempo, or loop a few bars as a bridge.",
  house:
    "Long blend and bass swap are the mixes you’ll use most. A 32-beat drum intro over the last loud part (still with kick and bass) keeps energy up. Filter-open and the drop mix are for the loudest part of the night. Echo-out is an exit — not something to do every eight bars.",
  hiphop:
    "Echo-out and a short cut on beat 1. Don’t stack rappers. Bass swap only for the bars you overlap. If the next song isn’t the same speed, stop the old one on purpose or cut — don’t stretch a verse to 124 for a minute.",
  pop: "Echo-out the title, then the next chorus. Radio and soundtrack files rarely have long drum intros. Loop and replay a hook more often than a 32-bar blend. Stop-and-start when the speeds are far apart.",
  dnb: "Bass swap and drop mix, but faster. A “long” blend is a phrase or two. Two drops at once is a few seconds, then pick one. Mix Ultra has no Pioneer rekordbox roll pad — don’t hunt for it. Stop-and-start, or a song in between, when you leave 170.",
};

export const TECHNIQUES: NamedTechnique[] = [
  {
    id: "manual-beatmatch",
    group: "match-speed",
    title: "Match BPM by hand",
    what: "Leave SYNC off. Move the incoming deck’s tempo fader until both songs run at the same speed, then nudge the jog so the kicks hit together. Start the incoming song on beat 1.",
    goodFor:
      "Any same-speed mix you want to own with your ears. Two songs close in BPM (a few beats apart is a good drill). You’ll hear when a beat grid is wrong — SYNC would have hidden that.",
    mixUltra:
      "Tempo fader next to the jog; center is original speed. Headphones on the incoming deck, channel fader down. Do not tap CUE while that song is playing — it usually stops. Widen the tempo range in djay if the fader can’t reach.",
    more: [
      { to: "/djing/beatmatch", label: "Full steps" },
      { to: "/settings", label: "djay settings" },
    ],
    labs: [{ to: "/labs/beatmatch", label: "Beatmatch" }],
    tutorials: ["mix-manual-beatmatch", "mix-beat-grid", "two-deck-blend"],
    sourceVideos: ["blakey5"],
  },
  {
    id: "tempo-vs-pitch",
    group: "match-speed",
    title: "Tempo vs how high the notes sound",
    what: "There is no pitch SYNC and no manual pitch-matching. Beatmatching is the tempo fader (speed) and the jog (kicks together). Key Lock (musical note in djay) only keeps this song’s notes from going thin and high while you change speed. Matching two songs’ musical keys is picking files — djay can show a key; no Mix Ultra button locks them together.",
    goodFor:
      "Whenever you move a tempo fader more than a hair, and you still want the singer to sound like themselves. Matching keys is optional taste, not a requirement for a party.",
    mixUltra:
      "Key Lock is in djay, not a labeled Mix Ultra button. Pitch Play pads jump the key of a loop — remix, not beat matching. Vinyl people call the tempo slider a “pitch fader” because speed and notes used to be glued; Key Lock unglues them.",
    more: [
      { to: "/djing/beatmatch#pitch", label: "Full steps" },
      { to: "/djing/eq", label: "EQ, bass & filter" },
    ],
    labs: [{ to: "/labs/pads", label: "Pad modes" }],
    tutorials: ["mix-key-lock", "mix-manual-beatmatch"],
  },
  {
    id: "long-blend",
    group: "same-speed",
    title: "Long blend",
    what: "The incoming song comes up slowly, the outgoing song goes down slowly. Channel faders only — no EQ, Echo, or Filter. Slow hands make one song turn into the other.",
    goodFor:
      "Two files that still have drums for the whole fade (club / extended mixes). Same style, similar speed. First mix to get clean before you collect other moves.",
    mixUltra:
      "Incoming in headphones. Match speed with the tempo fader (or SYNC if you want the shortcut), start on beat 1 with Play or hot cue 1. Do not tap CUE while that song is playing — it usually stops and returns. Leave while the old track still has a kick.",
    more: [{ to: "/djing/transitions#long-blend", label: "Full steps" }],
    labs: [
      { to: "/labs/incoming-cue", label: "Incoming cue (Deck 2)" },
      { to: "/labs/blend", label: "Two-deck blend" },
    ],
    tutorials: ["mix-long-blend", "two-deck-blend"],
    sourceVideos: ["blakey5"],
  },
  {
    id: "bass-swap",
    group: "same-speed",
    title: "Bass swap",
    what: "Same overlap as a blend, but only one bassline. Incoming LOW is turned left before that song is heard. On a later beat 1 you swap: old LOW left, new LOW back to 12 o’clock, then fade the old fader.",
    goodFor:
      "Any time two kicks would overlap for more than a few seconds. House and drum & bass live here. Skip a long swap on short pop/hip-hop overlaps — cut or echo instead.",
    mixUltra:
      "LOW is the bass knob (there isn’t a separate “bass EQ”). In djay Sound settings, EQ type Isolator can silence bass completely; Classic still lets a little through. SHIFT+HIGH is Gain, not HIGH EQ.",
    more: [
      { to: "/djing/transitions#bass-swap", label: "Full steps" },
      { to: "/djing/eq", label: "EQ, bass & filter" },
    ],
    labs: [
      { to: "/labs/eq", label: "Bass kill (LOW)" },
      { to: "/labs/incoming-cue", label: "Incoming cue (Deck 2)" },
      { to: "/labs/blend", label: "Two-deck blend" },
    ],
    tutorials: ["mix-bass-swap", "mix-gain", "mix-in-mix-out", "two-deck-blend"],
    sourceVideos: ["blakey5", "carlo3"],
  },
  {
    id: "intro-over-chorus",
    group: "same-speed",
    title: "Intro over the last groove",
    what: "Start the new song’s drum intro on beat 1 of the old song’s still-loud part (often a chorus or last full groove). Count 8 bars — that’s 32 beats — then get the old song out. Not intro-over-dying-outro (two empty sections).",
    goodFor:
      "House/techno with a real DJ intro. This is how you keep a kick in the room. Radio edits often don’t have 32 beats of drums — then this window is too short.",
    mixUltra:
      "Plant hot cue 4 on the last loud part that still has kick and bass (beat 1) and hot cue 1 on the incoming intro. Incoming LOW a bit left. Finish with a bass swap, Echo, or Filter-right on the old deck.",
    more: [
      { to: "/djing/mixing", label: "Mix in / mix out" },
      { to: "/djing/phrasing", label: "Phrases & beat 1" },
    ],
    tutorials: ["mix-32-window", "mix-in-mix-out", "mix-three-song-set"],
    sourceVideos: ["carlo3"],
  },
  {
    id: "filter-open-in",
    group: "same-speed",
    title: "Filter-open into the new drop",
    what: "The old song is in a build. The new song starts thin (Filter to the right, LOW left). As the new drop hits, you sweep Filter back to 12 o’clock and bring bass back so the new song opens up in the room.",
    goodFor:
      "When the room is already loud and you want the new drop to arrive as a lift, not a hard cut. Needs a clear build on the old file and a clear drop on the new one.",
    mixUltra:
      "Filter right = thinner / less bass. Filter left = muffled. 12 o’clock = leave the song alone. Reset both decks when you’re done.",
    more: [{ to: "/djing/eq", label: "EQ, bass & filter" }],
    labs: [{ to: "/labs/filter", label: "Filter" }],
    tutorials: ["adv-filter-open", "adv-kpdh-filter", "filter-sweep"],
    sourceVideos: ["carlo3"],
  },
  {
    id: "drop-mix",
    group: "same-speed",
    title: "Drop mix (skip their payoff)",
    what: "The room thinks the old drop or last chorus is coming. On that beat 1 you pull the old fader down and start the new song on its drop or chorus instead. You skipped their climax and landed yours.",
    goodFor:
      "When the old payoff is about to hit and you’d rather give them a new one. Timing has to be exact — two beats late feels drunk even with SYNC on. Different job from filter-open (that one opens into the new drop; this one never lets the old one hit).",
    mixUltra:
      "Mark the new drop as hot cue 2. Ride the old build. On beat 1: old fader down, tap the new drop, new fader up. Almost together.",
    more: [{ to: "/djing/transitions#drop-mix", label: "Full steps" }],
    tutorials: ["mix-drop-mix"],
    sourceVideos: ["blakey5"],
  },
  {
    id: "echo-out",
    group: "same-speed",
    title: "Echo-out",
    what: "Hold Echo on the last word or last beat, pull the old fader, let the tail wash, start the next song in the hole. You are not blending two kicks for a minute.",
    goodFor:
      "Pop, hip-hop, kids/party, vocal house, or any time you need a clean exit. Speeds can be a little apart. Gets dull if it’s the only way you ever leave.",
    mixUltra:
      "FX mode, Echo on a pad (the hardware doesn’t say Echo). Hold, don’t tap. djay: FX routing = Post fader so the echo dies with the fader. Pre fader keeps ringing. A 1-beat echo is a longer tail.",
    more: [
      { to: "/djing/transitions#echo-out", label: "Full steps" },
      { to: "/settings", label: "djay settings" },
    ],
    labs: [{ to: "/labs/pads", label: "Pad modes" }],
    tutorials: ["mix-echo-out", "adv-echo-vocal", "adv-disney-bruno", "vocal-handoff"],
    sourceVideos: ["blakey5"],
  },
  {
    id: "xfader-cut",
    group: "same-speed",
    title: "Crossfader cut",
    what: "Both songs already playing a loud part, both channel faders up, EQ at 12 o’clock. The crossfader throws from the old side to the new side — or chops a few times, then parks on the winner.",
    goodFor:
      "A peak moment, a few bars, not a whole night. Two instrumental drops chop well. Two lead vocals under the chops are still two vocals.",
    mixUltra:
      "djay Sound: Crossfader curve = Cut for a sharp edge. If a paused deck starts when you move the slider, that’s Auto-play when moving crossfader — turn it off unless you want it.",
    more: [
      { to: "/djing/transitions#crossfader-cut", label: "Full steps" },
      { to: "/settings", label: "djay settings" },
    ],
    labs: [{ to: "/labs/crossfader", label: "Crossfader" }],
    tutorials: ["mix-xfader-cut"],
    sourceVideos: ["blakey5"],
  },
  {
    id: "vocal-handoff",
    group: "same-speed",
    title: "Short vocal handoff",
    what: "Don’t stack two lead singers. Let the old chorus finish (or echo the title), then start the new chorus. Overlap is a few bars, not 32. If you must overlap, mute one vocal.",
    goodFor:
      "Pop, hip-hop, Disney, kids-party, vocal house. Radio edits with almost no intro. One rapper / one singer at a time unless you meant to stack them on purpose.",
    mixUltra:
      "Mark where each vocal starts (Neural Mix solo vocals if you need to hunt). Incoming on hot cue 1. Optional: mute vocals on the old deck (bottom Neural pad lit) for the overlap only, then all pads dark.",
    more: [{ to: "/djing/mixing", label: "Mix in / mix out" }],
    labs: [{ to: "/labs/neural-pads", label: "Neural Mix pads" }],
    tutorials: ["vocal-handoff", "mix-echo-out", "adv-echo-vocal", "adv-kids-party"],
  },
  {
    id: "brake-cut",
    group: "jump",
    title: "Echo + brake cut",
    what: "No beat matching. Hold Echo, pause so the old song spins down, start the next song on its chorus or first beat. You decided the last moment; speeds do not have to match.",
    goodFor:
      "Soundtrack files, ballad into banger, 90 hip-hop into 124 house, or any pair that would sound wrong stretched. Kids parties often want “the song ended and the next one started.”",
    mixUltra:
      "djay Start / stop time above 0 (a fraction of a second to about a second) or Pause is instant. Put it back to 0 after practice. SYNC stays off. Incoming is not locked to the old BPM.",
    more: [
      { to: "/djing/jumps#brake", label: "Full steps" },
      { to: "/settings", label: "djay settings" },
    ],
    tutorials: ["mix-brake-cut"],
    sourceVideos: ["carlo3"],
  },
  {
    id: "bpm-stretch",
    group: "jump",
    title: "Walk the tempo",
    what: "Match them by hand with Key Lock on so voices don’t go thin and high (Key Lock is not matching keys). While they overlap, walk both tempo faders toward the new song’s real BPM. Then echo or Filter the old song away so the new one keeps its speed.",
    goodFor:
      "A modest jump (a handful of BPM) where stretching still sounds like music. A 90-to-170 leap is a brake or a song in between, not this.",
    mixUltra:
      "Key Lock is the musical-note control in djay — it holds this file’s pitch while you change speed. It is not a pitch SYNC. Widen the tempo range in software if the fader can’t reach. Mix Ultra has no Pioneer-style wide/plus/minus button.",
    more: [{ to: "/djing/jumps#stretch", label: "Full steps" }],
    tutorials: ["mix-bpm-stretch", "adv-disney-bruno"],
    sourceVideos: ["carlo3"],
  },
  {
    id: "loop-bridge",
    group: "jump",
    title: "Loop-bridge",
    what: "Loop 1 or 4 bars of the old song so you have a steady bed. Blend the new intro over that loop, then echo and Filter the loop away. You bought time; you still want one bass.",
    goodFor:
      "The old file is about to run out, the incoming intro is short, or you need a few bars to arrive. Not for looping a whole vocal verse — that sounds stuck.",
    mixUltra:
      "LOOP pads start from the playhead now, not from the last hot cue. Pause on beat 1 first if you need that bar exactly. Play-then-LOOP mid-bar is why loops feel late.",
    more: [
      { to: "/djing/jumps#loop-bridge", label: "Full steps" },
      { to: "/djing/looping", label: "Looping" },
    ],
    labs: [{ to: "/labs/pads", label: "Pad modes" }],
    tutorials: ["mix-loop-bridge", "pads-transition", "loop-from-cue"],
    sourceVideos: ["carlo3"],
  },
  {
    id: "neural-mashup",
    group: "vocal-peak",
    title: "Swap the vocal (keep the beat)",
    what: "Mute the singing on the song that’s providing the beat, and bring in a different song’s vocal over that instrumental. Do it for 8–16 bars — then pick a winner and turn every Neural pad dark.",
    goodFor:
      "Two songs you know well, close-ish in key and speed. Party trick, not the default mix. Keys may clash; keep it short.",
    mixUltra:
      "NEURAL MIX pad mode (solid LED, not flashing Sampler). Bottom pad lit = mute on. Home is all pads dark. If the wrong stem died, tap off and try the neighbor. Leave Neural mode (HOT CUE) when you’re done.",
    more: [{ to: "/djing/remix", label: "Remix one song" }],
    labs: [
      { to: "/labs/neural-pads", label: "Neural Mix pads" },
      { to: "/labs/neural", label: "HIGH / MID / LOW" },
    ],
    tutorials: ["adv-vocal-swap", "adv-kpdh-neural", "vocal-handoff"],
  },
  {
    id: "double-drop",
    group: "vocal-peak",
    title: "Double-drop",
    what: "Both songs’ drops (or choruses) hit on the same beat 1 for a short phrase — 8–16 beats — then you peel one away so one bassline remains.",
    goodFor:
      "Peak-time house when both drops are simple and loud. Easy to turn into mud. Not two rappers, and not a whole minute of both kicks.",
    mixUltra:
      "Each drop on hot cue 1, rehearsed alone first. Ride the old build, start both drops on the same beat 1, then LOW down or fade the one you’re leaving. Watch Gain — two drops are very loud.",
    more: [{ to: "/djing/transitions#crossfader-cut", label: "Full steps" }],
    tutorials: ["adv-double-drop", "mix-xfader-cut"],
  },
  {
    id: "rearrange-cues",
    group: "one-song",
    title: "Rearrange with hot cues",
    what: "Jump the drop, skip a verse, replay a chorus. You’re not mixing to another file — you’re changing the order of this one. Hits have to land on beat 1 or they feel like mistakes.",
    goodFor:
      "A song you can hum. Kids/party anthems (replay the hook). Buying time while you find the next file. First remix skill, before FX.",
    mixUltra:
      "HOT CUE mode. Pads jump and keep playing. The CUE button next to Play usually stops and returns — that’s a different control. A useful map: intro, verse/hook, drop, breakdown.",
    more: [
      { to: "/djing/remix", label: "Remix one song" },
      { to: "/djing/cueing", label: "Which cues to set" },
    ],
    labs: [{ to: "/labs/hot-cue", label: "Hot cues" }],
    tutorials: ["remix-cue-map", "remix-loop-replay", "remix-party-hook", "hot-cues"],
  },
  {
    id: "loop-hook",
    group: "one-song",
    title: "Loop a hook",
    what: "Repeat 2 or 4 bars of a chorus or groove so it lasts longer, then exit on beat 1 and (often) replay the drop.",
    goodFor:
      "Party anthems, a floor that isn’t done with the chorus, or holding a groove while you cue the next song. Looping the same 2 bars until people notice is the failure mode.",
    mixUltra:
      "LOOP starts from now. Arm it paused on beat 1 if you need that bar. Tap the lit loop pad to exit. Then HOT CUE so you’re not stuck in LOOP mode.",
    more: [{ to: "/djing/looping", label: "Looping" }],
    labs: [
      { to: "/labs/pads", label: "Pad modes" },
      { to: "/labs/hot-cue", label: "Hot cues" },
    ],
    tutorials: ["remix-loop-replay", "remix-party-hook", "loop-from-cue"],
  },
  {
    id: "filter-own-drop",
    group: "one-song",
    title: "Filter-open your own drop",
    what: "Same Filter gesture as bringing a new song in, but you never leave this file. Close the Filter in the breakdown, open to 12 o’clock as this song’s drop hits.",
    goodFor:
      "One-deck practice, or hype a build when you aren’t mixing yet. Works on house builds and on a quiet verse into a chorus.",
    mixUltra:
      "Filter left = muffled, right = thin, center = open. Easy to forget and leave it half-cut. If you also looped the breakdown, exit the loop on the same beat 1.",
    more: [
      { to: "/djing/filter", label: "Filter as a performance tool" },
      { to: "/djing/eq#filter", label: "EQ page (mixing)" },
    ],
    labs: [{ to: "/labs/filter", label: "Filter" }],
    tutorials: ["remix-filter-own-drop", "filter-sweep", "remix-party-hook"],
    sourceVideos: ["carlo3"],
  },
  {
    id: "echo-word",
    group: "one-song",
    title: "Echo a word",
    what: "Hold Echo on the last word of a line, keep the song playing, release. Decoration on this track — you do not pull the fader. Pulling the fader is an echo-out to another song.",
    goodFor:
      "A title line, a character name, a shouted ad-lib. One trick, then home. Doing it every phrase turns into a bit.",
    mixUltra:
      "FX mode, hold the Echo pad ~1–2 beats, release. Then press HOT CUE so you’re not stuck in FX. Post vs Pre fader matters less here because the fader stays up.",
    more: [{ to: "/djing/pads-fx", label: "Pads / FX" }],
    labs: [{ to: "/labs/pads", label: "Pad modes" }],
    tutorials: ["remix-flare-kit"],
  },
  {
    id: "mute-vocal",
    group: "one-song",
    title: "Mute vocals for a phrase",
    what: "Turn the singer off for 8 beats so the chorus is just instruments, then bring them back. Same Neural pads as swapping a vocal, used on one song.",
    goodFor:
      "A chorus the room already knows — instrumental for a moment, then the line returns. Not for hiding a mix mistake for a whole verse.",
    mixUltra:
      "NEURAL MIX solid (not Sampler). Bottom vocals pad lit = mute on. Count 8 beats, tap it dark again. All Neural pads dark before you continue. Solo drums (top row) is the same idea — spotlight, then all-dark.",
    more: [{ to: "/djing/neural", label: "Neural Mix" }],
    labs: [
      { to: "/labs/neural-pads", label: "Neural Mix pads" },
      { to: "/labs/neural", label: "HIGH / MID / LOW" },
    ],
    tutorials: ["remix-flare-kit", "neural-pad-lights", "eq-vs-neural"],
  },
  {
    id: "stutter-cue",
    group: "one-song",
    title: "Stutter from the CUE",
    what: "SHIFT + Play taps restart from your main cue in rhythm — a classic one-song fill. Not a hot cue jump (those keep playing from the pad).",
    goodFor:
      "A short buildup into a drop you marked as the home CUE. Easy to overdo. A few hits, then let it play.",
    mixUltra:
      "The CUE button plants the home marker while paused. While playing, CUE usually stops and returns — stutter uses SHIFT + Play from that marker. Confirm a cue is planted first.",
    more: [
      { to: "/djing/pads-fx", label: "Pads / FX" },
      { to: "/djing/cueing", label: "Which cues to set" },
    ],
    labs: [{ to: "/labs/cue", label: "CUE button" }],
    tutorials: ["stutter-cue", "cue-home"],
  },
  {
    id: "backspin-echo",
    group: "one-song",
    title: "Backspin with Echo",
    what: "Hold Echo, spin the jog wheel backward a half-turn to a full turn, let go. A short rewind into the next phrase. Without Echo it often just sounds like you bumped the platter.",
    goodFor:
      "Last bar of a build, then the drop. A word you can catch. Keep it short — two bars of spinning is a mistake.",
    mixUltra:
      "Touch the top of the jog. Hold Echo first, then spin, then release Echo as the wash dies. Replay from a chorus hot cue while you practice.",
    more: [{ to: "/djing/pads-fx", label: "Pads / FX" }],
    labs: [{ to: "/labs/pads", label: "Pad modes" }],
    tutorials: ["remix-backspin-echo"],
    sourceVideos: ["carlo3"],
  },
  {
    id: "noise-fader",
    group: "one-song",
    title: "Noise / riser chops",
    what: "During a build, chop a riser, sweep, or white-noise loop with the empty deck’s channel fader — or fire a Sampler pad. The drop should be clean; the noise is gone on beat 1.",
    goodFor:
      "Hype a breakdown when you want more than Filter. Watch volume — these files are often very loud.",
    mixUltra:
      "No Pioneer rekordbox “noise color” pad. Load a riser or white-noise loop on the empty deck, or Sampler (SHIFT + NEURAL MIX, flashing). Turn Gain down first. Leave Sampler when done so a leftover sample doesn’t blast into the next mix.",
    more: [{ to: "/djing/pads-fx", label: "Pads / FX" }],
    labs: [{ to: "/labs/pads", label: "Pad modes" }],
    tutorials: ["remix-noise-fader"],
    sourceVideos: ["carlo3"],
  },
  {
    id: "slicer-chop",
    group: "one-song",
    title: "Slicer chops",
    what: "Loop one bar, hold Slicer pads for about 4 beats, then get out. A glitchy fill — longer than a phrase turns into noise.",
    goodFor:
      "A drum bar in a breakdown or the last bar before a drop. Optional candy, not a personality.",
    mixUltra:
      "LOOP → 1-bar pad. SHIFT + FX enters Slicer (flashing). Hold a few slice pads, release, press FX to leave Slicer, tap the lit loop pad to exit the loop. Back to HOT CUE. Filter still at 12 o’clock.",
    more: [{ to: "/djing/pads-fx", label: "Pads / FX" }],
    labs: [{ to: "/labs/pads", label: "Pad modes" }],
    tutorials: ["remix-flare-kit"],
  },
];

export function techniquesForTutorial(tutorialId: string): NamedTechnique[] {
  return TECHNIQUES.filter((t) => t.tutorials.includes(tutorialId));
}

export type LabLink = { to: string; label: string };

/** Lab to practice first before the hardware drill (tutorial coach links). */
export const TUTORIAL_COACH_LABS: Record<string, LabLink> = {
  "two-deck-blend": { to: "/labs/blend", label: "Blend" },
  "mix-manual-beatmatch": { to: "/labs/beatmatch", label: "Beatmatch" },
  "hot-cues": { to: "/labs/hot-cue", label: "Hot cues" },
  "cue-home": { to: "/labs/cue", label: "CUE button" },
  "filter-sweep": { to: "/labs/filter", label: "Filter" },
  "eq-vs-neural": { to: "/labs/eq", label: "Bass kill (LOW)" },
  "mix-bass-swap": { to: "/labs/eq", label: "Bass kill (LOW)" },
  "mix-xfader-cut": { to: "/labs/crossfader", label: "Crossfader" },
};

export function coachLabForTutorial(tutorialId: string): LabLink | null {
  return TUTORIAL_COACH_LABS[tutorialId] ?? null;
}

/** Labs that match a tutorial even when no named technique lists them. */
const EXTRA_TUTORIAL_LABS: Record<string, LabLink[]> = {
  "first-session": [{ to: "/labs/cue", label: "CUE button" }],
  "cue-home": [{ to: "/labs/cue", label: "CUE button" }],
  "hot-cues": [{ to: "/labs/hot-cue", label: "Hot cues" }],
  "quantize-snap": [{ to: "/labs/hot-cue", label: "Hot cues" }],
  "filter-sweep": [{ to: "/labs/filter", label: "Filter" }],
  "eq-vs-neural": [
    { to: "/labs/eq", label: "Bass kill (LOW)" },
    { to: "/labs/neural", label: "HIGH / MID / LOW" },
  ],
  "neural-pad-lights": [{ to: "/labs/neural-pads", label: "Neural Mix pads" }],
  "pads-transition": [{ to: "/labs/pads", label: "Pad modes" }],
  "two-deck-blend": [
    { to: "/labs/incoming-cue", label: "Incoming cue (Deck 2)" },
    { to: "/labs/blend", label: "Two-deck blend" },
    { to: "/labs/eq", label: "Bass kill (LOW)" },
    { to: "/labs/crossfader", label: "Crossfader" },
  ],
  "mix-manual-beatmatch": [
    { to: "/labs/beatmatch", label: "Beatmatch" },
    { to: "/labs/blend", label: "Two-deck blend" },
  ],
  "mix-bass-swap": [
    { to: "/labs/eq", label: "Bass kill (LOW)" },
    { to: "/labs/incoming-cue", label: "Incoming cue (Deck 2)" },
    { to: "/labs/blend", label: "Two-deck blend" },
  ],
  "mix-xfader-cut": [{ to: "/labs/crossfader", label: "Crossfader" }],
};

export function labsForTutorial(tutorialId: string): LabLink[] {
  const seen = new Set<string>();
  const out: LabLink[] = [];
  for (const lab of EXTRA_TUTORIAL_LABS[tutorialId] ?? []) {
    if (seen.has(lab.to)) continue;
    seen.add(lab.to);
    out.push(lab);
  }
  for (const tech of techniquesForTutorial(tutorialId)) {
    for (const lab of tech.labs ?? []) {
      if (seen.has(lab.to)) continue;
      seen.add(lab.to);
      out.push(lab);
    }
  }
  return out;
}

export function tutorialsForLabPath(labTo: string): string[] {
  const fromExtra = Object.entries(EXTRA_TUTORIAL_LABS)
    .filter(([, labs]) => labs.some((l) => l.to === labTo))
    .map(([id]) => id);
  const fromTech = TECHNIQUES.filter((t) => t.labs?.some((l) => l.to === labTo)).flatMap(
    (t) => t.tutorials,
  );
  return [...new Set([...fromExtra, ...fromTech])];
}
