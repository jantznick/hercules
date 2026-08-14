import { Link } from "react-router-dom";
import { SectionCards } from "../components/SectionCards";
import { DJING_GROUPS } from "../spine";
import { PageHeader } from "./HomePage";

const GROUP_BLURB: Record<string, string> = {
  hear: "Count the 1-2-3-4. See the parts of a song. Mark four pads you can jump to.",
  match: "Where you bring a song in and where you leave it. Match speed by hand. Use EQ and Filter so two songs don’t fight.",
  mix: "Two songs: named mix moves, same speed, different speed, pick the next file, then the blend.",
  remix: "One song: named moves, looping, Filter as performance, pad/FX fills, Neural mute.",
  "this-music": "House, hip-hop, pop, and drum & bass use the same Mix Ultra. Only the examples change.",
};

export function DjingHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="2 · DJing"
        title="How DJs think"
        description="How you mix on this controller: hear a song, match speed, then blend two tracks — or remix one."
      />

      <div className="callout accent" style={{ marginBottom: "1.25rem" }}>
        <h2>Words you’ll see</h2>
        <ul>
          <li>
            <strong>Hot cue 1, 2, 3, 4</strong> — the rubber pads in HOT CUE mode. Saved jumps that
            keep playing. Not the CUE button next to Play (that one usually stops and returns).{" "}
            <Link to="/djing/cueing">Which cues to set</Link>.
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
            on that deck only. <Link to="/djing/eq">EQ, bass & Filter</Link>.
          </li>
        </ul>
      </div>

      <SectionCards
        items={DJING_GROUPS.map((group) => ({
          to: group.items[0].to,
          pill: group.label,
          title: group.label,
          blurb: GROUP_BLURB[group.id] ?? group.items.map((i) => i.label).join(" · "),
        }))}
      />

      <p className="layer-links">
        <Link to="/djing/techniques">Mix techniques</Link> — two-song named moves.{" "}
        <Link to="/djing/remix">Remix techniques</Link> — one-song named moves.{" "}
        <Link to="/labs">Labs</Link> — click-around.{" "}
        <Link to="/tutorials">Tutorials</Link> — drills on the Mix Ultra.
      </p>

      <div className="info-stack" style={{ marginTop: "1.5rem" }}>
        <section className="info-block">
          <h2>Two decks, one story</h2>
          <p>
            <strong>Outgoing</strong> = what’s in the room now. <strong>Incoming</strong> = what
            you’re bringing in (often in headphones first). Channel faders are each deck’s volume.
            The crossfader blends left ↔ right. EQ and Filter carve space so two basslines don’t
            fight. Hands: <Link to="/djing/blend">The two-deck blend</Link>. Which file:{" "}
            <Link to="/djing/choose">Pick the next song</Link>.
          </p>
        </section>
        <section className="info-block">
          <h2>What “good” sounds like</h2>
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
        Button names: <Link to="/cheatsheet">Cheat sheet</Link>. Hands on:{" "}
        <Link to="/labs">Labs</Link> · <Link to="/tutorials">Tutorials</Link>.
      </p>
    </>
  );
}
