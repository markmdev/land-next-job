import { runATSAgent } from "@repo/agents";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { masterResume, jobPosting } = await request.json();
  const result = await runATSAgent(masterResume, jobPosting);
  console.log(result);
  return NextResponse.json(result);
}
