import { NavLink, Outlet, useLocation } from "react-router-dom";
import { GenreProvider } from "../djing/GenreContext";
import { SectionChrome } from "./SectionChrome";

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
  /** Extra path prefixes that should keep this item highlighted */
  also?: string[];
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Start",
    items: [{ to: "/", label: "Home", end: true }],
  },
  {
    label: "Learn",
    items: [
      { to: "/gear", label: "Gear", also: ["/pre-cue", "/settings"] },
      { to: "/controls", label: "The controller", also: ["/cheatsheet"] },
      {
        to: "/djing",
        label: "DJing",
        also: ["/cueing", "/mixing-strategy", "/remix"],
      },
      { to: "/practice", label: "Practice", also: ["/labs", "/tutorials"] },
    ],
  },
];

const FLAT_NAV = NAV_GROUPS.flatMap((g) => g.items);

function pathActive(pathname: string, item: NavItem, navIsActive: boolean) {
  if (navIsActive) return true;
  return (item.also ?? []).some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">Mix Ultra Lab</span>
          <p>Your Mix Ultra + djay — gear, buttons, craft, practice</p>
        </div>
        <nav className="side-nav" aria-label="Main">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="nav-group">
              <div className="nav-group-label">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    pathActive(pathname, item, isActive) ? "side-link active" : "side-link"
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <p className="sidebar-foot">
          Gear → Controller → DJing → Practice. Technique pages (which cues, mix in/out, looping)
          live under DJing.
        </p>
      </aside>

      <div className="shell-main">
        <header className="mobile-bar">
          <span className="brand-mark">Mix Ultra Lab</span>
        </header>
        <nav className="mobile-nav" aria-label="Mobile">
          {FLAT_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                pathActive(pathname, item, isActive) ? "mobile-link active" : "mobile-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="page">
          <GenreProvider>
            <SectionChrome />
            <Outlet />
          </GenreProvider>
        </main>
      </div>
    </div>
  );
}
