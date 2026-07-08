"use client";

type ShadowDiagramProps = {
  mode: "tower" | "monument";
  reveal?: boolean;
};

export function ShadowDiagram({ mode, reveal = false }: ShadowDiagramProps) {
  const smallHeight = mode === "tower" ? "6 m" : "1.5 m";
  const smallShadow = mode === "tower" ? "4 m" : "2 m";
  const largeShadow = mode === "tower" ? "28 m" : "18 m";
  const largeLabel = mode === "tower" ? "Tower" : "Monument";

  return (
    <svg viewBox="0 0 760 410" className="h-full min-h-[320px] w-full" role="img" aria-label="Shadow similarity diagram">
      <defs>
        <filter id={`shadow-glow-${mode}`}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="22" y="26" width="716" height="352" rx="16" fill="#070d21" stroke="rgba(148,163,184,0.22)" />
      <path d="M76 320 H706" stroke="#64748b" strokeWidth="3" />
      <g opacity="0.9">
        <path d="M86 82 L275 320" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <path d="M230 56 L632 320" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="72" cy="66" r="18" fill="#fbbf24" opacity="0.9" />
      </g>
      <g filter={`url(#shadow-glow-${mode})`}>
        <path d="M162 320 V188" stroke="#22d3ee" strokeWidth="9" strokeLinecap="round" />
        <path d="M162 320 H275" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
        <path d="M162 188 L275 320" stroke="#22d3ee" strokeWidth="4" strokeDasharray="8 8" />
        <path d="M490 320 V82" stroke="#a78bfa" strokeWidth="13" strokeLinecap="round" />
        <path d="M490 320 H632" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
        <path d="M490 82 L632 320" stroke="#a78bfa" strokeWidth="4" strokeDasharray="8 8" />
      </g>
      <g fill="#dbeafe" fontFamily="monospace" fontSize="22" fontWeight="700">
        <text x="94" y="250">{smallHeight}</text>
        <text x="193" y="352">{smallShadow}</text>
        <text x="426" y="203">{reveal ? (mode === "tower" ? "42 m" : "13.5 m") : "x m"}</text>
        <text x="536" y="352">{largeShadow}</text>
      </g>
      <g fill="#a5f3fc" fontFamily="monospace" fontSize="18" fontWeight="700">
        <text x="122" y="174">{mode === "tower" ? "Pole" : "Student"}</text>
        <text x="454" y="62">{largeLabel}</text>
      </g>
      {reveal ? (
        <g>
          <path d="M162 188 A36 36 0 0 1 196 204" fill="none" stroke="#34d399" strokeWidth="4" />
          <path d="M490 82 A52 52 0 0 1 536 106" fill="none" stroke="#34d399" strokeWidth="4" />
          <text x="298" y="116" fill="#34d399" fontFamily="monospace" fontSize="20" fontWeight="800">AA similarity</text>
        </g>
      ) : null}
    </svg>
  );
}
