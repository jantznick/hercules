import { TUTORIALS, type Tutorial } from "./tutorials/data";

export type DjingGroupItem = { to: string; label: string };

export type DjingGroup = {
  id: string;
  label: string;
  items: DjingGroupItem[];
};

/** DJing tab groups. Nav: Overview, then these groups, then the selected group’s pages. */
export const DJING_GROUPS: DjingGroup[] = [
  {
    id: "hear",
    label: "Hear",
    items: [
      { to: "/djing/phrasing", label: "Phrases" },
      { to: "/djing/songs", label: "Songs" },
      { to: "/djing/waveform", label: "Waveform" },
      { to: "/djing/cueing", label: "Cues" },
      { to: "/djing/quantize", label: "Quantize" },
    ],
  },
  {
    id: "match",
    label: "Match",
    items: [
      { to: "/djing/mixing", label: "Mix in/out" },
      { to: "/djing/beatmatch", label: "Match speed" },
      { to: "/djing/eq", label: "EQ & Filter" },
    ],
  },
  {
    id: "mix",
    label: "Mix",
    items: [
      { to: "/djing/techniques", label: "Techniques" },
      { to: "/djing/transitions", label: "Same speed" },
      { to: "/djing/jumps", label: "BPM jumps" },
      { to: "/djing/choose", label: "Pick a song" },
      { to: "/djing/blend", label: "The blend" },
    ],
  },
  {
    id: "remix",
    label: "Remix",
    items: [
      { to: "/djing/remix", label: "Techniques" },
      { to: "/djing/looping", label: "Looping" },
      { to: "/djing/filter", label: "Filter" },
      { to: "/djing/pads-fx", label: "Pads / FX" },
      { to: "/djing/neural", label: "Neural Mix" },
    ],
  },
  {
    id: "this-music",
    label: "This music",
    items: [{ to: "/djing/style", label: "This music" }],
  },
];

export type SpineStage = {
  id: string;
  title: string;
  outcome: string;
  tutorialIds: string[];
  pageTo?: string;
};

export const SPINE: SpineStage[] = [
  {
    id: "sound",
    title: "Sound",
    outcome: "Pair Mix Ultra, play one song in the room, hear the next in headphones, and learn Play blink vs the CUE button.",
    tutorialIds: [
      "first-session",
      "cue-home",
      "pre-cue-hear-first",
      "hot-cues",
      "pre-cue-split",
      "pre-cue-mac",
      "pre-cue-auto-select",
      "mix-gain",
      "eq-vs-neural",
      "neural-pad-lights",
    ],
    pageTo: "/gear/box",
  },
  {
    id: "hear-structure",
    title: "Hear structure",
    outcome: "Count beat 1, read the waveform in djay, and mark four pads you can jump to.",
    tutorialIds: ["count-phrases", "read-waveform"],
    pageTo: "/djing/phrasing",
  },
  {
    id: "one-deck",
    title: "One deck",
    outcome: "Practice on one song: Filter, Key Lock, loop a hook, echo a word — no second song yet.",
    tutorialIds: [
      "filter-sweep",
      "mix-key-lock",
      "quantize-snap",
      "stutter-cue",
      "remix-cue-map",
      "remix-loop-replay",
      "loop-from-cue",
      "remix-filter-own-drop",
      "remix-flare-kit",
      "remix-backspin-echo",
      "remix-noise-fader",
      "remix-party-hook",
    ],
    pageTo: "/djing/remix",
  },
  {
    id: "match-blend",
    title: "Match + first blend",
    outcome: "Match speed with the tempo fader and jog (SYNC off), then bring the second song in with the faders — one bass at a time.",
    tutorialIds: ["mix-beat-grid", "mix-manual-beatmatch", "two-deck-blend"],
    pageTo: "/djing/beatmatch",
  },
  {
    id: "same-speed",
    title: "Same-speed vocabulary",
    outcome: "When both songs run at the same speed: long blend, swap the bass, then echo-out or cut.",
    tutorialIds: [
      "mix-in-mix-out",
      "mix-long-blend",
      "mix-bass-swap",
      "mix-drop-mix",
      "mix-echo-out",
      "mix-xfader-cut",
      "mix-32-window",
      "vocal-handoff",
      "pads-transition",
    ],
    pageTo: "/djing/transitions",
  },
  {
    id: "bpm-jumps",
    title: "When BPM won’t share",
    outcome: "When speeds don’t match: stop the old song, walk the tempo, or loop a few bars as a bridge.",
    tutorialIds: ["mix-brake-cut", "mix-bpm-stretch", "mix-loop-bridge"],
    pageTo: "/djing/jumps",
  },
  {
    id: "short-set",
    title: "A short set",
    outcome: "Three songs, two switches, EQ back to center, one singer at a time.",
    tutorialIds: ["mix-three-song-set"],
    pageTo: "/djing/mixing",
  },
  {
    id: "recipes",
    title: "Recipes",
    outcome: "Optional themed nights — same skills, specific songs.",
    tutorialIds: [
      "adv-filter-open",
      "adv-echo-vocal",
      "adv-vocal-swap",
      "adv-double-drop",
      "adv-kpdh-filter",
      "adv-kpdh-neural",
      "adv-disney-bruno",
      "adv-kids-party",
    ],
    pageTo: "/tutorials",
  },
];

function tutorialById(id: string): Tutorial | undefined {
  return TUTORIALS.find((t) => t.id === id);
}

export function firstTutorialInStage(stage: SpineStage): Tutorial | undefined {
  for (const id of stage.tutorialIds) {
    const tutorial = tutorialById(id);
    if (tutorial) return tutorial;
  }
  return undefined;
}

/** Tutorial next/prev order. */
export function tutorialsInSpineOrder(): Tutorial[] {
  const seen = new Set<string>();
  const ordered: Tutorial[] = [];
  for (const stage of SPINE) {
    for (const id of stage.tutorialIds) {
      const tutorial = tutorialById(id);
      if (!tutorial || seen.has(tutorial.id)) continue;
      seen.add(tutorial.id);
      ordered.push(tutorial);
    }
  }
  for (const tutorial of TUTORIALS) {
    if (seen.has(tutorial.id)) continue;
    seen.add(tutorial.id);
    ordered.push(tutorial);
  }
  return ordered;
}
