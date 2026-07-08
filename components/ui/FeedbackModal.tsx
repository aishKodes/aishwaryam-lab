"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import type { FeedbackTone } from "@/types/game";
import { cn } from "@/lib/cn";

type FeedbackModalProps = {
  open: boolean;
  tone?: FeedbackTone;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

const toneStyles: Record<FeedbackTone, string> = {
  success: "border-emerald-300/50 bg-emerald-300/12 text-emerald-100",
  warning: "border-amber-300/50 bg-amber-300/12 text-amber-100",
  danger: "border-rose-300/50 bg-rose-300/12 text-rose-100",
  info: "border-cyan-300/50 bg-cyan-300/12 text-cyan-100"
};

const toneIcons: Record<FeedbackTone, ReactNode> = {
  success: <CheckCircle2 className="h-7 w-7" />,
  warning: <AlertTriangle className="h-7 w-7" />,
  danger: <ShieldAlert className="h-7 w-7" />,
  info: <Info className="h-7 w-7" />
};

export function FeedbackModal({
  open,
  tone = "info",
  title,
  children,
  footer
}: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-panel w-full max-w-2xl rounded-xl p-6 sm:p-8"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className={cn("mb-5 flex items-center gap-4 rounded-lg border p-4", toneStyles[tone])}>
              <div>{toneIcons[tone]}</div>
              <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
            </div>
            <div className="space-y-4 text-lg leading-8 text-slate-100">{children}</div>
            {footer ? <div className="mt-7 flex flex-wrap gap-3">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
