"use client";

import type { ClassificationCard } from "@/data/missions";

type SimilarityCardVisualProps = {
  visual: ClassificationCard["visual"];
};

export function SimilarityCardVisual({ visual }: SimilarityCardVisualProps) {
  return (
    <svg viewBox="0 0 360 220" className="h-56 w-full" role="img" aria-label="Similarity evidence visual">
      <defs>
        <filter id={`glow-${visual}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="16" y="16" width="328" height="188" rx="12" fill="#070d21" stroke="rgba(148,163,184,0.22)" />
      {visual === "circles" ? (
        <>
          <circle cx="116" cy="112" r="46" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="4" filter={`url(#glow-${visual})`} />
          <circle cx="244" cy="112" r="70" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="4" filter={`url(#glow-${visual})`} />
        </>
      ) : null}
      {visual === "squares" ? (
        <>
          <rect x="74" y="72" width="74" height="74" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="4" filter={`url(#glow-${visual})`} />
          <rect x="204" y="52" width="112" height="112" fill="rgba(52,211,153,0.08)" stroke="#34d399" strokeWidth="4" filter={`url(#glow-${visual})`} />
        </>
      ) : null}
      {visual === "equilateral" ? (
        <>
          <path d="M74 154 L123 70 L172 154 Z" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="4" filter={`url(#glow-${visual})`} />
          <path d="M196 166 L258 58 L320 166 Z" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="4" filter={`url(#glow-${visual})`} />
        </>
      ) : null}
      {visual === "square-rectangle" ? (
        <>
          <rect x="70" y="68" width="86" height="86" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="4" />
          <rect x="202" y="82" width="118" height="58" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="4" />
          <path d="M182 64 V160" stroke="#fb7185" strokeWidth="2" strokeDasharray="6 8" />
        </>
      ) : null}
      {visual === "square-rhombus" ? (
        <>
          <rect x="74" y="70" width="84" height="84" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="4" />
          <path d="M238 62 L314 110 L246 158 L170 110 Z" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth="4" />
          <path d="M170 110 H314" stroke="#fb7185" strokeWidth="2" strokeDasharray="6 8" opacity="0.8" />
        </>
      ) : null}
      {visual === "monument" ? (
        <>
          <g transform="translate(72 50)">
            <path d="M42 0 L78 34 H64 V110 H56 V52 H46 V110 H38 V52 H28 V110 H20 V34 H6 Z" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="3" />
            <rect x="12" y="110" width="60" height="12" fill="#22d3ee" opacity="0.5" />
          </g>
          <g transform="translate(202 24) scale(1.28)">
            <path d="M42 0 L78 34 H64 V110 H56 V52 H46 V110 H38 V52 H28 V110 H20 V34 H6 Z" fill="rgba(52,211,153,0.10)" stroke="#34d399" strokeWidth="3" />
            <rect x="12" y="110" width="60" height="12" fill="#34d399" opacity="0.45" />
          </g>
        </>
      ) : null}
      {visual === "quads" ? (
        <>
          <path d="M64 144 L92 62 L158 76 L178 154 Z" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="4" />
          <path d="M202 150 L228 58 L306 84 L292 160 Z" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="4" />
          <text x="143" y="114" fill="#fb7185" fontSize="42" fontFamily="monospace" fontWeight="800">?</text>
        </>
      ) : null}
    </svg>
  );
}
