import type { RefObject } from "react";

type Props = {
  audioHostRef: RefObject<HTMLDivElement | null>;
  error?: string | null;
};

/** Hidden Player SDK mount — deck PLAY/CUE drives playback via useFreePlayTidalPlayback. */
export function FreePlayTidalReference({ audioHostRef, error }: Props) {
  return (
    <>
      <div ref={audioHostRef} className="tidal-player-audio-host" aria-hidden="true" />
      {error ? <p className="auth-inline-note free-play-tidal-error">{error}</p> : null}
    </>
  );
}
