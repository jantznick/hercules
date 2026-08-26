import { practiceAPI, type PracticeKind } from "../api/client";

/** Lab hardware pass flags — browser convenience + optional signed-in sync. */
export const LAB_PASS_KEY = "mix-ultra-lab-pass";

export type LabPassFlags = Record<string, boolean>;

export function loadLabPasses(): LabPassFlags {
  try {
    const raw = localStorage.getItem(LAB_PASS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as LabPassFlags;
  } catch {
    return {};
  }
}

function syncLabPassRemote(labPath: string, kind: PracticeKind = "lab") {
  void practiceAPI
    .recordEvent({
      kind,
      targetId: labPath,
      passed: true,
    })
    .catch(() => {
      /* anonymous / offline — localStorage is enough */
    });
}

/**
 * Mark a lab (or drill sharing the same path) as passed.
 * Always writes localStorage; when newly passed, also POSTs a practice event (best-effort).
 */
export function markLabPass(labPath: string, opts?: { kind?: PracticeKind }) {
  const passes = loadLabPasses();
  if (passes[labPath]) return;
  localStorage.setItem(LAB_PASS_KEY, JSON.stringify({ ...passes, [labPath]: true }));
  syncLabPassRemote(labPath, opts?.kind ?? "lab");
}

export function hasLabPass(labPath: string): boolean {
  return loadLabPasses()[labPath] === true;
}

/** Apply server summary lab passes into localStorage (cross-device). */
export function mergeRemoteLabPasses(targetIds: string[]) {
  const passes = loadLabPasses();
  let changed = false;
  const next = { ...passes };
  for (const id of targetIds) {
    if (!next[id]) {
      next[id] = true;
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(LAB_PASS_KEY, JSON.stringify(next));
  }
}
