/**
 * Schematic matching DJControl Mix Ultra physical layout:
 * jogs + pitch on top, SYNC/CUE/PLAY under jogs, pad modes + pads below,
 * mixer strip in the center (EQ/FILTER/LOAD/volumes/crossfader).
 */
import type { MixUltraControl } from "../midi/mixUltraMap";

export type DeckHighlight = MixUltraControl | null;

function hot(
  id: MixUltraControl,
  highlight: DeckHighlight,
  activeIds: MixUltraControl[],
  pressed?: boolean,
  latched?: boolean,
) {
  return highlight === id || activeIds.includes(id) || !!pressed || !!latched;
}

function Knob({
  id,
  label,
  highlight,
  activeIds,
  rotation,
}: {
  id: MixUltraControl;
  label: string;
  highlight: DeckHighlight;
  activeIds: MixUltraControl[];
  rotation?: number | null;
}) {
  const on = hot(id, highlight, activeIds);
  const deg = rotation == null ? -135 : -135 + (rotation / 127) * 270;
  return (
    <div className={`mx-knob${on ? " hot" : ""}`} title={label}>
      <div className="mx-knob-cap">
        <span className="mx-knob-pointer" style={{ transform: `rotate(${deg}deg)` }} />
      </div>
      <span className="mx-knob-label">{label}</span>
    </div>
  );
}

