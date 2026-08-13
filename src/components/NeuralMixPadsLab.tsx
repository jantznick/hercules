import { useMemo, useState } from "react";

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
      <div className="callout warn" style={{ marginBottom: "0.9rem" }}>
        <h2>The confusing part: lights mean “this pad action is ON”</h2>
        <p>
          Same as Hot Cue / Loop / FX on this controller: <strong>blue/lit = that pad is engaged</strong>,
          dark = off. Neural Mix does <em>not</em> mean “lit = you can hear that stem” on every pad —
          especially the bottom row, where lit means <strong>mute is on</strong> (you’re cutting that
          stem out).
        </p>
      </div>

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

      <div className="compare" style={{ marginTop: "0.9rem" }}>
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
        <details open>
          <summary>Two different “Neural Mix” controls (easy to mix up)</summary>
          <ul>
            <li>
              <strong>Center N button</strong> (middle of the mixer) — turns HIGH/MID/LOW knobs into
              Vocals / Instruments / Drums <em>volume</em> faders. No pads involved.
            </li>
            <li>
              <strong>NEURAL MIX mode button</strong> (on the deck, with Hot Cue / Loop / FX) — makes
              the 8 pads into solo/mute. LED on that mode button is solid. If it’s flashing, you’re
              in <em>Sampler</em> (SHIFT + Neural Mix) by mistake.
            </li>
          </ul>
        </details>
        <details open>
          <summary>Quick decode while you’re holding the controller</summary>
          <ul>
            <li>
              <strong>All pads dark</strong> → normal full track (good “home” state).
            </li>
            <li>
              <strong>One top pad lit</strong> → “give me only drums/vocals/…”
            </li>
            <li>
              <strong>One bottom pad lit</strong> → “keep the track, but kill vocals/drums/…”
            </li>
            <li>
              <strong>Want full mix again</strong> → turn off every lit pad (or punch through until
              all are dark). Don’t chase “all pads lit.”
            </li>
          </ul>
        </details>
        <details>
          <summary>101 transition uses</summary>
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
        </details>
        <details>
          <summary>If the pads don’t match drums/vocals on your unit</summary>
          <p>
            In djay, set Neural Mix to 3 or 4 parts and confirm the stem order on screen. Pad 1 is
            usually the first stem (often drums). Unused pads (4th column with only 3 stems) may do
            nothing.
          </p>
        </details>
      </div>
    </div>
  );
}
