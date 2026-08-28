import type { ReactNode } from "react";
import { BeatmatchHardware } from "../components/BeatmatchPracticeLab";
import { BlendHardware } from "../components/BlendPracticeLab";
import { HardwareCrossfaderLab } from "../components/HardwareCrossfaderLab";
import { HardwareEqLab } from "../components/HardwareEqLab";
import { HardwareFilterLab } from "../components/HardwareFilterLab";
import { HardwareHotCueLab } from "../components/HardwareHotCueLab";
import { HardwarePlayCueLab } from "../components/HardwarePlayCueLab";
import { TransitionHardware } from "../components/TransitionPracticeLab";
import type { TransitionRecipeId } from "../mix/timingFeedback";

/** Which graded HW shell a tutorial embeds (reuse lab code — don’t clone). */
export type TutorialDrillKind =
  | "blend"
  | "transition"
  | "beatmatch"
  | "hot-cue"
  | "play-cue"
  | "filter"
  | "eq"
  | "crossfader";

export type TutorialDrill = {
  kind: TutorialDrillKind;
  /** Short name in the mode toggle */
  label: string;
  /** Under the toggle while Drill is active */
  note: string;
  /** Matching click-around / On hardware lab */
  labTo: string;
  labLabel: string;
  /** Optional prep lab (e.g. incoming cue before blend) */
  prepLab?: { to: string; label: string };
  /** When kind is transition, which recipe to open on */
  transitionRecipe?: TransitionRecipeId;
};

/**
 * Tutorials that mount a graded Mix Ultra drill (laptop audio + MIDI).
 * Full steps stay the djay walkthrough; Lab stays click-around.
 */
export const TUTORIAL_DRILLS: Record<string, TutorialDrill> = {
  "two-deck-blend": {
    kind: "blend",
    label: "Blend",
    note:
      "Graded EQ + crossfader on laptop audio — quit djay so MIDI is free. Arm from the sidebar or Connect below. Full steps stay for real songs in djay.",
    labTo: "/labs/blend",
    labLabel: "Blend",
    prepLab: { to: "/labs/incoming-cue?mode=hardware", label: "Incoming cue (Deck 2)" },
  },
  "mix-long-blend": {
    kind: "transition",
    label: "Transition",
    note:
      "Graded long-blend / bass-swap / filter / cut score on laptop audio — quit djay so MIDI is free. Opens on Long blend. Full steps stay for real songs in djay.",
    labTo: "/labs/transition",
    labLabel: "Transition grade",
    prepLab: { to: "/labs/blend?mode=hardware", label: "Two-deck blend" },
    transitionRecipe: "long-blend",
  },
  "mix-manual-beatmatch": {
    kind: "beatmatch",
    label: "Beatmatch",
    note:
      "Graded tempo fader + jog on laptop audio — leave SYNC off. Arm MIDI + audio, then finish the four steps for timing tips. Full steps are the same idea in djay with real songs.",
    labTo: "/labs/beatmatch",
    labLabel: "Beatmatch",
  },
  "hot-cues": {
    kind: "hot-cue",
    label: "Hot cues",
    note:
      "Graded HOT CUE mode · set · jump · clear on Deck 1 with laptop audio. Quit djay first. Full steps plant the same pads in djay on your track.",
    labTo: "/labs/hot-cue",
    labLabel: "Hot cues",
  },
  "cue-home": {
    kind: "play-cue",
    label: "Play & CUE",
    note:
      "Graded plant · play · CUE-return on Deck 1 with laptop audio. Quit djay first. Full steps set the same home CUE in djay on your track.",
    labTo: "/labs/cue",
    labLabel: "CUE button",
  },
  "filter-sweep": {
    kind: "filter",
    label: "Filter",
    note:
      "Graded FILTER left · center · right on Deck 1 with laptop audio. Quit djay first. Full steps are the same sweep gesture in djay on one song.",
    labTo: "/labs/filter",
    labLabel: "Filter",
  },
  "eq-vs-neural": {
    kind: "eq",
    label: "Bass kill",
    note:
      "Graded LOW kill on Deck 1 with laptop audio — Neural Mix stays off here. Quit djay first. Full steps contrast EQ vs Neural Mix knobs in djay.",
    labTo: "/labs/eq",
    labLabel: "Bass kill (LOW)",
  },
  "mix-bass-swap": {
    kind: "transition",
    label: "Transition",
    note:
      "Graded bass-swap transition score on laptop audio — quit djay first. Opens on Bass swap. Full steps trade bass between two songs in djay.",
    labTo: "/labs/transition",
    labLabel: "Transition grade",
    prepLab: { to: "/labs/incoming-cue?mode=hardware", label: "Incoming cue (Deck 2)" },
    transitionRecipe: "bass-swap",
  },
  "mix-xfader-cut": {
    kind: "transition",
    label: "Transition",
    note:
      "Graded crossfader-cut score on laptop audio with both beds playing. Quit djay first. Opens on Crossfader cut. Full steps throw between two real drops in djay.",
    labTo: "/labs/transition",
    labLabel: "Transition grade",
    transitionRecipe: "xfader-cut",
  },
};

export function drillForTutorial(tutorialId: string): TutorialDrill | null {
  return TUTORIAL_DRILLS[tutorialId] ?? null;
}

export function tutorialHasDrill(tutorialId: string): boolean {
  return tutorialId in TUTORIAL_DRILLS;
}

export function drillPath(tutorialId: string): string | null {
  return tutorialHasDrill(tutorialId) ? `/tutorials/${tutorialId}?mode=drill` : null;
}

export function TutorialDrillMount({
  kind,
  transitionRecipe,
}: {
  kind: TutorialDrillKind;
  transitionRecipe?: TransitionRecipeId;
}): ReactNode {
  switch (kind) {
    case "blend":
      return <BlendHardware />;
    case "transition":
      return <TransitionHardware initialRecipe={transitionRecipe ?? "free"} />;
    case "beatmatch":
      return <BeatmatchHardware />;
    case "hot-cue":
      return <HardwareHotCueLab />;
    case "play-cue":
      return <HardwarePlayCueLab />;
    case "filter":
      return <HardwareFilterLab />;
    case "eq":
      return <HardwareEqLab />;
    case "crossfader":
      return <HardwareCrossfaderLab />;
  }
}
