import { NavLink, useLocation } from "react-router-dom";
import { GenreBar } from "./GenreBar";

type HubTab = {
  to: string;
  label: string;
  end?: boolean;
  also?: string[];
};

const GEAR_TABS: HubTab[] = [
  { to: "/gear", label: "The box", end: true },
  { to: "/pre-cue", label: "Headphones" },
  { to: "/settings", label: "djay settings" },
];

const CONTROL_TABS: HubTab[] = [
  { to: "/controls", label: "Overview", end: true },
  { to: "/cheatsheet", label: "Cheat sheet" },
  { to: "/labs/cue", label: "CUE" },
  { to: "/labs/hot-cue", label: "Hot cues" },
  { to: "/labs/filter", label: "Filter" },
  { to: "/labs/neural", label: "HIGH / MID / LOW", also: ["/labs/neural-pads"] },
  { to: "/labs/pads", label: "Pads" },
];

const DJING_TABS: HubTab[] = [
  { to: "/djing", label: "Overview", end: true },
  { to: "/djing/phrasing", label: "Phrases" },
  { to: "/djing/songs", label: "Songs" },
  { to: "/djing/waveform", label: "Waveform" },
  { to: "/djing/cueing", label: "Cues" },
  { to: "/djing/mixing", label: "Mix in/out" },
  { to: "/djing/eq", label: "EQ & Filter" },
  { to: "/djing/choose", label: "Pick a song" },
  { to: "/djing/blend", label: "The blend" },
  { to: "/djing/quantize", label: "Quantize" },
  { to: "/djing/looping", label: "Looping" },
  { to: "/djing/remix", label: "Remix" },
  { to: "/djing/style", label: "This music" },
];

const PRACTICE_TABS: HubTab[] = [
  { to: "/practice", label: "Overview", end: true },
  { to: "/labs", label: "Labs", end: true },
  { to: "/tutorials", label: "Tutorials" },
];

function tabActive(pathname: string, tab: HubTab, navIsActive: boolean) {
  if (navIsActive) return true;
  return (tab.also ?? []).some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function HubTabs({ items }: { items: HubTab[] }) {
  const { pathname } = useLocation();

  return (
    <nav className="hub-tabs" aria-label="In this section">
      {items.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            tabActive(pathname, tab, isActive) ? "hub-tab active" : "hub-tab"
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function SectionChrome() {
  const { pathname } = useLocation();

  if (pathname === "/gear" || pathname.startsWith("/pre-cue") || pathname.startsWith("/settings")) {
    return <HubTabs items={GEAR_TABS} />;
  }

  if (
    pathname === "/controls" ||
    pathname.startsWith("/cheatsheet") ||
    pathname.startsWith("/labs/cue") ||
    pathname.startsWith("/labs/hot-cue") ||
    pathname.startsWith("/labs/filter") ||
    pathname.startsWith("/labs/neural") ||
    pathname.startsWith("/labs/pads")
  ) {
    return <HubTabs items={CONTROL_TABS} />;
  }

  if (pathname === "/djing" || pathname.startsWith("/djing/")) {
    return (
      <>
        <HubTabs items={DJING_TABS} />
        <GenreBar />
      </>
    );
  }

  if (pathname === "/practice" || pathname === "/labs" || pathname.startsWith("/tutorials")) {
    return <HubTabs items={PRACTICE_TABS} />;
  }

  return null;
}
