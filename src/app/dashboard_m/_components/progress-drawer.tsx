"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type WorkflowStepStatus = "completed" | "active" | "pending";

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  status: WorkflowStepStatus;
}

interface ProgressDrawerProps {
  steps: WorkflowStep[];
  overallProgress: number;
  onStart?: () => void;
  isRunning?: boolean;
  disabled?: boolean;
  statusLabel?: string;
}

const STATUS_COLORS: Record<WorkflowStepStatus, string> = {
  completed: "bg-emerald-400",
  active: "bg-amber-300",
  pending: "bg-slate-600",
};

const STATUS_LABELS: Record<WorkflowStepStatus, string> = {
  completed: "Completed",
  active: "In progress",
  pending: "Queued",
};

export function ProgressDrawer({
  steps,
  overallProgress,
  onStart,
  isRunning,
  disabled,
  statusLabel,
}: ProgressDrawerProps) {
  return (
    <div className="border-t border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
              <span>{statusLabel ?? "Workflow status"}</span>
              <span className="text-lg font-semibold text-white normal-case tracking-normal">
                {overallProgress}% complete
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 overflow-hidden rounded-full border border-cyan-400/30 bg-slate-900/80 p-1 shadow-inner shadow-cyan-500/20">
                <Progress value={overallProgress} className="h-2" />
              </div>
              <div className="hidden min-w-[170px] rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-center text-[11px] font-semibold text-cyan-200 sm:block">
                Stage: {statusLabel?.replace("Run status:", "").trim() ?? "Idle"}
              </div>
            </div>
          </div>
          <Button
            className="h-11 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 px-6 text-base font-semibold text-slate-950 shadow-[0_15px_40px_-18px_rgba(56,189,248,0.9)] transition hover:from-cyan-200 hover:via-sky-300 hover:to-blue-400 disabled:cursor-not-allowed"
            onClick={onStart}
            disabled={disabled || isRunning}
          >
            {isRunning ? "Running..." : "Start tailoring run"}
          </Button>
        </div>
        <div className="grid gap-4 text-xs text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40 p-4 shadow-[0_18px_40px_-32px_rgba(56,189,248,1)]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${STATUS_COLORS[step.status]} shadow-[0_0_12px_rgba(56,189,248,0.6)]`}
                    aria-hidden
                  />
                  <span className="text-base font-semibold text-white tracking-wide uppercase">{step.label}</span>
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-200">
                  {STATUS_LABELS[step.status]}
                </span>
              </div>
              <div className="rounded-xl bg-white/10 px-3 py-3 text-base font-semibold text-cyan-200 shadow-inner shadow-cyan-500/10">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
