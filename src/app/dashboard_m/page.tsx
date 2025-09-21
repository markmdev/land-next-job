import Link from "next/link";

import type {
  ProfessionalResumeWriterOutput,
  ResumeEvaluationResult,
  TailoringAdvisorOutput,
} from "@/lib/agents";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { DashboardSidebar } from "./_components/sidebar";
import { ProgressDrawer, type WorkflowStep } from "./_components/progress-drawer";

const SAMPLE_RESUME = `MARK MORGAN\nSan Jose, CA | markmdev.com\n\nSUMMARY\nFull-stack engineer focused on building resilient web applications across the stack.\n\nEXPERIENCE\nVolunteer Developer — Mokse Educational Services\n• Built AI-driven data processing pipeline with Next.js, Node.js, PostgreSQL\n• Reduced manual work by automating normalization jobs with BullMQ + Redis\n\nPROJECTS\nLingput — AI Language Coach\n• Improved response latency 85% via caching, CI/CD, and observability improvements.\n`;

const SAMPLE_JOB_POSTING = `Microsoft Software Engineering Internship — Mountain View\n\nRequirements:\n• Enrolled in BS/MS Computer Science with 1 semester remaining after internship\n• 1+ year programming in an object-oriented language\n• Experience with modern frontend (React/TypeScript) and backend services\n• Familiarity with API design, microservices, CI/CD, containers, observability\n\nPreferred:\n• Experience with C#, Java, C++, Golang, or Kotlin\n• Knowledge of accessibility, data structures & algorithms, and collaboration with stakeholders`;

const MOCK_EVALUATION: ResumeEvaluationResult = {
  score: 72,
  matchTier: "moderate",
  overallSummary:
    "Solid full-stack alignment with strong React/Node/DevOps exposure. Missing explicit Microsoft-preferred backend languages, internship eligibility statement, and deeper observability/accessibility evidence.",
  highPriorityGaps: [
    "Clarify internship intent and remaining term in summary",
    "Explicitly reference C#, Java, Golang, Kotlin, or C++",
    "Add observability tools and accessibility keywords",
    "Strengthen algorithms/data structures evidence",
  ],
  atsKeywordAnalysis: {
    criticalMissing: [
      "C#",
      "Java",
      "Kotlin",
      "Microservices",
      "Accessibility",
      "Observability",
    ],
    shouldEmphasize: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "CI/CD",
      "Docker/Kubernetes",
    ],
    resumeOnlyTermsToDeprioritize: [
      "CrewAI",
      "LangGraph",
      "Astro",
      "LangChain",
    ],
  },
  sectionAdjustments: {
    summary: {
      add: [
        "Seeking Microsoft SWE Internship (Mountain View)",
        "Enrolled BSCS with term remaining",
        "Highlight React, Node.js, API design, CI/CD",
      ],
      remove: ["Immediate full-time availability"],
      notes: [
        "Lead with internship eligibility, core stack, and growth mindset keywords.",
      ],
    },
    skills: {
      add: ["Accessibility", "Observability dashboards"],
      remove: ["Niche AI agent frameworks"],
      reorder: [
        "Frontend: React, TypeScript, HTML/CSS",
        "Backend: Node.js, Express, PostgreSQL, Redis",
        "DevOps: Docker, Kubernetes, GitHub Actions",
        "Practices: OOP, DSA, Testing",
      ],
    },
    experience: [
      {
        identifier: "Volunteer Full-Stack Developer — Mokse",
        addOrRewrite: [
          "Quantify impact of automation",
          "Mention API design decisions",
          "Reference observability dashboards",
        ],
        deEmphasize: ["Generic AI phrasing"],
        keywordFocus: [
          "API design",
          "React/TypeScript",
          "CI/CD",
          "Stakeholder collaboration",
        ],
      },
      {
        identifier: "Lingput Project",
        addOrRewrite: [
          "Tie caching gains to reliability",
          "Mention queue-based concurrency",
        ],
        deEmphasize: ["Hosting provider details"],
        keywordFocus: ["Performance", "Reliability", "BullMQ"],
      },
    ],
  },
  formatWarnings: [
    "Ensure section headers remain ATS-friendly (all caps or bold)",
    "Use consistent bullet punctuation for accomplishments",
  ],
};

