"use client";

import Link from "next/link";

export default function GaussError({ reset }: { reset: () => void }) {
  return (
    <main
      className="ap-lab"
      style={{
        padding: 40,
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 20,
      }}
    >
      <h1>The lesson could not be opened.</h1>
      <p>Please reconnect if this is the first visit, then try again.</p>
      <button className="ap-button" onClick={reset}>
        Try again
      </button>
      <Link href="/">Return to Aishwaryam Lab</Link>
    </main>
  );
}
