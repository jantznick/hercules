import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createTurntable, disposeTurntable, ensureAudio, type TurntableEngine } from "../audio/turntable";
import { useMidiConnect } from "../midi/useMidiBus";
import type { MidiBusStatus } from "../midi/bus";

type HardwareArmContextValue = {
  status: MidiBusStatus;
  midiReady: boolean;
  audioBooted: boolean;
  /** Web Audio unlocked — enough for click/pointer free play. MIDI is optional. */
  armed: boolean;
  arming: boolean;
  error: string | null;
  /** Unlock audio; connects MIDI when available but does not require a controller. */
  arm: () => Promise<void>;
};

const HardwareArmContext = createContext<HardwareArmContextValue | null>(null);

export function HardwareArmProvider({ children }: { children: ReactNode }) {
  const { status, connect, ready: midiReady } = useMidiConnect();
  const engineRef = useRef<TurntableEngine | null>(null);
  const [audioBooted, setAudioBooted] = useState(false);
  const [arming, setArming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      void disposeTurntable(engineRef.current);
      engineRef.current = null;
    };
  }, []);

  const arm = useCallback(async () => {
    setArming(true);
    setError(null);
    try {
      try {
        await connect();
      } catch {
        /* MIDI optional — pointer deck still works */
      }
      if (!engineRef.current) {
        engineRef.current = await createTurntable();
      }
      await ensureAudio(engineRef.current);
      setAudioBooted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setArming(false);
    }
  }, [connect]);

  const value = useMemo(
    () => ({
      status,
      midiReady,
      audioBooted,
      armed: audioBooted,
      arming,
      error,
      arm,
    }),
    [status, midiReady, audioBooted, arming, error, arm],
  );

  return <HardwareArmContext.Provider value={value}>{children}</HardwareArmContext.Provider>;
}

export function useHardwareArm() {
  const ctx = useContext(HardwareArmContext);
  if (!ctx) throw new Error("useHardwareArm must be used within HardwareArmProvider");
  return ctx;
}
