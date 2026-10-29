"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MotionConfig } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Download,
  FlaskConical,
  Maximize,
  Minimize,
  Moon,
  Pause,
  Play,
  Printer,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";
import { GAUSS_PATH, gaussStages } from "@/data/gauss-lesson";
import {
  ApplyStage,
  CardStage,
  ChallengeStage,
  ExitStage,
  FormulaStage,
  GaussSumStage,
  MysteryStage,
} from "./GaussStages";

function clock(seconds: number) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export function GaussLab() {
  const [stage, setStage] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notes, setNotes] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [remaining, setRemaining] = useState<number[]>(
    gaussStages.map((s) => s.minutes * 60),
  );
  const [running, setRunning] = useState(false);
  const [offline, setOffline] = useState("idle");
  const [offlineMessage, setOfflineMessage] = useState("");
  const [lessonKey, setLessonKey] = useState(0);
  const main = useRef<HTMLElement>(null);
  const heading = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("gauss-lab-theme") === "light")
        setTheme("light");
    } catch {
      /* Private browsing may disable storage. */
    }
  }, []);

  const navigate = useCallback((next: number) => {
    setStage(Math.max(0, Math.min(6, next)));
    setRunning(false);
    main.current?.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    setNotes(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      setPresentation(false);
    } else {
      setPresentation(true);
      await document.documentElement.requestFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const listener = () => {
      setFullscreen(Boolean(document.fullscreenElement));
      if (!document.fullscreenElement) setPresentation(false);
    };
    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, []);

  useEffect(() => {
    function keyboard(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLElement &&
        (e.target.closest("input, textarea, select, button, a") ||
          e.target.isContentEditable)
      )
        return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "n") {
        e.preventDefault();
        navigate(stage + 1);
      }
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate(stage - 1);
      }
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        void toggleFullscreen();
      }
      if (e.key === " ") {
        e.preventDefault();
        setRunning((r) => !r);
      }
      if (e.key === "Escape") {
        setNotes(false);
        setPresentation(false);
      }
    }
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [stage, navigate, toggleFullscreen]);

  useEffect(() => {
    if (!running || remaining[stage] === 0) return;
    const id = window.setInterval(
      () =>
        setRemaining((seconds) =>
          seconds.map((s, i) => (i === stage ? Math.max(0, s - 1) : s)),
        ),
      1000,
    );
    return () => clearInterval(id);
  }, [running, stage, remaining]);

  async function saveOffline() {
    setOffline("saving");
    setOfflineMessage("");
    try {
      if (
        !("serviceWorker" in navigator) ||
        !window.isSecureContext ||
        process.env.NODE_ENV !== "production"
      )
        throw new Error(
          "Offline saving needs a production build on HTTPS or localhost.",
        );
      const registration = await navigator.serviceWorker.register(
        `${GAUSS_PATH}/sw.js`,
        { scope: GAUSS_PATH },
      );
      const worker =
        registration.active || registration.installing || registration.waiting;
      if (!worker)
        throw new Error("Offline storage is unavailable in this browser.");
      if (worker.state !== "activated")
        await new Promise<void>((resolve, reject) => {
          const timeout = window.setTimeout(
            () =>
              reject(new Error("Offline preparation timed out. Please retry.")),
            20000,
          );
          worker.addEventListener("statechange", () => {
            if (worker.state === "activated") {
              clearTimeout(timeout);
              resolve();
            }
          });
        });
      await document.fonts.ready;
      const printResponse = await fetch(`${GAUSS_PATH}/print`);
      if (!printResponse.ok)
        throw new Error(
          "The printable materials could not be saved. Please retry.",
        );
      const printDocument = new DOMParser().parseFromString(
        await printResponse.text(),
        "text/html",
      );
      const printResources = Array.from(
        printDocument.querySelectorAll("script[src], link[rel='stylesheet']"),
      ).map(
        (element) =>
          new URL(
            element.getAttribute("src") || element.getAttribute("href") || "",
            location.origin,
          ).href,
      );
      const resources = [
        ...performance.getEntriesByType("resource").map((r) => r.name),
        ...printResources,
      ];
      await new Promise<void>((resolve, reject) => {
        const channel = new MessageChannel();
        const timeout = window.setTimeout(
          () => reject(new Error("Offline saving timed out. Please retry.")),
          30000,
        );
        channel.port1.onmessage = (e) => {
          clearTimeout(timeout);
          if (e.data.ok) resolve();
          else
            reject(
              new Error(
                "Some lesson files could not be saved. Please reconnect and retry.",
              ),
            );
        };
        worker.postMessage(
          {
            type: "SAVE_LESSON",
            urls: [
              location.origin + GAUSS_PATH,
              location.origin + GAUSS_PATH + "/print",
              ...resources,
            ],
          },
          [channel.port2],
        );
      });
      setOffline("ready");
      setOfflineMessage(
        "Lesson saved on this browser for offline use. Keep this exact lesson URL bookmarked.",
      );
    } catch (error) {
      setOffline("error");
      setOfflineMessage(
        error instanceof Error
          ? error.message
          : "Offline saving was not available.",
      );
    }
  }

  function reset() {
    setLessonKey((k) => k + 1);
    setRemaining(gaussStages.map((s) => s.minutes * 60));
    setRunning(false);
    navigate(0);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`ap-lab ${presentation ? "ap-presentation" : ""}`}
        data-theme={theme}
      >
        <a className="ap-skip" href="#lesson-content">
          Skip to lesson
        </a>
        <header className="ap-topbar">
          <Link className="ap-brand" href="/" aria-label="Aishwaryam Lab home">
            <FlaskConical size={24} />
            <span>
              AISHWARYAM <b>LAB</b>
            </span>
          </Link>
          <span className="ap-course">
            Class X <i /> Mathematics <i /> NCERT
          </span>
          <div className="ap-tools">
            <Link
              className="ap-icon"
              title="Printable TLM"
              aria-label="Printable TLM"
              href={`${GAUSS_PATH}/print`}
              target="_blank"
            >
              <Printer size={20} />
            </Link>
            <button
              className="ap-icon"
              title="Teacher notes"
              aria-label="Teacher notes"
              aria-pressed={notes}
              onClick={() => {
                setNotes(!notes);
                if (!notes) setPresentation(false);
              }}
            >
              <BookOpen size={20} />
            </button>
            <button
              className="ap-icon"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
              onClick={() => {
                const next = theme === "dark" ? "light" : "dark";
                setTheme(next);
                try {
                  localStorage.setItem("gauss-lab-theme", next);
                } catch {}
              }}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="ap-icon"
              title={
                presentation || fullscreen
                  ? "Exit presentation (F)"
                  : "Presentation mode (F)"
              }
              aria-label={
                presentation || fullscreen
                  ? "Exit presentation"
                  : "Presentation mode"
              }
              onClick={() => {
                if (presentation && !fullscreen) setPresentation(false);
                else void toggleFullscreen();
              }}
            >
              {presentation || fullscreen ? (
                <Minimize size={20} />
              ) : (
                <Maximize size={20} />
              )}
            </button>
          </div>
        </header>
        <div className="ap-workspace">
          <aside className="ap-sidebar">
            <div className="ap-sidebar-title">
              <span>THE GAUSS LAB</span>
              <p>
                From patterns
                <br />
                to a powerful formula.
              </p>
            </div>
            <nav aria-label="Lesson stages">
              {gaussStages.map((item, i) => (
                <button
                  key={item.short}
                  aria-label={`0${i + 1} ${item.short}`}
                  title={item.title}
                  className={stage === i ? "active" : ""}
                  aria-current={stage === i ? "step" : undefined}
                  onClick={() => navigate(i)}
                >
                  <span className="ap-nav-number">0{i + 1}</span>
                  <span>
                    {item.short}
                    <small>{item.minutes} min</small>
                  </span>
                  {stage === i && <span className="ap-active-mark" />}
                </button>
              ))}
            </nav>
            <div className="ap-lesson-meta">
              <p>35 MINUTE DISCOVERY</p>
              <span>Arithmetic Progressions</span>
              <span>Aishwaryam Singh Tomar</span>
              <small>23SD11002</small>
            </div>
          </aside>
          <main ref={main} className="ap-main" id="lesson-content">
            <div className="ap-stage-top" ref={heading} tabIndex={-1}>
              <span>Arithmetic progressions / Sum of n terms</span>
              <span>STAGE 0{stage + 1} OF 07</span>
            </div>
            <div key={lessonKey} className="ap-stage-content">
              <section aria-label="The mystery" hidden={stage !== 0}>
                <MysteryStage active={stage === 0} onNext={() => navigate(1)} />
              </section>
              <section aria-label="Card experiment" hidden={stage !== 1}>
                <CardStage />
              </section>
              <section aria-label="Gauss challenge" hidden={stage !== 2}>
                <GaussSumStage />
              </section>
              <section aria-label="Formula discovery" hidden={stage !== 3}>
                <FormulaStage />
              </section>
              <section aria-label="Savings application" hidden={stage !== 4}>
                <ApplyStage />
              </section>
              <section aria-label="Quick challenge" hidden={stage !== 5}>
                <ChallengeStage />
              </section>
              <section
                aria-label="Conclusion and exit ticket"
                hidden={stage !== 6}
              >
                <ExitStage onReset={reset} />
              </section>
            </div>
            {offlineMessage && (
              <p className="ap-offline-status" role="status">
                {offlineMessage}
              </p>
            )}
          </main>
          {notes && (
            <aside className="ap-notes" aria-label="Teacher notes panel">
              <div>
                <h2>Teacher notes</h2>
                <button
                  className="ap-icon"
                  title="Hide teacher notes"
                  aria-label="Hide teacher notes"
                  onClick={() => setNotes(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <p className="ap-kicker">
                Stage {stage + 1} · {gaussStages[stage].minutes} minutes
              </p>
              <h3>{gaussStages[stage].question}</h3>
              <ul>
                {gaussStages[stage].notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              <p className="ap-notes-warning">
                Close this panel before projecting. Presentation mode closes it
                automatically.
              </p>
              <div className="ap-notes-shortcuts">
                <p>Keyboard</p>
                <span>← / P · Previous</span>
                <span>→ / N · Next</span>
                <span>Space · Timer</span>
                <span>F · Fullscreen</span>
                <span>Enter / Space · Activate focused control</span>
              </div>
              <button
                className="ap-button ap-secondary"
                onClick={saveOffline}
                disabled={offline === "saving"}
              >
                {offline === "ready" ? (
                  <Check size={18} />
                ) : (
                  <Download size={18} />
                )}
                {offline === "saving"
                  ? "Saving lesson…"
                  : offline === "ready"
                    ? "Save offline again"
                    : "Save lesson offline"}
              </button>
            </aside>
          )}
        </div>
        <footer className="ap-bottom-bar">
          <div className="ap-stage-timer">
            <span>
              {gaussStages[stage].title}
              <small>{gaussStages[stage].minutes}-minute stage</small>
            </span>
            <strong
              aria-live="off"
              className={remaining[stage] === 0 ? "time-ended" : ""}
            >
              {clock(remaining[stage])}
            </strong>
            <button
              className="ap-icon"
              title={
                running
                  ? "Pause stage timer (Space)"
                  : "Start stage timer (Space)"
              }
              aria-label={running ? "Pause stage timer" : "Start stage timer"}
              onClick={() => setRunning(!running)}
            >
              {running ? <Pause size={19} /> : <Play size={19} />}
            </button>
            <button
              className="ap-icon"
              title="Reset stage timer"
              aria-label="Reset stage timer"
              onClick={() => {
                setRemaining((s) =>
                  s.map((value, i) =>
                    i === stage ? gaussStages[stage].minutes * 60 : value,
                  ),
                );
                setRunning(false);
              }}
            >
              <RotateCcw size={18} />
            </button>
          </div>
          <div className="ap-footer-nav">
            <button
              className="ap-icon"
              title="Previous stage (P)"
              aria-label="Previous stage"
              disabled={stage === 0}
              onClick={() => navigate(stage - 1)}
            >
              <ArrowLeft size={21} />
            </button>
            <span>
              {stage + 1}
              <i> / 7</i>
            </span>
            <button
              className="ap-button"
              disabled={stage === 6}
              onClick={() => navigate(stage + 1)}
            >
              Next stage
              <ArrowRight size={19} />
            </button>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
