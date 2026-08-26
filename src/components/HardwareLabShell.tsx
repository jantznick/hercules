import type { ReactNode } from "react";
import { useHardwareArm } from "../context/HardwareArmContext";

type Props = {
  children: ReactNode;
  onRestart: () => void;
  extraToolbar?: ReactNode;
};

export function HardwareLabShell({ children, onRestart, extraToolbar }: Props) {
  const { status, armed, arming, arm, midiReady } = useHardwareArm();

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
              : "Arm audio"}
          </button>
        )}
        <button type="button" onClick={onRestart}>
          Restart
        </button>
        {extraToolbar}
      </div>

      {status.status === "unsupported" && (
        <p className="midi-banner warn">
          MIDI isn’t available in this browser — you can still click the on-screen Mix Ultra after
          Arm audio. Use Chrome/Edge/Firefox on desktop for a physical controller.
        </p>
      )}
      {status.status === "denied" && (
        <p className="midi-banner warn">
          MIDI permission denied — click the deck to practice. Allow MIDI and Arm again to use the
          box.
        </p>
      )}
      {!armed && status.status === "idle" && (
        <p className="midi-banner warn">
          Arm audio to hear the turntables. You can click the on-screen Mix Ultra with or without a
          controller. Quit djay if you’re also connecting the box.
        </p>
      )}
      {armed && !midiReady && status.status === "ready" && (
        <p className="midi-banner">No Mix Ultra input yet — on-screen controls are live.</p>
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
