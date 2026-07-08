"use client";

import { motion } from "framer-motion";

type ThalesGateDiagramProps = {
  unlocked?: boolean;
};

export function ThalesGateDiagram({ unlocked = false }: ThalesGateDiagramProps) {
  return (
    <svg viewBox="0 0 760 430" className="h-full min-h-[330px] w-full" role="img" aria-label="Thales theorem triangle diagram">
      <defs>
        <filter id="gate-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="26" y="28" width="708" height="360" rx="16" fill="#070d21" stroke="rgba(148,163,184,0.22)" />
      <path d="M118 338 L370 72 L642 338 Z" fill="rgba(34,211,238,0.04)" stroke="#22d3ee" strokeWidth="5" filter="url(#gate-glow)" />
      <motion.path
        d="M258 190 L500 190"
        stroke={unlocked ? "#34d399" : "#38bdf8"}
        strokeWidth={unlocked ? 9 : 6}
        strokeLinecap="round"
        filter="url(#gate-glow)"
        animate={unlocked ? { opacity: [0.45, 1, 0.45] } : { opacity: 0.75 }}
        transition={{ repeat: unlocked ? Infinity : 0, duration: 1.2 }}
      />
      <g stroke="#94a3b8" strokeWidth="2" strokeDasharray="7 8" opacity="0.75">
        <path d="M258 190 L258 338" />
        <path d="M500 190 L500 338" />
      </g>
      <g fill="#e0f2fe" fontFamily="monospace" fontSize="22" fontWeight="800">
        <text x="96" y="366">B</text>
        <text x="360" y="58">A</text>
        <text x="648" y="366">C</text>
        <text x="238" y="184">D</text>
        <text x="506" y="184">E</text>
      </g>
      <g fill="#a5f3fc" fontFamily="monospace" fontSize="20" fontWeight="800">
        <text x="266" y="137">AD = 3</text>
        <text x="160" y="270">DB = 2</text>
        <text x="428" y="137">AE = 6</text>
        <text x="536" y="270">EC = ?</text>
      </g>
      {unlocked ? (
        <g>
          <rect x="238" y="32" width="286" height="44" rx="8" fill="rgba(52,211,153,0.14)" stroke="#34d399" />
          <text x="276" y="61" fill="#bbf7d0" fontFamily="monospace" fontSize="20" fontWeight="900">DE parallel BC unlocked</text>
        </g>
      ) : (
        <g>
          <rect x="258" y="32" width="246" height="44" rx="8" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" />
          <text x="292" y="61" fill="#a5f3fc" fontFamily="monospace" fontSize="20" fontWeight="900">Laser gate locked</text>
        </g>
      )}
    </svg>
  );
}
