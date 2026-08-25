/** Lab hardware pass flags — browser convenience only, not spine progress. */
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

export function markLabPass(labPath: string) {
  const passes = loadLabPasses();
  if (passes[labPath]) return;
  localStorage.setItem(LAB_PASS_KEY, JSON.stringify({ ...passes, [labPath]: true }));
}

export function hasLabPass(labPath: string): boolean {
  return loadLabPasses()[labPath] === true;
}
