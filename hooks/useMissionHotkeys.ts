"use client";

import { useEffect } from "react";

type HotkeyHandlers = {
  enabled?: boolean;
  onNext?: () => void;
  onReveal?: () => void;
  onSubmit?: () => void;
};

export function useMissionHotkeys({
  enabled = true,
  onNext,
  onReveal,
  onSubmit
}: HotkeyHandlers) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      const isTyping =
        tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";

      if (isTyping && event.key !== "Enter") {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "n" && onNext) {
        event.preventDefault();
        onNext();
      }

      if (key === "r" && onReveal) {
        event.preventDefault();
        onReveal();
      }

      if (event.key === "Enter" && onSubmit) {
        event.preventDefault();
        onSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onNext, onReveal, onSubmit]);
}
