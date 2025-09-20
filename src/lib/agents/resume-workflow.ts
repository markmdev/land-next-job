"use server";

import { Agent, run } from "@openai/agents";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const PROMPT_FILENAMES = {
  evaluation: "resume-job-match-evaluation.md",
  advisor: "resume-tailoring-advisor.md",
  writer: "professional-resume-writer.md",
} as const;

const DEFAULT_TARGET_SCORE = 85;
const DEFAULT_MAX_ITERATIONS = 3;

const DEFAULT_MODELS = {
  evaluation: "gpt-4o-mini",
  advisor: "gpt-4o-mini",
  writer: "gpt-4o",
} as const;

export const evaluationSchema = z.object({
  score: z.number().min(0).max(100),
  missing_qualifications: z.array(z.string()),
  summary: z.string(),
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

type ResumeEvaluationResult = z.infer<typeof evaluationSchema>;
type TailoringAdvisorOutput = z.infer<typeof advisorSchema>;
type ProfessionalResumeWriterOutput = z.infer<typeof writerSchema>;

type AgentModelConfig = {
  evaluation: string;
  advisor: string;
  writer: string;
};

export interface ResumeTailoringWorkflowOptions {
  targetScore?: number;
  maxIterations?: number;
  models?: Partial<AgentModelConfig>;
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

async function runAgentWithSchema<TSchema extends z.AnyZodObject>(params: {
  promptFile: (typeof PROMPT_FILENAMES)[keyof typeof PROMPT_FILENAMES];
  replacements: Record<string, string>;
  agentName: string;
  model: string;
  schema: TSchema;
}): Promise<z.infer<TSchema>> {
  const promptTemplate = await loadPrompt(params.promptFile);
  const instructions = applyTemplate(promptTemplate, params.replacements);
  const agent = new Agent({
    name: params.agentName,
    instructions,
    model: params.model,
    outputType: params.schema,
  });

  const result = await run(agent, "");
  const rawOutput = (result as { finalOutput?: unknown }).finalOutput ?? result;
  return params.schema.parse(rawOutput);
}

export async function evaluateResume(
  jobPosting: string,
  resume: string,
  model: string = DEFAULT_MODELS.evaluation
): Promise<ResumeEvaluationResult> {
  return runAgentWithSchema({
    promptFile: PROMPT_FILENAMES.evaluation,
    replacements: {
      job_posting: jobPosting,
      resume,
    },
    agentName: "Resume-job-match-evaluation",
    model,
    schema: evaluationSchema,
  });
}

export async function getTailoringAdvice(
  jobPosting: string,
  resume: string,
  model: string = DEFAULT_MODELS.advisor
): Promise<TailoringAdvisorOutput> {
  return runAgentWithSchema({
    promptFile: PROMPT_FILENAMES.advisor,
    replacements: {
      job_posting: jobPosting,
      resume,
    },
    agentName: "Resume-tailoring-advisor",
    model,
    schema: advisorSchema,
  });
}

export async function rewriteResume(
  jobPosting: string,
  resume: string,
  recommendations: TailoringAdvisorOutput,
  model: string = DEFAULT_MODELS.writer
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
    schema: writerSchema,
  });
}

function resolveModels(overrides?: Partial<AgentModelConfig>): AgentModelConfig {
  return {
    evaluation: overrides?.evaluation ?? DEFAULT_MODELS.evaluation,
    advisor: overrides?.advisor ?? DEFAULT_MODELS.advisor,
    writer: overrides?.writer ?? DEFAULT_MODELS.writer,
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

  const iterations: TailoringIterationRecord[] = [];

  let currentResume = startingResume;
  let currentEvaluation = await evaluateResume(jobPosting, currentResume, models.evaluation);

  iterations.push({
    iteration: 0,
    outputResume: currentResume,
    evaluationAfter: currentEvaluation,
    achievedTarget: currentEvaluation.score >= targetScore,
  });

  if (currentEvaluation.score >= targetScore || maxIterations === 0) {
    return {
      finalResume: currentResume,
      finalEvaluation: currentEvaluation,
      targetScore,
      reachedTarget: currentEvaluation.score >= targetScore,
      iterations,
    };
  }

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const recommendations = await getTailoringAdvice(jobPosting, currentResume, models.advisor);
    const writerOutput = await rewriteResume(
      jobPosting,
      currentResume,
      recommendations,
      models.writer
    );
    const rewrittenResume = normalizeResume(writerOutput.rewritten_resume.trim());
    const reevaluated = await evaluateResume(jobPosting, rewrittenResume, models.evaluation);

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

export type { ResumeEvaluationResult, TailoringAdvisorOutput, ProfessionalResumeWriterOutput };
