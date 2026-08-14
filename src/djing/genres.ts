export const GENRE_IDS = ["any", "house", "hiphop", "pop", "dnb"] as const;

export type GenreId = (typeof GENRE_IDS)[number];

export const GENRE_OPTIONS: { id: GenreId; label: string; tag: string }[] = [
  { id: "any", label: "Any style", tag: "All" },
  { id: "house", label: "House / techno", tag: "~124 BPM" },
  { id: "hiphop", label: "Hip-hop / R&B", tag: "~90 BPM" },
  { id: "pop", label: "Pop / kids / Disney", tag: "~3 min songs" },
  { id: "dnb", label: "Drum & bass", tag: "~170 BPM" },
];

export function isGenreId(value: string): value is GenreId {
  return (GENRE_IDS as readonly string[]).includes(value);
}

export type PadRow = { pad: string; usually: string; why: string };

export type GenreGuide = {
  id: GenreId;
  name: string;
  bpm: string;
  phraseLen: string;
  countTip: string;
  overlap: string;
  padIntro: string;
  pads: PadRow[];
  mixProblemTitle: string;
  mixProblem: string;
  mixDefault: string;
  busyNote: string;
  eq: string;
  eqWhen: string;
  loop: string;
  remixPads: { pad: string; usually: string }[];
  remixFlare: string;
  waveformOverview: string;
  waveformMixIn: string;
  waveformMixOut: string;
  waveformVocals: string;
  waveformShape: number[];
  quantize: string;
  wrecks: string[];
  good: string[];
  styleIntro: string;
  structure: string[];
  howYouMix: string[];
  howYouCue: string[];
  howYouRemix: string[];
  tutorialHint: string;
};

const ANY_PADS: PadRow[] = [
  {
    pad: "1",
    usually: "Where you’d start this song in the mix",
    why: "Skip silence and talking — first real beat",
  },
  {
    pad: "2",
    usually: "The loud fun part (drop or chorus)",
    why: "Jump here if you went too far, or to hit the payoff",
  },
  {
    pad: "3",
    usually: "First singing, or the quiet middle",
    why: "So you don’t put two singers on top of each other",
  },
  {
    pad: "4",
    usually: "Last part that still has a beat",
    why: "Leave here — not in the last dying seconds",
  },
];

