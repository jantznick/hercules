import { useEffect, useRef, useState } from "react";

export function FilterLab() {
  // -1 = full low-pass (cut highs), 0 = flat, +1 = full high-pass (cut lows)
  const [filter, setFilter] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // grid
      ctx.strokeStyle = "#ffffff12";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let i = 1; i < 6; i++) {
        const x = (w / 6) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      ctx.fillStyle = "#b8b0a4";
      ctx.font = "11px IBM Plex Mono, monospace";
      ctx.fillText("bass", 8, h - 8);
      ctx.fillText("mids", w * 0.42, h - 8);
      ctx.fillText("treble", w - 52, h - 8);

      // response curve
      ctx.strokeStyle = "#3dffa8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const freq = x / (w - 1); // 0..1 low→high
        let gain = 1;
        if (filter < -0.02) {
          // low-pass: cut highs
          const amount = Math.abs(filter);
          const cutoff = 1 - amount * 0.85;
          const t = Math.max(0, (freq - cutoff) / (1 - cutoff + 0.001));
          gain = 1 - t * t * amount;
        } else if (filter > 0.02) {
          // high-pass: cut lows
          const amount = filter;
          const cutoff = amount * 0.85;
          const t = Math.max(0, (cutoff - freq) / (cutoff + 0.001));
          gain = 1 - t * t * amount;
        }
        const y = h * 0.15 + (1 - Math.max(0.05, gain)) * h * 0.7;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // center notch
      if (Math.abs(filter) < 0.03) {
        ctx.fillStyle = "#3dffa8";
        ctx.font = "12px IBM Plex Mono, monospace";
        ctx.fillText("flat — full spectrum", w / 2 - 70, 22);
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [filter]);

  const label =
    Math.abs(filter) < 0.03
      ? "Center (open / flat)"
      : filter < 0
        ? `Low-pass — cutting highs (${Math.round(Math.abs(filter) * 100)}%)`
        : `High-pass — cutting lows (${Math.round(filter * 100)}%)`;

  const tip =
    filter < -0.2
      ? "Sounds muffled / underwater. Classic: filter down on the outgoing track as you bring the new one in."
      : filter > 0.2
        ? "Sounds thin / tinny (kick and bass disappear). Classic: open the filter on the incoming track as it takes over."
        : "No filtering. Leave it here unless you’re intentionally shaping a transition.";

  return (
    <div>
      <div className="lab">
        <div className="knob-row">
          <div className="knob-block">
            <label>
              <span>Filter</span>
              <span>{label}</span>
            </label>
            <input
              type="range"
              min={-100}
              max={100}
              value={Math.round(filter * 100)}
              onChange={(e) => setFilter(Number(e.target.value) / 100)}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--mono)",
                fontSize: "0.68rem",
                color: "#b8b0a4",
                marginTop: "0.35rem",
              }}
            >
              <span>← cut highs (LPF)</span>
              <span>center</span>
              <span>cut lows (HPF) →</span>
            </div>
          </div>
        </div>

        <div className="filter-viz" ref={wrapRef}>
          <canvas ref={canvasRef} />
        </div>

        <div className="log" style={{ marginTop: "0.75rem" }}>
          <em>In the room:</em> {tip}
        </div>
      </div>

      <div className="explain">
        <details open>
          <summary>Filter vs High / Mid / Low EQ</summary>
          <ul>
            <li>
              <strong>Filter</strong> — one sweeping “brightness” control. Left muffles the track;
              right thins it. Great for dramatic transitions.
            </li>
            <li>
              <strong>EQ (High / Mid / Low)</strong> — three separate bands you trim more precisely
              (e.g. kill bass on the incoming track so kicks don’t clash, then bring bass back).
            </li>
          </ul>
        </details>
        <details>
          <summary>Simple transition recipe</summary>
          <p>
            Track A playing, Track B ready: pull B’s Low down a bit → fade B in with the
            crossfader → turn B’s filter from right (thin) toward center as it arrives → kill A’s
            Low → crossfade fully to B → open A’s controls back to neutral for the next load.
          </p>
        </details>
        <details>
          <summary>One-song remix recipe</summary>
          <p>
            Stay on this deck. In a breakdown, twist Filter left (muffle) or right (thin). When{" "}
            <em>this</em> song’s drop hits (or you slap its hot cue), sweep Filter back to center
            over 8–16 beats. Same “bloom” as bringing a new track in — you never left the song.
            Always park at 12 o’clock when you’re done.
          </p>
        </details>
      </div>
    </div>
  );
}
