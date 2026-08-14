import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <span className="brand-mark">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Hercules · DJControl Mix Ultra"
        title="Learn the gear and the craft"
        description="This isn’t only a button map — it’s a path from charging the box, to what a mix is, to hands-on labs, to guided transitions on real songs you pick."
      />

      <ol className="path-steps">
        <li>
          <Link to="/gear">
            <strong>1. Gear & setup</strong>
            <span>Charge, pair Bluetooth every session, speakers vs headphones</span>
          </Link>
        </li>
        <li>
          <Link to="/pre-cue">
            <strong>2. Pre-cue</strong>
            <span>Hear the next track in cans while the room stays on the current one</span>
          </Link>
        </li>
        <li>
          <Link to="/dj-basics">
            <strong>3. DJ basics</strong>
            <span>BPM, phrases, “the One,” EQ — how mixing works</span>
          </Link>
        </li>
        <li>
          <Link to="/labs/cue">
            <strong>4. Labs</strong>
            <span>Click around Cue, Hot cue, Filter, Neural, Pads until they click</span>
          </Link>
        </li>
        <li>
          <Link to="/tutorials">
            <strong>5. Tutorials</strong>
            <span>Do it on the Mix Ultra — Start here → Basics → Mixing → Advanced</span>
          </Link>
        </li>
      </ol>

      <div className="intro-grid">
        <div className="callout accent">
          <h2>Two different “cues”</h2>
          <ul>
            <li>
              <strong>CUE button</strong> — one home marker; while playing it usually stops and
              returns.
            </li>
            <li>
              <strong>Hot Cue pads</strong> — up to eight jumps that keep playing.
            </li>
          </ul>
        </div>
        <div className="callout warn">
          <h2>Blinking Play = paused</h2>
          <p>
            Beat blink while paused is normal. It does not mean a cue is set. Pause → scrub → press
            CUE to plant the marker.
          </p>
        </div>
      </div>

      <h2 className="home-section-title">Shortcuts</h2>
      <div className="home-cards">
        <Link to="/tutorials" className="home-card primary">
          <span className="pill">Hardware</span>
          <h3>Tutorials</h3>
          <p>Press-this-then-that on the controller + djay. Includes advanced song-style mixes.</p>
        </Link>
        <Link to="/gear" className="home-card">
          <h3>Gear & setup</h3>
          <p>Battery, charging, pairing, splitter, cover — non-DJ essentials.</p>
        </Link>
        <Link to="/pre-cue" className="home-card">
          <h3>Pre-cue</h3>
          <p>Headphone buttons, faders vs Play, Mac vs phone, splitter, Auto Select — then do the drills.</p>
        </Link>
        <Link to="/dj-basics" className="home-card">
          <h3>DJ basics</h3>
          <p>Phrases, EQ mixing, headphones, a 30-minute practice loop.</p>
        </Link>
        <Link to="/labs/pads" className="home-card">
          <h3>Pad modes</h3>
          <p>All 8 modes and transition recipes.</p>
        </Link>
        <Link to="/cheatsheet" className="home-card">
          <h3>Cheat sheet</h3>
          <p>One-screen control reference.</p>
        </Link>
      </div>
    </>
  );
}
