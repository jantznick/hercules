import type { GenreId } from "./genres";

export type BlendStep = { title: string; do: string };

export type LeaveMove = { name: string; when: string; how: string };

export type BlendGuide = {
  idea: string;
  faders: string;
  crossfader: string;
  headphones: string;
  sync: string;
  skipIf: string;
  reset: string;
  steps: BlendStep[];
  leaveMoves: LeaveMove[];
};

export const BLEND: Record<GenreId, BlendGuide> = {
  any: {
    idea:
      "A blend is one loop: hear the next song first, start it on beat 1, let the room have both for as long as this music wants, then the new song owns the room and you reset the old deck. Mix in / mix out is which sections. This is the hands.",
    faders:
      "Each deck has a channel fader — up = that deck can be in the mix, down = silent in the room even if it’s playing. Beginners: incoming fader stays down until you mean it. That is not the same as Play, and not the same as headphones.",
    crossfader:
      "The long slider between the decks blends left deck ↔ right deck. Park it toward the song that’s in the room. Center = both (if both faders are up). You can mix with only channel faders and leave the crossfader parked — that’s often simpler at 101. Don’t fight yourself with both at once until the loop is boring.",
    headphones:
      "Light only the incoming deck’s headphone button. Line up in your ears: speed, beat 1, LOW or Filter ready. Both buttons on to check they’re together, then incoming-only again. Gear page: Pre-cue. Play does not mean “headphones only.”",
    sync: "SYNC on the incoming deck matches speed (and optionally beats — that’s a djay setting). It does not pick a section, does not set a cue, and does not move the fader. You still start on beat 1.",
    skipIf:
      "If the file has no extra drums at the start (no drum intro, 3-minute pop, two vocals), don’t force this whole loop. Cut or echo-then-cut. The steps below still apply — they’re just shorter.",
    reset:
      "Old deck: fader down, Filter and EQ at 12 o’clock, Neural Mix off, HOT CUE mode. Then load the next file there. Leftover LOW-left is how the “next” song comes in with no bass and you don’t know why.",
    steps: [
      {
        title: "Room is one song",
        do: "Outgoing fader up, incoming fader down, crossfader parked at the live deck. Incoming can be loaded and even playing — the room shouldn’t hear it.",
      },
      {
        title: "Hear it first",
        do: "Turn on the incoming deck’s headphone button only. Jump to hot cue 1 — that’s the mix-in you saved, the first rubber pad in HOT CUE mode, not the CUE button. Press SYNC. In your ears, check that both songs’ beat 1 line up with the song in the room.",
      },
      {
        title: "Carve space",
        do: "On the incoming deck, turn the LOW knob a little left (less kick and bass), or turn Filter a little to the right (the whole song gets thinner). You’re making space so two basslines don’t hit at once.",
      },
      {
        title: "Start on beat 1",
        do: "When the old song hits beat 1 of a new chunk, start the new song: Play, or hit hot cue 1. Raise the incoming channel fader. Both songs are in the room; the old song still has the bass.",
      },
      {
        title: "Hand over",
        do: "On a later beat 1: turn the old song’s LOW left and the new song’s LOW back up (Filter to 12 o’clock). Now the incoming song owns the bass. Fade the old channel fader out while that song still sounds like itself — not in the last hiss.",
      },
      {
        title: "Reset the empty deck",
        do: "Knobs home, fader down, load the next pick. You always want one free deck.",
      },
    ],
    leaveMoves: [
      {
        name: "Cut",
        when: "Short files, two vocals, or you want a punch. Hip-hop and pop live here.",
        how: "On beat 1: new fader up (or already up), old fader down. Or hit the new song’s hot cue 1 and pull the old fader down. No long overlap.",
      },
      {
        name: "Echo then cut",
        when: "A last word or title line people know. Pop, hip-hop, vocal house.",
        how: "Press FX so that mode is on. Hold Echo on that word (keep your finger down), let go, hit the new song’s hot cue 1, raise its fader. The echo should die as you leave (Post-fader in djay settings helps).",
      },
      {
        name: "Bass-swap blend",
        when: "Club files with drum intros. House, techno, DnB.",
        how: "New drums in, new LOW left (less bass). Trade LOW on beat 1, then fade the old fader. Thirty seconds to a minute in house; seconds in DnB.",
      },
      {
        name: "Filter",
        when: "You want one knob instead of a bass trade, or a few bars of “thin” on the way in.",
        how: "Incoming Filter a little right, back to 12 as it arrives. Or outgoing Filter left to muffle it away, then fader down. Don’t leave Filter off-center.",
      },
    ],
  },

  house: {
    idea:
      "This is the long blend the Mix Ultra’s EQ and Filter are good at. You’re overlapping drums, not choruses. The drop is for the room — mix around it.",
    faders:
      "Incoming fader comes up during the old last groove (or old breakdown). You have 16–32 bars — raise it smoothly, not a slam, unless you meant a cut into the drop.",
    crossfader:
      "Park it. Mix with channel faders so you can still kill one deck fast. If you use the crossfader, move it over a phrase or two, not a tiny twitch every beat.",
    headphones:
      "Incoming only while you find hot cue 1 and SYNC. Both on for a bar to confirm kicks together, then incoming-only so the old song in the room doesn’t confuse you.",
    sync: "Made for this. Grid is usually right on extended versions. Tempo fader for tiny taste, not for turning the track into a different genre.",
    skipIf:
      "Radio edit / 3-minute version: you don’t have this blend. Short Filter or a cut into the first groove, then get out. Don’t spend the drop mixing.",
    reset:
      "After the new drop is in the room: old fader down, old LOW and Filter to 12, load the next extended file. Don’t wait for the outro hiss.",
    steps: [
      {
        title: "Old groove still fat",
        do: "You should still see a tall block on the old waveform. If it’s already a skinny tail, you waited too long — pick a different leave point next time.",
      },
      {
        title: "Hot cue 1 in headphones",
        do: "Incoming: first kick. SYNC. LOW left (less bass) or Filter a little right.",
      },
      {
        title: "Drums in, bass still old",
        do: "Hit hot cue 1 on beat 1. Raise incoming fader over 8–16 bars. Hats can come in; bass stays on the old LOW.",
      },
      {
        title: "Trade bass on a One",
        do: "Old LOW left (less bass), new LOW up together (Filter to 12). Now the new track is the song.",
      },
      {
        title: "Aim the drop",
        do: "Time the old fade so the new drop (hot cue 2) hits as the old groove leaves — or mix into the old breakdown and land the new drop in that hole.",
      },
      {
        title: "Reset",
        do: "Empty deck home. Next file loaded before this drop is over — you think you have time; the outro will steal it.",
      },
    ],
    leaveMoves: [
      {
        name: "Bass-swap blend",
        when: "Default. Extended files, last fat groove or breakdown.",
        how: "New intro over old groove. LOW trade on beat 1. 16–32 bars. Then old fader out.",
      },
      {
        name: "Drop in the hole",
        when: "Old track has a real breakdown.",
        how: "New hot cue 2 on beat 1 of the break. Old bass out. Don’t also keep the old drop coming back.",
      },
      {
        name: "Filter in",
        when: "You want one knob, or a little color on the incoming drums.",
        how: "Incoming Filter right, to 12 as bass comes in. Same idea as LOW left (less bass).",
      },
      {
        name: "Cut / echo",
        when: "Vocal house chorus, or a radio edit with no extra drums at the start.",
        how: "Treat it like pop for a moment: protect the singer, short overlap.",
      },
    ],
  },

  hiphop: {
    idea:
      "The “blend” is often 8 bars or a cut. The same hand order still holds — you just don’t linger. Headphones and hot cue 1 matter more, because you don’t get a minute to fix a miss.",
    faders:
      "Incoming fader can slam on beat 1 (a cut) or come up over ~8 bars of beat. Don’t ride it for 40 seconds — the verse already started.",
    crossfader:
      "A fast move to the new side on beat 1 is a cut with one slider. Channel faders do the same job. Pick one.",
    headphones:
      "You need hot cue 1 ready (past the skit) before the old hook ends. Both decks in ears for a second if you’re lining up a beat-only overlap, then cut.",
    sync: "Helps. Key Lock on if you’re stretching toward pop so voices don’t chipmunk. A wrong grid is obvious because the mix is short — if it feels drunk, tap the cue, don’t trust snap.",
    skipIf:
      "Two verses that both have words: skip the overlap. Echo the last hook word, cut. The long house loop below is the trap for this music.",
    reset:
      "Old fader down the moment the new vocal owns the room. Reset EQ. Next hook already on a pad if you can.",
    steps: [
      {
        title: "Know the leave",
        do: "Old hot cue 4 / last hook. You will not get a long outro. Incoming hot cue 1 past talking.",
      },
      {
        title: "Headphones, SYNC, ready to cut",
        do: "Incoming in ears. If you’ll overlap: mute incoming vocal (Neural Mix) or keep LOW left (less bass).",
      },
      {
        title: "Beat 1",
        do: "Cut: new fader up, old down (or echo, then that). Overlap: new beat under the last 8 of the old hook, then new vocal in alone.",
      },
      {
        title: "One voice",
        do: "If you hear two rappers, kill one — fader, Neural Mix mute, or you left too late.",
      },
      {
        title: "Reset",
        do: "Empty deck home. These files end. Load now, not when you hear silence.",
      },
    ],
    leaveMoves: [
      {
        name: "Cut on beat 1",
        when: "Default. Verse to verse or hook to verse after the old vocal stops.",
        how: "New hot cue 1, old fader down. Cleaner than a long EQ story.",
      },
      {
        name: "Echo then cut",
        when: "Last word of a hook people know.",
        how: "HOLD FX Echo, release, new pad. Don’t start the new verse under the echo.",
      },
      {
        name: "Beat under, then vocal",
        when: "You want a little blend without two voices.",
        how: "Neural Mix mute incoming vocals for ~8 bars, then that vocal in alone. Incoming LOW left (less bass) until the cut.",
      },
      {
        name: "Bass-swap (short)",
        when: "Rare — only if both have beat-only space.",
        how: "A few bars, then one 808. Not a minute.",
      },
    ],
  },

  pop: {
    idea:
      "Hands still go headphones → beat 1 → room. The overlap is a few bars or an echo. You’re handing chorus to chorus, not building a club blend.",
    faders:
      "Incoming fader often goes up as you hit hot cue 1 (first chorus). Old fader down as the echo fades or on that same beat 1. Smooth 30-second raises eat the chorus.",
    crossfader:
      "A throw to the new side on beat 1 is fine. Or ignore it and use channel faders. Don’t “ease it” across a whole verse.",
    headphones:
      "Confirm the new first chorus in ears while the old last chorus plays. You should already know the title line you’re going to echo on the old song.",
    sync: "Match speed if they’re close. If one is a ballad, a hard cut after the last line is kinder than stretching both until they meet.",
    skipIf:
      "If you’re reaching for LOW trades and 16-bar intros, you loaded the wrong mental model — or a dance remix. Soundtrack files want echo/cut.",
    reset:
      "Old knobs home. Next chorus cued. These songs are ~3 minutes — the empty deck is the next request.",
    steps: [
      {
        title: "Old last chorus",
        do: "Hot cue 2 (or 4). Room is singing. Incoming hot cue 1 = first chorus, in headphones, fader down.",
      },
      {
        title: "Echo the title (or just wait for the last beat 1)",
        do: "FX Echo, HOLD on the line, let go. Or skip echo and cut on the last beat 1.",
      },
      {
        title: "New chorus in",
        do: "Hit hot cue 1, incoming fader up, old fader down. Optional: incoming Filter a little right for two bars, then 12 o’clock.",
      },
      {
        title: "Protect the singer",
        do: "If both are still singing, you were late or the echo was too long. Kill the old fader.",
      },
      {
        title: "Reset",
        do: "Empty deck home. Load the next known chorus. Don’t browse during the new chorus.",
      },
    ],
    leaveMoves: [
      {
        name: "Echo then chorus",
        when: "Default for kids / Disney / radio pop.",
        how: "HOLD Echo on the title, new hot cue 1, faders swap. One singer.",
      },
      {
        name: "Cut chorus to chorus",
        when: "No echo, punchy, both songs famous.",
        how: "Beat 1 of the new chorus as the old one ends. Old fader down.",
      },
      {
        name: "Filter for a few bars",
        when: "Speeds are close and you want a tiny blend.",
        how: "Incoming Filter right, to 12 as the new chorus hits. Then old fader out. Not a minute.",
      },
      {
        name: "Bass-swap",
        when: "You loaded a dance remix with real drums at the ends.",
        how: "Switch plans: that’s house. Use the intro.",
      },
    ],
  },

  dnb: {
    idea:
      "Same loop as house, compressed. Headphones and hot cue 2 (drop) are not optional — the intro is 20–40 seconds, not two minutes.",
    faders:
      "Incoming fader up over a phrase or two, not a long ride. You can still miss the drop if you’re gentle for too long.",
    crossfader:
      "Park it, or a decisive move over 8 bars. Tiny wiggles at 174 BPM just sound nervous.",
    headphones:
      "Hot cue 1 and hot cue 2 both marked before you start the blend. Count. Both decks in ears for a bar to confirm, then incoming-only.",
    sync: "Use it. Then count anyway. “It feels like time” is already late.",
    skipIf:
      "If you haven’t found the drop, don’t start a blend. Cut once you have hot cue 2, or pick a different file.",
    reset:
      "The outro can fall off a cliff. Old fader down on the fat drop, knobs home, next intro loaded while this drop is still going.",
    steps: [
      {
        title: "Leave the fat drop",
        do: "Old hot cue 4 is the last tall block, not the cliff after. Incoming hot cue 1 in headphones, LOW left (less bass), SYNC.",
      },
      {
        title: "Intro over still-loud drop",
        do: "Hot cue 1 on beat 1. Incoming fader up. You have seconds.",
      },
      {
        title: "Bass trade, then the new drop",
        do: "LOW swap on a One. Time hot cue 2 so the new drop hits as the old one leaves — or land hot cue 2 in the old breakdown.",
      },
      {
        title: "Stunt or don’t",
        do: "A few seconds of both drops is a choice. A whole phrase of two Reeses is mud. Then one LOW left (less bass).",
      },
      {
        title: "Reset now",
        do: "Empty deck home before the cliff. Load the next 170 file.",
      },
    ],
    leaveMoves: [
      {
        name: "Bass-swap (short)",
        when: "Default. Intro over last fat drop.",
        how: "New LOW left (less bass), count, trade, time the new drop. Seconds, not a minute.",
      },
      {
        name: "Drop in the breakdown",
        when: "Old track has a real hole.",
        how: "Hot cue 2 on beat 1 of the break. Old bass out.",
      },
      {
        name: "Double-drop stunt",
        when: "You meant it, a few seconds only.",
        how: "Both peaks, then old LOW or fader out. Accidental = noise.",
      },
      {
        name: "Cut",
        when: "You missed the intro window.",
        how: "Hot cue 2 on a One, old fader down. Better than mixing into the cliff.",
      },
    ],
  },
};
