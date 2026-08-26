import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  TECHNIQUE_GROUPS,
  TECHNIQUES,
  type TechniqueGroupId,
} from "../djing/techniques";
import { SOURCE_VIDEOS } from "../djing/videos";
import { TUTORIALS } from "../tutorials/data";
import { drillPath, tutorialHasDrill } from "../tutorials/drills";
import { LevelBand } from "./SectionCards";

function tutorialLabel(id: string) {
  return TUTORIALS.find((t) => t.id === id)?.title ?? id;
}

export function TechniqueCatalog({
  groupIds,
  techniqueIds,
  extraBlurb,
}: {
  groupIds: TechniqueGroupId[];
  techniqueIds?: string[];
  extraBlurb?: Partial<Record<TechniqueGroupId, ReactNode>>;
}) {
  const groups = TECHNIQUE_GROUPS.filter((g) => groupIds.includes(g.id));
  const allow = techniqueIds ? new Set(techniqueIds) : null;

  return (
    <>
      {groups.map((group) => {
        const items = TECHNIQUES.filter(
          (t) => t.group === group.id && (!allow || allow.has(t.id)),
        );
        if (items.length === 0) return null;
        const showGroupChrome = !allow;
        return (
          <div key={group.id}>
            {showGroupChrome && (
              <>
                <LevelBand>{group.title}</LevelBand>
                <p className="technique-group-blurb" id={group.id}>
                  {group.blurb}
                  {extraBlurb?.[group.id]}
                </p>
              </>
            )}
            <div className="info-stack">
              {items.map((tech) => (
                <section className="info-block" id={tech.id} key={tech.id}>
                  <h2>{tech.title}</h2>
                  <p>{tech.what}</p>
                  <p>
                    <strong>Good for.</strong> {tech.goodFor}
                  </p>
                  <p>
                    <strong>On Mix Ultra.</strong> {tech.mixUltra}
                  </p>
                  {tech.more && tech.more.length > 0 && (
                    <p className="technique-links">
                      <span className="technique-links-label">More info</span>
                      {tech.more.map((m) => (
                        <Link key={m.to} to={m.to}>
                          {m.label}
                        </Link>
                      ))}
                    </p>
                  )}
                  <p className="technique-links">
                    <span className="technique-links-label">Tutorial</span>
                    {tech.tutorials.map((id) => (
                      <Link key={id} to={`/tutorials/${id}`}>
                        {tutorialLabel(id)}
                      </Link>
                    ))}
                  </p>
                  {tech.tutorials.some(tutorialHasDrill) && (
                    <p className="technique-links">
                      <span className="technique-links-label">Drill</span>
                      {tech.tutorials.filter(tutorialHasDrill).map((id) => {
                        const to = drillPath(id);
                        if (!to) return null;
                        return (
                          <Link key={id} to={to}>
                            {tutorialLabel(id)}
                          </Link>
                        );
                      })}
                    </p>
                  )}
                  {tech.labs && tech.labs.length > 0 && (
                    <p className="technique-links">
                      <span className="technique-links-label">Lab</span>
                      {tech.labs.map((lab) => (
                        <Link key={lab.to} to={lab.to}>
                          {lab.label}
                        </Link>
                      ))}
                    </p>
                  )}
                  {tech.sourceVideos && tech.sourceVideos.length > 0 && (
                    <p className="technique-links">
                      <span className="technique-links-label">Video</span>
                      {tech.sourceVideos.map((vid) => {
                        const src = SOURCE_VIDEOS[vid];
                        return (
                          <a key={vid} href={src.watchUrl} target="_blank" rel="noreferrer">
                            {src.title}
                          </a>
                        );
                      })}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
