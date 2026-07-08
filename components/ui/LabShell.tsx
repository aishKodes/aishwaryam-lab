"use client";

import type { ReactNode } from "react";

export function LabShell({ children }: { children: ReactNode }) {
  return (
    <main className="lab-grid scanline min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
