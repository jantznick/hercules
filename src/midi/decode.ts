/** Human-readable decode of raw MIDI bytes (note / CC / pitch bend / etc.). */

export type DecodedMidi = {
  kind: string;
  summary: string;
  channel: number | null;
  detail: string;
};

function hexBytes(data: Uint8Array): string {
  return [...data].map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

export function decodeMidiMessage(data: Uint8Array): DecodedMidi {
  if (data.length === 0) {
    return { kind: "empty", summary: "(empty)", channel: null, detail: "" };
  }

  const status = data[0]!;
  const hex = hexBytes(data);

  // System messages (0xF0–0xFF)
  if (status >= 0xf0) {
    const names: Record<number, string> = {
      0xf0: "SysEx start",
      0xf1: "MTC quarter frame",
      0xf2: "Song position",
      0xf3: "Song select",
      0xf6: "Tune request",
      0xf7: "SysEx end",
      0xf8: "Timing clock",
      0xfa: "Start",
      0xfb: "Continue",
      0xfc: "Stop",
      0xfe: "Active sensing",
      0xff: "Reset",
    };
    const kind = names[status] ?? `System 0x${status.toString(16)}`;
    return { kind, summary: kind, channel: null, detail: hex };
  }

  const channel = (status & 0x0f) + 1;
  const type = status & 0xf0;
  const d1 = data[1] ?? 0;
  const d2 = data[2] ?? 0;

  switch (type) {
    case 0x80:
      return {
        kind: "Note Off",
        summary: `Note Off · ch ${channel} · note ${d1} · vel ${d2}`,
        channel,
        detail: hex,
      };
    case 0x90:
      if (d2 === 0) {
        return {
          kind: "Note Off",
          summary: `Note Off (vel 0) · ch ${channel} · note ${d1}`,
          channel,
          detail: hex,
        };
      }
      return {
        kind: "Note On",
        summary: `Note On · ch ${channel} · note ${d1} · vel ${d2}`,
        channel,
        detail: hex,
      };
    case 0xa0:
      return {
        kind: "Poly Aftertouch",
        summary: `Poly AT · ch ${channel} · note ${d1} · ${d2}`,
        channel,
        detail: hex,
      };
    case 0xb0:
      return {
        kind: "Control Change",
        summary: `CC ${d1} · ch ${channel} · value ${d2}`,
        channel,
        detail: hex,
      };
    case 0xc0:
      return {
        kind: "Program Change",
        summary: `Program · ch ${channel} · ${d1}`,
        channel,
        detail: hex,
      };
    case 0xd0:
      return {
        kind: "Channel Aftertouch",
        summary: `Channel AT · ch ${channel} · ${d1}`,
        channel,
        detail: hex,
      };
    case 0xe0: {
      const bend = ((d2 << 7) | d1) - 8192;
      return {
        kind: "Pitch Bend",
        summary: `Pitch Bend · ch ${channel} · ${bend}`,
        channel,
        detail: hex,
      };
    }
    default:
      return {
        kind: "Unknown",
        summary: `Unknown · ${hex}`,
        channel,
        detail: hex,
      };
  }
}
