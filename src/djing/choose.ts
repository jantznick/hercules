import type { GenreId } from "./genres";

export type PickRow = { pick: string; why: string };

export type ChooseGuide = {
  neighborhood: string;
  energy: string;
  vocal: string;
  bpm: string;
  versions: string;
  crate: string;
  nightShape: string;
  goodNext: PickRow[];
  skipNext: PickRow[];
  checks: { name: string; ask: string }[];
};

export const CHOOSE: Record<GenreId, ChooseGuide> = {
  any: {
    neighborhood:
      "You have two decks. The next file has to live next to the one that’s already playing. Close enough means similar speed, similar busyness, and a plan for vocals — not “same artist” and not “I like both.”",
    energy:
      "Energy is kick + bass + how much is going on — not how much you love the song. After a peak (drop, last chorus, a banger), a slightly calmer song is a breath. Two peaks in a row can work; three often feels like shouting. A sudden ballad after a banger feels like you unplugged the room — unless you meant it.",
    vocal:
      "If the current song has a lead vocal, the next mix is easier if the incoming file starts with drums, a beat, or a chorus you can jump to after the old vocal stops. Two leads at once is the classic mess — same rule as mixing sections, applied to which file you load.",
    bpm: "SYNC will match the numbers. A jump from ~90 to ~170 still feels like a different night. If the speeds are far apart, plan a cut or a song in between — don’t hope the blend hides it.",
    versions:
      "Load the version that matches the mix you want. A 3-minute soundtrack and a 7-minute “extended / DJ mix” of the same title are different jobs. Look at the waveform after you load — don’t trust the title.",
    crate:
      "On Mix Ultra: BROWSER knob to scroll, LOAD under the empty deck. Prep a handful of files in djay (playlist or recents) so you’re not searching while the current song ends. Two decks means you pick one next song, not a whole setlist at once.",
    nightShape:
      "A kids party, a house living-room, and a late club set want different curves. Start where people already are (familiar, not your cleverest track). Climb. Leave a couple of bigger songs for later. Have one quiet/reset song you actually marked, so a dip is a choice.",
    checks: [
      { name: "Speed", ask: "Are these in the same world, or is this a jump I’m choosing?" },
      { name: "Vocal", ask: "Will two people be talking/singing if I overlap at all?" },
      { name: "Density", ask: "Busy over busy, or did one file leave a hole?" },
      { name: "The file", ask: "Radio edit or long DJ version — does this file have extra drums at the start so I have time to mix?" },
    ],
    goodNext: [
      {
        pick: "Same-ish speed, one of them has drums or a beat-only stretch",
        why: "You have somewhere to mix. The room keeps a pulse.",
      },
      {
        pick: "The incoming chorus/drop is a song they know",
        why: "The handoff has a destination. Especially true for pop/kids.",
      },
      {
        pick: "A slightly lower song after a peak",
        why: "A breath, then you can climb again. Not a crash if it still has a beat.",
      },
    ],
    skipNext: [
      {
        pick: "Two quiet endings, or two ballads, back to back by accident",
        why: "Energy dies and you didn’t choose a moment.",
      },
      {
        pick: "A 7-minute club file into a 3-minute radio song without changing plan",
        why: "You’ll still be “building the mix” when the short file is over — or the other way around.",
      },
      {
        pick: "A huge BPM jump as a blend",
        why: "Cut it, or put a middle song in. SYNC won’t make 90 feel like 170.",
      },
    ],
  },

  house: {
    neighborhood:
      "Next track should share the pulse (~120–130) and a similar kind of kick. A vocal house chorus next to a fully instrumental techno tool is doable — treat the vocal like pop: shorter overlap, one singer. A 3-minute Spotify edit next to a 7-minute DJ mix is the real mismatch.",
    energy:
      "Club nights climb. Don’t open with the biggest drop you own. After a peak, the quieter middle of the next track (or a groovier, less-riffy file) is a reset. Stacking peak-drop into peak-drop can work as a short moment; as a default it flattens the night.",
    vocal:
      "Instrumental into instrumental: drums are the mix. Vocal house: protect the chorus the same way you would a pop song. Don’t load a sung track to blend over another sung chorus.",
    bpm: "Staying in 122–128 is easy on Mix Ultra. Jumping to hip-hop or drum & bass is a different speed world — cut, or a song in between, not a minute of both.",
    versions:
      "Prefer Extended / DJ Mix / Original Mix when you want time. If all you have is the radio edit, your mix plan is pop: short, leave early. Recue that file; don’t pretend it has a 64-bar intro.",
    crate:
      "A small playlist of long versions you already marked (hot cues 1–4) beats a huge folder. Load the incoming deck during the current groove — you have a minute; use it to look at the waveform, not to search Apple Music.",
    nightShape:
      "Warm-up = groove, less riff. Peak = the drops people came for. Late = you can go weirder or take it down. The Mix Ultra doesn’t change; the files you load do.",
    checks: [
      { name: "Length", ask: "Does this file actually have drums at the ends?" },
      { name: "Kick", ask: "Will two four-on-the-floors sit together if I scoop one bass?" },
      { name: "Vocal", ask: "Is either track a sung chorus I must protect?" },
      { name: "Peak", ask: "Is this a climb, a peak, or a reset?" },
    ],
    goodNext: [
      {
        pick: "Another extended groove in the same BPM band",
        why: "Classic blend. New song’s drum intro over the old song’s last full groove.",
      },
      {
        pick: "A tool / less-vocal track after a big sung chorus",
        why: "Room keeps dancing; you get a breath from words.",
      },
      {
        pick: "A slightly bigger riff later in the night, not first",
        why: "You still have somewhere to go.",
      },
    ],
    skipNext: [
      {
        pick: "Radio edit after you just played a 8-minute DJ mix, same plan",
        why: "Almost no extra drums at the start. You’ll hit the drop while you’re still mixing.",
      },
      {
        pick: "Ballad or beatless ambient as a “blend”",
        why: "That’s a stop. If you want a stop, cut to it on purpose.",
      },
      {
        pick: "Two peak riffs both with full bass, first two songs",
        why: "Nowhere to climb. Save one.",
      },
    ],
  },

  hiphop: {
    neighborhood:
      "Next song should share a tempo world (~80–100, or you double-time feel) and leave room for one voice. Same era helps the drums sit together; it’s not required. A house track next is a speed jump — finish the vocal, then you’re on a drum intro.",
    energy:
      "Hooks are peaks. Verses can be a climb. After a huge hook, another huge hook is fine if you cut clean. Three shouting anthems with no breath and the room stops hearing words. A laid-back verse after a clubby hook is a reset.",
    vocal:
      "This is the whole game. Don’t load a dense verse to blend over a dense verse. Instrumentals and beat-only outros are gold. Clean vs explicit: pick the file the room can actually play.",
    bpm: "Small BPM differences are normal. A jump toward pop is often fine (cut/echo). A jump toward 124 house or 170 DnB is a decision — the rap has to end first.",
    versions:
      "Album vs radio vs clean can move the hook by a few seconds. Explicit vs clean is a different waveform. If you need beat-only time, search for an instrumental — don’t hope the album cut has a minute of drums.",
    crate:
      "Have hooks marked (hot cue 2) on songs you might jump to. Searching mid-verse is how you miss beat 1. Recents plus a short playlist of “these work back to back” is enough on two decks.",
    nightShape:
      "Familiar first if it’s a party. Features and guest verses are places you can leave. Save the song everyone will sing for when the room is actually in it — not song one while people are still arriving.",
    checks: [
      { name: "Voice", ask: "One rapper at a time in the mix I’m about to do?" },
      { name: "Hook", ask: "Do they get a hook on the way out and the way in?" },
      { name: "Clean", ask: "Is this the edit this room can hear?" },
      { name: "Ending", ask: "Does this file stop suddenly? Next song ready?" },
    ],
    goodNext: [
      {
        pick: "A track whose first verse or hook is cleanly after a beat",
        why: "You have a hot cue 1 that isn’t a skit.",
      },
      {
        pick: "Instrumental or beat-heavy track after a wordy verse",
        why: "A breath. Then you can cut to a new vocal.",
      },
      {
        pick: "The song they asked for, chorus cued",
        why: "Requests are a pick, not a blend problem. Hit the hook.",
      },
    ],
    skipNext: [
      {
        pick: "Another 16-bar verse to overlap the current verse",
        why: "Two people talking. Wait, cut, or mute.",
      },
      {
        pick: "A long house DJ mix as if it were a 90 BPM rap song",
        why: "Different amount of extra drums. Finish the vocal, then use the house intro.",
      },
      {
        pick: "The explicit album cut at a kids / mixed family party",
        why: "Wrong file. The clean edit is a different mix-in too — recue.",
      },
    ],
  },

  pop: {
    neighborhood:
      "Next song should share the job: a chorus people know, in a tempo that isn’t a shock. Disney-to-Disney is easy. A dance remix of a movie song is a different file — extra drums, treat it like house. A ballad next to a banger is a mood change; do it as a cut after the last chorus, not a 40-second fade.",
    energy:
      "Kids parties spike and crash. After two fast choruses, a slightly slower singalong is a gift. After a ballad, hit a chorus they know so the room comes back. Don’t “save all the bangers” until everyone’s tired — and don’t play only bangers until they’re fried.",
    vocal:
      "Almost everything has a lead. Your pick is “which chorus comes after which chorus,” not “which has a drum intro.” Karaoke/instrumental versions exist if you want a singalong bed.",
    bpm: "Pop tempos are all over. SYNC will match; a ballad into a 128 BPM dance-pop still feels like a jump. Echo the last line, then the new chorus — don’t blend the ballad’s last note under a four-on-the-floor for a minute.",
    versions:
      "“From the movie” is the short one. Dance remix / karaoke / instrumental is a different plan. If someone requests a song, load the version you cued — soundtrack vs radio vs TikTok edit can start in different places.",
    crate:
      "A playlist of choruses you can actually play (family-friendly if that’s the room). Hot cue 1 = first chorus on each. Searching Encanto in the middle of a chorus is how you miss the title line you were going to echo.",
    nightShape:
      "Open with something they know. Climb toward the songs they’ll scream. Build in a drink-of-water song (still a chorus, just calmer). End on a chorus, not a fade they don’t care about.",
    checks: [
      { name: "Chorus", ask: "Do they get a hook they know on the way in?" },
      { name: "Words", ask: "Two movies at once if I overlap?" },
      { name: "Version", ask: "Soundtrack, remix, or karaoke — which mix plan?" },
      { name: "Room", ask: "Kids still up, or is this the wind-down chorus?" },
    ],
    goodNext: [
      {
        pick: "Another well-known chorus, similar energy or one step away",
        why: "Chorus to chorus. The product on both sides.",
      },
      {
        pick: "A calmer singalong after two fast ones",
        why: "A breath without a dead stop.",
      },
      {
        pick: "The request, first chorus already on hot cue 1",
        why: "You can hold Echo on the current title and hit theirs on beat 1.",
      },
    ],
    skipNext: [
      {
        pick: "A 6-minute dance remix in the middle of soundtrack Encanto",
        why: "You just changed nights. If you want that, do it on purpose after a cut.",
      },
      {
        pick: "A verse-heavy song to cover the current last chorus",
        why: "You buried the singalong they were in.",
      },
      {
        pick: "Two villain songs both at peak, both singing",
        why: "Fun on paper. Mud in the room. Echo one out first.",
      },
    ],
  },

  dnb: {
    neighborhood:
      "Stay in the ~170 world unless you’re leaving on purpose. Liquid (musical, pads) next to liquid is easy; liquid into a huge jump-up banger is a climb. Hip-hop or house next is a tempo neighborhood change — finish the drop, then the new intro.",
    energy:
      "Drops are peaks; breakdowns are breaths. Don’t pick three peak jump-up tunes first. A musical breakdown track after a huge drop is how the night keeps a shape.",
    vocal:
      "Chops and MCs still count as a hook. Don’t stack two big vocal chops in a blend. Pads-only breakdowns are the hole you mix into.",
    bpm: "Stay near 170–176 if that’s the music you’re playing. SYNC to 124 house will make it feel like a different genre — that’s a cut, not a blend.",
    versions:
      "VIP / remix can move the drop. Recue every time. Intros are short on the clock even when the bar count looks like house.",
    crate:
      "Mark the drop (hot cue 2) on everything you might play. You do not have a minute to search. A short playlist of tracks you’ve already walked with the waveform beats a dump folder.",
    nightShape:
      "Warm with groove and liquid if the room isn’t there yet. Peak the rollers and jump-up later. The cliff outro means the next file has to be loaded before you think you need it.",
    checks: [
      { name: "BPM world", ask: "Still ~170, or am I leaving?" },
      { name: "Drop", ask: "Is this a climb, a peak, or a palette-cleanser?" },
      { name: "Bass", ask: "Two heavy drum-and-bass bass sounds if I overlap more than a few seconds?" },
      { name: "Clock", ask: "Is the intro actually 40 seconds, not two minutes?" },
    ],
    goodNext: [
      {
        pick: "Another 170-ish track with a clear intro and a marked drop",
        why: "You can count. Hot cue 2 (the drop) is ready.",
      },
      {
        pick: "A musical / liquid file after a huge peak",
        why: "Breakdown energy without stopping.",
      },
      {
        pick: "A slightly bigger drop later, not song one",
        why: "Somewhere to go at 174 BPM is still somewhere to go.",
      },
    ],
    skipNext: [
      {
        pick: "A 90 BPM rap verse to “blend” over a heavy drum-and-bass bassline",
        why: "Different night. End the drop, then cut.",
      },
      {
        pick: "A file you haven’t found the drop on",
        why: "At this speed you’ll be in it while you’re still scrubbing.",
      },
      {
        pick: "Peak into peak into peak from bar one of the night",
        why: "Nowhere to climb, and the breakdowns stop meaning anything.",
      },
    ],
  },
};
