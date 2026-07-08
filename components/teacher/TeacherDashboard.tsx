"use client";

import { Fragment, useMemo, useState, type FormEvent } from "react";
import { Download, Eye, LockKeyhole, RefreshCcw, Search, ShieldCheck } from "lucide-react";
import { LabShell } from "@/components/ui/LabShell";
import { SmartButton } from "@/components/ui/SmartButton";
import { cn } from "@/lib/cn";

type TeacherResult = {
  id?: number;
  roll_number: string;
  student_name: string;
  score: number;
  total_possible: number;
  answers?: unknown;
  started_at?: string | null;
  submitted_at: string;
};

export function TeacherDashboard() {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [results, setResults] = useState<TeacherResult[]>([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_RESULTS_API_BASE?.replace(/\/+$/, "") ?? "";

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return results;
    }

    return results.filter((result) => {
      return (
        result.student_name.toLowerCase().includes(query) ||
        result.roll_number.toLowerCase().includes(query)
      );
    });
  }, [results, search]);

  async function fetchResults(nextPin = pin) {
    if (!apiBase) {
      setError("Missing NEXT_PUBLIC_RESULTS_API_BASE. Set it to the Hostinger API folder URL.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBase}/teacher-results.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ pin: nextPin })
      });

      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Incorrect PIN.");
      }

      if (!response.ok) {
        throw new Error("Could not load teacher results.");
      }

      const data = (await response.json()) as { results?: TeacherResult[] };
      setResults(data.results ?? []);
      setAuthenticated(true);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Could not load teacher results.");
    } finally {
      setIsLoading(false);
    }
  }

  async function exportCsv() {
    if (!apiBase) {
      setError("Missing NEXT_PUBLIC_RESULTS_API_BASE. Set it to the Hostinger API folder URL.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBase}/export.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ pin })
      });

      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Incorrect PIN.");
      }

      if (!response.ok) {
        throw new Error("Could not export CSV.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "triangle-game-results.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Could not export CSV.");
    } finally {
      setIsLoading(false);
    }
  }

  function submitPin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void fetchResults(pin);
  }

  return (
    <LabShell>
      <section className="flex flex-1 flex-col gap-4 py-4">
        <div className="glass-panel rounded-xl p-5 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold uppercase text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                Teacher console
              </div>
              <h1 className="text-4xl font-black sm:text-5xl">Project Thales Results</h1>
              <p className="mt-3 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Enter the teacher PIN to load submitted student marks from the Hostinger PHP API.
              </p>
            </div>
          </div>
        </div>

        {!authenticated ? (
          <form
            className="glass-panel mx-auto w-full max-w-xl rounded-xl p-5 sm:p-7"
            onSubmit={submitPin}
          >
            <label className="block">
              <span className="mb-2 block text-sm font-bold uppercase text-slate-400">
                Teacher PIN
              </span>
              <input
                className="min-h-14 w-full rounded-lg border border-slate-500/40 bg-slate-950/70 px-4 text-lg font-bold text-white placeholder:text-slate-500"
                value={pin}
                type="password"
                autoComplete="off"
                placeholder="Enter PIN"
                onChange={(event) => setPin(event.target.value)}
              />
            </label>
            {error ? (
              <p className="mt-4 rounded-lg border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-sm font-semibold text-rose-100">
                {error}
              </p>
            ) : null}
            <SmartButton
              className="mt-5 w-full"
              type="submit"
              icon={<LockKeyhole className="h-6 w-6" />}
              disabled={!pin || isLoading}
            >
              {isLoading ? "Checking..." : "Unlock Results"}
            </SmartButton>
          </form>
        ) : (
          <div className="glass-panel rounded-xl p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-200" />
                <input
                  className="min-h-14 w-full rounded-lg border border-slate-500/40 bg-slate-950/70 py-3 pl-12 pr-4 text-lg font-bold text-white placeholder:text-slate-500"
                  value={search}
                  placeholder="Search by name or roll number"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
                <SmartButton
                  variant="secondary"
                  size="md"
                  icon={<RefreshCcw className="h-5 w-5" />}
                  disabled={isLoading}
                  onClick={() => void fetchResults()}
                >
                  Refresh
                </SmartButton>
                <SmartButton
                  size="md"
                  icon={<Download className="h-5 w-5" />}
                  disabled={isLoading}
                  onClick={() => void exportCsv()}
                >
                  CSV Export
                </SmartButton>
              </div>
            </div>

            {error ? (
              <p className="mb-4 rounded-lg border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-sm font-semibold text-rose-100">
                {error}
              </p>
            ) : null}

            <div className="overflow-x-auto rounded-xl border border-slate-600/35">
              <table className="min-w-full border-collapse text-left">
                <thead className="bg-slate-950/80 text-sm uppercase text-cyan-200">
                  <tr>
                    <th className="px-4 py-3">Roll number</th>
                    <th className="px-4 py-3">Student name</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Total possible</th>
                    <th className="px-4 py-3">Submitted time</th>
                    <th className="px-4 py-3">Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, index) => {
                    const rowId = result.id ?? `${result.roll_number}-${result.submitted_at}`;
                    const expanded = expandedId === rowId;

                    return (
                      <Fragment key={rowId}>
                        <tr
                          className={cn(
                            "border-t border-slate-700/60 bg-slate-950/35 text-slate-100",
                            index % 2 === 0 && "bg-slate-900/35"
                          )}
                        >
                          <td className="px-4 py-3 font-mono">{result.roll_number}</td>
                          <td className="px-4 py-3 font-bold">{result.student_name}</td>
                          <td className="px-4 py-3 font-mono text-cyan-100">{result.score}</td>
                          <td className="px-4 py-3 font-mono">{result.total_possible}</td>
                          <td className="px-4 py-3 text-sm">{formatDateTime(result.submitted_at)}</td>
                          <td className="px-4 py-3">
                            <button
                              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/18"
                              onClick={() => setExpandedId(expanded ? null : rowId)}
                            >
                              <Eye className="h-4 w-4" />
                              {expanded ? "Hide" : "View"}
                            </button>
                          </td>
                        </tr>
                        {expanded ? (
                          <tr className="border-t border-slate-700/60 bg-slate-950/70">
                            <td colSpan={6} className="px-4 py-4">
                              <pre className="max-h-[420px] overflow-auto rounded-lg border border-cyan-300/20 bg-slate-950 p-4 text-xs leading-6 text-cyan-50">
                                {JSON.stringify(result.answers ?? {}, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        No submitted results found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </LabShell>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}
