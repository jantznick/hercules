import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HardwareArmProvider, useHardwareArm } from "../context/HardwareArmContext";
import { GenreProvider } from "../djing/GenreContext";
import { SectionChrome } from "./SectionChrome";

function HardwareArmControl({ compact }: { compact?: boolean }) {
  const { status, armed, arming, error, arm } = useHardwareArm();

  const label = armed
    ? "Armed"
    : arming
      ? status.status === "connecting"
        ? "Connecting…"
        : "Arming…"
      : compact
        ? "Arm"
        : "Arm MIDI + audio";

  return (
    <div className={`hw-arm${compact ? " hw-arm-compact" : ""}`}>
      <button
        type="button"
        className={armed ? "hw-arm-btn active" : "hw-arm-btn"}
        disabled={armed || arming}
        onClick={() => void arm()}
      >
        {label}
      </button>
      {!compact && status.status === "unsupported" && (
        <p className="hw-arm-note warn">Use Chrome/Edge/Firefox — not Safari.</p>
      )}
      {!compact && status.status === "denied" && (
        <p className="hw-arm-note warn">Allow MIDI, then Arm again.</p>
      )}
      {!compact && !armed && status.status === "idle" && (
        <p className="hw-arm-note">Quit djay so it isn’t holding the Mix Ultra.</p>
      )}
      {error && <p className="hw-arm-note warn">{error}</p>}
    </div>
  );
}

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
const ACCOUNT: NavItem = { to: "/settings#account", label: "Account" };

const FLAT_NAV = [...NAV_GROUPS.flatMap((g) => g.items), ACCOUNT, CHEAT_SHEET];

function pathActive(pathname: string, item: NavItem, navIsActive: boolean) {
  if (navIsActive) return true;
  return (item.also ?? []).some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function AccountNavControl({ compact }: { compact?: boolean }) {
  const { isAuthenticated, isLoading, user, openAuthModal } = useAuth();

  if (isLoading) {
    return compact ? null : <p className="hw-arm-note">Checking account…</p>;
  }

  if (isAuthenticated && user) {
    return (
      <div className={`account-nav${compact ? " account-nav-compact" : ""}`}>
        {!compact && <p className="hw-arm-note">{user.email}</p>}
        <NavLink to="/settings#account" className="side-link account-nav-link">
          {compact ? "Account" : "Account · Tidal"}
        </NavLink>
      </div>
    );
  }

  return (
    <div className={`account-nav${compact ? " account-nav-compact" : ""}`}>
      <button
        type="button"
        className="hw-arm-btn"
        onClick={() => openAuthModal("login")}
      >
        Sign in
      </button>
      {!compact && (
        <button
          type="button"
          className="account-nav-secondary"
          onClick={() => openAuthModal("register")}
        >
          Create account
        </button>
      )}
    </div>
  );
}

export function Layout() {
  const { pathname } = useLocation();

  return (
    <HardwareArmProvider>
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
        <div className="sidebar-foot">
          <HardwareArmControl />
          <AccountNavControl />
          <nav aria-label="Reference">
            <NavLink
              to={CHEAT_SHEET.to}
              className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
            >
              {CHEAT_SHEET.label}
            </NavLink>
          </nav>
        </div>
      </aside>

      <div className="shell-main">
        <header className="mobile-bar">
          <span className="brand-mark">Mix Ultra Lab</span>
          <div className="mobile-bar-actions">
            <AccountNavControl compact />
            <HardwareArmControl compact />
          </div>
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
    </HardwareArmProvider>
  );
}
