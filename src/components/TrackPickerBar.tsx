import { useRef, useState } from "react";
import {
  formatTrackDuration,
  getCachedBuffer,
  setPendingImportBpm,
  type TrackId,
  type TrackInfo,
} from "../audio/tracks";

type Props = {
  tracks: TrackInfo[];
  track1: TrackId;
  track2: TrackId;
  onSelect: (deck: 1 | 2, id: TrackId) => void;
  /** Third arg is import BPM from the shared field (default 124). */
  onImport: (deck: 1 | 2, file: File, bpm?: number) => void;
  hint?: string;
};

function trackLabel(t: TrackInfo): string {
  const buf = getCachedBuffer(t.id);
  const dur = buf ? formatTrackDuration(buf.duration) : "";
  const parts = [`${t.user ? "★ " : ""}${t.title}`, String(t.bpm)];
  if (dur) parts.push(dur);
  return parts.join(" · ");
}

export function TrackPickerBar({
  tracks,
  track1,
  track2,
  onSelect,
  onImport,
  hint,
}: Props) {
  const file1 = useRef<HTMLInputElement>(null);
  const file2 = useRef<HTMLInputElement>(null);
  const [importBpm, setImportBpm] = useState(124);

  const bpmValue = Number.isFinite(importBpm) && importBpm > 0 ? importBpm : 124;

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
        <button type="button" className="track-import-btn" onClick={() => file1.current?.click()}>
          Add file
        </button>
        <input
          ref={file1}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.m4a"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setPendingImportBpm(bpmValue);
              onImport(1, f, bpmValue);
            }
            e.target.value = "";
          }}
        />
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
        <button type="button" className="track-import-btn" onClick={() => file2.current?.click()}>
          Add file
        </button>
        <input
          ref={file2}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.m4a"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setPendingImportBpm(bpmValue);
              onImport(2, f, bpmValue);
            }
            e.target.value = "";
          }}
        />
      </label>
      <label>
        Import BPM
        <input
          type="number"
          min={60}
          max={200}
          step={1}
          value={importBpm}
          onChange={(e) => setImportBpm(Number(e.target.value) || 124)}
          title="BPM stored on imported tracks (default 124)"
          style={{
            width: "4.5rem",
            padding: "0.45rem 0.55rem",
            borderRadius: 8,
            border: "1px solid var(--deck-line)",
            background: "var(--deck-panel)",
            color: "#f2ece3",
            fontSize: "0.88rem",
          }}
        />
      </label>
      {hint && <span className="hw-free-hint">{hint}</span>}
    </div>
  );
}
