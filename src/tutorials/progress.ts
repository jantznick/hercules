import { practiceAPI } from "../api/client";

export const TUTORIAL_PROGRESS_KEY = "mix-ultra-tutorial-progress";

export type TutorialProgress = Record<string, number>;

export function loadProgress(): TutorialProgress {
  try {
    const raw = localStorage.getItem(TUTORIAL_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as TutorialProgress;
  } catch {
    return {};
  }
}

export function saveProgress(p: TutorialProgress) {
  localStorage.setItem(TUTORIAL_PROGRESS_KEY, JSON.stringify(p));
}

export function tutorialStepIndex(progress: TutorialProgress, id: string) {
  return progress[id] ?? 0;
}

/**
 * Dual-write tutorial step index: localStorage always; server when signed in (best-effort).
 * `passed` is true when stepIndex >= totalSteps (walkthrough finished).
 */
export function recordTutorialProgress(
  tutorialId: string,
  stepIndex: number,
  totalSteps: number,
) {
  const p = loadProgress();
  saveProgress({ ...p, [tutorialId]: stepIndex });

  const passed = stepIndex >= totalSteps;
  void practiceAPI
    .recordEvent({
      kind: "tutorial",
      targetId: tutorialId,
      passed,
      meta: { stepIndex, totalSteps },
    })
    .catch(() => {
      /* anonymous / offline */
    });
}

/** Merge remote tutorial step indices (take max) into localStorage. */
export function mergeRemoteTutorialProgress(
  items: { targetId: string; stepIndex: number }[],
) {
  const p = loadProgress();
  let changed = false;
  const next = { ...p };
  for (const item of items) {
    const local = next[item.targetId] ?? 0;
    if (item.stepIndex > local) {
      next[item.targetId] = item.stepIndex;
      changed = true;
    }
  }
  if (changed) saveProgress(next);
  return next;
}
