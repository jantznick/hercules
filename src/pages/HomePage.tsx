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
        title="Four places to look"
        description="Gear is the box and djay settings. The controller is every button. DJing is the craft. Practice is labs and tutorials."
      />

      <div className="home-cards">
        <Link to="/gear" className="home-card">
          <span className="pill">1</span>
          <h3>Gear</h3>
          <p>Charge, pair Bluetooth, splitter, speakers vs headphones, djay settings and iCloud.</p>
        </Link>
        <Link to="/controls" className="home-card">
          <span className="pill">2</span>
          <h3>The controller</h3>
          <p>What each Mix Ultra control does in djay — CUE, hot cues, filter, Neural Mix, pads.</p>
        </Link>
        <Link to="/djing" className="home-card">
          <span className="pill">3</span>
          <h3>DJing</h3>
          <p>Phrases, songs, mix in/out, pick the next file, then the blend — style menu tailors examples.</p>
        </Link>
        <Link to="/practice" className="home-card">
          <span className="pill">4</span>
          <h3>Practice</h3>
          <p>Click-around labs, then do-it-on-the-hardware tutorials.</p>
        </Link>
      </div>

      <h2 className="home-section-title" style={{ marginTop: "1.75rem" }}>
        DJing, in order
      </h2>
      <ol className="path-steps">
        <li>
          <Link to="/djing/phrasing">
            <strong>Phrases & the One</strong>
            <span>Why a mix can be in time and still feel wrong</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/songs">
            <strong>How songs are built</strong>
            <span>Intro, verse, chorus, drop — which parts mix well</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/waveform">
            <strong>Read the waveform</strong>
            <span>Tall vs thin — find mix-in, drop, vocal, mix-out</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/cueing">
            <strong>Which cues to set</strong>
            <span>Pad map: mix-in, drop, vocal, mix-out</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/mixing">
            <strong>Mix in / mix out</strong>
            <span>Why a quiet intro over a dying ending kills energy</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/beatmatch">
            <strong>Match the speed yourself</strong>
            <span>Tempo fader + jog — SYNC is optional</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/eq">
            <strong>EQ, bass & filter</strong>
            <span>One bassline at a time</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/techniques">
            <strong>Named techniques</strong>
            <span>Short list of each move — then full steps and tutorials</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/transitions">
            <strong>Same-speed mixes</strong>
            <span>Long blend, bass swap, drop mix, echo-out, crossfader cut</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/jumps">
            <strong>When speeds don’t match</strong>
            <span>Stop, walk the tempo, loop-bridge — plus hype a build</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/choose">
            <strong>Pick the next song</strong>
            <span>Speed, vocals, how busy they are — songs that can sit next to each other</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/blend">
            <strong>The two-deck blend</strong>
            <span>Headphones, faders, then the room</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/quantize">
            <strong>Quantize</strong>
            <span>Tap vs hold — Mix Ultra has no Q button</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/looping">
            <strong>Looping</strong>
            <span>Why Play-then-LOOP starts late, and how to arm it paused</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/remix">
            <strong>Remix one song</strong>
            <span>Jumps, loops, filter, FX — no second deck required</span>
          </Link>
        </li>
        <li>
          <Link to="/djing/style">
            <strong>How this music works</strong>
            <span>House, hip-hop, pop/kids, or dnb — pick in the DJing menu</span>
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
    </>
  );
}
