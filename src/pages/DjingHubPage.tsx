import { Link } from "react-router-dom";
import { SectionCards } from "../components/SectionCards";
import { PageHeader } from "./HomePage";

export function DjingHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="3 · DJing"
        title="Techniques"
        description="How DJs usually think — not which Mix Ultra button to press. Tabs above are every topic. The style menu rewrites examples for house, hip-hop, pop/kids, or drum & bass."
      />

      <div className="callout accent" style={{ marginBottom: "1.25rem" }}>
        <h2>Words these pages keep using</h2>
        <ul>
          <li>
            <strong>Hot cue 1, 2, 3, 4</strong> — the rubber pads in HOT CUE mode. Saved jumps that
            keep playing. Not the CUE button next to Play (that one usually stops and returns).{" "}
            <Link to="/djing/cueing">Which cues to set</Link> is the map.
          </li>
          <li>
            <strong>Beat 1</strong> — the first beat of a bar (count “1” in 1-2-3-4). Mixes that
            ignore this feel off even when the kicks match.{" "}
            <Link to="/djing/phrasing">Phrases & beat 1</Link>.
          </li>
          <li>
            <strong>Outgoing / incoming</strong> — the song in the room vs the song you’re bringing
            in (usually in headphones first).
          </li>
          <li>
            <strong>LOW</strong> — that deck’s bass knob. “Turn LOW left” means less kick and bass
            on that deck only. <Link to="/djing/eq">EQ, bass & filter</Link>.
          </li>
        </ul>
      </div>

      <h2 className="home-section-title">Basics</h2>
      <SectionCards
        items={[
          {
            to: "/djing/phrasing",
            pill: "1",
            title: "Phrases & the One",
            blurb: "Beats, bars, 8-counts, and why a mix can be in time and still feel wrong.",
          },
          {
            to: "/djing/songs",
            pill: "2",
            title: "How songs are built",
            blurb: "Intro, verse, chorus, drop, breakdown — and which parts mix well together.",
          },
          {
            to: "/djing/waveform",
            pill: "3",
            title: "Read the waveform",
            blurb: "Tall vs thin — find mix-in, drop, vocal, mix-out on the overview.",
          },
          {
            to: "/djing/cueing",
            pill: "4",
            title: "Which cues to set",
            blurb: "The hot-cue map for this style: mix-in, loud part, vocal or break, mix-out.",
          },
          {
            to: "/djing/mixing",
            pill: "5",
            title: "Mix in / mix out",
            blurb: "Which sections to overlap so energy stays up. What goes wrong depends on the music.",
          },
          {
            to: "/djing/eq",
            pill: "6",
            title: "EQ, bass & filter",
            blurb: "What HIGH / MID / LOW actually change, Filter vs EQ, Neural Mix, Gain.",
          },
        ]}
      />

      <h2 className="home-section-title" style={{ marginTop: "1.5rem" }}>
        Next
      </h2>
      <SectionCards
        items={[
          {
            to: "/djing/choose",
            pill: "7",
            title: "Pick the next song",
            blurb: "Songs that can sit next to each other: speed, vocals, how busy they are, which version you loaded.",
          },
          {
            to: "/djing/blend",
            pill: "8",
            title: "The two-deck blend",
            blurb: "Headphones, SYNC, faders, then the room. Four ways to leave: cut, echo, bass swap, Filter.",
          },
          {
            to: "/djing/quantize",
            pill: "9",
            title: "Quantize",
            blurb: "Snap to the beat — sometimes. Tap vs hold; Mix Ultra has no Q button.",
          },
          {
            to: "/djing/looping",
            pill: "10",
            title: "Looping",
            blurb: "Buy time or extend a hook. Why Play-then-LOOP starts late.",
          },
          {
            to: "/djing/remix",
            pill: "11",
            title: "Remix one song",
            blurb: "Jump the drop, mute a vocal, filter-open — performing without a second deck.",
          },
          {
            to: "/djing/style",
            pill: "12",
            title: "How this music works",
            blurb: "Structure, cues, and mixing for whatever’s in the menu above.",
          },
        ]}
      />

      <div className="info-stack" style={{ marginTop: "1.5rem" }}>
        <section className="info-block">
          <h2>Two decks, one story</h2>
          <p>
            <strong>Outgoing</strong> = what’s in the room now. <strong>Incoming</strong> = what
            you’re bringing in (often in headphones first). Channel faders are each deck’s volume.
            The crossfader blends left ↔ right. EQ and Filter carve space so two basslines don’t
            fight. The whole loop with your hands: <Link to="/djing/blend">The two-deck blend</Link>.
            Which file to load: <Link to="/djing/choose">Pick the next song</Link>.
          </p>
        </section>
        <section className="info-block">
          <h2>What “good” sounds like at 101</h2>
          <ul>
            <li>Beats stay together (or you recover quickly)</li>
            <li>You enter on a phrase, not mid-word by accident</li>
            <li>A kick stays in the room unless you chose a breakdown</li>
            <li>One bassline at a time — two at once usually sounds muddy</li>
            <li>One lead vocal, not two singers at once</li>
            <li>EQ, Filter, and effects back at 12 o’clock when you finish a move</li>
          </ul>
        </section>
      </div>

      <p className="footer-note">
        Buttons for this deck: <Link to="/controls">The controller</Link>. Then do it:{" "}
        <Link to="/practice">Labs & tutorials</Link>.
      </p>
    </>
  );
}