const MOCK_ADVISOR: TailoringAdvisorOutput = {
  job_posting_analysis: {
    company_values: [
      "Growth mindset",
      "Customer obsession",
      "Inclusive collaboration",
    ],
    must_have_requirements: [
      "Current CS enrollment",
      "1 semester remaining",
      "1+ year OOP experience",
    ],
    preferred_qualifications: [
      "C#/Java/C++ backend work",
      "Microservices/API design",
      "Observability instrumentation",
    ],
    key_technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Docker",
      "Kubernetes",
      "CI/CD",
    ],
    action_keywords: [
      "Collaborated",
      "Optimized",
      "Instrumented",
      "Designed",
    ],
  },
  resume_alignment: {
    strong_matches: [
      "Full-stack web apps with React/Next.js",
      "CI/CD pipelines via GitHub Actions",
      "Containers and cloud deployments",
    ],
    partial_matches: [
      "Microservices references without depth",
      "OOP experience implied via TypeScript",
    ],
    gaps: [
      "No explicit C#/Java/Golang examples",
      "Accessibility coverage limited",
    ],
    underleveraged_experience: [
      "Lingput concurrency improvements",
      "Volunteer stakeholder collaboration",
    ],
    risk_flags: [
      "Objective targets full-time role",
      "Over-index on AI agent tooling",
    ],
  },
  tailoring_recommendations: {
    summary_section: {
      keep: ["Full-stack impact"],
      de_emphasize: ["Full-time objective"],
      add_or_emphasize: [
        "Internship eligibility",
        "Growth mindset",
        "Collaboration",
      ],
      sample_language: [
        "CS undergrad seeking Microsoft SWE Internship; 1+ year shipping React/Node experiences that improve reliability and customer outcomes.",
      ],
    },
    skills_section: {
      reorder: [
        "Programming: TypeScript, JavaScript, Python",
        "Frontend: React, Next.js, HTML/CSS",
        "Backend: Node.js, Express, PostgreSQL, Redis",
        "DevOps: Docker, Kubernetes, CI/CD, Observability",
      ],
      add: ["Accessibility", "REST API design"],
      de_emphasize: ["CrewAI", "LangGraph"],
      grouping_suggestions: [
        "Collapse AI APIs into one line",
        "Group cloud platforms under a single bullet",
      ],
    },
    experience_sections: [
      {
        identifier: "Volunteer Full-Stack Developer — Mokse",
        keep: ["Stakeholder collaboration"],
        modify: [
          {
            current_focus: "Automation impact",
            recommended_focus: "Tie automation to API design and reliability",
            keyword_targets: ["API design", "Observability"],
          },
        ],
        add: ["Concrete metrics for time saved"],
        remove: ["Redundant AI tooling mentions"],
      },
      {
        identifier: "Lingput — AI Language Coach",
        keep: ["Performance optimization"],
        modify: [
          {
            current_focus: "Caching improvements",
            recommended_focus: "Relate caching to customer reliability",
            keyword_targets: ["Reliability", "Concurrency"],
          },
        ],
        add: ["Mention BullMQ queues explicitly"],
        remove: ["Hosting provider list"],
      },
    ],
    quick_wins: [
      "Add internship eligibility line to summary",
      "Spell out React instead of relying on Next.js",
      "List observability tooling under DevOps",
    ],
  },
  priority_actions: {
    critical: [
      "Update summary to internship targeting",
      "Introduce Microsoft-preferred backend language exposure",
    ],
    important: ["Highlight observability/A11y"],
    nice_to_have: ["Reduce AI tooling list length"],
  },
  keyword_check: {
    missing_keywords: ["C#", "Java", "Accessibility"],
    reinforce_keywords: ["React", "TypeScript", "Kubernetes"],
    format_notes: ["Consider ATS-safe bullet characters"],
  },
};

