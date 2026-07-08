"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type SmartButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "md" | "lg";
};

const variants: Record<NonNullable<SmartButtonProps["variant"]>, string> = {
  primary:
    "border-cyan-300/50 bg-cyan-300 text-slate-950 shadow-glow hover:bg-cyan-200",
  secondary:
    "border-slate-500/35 bg-slate-900/80 text-slate-100 hover:border-cyan-300/60 hover:bg-slate-800",
  ghost:
    "border-cyan-300/20 bg-cyan-300/8 text-cyan-100 hover:border-cyan-300/55 hover:bg-cyan-300/14",
  danger:
    "border-rose-300/45 bg-rose-400/16 text-rose-100 hover:bg-rose-400/24",
  success:
    "border-emerald-300/45 bg-emerald-300 text-slate-950 shadow-glow hover:bg-emerald-200"
};

export function SmartButton({
  icon,
  children,
  className,
  variant = "primary",
  size = "lg",
  type = "button",
  disabled,
  ...props
}: SmartButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2, scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border px-6 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
        size === "lg" && "min-h-16 px-7 text-lg",
        variants[variant],
        className
      )}
      {...props}
    >
      {icon ? <span className="flex h-6 w-6 items-center justify-center">{icon}</span> : null}
      <span>{children}</span>
    </motion.button>
  );
}
