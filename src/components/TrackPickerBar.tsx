import { Link } from "react-router-dom";
import {
  formatTrackDuration,
  getCachedBuffer,
  type TrackId,
  type TrackInfo,
} from "../audio/tracks";

type Props = {
  tracks: TrackInfo[];
  track1: TrackId;
  track2: TrackId;
  onSelect: (deck: 1 | 2, id: TrackId) => void;
  hint?: string;
};

function trackLabel(t: TrackInfo): string {
  const buf = getCachedBuffer(t.id);
  const dur = buf ? formatTrackDuration(buf.duration) : "";
  const parts = [t.title, String(t.bpm)];
  if (dur) parts.push(dur);
  return parts.join(" · ");
}

export function TrackPickerBar({
  tracks,
  track1,
  track2,
  onSelect,
  hint,
}: Props) {
  return (
    <div className="hw-free-bar track-picker-bar">
      <label>
        Deck 1
        <select value={track1} onChange={(e) => onSelect(1, e.target.value)}>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {trackLabel(t)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Deck 2
        <select value={track2} onChange={(e) => onSelect(2, e.target.value)}>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {trackLabel(t)}
            </option>
          ))}
        </select>
      </label>
      <Link to="/settings" className="track-tidal-stub">
        Sign in for Tidal tracks
      </Link>
      {hint && <span className="hw-free-hint">{hint}</span>}
    </div>
  );
}
