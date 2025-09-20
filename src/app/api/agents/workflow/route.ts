import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { runResumeTailoringWorkflow } from '@/lib/agents';

const reasoningEffortSchema = z.enum(['minimal', 'low', 'medium', 'high']);

const modelOverrideSchema = z.union([
  z.string().trim().min(1),
  z.object({
    name: z.string().trim().min(1),
    reasoningEffort: reasoningEffortSchema.optional(),
  }),
]);

const modelsSchema = z
  .object({
    evaluation: modelOverrideSchema.optional(),
    advisor: modelOverrideSchema.optional(),
    writer: modelOverrideSchema.optional(),
  })
  .partial();

const optionsSchema = z
  .object({
    targetScore: z.number().int().min(0).max(100).optional(),
    maxIterations: z.number().int().min(0).max(10).optional(),
    models: modelsSchema.optional(),
  })
  .partial();

const requestSchema = z.object({
  jobPosting: z.string().trim().min(1, 'jobPosting is required'),
  resume: z.string().trim().min(1, 'resume is required'),
  options: optionsSchema.optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = requestSchema.parse(await req.json());
    const result = await runResumeTailoringWorkflow({
      jobPosting: body.jobPosting,
      resume: body.resume,
      options: body.options,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error('Resume tailoring workflow error', error);
    return NextResponse.json(
      {
        error: 'Failed to run resume tailoring workflow',
      },
      { status: 500 },
    );
  }
}
