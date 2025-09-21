import { getRedisClient } from "./redis";
import {
  WORKFLOW_PROGRESS_TTL_SECONDS,
  WORKFLOW_STEP_ORDER,
  type WorkflowProgressEvent,
  type WorkflowProgressSnapshot,
  type WorkflowStepSnapshot,
  workflowProgressChannel,
  workflowProgressKey,
} from "./workflow-progress";

const redis = getRedisClient();

function cloneDefaultSteps(): WorkflowStepSnapshot[] {
  return WORKFLOW_STEP_ORDER.map((step) => ({ ...step }));
}

function computeOverallProgress(steps: WorkflowStepSnapshot[]): number {
  const total = steps.length;
  if (total === 0) {
    return 0;
  }

  const completed = steps.filter((step) => step.status === "completed").length;
  const active = steps.filter((step) => step.status === "active").length;
  const percent = ((completed + active * 0.5) / total) * 100;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

function createSnapshot(runId: string): WorkflowProgressSnapshot {
  const now = new Date().toISOString();
  return {
    runId,
    status: "queued",
    overallProgress: 0,
    steps: cloneDefaultSteps(),
    createdAt: now,
    updatedAt: now,
  };
}

async function saveSnapshot(snapshot: WorkflowProgressSnapshot) {
  const key = workflowProgressKey(snapshot.runId);
  await redis.set(key, JSON.stringify(snapshot), "EX", WORKFLOW_PROGRESS_TTL_SECONDS);
  await redis.publish(workflowProgressChannel(snapshot.runId), JSON.stringify(snapshot));
}

export async function initializeProgressSnapshot(runId: string) {
  const snapshot = createSnapshot(runId);
  await saveSnapshot(snapshot);
  return snapshot;
}

export async function getProgressSnapshot(runId: string): Promise<WorkflowProgressSnapshot | null> {
  const raw = await redis.get(workflowProgressKey(runId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as WorkflowProgressSnapshot;
  } catch (error) {
    console.error("Failed to parse progress snapshot", error);
    return null;
  }
}

async function updateSnapshot(
  runId: string,
  mutator: (snapshot: WorkflowProgressSnapshot) => void
): Promise<WorkflowProgressSnapshot> {
  const existing = (await getProgressSnapshot(runId)) ?? createSnapshot(runId);
  mutator(existing);
  existing.overallProgress = computeOverallProgress(existing.steps);
  existing.updatedAt = new Date().toISOString();
  await saveSnapshot(existing);
  return existing;
}

export async function recordProgressEvent(runId: string, event: WorkflowProgressEvent) {
  await updateSnapshot(runId, (snapshot) => {
    if (snapshot.status === "queued") {
      snapshot.status = "running";
    }

    const step = snapshot.steps.find((s) => s.id === event.stage);
    if (step) {
      step.status = event.status === "completed" ? "completed" : "active";
      if (event.stage === "initial_evaluation" || event.stage === "final_evaluation") {
        if (event.evaluation) {
          step.description = `Score ${event.evaluation.score}`;
          snapshot.latestEvaluation = event.evaluation;
        }
      }
      if (event.stage === "advisor" && event.recommendations) {
        const quickWins = event.recommendations.tailoring_recommendations.quick_wins.length;
        step.description = quickWins > 0 ? `${quickWins} quick wins` : "Plan ready";
        snapshot.latestRecommendations = event.recommendations;
      }
      if (event.stage === "writer" && event.writerOutput) {
        step.description = "Draft generated";
        snapshot.latestWriterOutput = event.writerOutput;
      }
      if (!step.description && event.status === "in_progress") {
        step.description = "Processing";
      }
    }
  });
}

export async function markRunCompleted(
  runId: string,
  result: import("./agents").ResumeTailoringWorkflowResult
) {
  await updateSnapshot(runId, (snapshot) => {
    snapshot.status = "completed";
    snapshot.overallProgress = 100;
    snapshot.result = result;
    snapshot.latestEvaluation = result.finalEvaluation;
  });
}

export async function markRunFailed(runId: string, error: unknown) {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";

  await updateSnapshot(runId, (snapshot) => {
    snapshot.status = "failed";
    snapshot.error = message;
  });
}

export async function publishManualUpdate(runId: string) {
  const snapshot = await getProgressSnapshot(runId);
  if (snapshot) {
    await saveSnapshot(snapshot);
  }
}
