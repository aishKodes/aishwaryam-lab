"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { HeroTriangle } from "@/components/visuals/HeroTriangle";
import { SmartButton } from "@/components/ui/SmartButton";

type StartScreenProps = {
  hasSavedGame: boolean;
  onStartNew: () => void;
  onContinue: () => void;
};

export function StartScreen({ hasSavedGame, onStartNew, onContinue }: StartScreenProps) {
  return (
    <section className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[1.02fr_0.98fr]">
      <motion.div
        className="space-y-7"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold uppercase text-cyan-100">
          Class 10 Mathematics Investigation
        </div>
        <div className="space-y-4">
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-6xl xl:text-7xl">
            Project Thales: Triangle Detective Mission
          </h1>
          <p className="max-w-3xl text-xl leading-9 text-slate-300 sm:text-2xl">
            Similar figures, AA/SSS/SAS similarity, Basic Proportionality Theorem, and shadow-based indirect measurement inside a premium smartboard mission.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {hasSavedGame ? (
            <SmartButton icon={<Trophy className="h-6 w-6" />} onClick={onContinue}>
              Continue Mission
            </SmartButton>
          ) : null}
          <SmartButton
            icon={hasSavedGame ? <RotateCcw className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            variant={hasSavedGame ? "secondary" : "primary"}
            onClick={onStartNew}
          >
            {hasSavedGame ? "New Mission" : "Start Mission"}
          </SmartButton>
        </div>
      </motion.div>
      <motion.div
        className="glass-panel rounded-xl p-3 sm:p-5"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <HeroTriangle />
      </motion.div>
    </section>
  );
}
