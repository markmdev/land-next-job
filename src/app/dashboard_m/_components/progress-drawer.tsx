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
}

const STATUS_COLORS: Record<WorkflowStepStatus, string> = {
  completed: "bg-emerald-400",
  active: "bg-amber-400",
  pending: "bg-slate-600",
};

const STATUS_LABELS: Record<WorkflowStepStatus, string> = {
  completed: "Completed",
  active: "In progress",
  pending: "Queued",
};

export function ProgressDrawer({ steps, overallProgress }: ProgressDrawerProps) {
  return (
    <div className="border-t border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
              <span>Workflow status</span>
              <span className="text-sm font-semibold text-white normal-case tracking-normal">
                {overallProgress}% complete
              </span>
            </div>
            <Progress value={overallProgress} />
          </div>
          <Button className="h-10 rounded-full bg-cyan-400/90 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Start tailoring run
          </Button>
        </div>
        <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[step.status]}`}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-white">{step.label}</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  {STATUS_LABELS[step.status]}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
