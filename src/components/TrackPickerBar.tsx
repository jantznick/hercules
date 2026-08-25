import { useRef } from "react";
import type { TrackId, TrackInfo } from "../audio/tracks";

type Props = {
  tracks: TrackInfo[];
  track1: TrackId;
  track2: TrackId;
  onSelect: (deck: 1 | 2, id: TrackId) => void;
  onImport: (deck: 1 | 2, file: File) => void;
  hint?: string;
};

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

  return (
    <div className="hw-free-bar track-picker-bar">
      <label>
        Deck 1
        <select value={track1} onChange={(e) => onSelect(1, e.target.value)}>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.user ? "★ " : ""}
              {t.title} · {t.bpm}
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
            if (f) onImport(1, f);
            e.target.value = "";
          }}
        />
      </label>
      <label>
        Deck 2
        <select value={track2} onChange={(e) => onSelect(2, e.target.value)}>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.user ? "★ " : ""}
              {t.title} · {t.bpm}
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
            if (f) onImport(2, f);
            e.target.value = "";
          }}
        />
      </label>
      {hint && <span className="hw-free-hint">{hint}</span>}
    </div>
  );
}
