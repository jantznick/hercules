import type { ReactNode } from "react";
import { useMidiConnect } from "../midi/useMidiBus";

type Props = {
  children: ReactNode;
  onRestart: () => void;
  extraToolbar?: ReactNode;
};

export function HardwareLabShell({ children, onRestart, extraToolbar }: Props) {
  const { status, connect, ready } = useMidiConnect();

  return (
    <div className="lab hw-lab hw-lab-deck">
      <div className="lab-toolbar">
        {!ready && (
          <button type="button" className="active" onClick={() => void connect()}>
            {status.status === "connecting" ? "Connecting…" : "Connect MIDI"}
          </button>
        )}
        {ready && (
          <button type="button" className="active" disabled>
            Listening
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
      {!ready && status.status === "idle" && (
        <p className="midi-banner warn">
          Connect MIDI first (same Bluetooth pairing as Controller live). Quit djay so it isn’t
          holding the box.
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
