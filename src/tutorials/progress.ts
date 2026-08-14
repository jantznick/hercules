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
