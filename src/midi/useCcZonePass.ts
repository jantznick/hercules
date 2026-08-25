import { useEffect, useRef } from "react";

type Options = {
  /** Current CC value (0–127), or null if unknown */
  value: number | null;
  /** Whether this step’s target is currently satisfied */
  inZone: boolean;
  enabled: boolean;
  /** How long they must stay in zone (ms) */
  dwellMs?: number;
  onPass: () => void;
};

/**
 * Pass a CC step after dwelling in-zone. Uses a timer so a knob that stops
 * on the target (no further MIDI) still counts — unlike “wait for next message”.
 */
export function useCcZonePass({ value, inZone, enabled, dwellMs = 220, onPass }: Options) {
  const onPassRef = useRef(onPass);
  useEffect(() => {
    onPassRef.current = onPass;
  }, [onPass]);

  useEffect(() => {
    if (!enabled || value == null || !inZone) return;
    const t = window.setTimeout(() => onPassRef.current(), dwellMs);
    return () => window.clearTimeout(t);
  }, [enabled, value, inZone, dwellMs]);
}
