import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export type LabMode = "learn" | "hardware";

type Props = {
  learn: ReactNode;
  hardware: ReactNode;
  /** Optional short line under the toggle */
  hardwareNote?: string;
};

export function LabModeShell({ learn, hardware, hardwareNote }: Props) {
  const [params, setParams] = useSearchParams();
  const mode: LabMode = params.get("mode") === "hardware" ? "hardware" : "learn";

  const setMode = (next: LabMode) => {
    const p = new URLSearchParams(params);
    if (next === "learn") p.delete("mode");
    else p.set("mode", "hardware");
    setParams(p, { replace: true });
  };

  return (
    <div className="lab-mode-shell">
      <div className="lab-mode-toggle" role="tablist" aria-label="Lab mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "learn"}
          className={mode === "learn" ? "active" : ""}
          onClick={() => setMode("learn")}
        >
          Learn
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "hardware"}
          className={mode === "hardware" ? "active" : ""}
          onClick={() => setMode("hardware")}
        >
          On hardware
        </button>
      </div>
      {mode === "hardware" && hardwareNote && (
        <p className="lab-mode-note">{hardwareNote}</p>
      )}
      {mode === "learn" ? learn : hardware}
    </div>
  );
}
