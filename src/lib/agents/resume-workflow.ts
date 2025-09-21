import { Agent, run } from "@openai/agents";
import type { ModelSettings } from "@openai/agents";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import type { WorkflowProgressEvent } from "../workflow-progress";

const PROMPT_FILENAMES = {
  evaluation: "resume-job-match-evaluation.md",
  advisor: "resume-tailoring-advisor.md",
  writer: "professional-resume-writer.md",
} as const;

const DEFAULT_TARGET_SCORE = 85;
const DEFAULT_MAX_ITERATIONS = 3;

const DEFAULT_MODELS = {
  evaluation: "gpt-5",
  advisor: "gpt-5",
  writer: "gpt-5",
} as const;

type ReasoningEffort = "minimal" | "low" | "medium" | "high";

export const evaluationSchema = z.object({
  score: z.number().min(0).max(100),
  matchTier: z.enum(["outstanding", "strong", "moderate", "weak", "poor"]),
  overallSummary: z.string(),
  highPriorityGaps: z.array(z.string()),
  atsKeywordAnalysis: z.object({
    criticalMissing: z.array(z.string()),
    shouldEmphasize: z.array(z.string()),
    resumeOnlyTermsToDeprioritize: z.array(z.string()),
  }),
  sectionAdjustments: z.object({
    summary: z.object({
      add: z.array(z.string()),
      remove: z.array(z.string()),
      notes: z.array(z.string()),
    }),
    skills: z.object({
      add: z.array(z.string()),
      remove: z.array(z.string()),
      reorder: z.array(z.string()),
    }),
    experience: z.array(
      z.object({
        identifier: z.string(),
        addOrRewrite: z.array(z.string()),
        deEmphasize: z.array(z.string()),
        keywordFocus: z.array(z.string()),
      })
    ),
  }),
  formatWarnings: z.array(z.string()),
});

export const advisorSchema = z.object({
  job_posting_analysis: z.object({
    company_values: z.array(z.string()),
    must_have_requirements: z.array(z.string()),
    preferred_qualifications: z.array(z.string()),
    key_technologies: z.array(z.string()),
    action_keywords: z.array(z.string()),
  }),
  resume_alignment: z.object({
    strong_matches: z.array(z.string()),
    partial_matches: z.array(z.string()),
    gaps: z.array(z.string()),
    underleveraged_experience: z.array(z.string()),
    risk_flags: z.array(z.string()),
  }),
  tailoring_recommendations: z.object({
    summary_section: z.object({
      keep: z.array(z.string()),
      de_emphasize: z.array(z.string()),
      add_or_emphasize: z.array(z.string()),
      sample_language: z.array(z.string()),
    }),
    skills_section: z.object({
      reorder: z.array(z.string()),
      add: z.array(z.string()),
      de_emphasize: z.array(z.string()),
      grouping_suggestions: z.array(z.string()),
    }),
    experience_sections: z.array(
      z.object({
        identifier: z.string(),
        keep: z.array(z.string()),
        modify: z.array(
          z.object({
            current_focus: z.string(),
            recommended_focus: z.string(),
            keyword_targets: z.array(z.string()),
          })
        ),
        add: z.array(z.string()),
        remove: z.array(z.string()),
      })
    ),
    quick_wins: z.array(z.string()),
  }),
  priority_actions: z.object({
    critical: z.array(z.string()),
    important: z.array(z.string()),
    nice_to_have: z.array(z.string()),
  }),
  keyword_check: z.object({
    missing_keywords: z.array(z.string()),
    reinforce_keywords: z.array(z.string()),
    format_notes: z.array(z.string()),
  }),
});

export const writerSchema = z.object({
  rewritten_resume: z.string(),
  implementation_notes: z.array(z.string()),
  unaddressed_items: z.array(z.string()),
  keyword_summary: z.object({
    high_priority_keywords: z.array(z.string()),
    still_missing_keywords: z.array(z.string()),
  }),
});

export type ResumeEvaluationResult = z.infer<typeof evaluationSchema>;
export type TailoringAdvisorOutput = z.infer<typeof advisorSchema>;
export type ProfessionalResumeWriterOutput = z.infer<typeof writerSchema>;

type AgentModelConfig = {
  evaluation: string;
  advisor: string;
  writer: string;
};

type AgentModelResolved = {
  name: string;
  reasoningEffort?: ReasoningEffort;
};

type AgentModelOptionInput =
  | string
  | {
      name: string;
      reasoningEffort?: ReasoningEffort;
    };

