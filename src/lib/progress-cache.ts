import { readFile } from "node:fs/promises";
import path from "node:path";

import { runResumeTailoringWorkflow, type ResumeTailoringWorkflowResult, type ResumeTailoringWorkflowInput } from "@/lib/agents";
import { getRedisClient } from "@/lib/redis";
import type { WorkflowProgressEvent } from "@/lib/workflow-progress";

const redis = getRedisClient();
const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

function normalizeText(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}

function cacheKey(payload: { resume: string; jobPosting: string }) {
  const resume = normalizeText(payload.resume);
  const jobPosting = normalizeText(payload.jobPosting);
  return `workflow:cache:${Buffer.from(resume + "::" + jobPosting).toString("base64")}`;
}

export async function runWorkflowWithCache(
  input: ResumeTailoringWorkflowInput,
  onProgress: (event: WorkflowProgressEvent) => Promise<void> | void
): Promise<{ result: ResumeTailoringWorkflowResult; fromCache: boolean }> {
  const key = cacheKey({ resume: input.resume, jobPosting: input.jobPosting });

  const cached = await redis.get(key);
  if (cached) {
    const parsed = JSON.parse(cached) as ResumeTailoringWorkflowResult;
    // simulate delay for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Emit synthetic progress so UI updates instantly
    if (parsed.iterations.length > 0) {
      const initial = parsed.iterations[0];
      await onProgress({
        stage: "initial_evaluation",
        status: "completed",
        iteration: 0,
        evaluation: initial.evaluationAfter,
      });

      for (let i = 1; i < parsed.iterations.length; i += 1) {
        const iterRecord = parsed.iterations[i];
        await onProgress({
          stage: "advisor",
          status: "completed",
          iteration: i,
          recommendations: iterRecord.recommendations,
        });
        await onProgress({
          stage: "writer",
          status: "completed",
          iteration: i,
          writerOutput: iterRecord.writerOutput,
        });
        await onProgress({
          stage: "final_evaluation",
          status: "completed",
          iteration: i,
          evaluation: iterRecord.evaluationAfter,
        });
      }
    }
    return { result: parsed, fromCache: true };
  }

  const result = await runResumeTailoringWorkflow({
    ...input,
    options: {
      ...input.options,
      onProgress,
    },
  });

  await redis.set(key, JSON.stringify(result), "EX", CACHE_TTL_SECONDS);
  return { result, fromCache: false };
}
