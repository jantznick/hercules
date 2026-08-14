import type { GenreId } from "./genres";

export type TransitionFlavor = {
  defaultMove: string;
  longBlend: string;
  bassSwap: string;
  dropMix: string;
  echoOut: string;
  xfaderCut: string;
};

export const TRANSITION_FLAVOR: Record<GenreId, TransitionFlavor> = {
  any: {
    defaultMove:
      "Start with the long blend (channel faders only) until it feels boring. Then add the bass swap. Echo-out and the drop mix come next. The crossfader cut is last — it is a peak moment, not the way you leave every song.",
    longBlend:
      "Works when both files still have a beat for the whole fade. Club tracks with extra drums at the ends are easy. A 3-minute pop song often runs out of chorus while you’re still being gradual — shorten the fade, or use echo-out instead.",
    bassSwap:
      "The long blend, but you also keep one bassline. Same idea on Mix Ultra: the LOW knob, not a separate “bass EQ.” Two bass knobs at 12 o’clock with both faders up is how a mix gets muddy (and how a speaker can distort).",
    dropMix:
      "The old song is in a quieter build. You do not let it hit its loud payoff. On beat 1 you drop the old fader and start the new song on its drop or chorus. If the two payoffs are not on the same beat 1, it feels wrong even when the kicks match.",
    echoOut:
      "Hold Echo on the last word or the last beat of a phrase, pull the old fader down, then start the new song. Speeds can be a little apart and it still sounds finished. Don’t use this as the only way you ever leave a song — it gets old fast.",
    xfaderCut:
      "Both songs playing a loud part, both channel faders up, EQ at 12 o’clock. Throw the crossfader from the old side to the new side (or chop between them). High energy, easy to overdo. A Mix Ultra setting can auto-start a paused deck when you move the crossfader — know whether that’s on.",
  },
  house: {
    defaultMove:
      "Long blend and bass swap are the mixes you’ll use most. Drop mix is how you skip someone else’s drop and land yours. Echo-out is an exit, not every mix. Crossfader cuts are a loud-moment trick.",
    longBlend:
      "This is home. Extra drums at both ends exist so you can fade slowly. Take 16–32 bars. If you slam the faders in four beats, you threw away the point of the long version.",
    bassSwap:
      "Default once two kick drums are overlapping. Incoming LOW left while you raise the fader. Swap on beat 1 of an 8-bar chunk. Isolator EQ in djay makes “bass off” actually off.",
    dropMix:
      "Old track in the breakdown or build. Do not let that drop hit. New hot cue 2 (the drop) on beat 1 as the old fader goes down. The room expected one payoff and got a different one — that’s the point.",
    echoOut:
      "Useful on vocal house, or when you want to leave a groove and land in a breakdown. One-beat echo, then the new intro or breakdown. Don’t echo-out every eight bars of a two-hour house set.",
    xfaderCut:
      "Both on a drop, both bass knobs up only if you’re chopping for a few seconds — then pick one. Crossfader curve “Cut” in djay makes the throw sharper. Linear/Default is easier for blends; switch back after.",
  },
  hiphop: {
    defaultMove:
      "Echo-out and a cut on beat 1 are the mixes you’ll use most. A long fader fade usually lasts longer than the verse. Bass swap only for the few bars you overlap. Drop mix = don’t let the old hook finish if you’re jumping a new hook. Crossfader chops work when both beats are simple.",
    longBlend:
      "Keep it short — a few bars of beat, not 40 seconds. If both people are rapping, this move is the wrong one. Mute one vocal or don’t overlap.",
    bassSwap:
      "Deep 808s still fight. For the bars you overlap, incoming LOW left, then cut. You rarely have time for a slow house-style swap.",
    dropMix:
      "Old hook is about to hit again — you don’t let it. New verse or hook on beat 1. Same idea as a drop: the room expected the line they know, and you switched the song instead. Timing has to be on beat 1.",
    echoOut:
      "This is the clean hip-hop leave. Hold Echo on the last word of the hook, fader down, new hot cue 1. Speeds don’t have to match perfectly.",
    xfaderCut:
      "Works when both beats are running and you want a quick “this one / that one.” Two vocals under the chops is still two vocals. Mute or pick instrumental bars.",
  },
  pop: {
    defaultMove:
      "Echo-out the title, then the next chorus. A long gradual fade eats the chorus. Bass swap is a few bars at most. Drop mix = don’t let the old last chorus finish if you’re jumping a new first chorus. Crossfader cuts are a party trick, not every Disney song.",
    longBlend:
      "Only if you loaded a dance remix with extra drums. Soundtrack and radio files: you’ll still be fading when the 3-minute file is over. Use echo-out or a short cut.",
    bassSwap:
      "Optional color for a few bars, not a minute. Incoming LOW left or Filter a little right, then the new chorus owns the room.",
    dropMix:
      "Old last chorus is the “build.” You don’t let them finish the last title line — or you do, then you jump. If you cut to the new chorus on beat 1 instead of letting the old drop (last chorus) land, that’s this move. Phrasing still has to be exact.",
    echoOut:
      "The default leave. Hold Echo on the title or character name, fader down, new first chorus (hot cue 1). One singer.",
    xfaderCut:
      "Two choruses chopping at each other is two movies at once unless you meant a mashup. Save it for two instrumental bits, or don’t.",
  },
  dnb: {
    defaultMove:
      "Bass swap and drop mix, but faster. A “long” blend is one or two 8-bar chunks, not a minute. Echo-out works. Crossfader cuts at 170 BPM are easy to miss — count.",
    longBlend:
      "Same idea as house, compressed. Raise the fader over a phrase or two. A slow 40-second fade will miss the drop.",
    bassSwap:
      "Same as house: incoming LOW left, swap on beat 1. Two growly basses is muddy and loud. You have seconds.",
    dropMix:
      "This music lives here. Old track in the breakdown. Do not let drop 2 hit. New hot cue 2 on beat 1. If you’re late, you’re already in the old drop.",
    echoOut:
      "A clean way off a drop into a breakdown, or off a drop into a new intro. Don’t lean on it every track.",
    xfaderCut:
      "Both drops, a few chops, then pick one bass. Miss beat 1 and it sounds like a mistake, not a trick.",
  },
};
