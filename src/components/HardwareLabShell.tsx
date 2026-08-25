import type { ReactNode } from "react";
import { useHardwareArm } from "../context/HardwareArmContext";

type Props = {
  children: ReactNode;
  onRestart: () => void;
  extraToolbar?: ReactNode;
};

export function HardwareLabShell({ children, onRestart, extraToolbar }: Props) {
  const { status, armed, arming, arm } = useHardwareArm();

  return (
    <div className="lab hw-lab hw-lab-deck">
      <div className="lab-toolbar">
        {!armed && (
          <button
            type="button"
            className="active"
            disabled={arming}
            onClick={() => void arm()}
          >
            {arming
              ? status.status === "connecting"
                ? "Connecting…"
                : "Arming…"
              : "Connect MIDI"}
          </button>
        )}
        <button type="button" onClick={onRestart}>
          Restart
        </button>
        {extraToolbar}
      </div>

      {status.status === "unsupported" && (
        <p className="midi-banner warn">Use Chrome/Edge/Firefox on desktop — not Safari.</p>
      )}
      {status.status === "denied" && (
        <p className="midi-banner warn">Allow MIDI permission, then Connect again.</p>
      )}
      {!armed && status.status === "idle" && (
        <p className="midi-banner warn">
          Arm MIDI + audio from the sidebar (or Connect here). Quit djay so it isn’t holding the
          box.
        </p>
      )}

      {children}
    </div>
  );
}

type GradeProps = {
  pass: boolean;
  children: ReactNode;
};

export function HardwareGrade({ pass, children }: GradeProps) {
  return <div className={`hw-grade${pass ? " pass" : " retry"}`}>{children}</div>;
}
