"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type ConfettiOverlayProps = {
  active: boolean;
};

const colors = ["#22d3ee", "#38bdf8", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"];

export function ConfettiOverlay({ active }: ConfettiOverlayProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 96 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        delay: (index % 12) * 0.035,
        color: colors[index % colors.length],
        width: 8 + (index % 4) * 3,
        height: 14 + (index % 3) * 4,
        rotate: (index * 31) % 180
      })),
    []
  );

  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-[-32px] rounded-sm"
          style={{
            left: piece.left,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color
          }}
          initial={{ y: -40, rotate: piece.rotate, opacity: 1 }}
          animate={{
            y: "112vh",
            rotate: piece.rotate + 540,
            opacity: [1, 1, 0.6, 0]
          }}
          transition={{
            duration: 2.35 + (piece.id % 7) * 0.11,
            delay: piece.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}
