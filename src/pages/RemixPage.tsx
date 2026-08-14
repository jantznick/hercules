import { Link } from "react-router-dom";
import { RelatedExtras } from "../components/RelatedExtras";
import { useGenre } from "../djing/GenreContext";
import { LevelBand } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function RemixPage() {
  const { guide } = useGenre();
  return (
    <>
      <PageHeader
        eyebrow="DJing · Next"
        title="Remix one song"
        description="Stay on one song and change how it plays: jump around the arrangement, extend a hook, strip it to drums, or season it with filter and FX."
        actions={
          <Link to="/djing" className="text-back">
            DJing
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>Not more advanced than mixing — just a different job</h2>
        <p>
          <strong>Mixing / transitioning</strong> is switching from one song to another (two decks,
          headphones, speed, EQ). <strong>Remixing</strong> is performing{" "}
          <em>one</em> song: you rearrange it live or decorate it. You can practice this before
          two-deck blends — no splitter, no SYNC, no bass fight.
        </p>
      </div>

      <LevelBand>Basics</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What “remixing” means on a DJ controller</h2>
          <p>
            Studio remixes are new productions. Live, you’re not rewriting the file — you’re
            changing what the room hears <em>right now</em>:
          </p>
          <ul>
            <li>
              <strong>Rearrange</strong> — skip the verse, replay the drop, jump to the breakdown
              (hot cues)
            </li>
            <li>
              <strong>Extend</strong> — loop a groove so the hook lasts longer
            </li>
            <li>
              <strong>Strip / spotlight</strong> — mute vocals, solo drums (Neural Mix)
            </li>
            <li>
              <strong>Flare</strong> — filter a build, echo a word, chop a bar, fire a riser
            </li>
          </ul>
          <p>
            Fancy pads are still seasoning. A clear jump map + landing on beat 1 matter more
            than stacking five tricks.
          </p>
        </section>

        <section className="info-block">
          <h2>“Points” = hot cues on one track</h2>
          <p>
            Those “various points” in a song are bookmarks. The main{" "}
            <Link to="/labs/cue">CUE button</Link> is one home.{" "}
            <Link to="/labs/hot-cue">Hot cue pads</Link> are up to eight jumps that{" "}
            <strong>keep playing</strong> — that’s how you remix the arrangement without
            scrubbing. “Hot cue 1” means the first rubber pad in HOT CUE mode, not the CUE button.
          </p>
          <p>A useful remix map for this music (plant these while paused or playing):</p>
          <ul>
            {guide.remixPads.map((row) => (
              <li key={row.pad}>
                <strong>Hot cue {row.pad}</strong> — {row.usually}
              </li>
            ))}
          </ul>
          <p>
            Hitting the payoff pad twice in a row is a live remix: the song just did that section
            again. Do it on beat 1 of a chunk so it feels intentional.
          </p>
          <p>
            How to <em>find</em> those spots on the waveform (and a mix-in / mix-out map for
            two-deck blending): <Link to="/djing/cueing">Which cues to set</Link>. Remixing just
            uses extra jumps on the song that’s already in the room.
          </p>
        </section>
      </div>

      <LevelBand>Next</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>Flare (one trick at a time)</h2>
          <p>{guide.remixFlare}</p>
          <p>
            Flare is everything that isn’t a jump: you stay in the same section and change the
            texture. On Mix Ultra:
          </p>
          <ul>
            <li>
              <strong>Loop</strong> — repeat 2–4 bars of a hook; tap the lit pad to exit on a One.
              LOOP starts from <em>now</em>, not from the hot cue you just hit —{" "}
              <Link to="/djing/looping#loop-from-cue">arm it paused</Link> if you need the cue as
              the in-point.
            </li>
            <li>
              <strong>Filter</strong> — muffle or thin a breakdown, then open to center as{" "}
              <em>this</em> song’s drop hits (same gesture as a transition, one deck)
            </li>
            <li>
              <strong>FX</strong> — HOLD echo/reverb on the last word of a line, then RELEASE
              (tap-and-forget does almost nothing)
            </li>
            <li>
              <strong>Neural Mix pads</strong> — mute vocals for 8 beats, or solo drums, then all
              pads dark again
            </li>
            <li>
              <strong>Slicer</strong> — 4–8 beats of chops on a looped bar, then get out
            </li>
            <li>
              <strong>Sampler</strong> — riser or one-shot into your own drop (watch volume)
            </li>
            <li>
              <strong>Pitch Play / stutter</strong> — optional candy;{" "}
              <Link to="/tutorials/stutter-cue">Stutter from the CUE</Link> is the 101 version
            </li>
          </ul>
        </section>
      </div>

      <LevelBand>Later</LevelBand>
      <div className="info-stack">
        <section className="info-block">
          <h2>What “good” sounds like at 101</h2>
          <ul>
            <li>You jump or exit a loop on beat 1, not mid-word by accident</li>
            <li>One trick at a time — then reset (Filter at 12 o’clock, Neural Mix pads dark, HOT CUE mode)</li>
            <li>The song still feels like itself; extra tricks are a moment, not a new hobby mid-chorus</li>
            <li>You can still hear the vocal/hook people came for</li>
            <li>You don’t loop the same 2 bars until the room gets restless</li>
          </ul>
          <p>
            If a move feels messy, stop decorating and let the track play. Getting back in time is
            part of it.
          </p>
        </section>

        <section className="info-block">
          <h2>A simple practice loop (20 minutes, one song)</h2>
          <ol>
            <li>
              5 min — plant the remix map on a song you know (
              <Link to="/tutorials/remix-cue-map">tutorial</Link> ·{" "}
              <Link to="/labs/hot-cue">lab</Link>)
            </li>
            <li>3 min — play, jump drop → quiet middle → drop again, always on beat 1</li>
            <li>
              4 min — LOOP 2 bars on the hook, ride it, exit, then replay the drop
            </li>
            <li>
              4 min — Filter closed in a breakdown, open into your drop (
              <Link to="/labs/filter">Filter lab</Link>)
            </li>
            <li>4 min — one FX hold <em>or</em> one vocal mute — not both — then reset everything</li>
          </ol>
        </section>
      </div>

      <RelatedExtras
        links={[
          {
            to: "/tutorials",
            label: "Remix tutorials",
            blurb: "Hardware walkthroughs — look for the Remix section",
          },
          {
            to: "/djing/songs",
            label: "How songs are built",
            blurb: "Verse, chorus, drop — the map you’re jumping around",
          },
          {
            to: "/djing/cueing",
            label: "Which cues to set",
            blurb: "How to find and mark the spots you jump to",
          },
          {
            to: "/labs/pads",
            label: "Pad modes",
            blurb: "Remix recipes next to the transition recipes",
          },
          {
            to: "/djing/choose",
            label: "Pick the next song",
            blurb: "When you’re done with this file — what can sit next to it",
          },
        ]}
      />
    </>
  );
}
