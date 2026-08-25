import { useEffect, useRef, useState } from "react";
import {
  connectMidiBus,
  getMidiAccess,
  getMidiStatus,
  hasWebMidi,
  subscribeMidi,
  subscribeMidiStatus,
  type MidiBusStatus,
} from "../midi/bus";
import { decodeMidiMessage } from "../midi/decode";
import {
  ledTestAllOff,
  ledTestPads,
  ledTestPlayDeck1,
} from "../midi/leds";
import { pickMidiOutput } from "../midi/out";

const MAX_LOG = 80;

type PortInfo = {
  id: string;
  name: string;
  manufacturer: string;
  state: string;
  connection: string;
};

type LogEntry = {
  id: number;
  at: number;
  port: string;
  kind: string;
  summary: string;
  detail: string;
};

function portInfo(port: MIDIPort): PortInfo {
  return {
    id: port.id,
    name: port.name || "(unnamed)",
    manufacturer: port.manufacturer || "",
    state: port.state,
    connection: port.connection,
  };
}

function listPorts(map: MIDIInputMap | MIDIOutputMap): PortInfo[] {
  const out: PortInfo[] = [];
  for (const port of map.values()) {
    out.push(portInfo(port));
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function formatClock(ms: number): string {
  const d = new Date(ms);
  const base = d.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const frac = String(d.getMilliseconds()).padStart(3, "0");
  return `${base}.${frac}`;
}

function portsFromAccess(): { inputs: PortInfo[]; outputs: PortInfo[] } {
  const access = getMidiAccess();
  if (!access) return { inputs: [], outputs: [] };
  return {
    inputs: listPorts(access.inputs),
    outputs: listPorts(access.outputs),
  };
}

export function MidiMonitor() {
  const [busStatus, setBusStatus] = useState<MidiBusStatus>(getMidiStatus);
  const [ports, setPorts] = useState(portsFromAccess);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastFlash, setLastFlash] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [ledNote, setLedNote] = useState<string | null>(null);
  const seqRef = useRef(0);
  const pausedRef = useRef(paused);
  const flashTimer = useRef(0);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => subscribeMidiStatus(setBusStatus), []);

  useEffect(() => {
    const refresh = () => setPorts(portsFromAccess());
    refresh();
    return subscribeMidiStatus(() => refresh());
  }, []);

  useEffect(() => {
    return subscribeMidi((msg) => {
      if (pausedRef.current) return;
      // Ignore ultra-noisy timing clock
      if (msg.raw[0] === 0xf8) return;

      const decoded = decodeMidiMessage(msg.raw);
      const id = ++seqRef.current;
      const entry: LogEntry = {
        id,
        at: Date.now(),
        port: "bus",
        kind: decoded.kind,
        summary: decoded.summary,
        detail: decoded.detail,
      };

      setLog((prev) => [entry, ...prev].slice(0, MAX_LOG));
      setLastFlash(decoded.summary);
      window.clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => setLastFlash(null), 900);
    });
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(flashTimer.current);
  }, []);

  const connectMidi = async () => {
    await connectMidiBus();
    setPorts(portsFromAccess());
  };

  const clearLog = () => setLog([]);

  const runLedTest = (label: string, fn: () => boolean) => {
    const out = pickMidiOutput();
    if (!out) {
      setLedNote("No MIDI outputs — LEDs need an output port. Bluetooth MIDI often has input only.");
      return;
    }
    const ok = fn();
    if (!ok) {
      setLedNote(`Send failed via ${out.name}. BT links sometimes don’t latch LEDs.`);
      return;
    }
    setLedNote(`${label} via ${out.name}. If nothing lit, BT may not accept LED note-ons.`);
  };

  const ready = busStatus.status === "ready";
  const outputCount =
    busStatus.status === "ready" ? busStatus.outputCount : ports.outputs.length;

  return (
    <div className="lab midi-monitor">
      <div className="lab-toolbar">
        {(busStatus.status === "idle" ||
          busStatus.status === "denied" ||
          busStatus.status === "error" ||
          busStatus.status === "unsupported") && (
          <button type="button" className="active" onClick={() => void connectMidi()}>
            Connect MIDI
          </button>
        )}
        {busStatus.status === "connecting" && (
          <button type="button" disabled>
            Connecting…
          </button>
        )}
        {ready && (
          <>
            <button type="button" className="active" disabled>
              Listening
            </button>
            <button type="button" onClick={() => setPaused((p) => !p)}>
              {paused ? "Resume log" : "Pause log"}
            </button>
            <button type="button" onClick={clearLog}>
              Clear
            </button>
            <button type="button" onClick={() => setPorts(portsFromAccess())}>
              Refresh ports
            </button>
          </>
        )}
      </div>

      <div className="status-row">
        <span>
          Origin: <strong>{window.location.origin}</strong>
        </span>
        <span>
          Secure context: <strong>{window.isSecureContext ? "yes" : "no"}</strong>
        </span>
        <span>
          Web MIDI: <strong>{hasWebMidi() ? "available" : "missing"}</strong>
        </span>
      </div>

      {busStatus.status === "unsupported" && (
        <p className="midi-banner warn">
          This browser has no Web MIDI API. Use Chrome, Edge, or Firefox on desktop — not Safari.
        </p>
      )}
      {busStatus.status === "denied" && (
        <p className="midi-banner warn">
          MIDI permission was denied. Allow MIDI for this site in the address bar, then try again.
          {busStatus.message ? ` (${busStatus.message})` : ""}
        </p>
      )}
      {busStatus.status === "error" && (
        <p className="midi-banner warn">Could not open MIDI: {busStatus.message}</p>
      )}
      {!window.isSecureContext && (
        <p className="midi-banner warn">
          This page is not a secure context. Open via <code>http://localhost:…</code> (works) — not a
          LAN IP like <code>http://192.168.…</code>, and not <code>file://</code>.
        </p>
      )}

      <div className="midi-setup">
        <h3>Get the Mix Ultra talking to this Mac (Bluetooth MIDI)</h3>
        <p className="midi-setup-lead">
          The browser cannot pair Bluetooth itself. macOS has to connect the controller as a{" "}
          <em>MIDI</em> device first. That is a different step from “Bluetooth” in System Settings.
        </p>
        <ol>
          <li>
            On your phone/tablet: force-quit <strong>djay</strong>, or turn the Mix Ultra off and on so the
            phone is no longer using it. Only one device can use the controller at a time.
          </li>
          <li>
            On the Mac: press <kbd>Cmd</kbd> + <kbd>Space</kbd>, type <strong>Audio MIDI Setup</strong>, and
            open that app (it lives in Applications → Utilities).
          </li>
          <li>
            In Audio MIDI Setup’s menu bar, choose <strong>Window → Show MIDI Studio</strong>. A window of
            MIDI devices appears (IAC Driver, etc.).
          </li>
          <li>
            In the MIDI Studio toolbar, click the <strong>Bluetooth</strong> icon (or{" "}
            <strong>Configure Bluetooth</strong>). A small “Bluetooth Configuration” window opens and scans
            for nearby MIDI controllers.
          </li>
          <li>
            Power on the Mix Ultra. When it shows up in that list, click <strong>Connect</strong> next to it.
            Wait until it says connected. (If you only paired it under System Settings → Bluetooth, that is{" "}
            <em>not</em> enough — redo Connect here.)
          </li>
          <li>
            Back on this page: click <strong>Connect MIDI</strong>, allow Chrome’s MIDI permission, then press
            Play or twist a knob. Messages should appear below.
          </li>
        </ol>
        <p className="midi-setup-note">
          Use Chrome at <code>http://localhost:5173/labs/midi</code> — not Safari, and not a{" "}
          <code>192.168.…</code> address. If the Mix Ultra never appears in the Bluetooth Configuration list,
          say so; USB may be needed on this Mac.
        </p>
      </div>

      {ready && (
        <>
          <div className="midi-ports">
            <div>
              <h3>Inputs ({ports.inputs.length})</h3>
              {ports.inputs.length === 0 ? (
                <p className="midi-empty">No MIDI inputs yet. Pair the Mix Ultra in Audio MIDI Setup, then Refresh.</p>
              ) : (
                <ul>
                  {ports.inputs.map((p) => (
                    <li key={p.id}>
                      <strong>{p.name}</strong>
                      {p.manufacturer ? ` · ${p.manufacturer}` : ""}
                      <span className="midi-port-meta">
                        {" "}
                        · {p.state}/{p.connection}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Outputs ({ports.outputs.length})</h3>
              {ports.outputs.length === 0 ? (
                <p className="midi-empty">None (fine for listening; LED test needs an output).</p>
              ) : (
                <ul>
                  {ports.outputs.map((p) => (
                    <li key={p.id}>
                      <strong>{p.name}</strong>
                      {p.manufacturer ? ` · ${p.manufacturer}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="midi-led-test">
            <h3>LED test</h3>
            {outputCount === 0 && (
              <p className="midi-banner warn">
                No MIDI outputs — can’t light LEDs from the browser. Many Bluetooth MIDI links expose
                input only; USB may show an output. Sends also may not latch over BT.
              </p>
            )}
            <div className="lab-toolbar midi-led-toolbar">
              <button
                type="button"
                disabled={outputCount === 0}
                onClick={() => runLedTest("Play D1 on", ledTestPlayDeck1)}
              >
                Play D1
              </button>
              <button
                type="button"
                disabled={outputCount === 0}
                onClick={() => runLedTest("Pads on", ledTestPads)}
              >
                Pads
              </button>
              <button
                type="button"
                disabled={outputCount === 0}
                onClick={() => runLedTest("All off", ledTestAllOff)}
              >
                All off
              </button>
            </div>
            {ledNote && <p className="midi-led-note">{ledNote}</p>}
          </div>

          <div className={`midi-flash${lastFlash ? " on" : ""}`} aria-live="polite">
            {lastFlash ?? (paused ? "Paused — move a control after Resume" : "Waiting for MIDI…")}
          </div>

          <div className="midi-log" role="log" aria-label="MIDI message log">
            {log.length === 0 ? (
              <p className="midi-empty">No messages yet. Press Play, move a fader, or twist FILTER.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Port</th>
                    <th>Kind</th>
                    <th>Summary</th>
                    <th>Hex</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((row) => (
                    <tr key={row.id}>
                      <td>{formatClock(row.at)}</td>
                      <td>{row.port}</td>
                      <td>{row.kind}</td>
                      <td>{row.summary}</td>
                      <td className="mono">{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
