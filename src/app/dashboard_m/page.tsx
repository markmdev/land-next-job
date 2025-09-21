"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type {
  WorkflowProgressSnapshot,
  WorkflowStepSnapshot,
} from "@/lib/workflow-progress";
import { WORKFLOW_STEP_ORDER } from "@/lib/workflow-progress";

import { DashboardSidebar } from "./_components/sidebar";
import { ProgressDrawer, type WorkflowStep } from "./_components/progress-drawer";

const SAMPLE_RESUME = `MARK MORGAN\nSan Jose, CA | markmdev.com\n\nSUMMARY\nFull-stack engineer focused on building resilient web applications across the stack.\n\nEXPERIENCE\nVolunteer Developer — Mokse Educational Services\n• Built AI-driven data processing pipeline with Next.js, Node.js, PostgreSQL\n• Reduced manual work by automating normalization jobs with BullMQ + Redis\n\nPROJECTS\nLingput — AI Language Coach\n• Improved response latency 85% via caching, CI/CD, and observability improvements.\n`;

const SAMPLE_JOB_POSTING = `Microsoft Software Engineering Internship — Mountain View\n\nRequirements:\n• Enrolled in BS/MS Computer Science with 1 semester remaining after internship\n• 1+ year programming in an object-oriented language\n• Experience with modern frontend (React/TypeScript) and backend services\n• Familiarity with API design, microservices, CI/CD, containers, observability\n\nPreferred:\n• Experience with C#, Java, C++, Golang, or Kotlin\n• Knowledge of accessibility, data structures & algorithms, and collaboration with stakeholders`;

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

export default function DashboardPage() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [jobPostingText, setJobPostingText] = useState(SAMPLE_JOB_POSTING);
  const [runId, setRunId] = useState<string | null>(null);
  const [progressSnapshot, setProgressSnapshot] = useState<WorkflowProgressSnapshot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isRunActive = progressSnapshot ? ["queued", "running"].includes(progressSnapshot.status) : false;

  const overallProgress = progressSnapshot?.overallProgress ?? 0;
  const drawerSteps = useMemo(() => mapSteps(progressSnapshot ?? undefined), [progressSnapshot]);
  const statusLabel = progressSnapshot
    ? `Run status: ${RUN_STATUS_LABEL[progressSnapshot.status]}`
    : "Run status: Idle";

  const latestScore = progressSnapshot?.latestEvaluation?.score ?? "—";

  const handleLoadMaster = useCallback(() => {
    setResumeText(SAMPLE_RESUME);
  }, []);

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

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 px-6 py-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Job hunt control room</p>
                <p className="text-xs text-slate-400">
                  Paste your resume and the job posting, then launch the tailoring run.
                </p>
                {errorMessage ? (
                  <p className="text-xs text-rose-300">{errorMessage}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-cyan-400/80 text-slate-950">Target score ≥ 85</Badge>
                <Badge variant="outline" className="border-white/20 text-slate-300">
                  Latest score: {latestScore}
                </Badge>
                {progressSnapshot ? (
                  <Badge variant="outline" className="border-white/20 text-slate-300">
                    {RUN_STATUS_LABEL[progressSnapshot.status]}
                  </Badge>
                ) : null}
              </div>
            </header>

            <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
              <Card className="flex h-full flex-col overflow-hidden border-white/10 bg-white/5">
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
                  <p className="text-xs text-slate-400">Keep the resume concise—scroll inside the editor as needed.</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4">
                  <Textarea
                    value={resumeText}
                    onChange={(event) => setResumeText(event.target.value)}
                    className="h-full min-h-0 resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{runId ? `Run ${runId.slice(0, 8)}…` : "Ready for tailoring"}</span>
                    <button type="button" className="text-cyan-300 hover:text-cyan-200" onClick={handleClearResume}>
                      Clear
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex h-full flex-col overflow-hidden border-white/10 bg-white/5">
                <CardHeader className="shrink-0 space-y-1 p-4 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-white">Job posting</CardTitle>
                    <Button
                      variant="ghost"
                      className="h-7 rounded-full border border-white/10 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10"
                      onClick={handlePastePosting}
                    >
                      Paste from clipboard
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400">Provide the full listing so the evaluator can mirror its language.</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4">
                  <Textarea
                    value={jobPostingText}
                    onChange={(event) => setJobPostingText(event.target.value)}
                    className="h-full min-h-0 resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {progressSnapshot?.latestEvaluation
                        ? `Current score: ${progressSnapshot.latestEvaluation.score}`
                        : "Detected keywords: React, TypeScript, Microservices"}
                    </span>
                    <span className="text-cyan-300">&nbsp;</span>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
        <ProgressDrawer
          steps={drawerSteps}
          overallProgress={overallProgress}
          statusLabel={statusLabel}
          onStart={handleStart}
          isRunning={isRunActive || isSubmitting}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
