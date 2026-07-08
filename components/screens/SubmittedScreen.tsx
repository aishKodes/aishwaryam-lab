"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import type { StudentProfile } from "@/types/game";
import { TOTAL_POSSIBLE } from "@/lib/scoring";
import { SmartButton } from "@/components/ui/SmartButton";

type SubmittedScreenProps = {
  profile: StudentProfile;
  score: number;
  onReset: () => void;
};

export function SubmittedScreen({ profile, score, onReset }: SubmittedScreenProps) {
  return (
    <section className="flex flex-1 items-center justify-center py-6">
      <motion.div
        className="glass-panel w-full max-w-3xl rounded-xl p-6 text-center sm:p-9"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-xl border border-emerald-300/45 bg-emerald-300/12 text-emerald-100 shadow-glow">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <p className="text-sm font-bold uppercase text-cyan-200">Submitted successfully</p>
        <h1 className="mt-3 text-4xl font-black sm:text-6xl">Mission complete</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          {profile.studentName}, your result has been sent to your teacher.
        </p>
        <div className="mx-auto mt-7 max-w-sm rounded-xl border border-cyan-300/25 bg-cyan-300/8 p-5">
          <p className="text-sm font-bold uppercase text-cyan-200">Your score</p>
          <p className="mt-2 font-mono text-5xl font-black text-white">
            {score}<span className="text-2xl text-slate-400">/{TOTAL_POSSIBLE}</span>
          </p>
          <p className="mt-2 font-mono text-sm text-slate-400">Roll: {profile.rollNumber}</p>
        </div>
        <SmartButton
          className="mt-8"
          variant="secondary"
          icon={<RotateCcw className="h-6 w-6" />}
          onClick={onReset}
        >
          New Student
        </SmartButton>
      </motion.div>
    </section>
  );
}
