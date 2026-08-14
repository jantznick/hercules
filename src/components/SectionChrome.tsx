import { NavLink, useLocation } from "react-router-dom";
import { DJING_GROUPS } from "../spine";
import { TUTORIALS, TUTORIAL_LEVELS } from "../tutorials/data";
import { GenreBar } from "./GenreBar";

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
  also?: string[];
  /** Match this hash on the destination path (tutorial level groups). */
  hash?: string;
};

const GEAR_PAGES: NavItem[] = [
  { to: "/gear", label: "Overview", end: true },
  { to: "/gear/box", label: "The box" },
  { to: "/pre-cue", label: "Headphones" },
  { to: "/settings", label: "djay settings" },
];

const LAB_PAGES: NavItem[] = [
  { to: "/labs", label: "Overview", end: true },
  { to: "/labs/cue", label: "CUE" },
  { to: "/labs/hot-cue", label: "Hot cues" },
  { to: "/labs/filter", label: "Filter" },
  { to: "/labs/neural", label: "HIGH / MID / LOW" },
  { to: "/labs/pads", label: "Pads" },
  { to: "/labs/neural-pads", label: "Neural Mix pads" },
];

const TUTORIAL_PAGES: NavItem[] = [
  { to: "/tutorials", label: "Overview", end: true },
  ...TUTORIAL_LEVELS.map((level) => ({
    to: `/tutorials#${level.slug}`,
    label: level.label,
    hash: level.slug,
  })),
];

function tutorialHash(hash: string) {
  return hash.replace(/^#/, "");
}

function isTutorialLevelHash(hash: string) {
  const slug = tutorialHash(hash);
  return TUTORIAL_LEVELS.some((level) => level.slug === slug);
}

function itemActive(
  pathname: string,
  hash: string,
  item: NavItem,
  navIsActive?: boolean,
  tutorialId?: string,
) {
  if (item.hash) {
    if (pathname === "/tutorials") {
      return tutorialHash(hash) === item.hash;
    }
    if (pathname.startsWith("/tutorials/") && tutorialId) {
      const tutorial = TUTORIALS.find((t) => t.id === tutorialId);
      const slug = TUTORIAL_LEVELS.find((l) => l.label === tutorial?.level)?.slug;
      return slug === item.hash;
    }
    return false;
  }
  if (item.to === "/tutorials" && item.end) {
    return pathname === "/tutorials" && !isTutorialLevelHash(hash);
  }
  if (item.end) return pathname === item.to;
  if (navIsActive) return true;
  const pathOnly = item.to.split("#")[0];
  if (pathname === pathOnly || pathname.startsWith(`${pathOnly}/`)) return true;
  return (item.also ?? []).some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function pageActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

function SectionPagesNav({
  items,
  aria,
}: {
  items: NavItem[];
  aria: string;
}) {
  const { pathname, hash } = useLocation();
  const tutorialId = pathname.startsWith("/tutorials/") ? pathname.slice("/tutorials/".length) : undefined;
  const root = items[0];
  const pageItems = items.slice(1);
  const rootActive = root
    ? itemActive(pathname, hash, root, undefined, tutorialId)
    : false;

  return (
    <nav className="djing-nav" aria-label="In this section">
      {root && (
        <div className="djing-nav-groups" role="tablist" aria-label={aria}>
          <NavLink
            to={root.to}
            end={root.end}
            className={rootActive ? "djing-nav-l1 active" : "djing-nav-l1"}
          >
            {root.label}
          </NavLink>
        </div>
      )}
      <div className="djing-nav-pages" aria-label={aria}>
        {pageItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              itemActive(pathname, hash, item, isActive, tutorialId)
                ? "djing-nav-l2 active"
                : "djing-nav-l2"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function DjingGroupedTabs() {
  const { pathname } = useLocation();
  const overview = pathname === "/djing";
  const activeGroup = DJING_GROUPS.find((group) =>
    group.items.some((item) => pageActive(pathname, item.to)),
  );

  return (
    <nav className="djing-nav" aria-label="In this section">
      <div className="djing-nav-groups" role="tablist" aria-label="DJing">
        <NavLink
          to="/djing"
          end
          className={({ isActive }) => (isActive ? "djing-nav-l1 active" : "djing-nav-l1")}
        >
          Overview
        </NavLink>
      </div>
      <div className="djing-nav-pages" aria-label="DJing groups">
        {DJING_GROUPS.map((group) => {
          const selected = activeGroup?.id === group.id;
          return (
            <NavLink
              key={group.id}
              to={group.items[0].to}
              className={selected ? "djing-nav-l2 active" : "djing-nav-l2"}
              aria-current={selected ? "page" : undefined}
            >
              {group.label}
            </NavLink>
          );
        })}
      </div>
      {!overview && activeGroup && (
        <div className="djing-nav-pages" aria-label={`${activeGroup.label} pages`}>
          {activeGroup.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={pageActive(pathname, item.to) ? "djing-nav-l2 active" : "djing-nav-l2"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

function isLabPath(pathname: string) {
  return pathname === "/labs" || pathname.startsWith("/labs/");
}

export function SectionChrome() {
  const { pathname } = useLocation();

  if (
    pathname === "/gear" ||
    pathname.startsWith("/gear/") ||
    pathname.startsWith("/pre-cue") ||
    pathname.startsWith("/settings")
  ) {
    return <SectionPagesNav items={GEAR_PAGES} aria="Gear pages" />;
  }

  if (pathname === "/djing" || pathname.startsWith("/djing/")) {
    return (
      <>
        <DjingGroupedTabs />
        <GenreBar />
      </>
    );
  }

  if (isLabPath(pathname)) {
    return <SectionPagesNav items={LAB_PAGES} aria="Labs" />;
  }

  if (pathname.startsWith("/tutorials")) {
    return <SectionPagesNav items={TUTORIAL_PAGES} aria="Tutorial levels" />;
  }

  return null;
}
