import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { firstTutorialInStage, SPINE } from "../spine";

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
        eyebrow="Hercules DJControl Mix Ultra"
        title="Beginner’s guide to DJing"
        description="This is a beginner’s guide to DJing with the Hercules DJControl Mix Ultra and djay."
      />

      <div className="home-cards">
        <Link to="/gear" className="home-card">
          <span className="pill">1</span>
          <h3>Gear</h3>
          <p>Beginner Mix Ultra + djay: the box, headphones, and settings. Button names: the cheat sheet.</p>
        </Link>
        <Link to="/djing" className="home-card">
          <span className="pill">2</span>
          <h3>DJing</h3>
          <p>How songs are built, how you mix two of them, and how you jump around one song. Pick a style and the examples change; Mix Ultra buttons stay the same.</p>
        </Link>
        <Link to="/labs" className="home-card">
          <span className="pill">3</span>
          <h3>Labs</h3>
          <p>Click until a button makes sense. No headphones needed.</p>
        </Link>
        <Link to="/tutorials" className="home-card">
          <span className="pill">4</span>
          <h3>Tutorials</h3>
          <p>Do these on the Mix Ultra, in order. Leave the SYNC button off.</p>
        </Link>
      </div>

      <section className="follow-plan">
        <h2 className="home-section-title">In order</h2>
        <ol className="follow-plan-list">
          {SPINE.map((stage) => {
            const drill = firstTutorialInStage(stage);
            return (
              <li key={stage.id}>
                <div className="follow-plan-row">
                  {stage.pageTo ? (
                    <Link to={stage.pageTo}>{stage.title}</Link>
                  ) : (
                    <strong>{stage.title}</strong>
                  )}
                  {drill && (
                    <>
                      <span className="follow-plan-sep">·</span>
                      <Link to={`/tutorials/${drill.id}`}>{drill.title}</Link>
                    </>
                  )}
                </div>
                <p>{stage.outcome}</p>
              </li>
            );
          })}
        </ol>
      </section>

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
