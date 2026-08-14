import type { GenreId } from "./genres";

export type JumpFlavor = {
  intro: string;
  brake: string;
  stretch: string;
  loopBridge: string;
};

export const JUMP_FLAVOR: Record<GenreId, JumpFlavor> = {
  any: {
    intro:
      "Long blend, bass swap, and the other same-speed mixes assume both songs can share a speed. When they can’t — a 90 BPM rap into 124 house, a ballad into a banger — you still have three honest exits: stop the old song on purpose (spin-down + echo), match them by hand with Key Lock on (Key Lock only holds notes still while you change speed — it is not a pitch SYNC) while you blend and walk the tempo, or loop a few beats of the old song so you have time to arrive.",
    brake:
      "Works in every style because you are not blending kicks. Best at a breakdown, the end of a chorus, or a last title line. The next song can start on its chorus or first beat — speeds do not have to match.",
    stretch:
      "Use this when the BPMs are close enough that stretching with Key Lock still sounds like music (a few BPM, or a modest jump). Key Lock is not matching keys. A 90-to-170 leap will sound like a different night — prefer the brake cut, or a song in between.",
    loopBridge:
      "Loop 1 or 4 bars of the old song (often a beat-only or breakdown bar). Bring the new intro in over that loop, ease the old tempo toward the new song’s speed, then echo and Filter the loop away. You bought time; you still need one bass and one vocal.",
  },
  house: {
    intro:
      "Same-speed blends are the default. Use these when the next file is a different world (vocal pop, drum & bass) or when the intro is shorter than you wanted.",
    brake:
      "A clean way off a vocal-house chorus into something that isn’t 124. Echo, pause with a little start/stop time, hit the new song. You gave up the long blend on purpose.",
    stretch:
      "House into 128 big-room is a small stretch. House into 170 drum & bass is not a stretch — that’s a cut or a loop-bridge with a plan. Mix Ultra has no Rekordbox “3/4 roll” pad; don’t chase that trick on this deck.",
    loopBridge:
      "Loop 4 bars of the last groove or the breakdown. Incoming drum intro over the loop. Echo + Filter right on the loop as you leave. Classic “I need 16 more beats.”",
  },
  hiphop: {
    intro:
      "Most hip-hop leaves are already a cut or echo-out. These three matter when the next song is pop or house and the BPM jump is the real problem.",
    brake:
      "End of a hook: echo the last word, pause (brake), start the next chorus or beat. No SYNC required. This is often cleaner than stretching a rapper to 124.",
    stretch:
      "Toward pop (~110–120) with Key Lock on (holds pitch while you change speed — not matching keys) can work if the overlap is short. Toward 170 drum & bass: brake or cut. Don’t leave two rappers on while the tempo is sliding.",
    loopBridge:
      "Loop 1–2 bars of beat (no vocal). Bring the new song’s drums in. Echo the loop away. Keep it short — looping a whole verse sounds like you’re stuck.",
  },
  pop: {
    intro:
      "Soundtrack files rarely share a tempo. Echo-out and the brake cut will save more nights than a long SYNC blend.",
    brake:
      "Last chorus, echo the title, pause with a little spin-down, next chorus. Kids parties forgive this; it sounds like the song ended and the next one started — which is what they wanted.",
    stretch:
      "Key Lock on so voices don’t go thin and high while you change speed — that is not matching keys. If the BPMs are within shouting distance, match by hand and keep the overlap short. If one is a ballad and one is 128, skip the stretch — brake or echo, then the new chorus.",
    loopBridge:
      "Only if you have a few bars of beat under a chorus. Looping “we don’t talk about Bruno” until the next movie starts is how people notice. Prefer echo-out.",
  },
  dnb: {
    intro:
      "Staying near 170 is easier than jumping. When you leave for house or hip-hop, use a brake or a planned drop mix, not a minute of both BPMs.",
    brake:
      "After a fat drop: echo, pause, next genre. The outro cliff already wants a hard ending — this just makes it stylish.",
    stretch:
      "DnB down toward 130 house with Key Lock will sound slow and heavy. Prefer a cut. The “divide by 0.75” roll trick is a Rekordbox pad effect this controller doesn’t have.",
    loopBridge:
      "A 4-bar loop on the breakdown, new intro in, echo the loop. You have seconds. Count.",
  },
};