const MOCK_WRITER: ProfessionalResumeWriterOutput = {
  rewritten_resume: `MARK MORGAN\nSan Jose, CA | markmdev.com | linkedin.com/in/markmdev\n\nSUMMARY\nCS undergraduate (GPA 4.0) seeking Microsoft Software Engineering Internship in Mountain View with a remaining academic term. 1+ year delivering React/TypeScript frontends and Node.js services with PostgreSQL, Redis, and CI/CD pipelines. Collaborative engineer obsessed with reliable customer outcomes, observability, and rapid learning.\n\nCORE SKILLS\nProgramming: TypeScript, JavaScript, Python | Frontend: React, Next.js, HTML/CSS | Backend: Node.js, Express, PostgreSQL, Redis | DevOps: Docker, Kubernetes, GitHub Actions, Observability dashboards | Practices: OOP, Data Structures & Algorithms, Testing\n\nEXPERIENCE\nVolunteer Full-Stack Developer — Mokse Educational Services\n• Automated data normalization via BullMQ + Redis queues, cutting processing time from hours to minutes while improving data accuracy.\n• Designed REST APIs consumed by educators and instrumented dashboards/alerts to track ingestion health.\n• Partnered with stakeholders to capture requirements and iterate on features using React/TypeScript UI components.\n\nPROJECTS\nLingput — AI Language Coach\n• Implemented background job orchestration to stream feedback in real time, boosting engagement by 30%.\n• Reduced API latency 85% with caching and profiling; documented microservice boundaries and monitoring checks.\n• Deployed end-to-end CI/CD workflows across staging and production with GitHub Actions, Docker, and Kubernetes.\n\nHackathon — PMPanda AI Teammate\n• Architected an AI requirements assistant, generating PRDs 70% faster by combining Next.js, OpenAI APIs, and rigorous prompt instrumentation.\n• Led a four-person team emphasizing inclusive collaboration and rapid iteration.\n\nEDUCATION\nSouthern New Hampshire University — B.S. Computer Science, Graduation Oct 2026 (GPA 4.0).\n`,
  implementation_notes: [
    "Summary rewritten to target internship, include eligibility, and foreground ATS keywords.",
    "Skills regrouped to prioritize React/TypeScript, Node.js, and DevOps with observability.",
    "Experience bullets quantified impact and injected API design plus reliability language.",
  ],
  unaddressed_items: [
    "C#/Java/Golang experience still absent — cannot fabricate.",
    "Accessibility tooling not added due to missing evidence.",
  ],
  keyword_summary: {
    high_priority_keywords: [
      "React",
      "TypeScript",
      "Node.js",
      "CI/CD",
      "Kubernetes",
      "Observability",
    ],
    still_missing_keywords: ["C#", "Accessibility"],
  },
};

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "evaluation",
    label: "ATS Evaluation",
    description: "Score 72/100 — needs language coverage",
    status: "completed",
  },
  {
    id: "advisor",
    label: "Tailoring Plan",
    description: "18 actionable recommendations",
    status: "active",
  },
  {
    id: "writer",
    label: "Resume Rewrite",
    description: "Draft ready for review",
    status: "pending",
  },
  {
    id: "reevaluate",
    label: "Final ATS Check",
    description: "Target 85+ score",
    status: "pending",
  },
];

