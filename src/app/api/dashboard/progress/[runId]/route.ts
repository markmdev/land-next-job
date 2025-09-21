import { NextRequest, NextResponse } from "next/server";

import { getProgressSnapshot } from "@/lib/progress-store";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ runId: string }> }
) {
  const { runId } = await context.params;

  if (!runId) {
    return NextResponse.json({ error: "runId is required" }, { status: 400 });
  }

  const snapshot = await getProgressSnapshot(runId);

  if (!snapshot) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  return NextResponse.json(snapshot);
}
