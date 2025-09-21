"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { WorkflowProgressSnapshot, WorkflowStepSnapshot } from "@/lib/workflow-progress";
import { WORKFLOW_STEP_ORDER } from "@/lib/workflow-progress";

import { DashboardSidebar } from "./_components/sidebar";
import { ProgressDrawer, type WorkflowStep } from "./_components/progress-drawer";

const RUN_STATUS_LABEL: Record<WorkflowProgressSnapshot["status"], string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

const POLL_INTERVAL_MS = 2000;

function mapSteps(snapshot?: WorkflowProgressSnapshot): WorkflowStep[] {
  const baseSteps: WorkflowStepSnapshot[] = snapshot?.steps ?? WORKFLOW_STEP_ORDER;

  return baseSteps.map((step) => {
    const description = step.description
      ? String(step.description)
      : step.status === "completed"
      ? "Completed"
      : step.status === "active"
      ? "Processing"
      : "Waiting";

    return {
      id: step.id,
      label: step.label,
      status: step.status,
      description,
    } satisfies WorkflowStep;
  });
}

function getScoreMeta(score: number | null | undefined) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return null;
  }

  if (score >= 80) {
    return {
      label: "Great fit",
      badgeClass: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
    } as const;
  }

  if (score >= 60) {
    return {
      label: "Moderate fit",
      badgeClass: "bg-amber-400/15 text-amber-200 border border-amber-300/40",
    } as const;
  }

  return {
    label: "No chances",
    badgeClass: "bg-rose-500/15 text-rose-200 border border-rose-400/40",
  } as const;
}

interface DashboardClientProps {
  initialResume: string;
  initialJobPosting: string;
}

