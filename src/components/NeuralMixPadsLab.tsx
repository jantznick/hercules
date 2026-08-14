import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HowToUse, WhatItDoes } from "./HowToUse";

const STEMS_3 = ["Drums", "Melody", "Vocals"] as const;
const STEMS_4 = ["Drums", "Bass", "Melody", "Vocals"] as const;

type StemCount = 3 | 4;

/**
 * LED model (Hercules manual + same pattern as other pad modes):
 * Lit pad = that pad’s action is ON.
 * Top = solo that stem. Bottom = mute/cut that stem.
 * Full mix = every pad dark.
 */
export function NeuralMixPadsLab() {
  const [stemCount, setStemCount] = useState<StemCount>(3);
  const stems = stemCount === 3 ? [...STEMS_3] : [...STEMS_4];
  const [solo, setSolo] = useState<boolean[]>(() => Array(4).fill(false));
  const [mute, setMute] = useState<boolean[]>(() => Array(4).fill(false));

  const reset = () => {
    setSolo(Array(4).fill(false));
    setMute(Array(4).fill(false));
  };

  const toggleSolo = (i: number) => {
    setSolo((prev) => {
      const next = prev.map(() => false);
      // Solo pads usually act like radio for “one solo”, but multi-solo is possible in some apps.
      // Teach the common case: tap again to clear; tapping another switches solo.
      next[i] = !prev[i];
      if (next[i]) {
        // clear other solos for clearer 101 behavior
        for (let j = 0; j < next.length; j++) if (j !== i) next[j] = false;
      }
      return next;
    });
    // If you solo a stem, clear its mute so the model stays sensible
    setMute((prev) => {
      const next = [...prev];
      next[i] = false;
      return next;
    });
  };

  const toggleMute = (i: number) => {
    setMute((prev) => {
      const next = [...prev];
      next[i] = !prev[i];
      return next;
    });
    // Muting clears that stem’s solo
    setSolo((prev) => {
      const next = [...prev];
      next[i] = false;
      return next;
    });
  };

  const anySolo = solo.some((s, i) => s && i < stems.length);

  const audible = useMemo(() => {
    return stems.map((name, i) => {
      if (anySolo) {
        // Solo mode: only soloed stems (that aren’t also muted — we clear mute on solo)
        return { name, on: solo[i] && !mute[i], reason: solo[i] ? "solo on" : "not soloed" };
      }
      // Full mix minus mutes
      return {
        name,
        on: !mute[i],
        reason: mute[i] ? "muted (bottom pad lit)" : "in the mix",
      };
    });
  }, [stems, solo, mute, anySolo]);

  const hearing = audible.filter((a) => a.on).map((a) => a.name);
  const hearingLabel =
    hearing.length === 0
      ? "Silence / almost nothing — everything is muted or no solo selected"
      : hearing.length === stems.length && !anySolo
        ? `Full mix (${hearing.join(" + ")})`
        : anySolo
          ? `Solo: ${hearing.join(" + ")}`
          : `Mix without: ${stems.filter((_, i) => mute[i]).join(", ") || "nothing"} → hearing ${hearing.join(" + ")}`;

  const lightRule = anySolo
    ? "A top (solo) pad is lit = that solo is ON. Bottom pads lit = those cuts are ON."
    : "All pads dark = full mix (nothing soloed, nothing muted). Bottom lit = that stem is cut.";

  return (
    <div>
      <div className="lab">
        <div className="lab-toolbar">
          <button
            type="button"
            className={stemCount === 3 ? "active" : undefined}
            onClick={() => {
              setStemCount(3);
              reset();
            }}
          >
            3 stems (Drums / Melody / Vocals)
          </button>
          <button
            type="button"
            className={stemCount === 4 ? "active" : undefined}
            onClick={() => {
              setStemCount(4);
              reset();
            }}
          >
            4 stems (+ Bass)
          </button>
          <button type="button" onClick={reset}>
            Reset = full mix (all dark)
          </button>
        </div>

        <div className="status-row">
          <span>
            Mode <strong>NEURAL MIX pads</strong> (deck mode button solid — not Sampler)
          </span>
        </div>

        <div className="neural-pad-board">
          <div className="neural-row-label">Top · Solo</div>
          <div className="pad-grid neural-pads">
            {stems.map((name, i) => (
              <button
                key={`s-${name}`}
                type="button"
                className={`pad neural-pad ${solo[i] ? "set lit" : "dark"}`}
                onClick={() => toggleSolo(i)}
              >
                <span className="neural-pad-action">Solo</span>
                {name}
                <span className="neural-pad-led">{solo[i] ? "LIT" : "off"}</span>
              </button>
            ))}
            {stemCount === 3 && <div className="pad neural-pad unused">Unused</div>}
          </div>

          <div className="neural-row-label">Bottom · Mute / cut</div>
          <div className="pad-grid neural-pads">
            {stems.map((name, i) => (
              <button
                key={`m-${name}`}
                type="button"
                className={`pad neural-pad mute ${mute[i] ? "set lit" : "dark"}`}
                onClick={() => toggleMute(i)}
              >
                <span className="neural-pad-action">Mute</span>
                {name}
                <span className="neural-pad-led">{mute[i] ? "LIT" : "off"}</span>
              </button>
            ))}
            {stemCount === 3 && <div className="pad neural-pad unused">Unused</div>}
          </div>
        </div>

        <div className="log" style={{ marginTop: "0.75rem" }}>
          <div>
            <em>Lights:</em> {lightRule}
          </div>
          <div style={{ marginTop: "0.4rem" }}>
            <em>You’re hearing:</em> {hearingLabel}
          </div>
        </div>

        <div className="stem-meters">
          {audible.map((a) => (
            <div key={a.name} className={`stem-meter ${a.on ? "on" : "off"}`}>
              <strong>{a.name}</strong>
              <span>{a.on ? "audible" : "silent"}</span>
              <span className="stem-reason">{a.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <WhatItDoes>
        <div className="compare" style={{ marginTop: 0 }}>
          <article>
            <h3>Top row lit</h3>
            <p>
              Solo is on. You mostly hear that stem. Other stems drop out of the pad mix until you turn
              the solo off (press the lit pad again) or reset.
            </p>
          </article>
          <article>
            <h3>Bottom row lit</h3>
            <p>
              Mute/cut is on. That stem is removed from the full mix. Dark bottom pads = those stems
              still play. This is the row people reverse in their head.
            </p>
          </article>
        </div>
        <div className="explain">
          <div className="explain-panel">
            <p>
              Lit pad = that pad’s action is ON (same as Hot Cue / Loop / FX). Dark = off. Bottom
              row lit means mute is on — you are cutting that stem, not “hearing it.”
            </p>
            <ul>
              <li>
                <strong>Center N button</strong> (middle of the mixer) — HIGH/MID/LOW become Vocals /
                Instruments / Drums volumes. No pads.
              </li>
              <li>
                <strong>NEURAL MIX mode</strong> (deck, with Hot Cue / Loop / FX) — the 8 pads are
                solo (top) / mute (bottom). Solid mode LED. Flashing = Sampler (SHIFT + Neural Mix)
                by mistake.
              </li>
              <li>
                <strong>All pads dark</strong> → full mix. One top lit → solo that stem. One bottom
                lit → keep the track, cut that stem. Home = all dark, not all lit.
              </li>
            </ul>
            <p>
              In djay, pick 3 or 4 Neural Mix parts and check stem order on screen. Unused pads (4th
              column with 3 stems) may do nothing.
            </p>
          </div>
        </div>
      </WhatItDoes>

      <HowToUse>
      <div className="compare">
        <article>
          <h3>In a mix</h3>
          <ul>
            <li>
              Incoming track playing: mute its vocals (bottom vocals lit) while the outgoing vocal
              finishes, then unmute.
            </li>
            <li>
              Outgoing track: solo drums (top drums lit) as a breakdown, bring the new bassline
              underneath, then go back to all-dark.
            </li>
            <li>
              Mashup: mute drums on A + mute melody on B so kick from one rides under vocal from
              the other — watch which pads are lit so you remember what you cut.
            </li>
          </ul>
          <p>
            Drill: <Link to="/tutorials/adv-vocal-swap">Vocal swap mashup</Link>. Full steps:{" "}
            <Link to="/djing/neural">Neural Mix</Link>.
          </p>
        </article>
        <article>
          <h3>On one song</h3>
          <ul>
            <li>
              Mute vocals for 8 beats in a chorus (bottom vocals lit), then tap dark — instant
              instrumental, same track.
            </li>
            <li>
              Solo drums for a bar as a fake breakdown, then all-dark as the drop continues.
            </li>
            <li>
              One stem trick at a time. Leftover mutes are how the next song “mysteriously” has no
              vocals.
            </li>
          </ul>
          <p>
            Full steps: <Link to="/djing/neural">Neural Mix (remix)</Link>. Drill:{" "}
            <Link to="/tutorials/remix-flare-kit">Mute vocals for a phrase</Link>.
          </p>
        </article>
      </div>
      </HowToUse>
    </div>
  );
}
