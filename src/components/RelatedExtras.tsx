import { Link } from "react-router-dom";

/** Optional deep-dive labs that stay out of the main nav. */
export function RelatedExtras({ links }: { links: { to: string; label: string; blurb: string }[] }) {
  if (!links.length) return null;
  return (
    <aside className="related-extras">
      <h2>More on this topic</h2>
      <ul>
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to}>{l.label}</Link>
            <span>{l.blurb}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
