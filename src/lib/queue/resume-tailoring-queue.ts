import { Queue, Worker } from "bullmq";
import { randomUUID } from "node:crypto";

import {
  runResumeTailoringWorkflow,
  type ResumeTailoringWorkflowInput,
} from "@/lib/agents";
import {
  initializeProgressSnapshot,
  markRunCompleted,
  markRunFailed,
  recordProgressEvent,
} from "@/lib/progress-store";
import { getRedisConnectionOptions } from "@/lib/redis";
import type { WorkflowProgressEvent } from "@/lib/workflow-progress";

const QUEUE_NAME = "resume-tailoring";

type TailoringJobData = {
  runId: string;
  input: ResumeTailoringWorkflowInput;
};

declare global {
  // eslint-disable-next-line no-var
  var __jobhunt_resume_queue__: Queue<TailoringJobData> | undefined;
  // eslint-disable-next-line no-var
  var __jobhunt_resume_worker__: Worker<TailoringJobData> | undefined;
}

function sanitizeOptions(
  options: ResumeTailoringWorkflowInput["options"]
): ResumeTailoringWorkflowInput["options"] | undefined {
  if (!options) {
    return undefined;
  }

  const { onProgress: _ignored, ...rest } = options;
  return rest;
}

async function processJob(job: { data: TailoringJobData }) {
  const { runId, input } = job.data;

  try {
    const sanitizedOptions = sanitizeOptions(input.options);
    const result = await runResumeTailoringWorkflow({
      ...input,
      options: sanitizedOptions
        ? {
            ...sanitizedOptions,
            onProgress: async (event: WorkflowProgressEvent) => {
              await recordProgressEvent(runId, event);
            },
          }
        : {
            onProgress: async (event: WorkflowProgressEvent) => {
              await recordProgressEvent(runId, event);
            },
          },
    });

    await markRunCompleted(runId, result);
    return result;
  } catch (error) {
    await markRunFailed(runId, error);
    throw error;
  }
}

function getOrCreateQueue() {
  if (!globalThis.__jobhunt_resume_queue__) {
    globalThis.__jobhunt_resume_queue__ = new Queue<TailoringJobData>(QUEUE_NAME, {
      connection: getRedisConnectionOptions(),
    });
  }

  if (!globalThis.__jobhunt_resume_worker__) {
    globalThis.__jobhunt_resume_worker__ = new Worker<TailoringJobData>(
      QUEUE_NAME,
      processJob,
      {
        connection: getRedisConnectionOptions(),
      }
    );

    globalThis.__jobhunt_resume_worker__.on("error", (error) => {
      console.error("Resume tailoring worker error", error);
    });
  }

  return globalThis.__jobhunt_resume_queue__;
}

export async function enqueueResumeTailoringRun(
  input: ResumeTailoringWorkflowInput
) {
  const runId = randomUUID();
  await initializeProgressSnapshot(runId);

  const queue = getOrCreateQueue();
  await queue.add(
    "workflow",
    {
      runId,
      input: {
        ...input,
        options: sanitizeOptions(input.options),
      },
    },
    {
      jobId: runId,
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  return runId;
}