export interface ResumeTailoringWorkflowOptions {
  targetScore?: number;
  maxIterations?: number;
  models?: Partial<Record<keyof AgentModelConfig, AgentModelOptionInput>>;
  onProgress?: (event: WorkflowProgressEvent) => void | Promise<void>;
}

export interface TailoringIterationRecord {
  iteration: number;
  inputResume?: string;
  evaluationBefore?: ResumeEvaluationResult;
  recommendations?: TailoringAdvisorOutput;
  writerOutput?: ProfessionalResumeWriterOutput;
  outputResume: string;
  evaluationAfter: ResumeEvaluationResult;
  achievedTarget: boolean;
}

export interface ResumeTailoringWorkflowResult {
  finalResume: string;
  finalEvaluation: ResumeEvaluationResult;
  targetScore: number;
  reachedTarget: boolean;
  iterations: TailoringIterationRecord[];
}

export interface ResumeTailoringWorkflowInput {
  jobPosting: string;
  resume: string;
  options?: ResumeTailoringWorkflowOptions;
}

const promptCache = new Map<string, string>();

async function loadPrompt(filename: string): Promise<string> {
  if (promptCache.has(filename)) {
    return promptCache.get(filename)!;
  }

  const filePath = path.join(process.cwd(), "prompts", filename);
  const content = await readFile(filePath, "utf8");
  promptCache.set(filename, content);
  return content;
}

function applyTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => values[key] ?? "");
}

function buildModelSettings(
  model: string,
  reasoningEffort?: ReasoningEffort
): ModelSettings | undefined {
  const effort = reasoningEffort ?? (model.startsWith("gpt-5") ? "minimal" : undefined);

  if (!effort) {
    return undefined;
  }

  return {
    providerData: {
      reasoning: { effort },
    },
  } satisfies ModelSettings;
}

async function runAgentWithSchema<TSchema extends z.AnyZodObject>(params: {
  promptFile: (typeof PROMPT_FILENAMES)[keyof typeof PROMPT_FILENAMES];
  replacements: Record<string, string>;
  agentName: string;
  model: string;
  schema: TSchema;
  reasoningEffort?: ReasoningEffort;
}): Promise<z.infer<TSchema>> {
  const promptTemplate = await loadPrompt(params.promptFile);
  const instructions = applyTemplate(promptTemplate, params.replacements);
  const modelSettings = buildModelSettings(params.model, params.reasoningEffort);
  const agent = new Agent({
    name: params.agentName,
    instructions,
    model: params.model,
    ...(modelSettings ? { modelSettings } : {}),
    outputType: params.schema,
  });

  const result = await run(agent, "");
  const rawOutput = (result as { finalOutput?: unknown }).finalOutput ?? result;
  return params.schema.parse(rawOutput);
}

export async function evaluateResume(
  jobPosting: string,
  resume: string,
  model: string = DEFAULT_MODELS.evaluation,
  reasoningEffort?: ReasoningEffort
): Promise<ResumeEvaluationResult> {
  return runAgentWithSchema({
    promptFile: PROMPT_FILENAMES.evaluation,
    replacements: {
      job_posting: jobPosting,
      resume,
    },
    agentName: "Resume-job-match-evaluation",
    model,
    reasoningEffort,
    schema: evaluationSchema,
  });
}

export async function getTailoringAdvice(
  jobPosting: string,
  resume: string,
  model: string = DEFAULT_MODELS.advisor,
  reasoningEffort?: ReasoningEffort
): Promise<TailoringAdvisorOutput> {
  return runAgentWithSchema({
    promptFile: PROMPT_FILENAMES.advisor,
    replacements: {
      job_posting: jobPosting,
      resume,
    },
    agentName: "Resume-tailoring-advisor",
    model,
    reasoningEffort,
    schema: advisorSchema,
  });
}

export async function rewriteResume(
  jobPosting: string,
  resume: string,
  recommendations: TailoringAdvisorOutput,
  model: string = DEFAULT_MODELS.writer,
  reasoningEffort?: ReasoningEffort
): Promise<ProfessionalResumeWriterOutput> {
  return runAgentWithSchema({
    promptFile: PROMPT_FILENAMES.writer,
    replacements: {
      job_posting: jobPosting,
      resume,
      recommendations: JSON.stringify(recommendations, null, 2),
    },
    agentName: "Professional-resume-writer",
    model,
    reasoningEffort,
    schema: writerSchema,
  });
}

type ResolvedAgentModelConfig = Record<keyof AgentModelConfig, AgentModelResolved>;

function resolveModelEntry(
  key: keyof AgentModelConfig,
  override?: AgentModelOptionInput
): AgentModelResolved {
  if (!override) {
    return { name: DEFAULT_MODELS[key] };
  }

  if (typeof override === "string") {
    return { name: override };
  }

  return {
    name: override.name,
    reasoningEffort: override.reasoningEffort,
  };
}

