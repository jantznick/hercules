import type { ReactNode } from "react";

export function WhatItDoes({ children }: { children: ReactNode }) {
  return (
    <div className="what-it-does">
      <div className="section-head">
        <h2>What it does</h2>
      </div>
      {children}
    </div>
  );
}

export function HowToUse({
  children,
  actions,
}: {
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="how-to-use">
      <div className="section-head">
        <h2>How to use</h2>
        {actions}
      </div>
      {children}
    </div>
  );
}
