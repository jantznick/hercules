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
      {
        to: "/djing",
        label: "DJing",
        also: ["/cueing", "/mixing-strategy", "/remix"],
      },
      { to: "/labs", label: "Labs" },
      { to: "/tutorials", label: "Tutorials" },
    ],
  },
];

const CHEAT_SHEET: NavItem = { to: "/cheatsheet", label: "Cheat sheet" };

const FLAT_NAV = [...NAV_GROUPS.flatMap((g) => g.items), CHEAT_SHEET];

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
          <p>A beginner’s guide to DJing with the Hercules Mix Ultra and djay Pro AI from Algoriddim</p>
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
        <nav className="sidebar-foot" aria-label="Reference">
          <NavLink
            to={CHEAT_SHEET.to}
            className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
          >
            {CHEAT_SHEET.label}
          </NavLink>
        </nav>
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