export const GUIDES: Record<GenreId, GenreGuide> = {
  any: {
    id: "any",
    name: "any style",
    bpm: "BPM is how fast the song is. Match the new song’s speed to the one playing (SYNC on Mix Ultra does this). House/techno is often ~120–130, hip-hop ~80–100, pop all over, drum & bass ~160–175. Jumping from 80 to 140 in one mix is hard on purpose.",
    phraseLen:
      "Count 1-2-3-4. Those four beats are one bar. Songs usually change every 8 bars (sometimes 16). Start the new song on beat 1 of one of those chunks so both songs change at the same time.",
    countTip:
      "Out loud: 1-2-3-4, 2-2-3-4, … 8-2-3-4. After 8, something usually changes — new drums, bass, or singing. Start the next song on that beat 1.",
    overlap:
      "How long the two songs play at once. House/techno: often 30–60 seconds. Hip-hop and pop: a few seconds, or you just cut. Drum & bass: same counting as house, but it goes by faster.",
    padIntro:
      "Mark the same four kinds of spot on every song so your hands don’t have to think. Pick a style above to see the house vs hip-hop vs pop version. “Hot cue 1” means the first rubber pad in HOT CUE mode — not the CUE button next to Play.",
    pads: ANY_PADS,
    mixProblemTitle: "The beats can match and the mix can still feel dead",
    mixProblem:
      "A common mistake with club tracks: wait until the current song is almost silent, then fade in the next song’s quiet beginning. The kicks may line up. The room still sits down, because you overlapped two empty parts. Pop and hip-hop fail differently: two people singing at once, or a long fade on a 3-minute song that has no extra drums at the start. Pick a style above for that version.",
    mixDefault:
      "Keep a beat in the room unless you meant a quiet moment. Start the new song when the old one is about to change (beat 1 of a chunk). One bassline. One singer.",
    busyNote:
      "Loud parts: drop, chorus, full beat + bass. Quiet parts: drum-only intro, the dip in the middle, the fade at the end. Default: bring the new song in quietly over a still-loud old song. Two quiet parts at once is how energy dies. Two loud parts at once (two drops, two singers) is something you do on purpose for a moment — or a mess if you didn’t mean it.",
    eq: "Two basslines at once usually sounds muddy. Simple move: turn the new song’s LOW knob left (less bass) as it comes in. The old song keeps the bass. When you’re ready (on beat 1), turn the old LOW left and the new LOW back up together. Then fade the rest of the old song. Filter to the left muffles the old song; Filter to the right thins the new one (less bass).",
    eqWhen:
      "Do that bass trade on beat 1 of a chunk, not in the middle of a bar. A little Filter to the right on the new song, then back to 12 o’clock as its loud part hits, is the same idea with one knob.",
    loop: "A loop repeats a chunk so you don’t run out of music, or so a chorus lasts longer. 2 or 4 bars is plenty. Don’t loop the same bit until people get bored — especially singing.",
    remixPads: [
      { pad: "1", usually: "Where you’d usually start" },
      { pad: "2", usually: "Verse or first hook" },
      { pad: "3", usually: "Drop or chorus (replay this)" },
      { pad: "4", usually: "Quiet middle or bridge" },
      { pad: "5", usually: "A short sung line or drum hit to repeat" },
    ],
    remixFlare:
      "One trick at a time: loop a hook, turn Filter then open it into the loud part, hold Echo on the last word, mute vocals for a few seconds. Then put everything back (Filter at 12 o’clock, Neural Mix pads dark, HOT CUE mode).",
    waveformOverview:
      "The landscape above the song: tall = loud (usually kick + bass — drops and choruses). Thin = quiet (intro, dip, ending). Leave during the last tall block, not the quiet fade after it. Start at the first repeating kick after silence.",
    waveformMixIn:
      "First repeating kick after silence or talking. Zoom in and plant on the spike at beat 1, not the quiet swell before it.",
    waveformMixOut:
      "Last tall block that still has kick and bass. The thin fade after that is already the goodbye.",
    waveformVocals:
      "In Neural Mix, solo Vocals (or mute drums) and scrub. When singing appears, mark beat 1 of that chunk — not the middle of the first word.",
    waveformShape: [18, 28, 42, 82, 88, 38, 92, 28, 12],
    quantize:
      "Press and hold CUE or a pad a moment to stick it to the nearest beat. A quick tap plants exactly where you are — use that for talking or a lyric that isn’t on the kick. If the beat grid looks wrong (live intro, talking), tap; don’t trust snap.",
    wrecks: [
      "Kicks line up, but the songs change at different times",
      "Quiet beginning over a song that’s already fading out",
      "Two basslines at once",
      "Two people singing at once",
    ],
    good: [
      "Beats stay together (or you catch it fast)",
      "You start on beat 1, not mid-word",
      "A kick stays in the room unless you meant a quiet dip",
      "One bass at a time",
      "One singer at a time",
    ],
    styleIntro:
      "The Mix Ultra buttons don’t change. What changes is how long you overlap, which parts you stack, and whether the file even has extra drums at the start. Pick a style in the menu — this page (and the others) rewrite for that music.",
    structure: [
      "House / techno: extra drums at the start and end, a loud drop, a quiet dip in the middle.",
      "Hip-hop / R&B: verses and hooks, little or no drum intro, the vocal is the point.",
      "Pop / kids / Disney: ~3-minute songs, chorus is the point, mixes are short.",
      "Drum & bass: same counting as house, almost twice as fast, so you have less time.",
    ],
    howYouMix: [
      "Pick where the new song may be heard, and where the old one may leave — not “start of file” and “end of file.”",
      "Put a quieter part against a louder part, unless you’re overlapping two loud parts on purpose for a few seconds.",
      "Leave while the old song still sounds like itself.",
    ],
    howYouCue: [
      "Hot cue 1 = where you start this song in the mix, 2 = loud part, 3 = singing or quiet middle, 4 = where you leave.",
      "Mark beat 1 of that section. Talking at the start is not hot cue 1.",
    ],
    howYouRemix: [
      "Same pads can jump around one song: play the chorus twice, skip a verse, echo a line.",
      "One trick, then back to the song.",
    ],
    tutorialHint: "Count 8s until it’s boring, then look at the waveform, then mix two similar songs.",
  },

  house: {
    id: "house",
    name: "house / techno",
    bpm: "Usually about 120–130 beats per minute. SYNC on Mix Ultra is made for this — the beat grid is often right on the long “DJ mix” / extended versions. Use the tempo fader for tiny speed tweaks, not to turn techno into hip-hop.",
    phraseLen:
      "Count in 8-bar chunks, then two of those make 16. If you start the new song 4 or 8 bars late, the kicks can still match but the big moment (the drop) arrives at the wrong time. It feels drunk.",
    countTip:
      "From the first kick, count 8-bar blocks. Hi-hats, bass, and the drop almost always arrive on beat 1. This music often waits a second group of 8 (16 bars total) before anything big happens.",
    overlap:
      "Thirty seconds to a minute of both songs at once is normal. That’s why “extended” or “DJ mix” versions exist — extra drums at the start and end so you have time. The 3-minute Spotify version of the same tune will feel rushed. That’s the file, not you.",
    padIntro:
      "On the long DJ versions, the first minute is often just drums. You’re marking beat landmarks, not choruses.",
    pads: [
      { pad: "1", usually: "First kick / drum intro", why: "Start the mix here — often a minute of drums before the bass. This is hot cue pad 1, not the CUE button." },
      { pad: "2", usually: "Drop / first full bassline", why: "The loud part. Jump back here if you went too far" },
      { pad: "3", usually: "Quiet dip in the middle", why: "A good place to leave, or to bring a new drop in" },
      { pad: "4", usually: "Last full beat + bass", why: "Leave here, not in the last thin 30 seconds" },
    ],
    mixProblemTitle: "Don’t fade two quiet endings into each other",
    mixProblem:
      "The usual beginner loop: wait until the current track’s last 30 seconds (it’s already thinning out), then fade in the next track’s quiet drum intro. Beats match. Energy dies, because both parts were meant to be empty. Leave while the old song still has a kick.",
    mixDefault:
      "Leave during the last full beat, or during the quiet dip in the middle. Bring the new song’s drum intro in over that still-moving part. Aim for the new song’s loud drop to hit as the old one leaves. A kick stays in the room unless you chose a dip. Playing “most of the track” does not mean 0:00 to the last hiss — on a 7-minute file you might leave at minute 4 or 5.",
    busyNote:
      "Default: new song’s quiet drums over the old song’s still-full beat. Contrast: new song’s drop over the old song’s quiet dip. If it has a sung chorus, keep the overlap shorter and don’t stack two singers.",
    eq: "Turn the new song’s LOW knob left (less bass) as its drums come in. The old song keeps the bass. On beat 1 of an 8- or 16-bar chunk, swap: old LOW left, new LOW back up. In djay, Isolator EQ (Sound settings) can silence bass completely — easier than Classic EQ, which never quite goes away. Filter to the right on the new song is the same idea with one knob.",
    eqWhen:
      "Swap on beat 1, in the last full groove or as you leave the quiet dip. Don’t swap on top of the biggest drop. A little Filter right on the new song, then back to 12 o’clock as the new bass (or drop) hits.",
    loop: "Loop 4 bars of the old song’s beat if you need extra time to finish bringing the new one in. 2 bars if you only need a moment. Don’t loop the quiet dip forever — people sit down. Exit on beat 1 and go to the drop.",
    remixPads: [
      { pad: "1", usually: "Drum intro / first kick" },
      { pad: "2", usually: "First bassline" },
      { pad: "3", usually: "Drop (play this again)" },
      { pad: "4", usually: "Quiet dip" },
      { pad: "5", usually: "A short sound you might repeat" },
    ],
    remixFlare:
      "Turn Filter left in the quiet dip, then back to 12 o’clock as your drop hits. Loop the beat under a dip so the kick never leaves. Mute vocals for 8 bars if it’s a sung house track, then bring them back on beat 1. A short Slicer chop is enough — then stop.",
    waveformOverview:
      "Long DJ versions look like a city: long low intro, a tall drop, a dip, another tall block, a long fade. The low parts at the ends are extra time to mix. Leave at the last tall block, not the fade after.",
    waveformMixIn:
      "First repeating kick after any silence. Often not 0:00. Zoom until you see the kick spike on beat 1.",
    waveformMixOut:
      "Last tall block that still looks fat. If the last minute is a slope down to silence, you already stayed too long.",
    waveformVocals:
      "Instrumental techno may have no singing. If it does (vocal house), solo Vocals and mark beat 1 of the first sung chunk — that’s also “don’t put another singer here.”",
    waveformShape: [12, 22, 38, 48, 86, 90, 36, 88, 42, 18, 8],
    quantize:
      "Hold the pad a moment so it sticks to the kick — this music lives on the kick. Tap only for talking or a sound that isn’t on the beat. If the intro is a messy live drum fill, the grid may be wrong: tap, or fix the grid in djay.",
    wrecks: [
      "Quiet intro over a song that’s already fading out",
      "Two basslines the whole time they’re overlapping",
      "Mixing during the biggest drop",
      "Two singers on vocal house",
    ],
    good: [
      "A kick stays unless you meant the quiet dip",
      "You trade bass on beat 1, not mid-bar",
      "The new drop hits as the old beat leaves",
      "You left before the true fade-out",
    ],
    styleIntro:
      "This music is built for mixing: extra drums at the start and end so you can overlap without covering the drop. Your job is energy — don’t stack two empty parts, and don’t sit on the loudest section waiting for the file to end.",
    structure: [
      "Intro — often 30–60 seconds of drums / hats, bass later",
      "First groove / first bassline",
      "Drop — the loud part (sometimes two)",
      "Quiet dip in the middle — the real contrast, not the last 30 seconds",
      "Second groove or drop",
      "Ending that thins out — leave before this is all that’s left",
    ],
    howYouMix: [
      "Old song: leave at the last full beat, or at the quiet dip in the middle.",
      "New song: drum intro over that still-loud part.",
      "Trade bass on beat 1 of an 8- or 16-bar chunk. Aim for Deck 2’s drop as Deck 1 leaves.",
      "If people are singing: shorter overlap, one singer.",
    ],
    howYouCue: [
      "Hot cue 1 first kick, hot cue 2 drop, hot cue 3 quiet dip, hot cue 4 last full beat.",
      "Don’t put hot cue 1 on 0:00 if that’s silence or a voice saying the label name.",
      "On the waveform: last tall, full block, not the thin tail after it.",
    ],
    howYouRemix: [
      "Hit the drop pad twice on beat 1 to play the drop again.",
      "Loop 4 bars of beat during a dip so the kick never leaves.",
      "Filter closed in the dip, open into your drop — same move as a mix, one song.",
    ],
    tutorialHint: "The “mix in / mix out without killing energy” tutorial is the house/techno version of this.",
  },

  hiphop: {
    id: "hiphop",
    name: "hip-hop / R&B",
    bpm: "Often about 80–100. SYNC still helps. Mixes are short, so a wrong beat grid is obvious. If you’re mixing toward a pop or house track, turn Key Lock on (the musical-note control) so speeding up/slowing down doesn’t chipmunk the voices.",
    phraseLen:
      "Verses and hooks usually last 8 bars (sometimes 16). You often just cut to the next song on beat 1. If you wait 30–60 seconds of drums like techno, the verse already started without you.",
    countTip:
      "Skip talking at the start. Count 8 from the first real beat. Hooks almost always hit beat 1. If someone starts singing on beat 3, still mark beat 1 of that bar so the chunk stays lined up — unless you want that exact word to repeat.",
    overlap:
      "Often about 8 bars, or you just cut on beat 1, or you echo the last word and cut. Energy is in the verses and hooks, not in a minute of drums. Waiting for a long techno-style ending is how you play silence.",
    padIntro: "You’re marking verses and hooks. People came for the words.",
    pads: [
      { pad: "1", usually: "First verse / first beat after talking", why: "Skip the skit; start the music" },
      { pad: "2", usually: "Hook / chorus", why: "The line people know — also where you might cut" },
      { pad: "3", usually: "Second verse, or first vocal if it isn’t on 1", why: "Don’t put another rapper on top of this" },
      { pad: "4", usually: "Last hook / last full bar", why: "Cut or echo from here, not the mumbled ending" },
    ],
    mixProblemTitle: "Don’t do a long club fade over two rappers",
    mixProblem:
      "These songs often have no drum intro to fade over. The mistake is a 30–60 second EQ blend with two people talking/rapping at once, or waiting for a long ending that was never there. Hip-hop switches are short on purpose.",
    mixDefault:
      "On beat 1, cut to the next verse or hook — or hold Echo on the last word, let go, then cut. If you do overlap, keep it to ~8 bars of beat only (no vocal), then let the new vocal in alone. Two vocals at once is the classic mess. Scratching is optional, not required.",
    busyNote:
      "Loud = verse or hook. Quiet = beat-only intro, a pause, or drums with no vocal. You can put the new beat under the last 8 bars of an old hook, then cut to the new vocal on beat 1. Two rappers at once only if you meant a mashup.",
    eq: "Deep bass still fights (those 808 kick/bass hits). You often won’t have time for a long bass trade. Turn the new song’s LOW left for the few bars you overlap, or Filter a little to the right, then open as you cut. Muting vocals on the old track (Neural Mix) makes space faster than a long EQ fade.",
    eqWhen:
      "If you cut, you may barely touch EQ — just don’t have two basses and two voices. If you overlap ~8 bars, turn the new song’s LOW left until the cut. Echo then cut: hold Echo (FX mode, finger down) on the last word, let go, hit hot cue 1 of the next track.",
    loop: "Loop a hook or 2 bars of beat to buy a second — then stop. Looping a whole verse is how people notice you’re stuck. Repeating a drum hit or a short ad-lib is fine. Looping a guest verse while you set up the next song works if you exit on beat 1.",
    remixPads: [
      { pad: "1", usually: "Verse 1 start" },
      { pad: "2", usually: "Hook" },
      { pad: "3", usually: "Verse 2" },
      { pad: "4", usually: "Bridge / last hook" },
      { pad: "5", usually: "A line or drum hit to repeat" },
    ],
    remixFlare:
      "Play the hook again, skip a weak verse, hold Echo on the last word of a line, mute the vocal for a bar of drums. Don’t rearrange so hard people lose the song they asked for.",
    waveformOverview:
      "Streaming hip-hop often looks busy almost immediately: a short pickup, then tall verses and taller hooks. There may be no long quiet intro. Quiet dips are usually a pause, not a 30-second breakdown.",
    waveformMixIn:
      "First musical beat after talking, a skit, or silence. Zoom for the kick or first drum of the verse — not the breath before the first word.",
    waveformMixOut:
      "Start of the last hook, or beat 1 after the last line you care about. The mumbled fade or “yo it’s [producer]” tag is not where you leave.",
    waveformVocals:
      "Solo Vocals. Verse vs hook is obvious by ear even when the waveform looks evenly tall. Mark both. The hook cue is how you avoid running a second vocal over the line people rap along to.",
    waveformShape: [22, 68, 62, 88, 64, 90, 58, 84, 40],
    quantize:
      "Hold to snap verse and hook to beat 1. Tap for a specific word or ad-lib that isn’t on the kick. Fast trap hats can fool the grid — check beat 1 by ear.",
    wrecks: [
      "Two people rapping/singing at once",
      "A long club-style fade over a verse",
      "Waiting for a long techno ending that isn’t there",
      "Cutting in the middle of a bar or a word",
    ],
    good: [
      "The next vocal starts clean on beat 1",
      "The hook is audible — you don’t bury the line people know",
      "Overlaps are short; cuts are on purpose",
      "Basses aren’t fighting for half a minute",
    ],
    styleIntro:
      "People are listening to words. Mix Ultra can still do a minute-long fade — these songs don’t give you the extra drums for that. Cut, echo the last word, or overlap a few bars of beat. That’s the job.",
    structure: [
      "Talking / skit / producer name at the start (skip this — not hot cue 1)",
      "Verse — the story; don’t put another voice on it",
      "Hook — the line people know",
      "Verse 2 / guest verse",
      "Last hook, then often a sudden end or a fade with no extra drums",
    ],
    howYouMix: [
      "Headphones: line up Deck 2’s verse or hook (hot cue 1 or 2).",
      "Leave Deck 1 on the last hook or a drums-only bar.",
      "Cut on beat 1, or hold Echo on the last word then cut.",
      "If you overlap: new song beat only (mute its vocal) for ~8 bars, then the new vocal alone.",
    ],
    howYouCue: [
      "Hot cue 1 first verse/beat, hot cue 2 hook, hot cue 3 other verse or first vocal, hot cue 4 last hook.",
      "Spoken intro is never hot cue 1.",
      "A short hit you might repeat goes on hot cue 5, not on your four mix bookmarks.",
    ],
    howYouRemix: [
      "Hit the hook pad twice on beat 1 to play the hook again.",
      "Skip a verse people don’t care about.",
      "Echo the last word, then jump the hook — a radio-style move on the controller.",
    ],
    tutorialHint: "“Hand off vocal tracks” is the practice for this. Echo-the-last-word tutorials matter more than the long techno mix.",
  },

  pop: {
    id: "pop",
    name: "pop / kids / Disney",
    bpm: "All over (~90–130 is common). These are the short versions (~3 minutes) — soundtrack, radio, Spotify — not a 7-minute club mix. SYNC + Key Lock, because the songs often weren’t meant to share a tempo. Huge jumps still sound like a crash; pick songs that are somewhat close, or a song in between.",
    phraseLen:
      "Chorus every 8 bars (sometimes 16). There is often no extra drum intro. If you wait 30–60 seconds of drums, the chorus already happened and the kids are confused.",
    countTip:
      "Find the first chorus (beat 1 of that chorus) and count 8s from there. Verses are setup. The chorus is why the song is in the playlist. Mixes that hide the chorus to “blend properly” fail the room.",
    overlap:
      "A few bars, jump chorus-to-chorus, or echo the last line and cut. Filter or echo is more useful than a long EQ fade. Play the chorus, then leave.",
    padIntro:
      "Short files: about 3 minutes, chorus arrives fast, almost no drum-only intro. You’re marking choruses, not a long club groove.",
    pads: [
      { pad: "1", usually: "First chorus, beat 1", why: "Often also where you start in the mix — this is hot cue pad 1, not the CUE button" },
      { pad: "2", usually: "Last chorus", why: "Leave from here — cut, or hold Echo on the last line" },
      { pad: "3", usually: "First singing / verse", why: "If hot cue 1 is the chorus, this is where words begin" },
      { pad: "4", usually: "A line you’ll hold Echo on (title, character name)", why: "Hold the Echo effect on this word, then let go" },
    ],
    mixProblemTitle: "These songs are short. Don’t mix them like club tracks.",
    mixProblem:
      "Club house tracks often have a minute of drums at the start and end so you can fade slowly. Encanto, kids bangers, and pop radio songs usually don’t. If you spend 30–40 seconds slowly blending, you’ve used up the chorus (the part people came to sing) as the transition, and then the 3-minute file is already over. The other mess: two songs singing at once — We Don’t Talk About Bruno over Surface Pressure. If you can’t find a long drum intro, it isn’t there. Cut, echo the last line, or overlap a few bars — not a long house fade.",
    mixDefault:
      "Play the chorus. Leave on the last chorus: cut, echo the last line, or a few bars of Filter. The next song can start on its first chorus, or on the first vocal if you need a breath. A ballad can get quiet on purpose. Don’t get quiet by accident because you waited for an ending that isn’t there.",
    busyNote:
      "Loud = chorus. Quieter = verse, little intro, or repeated ending. Chorus over verse can work if the notes aren’t fighting. Chorus over chorus is two people singing — only if you meant it. Echo the last line, then hit the new song on beat 1, is the clean version.",
    eq: "You often won’t finish a long bass trade. Filter the new song a little thin, then open it as its chorus hits — or hold Echo on the old song’s last line. If both tracks are full (band + kids singing), cut rather than layer. Isolator LOW still helps for the few bars you do overlap (it can silence bass; Classic EQ can’t quite).",
    eqWhen:
      "During the old song’s last chorus, Filter the new song a little to the right (thinner). Back to 12 o’clock as the new chorus hits. Or skip EQ: echo the last line, then cut.",
    loop: "Loop the chorus 4 bars if you need one more singalong pass (birthday). Two extra loops is usually enough. Don’t loop a verse to “build” — this music already built in the pre-chorus.",
    remixPads: [
      { pad: "1", usually: "First chorus" },
      { pad: "2", usually: "Last chorus" },
      { pad: "3", usually: "Verse / story start" },
      { pad: "4", usually: "Bridge / key change if there is one" },
      { pad: "5", usually: "The title line you’ll echo or repeat" },
    ],
    remixFlare:
      "Jump chorus to chorus, echo the title, Filter open into the last chorus, mute vocals for a drums-only singalong bar then slam the vocal back. Keep it obvious — this crowd came for the song.",
    waveformOverview:
      "Short file. A small ramp, then repeating tall blocks (choruses) with medium verses between. The last tall block is close to the end. If you’re hunting for a long quiet intro, this isn’t that kind of file — a “dance remix” of the same song might be.",
    waveformMixIn:
      "First chorus beat 1, or first vocal if the verse is the only way in. Zoom onto the kick or the first syllable — pop vocals often rush the bar.",
    waveformMixOut:
      "Beat 1 of the last chorus, or the last repeat of the title. After that is applause, fade, or the end — not mix time.",
    waveformVocals:
      "Solo Vocals. The chorus is louder and more repetitive. Mark it even if the overview already looks obvious. Kids gang-vocals still count as “one lead” if it’s the same hook.",
    waveformShape: [20, 48, 86, 52, 90, 50, 88, 24],
    quantize:
      "Hold to snap chorus downbeats to beat 1. Tap for spoken “this is the story of…” and for a title word you want exact. Disney/theatre singing that speeds up and slows down will fight the grid — tap and use your ear.",
    wrecks: [
      "Spending the chorus on a long fade, then the song ends",
      "Two movie songs singing at once",
      "A long EQ blend on a 3-minute track",
      "Waiting for extra drums at the end that this file doesn’t have",
    ],
    good: [
      "The room gets the chorus",
      "You leave on a title line or last chorus, not mid-verse by accident",
      "Switches are short and obvious",
      "Echo or Filter instead of pretending it’s a 7-minute club track",
    ],
    styleIntro:
      "Kids/Disney/pop nights are chorus music. Mix Ultra can do a long bass fade — these files won’t give you the time. Play the hook, get out clean, let them sing. Echo and Filter are the right tools, not a cop-out.",
    structure: [
      "Tiny intro or singing from the first second (often skippable)",
      "Verse / pre-chorus — setup",
      "Chorus — people came for this",
      "Verse 2, maybe a bridge",
      "Last chorus, then the file is over",
    ],
    howYouMix: [
      "Old song last chorus: echo the title, or turn Filter left.",
      "New song hot cue 1 = first chorus (or first vocal). Hit it on beat 1 after the echo fades.",
      "Jumping chorus to chorus is allowed and often better.",
      "If speeds are close, a few bars of thin Filter on the new song is enough overlap.",
    ],
    howYouCue: [
      "Hot cue 1 first chorus, hot cue 2 last chorus, hot cue 3 verse/first vocal, hot cue 4 the line you’ll hold Echo on.",
      "Spoken “once upon a time” is not hot cue 1.",
      "A “dance remix” / extended version of the same song is a different file — treat that one more like house if that’s what you loaded.",
    ],
    howYouRemix: [
      "Jump chorus → chorus for a singalong edit.",
      "Loop 4 bars of the hook once; stop; play the last chorus.",
      "Hold Echo on the character’s name or the title, then the next song’s chorus.",
    ],
    tutorialHint: "Practice “hand off vocal tracks” and the Disney/kids tutorials. Skip the long techno mix-in drill for these files.",
  },

  dnb: {
    id: "dnb",
    name: "drum & bass",
    bpm: "About 160–175 — almost twice house speed. You count the same way (8s and 16s), but 16 bars is only ~20 seconds. SYNC helps. Counting has to be awake. Some tracks feel slower than the number (half-time); trust the drum pattern you actually dance to.",
    phraseLen:
      "Same 8- and 16-bar chunks as house, at nearly double the tempo. If you start when it “feels late,” it already is.",
    countTip:
      "Count 8 from the first full drums. Drops hit beat 1. A 32-bar intro at 174 BPM is still only about 40 seconds — that’s your whole extra time, not a reason to wait.",
    overlap:
      "You can still overlap 16–32 bars like house, but it takes less real time. Cues and counting matter more because you can’t casually “feel” your way through a long fade.",
    padIntro: "Same four jobs as house — intro, drop, quiet middle, last drop — with less time to hunt on the jog wheel.",
    pads: [
      { pad: "1", usually: "Intro / first full beat", why: "Start here — this intro is shorter in seconds than it looks" },
      { pad: "2", usually: "Drop", why: "The loud part. You’ll miss it if it isn’t marked" },
      { pad: "3", usually: "Quiet middle", why: "A place to leave, or a dip before the next drop" },
      { pad: "4", usually: "Last full drop", why: "Leave while drums + bass are still going" },
    ],
    mixProblemTitle: "You have less time than it feels like",
    mixProblem:
      "Same energy trap as techno (quiet intro over a dying ending), and it’s worse because the ending is over before you notice. The other mistake: starting when it “feels like time.” At 174 BPM that feeling is already two chunks late. Mark the drop. Count.",
    mixDefault:
      "Don’t stack two empty parts. Bring the new intro over the old song’s last full beat or its quiet middle. Aim for the new drop on beat 1. You have seconds of leftover loud waveform, not minutes.",
    busyNote:
      "Drops are very loud (fast drums + bass). Intros and middles are the quieter parts. Both drops at once is a known stunt — a few seconds, then get one bass out. Accidental both-drops is just noise.",
    eq: "Same bass trade as house, faster. New song LOW down, swap on an 8-bar beat 1. Filter a little right on the new intro, open into the drop. Two of those growly dnb basses is as muddy as two house basslines, only louder.",
    eqWhen:
      "Swap on the chunk before the new drop, or as you leave the old quiet middle. Don’t discover mid-drop that both LOWs are up.",
    loop: "A 4-bar loop buys you one more chunk — that’s a lot of clock at this speed. Use it on the old beat while you finish Deck 2. Looping a drop because you’re lost is obvious. Exit on beat 1.",
    remixPads: [
      { pad: "1", usually: "Intro" },
      { pad: "2", usually: "First drop" },
      { pad: "3", usually: "Quiet middle" },
      { pad: "4", usually: "Second / last drop" },
      { pad: "5", usually: "A short vocal or snare sound" },
    ],
    remixFlare:
      "Jump drop → middle → drop. Filter open into your own drop. A short Slicer chop as a fill, then back to HOT CUE. Keep tricks to one chunk — this music already does a lot.",
    waveformOverview:
      "Looks a bit like house: low intro, very tall drops, a dip, another tall block. Everything is squashed in time. The “long” intro on the overview may be 45 seconds. Zoom more than you think to mark beat 1.",
    waveformMixIn:
      "First repeating drum pattern — often a breakbeat, not a simple four-on-the-floor kick. Plant on beat 1 of the chunk, not a random snare in a fill.",
    waveformMixOut:
      "Last tall drop. After a dnb drop the file can fall off a cliff — that’s fine, as long as you left on the fat part.",
    waveformVocals:
      "Many tracks have chopped vocals, not a full verse. Solo Vocals anyway; mark beat 1 of a sung hook if there is one so you don’t bury it. A rapper over a drop is two loud things — plan that.",
    waveformShape: [24, 40, 92, 38, 96, 42, 90, 20],
    quantize:
      "Hold to snap intro and drops — a tap will be late. If the intro is a drum break with no clear 1-2-3-4, the grid may be wrong; fix it before you trust snap. “1 beat” snap size is still the default for beat 1.",
    wrecks: [
      "Starting when it “feels late” — it is",
      "Quiet intro over a song that’s already ending (same as techno, faster)",
      "Two basses through a double drop you didn’t mean",
      "Missing the drop because it wasn’t marked",
    ],
    good: [
      "Drops land on beat 1",
      "You counted instead of waiting for a feeling",
      "One bassline except a brief stunt",
      "Loops stop on beat 1, not mid-fill",
    ],
    styleIntro:
      "Same ideas as house/techno, less time. Mix Ultra has no drum-and-bass mode — your marked spots and counting are the mode. If you can mix this clean, house will feel slow.",
    structure: [
      "Intro / beat (bars of drums, not minutes)",
      "Drop — fast drums + bass; the reason the track exists",
      "Quiet middle",
      "Second drop",
      "Ending that finishes sooner than house DJs expect",
    ],
    howYouMix: [
      "Mark the new song’s drop. Know which beat 1 it hits.",
      "Old song: last full beat or quiet middle — not the sudden ending.",
      "About 16 bars of intro over groove, trade bass, drop on beat 1.",
      "Both drops at once only as a planned few seconds.",
    ],
    howYouCue: [
      "Hot cue 1 intro, hot cue 2 drop, hot cue 3 middle, hot cue 4 last drop.",
      "If you only mark one spot, mark the drop.",
      "Zoom in — the overview lies about how soon things happen.",
    ],
    howYouRemix: [
      "Play the drop twice on beat 1.",
      "Quiet middle as a reset, then drop again.",
      "Short loop as a fill, not a whole new arrangement.",
    ],
    tutorialHint: "Count 8-bar blocks until they’re automatic, then mix in/out at this speed. Mark cues first.",
  },
};

export function genreLabel(id: GenreId) {
  return GENRE_OPTIONS.find((g) => g.id === id)?.label ?? "Any style";
}
