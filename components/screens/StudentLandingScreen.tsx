"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import type { StudentProfile } from "@/types/game";
import { HeroTriangle } from "@/components/visuals/HeroTriangle";
import { SmartButton } from "@/components/ui/SmartButton";

type StudentLandingScreenProps = {
  initialProfile: StudentProfile;
  hasProgress: boolean;
  onStart: (profile: StudentProfile) => void;
  onResume: () => void;
};

export function StudentLandingScreen({
  initialProfile,
  hasProgress,
  onStart,
  onResume
}: StudentLandingScreenProps) {
  const [studentName, setStudentName] = useState(initialProfile.studentName);
  const [rollNumber, setRollNumber] = useState(initialProfile.rollNumber);
  const canStart = studentName.trim().length > 0 && rollNumber.trim().length > 0;

  function submitStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canStart) {
      return;
    }

    onStart({
      studentName: studentName.trim(),
      rollNumber: rollNumber.trim()
    });
  }

  return (
    <section className="grid flex-1 items-center gap-5 py-4 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase text-cyan-100 sm:text-sm">
          Class 10 Mathematics Investigation
        </div>
        <div className="space-y-3">
          <h1 className="max-w-4xl text-4xl font-black leading-[1.03] text-white sm:text-6xl xl:text-7xl">
            Project Thales: Triangle Detective Mission
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-2xl sm:leading-9">
            A five-level NCERT Triangles mission on similar figures, Thales theorem, similarity criteria, and shadow measurement.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="glass-panel rounded-xl p-4 sm:p-5"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="hidden lg:block">
          <HeroTriangle />
        </div>

        <form className="space-y-4" onSubmit={submitStudent}>
          <div>
            <p className="text-sm font-bold uppercase text-cyan-200">Student entry</p>
            <h2 className="mt-1 text-3xl font-black sm:text-4xl">Start your mission</h2>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase text-slate-400">
              Full Name
            </span>
            <input
              className="min-h-14 w-full rounded-lg border border-slate-500/40 bg-slate-950/70 px-4 text-lg font-bold text-white placeholder:text-slate-500"
              value={studentName}
              maxLength={120}
              autoComplete="name"
              placeholder="Enter full name"
              onChange={(event) => setStudentName(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase text-slate-400">
              Roll Number
            </span>
            <input
              className="min-h-14 w-full rounded-lg border border-slate-500/40 bg-slate-950/70 px-4 text-lg font-bold text-white placeholder:text-slate-500"
              value={rollNumber}
              maxLength={60}
              inputMode="text"
              autoComplete="off"
              placeholder="Enter roll number"
              onChange={(event) => setRollNumber(event.target.value)}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <SmartButton
              type="submit"
              className="w-full"
              icon={<Play className="h-6 w-6" />}
              disabled={!canStart}
            >
              Start Mission
            </SmartButton>
            <SmartButton
              className="w-full"
              variant="secondary"
              icon={<RotateCcw className="h-6 w-6" />}
              disabled={!hasProgress}
              onClick={onResume}
            >
              Resume
            </SmartButton>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
