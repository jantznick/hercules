import { Link } from "react-router-dom";
import { HowToUse, WhatItDoes } from "./HowToUse";

/** Click-around: why LOW kill matters when blending. */
export function EqLab() {
  return (
    <div className="lab">
      <WhatItDoes>
        <p>
          <strong>LOW</strong> is mostly kick and bass. When two songs play together, two kicks
          fight. Killing LOW on the incoming deck (or the outgoing one) clears space before you
          open the blend.
        </p>
        <p>
          This is different from FILTER (muffles or thins everything) and from Neural Mix stems.
        </p>
      </WhatItDoes>

      <HowToUse>
        <ol>
          <li>Park Deck 1 LOW at 12 o’clock.</li>
          <li>Twist fully left — bass drops out of the mix.</li>
          <li>Bring it back to center when you want that deck’s kick in again.</li>
        </ol>
        <p>
          Switch to <strong>On hardware</strong> to hear a demo loop while you do it on the Mix
          Ultra.
        </p>
      </HowToUse>

      <p className="footer-note">
        Full story: <Link to="/djing/eq">EQ &amp; Filter</Link> · Drill:{" "}
        <Link to="/tutorials/eq-vs-neural">EQ vs Neural Mix</Link>
      </p>
    </div>
  );
}