function Fader({
  id,
  highlight,
  activeIds,
  value,
  vertical = true,
}: {
  id: MixUltraControl;
  highlight: DeckHighlight;
  activeIds: MixUltraControl[];
  value?: number | null;
  vertical?: boolean;
}) {
  const on = hot(id, highlight, activeIds);
  const pct = value == null ? 50 : (value / 127) * 100;
  return (
    <div className={`mx-fader${vertical ? " vert" : " horiz"}${on ? " hot" : ""}`}>
      <div className="mx-fader-track">
        <span
          className="mx-fader-thumb"
          style={vertical ? { bottom: `${pct}%` } : { left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Btn({
  id,
  label,
  highlight,
  activeIds,
  pressed,
  latched,
  kind = "",
}: {
  id?: MixUltraControl;
  label: string;
  highlight: DeckHighlight;
  activeIds: MixUltraControl[];
  pressed?: boolean;
  latched?: boolean;
  kind?: string;
}) {
  const on = id ? hot(id, highlight, activeIds, pressed, latched) : !!latched || !!pressed;
  return (
    <div className={`mx-btn ${kind}${on ? " hot" : ""}`} title={label}>
      {label}
    </div>
  );
}

type WingProps = {
  deck: 1 | 2;
  highlight: DeckHighlight;
  activeIds: MixUltraControl[];
  values: Partial<Record<MixUltraControl, number | null>>;
  pressed: Partial<Record<MixUltraControl, boolean>>;
  playing?: boolean;
  pads?: boolean[];
  cues?: (number | null)[];
  jogAngle?: number;
  padMode?: string;
};

function DeckWing({
  deck,
  highlight,
  activeIds,
  values,
  pressed,
  playing,
  pads = [],
  cues = [],
  jogAngle = 0,
  padMode = "HOT CUE",
}: WingProps) {
  const p = (name: string) => `deck${deck}.${name}` as MixUltraControl;
  const outer = deck === 1;
  const touching = !!pressed[p("jogTouch")];

  const jogBlock = (
    <div className="mx-jog-block">
      <div className={`mx-jog${playing ? " on" : ""}${touching ? " touch" : ""}`}>
        <div className="mx-jog-ring" style={{ transform: `rotate(${jogAngle}deg)` }}>
          <div className={`mx-jog-hub${playing && !touching ? " spinning" : ""}`}>{deck}</div>
        </div>
      </div>
      <div className="mx-transport">
        <Btn
          id={p("sync")}
          label="SYNC"
          kind="sync"
          highlight={highlight}
          activeIds={activeIds}
          pressed={pressed[p("sync")]}
        />
        <Btn
          id={p("cue")}
          label="CUE"
          kind="cue"
          highlight={highlight}
          activeIds={activeIds}
          pressed={pressed[p("cue")]}
        />
        <Btn
          id={p("play")}
          label="PLAY"
          kind="play"
          highlight={highlight}
          activeIds={activeIds}
          pressed={pressed[p("play")]}
          latched={playing}
        />
      </div>
    </div>
  );

  const pitch = (
    <div className="mx-pitch">
      <span className="mx-pitch-label">TEMPO</span>
      <Fader
        id={p("pitch")}
        highlight={highlight}
        activeIds={activeIds}
        value={values[p("pitch")]}
        vertical
      />
    </div>
  );

  return (
    <div className={`mx-wing deck-${deck}`}>
      <div className="mx-wing-top">
        {outer ? (
          <>
            {pitch}
            {jogBlock}
          </>
        ) : (
          <>
            {jogBlock}
            {pitch}
          </>
        )}
      </div>

      <div className="mx-modes" role="group" aria-label={`Deck ${deck} pad mode`}>
        {["HOT CUE", "LOOP", "FX", "NEURAL"].map((m) => (
          <div
            key={m}
            className={`mx-mode${padMode === m ? " on" : ""}`}
            aria-current={padMode === m ? "true" : undefined}
          >
            {m}
          </div>
        ))}
      </div>

      <div className="mx-pads" role="group" aria-label={`Deck ${deck} performance pads`}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className={`mx-pad${pads[i] ? " hit" : ""}${cues[i] != null ? " set" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

type Props = {
  highlight?: DeckHighlight;
  activeIds?: MixUltraControl[];
  values?: Partial<Record<MixUltraControl, number | null>>;
  pressed?: Partial<Record<MixUltraControl, boolean>>;
  playing1?: boolean;
  playing2?: boolean;
  pads1?: boolean[];
  pads2?: boolean[];
  cues1?: (number | null)[];
  cues2?: (number | null)[];
  jogAngle1?: number;
  jogAngle2?: number;
  padMode1?: string;
  padMode2?: string;
  prompt?: string;
  status?: string;
};

export function MixUltraDeck({
  highlight = null,
  activeIds = [],
  values = {},
  pressed = {},
  playing1 = false,
  playing2 = false,
  pads1,
  pads2,
  cues1,
  cues2,
  jogAngle1 = 0,
  jogAngle2 = 0,
  padMode1 = "HOT CUE",
  padMode2 = "HOT CUE",
  prompt,
  status,
}: Props) {
  return (
    <div className="mx-deck-wrap">
      {(prompt || status) && (
        <div className="mx-deck-hud">
          {prompt && <p className="mx-deck-prompt">{prompt}</p>}
          {status && <p className="mx-deck-status">{status}</p>}
        </div>
      )}

      <div className="mx-deck" role="img" aria-label="Mix Ultra controller">
        <DeckWing
          deck={1}
          highlight={highlight}
          activeIds={activeIds}
          values={values}
          pressed={pressed}
          playing={playing1}
          pads={pads1}
          cues={cues1}
          jogAngle={jogAngle1}
          padMode={padMode1}
        />

        <div className="mx-center">
          <div className="mx-browser-row">
            <Btn label="LOAD 1" highlight={highlight} activeIds={activeIds} kind="load" />
            <div className="mx-browser">
              <div className="mx-browser-knob" />
              <span>BROWSER</span>
            </div>
            <Btn label="LOAD 2" highlight={highlight} activeIds={activeIds} kind="load" />
          </div>

          <div className="mx-eq-strip">
            <div className="mx-eq-col">
              <Knob
                id="deck1.high"
                label="HI"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values["deck1.high"]}
              />
              <Knob
                id="deck1.mid"
                label="MID"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values["deck1.mid"]}
              />
              <Knob
                id="deck1.low"
                label="LOW"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values["deck1.low"]}
              />
              <Knob
                id="deck1.filter"
                label="FILTER"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values["deck1.filter"]}
              />
              <Btn
                id="deck1.headphone"
                label="PHONES"
                kind="phones"
                highlight={highlight}
                activeIds={activeIds}
                pressed={pressed["deck1.headphone"]}
              />
            </div>

            <div className="mx-master-col">
              <Btn label="N" highlight={highlight} activeIds={activeIds} kind="neural" />
              <Knob
                id="master"
                label="MASTER"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values.master}
              />
            </div>

            <div className="mx-eq-col">
              <Knob
                id="deck2.high"
                label="HI"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values["deck2.high"]}
              />
              <Knob
                id="deck2.mid"
                label="MID"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values["deck2.mid"]}
              />
              <Knob
                id="deck2.low"
                label="LOW"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values["deck2.low"]}
              />
              <Knob
                id="deck2.filter"
                label="FILTER"
                highlight={highlight}
                activeIds={activeIds}
                rotation={values["deck2.filter"]}
              />
              <Btn
                id="deck2.headphone"
                label="PHONES"
                kind="phones"
                highlight={highlight}
                activeIds={activeIds}
                pressed={pressed["deck2.headphone"]}
              />
            </div>
          </div>

          <div className="mx-fader-row">
            <Fader
              id="deck1.volume"
              highlight={highlight}
              activeIds={activeIds}
              value={values["deck1.volume"]}
              vertical
            />
            <div className="mx-xfader-block">
              <Fader
                id="crossfader"
                highlight={highlight}
                activeIds={activeIds}
                value={values.crossfader}
                vertical={false}
              />
              <div className="mx-xfader-ends">
                <span>1</span>
                <span>2</span>
              </div>
            </div>
            <Fader
              id="deck2.volume"
              highlight={highlight}
              activeIds={activeIds}
              value={values["deck2.volume"]}
              vertical
            />
          </div>
        </div>

        <DeckWing
          deck={2}
          highlight={highlight}
          activeIds={activeIds}
          values={values}
          pressed={pressed}
          playing={playing2}
          pads={pads2}
          cues={cues2}
          jogAngle={jogAngle2}
          padMode={padMode2}
        />
      </div>
    </div>
  );
}
