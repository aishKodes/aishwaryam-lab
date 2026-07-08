"use client";

import { motion } from "framer-motion";

export function HeroTriangle() {
  return (
    <motion.svg
      viewBox="0 0 720 460"
      className="h-full min-h-[300px] w-full"
      role="img"
      aria-label="Glowing triangle detective diagram"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <defs>
        <filter id="hero-glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="beam" x1="0" x2="1">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.75" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect x="34" y="38" width="652" height="376" rx="18" fill="#070d21" opacity="0.74" />
      <path d="M86 342 L640 342" stroke="#334155" strokeWidth="2" strokeDasharray="8 10" />
      <path d="M118 328 L344 86 L606 328 Z" fill="rgba(34,211,238,0.04)" stroke="url(#beam)" strokeWidth="6" filter="url(#hero-glow)" />
      <motion.path
        d="M220 328 L344 194 L488 328"
        fill="none"
        stroke="#34d399"
        strokeWidth="4"
        strokeDasharray="10 8"
        filter="url(#hero-glow)"
        animate={{ pathLength: [0.25, 1, 0.25], opacity: [0.45, 1, 0.45] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
      />
      <path d="M344 86 L344 342" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 8" opacity="0.55" />
      <circle cx="118" cy="328" r="10" fill="#22d3ee" filter="url(#hero-glow)" />
      <circle cx="344" cy="86" r="10" fill="#a78bfa" filter="url(#hero-glow)" />
      <circle cx="606" cy="328" r="10" fill="#22d3ee" filter="url(#hero-glow)" />
      <circle cx="344" cy="194" r="8" fill="#34d399" filter="url(#hero-glow)" />
      <g fill="#cbd5e1" fontFamily="monospace" fontSize="22" fontWeight="700">
        <text x="92" y="370">A</text>
        <text x="334" y="66">B</text>
        <text x="615" y="370">C</text>
        <text x="356" y="206">D</text>
      </g>
      <g opacity="0.82">
        <path d="M456 106 h98 v54 h-98z" fill="#0f172a" stroke="#22d3ee" strokeOpacity="0.4" />
        <text x="475" y="139" fill="#a5f3fc" fontFamily="monospace" fontSize="18">AA LOCK</text>
      </g>
      <motion.g
        animate={{ x: [0, 18, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
      >
        <path d="M72 126 H240" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <path d="M226 112 L246 126 L226 140" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </motion.svg>
  );
}
