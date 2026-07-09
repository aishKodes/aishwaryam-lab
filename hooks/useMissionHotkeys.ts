"use client";

import { useEffect } from "react";

type HotkeyHandlers = {
  enabled?: boolean;
  onSubmit?: () => void;
};

export function useMissionHotkeys({
  enabled = true,
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

      if (event.key === "Enter" && onSubmit) {
        event.preventDefault();
        onSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onSubmit]);
}
