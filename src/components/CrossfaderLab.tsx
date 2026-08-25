import { Link } from "react-router-dom";
import { HowToUse, WhatItDoes } from "./HowToUse";

/** Click-around: what the crossfader does for the room. */
export function CrossfaderLab() {
  return (
    <div className="lab">
      <WhatItDoes>
        <p>
          The <strong>crossfader</strong> chooses which deck the room hears. Left = Deck 1, right =
          Deck 2, middle = both (how much depends on curve). Channel faders still matter — they’re
          each deck’s volume into the blend.
        </p>
      </WhatItDoes>

      <HowToUse>
        <ol>
          <li>Leave both channel faders up so you can hear the slide.</li>
          <li>Park fully left, then center, then right — notice what’s in the room.</li>
          <li>Later: combine with a slow LOW kill so kicks don’t pile up in the middle.</li>
        </ol>
        <p>
          <strong>On hardware</strong> plays both demo beds and grades the positions — plus a
          simple timing tip on how fast you crossed.
        </p>
      </HowToUse>

      <p className="footer-note">
        Next: <Link to="/djing/blend">Blend</Link> · <Link to="/labs/free">Free play</Link>
      </p>
    </div>
  );
}