export function DashboardClient({ initialResume, initialJobPosting }: DashboardClientProps) {
  const [resumeText, setResumeText] = useState(initialResume);
  const [jobPostingText, setJobPostingText] = useState(initialJobPosting);
  const [runId, setRunId] = useState<string | null>(null);
  const [progressSnapshot, setProgressSnapshot] = useState<WorkflowProgressSnapshot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAdjustedResume, setShowAdjustedResume] = useState(false);

  const isRunActive = progressSnapshot
    ? ["queued", "running"].includes(progressSnapshot.status)
    : false;

  const overallProgress = progressSnapshot?.overallProgress ?? 0;
  const drawerSteps = useMemo(() => mapSteps(progressSnapshot ?? undefined), [progressSnapshot]);
  const statusLabel = progressSnapshot
    ? `Run status: ${RUN_STATUS_LABEL[progressSnapshot.status]}`
    : "Run status: Idle";

  const latestScore = progressSnapshot?.latestEvaluation?.score ?? null;
  const latestWriterOutput = progressSnapshot?.latestWriterOutput ?? null;

  const handleLoadMaster = useCallback(() => {
    setResumeText(initialResume);
  }, [initialResume]);

  const handleClearResume = useCallback(() => {
    setResumeText("");
  }, []);

  const handlePastePosting = useCallback(async () => {
    if (!navigator.clipboard) {
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setJobPostingText(text);
      }
    } catch (error) {
      console.error("Failed to read clipboard", error);
    }
  }, []);

  const handleCopyAdjustedResume = useCallback(async () => {
    if (!latestWriterOutput || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(latestWriterOutput.rewritten_resume);
    } catch (error) {
      console.error("Failed to copy adjusted resume", error);
    }
  }, [latestWriterOutput]);

  const toggleAdjustedView = useCallback(() => {
    if (!latestWriterOutput) {
      return;
    }
    setShowAdjustedResume((prev) => !prev);
  }, [latestWriterOutput]);

  const handleStart = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/dashboard/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobPosting: jobPostingText,
          resume: resumeText,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to start run");
      }

      const data = (await response.json()) as {
        runId: string;
        snapshot: WorkflowProgressSnapshot | null;
      };

      setRunId(data.runId);
      setProgressSnapshot(data.snapshot ?? null);
      setShowAdjustedResume(false);
    } catch (error) {
      console.error("Failed to enqueue tailoring run", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to start tailoring run");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, jobPostingText, resumeText]);

  useEffect(() => {
    if (!runId) {
      return;
    }

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      try {
        const response = await fetch(`/api/dashboard/progress/${runId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch progress");
        }

        const snapshot = (await response.json()) as WorkflowProgressSnapshot;
        if (!cancelled) {
          setProgressSnapshot(snapshot);

          if (snapshot.status === "completed" || snapshot.status === "failed") {
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Progress polling error", error);
        }
      }
    };

    poll();
    intervalId = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [runId]);

  useEffect(() => {
    if (!latestWriterOutput) {
      setShowAdjustedResume(false);
    }
  }, [latestWriterOutput]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      <DashboardSidebar />
      <main className="flex flex-1 flex-col overflow-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-6 py-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Job hunt control room</p>
              <p className="text-xs text-slate-400">
                Paste your resume and the job posting, then launch the tailoring run.
              </p>
              {errorMessage ? <p className="text-xs text-rose-300">{errorMessage}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <Badge className="bg-cyan-400/80 text-slate-950">Target score ≥ 80</Badge>
              <Badge variant="outline" className="border-white/20 text-slate-300">
                Latest score: {latestScore ?? "—"}
              </Badge>
              {typeof latestScore === "number" ? (
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
                    getScoreMeta(latestScore)?.badgeClass ?? "border border-white/20"
                  }`}
                >
                  {getScoreMeta(latestScore)?.label}
                </span>
              ) : null}
              {progressSnapshot ? (
                <Badge variant="outline" className="border-white/20 text-slate-300">
                  {RUN_STATUS_LABEL[progressSnapshot.status]}
                </Badge>
              ) : null}
            </div>
          </header>

          <ProgressDrawer
            steps={drawerSteps}
            overallProgress={overallProgress}
            statusLabel={statusLabel}
            onStart={handleStart}
            isRunning={isRunActive || isSubmitting}
            disabled={isSubmitting}
          />

          <WriterInsights
            implementationNotes={latestWriterOutput?.implementation_notes ?? []}
            unaddressedItems={latestWriterOutput?.unaddressed_items ?? []}
          />

          <section className="grid flex-1 min-h-0 gap-4 overflow-hidden lg:grid-cols-2">
            <Card className="flex min-h-0 flex-col overflow-hidden border-white/10 bg-white/5">
              <CardHeader className="shrink-0 space-y-1 p-4 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white">Current resume</CardTitle>
                  <Button
                    variant="ghost"
                    className="h-7 rounded-full border border-white/10 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    onClick={handleLoadMaster}
                  >
                    Load master copy
                  </Button>
                </div>
                <p className="text-xs text-slate-400">
                  Keep the resume concise—scroll inside the editor as needed.
                </p>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
                <Textarea
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  className="flex-1 min-h-[500px] resize-none"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{runId ? `Run ${runId.slice(0, 8)}…` : "Ready for tailoring"}</span>
                  <button
                    type="button"
                    className="text-cyan-300 hover:text-cyan-200"
                    onClick={handleClearResume}
                  >
                    Clear
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex min-h-0 flex-col overflow-hidden border-white/10 bg-white/5">
              <CardHeader className="shrink-0 space-y-2 p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base text-white">
                      {showAdjustedResume ? "Adjusted resume" : "Job posting"}
                    </CardTitle>
                    <p className="text-xs text-slate-400">
                      {showAdjustedResume
                        ? "Latest rewrite generated by the professional resume writer."
                        : "Provide the full listing so the evaluator can mirror its language."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className={latestWriterOutput ? "text-slate-300" : "text-slate-500"}>
                      Adjusted view
                    </span>
                    <Switch
                      checked={showAdjustedResume}
                      onClick={toggleAdjustedView}
                      disabled={!latestWriterOutput}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
                <Textarea
                  value={
                    showAdjustedResume && latestWriterOutput
                      ? latestWriterOutput.rewritten_resume
                      : jobPostingText
                  }
                  onChange={(event) => {
                    if (!showAdjustedResume) {
                      setJobPostingText(event.target.value);
                    }
                  }}
                  className="flex-1 min-h-[500px] resize-none"
                  readOnly={showAdjustedResume && !!latestWriterOutput}
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  {progressSnapshot?.latestEvaluation ? (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">
                        Current score: {progressSnapshot.latestEvaluation.score}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                          getScoreMeta(progressSnapshot.latestEvaluation.score)?.badgeClass ?? ""
                        }`}
                      >
                        {getScoreMeta(progressSnapshot.latestEvaluation.score)?.label}
                      </span>
                    </div>
                  ) : (
                    <span>Detected keywords: React, TypeScript, Microservices</span>
                  )}
                  <span className="text-cyan-300">&nbsp;</span>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

interface WriterInsightsProps {
  implementationNotes: string[];
  unaddressedItems: string[];
}

function WriterInsights({ implementationNotes, unaddressedItems }: WriterInsightsProps) {
  const [expanded, setExpanded] = useState(false);
  const hasContent = implementationNotes.length > 0 || unaddressedItems.length > 0;
  const needsExpansion = implementationNotes.length > 2 || unaddressedItems.length > 2;

  const displayedImplementation = expanded ? implementationNotes : implementationNotes.slice(0, 2);
  const displayedUnaddressed = expanded ? unaddressedItems : unaddressedItems.slice(0, 2);

  return (
    <Card className="shrink-0 border-white/10 bg-white/5">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-base text-white">Writer insights</CardTitle>
        <p className="text-xs text-slate-400">
          {hasContent
            ? "Review what changed and what's still missing after the rewrite."
            : "Once the writer finishes, implementation notes and remaining gaps will appear here."}
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {hasContent ? (
          <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-2">
            <WriterInsightsList title="Implementation notes" items={displayedImplementation} />
            <WriterInsightsList
              title="Unaddressed items"
              items={displayedUnaddressed}
              variant="danger"
            />
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Waiting for the professional writer to complete this run.
          </p>
        )}
        {hasContent && needsExpansion ? (
          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full border border-white/10 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

interface WriterInsightsListProps {
  title: string;
  items: string[];
  variant?: "default" | "danger";
}

function WriterInsightsList({ title, items, variant = "default" }: WriterInsightsListProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{title}</p>
      {items.length === 0 ? (
        <p className="text-[11px] text-slate-500">None yet</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li
              key={item}
              className={
                variant === "danger"
                  ? "rounded-lg bg-rose-500/15 px-3 py-2 text-[11px] text-rose-200"
                  : "rounded-lg bg-white/8 px-3 py-2 text-[11px] text-slate-200"
              }
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
