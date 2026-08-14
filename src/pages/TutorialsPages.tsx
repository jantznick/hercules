import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TUTORIALS, type Tutorial } from "../tutorials/data";
import { PageHeader } from "./HomePage";

const STORAGE_KEY = "mix-ultra-tutorial-progress";

type Progress = Record<string, number>;

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Progress;
  } catch {
    return {};
  }
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

const LEVEL_ORDER = ["Start here", "Basics", "Remix", "Mixing", "Advanced"] as const;

export function TutorialsIndexPage() {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="4 · Practice"
        title="Tutorials"
        description="Hardware + djay first. Work Start here → Basics → Remix (one song) → Mixing (two decks), then Advanced recipes — club tracks, KPop Demon Hunters, and Disney/kids party mixes."
        actions={
          <Link to="/practice" className="text-back">
            Practice
          </Link>
        }
      />

      <div className="callout accent" style={{ marginBottom: "1rem" }}>
        <h2>How to use these</h2>
        <p>
          Do the moves on the <strong>hardware</strong>. Tap <em>I did it — next</em> when you’ve
          done that step. Progress saves in this browser. Setup:{" "}
          <Link to="/pre-cue">Pre-cue</Link> · <Link to="/settings">djay settings</Link>. Ideas:{" "}
          <Link to="/djing">DJing</Link> (cues, mix-in, remix). Click-around:{" "}
          <Link to="/labs">Labs</Link>. Advanced tutorials include a <strong>song sheet</strong> —
          always confirm cues on the waveform (radio vs extended vs sing-along edits differ).
        </p>
      </div>

      {LEVEL_ORDER.map((level) => {
        const items = TUTORIALS.filter((t) => t.level === level);
        if (!items.length) return null;
        return (
          <section key={level} className="tutorial-level-block">
            <h2 className="home-section-title">{level}</h2>
            <div className="tutorial-index">
              {items.map((t) => {
                const step = progress[t.id] ?? 0;
                const done = step >= t.steps.length;
                return (
                  <Link key={t.id} to={`/tutorials/${t.id}`} className="tutorial-index-card">
                    <div className="tutorial-meta">
                      <span className="pill">{t.level}</span>
                      <span className="tutorial-time">{t.time}</span>
                    </div>
                    <h3>{t.title}</h3>
                    <p>{t.summary}</p>
                    <span className={`tutorial-progress ${done ? "complete" : ""}`}>
                      {done ? "Done" : `${step}/${t.steps.length} steps`}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}

function TutorialRunner({ tutorial }: { tutorial: Tutorial }) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const p = loadProgress();
    setStepIndex(p[tutorial.id] ?? 0);
  }, [tutorial.id]);

  const persist = (next: number) => {
    setStepIndex(next);
    const p = loadProgress();
    saveProgress({ ...p, [tutorial.id]: next });
  };

  const done = stepIndex >= tutorial.steps.length;
  const safeIndex = Math.min(stepIndex, tutorial.steps.length - 1);
  const step = done ? null : tutorial.steps[safeIndex];
  const idx = TUTORIALS.findIndex((t) => t.id === tutorial.id);
  const prevTut = idx > 0 ? TUTORIALS[idx - 1] : null;
  const nextTut = idx >= 0 && idx < TUTORIALS.length - 1 ? TUTORIALS[idx + 1] : null;

  return (
    <>
      <PageHeader
        eyebrow={tutorial.level}
        title={tutorial.title}
        description={`${tutorial.time} · ${tutorial.summary}`}
        actions={
          <Link to="/tutorials" className="text-back">
            All tutorials
          </Link>
        }
      />

      {tutorial.trackRecipe && (
        <div className="callout warn song-sheet" style={{ marginBottom: "1rem" }}>
          <h2>Song sheet</h2>
          <pre className="song-sheet-body">{tutorial.trackRecipe}</pre>
        </div>
      )}

      <div className="tutorial-needs panel">
        <strong>Have ready:</strong>
        <ul>
          {tutorial.needs.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>

      {done ? (
        <div className="panel tutorial-complete-panel">
          <h2>Finished</h2>
          <p>Nice — you completed this walkthrough on the hardware.</p>
          <div className="lab-toolbar light-toolbar">
            <button type="button" onClick={() => persist(0)}>
              Run again
            </button>
            {nextTut && (
              <button type="button" className="primary-next" onClick={() => navigate(`/tutorials/${nextTut.id}`)}>
                Next: {nextTut.title}
              </button>
            )}
            <button type="button" onClick={() => navigate("/tutorials")}>
              Back to list
            </button>
          </div>
        </div>
      ) : (
        step && (
          <div className="tutorial-runner">
            <div className="step-rail" role="tablist" aria-label="Steps">
              {tutorial.steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`step-dot ${i === stepIndex ? "current" : ""} ${i < stepIndex ? "done" : ""}`}
                  onClick={() => persist(i)}
                  aria-label={`Go to step ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="step-panel">
              <div className="step-kicker">
                Step {stepIndex + 1} of {tutorial.steps.length}
              </div>
              <h2 className="step-title">{step.title}</h2>

              <div className="step-actions">
                {step.hardware && (
                  <div className="step-action hardware">
                    <span className="step-tag">On the Mix Ultra</span>
                    <p>{step.hardware}</p>
                  </div>
                )}
                {step.djay && (
                  <div className="step-action djay">
                    <span className="step-tag">In djay</span>
                    <p>{step.djay}</p>
                  </div>
                )}
                {step.lab && (
                  <div className="step-action lab">
                    <span className="step-tag">In this lab (optional)</span>
                    <p>{step.lab}</p>
                  </div>
                )}
                {step.listen && (
                  <div className="step-action listen">
                    <span className="step-tag">Listen for</span>
                    <p>{step.listen}</p>
                  </div>
                )}
              </div>

              <div className="step-expect">
                <strong>You should notice:</strong> {step.expect}
              </div>
              {step.tip && <div className="step-tip">{step.tip}</div>}

              <div className="lab-toolbar light-toolbar step-nav">
                <button
                  type="button"
                  disabled={stepIndex === 0}
                  onClick={() => persist(stepIndex - 1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="primary-next"
                  onClick={() => persist(stepIndex + 1)}
                >
                  {stepIndex === tutorial.steps.length - 1
                    ? "I did it — finish"
                    : "I did it — next"}
                </button>
              </div>
            </div>
          </div>
        )
      )}

      <div className="tut-pager">
        {prevTut ? (
          <Link to={`/tutorials/${prevTut.id}`}>← {prevTut.title}</Link>
        ) : (
          <span />
        )}
        {nextTut ? (
          <Link to={`/tutorials/${nextTut.id}`}>{nextTut.title} →</Link>
        ) : (
          <span />
        )}
      </div>

      <p className="tutorial-footnote">
        Official reference:{" "}
        <a
          href="https://ts.hercules.com/download/sound/manuals/DJC_Mix_Ultra/DJControl_Mix_Ultra_user_manual_EN.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Mix Ultra manual (PDF)
        </a>
        .
      </p>
    </>
  );
}

export function TutorialDetailPage() {
  const { tutorialId } = useParams();
  const tutorial = TUTORIALS.find((t) => t.id === tutorialId);

  if (!tutorial) {
    return (
      <>
        <PageHeader title="Tutorial not found" />
        <p>
          <Link to="/tutorials">Back to tutorials</Link>
        </p>
      </>
    );
  }

  return <TutorialRunner key={tutorial.id} tutorial={tutorial} />;
}
