import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  TUTORIALS,
  TUTORIAL_LEVELS,
  tutorialChecklistPlace,
  tutorialDecks,
  tutorialNeedsHeadphones,
  type Tutorial,
} from "../tutorials/data";
import { loadProgress, saveProgress } from "../tutorials/progress";
import { tutorialsInSpineOrder } from "../spine";
import { labsForTutorial, techniquePath, techniquesForTutorial } from "../djing/techniques";
import { PageHeader } from "./HomePage";

export function TutorialsIndexPage() {
  const [deckFilter, setDeckFilter] = useState<"all" | "one" | "two">("all");
  const [headphonesOnly, setHeadphonesOnly] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Tutorials"
        title="Do these on the Mix Ultra"
        description="Top to bottom. Numbers stay the same so you can remember “I got through 6.” Leave the SYNC button off."
      />

      <p className="footer-note" style={{ marginBottom: "1rem" }}>
        Headphones: <Link to="/pre-cue">Pre-cue</Link>. djay: <Link to="/settings">settings</Link>.
        Click-around: <Link to="/labs">Labs</Link>. Moves:{" "}
        <Link to="/djing/techniques">Techniques</Link>. Confirm cues on the waveform — radio vs
        extended vs sing-along edits differ.
      </p>

      <div className="tutorial-filters" role="group" aria-label="Filter tutorials">
        <button
          type="button"
          className={deckFilter === "all" && !headphonesOnly ? "filter-chip active" : "filter-chip"}
          onClick={() => {
            setDeckFilter("all");
            setHeadphonesOnly(false);
          }}
        >
          All
        </button>
        <button
          type="button"
          className={deckFilter === "one" ? "filter-chip active" : "filter-chip"}
          onClick={() => setDeckFilter("one")}
        >
          One-deck
        </button>
        <button
          type="button"
          className={deckFilter === "two" ? "filter-chip active" : "filter-chip"}
          onClick={() => setDeckFilter("two")}
        >
          Two-deck
        </button>
        <button
          type="button"
          className={headphonesOnly ? "filter-chip active" : "filter-chip"}
          onClick={() => setHeadphonesOnly((v) => !v)}
        >
          Needs headphones
        </button>
      </div>

      <div className="callout accent" style={{ marginBottom: "1.25rem" }}>
        <h2>After Start here and Basics</h2>
        <p>
          Learn a new move by name. Two songs: <Link to="/djing/techniques">Mix techniques</Link>.
          One song: <Link to="/djing/remix">Remix</Link> (Filter, pads, Neural Mix). Open Full
          steps, then the linked tutorial or lab.
        </p>
      </div>

      {TUTORIAL_LEVELS.map((level) => {
        const items = TUTORIALS.filter((t) => t.level === level.label).filter((t) => {
          if (deckFilter !== "all" && tutorialDecks(t) !== deckFilter) return false;
          if (headphonesOnly && !tutorialNeedsHeadphones(t)) return false;
          return true;
        });
        if (!items.length) return null;
        return (
          <section key={level.slug} id={level.slug} className="tutorial-level-block">
            <h2 className="home-section-title">{level.label}</h2>
            <div className="tutorial-index">
              {items.map((t) => {
                const place = tutorialChecklistPlace(t.id);
                return (
                  <Link key={t.id} to={`/tutorials/${t.id}`} className="tutorial-index-card">
                    <div className="tutorial-meta">
                      <span className="pill">{place ? `${place.n}` : t.level}</span>
                      <span className="tutorial-time">{t.time}</span>
                    </div>
                    <h3>
                      {place ? (
                        <span className="tutorial-num" aria-hidden="true">
                          {place.n}.{" "}
                        </span>
                      ) : null}
                      {t.title}
                    </h3>
                    <p>{t.summary}</p>
                    <span className="tutorial-progress">
                      {place ? `${place.n} of ${place.total} · ` : null}
                      {t.steps.length} steps
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
  const relatedTechniques = techniquesForTutorial(tutorial.id);
  const relatedLabs = labsForTutorial(tutorial.id);
  const place = tutorialChecklistPlace(tutorial.id);
  const ordered = tutorialsInSpineOrder();
  const idx = ordered.findIndex((t) => t.id === tutorial.id);
  const prevTut = idx > 0 ? ordered[idx - 1] : null;
  const nextTut = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  return (
    <>
      <PageHeader
        eyebrow={
          place ? `${tutorial.level} · ${place.n} of ${place.total}` : tutorial.level
        }
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

      {(relatedTechniques.length > 0 || relatedLabs.length > 0) && (
        <div style={{ marginBottom: "1rem" }}>
          {relatedTechniques.length > 0 && (
            <p className="technique-links">
              <span className="technique-links-label">Technique</span>
              {relatedTechniques.map((tech) => (
                <Link key={tech.id} to={techniquePath(tech)}>
                  {tech.title}
                </Link>
              ))}
            </p>
          )}
          {relatedLabs.length > 0 && (
            <p className="technique-links">
              <span className="technique-links-label">Lab</span>
              {relatedLabs.map((lab) => (
                <Link key={lab.to} to={lab.to}>
                  {lab.label}
                </Link>
              ))}
            </p>
          )}
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
