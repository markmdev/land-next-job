"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

export function ProgressDrawer({ steps, overallProgress }: ProgressDrawerProps) {
  return (
    <div className="border-t border-white/10 bg-slate-950/85 px-6 py-5 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Workflow progress
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                {steps.map((step) => (
                  <span key={step.id} className="flex items-center gap-1">
                    <Badge
                      variant={
                        step.status === "completed"
                          ? "success"
                          : step.status === "active"
                            ? "warning"
                            : "outline"
                      }
                      className={cn(
                        step.status === "completed" && "bg-emerald-400/90 text-emerald-950",
                        step.status === "active" && "bg-amber-400/90 text-amber-950",
                        step.status === "pending" && "border-slate-600/70", 
                      )}
                    >
                      {step.label}
                    </Badge>
                  </span>
                ))}
              </div>
            </div>
            <span className="text-sm font-semibold text-white">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="mt-3" />
        </div>
        <div className="flex w-full flex-col gap-2 text-xs text-slate-400 lg:max-w-xs">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
              <div>
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="text-[11px] text-slate-400">{step.description}</p>
              </div>
              <Badge
                variant={
                  step.status === "completed"
                    ? "success"
                    : step.status === "active"
                      ? "warning"
                      : "outline"
                }
              >
                {step.status === "completed"
                  ? "Done"
                  : step.status === "active"
                    ? "Running"
                    : "Queued"}
              </Badge>
            </div>
          ))}
        </div>
        <Button className="h-12 rounded-full bg-cyan-400/90 px-6 text-base font-semibold text-slate-950 transition hover:bg-cyan-300">
          Start tailoring run
        </Button>
      </div>
    </div>
  );
}
