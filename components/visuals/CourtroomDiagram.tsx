"use client";

export function CourtroomDiagram() {
  return (
    <svg viewBox="0 0 760 360" className="h-full min-h-[280px] w-full" role="img" aria-label="Similarity courtroom triangles">
      <defs>
        <filter id="court-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="28" y="28" width="704" height="296" rx="16" fill="#070d21" stroke="rgba(148,163,184,0.22)" />
      <path d="M102 270 H658" stroke="#475569" strokeWidth="4" />
      <g filter="url(#court-glow)">
        <path d="M144 252 L254 86 L356 252 Z" fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="5" />
        <path d="M430 252 L542 86 L620 252 Z" fill="rgba(167,139,250,0.06)" stroke="#a78bfa" strokeWidth="5" />
      </g>
      <g fill="#dbeafe" fontFamily="monospace" fontSize="21" fontWeight="800">
        <text x="132" y="292">A</text>
        <text x="250" y="68">B</text>
        <text x="360" y="292">C</text>
        <text x="418" y="292">P</text>
        <text x="538" y="68">Q</text>
        <text x="626" y="292">R</text>
      </g>
      <g>
        <rect x="288" y="118" width="184" height="76" rx="10" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" />
        <text x="323" y="148" fill="#fde68a" fontFamily="monospace" fontSize="20" fontWeight="900">EVIDENCE</text>
        <text x="334" y="176" fill="#fde68a" fontFamily="monospace" fontSize="17" fontWeight="800">AA SSS SAS ?</text>
      </g>
    </svg>
  );
}