function resolveModels(
  overrides?: Partial<Record<keyof AgentModelConfig, AgentModelOptionInput>>
): ResolvedAgentModelConfig {
  return {
    evaluation: resolveModelEntry("evaluation", overrides?.evaluation),
    advisor: resolveModelEntry("advisor", overrides?.advisor),
    writer: resolveModelEntry("writer", overrides?.writer),
  };
}

function normalizeResume(resume: string): string {
  return resume.replace(/\r\n/g, "\n");
}

export async function runResumeTailoringWorkflow(
  input: ResumeTailoringWorkflowInput
): Promise<ResumeTailoringWorkflowResult> {
  const jobPosting = input.jobPosting?.trim();
  const startingResume = normalizeResume(input.resume ?? "");

  if (!jobPosting) {
    throw new Error("jobPosting is required");
  }

  if (!startingResume.trim()) {
    throw new Error("resume is required");
  }

  const targetScore = input.options?.targetScore ?? DEFAULT_TARGET_SCORE;
  const maxIterations = input.options?.maxIterations ?? DEFAULT_MAX_ITERATIONS;
  const models = resolveModels(input.options?.models);
  const progressCallback = input.options?.onProgress;

  const iterations: TailoringIterationRecord[] = [];

  let currentResume = startingResume;

  await Promise.resolve(
    progressCallback?.({
      stage: "initial_evaluation",
      status: "in_progress",
      iteration: 0,
    })
  );

  let currentEvaluation = await evaluateResume(
    jobPosting,
    currentResume,
    models.evaluation.name,
    models.evaluation.reasoningEffort
  );

  await Promise.resolve(
    progressCallback?.({
      stage: "initial_evaluation",
      status: "completed",
      iteration: 0,
      evaluation: currentEvaluation,
    })
  );

  iterations.push({
    iteration: 0,
    outputResume: currentResume,
    evaluationAfter: currentEvaluation,
    achievedTarget: currentEvaluation.score >= targetScore,
  });

  if (currentEvaluation.score >= targetScore || maxIterations === 0) {
    await Promise.resolve(
      progressCallback?.({
        stage: "final_evaluation",
        status: "completed",
        iteration: 0,
        evaluation: currentEvaluation,
      })
    );

    return {
      finalResume: currentResume,
      finalEvaluation: currentEvaluation,
      targetScore,
      reachedTarget: currentEvaluation.score >= targetScore,
      iterations,
    };
  }

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    await Promise.resolve(
      progressCallback?.({
        stage: "advisor",
        status: "in_progress",
        iteration,
      })
    );

    const recommendations = await getTailoringAdvice(
      jobPosting,
      currentResume,
      models.advisor.name,
      models.advisor.reasoningEffort
    );

    await Promise.resolve(
      progressCallback?.({
        stage: "advisor",
        status: "completed",
        iteration,
        recommendations,
      })
    );

    await Promise.resolve(
      progressCallback?.({
        stage: "writer",
        status: "in_progress",
        iteration,
      })
    );

    const writerOutput = await rewriteResume(
      jobPosting,
      currentResume,
      recommendations,
      models.writer.name,
      models.writer.reasoningEffort
    );

    await Promise.resolve(
      progressCallback?.({
        stage: "writer",
        status: "completed",
        iteration,
        writerOutput,
      })
    );

    await Promise.resolve(
      progressCallback?.({
        stage: "final_evaluation",
        status: "in_progress",
        iteration,
      })
    );

    const rewrittenResume = normalizeResume(writerOutput.rewritten_resume.trim());
    const reevaluated = await evaluateResume(
      jobPosting,
      rewrittenResume,
      models.evaluation.name,
      models.evaluation.reasoningEffort
    );

    await Promise.resolve(
      progressCallback?.({
        stage: "final_evaluation",
        status: "completed",
        iteration,
        evaluation: reevaluated,
      })
    );

    iterations.push({
      iteration,
      inputResume: currentResume,
      evaluationBefore: currentEvaluation,
      recommendations,
      writerOutput,
      outputResume: rewrittenResume,
      evaluationAfter: reevaluated,
      achievedTarget: reevaluated.score >= targetScore,
    });

    currentResume = rewrittenResume;
    currentEvaluation = reevaluated;

    if (reevaluated.score >= targetScore) {
      break;
    }
  }

  return {
    finalResume: currentResume,
    finalEvaluation: currentEvaluation,
    targetScore,
    reachedTarget: currentEvaluation.score >= targetScore,
    iterations,
  };
}
