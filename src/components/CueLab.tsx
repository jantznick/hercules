import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HowToUse, WhatItDoes } from "./HowToUse";

const DURATION = 32; // seconds of fake track

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

export function CueLab() {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(4);
  const [cuePoint, setCuePoint] = useState<number | null>(null);
  const [log, setLog] = useState(
    "Paused at 0:04.0 — press CUE to set the main cue here (like the white triangle in djay).",
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
          setLog("Track ended.");
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
      ctx.strokeStyle = "#3dffa866";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const t = (x / w) * DURATION;
        const beat = Math.sin(t * Math.PI * 2 * 2);
        const kick = Math.max(0, Math.sin(t * Math.PI * 2)) ** 8;
        const amp = 10 + Math.abs(beat) * 18 + kick * 22;
        const y = mid + Math.sin(t * 9.3) * amp * 0.35 + Math.sin(t * 2.1) * amp * 0.2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // bar marks every 2s
      ctx.strokeStyle = "#ffffff14";
      ctx.lineWidth = 1;
      for (let t = 0; t <= DURATION; t += 2) {
        const x = (t / DURATION) * w;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const pct = (position / DURATION) * 100;
  const cuePct = cuePoint == null ? null : (cuePoint / DURATION) * 100;

  const scrub = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    setPosition(x * DURATION);
  };

  const onCue = () => {
    if (playing) {
      // While playing: jump back to cue and stop
      if (cuePoint == null) {
        setPlaying(false);
        setPosition(0);
        setLog(
          "Playing + CUE, no cue set → jump to start of track and stop. (Manual: set a cue while paused first.)",
        );
      } else {
        setPlaying(false);
        setPosition(cuePoint);
        setLog(
          `Playing + CUE → stop and jump to the cue point at ${formatTime(cuePoint)}. This is the classic “return to cue” behavior.`,
        );
      }
      return;
    }

    // Paused: set cue at current position
    setCuePoint(position);
    setLog(
      `Paused + CUE → set the main CUE at ${formatTime(position)}. In djay this is the white triangle. Only one main cue per deck.`,
    );
  };

  const onPlay = () => {
    if (playing) {
      setPlaying(false);
      setLog("Paused. Press CUE to plant a marker here, or Play to continue.");
      return;
    }
    setPlaying(true);
    setLog("Playing. Solid Play LED. Tip: CUE now returns to the cue point and stops.");
  };

  const cueAndPlay = () => {
    const target = cuePoint ?? 0;
    setPosition(target);
    setPlaying(true);
    setLog(
      `CUE + PLAY (or continue from cue) → jump to ${formatTime(target)} and start playing. Useful to preview the drop from your cue.`,
    );
  };

  const shiftCue = () => {
    setPosition(0);
    setPlaying(true);
    setLog("SHIFT + CUE → play from the beginning of the track.");
  };

  const clearCue = () => {
    setCuePoint(null);
    setLog("Cue cleared (in djay: pause, then press-and-hold SET ~3 seconds).");
  };

  const tip = useMemo(() => {
    if (playing) return "Try pressing CUE while playing — it should jump back and stop.";
    return "Drag the waveform (or scrub) while paused, then press CUE to plant the marker.";
  }, [playing]);

  return (
    <div>
      <div className="lab">
        <div className="status-row">
          <span>
            Pos <strong>{formatTime(position)}</strong>
          </span>
          <span>
            Cue{" "}
            <strong>{cuePoint == null ? "none" : formatTime(cuePoint)}</strong>
          </span>
        </div>

        <div
          className="waveform"
          ref={wrapRef}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            scrub(e.clientX);
            if (playing) {
              setPlaying(false);
              setLog("Scrubbing while paused — move to where you want the cue, then hit CUE.");
            }
          }}
          onPointerMove={(e) => {
            if (e.buttons !== 1) return;
            scrub(e.clientX);
          }}
        >
          <canvas ref={canvasRef} />
          {cuePct != null && (
            <div className="marker cue" style={{ left: `${cuePct}%` }}>
              <span className="marker-label">CUE</span>
            </div>
          )}
          <div className="playhead" style={{ left: `${pct}%` }} />
        </div>

        <div className="lab-toolbar">
          <button type="button" className={playing ? "active" : undefined} onClick={onPlay}>
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="cue-btn active" onClick={onCue}>
            CUE
          </button>
          <button type="button" onClick={cueAndPlay}>
            CUE + Play
          </button>
          <button type="button" onClick={shiftCue}>
            Shift + CUE
          </button>
          <button type="button" className="danger" onClick={clearCue}>
            Clear cue
          </button>
        </div>

        <div className="log">
          <em>What just happened:</em> {log}
          <div style={{ marginTop: "0.35rem", opacity: 0.75 }}>{tip}</div>
        </div>
      </div>

      <WhatItDoes>
        <div className="explain">
          <div className="explain-panel">
            <p>
              One main CUE per deck — the white triangle in djay. Mix Ultra + djay:
            </p>
            <ul>
              <li>
                <strong>Paused + CUE</strong> — plants (or moves) the marker at the playhead.
              </li>
              <li>
                <strong>Playing + CUE</strong> — stops and jumps back to that marker. No cue yet →
                jumps to the start.
              </li>
              <li>
                <strong>CUE then Play</strong> — start from the cue (preview the drop).
              </li>
              <li>
                <strong>SHIFT + CUE</strong> — play from the very beginning of the track.
              </li>
            </ul>
            <p>
              Stutter: cue first, then hold SHIFT and tap Play quickly to restart from that spot.
              Jumping around without stopping is a hot-cue pad, not this button.
            </p>
          </div>
        </div>
      </WhatItDoes>

      <HowToUse>
      <div className="compare">
        <article>
          <h3>In a mix</h3>
          <p>
            Plant the main CUE on the incoming track’s mix-in (usually a phrase One). Headphones on
            that deck, pause, scrub, tap CUE. When it’s time, Play from that cue — don’t tap CUE
            while the incoming deck is already playing, or it will stop and snap back.
          </p>
          <p>
            Full steps: <Link to="/djing/cueing">Which cues to set</Link>. Drill:{" "}
            <Link to="/tutorials/cue-home">Plant your home CUE</Link>.
          </p>
        </article>
        <article>
          <h3>On one song</h3>
          <p>
            One home CUE is “always go back to this drop / intro.” Play the song, tap CUE to return
            and stop, then Play to hit it again. For jumping around without stopping, use hot-cue
            pads instead of this button.
          </p>
          <p>
            Drill: <Link to="/tutorials/stutter-cue">Stutter from CUE</Link>. Lab:{" "}
            <Link to="/labs/hot-cue">Hot cues</Link>.
          </p>
        </article>
      </div>
      </HowToUse>
    </div>
  );
}
