import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { advisorSchema, getTailoringAdvice } from '@/lib/agents';

const reasoningEffortSchema = z.enum(['minimal', 'low', 'medium', 'high']);

const requestSchema = z.object({
  jobPosting: z.string().trim().min(1, 'jobPosting is required'),
  resume: z.string().trim().min(1, 'resume is required'),
  model: z.string().trim().min(1).optional(),
  reasoningEffort: reasoningEffortSchema.optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = requestSchema.parse(await req.json());
    const result = await getTailoringAdvice(
      body.jobPosting,
      body.resume,
      body.model,
      body.reasoningEffort,
    );

    // Ensure the agent output matches the schema before returning it to the client.
    const parsed = advisorSchema.parse(result);
    return NextResponse.json(parsed);
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

    console.error('Tailoring advisor agent error', error);
    return NextResponse.json(
      {
        error: 'Failed to generate tailoring advice',
      },
      { status: 500 },
    );
  }
}
