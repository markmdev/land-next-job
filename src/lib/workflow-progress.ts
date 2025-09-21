import type {
  ProfessionalResumeWriterOutput,
  ResumeEvaluationResult,
  TailoringAdvisorOutput,
  ResumeTailoringWorkflowResult,
} from "./agents";

export type WorkflowStepStatus = "pending" | "active" | "completed";

export interface WorkflowStepSnapshot {
  id: string;
  label: string;
  status: WorkflowStepStatus;
  description?: string;
  data?: unknown;
}

export type WorkflowRunStatus = "queued" | "running" | "completed" | "failed";

export interface WorkflowProgressSnapshot {
  runId: string;
  status: WorkflowRunStatus;
  overallProgress: number;
  steps: WorkflowStepSnapshot[];
  latestEvaluation?: ResumeEvaluationResult;
  latestRecommendations?: TailoringAdvisorOutput;
  latestWriterOutput?: ProfessionalResumeWriterOutput;
  result?: ResumeTailoringWorkflowResult;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowProgressEventStage =
  | "initial_evaluation"
  | "advisor"
  | "writer"
  | "final_evaluation";

export interface WorkflowProgressEvent {
  stage: WorkflowProgressEventStage;
  status: "in_progress" | "completed";
  iteration: number;
  evaluation?: ResumeEvaluationResult;
  recommendations?: TailoringAdvisorOutput;
  writerOutput?: ProfessionalResumeWriterOutput;
}

export const WORKFLOW_STEP_ORDER: WorkflowStepSnapshot[] = [
  { id: "initial_evaluation", label: "ATS evaluation", status: "pending" },
  { id: "advisor", label: "Tailoring plan", status: "pending" },
  { id: "writer", label: "Resume rewrite", status: "pending" },
  { id: "final_evaluation", label: "Final check", status: "pending" },
];

export const WORKFLOW_PROGRESS_TTL_SECONDS = 60 * 60; // 1 hour

export const WORKFLOW_PROGRESS_CHANNEL_PREFIX = "workflow:progress";

export function workflowProgressKey(runId: string) {
  return `${WORKFLOW_PROGRESS_CHANNEL_PREFIX}:snapshot:${runId}`;
}

export function workflowProgressChannel(runId: string) {
  return `${WORKFLOW_PROGRESS_CHANNEL_PREFIX}:events:${runId}`;
}
