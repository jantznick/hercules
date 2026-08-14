import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HowToUse, WhatItDoes } from "./HowToUse";

const DURATION = 32;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatTime(t: number) {
  const s = Math.max(0, t);
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 10);
  return `${m}:${sec.toString().padStart(2, "0")}.${ms}`;
}

type HotCue = number | null;

export function HotCueLab() {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(2);
  const [hotCues, setHotCues] = useState<HotCue[]>(Array(8).fill(null));
  const [shift, setShift] = useState(false);
  const [log, setLog] = useState(
    "Press HOT CUE mode (already on). While the track plays or is paused, tap an empty pad to plant a hot cue.",
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef(position);
  const playingRef = useRef(playing);

  useEffect(() => {
    posRef.current = position;
  }, [position]);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (playingRef.current) {
        const next = posRef.current + dt;
        if (next >= DURATION) {
          setPlaying(false);
          setPosition(DURATION);
        } else {
          setPosition(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
      const mid = h / 2;
      ctx.strokeStyle = "#ff6b4a88";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const t = (x / w) * DURATION;
        const amp = 12 + Math.abs(Math.sin(t * 3.2)) * 26;
        const y = mid + Math.sin(t * 7.1) * amp * 0.4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const scrub = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    setPosition(x * DURATION);
  };

  const hitPad = (i: number) => {
    const existing = hotCues[i];
    if (shift) {
      if (existing == null) {
        setLog(`SHIFT + pad ${i + 1}: nothing to erase.`);
        return;
      }
      setHotCues((prev) => {
        const next = [...prev];
        next[i] = null;
        return next;
      });
      setLog(`SHIFT + pad ${i + 1} → erased hot cue ${i + 1}.`);
      return;
    }

    if (existing == null) {
      setHotCues((prev) => {
        const next = [...prev];
        next[i] = position;
        return next;
      });
      setLog(
        `Pad ${i + 1} empty → set HOT CUE ${i + 1} at ${formatTime(position)}. Pad lights up. You can set up to 8.`,
      );
      return;
    }

    setPosition(existing);
    setPlaying(true);
    setLog(
        `Pad ${i + 1} already set → jump to ${formatTime(existing)} and play immediately.`,
    );
  };

  return (
    <div>
      <div className="lab">
        <div className="status-row">
          <span>
            Pos <strong>{formatTime(position)}</strong>
          </span>
          <span>
            Mode <strong>HOT CUE</strong>
          </span>
          <span>
            Shift <strong>{shift ? "held" : "off"}</strong>
          </span>
          <span>
            Set{" "}
            <strong>{hotCues.filter((c) => c != null).length}/8</strong>
          </span>
        </div>

        <div
          className="waveform"
          ref={wrapRef}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            scrub(e.clientX);
          }}
          onPointerMove={(e) => {
            if (e.buttons !== 1) return;
            scrub(e.clientX);
          }}
        >
          <canvas ref={canvasRef} />
          {hotCues.map((t, i) =>
            t == null ? null : (
              <div
                key={i}
                className="marker hot"
                style={{ left: `${(t / DURATION) * 100}%` }}
              >
                <span className="marker-label">H{i + 1}</span>
              </div>
            ),
          )}
          <div
            className="playhead"
            style={{ left: `${(position / DURATION) * 100}%` }}
          />
        </div>

        <div className="lab-toolbar">
          <button
            type="button"
            className={playing ? "active" : undefined}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            className={shift ? "active" : undefined}
            onMouseDown={() => setShift(true)}
            onMouseUp={() => setShift(false)}
            onMouseLeave={() => setShift(false)}
            onTouchStart={() => setShift(true)}
            onTouchEnd={() => setShift(false)}
          >
            Hold Shift
          </button>
        </div>

        <div className="pad-grid">
          {hotCues.map((t, i) => (
            <button
              key={i}
              type="button"
              className={`pad hot ${t != null ? "set" : ""}`}
              onClick={() => hitPad(i)}
            >
              {t == null ? `Pad ${i + 1}` : `H${i + 1}`}
            </button>
          ))}
        </div>

        <div className="log" style={{ marginTop: "0.75rem" }}>
          <em>What just happened:</em> {log}
        </div>
      </div>

      <WhatItDoes>
        <div className="explain">
          <div className="explain-panel">
            <p>
              Press HOT CUE on Mix Ultra first. Up to eight pads on this deck. Empty pad = plant a
              bookmark at the playhead. Lit pad = jump there and keep playing. SHIFT + pad = erase.
            </p>
            <p>
              Local files usually keep hot cues in djay; streaming may not. The one main CUE button
              is a different control — see the <Link to="/labs/cue">CUE lab</Link>.
            </p>
          </div>
        </div>
      </WhatItDoes>

      <HowToUse>
      <div className="compare">
        <article>
          <h3>In a mix</h3>
          <p>
            Two songs. Plant a mix-in map on the incoming deck so you start on the same phrase every
            time:
          </p>
          <ul>
            <li>Pad 1: intro / where you usually start the track</li>
            <li>Pad 2: first drop or chorus</li>
            <li>Pad 3: breakdown / vocal</li>
            <li>Pad 4: outro or a loop-friendly phrase</li>
          </ul>
          <p>
            Deck 2: scrub to the entry phrase → tap pad 1 (sets it). Later, tap pad 1 again to jump
            there and play, then bring it in with the fader. Local files keep hot cues in djay;
            streaming may not. Full steps: <Link to="/djing/cueing">Which cues to set</Link>. Drill:{" "}
            <Link to="/tutorials/hot-cues">Hot cues jump map</Link>.
          </p>
        </article>
        <article>
          <h3>On one song</h3>
          <p>Same file, different order — no second deck. A remix jump map:</p>
          <ul>
            <li>Pad 1: intro · Pad 2: verse/hook · Pad 3: drop (replay button)</li>
            <li>Pad 4: breakdown · Pad 5: a vocal or drum hit</li>
            <li>Play, then jump drop → breakdown → drop again on phrase starts (“the One”)</li>
          </ul>
          <p>
            Hitting a set pad jumps and keeps playing. Full
            steps: <Link to="/djing/remix">Remix one song</Link>.
          </p>
        </article>
      </div>
      </HowToUse>
    </div>
  );
}
