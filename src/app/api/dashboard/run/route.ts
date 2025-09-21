import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { enqueueResumeTailoringRun } from "@/lib/queue/resume-tailoring-queue";
import { getProgressSnapshot } from "@/lib/progress-store";
import { stackServerApp } from "@/stack/server";

const optionsSchema = z
  .object({
    targetScore: z.number().int().min(0).max(100).optional(),
    maxIterations: z.number().int().min(0).max(10).optional(),
    models: z.record(z.any()).optional(),
  })
  .optional();

const requestSchema = z.object({
  jobPosting: z.string().trim().min(1, "jobPosting is required"),
  resume: z.string().trim().min(1, "resume is required"),
  options: optionsSchema,
});

export async function POST(req: NextRequest) {
  try {
    const body = requestSchema.parse(await req.json());

    const user = await stackServerApp.getUser();
    const item = await user?.getItem('credits');
    const didItWork = await item?.tryDecreaseQuantity(1);
    if (didItWork === false){
      return NextResponse.json(
        {
          error: "Cannot process: unavailable credits",
        },
        { status: 402 }
      );
    }

    const runId = await enqueueResumeTailoringRun({
      jobPosting: body.jobPosting,
      resume: body.resume,
      options: body.options,
    });

    const snapshot = await getProgressSnapshot(runId);

    return NextResponse.json({
      runId,
      snapshot,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Failed to enqueue resume tailoring run", error);
    return NextResponse.json(
      {
        error: "Failed to start tailoring run",
      },
      { status: 500 }
    );
  }
}
