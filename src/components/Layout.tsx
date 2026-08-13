import { NavLink, Outlet } from "react-router-dom";

const NAV_GROUPS: { label: string; items: { to: string; label: string; end?: boolean }[] }[] = [
  {
    label: "Learn",
    items: [
      { to: "/", label: "Home", end: true },
      { to: "/gear", label: "Gear & setup" },
      { to: "/dj-basics", label: "DJ basics" },
      { to: "/tutorials", label: "Tutorials" },
    ],
  },
  {
    label: "Labs",
    items: [
      { to: "/labs/cue", label: "Cue" },
      { to: "/labs/hot-cue", label: "Hot cue" },
      { to: "/labs/filter", label: "Filter" },
      { to: "/labs/neural", label: "Neural knobs" },
      { to: "/labs/pads", label: "Pad modes" },
    ],
  },
  {
    label: "Reference",
    items: [{ to: "/cheatsheet", label: "Cheat sheet" }],
  },
];

const FLAT_NAV = NAV_GROUPS.flatMap((g) => g.items);

export function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">Mix Ultra Lab</span>
          <p>Controller + djay + how DJing works</p>
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
                  className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <p className="sidebar-foot">
          Suggested path: Gear → DJ basics → Labs → Tutorials (Start here → Advanced).
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
              className={({ isActive }) => (isActive ? "mobile-link active" : "mobile-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
