import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { evaluateResume } from '@/lib/agents';

const requestSchema = z.object({
  jobPosting: z.string().trim().min(1, 'jobPosting is required'),
  resume: z.string().trim().min(1, 'resume is required'),
  model: z.string().trim().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = requestSchema.parse(await req.json());
    const result = await evaluateResume(body.jobPosting, body.resume, body.model);
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

    console.error('Evaluation agent error', error);
    return NextResponse.json(
      {
        error: 'Failed to evaluate resume',
      },
      { status: 500 },
    );
  }
}
