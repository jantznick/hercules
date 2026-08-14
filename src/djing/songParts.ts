import type { GenreId } from "./genres";

export type MixPair = {
  from: string;
  onto: string;
  why: string;
  how: string;
};

export type EnergyPoint = { label: string; height: number };

export type MixJob = { job: string; means: string };

export type SongAnatomy = {
  length: string;
  howBuilt: string;
  eightBar: string;
  whyContrast: string;
  energyCaption: string;
  energyCurve: EnergyPoint[];
  mixJobs: MixJob[];
  layers: { name: string; job: string }[];
  order: { name: string; what: string; howLong: string; djUse: string }[];
  mixPairs: MixPair[];
  avoidPairs: MixPair[];
  versions: string;
  listenFor: string[];
};

export const SONG_ANATOMY: Record<GenreId, SongAnatomy> = {
  any: {
    length:
      "Pop and kids songs are often ~3 minutes. Club house/techno “DJ mix” versions are often 5–8 minutes. Hip-hop is usually 3–4. Drum & bass sits in between but feels faster.",
    howBuilt:
      "Someone records or programs layers (drums, bass, chords, a lead, maybe a voice), then arranges them in time: quiet start, something you remember in the middle, a way out at the end. DJs don’t rewrite that. You choose which slice the room hears, and which slice of song B to put on top of song A.",
    eightBar:
      "Almost all of this music is glued from 8-bar blocks (sometimes 16). A verse is usually one or two of those. A chorus is often one. That’s why counting 8s lines you up with the songwriter, not just the drummer. Cut 3 bars into an 8 and you’re in the middle of a sentence — even if the kick is still on time.",
    whyContrast:
      "If every second were as loud as the chorus, the chorus wouldn’t land. Quiet parts exist so loud parts hit. Producers take drums away, then give them back. You use that contrast: mix into a quieter section, leave while the old song is still full, and don’t stack two peaks unless you meant a short moment of both.",
    energyCaption:
      "A typical energy shape — not volume, kick + bass + “the product.” Your job is to land the next song without sitting in two valleys or two mountains for long.",
    energyCurve: [
      { label: "Intro", height: 28 },
      { label: "Verse", height: 48 },
      { label: "Chorus", height: 88 },
      { label: "Verse", height: 52 },
      { label: "Chorus", height: 92 },
      { label: "Bridge", height: 38 },
      { label: "Chorus", height: 100 },
      { label: "Out", height: 22 },
    ],
    mixJobs: [
      {
        job: "Keep a pulse",
        means:
          "The room should still feel a beat unless you chose a breakdown. Two fading endings = people sit down.",
      },
      {
        job: "Swap the identity",
        means:
          "At some point the new song is “the one that’s on.” Bass, then the hook. Don’t leave both songs half-there for a minute.",
      },
      {
        job: "Protect the product",
        means:
          "Chorus, drop, or the line people came to hear. Don’t cover it with the other song’s verse, and don’t skip it by accident.",
      },
    ],
    layers: [
      {
        name: "Kick",
        job: "The boom on the beat. This is most of the “thump.” Two kicks at once get messy.",
      },
      {
        name: "Other drums",
        job: "Hats, snare, claps, percussion. Hats are the sparkle (HIGH). Snare is often in the mids.",
      },
      {
        name: "Bass",
        job: "Low notes under the kick — bass guitar, synth bass, 808. Lives on the LOW knob with the kick.",
      },
      {
        name: "Chords / pads",
        job: "The harmonic bed. Makes a section feel full even without a vocal.",
      },
      {
        name: "Lead",
        job: "The riff or synth you hum. In pop this might be the sung melody instead.",
      },
      {
        name: "Vocal",
        job: "Words. Lead singer or rapper, plus backing. Two leads at once is the classic mess.",
      },
    ],
    order: [
      {
        name: "Intro",
        what: "Music before the “main thing.” Club tracks: often drums (and later bass) with no vocal. Pop: often tiny, or the vocal starts immediately.",
        howLong: "A few seconds (pop) up to a minute+ (club DJ versions)",
        djUse: "Mix in here if it actually has a beat. Skip it if it’s talking, or only a few seconds of piano — those files usually start from the first chorus instead.",
      },
      {
        name: "Verse",
        what: "The story / verses of lyrics. Usually less loud than the chorus. Words change each time.",
        howLong: "Often 8 or 16 bars",
        djUse: "Fine to mix into if you want the new song’s words. Don’t cover the old song’s chorus with this — that’s burying the part people were singing.",
      },
      {
        name: "Pre-chorus",
        what: "A short ramp that tells you the chorus is coming. Not every song has one.",
        howLong: "Often 4 or 8 bars",
        djUse: "Too short for a long blend. Use it as a “here comes the chorus” warning, then jump to the chorus on beat 1.",
      },
      {
        name: "Chorus / hook",
        what: "The repeatable part people came to sing. Same words each time (or close).",
        howLong: "Often 8 bars",
        djUse: "This is the product — the part people came to sing. Mix out of the last chorus, or jump the incoming song to its first chorus (hot cue 1 on a lot of pop files).",
      },
      {
        name: "Drop",
        what: "In dance music: the loud payoff — full kick + bass, maybe a riff. May have no singing. Pop people often say “chorus” for the same job.",
        howLong: "Often 16 bars in house/techno",
        djUse: "Same job as a chorus in dance music: protect it, or land it in a quiet hole in the other song. Keep one bassline — turn LOW left on one of the two decks.",
      },
      {
        name: "Breakdown / break",
        what: "Things drop out. Quieter middle. A hole you can mix into, or a dip before the next loud part.",
        howLong: "8–16 bars is common in club music; pop bridges can play this role",
        djUse: "Bring a new kick or drop in here. Don’t start a new song’s quiet intro over someone else’s empty ending — that’s two holes and the room sits down.",
      },
      {
        name: "Build",
        what: "Tension into a drop: drums get busier, a rising sound, snare rolls. The “here it comes” part.",
        howLong: "Often 8 bars before a drop",
        djUse: "Count it. Don’t start a new drop on top of someone else’s rising sound unless you timed both payoffs to the same beat 1.",
      },
      {
        name: "Bridge",
        what: "A different section so the last chorus doesn’t feel like a copy-paste. Sometimes a key change.",
        howLong: "Often 8 bars",
        djUse: "Often a quieter stretch, or a skip when you’re rearranging one song. Rarely where you leave — the last chorus usually is.",
      },
      {
        name: "Outro / ending",
        what: "How the file finishes: a fade, a last chorus, or a sudden stop. Club tracks often thin back to drums. Pop often just ends.",
        howLong: "Seconds (pop) to a minute (club)",
        djUse: "Leave before this is all that’s left. The quiet, thinning end of the file is too late — the room already sat down.",
      },
    ],
    mixPairs: [
      {
        from: "New song’s intro (drums / quiet start)",
        onto: "Old song’s last full beat (still loud)",
        why: "The room keeps a kick. The new song arrives without stealing the bass yet.",
        how: "On the new song, turn LOW left a little (less bass) or turn Filter a little to the right (thinner, less bass). Raise the new channel fader. On beat 1, swap: old LOW left, new LOW back up. Then fade the old song out.",
      },
      {
        from: "New song’s drop or chorus",
        onto: "Old song’s breakdown / quiet middle",
        why: "The old song made a hole; the new payoff fills it. Energy comes back.",
        how: "Jump the new song to its drop or chorus (hot cue 2 on the usual map) on beat 1 of that quiet section. Don’t also leave the old song’s bass up.",
      },
      {
        from: "New song’s chorus (after an echo)",
        onto: "Silence after the old last line",
        why: "One singer, clean start. Works when files are short and have no drum intro.",
        how: "Hold Echo (FX mode, keep your finger on the pad) on the old last word, let go, then hit the new song’s chorus (hot cue 1 or 2) and raise its fader.",
      },
    ],
    avoidPairs: [
      {
        from: "New song’s quiet intro",
        onto: "Old song’s fading ending",
        why: "Two empty parts. Beats can match and the room still sits down.",
        how: "Leave earlier, while the old song still has a kick drum.",
      },
      {
        from: "New chorus or rap verse",
        onto: "Old chorus or rap verse",
        why: "Two people talking/singing. Unless you meant a mashup.",
        how: "Mute one vocal (Neural Mix) or wait until the old vocal stops.",
      },
      {
        from: "New drop",
        onto: "Old drop (both basses up)",
        why: "Muddy bass, and both “payoffs” fight. A few seconds of both can be on purpose; a whole minute is noise.",
        how: "Turn LOW left on one deck, or don’t overlap the two loud peaks.",
      },
    ],
    versions:
      "The same title can be a 3-minute soundtrack/radio version (chorus arrives fast, no extra drums) or a long “extended / DJ mix” (extra drums at both ends). They need different mix plans. Load the file you actually have and look at the waveform — don’t assume.",
    listenFor: [
      "When the kick starts for real (not silence, not talking) — that’s often hot cue 1",
      "When singing starts, and when it stops",
      "The loudest repeating part (chorus or drop) — often hot cue 2",
      "A quieter hole in the middle — often hot cue 3",
      "The last moment that still has a beat — often hot cue 4",
    ],
  },

  house: {
    length:
      "DJ/extended versions are often 6–8 minutes. The 3-minute Spotify edit of the same tune is a different job — almost no extra drums at the start to mix over.",
    howBuilt:
      "Producers start with a kick and hats, add bass, then a riff or vocal chop, then take things away for a breakdown and slam them back for a second drop. The long drum intro and outro exist so you can overlap without covering the drop.",
    eightBar:
      "At ~124 BPM, 8 bars is about 15 seconds. A 32-bar drum intro is four of those (~1 minute). The “30–60 second blend” people talk about is two to four bricks of drums overlapping — not a vague fade.",
    whyContrast:
      "The drop is the part people came for. The long drum intro exists so you (or another DJ) can arrive without sitting on that drop. The breakdown is a quieter stretch so the second drop hits. If you mix two endings together, you threw away the whole point of the arrangement.",
    energyCaption:
      "Club energy: drums assemble, groove, drop, quieter middle, drop again, then peel off. Mix while the song still sounds full; leave before the quiet, thinning ending.",
    energyCurve: [
      { label: "Intro", height: 38 },
      { label: "Groove", height: 62 },
      { label: "Drop", height: 92 },
      { label: "Break", height: 24 },
      { label: "Build", height: 55 },
      { label: "Drop", height: 100 },
      { label: "Out", height: 32 },
    ],
    mixJobs: [
      {
        job: "Keep a kick",
        means: "Someone’s four-on-the-floor should stay in the room for the whole blend.",
      },
      {
        job: "One bassline",
        means: "Trade LOW on beat 1. Two basslines through a drop is mud.",
      },
      {
        job: "Don’t sit on the drop",
        means: "Use the intro to arrive. Get out before the real outro. The drop is for the room, not for mixing on top of.",
      },
    ],
    layers: [
      {
        name: "Kick (four-on-the-floor)",
        job: "A kick on every beat. This is the pulse you mix to.",
      },
      {
        name: "Hats & percussion",
        job: "Often arrive after 8 or 16 bars. That’s a phrase change — a good mix moment.",
      },
      {
        name: "Bassline",
        job: "Usually after the drum intro. Two basslines = mud. This is what LOW is for.",
      },
      {
        name: "Riff / stab / vocal chop",
        job: "The hook of a club track, even when nobody is singing verses.",
      },
      {
        name: "Sung vocal (if any)",
        job: "On vocal/melodic house, treat the chorus like pop: one singer.",
      },
      {
        name: "FX / risers",
        job: "Noise that climbs into a drop. Don’t mix a new drop on top of someone else’s riser by accident.",
      },
    ],
    order: [
      {
        name: "Drum intro",
        what: "Kick, then hats, maybe percussion. No bass yet, or a hint of it.",
        howLong: "Often 32–64 bars (~1–2 min at 124 BPM)",
        djUse: "This is where you start the song in a mix. Save it as hot cue 1 (HOT CUE mode, first rubber pad). Don’t skip it and land on the drop unless you meant a hard cut.",
      },
      {
        name: "Bass in / first groove",
        what: "The track “arrives.” Still not always the biggest drop.",
        howLong: "16–32 bars",
        djUse: "Finish the bass swap by here. The room should know the new song.",
      },
      {
        name: "Drop",
        what: "Full kick + bass + the main riff. The meat.",
        howLong: "16–32 bars",
        djUse: "Protect this — it’s the loud payoff. Or land a new drop in someone else’s quieter middle. Don’t leave both bass knobs up.",
      },
      {
        name: "Breakdown",
        what: "Kick and bass drop out or get quiet. Pads, vocal, or a filter sweep.",
        howLong: "8–16 bars",
        djUse: "The quieter stretch. Bring new drums or a new drop in here.",
      },
      {
        name: "Build",
        what: "Snare rolls, riser, drums coming back. Tells you the next drop is 8 bars away.",
        howLong: "Often 8 bars",
        djUse: "Count. Time the incoming drop to beat 1 after this, or get out before it.",
      },
      {
        name: "Second drop",
        what: "Often the peak. A common place to still be in the song — or to leave just after.",
        howLong: "16–32 bars",
        djUse: "Play this for the room. Where you leave (hot cue 4 on the usual map) is often the last full bars of this section, not the thinning outro after it.",
      },
      {
        name: "Outro",
        what: "Peels back to drums, then thins out. Do not wait until this is all that’s left.",
        howLong: "32+ bars on DJ versions",
        djUse: "Extra drums so the next song can arrive — that’s you, a bit earlier. Leave at the last full groove, not when this is all that’s left.",
      },
    ],
    mixPairs: [
      {
        from: "New track drum intro",
        onto: "Old track last full groove (still kick + bass)",
        why: "Classic club blend. Room never loses the kick.",
        how: "On the new song, turn LOW left a little (less bass), or Filter a little to the right. Overlap for 16–32 bars. On beat 1, swap bass (old LOW left, new LOW up), then fade the old track before its real fade-out.",
      },
      {
        from: "New track drum intro or first groove",
        onto: "Old track breakdown",
        why: "Old track made a hole; new drums fill it. Contrast without two empties.",
        how: "Start new intro as the breakdown hits. Time the new drop for when you want energy back.",
      },
      {
        from: "New drop",
        onto: "End of old breakdown / start of old build",
        why: "New payoff lands in the hole, then you get out of the old track.",
        how: "Jump the new song to its drop (hot cue 2 on the usual map) on beat 1. Turn the old song’s LOW left as the new drop hits.",
      },
    ],
    avoidPairs: [
      {
        from: "New intro",
        onto: "Old outro (last 30 seconds, already thin)",
        why: "Two sections built to be empty. The energy crash.",
        how: "Leave at the last full groove, not the quiet thinning ending.",
      },
      {
        from: "New drop",
        onto: "Old drop, both LOWs up",
        why: "Two full basslines through the peak.",
        how: "Turn LOW left on one deck, or don’t overlap the two peaks except for a few seconds on purpose.",
      },
      {
        from: "New sung chorus",
        onto: "Old sung chorus",
        why: "Melodic house: two leads.",
        how: "Shorter mix; protect the chorus; one vocal.",
      },
    ],
    versions:
      "Prefer “Extended,” “DJ Mix,” or original club 12\" if you want time to blend. Radio edits of FISHER / similar will feel rushed — that’s the file. An “Original Mix” is often the long one; “Radio Edit” is the short one.",
    listenFor: [
      "First kick that repeats — save as hot cue 1",
      "When the bassline fully locks in — often hot cue 2",
      "The quiet dip in the middle — often hot cue 3",
      "Last tall block on the waveform — hot cue 4, not the slope after it",
    ],
  },

  hiphop: {
    length: "Usually 2:30–4:30. Almost no extra drums at the ends. The vocal is the arrangement.",
    howBuilt:
      "A beat (drums + bass + a looped sample or melody) under verses and a hook. Verses tell the story; the hook is the line everyone knows. Talking, a producer name, or a skit may sit at the start — that is not where you start the mix.",
    eightBar:
      "Verses are often 16 bars (two 8s). Hooks are often 8. If you cut 2 bars into a 16, you’re mid-sentence. The beat may loop every 1 or 2 bars — that’s the bed, not the structure. Structure is the vocal.",
    whyContrast:
      "The hook is the part people came for. Verses have more words, usually a bit less singalong. A bar of beat-only is a quieter stretch you can mix into. There is no minute of drum intro — contrast is verse vs hook vs a sudden stop, not extra drums at the ends.",
    energyCaption:
      "Energy follows the vocal: tag, verse, hook, verse, hook. Switches are short. Protect one voice.",
    energyCurve: [
      { label: "Tag", height: 18 },
      { label: "Verse", height: 58 },
      { label: "Hook", height: 92 },
      { label: "Verse", height: 62 },
      { label: "Hook", height: 100 },
      { label: "Out", height: 40 },
    ],
    mixJobs: [
      {
        job: "One voice",
        means: "Two rappers at once and the room follows neither. Cut, echo, or mute.",
      },
      {
        job: "Hit the hook (or skip into it)",
        means: "People came for the line. Don’t spend it “building a blend” that this file doesn’t have time for.",
      },
      {
        job: "Keep it short",
        means: "A few bars of beat-only blend is plenty. Then the new vocal owns the room.",
      },
    ],
    layers: [
      {
        name: "Beat (kick + snare + hats)",
        job: "The loop under everything. Often starts before the vocal, but not for a minute.",
      },
      { name: "808 / bass", job: "Deep notes that fight another 808 if you overlap too long." },
      { name: "Sample / melody", job: "The musical hook of the beat." },
      { name: "Lead vocal", job: "The rap or sung verse. Don’t put another lead on it." },
      { name: "Ad-libs / doubles", job: "Extra voices in the hook. Still “one song’s vocal.”" },
      {
        name: "Guest verse",
        job: "A second rapper later. A good place to leave or to skip when remixing one song.",
      },
    ],
    order: [
      {
        name: "Pickup / skit / tag",
        what: "Talking, “yo,” a count-in. Skip this when you choose where to start.",
        howLong: "A few seconds",
        djUse: "Not where you start the mix. Scrub past it, then save hot cue 1 on the first real beat.",
      },
      {
        name: "Intro beat",
        what: "Beat without vocal, or a short sung line. Sometimes only 4–8 bars.",
        howLong: "Often 4–8 bars",
        djUse: "This is often the only extra drums you get — a few bars, not a minute. Use it, or skip to the verse/hook. Don’t wait for a long house-style drum intro that isn’t there.",
      },
      {
        name: "Verse 1",
        what: "Story. Energy is in the words.",
        howLong: "Often 16 bars (8 also happens)",
        djUse: "Hot cue 1 for a lot of DJs: first verse after the talking. Don’t start the next song’s verse on top of this one.",
      },
      {
        name: "Hook",
        what: "The chorus. Repeatable. People rap along here.",
        howLong: "Often 8 bars",
        djUse: "Protect it. Hold Echo on the last word of the old hook, then cut. Or land a new hook in a bar that is beat-only.",
      },
      {
        name: "Verse 2 / guest",
        what: "More story, or a feature.",
        howLong: "Often 16 bars",
        djUse: "A common leave-after-the-hook-before-this, or a skip when remixing one song.",
      },
      {
        name: "Hook again",
        what: "Same hook. A common place to leave.",
        howLong: "8 bars",
        djUse: "Often hot cue 4 — the last hook you still want people to hear, before the mumbled ending.",
      },
      {
        name: "Bridge / breakdown (maybe)",
        what: "Not always there. A beat-only bar or a sung bridge.",
        howLong: "4–8 bars if it exists",
        djUse: "A cut window if you get one. Don’t count on it.",
      },
      {
        name: "Last hook / ending",
        what: "Often a sudden stop or a fade with no extra drums.",
        howLong: "Short",
        djUse: "Have the next song ready. This file will end.",
      },
    ],
    mixPairs: [
      {
        from: "New verse or hook (clean vocal)",
        onto: "End of old hook (old vocal done)",
        why: "One voice. The switch people expect.",
        how: "Cut on beat 1, or hold Echo on the last old word, let go, then jump the new song to hot cue 1 or 2.",
      },
      {
        from: "New beat only (mute new vocal)",
        onto: "Last 8 bars of old hook",
        why: "A little blend without two rappers.",
        how: "Neural Mix mute vocals on the incoming deck for ~8 bars, then bring that vocal in alone.",
      },
      {
        from: "New hook",
        onto: "Old beat-only bar / end of verse",
        why: "Hook hits in a hole. Energy up.",
        how: "Jump the new hook (hot cue 2 on the usual map) on beat 1. Don’t start it on top of the old hook.",
      },
    ],
    avoidPairs: [
      {
        from: "New verse",
        onto: "Old verse",
        why: "Two people talking. The room can’t follow either.",
        how: "Wait, cut, or mute one vocal.",
      },
      {
        from: "Long house-style drum intro",
        onto: "Anything here",
        why: "There usually isn’t a minute of drums. You’ll eat the verse.",
        how: "Don’t wait. These switches are short.",
      },
      {
        from: "New hook",
        onto: "Old hook, both vocals up",
        why: "Two choruses.",
        how: "Echo out the old hook first, or mute one.",
      },
    ],
    versions:
      "Album versions, radio edits, and “clean” edits move the hook by a few seconds. Explicit vs clean can change the waveform. Put hot cue 1 on the first musical beat, not the skit. Instrumentals exist for some tracks — useful if you want beat-only blends.",
    listenFor: [
      "End of talking (then hot cue 1)",
      "First verse vs first hook (hot cues 1 and 2)",
      "When the vocal stops for a bar (a place you can cut)",
      "Last hook you still want people to hear (hot cue 4)",
    ],
  },

  pop: {
    length:
      "~2:30–4:00 for soundtrack, radio, and Spotify versions. A “dance remix” of the same song can be 5–7 minutes with extra drums — treat that file more like house.",
    howBuilt:
      "Verse tells a bit of story, pre-chorus leans forward, chorus is the product (same words, bigger). Repeat. Maybe a bridge. Then last chorus and the file ends. Kids/Disney songs are built the same way: the title line is the product.",
    eightBar:
      "Chorus is often 8 bars. Verse 8 or 16. Pre-chorus 4 or 8. Kids songs sometimes cheat with a 4-bar intro, then singing. Count the chorus — that’s the brick you’ll jump to and leave from.",
    whyContrast:
      "The chorus is louder, same words, the part they came to sing. Verses are quieter on purpose. There is usually no long drum intro: the contrast is verse vs chorus vs a hard ending. If you “blend for a minute,” you’ll spend the chorus mixing and the file will be over.",
    energyCaption:
      "Pop energy: tiny intro, verse, lean-in, chorus, down, chorus, maybe a bridge, last chorus, stop.",
    energyCurve: [
      { label: "Intro", height: 22 },
      { label: "Verse", height: 42 },
      { label: "Pre", height: 58 },
      { label: "Chorus", height: 92 },
      { label: "Verse", height: 48 },
      { label: "Chorus", height: 96 },
      { label: "Bridge", height: 44 },
      { label: "Last", height: 100 },
    ],
    mixJobs: [
      {
        job: "Chorus to chorus (or echo then chorus)",
        means: "Give them the part they know on the way out and the way in.",
      },
      {
        job: "One singer",
        means: "Two movie songs at once is two leads. Finish or echo the old title line first.",
      },
      {
        job: "Don’t wait for extra drums that aren’t there",
        means: "This file is about 3 minutes. Play the chorus. Leave on the last chorus. Cut, or hold Echo on the last line, then start the next song.",
      },
    ],
    layers: [
      {
        name: "Drums",
        job: "Often a full kit or programmed beat. May be small in the verse, bigger in the chorus.",
      },
      { name: "Bass", job: "Supports the chorus. Still muddy if two full choruses overlap." },
      { name: "Chords (piano, guitar, pads)", job: "The bed under the singing." },
      { name: "Lead vocal", job: "The character / pop star. This is why the song is in the set." },
      {
        name: "Backing vocals / kids choir",
        job: "Still one song’s vocal. Stacking two movie songs is two leads.",
      },
      {
        name: "Hook line / title",
        job: "“We don’t talk about Bruno,” “I won’t give up…” — mark this for echo.",
      },
    ],
    order: [
      {
        name: "Intro (tiny)",
        what: "A riff, a count, or singing from second 1. Often skippable.",
        howLong: "0–8 bars",
        djUse: "On a lot of pop, kids, and soundtrack files you do not mix in from this intro — it is only a few seconds, or the singing has already started. Save hot cue 1 (HOT CUE mode, first rubber pad) on the first chorus instead, so you can jump there when the previous song ends.",
      },
      {
        name: "Verse 1",
        what: "Setup. Quieter than the chorus.",
        howLong: "Often 8 or 16 bars",
        djUse: "Optional mix-in if you want a breath between hooks. Don’t cover the old last chorus with this.",
      },
      {
        name: "Pre-chorus",
        what: "The lean-in. “Here comes the part they know.”",
        howLong: "Often 4–8 bars",
        djUse: "A short “here comes the chorus” warning. Too short to blend on. After this, jump to the first chorus (hot cue 1).",
      },
      {
        name: "Chorus 1",
        what: "The part people came to sing. On a lot of these files, this is where you put hot cue 1.",
        howLong: "Often 8 bars",
        djUse: "Jump here. This is what you’re mixing toward — the first chorus of the new song.",
      },
      {
        name: "Verse 2",
        what: "More story, still quieter than the chorus.",
        howLong: "8–16 bars",
        djUse: "You can leave after chorus 1 if the room already got the hook — or stay for chorus 2.",
      },
      {
        name: "Chorus 2",
        what: "Same hook, often bigger.",
        howLong: "8 bars",
        djUse: "A fine place to still be in the song. Mix-out is usually the last chorus, not this if a last one is coming.",
      },
      {
        name: "Bridge (maybe)",
        what: "Different chords or a key change. A hole, or a new color.",
        howLong: "8 bars if it exists",
        djUse: "Skip when remixing, or use as a dip. Rarely the mix-out.",
      },
      {
        name: "Last chorus / ending",
        what: "Singalong peak, then the file is over. No long drum outro.",
        howLong: "8–16 bars, then stop",
        djUse: "Save hot cue 2 (or 4) here: last chorus. Hold Echo on the title line, then start the next song’s chorus. Have that next song ready — this file ends soon after.",
      },
    ],
    mixPairs: [
      {
        from: "New first chorus",
        onto: "After old last chorus (echo or cut)",
        why: "Chorus to chorus. The room gets the part they know on both songs.",
        how: "On the old song, jump to the last chorus (hot cue 2 on the usual map). Hold Echo on the title line, let go. On the new song, hit hot cue 1 (first chorus) on beat 1 and raise its fader. Optional: Filter a little to the right on the new song for a few bars if the speeds are close.",
      },
      {
        from: "New first vocal / verse",
        onto: "Old last chorus ending",
        why: "A breath between hooks. Useful if jumping chorus-to-chorus feels too abrupt.",
        how: "Hot cue 3 if that’s where you marked “words begin.” Still don’t stack two full choruses.",
      },
      {
        from: "New chorus",
        onto: "Old verse (old vocal quieter)",
        why: "Loud onto less-loud. Can work if the notes aren’t fighting.",
        how: "Keep it short. New LOW a bit down. Get the old fader out before the old chorus would have returned.",
      },
    ],
    avoidPairs: [
      {
        from: "New chorus",
        onto: "Old chorus, both singing",
        why: "Bruno over Surface Pressure. Two movies at once.",
        how: "Finish or echo the old chorus first.",
      },
      {
        from: "Long drum intro (that isn’t there)",
        onto: "Anything",
        why: "You’ll spend the chorus “building a mix” and then the 3-minute file is over.",
        how: "Play the chorus. Leave on the last chorus. Cut or echo.",
      },
      {
        from: "New verse",
        onto: "Old last chorus (covering the singalong)",
        why: "You buried the part they were singing.",
        how: "Let the old chorus finish.",
      },
    ],
    versions:
      "“From Encanto / From [Movie]” is usually the short soundtrack. A “remix” or “karaoke / instrumental” is a different file. If you need extra drums, search for a dance remix — and recue it like a club track.",
    listenFor: [
      "First chorus, beat 1 — save as hot cue 1",
      "Last chorus, beat 1 — save as hot cue 2",
      "The title line you’ll hold Echo on — often hot cue 4",
      "Spoken “once upon a time” — not hot cue 1",
    ],
  },

  dnb: {
    length:
      "Often 4–6 minutes. Same section names as house; each section is shorter in real time because the BPM is ~170.",
    howBuilt:
      "A drum break (fast chopped drums) + a heavy bass, then take them away for a pad/vocal section, then drop again. Intros are measured in bars, not minutes of clock.",
    eightBar:
      "Same 8-bar brick as house, but at ~170 BPM each brick is about 11 seconds. A 32-bar intro is ~45 seconds, not two minutes. Your mix window is one or two bricks, not four. Count faster.",
    whyContrast:
      "Same idea as house: the drop is the loud payoff, the breakdown is quieter, the intro is extra drums so you can arrive — just squeezed in time because the song is faster. A few seconds of both drops can be on purpose; a whole section of two basses is still muddy.",
    energyCaption:
      "Same shape as house, squeezed: drums, drop, quieter middle, drop, then a sudden thin ending. Leave while the last drop still sounds full.",
    energyCurve: [
      { label: "Intro", height: 48 },
      { label: "Drop", height: 92 },
      { label: "Break", height: 28 },
      { label: "Build", height: 58 },
      { label: "Drop", height: 100 },
      { label: "Out", height: 36 },
    ],
    mixJobs: [
      {
        job: "Count — you have seconds",
        means: "The phrase is the same length in bars and shorter on the clock. Miss beat 1 and you’re in the drop already.",
      },
      {
        job: "One bass",
        means: "Two heavy drum-and-bass bass sounds at once is as muddy as two house basses, and louder.",
      },
      {
        job: "Leave while the drop still sounds full",
        means: "Endings can get quiet very fast. Hot cue 4 is the last tall block on the waveform, not the thin bit after it.",
      },
    ],
    layers: [
      {
        name: "Breakbeat / amens",
        job: "The fast drum pattern — not always a simple kick-on-every-beat.",
      },
      {
        name: "Bass (growl / sub)",
        job: "Growl or sub under the drop. Two of these is as muddy as two house basses, louder.",
      },
      { name: "Pads / atmospheres", job: "The breakdown’s bed." },
      {
        name: "Vocal chop or MC",
        job: "Often a hook, not a full verse. Still mark it so you don’t bury it.",
      },
      { name: "FX / risers", job: "Into the drop. Same idea as house builds, faster." },
    ],
    order: [
      {
        name: "Intro / beat",
        what: "Drums assemble. May already feel intense.",
        howLong: "16–32 bars (~20–40 sec)",
        djUse: "Where you start the mix. Shorter than it feels. Save hot cue 1 on the first repeating drum pattern.",
      },
      {
        name: "Drop 1",
        what: "Full drums + bass. The reason the track exists.",
        howLong: "16–32 bars",
        djUse: "If you only mark one spot, mark this as hot cue 2. Protect it, or land it in the other song’s quieter middle.",
      },
      {
        name: "Breakdown",
        what: "Pads, chop, or half-time feel. The hole.",
        howLong: "16 bars is common",
        djUse: "Bring the new drop or new drums in here.",
      },
      {
        name: "Build",
        what: "Drums return, tension.",
        howLong: "8 bars",
        djUse: "About 11 seconds. Count. Don’t miss the next drop.",
      },
      {
        name: "Drop 2",
        what: "Often the peak. A common leave-after point.",
        howLong: "16–32 bars",
        djUse: "Play it. Where you leave is the last full bars of this, while it still sounds loud.",
      },
      {
        name: "Outro",
        what: "Can get quiet very fast. Leave while the drop still sounds full, not after.",
        howLong: "Shorter than house outros",
        djUse: "Too late. You should already be in the next intro.",
      },
    ],
    mixPairs: [
      {
        from: "New intro",
        onto: "Old last full drop (still fat)",
        why: "Same as house: keep a pulse, bring drums in over a still-loud track.",
        how: "On the new song, turn LOW left. You have seconds, not a minute. Count. Swap bass on beat 1, and time the new drop to beat 1.",
      },
      {
        from: "New drop",
        onto: "Old breakdown",
        why: "New payoff in the quieter stretch.",
        how: "Jump the new drop (hot cue 2) on beat 1 of the breakdown. Turn the old bass down (LOW left).",
      },
      {
        from: "New drop (short overlap)",
        onto: "Old drop — planned few seconds only",
        why: "A few seconds of both drops on purpose. Then one bass has to leave.",
        how: "8–16 beats at most, then old LOW left or fade the old fader. Both drops by accident is just noise.",
      },
    ],
    avoidPairs: [
      {
        from: "New intro",
        onto: "Old outro that’s already falling off",
        why: "Same energy crash as techno, over before you notice.",
        how: "Leave at hot cue 4 (last full drop).",
      },
      {
        from: "New drop",
        onto: "Old drop, both basses up, for a long time",
        why: "Mud at 170 BPM is still mud.",
        how: "A few seconds on purpose, or don’t overlap the peaks.",
      },
    ],
    versions:
      "“VIP” and remixes can move the drop. Always recue. Radio edits are less common than in pop; still check the waveform — the “long” intro may be 40 seconds.",
    listenFor: [
      "First repeating drum pattern — hot cue 1",
      "Drop — if you only mark one spot, mark this as hot cue 2",
      "Quiet middle — hot cue 3",
      "Last tall drop block — hot cue 4",
    ],
  },
};

export const TWO_STYLES = [
  {
    from: "Club track → pop / kids song",
    how: "The club file has extra drums at the ends; the pop file usually doesn’t. Blend the house ending (while it still has a kick) into the pop chorus, then you’re in pop-land: short cuts, hold Echo on the title, no more minute-long drum intros.",
  },
  {
    from: "Pop / kids → club track",
    how: "Echo or cut the last chorus, then hit the club intro. You suddenly have drums to mix with again. Don’t try to chorus-to-chorus a 7-minute DJ mix — use the intro.",
  },
  {
    from: "Hip-hop ↔ pop",
    how: "Same job: one vocal, hook to hook or verse after a hook. Tempo may still jump. Short switches. Neural Mix helps if you want 8 bars of beat under the old last line.",
  },
  {
    from: "Hip-hop → house / DnB",
    how: "The hard part is speed, not section names. Finish the vocal, then you’re on a drum intro. Don’t start the house drop on top of the rap verse.",
  },
  {
    from: "House → DnB (or back)",
    how: "Same map (intro / drop / break / drop). The clock is different. Recue. Count. One bass. A tempo jump that big is a decision, not an accident — SYNC will get you there; the room will feel it.",
  },
];
