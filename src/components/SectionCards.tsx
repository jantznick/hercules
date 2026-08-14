import { Link } from "react-router-dom";

export type SectionCard = {
  to: string;
  title: string;
  blurb: string;
  pill?: string;
};

export function SectionCards({ items, thirds }: { items: SectionCard[]; thirds?: boolean }) {
  return (
    <div className={`home-cards ${thirds ? "thirds" : ""}`}>
      {items.map((item) => (
        <Link key={item.to} to={item.to} className="home-card">
          {item.pill && <span className="pill">{item.pill}</span>}
          <h3>{item.title}</h3>
          <p>{item.blurb}</p>
        </Link>
      ))}
    </div>
  );
}

export function LevelBand({ children }: { children: string }) {
  return <h2 className="level-band">{children}</h2>;
}