const MATCH_TIER_VARIANTS: Record<ResumeEvaluationResult["matchTier"], string> = {
  outstanding: "bg-emerald-400/90 text-emerald-950",
  strong: "bg-sky-400/90 text-sky-950",
  moderate: "bg-amber-400/90 text-amber-950",
  weak: "bg-rose-500/90 text-rose-50",
  poor: "bg-rose-700 text-rose-50",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-cyan-400/60 bg-cyan-400/10 text-cyan-200">
                    Dashboard
                  </Badge>
                  <Badge className="bg-purple-500/80 text-white">Hackathon build</Badge>
                  <Badge className="bg-white/10 text-slate-200">v0.4 preview</Badge>
                </div>
                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Orchestrate your resume tailoring runs from a single command center.
                </h1>
                <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                  Paste your latest resume, drop in the job posting, and watch our evaluator → advisor → writer agents iterate until you hit the target ATS score. Coming soon: live progress via Redis and real-time credit usage.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Latest run</p>
                <p className="text-3xl font-semibold text-white">72 / 100</p>
                <p className="text-xs text-slate-400">Microsoft SWE Internship • Updated 4 minutes ago</p>
                <Button variant="default" className="mt-2 w-full rounded-full bg-cyan-400/90 text-slate-950 hover:bg-cyan-300">
                  Export tailored resume
                </Button>
              </div>
            </header>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
              <div className="grid gap-6">
                <Card>
                  <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Current resume version</CardTitle>
                      <Button variant="ghost" className="h-8 rounded-full border border-white/10 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10">
                        Load master resume
                      </Button>
                    </div>
                    <CardDescription>
                      Paste the resume you want to tailor. We keep your master copy safe for future runs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea defaultValue={SAMPLE_RESUME} className="min-h-[260px]" />
                    <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400">
                      <span>Tokens ~1,240 • Last updated 2 min ago</span>
                      <Link href="#version-history" className="text-cyan-300 hover:text-cyan-200">
                        View version history
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Target job posting</CardTitle>
                      <Button variant="ghost" className="h-8 rounded-full border border-white/10 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10">
                        Import from clipboard
                      </Button>
                    </div>
                    <CardDescription>
                      Drop the exact listing so the evaluator agent can mirror its keywords, tone, and structure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea defaultValue={SAMPLE_JOB_POSTING} className="min-h-[260px]" />
                    <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400">
                      <span>Detected keywords: React, TypeScript, Microservices</span>
                      <Link href="#parse-details" className="text-cyan-300 hover:text-cyan-200">
                        View parse details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">ATS evaluator score</CardTitle>
                      <Badge className={cn("text-xs", MATCH_TIER_VARIANTS[MOCK_EVALUATION.matchTier])}>
                        {MOCK_EVALUATION.matchTier}
                      </Badge>
                    </div>
                    <CardDescription>{MOCK_EVALUATION.overallSummary}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">High-priority gaps</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-300">
                        {MOCK_EVALUATION.highPriorityGaps.map((gap) => (
                          <li key={gap} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <KeywordList
                        title="Critical missing"
                        variant="danger"
                        items={MOCK_EVALUATION.atsKeywordAnalysis.criticalMissing}
                      />
                      <KeywordList
                        title="Should emphasize"
                        variant="success"
                        items={MOCK_EVALUATION.atsKeywordAnalysis.shouldEmphasize}
                      />
                    </div>
                    <KeywordList
                      title="Deprioritize"
                      variant="outline"
                      items={MOCK_EVALUATION.atsKeywordAnalysis.resumeOnlyTermsToDeprioritize}
                    />
                  </CardContent>
                </Card>

                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Section adjustments</CardTitle>
                    <CardDescription>
                      Structured guidance the advisor will hand off to the writer agent.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[260px]">
                      <div className="space-y-6">
                        <SectionAdjustment
                          title="Summary"
                          adjustments={MOCK_EVALUATION.sectionAdjustments.summary}
                        />
                        <Separator className="bg-white/5" />
                        <SkillsAdjustment adjustments={MOCK_EVALUATION.sectionAdjustments.skills} />
                        <Separator className="bg-white/5" />
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-white">Experience tweaks</h3>
                          <div className="space-y-3 text-xs text-slate-300">
                            {MOCK_EVALUATION.sectionAdjustments.experience.map((exp) => (
                              <div key={exp.identifier} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                                <p className="text-sm font-semibold text-white">{exp.identifier}</p>
                                <AdjustmentList label="Add / Rewrite" items={exp.addOrRewrite} variant="success" />
                                <AdjustmentList label="De-emphasize" items={exp.deEmphasize} variant="outline" />
                                <AdjustmentList label="Keyword focus" items={exp.keywordFocus} variant="default" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <Separator className="bg-white/5" />
                        <div>
                          <h3 className="text-sm font-semibold text-white">Format warnings</h3>
                          <ul className="mt-2 space-y-2 text-xs text-amber-200">
                            {MOCK_EVALUATION.formatWarnings.map((warning) => (
                              <li key={warning} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
              <Card>
                <CardHeader>
                  <CardTitle>Tailoring advisor plan</CardTitle>
                  <CardDescription>
                    Snapshot of how the advisor agent interprets the posting and maps it to your resume.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[320px]">
                    <div className="space-y-6 text-sm text-slate-300">
                      <AdvisorSection title="Company values" items={MOCK_ADVISOR.job_posting_analysis.company_values} />
                      <AdvisorSection title="Must-haves" items={MOCK_ADVISOR.job_posting_analysis.must_have_requirements} badgeVariant="danger" />
                      <AdvisorSection title="Preferred" items={MOCK_ADVISOR.job_posting_analysis.preferred_qualifications} />
                      <AdvisorSection title="Key technologies" items={MOCK_ADVISOR.job_posting_analysis.key_technologies} badgeVariant="outline" />
                      <AdvisorSection title="Action verbs" items={MOCK_ADVISOR.job_posting_analysis.action_keywords} badgeVariant="success" />
                      <Separator className="bg-white/5" />
                      <AdvisorSection title="Strong matches" items={MOCK_ADVISOR.resume_alignment.strong_matches} badgeVariant="success" />
                      <AdvisorSection title="Partial matches" items={MOCK_ADVISOR.resume_alignment.partial_matches} badgeVariant="warning" />
                      <AdvisorSection title="Gaps" items={MOCK_ADVISOR.resume_alignment.gaps} badgeVariant="danger" />
                      <AdvisorSection title="Risk flags" items={MOCK_ADVISOR.resume_alignment.risk_flags} badgeVariant="outline" />
                      <Separator className="bg-white/5" />
                      <AdvisorSection title="Quick wins" items={MOCK_ADVISOR.tailoring_recommendations.quick_wins} />
                      <AdvisorSection title="Critical actions" items={MOCK_ADVISOR.priority_actions.critical} badgeVariant="danger" />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional writer draft</CardTitle>
                  <CardDescription>
                    Generated resume ready for your review. Export or fine-tune before submitting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ScrollArea className="h-[260px] rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs font-mono leading-relaxed text-slate-200">
                    <pre className="whitespace-pre-wrap">{MOCK_WRITER.rewritten_resume}</pre>
                  </ScrollArea>
                  <div className="grid gap-3 text-xs text-slate-300">
                    <AdjustmentList label="Implementation notes" items={MOCK_WRITER.implementation_notes} variant="success" />
                    <AdjustmentList label="Unaddressed items" items={MOCK_WRITER.unaddressed_items} variant="danger" />
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">Keyword summary</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <KeywordList
                          title="Covered"
                          variant="success"
                          items={MOCK_WRITER.keyword_summary.high_priority_keywords}
                        />
                        <KeywordList
                          title="Still missing"
                          variant="danger"
                          items={MOCK_WRITER.keyword_summary.still_missing_keywords}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
        <ProgressDrawer steps={WORKFLOW_STEPS} overallProgress={62} />
      </div>
    </div>
  );
}

interface AdjustmentListProps {
  label: string;
  items: string[];
  variant?: "default" | "success" | "danger" | "outline";
}

function AdjustmentList({ label, items, variant = "default" }: AdjustmentListProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <ul className="space-y-1.5 text-xs text-slate-300">
        {items.length === 0 ? (
          <li className="text-slate-500">No items</li>
        ) : (
          items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Badge
                variant={
                  variant === "success"
                    ? "success"
                    : variant === "danger"
                      ? "danger"
                      : variant === "outline"
                        ? "outline"
                        : "default"
                }
                className={cn(
                  "mt-0.5",
                  variant === "default" && "bg-slate-800/90 text-slate-200",
                )}
              >
                •
              </Badge>
              <span className="flex-1 text-left leading-relaxed">{item}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

interface SectionAdjustmentProps {
  title: string;
  adjustments: ResumeEvaluationResult["sectionAdjustments"]["summary"];
}

function SectionAdjustment({ title, adjustments }: SectionAdjustmentProps) {
  return (
    <div className="space-y-3 text-xs text-slate-300">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <AdjustmentList label="Add" items={adjustments.add} variant="success" />
      <AdjustmentList label="Remove" items={adjustments.remove} variant="danger" />
      <AdjustmentList label="Notes" items={adjustments.notes} variant="outline" />
    </div>
  );
}

interface SkillsAdjustmentProps {
  adjustments: ResumeEvaluationResult["sectionAdjustments"]["skills"];
}

function SkillsAdjustment({ adjustments }: SkillsAdjustmentProps) {
  return (
    <div className="space-y-3 text-xs text-slate-300">
      <h3 className="text-sm font-semibold text-white">Skills layout</h3>
      <AdjustmentList label="Add" items={adjustments.add} variant="success" />
      <AdjustmentList label="Remove" items={adjustments.remove} variant="danger" />
      <AdjustmentList label="Reorder" items={adjustments.reorder} variant="outline" />
    </div>
  );
}

interface KeywordListProps {
  title: string;
  items: string[];
  variant: "success" | "danger" | "outline" | "default";
}

function KeywordList({ title, items, variant }: KeywordListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-2 text-xs">
        {items.length === 0 ? (
          <li className="text-slate-500">None</li>
        ) : (
          items.map((item) => (
            <li key={item}>
              <Badge
                variant={
                  variant === "success"
                    ? "success"
                    : variant === "danger"
                      ? "danger"
                      : variant === "outline"
                        ? "outline"
                        : "default"
                }
              >
                {item}
              </Badge>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

interface AdvisorSectionProps {
  title: string;
  items: string[];
  badgeVariant?: "default" | "success" | "warning" | "danger" | "outline";
}

function AdvisorSection({ title, items, badgeVariant = "default" }: AdvisorSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</h3>
      <ul className="flex flex-wrap gap-2 text-xs">
        {items.length === 0 ? (
          <li className="text-slate-500">None</li>
        ) : (
          items.map((item) => (
            <li key={item}>
              <Badge variant={badgeVariant}>{item}</Badge>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
