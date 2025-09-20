import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { advisorSchema, rewriteResume, writerSchema } from '@/lib/agents';

const requestSchema = z.object({
  jobPosting: z.string().trim().min(1, 'jobPosting is required'),
  resume: z.string().trim().min(1, 'resume is required'),
  recommendations: advisorSchema,
  model: z.string().trim().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = requestSchema.parse(await req.json());
    const result = await rewriteResume(
      body.jobPosting,
      body.resume,
      body.recommendations,
      body.model,
    );

    const parsed = writerSchema.parse(result);
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

    console.error('Professional resume writer agent error', error);
    return NextResponse.json(
      {
        error: 'Failed to rewrite resume',
      },
      { status: 500 },
    );
  }
}
