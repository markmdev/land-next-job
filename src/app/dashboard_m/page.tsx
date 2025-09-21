import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { DashboardSidebar } from "./_components/sidebar";
import { ProgressDrawer, type WorkflowStep } from "./_components/progress-drawer";

const SAMPLE_RESUME = `MARK MORGAN\nSan Jose, CA | markmdev.com\n\nSUMMARY\nFull-stack engineer focused on building resilient web applications across the stack.\n\nEXPERIENCE\nVolunteer Developer — Mokse Educational Services\n• Built AI-driven data processing pipeline with Next.js, Node.js, PostgreSQL\n• Reduced manual work by automating normalization jobs with BullMQ + Redis\n\nPROJECTS\nLingput — AI Language Coach\n• Improved response latency 85% via caching, CI/CD, and observability improvements.\n`;

const SAMPLE_JOB_POSTING = `Microsoft Software Engineering Internship — Mountain View\n\nRequirements:\n• Enrolled in BS/MS Computer Science with 1 semester remaining after internship\n• 1+ year programming in an object-oriented language\n• Experience with modern frontend (React/TypeScript) and backend services\n• Familiarity with API design, microservices, CI/CD, containers, observability\n\nPreferred:\n• Experience with C#, Java, C++, Golang, or Kotlin\n• Knowledge of accessibility, data structures & algorithms, and collaboration with stakeholders`;

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "evaluation",
    label: "ATS Evaluation",
    description: "Initial score 72 / target 85+",
    status: "completed",
  },
  {
    id: "advisor",
    label: "Tailoring Plan",
    description: "18 recommendations queued",
    status: "active",
  },
  {
    id: "writer",
    label: "Writer Draft",
    description: "Generating rewrite",
    status: "pending",
  },
  {
    id: "reevaluation",
    label: "Final Check",
    description: "Awaiting new score",
    status: "pending",
  },
];

const OVERALL_PROGRESS = 46;

export default function DashboardPage() {
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
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-cyan-400/80 text-slate-950">Target score ≥ 85</Badge>
                <Badge variant="outline" className="border-white/20 text-slate-300">
                  Active job: Microsoft SWE Internship
                </Badge>
              </div>
            </header>

            <section className="grid flex-1 min-h-0 gap-4 lg:grid-cols-2">
              <Card className="flex h-full flex-col overflow-hidden border-white/10 bg-white/5">
                <CardHeader className="shrink-0 space-y-1 p-4 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-white">Current resume</CardTitle>
                    <Button
                      variant="ghost"
                      className="h-7 rounded-full border border-white/10 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Load master copy
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400">Keep the resume concise—scroll inside the editor as needed.</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4">
                  <Textarea
                    defaultValue={SAMPLE_RESUME}
                    className="h-full min-h-0 resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Autosaved 3 min ago</span>
                    <button type="button" className="text-cyan-300 hover:text-cyan-200">
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
                    >
                      Paste from clipboard
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400">Provide the full listing so the evaluator can mirror its language.</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4">
                  <Textarea
                    defaultValue={SAMPLE_JOB_POSTING}
                    className="h-full min-h-0 resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Detected keywords: React, TypeScript, Microservices</span>
                    <button type="button" className="text-cyan-300 hover:text-cyan-200">
                      View parser logs
                    </button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
        <ProgressDrawer steps={WORKFLOW_STEPS} overallProgress={OVERALL_PROGRESS} />
      </div>
    </div>
  );
}
