import { getJobPostingAll } from "@/lib/db/queries/job-postings";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jobPostings = await getJobPostingAll();
    return NextResponse.json(jobPostings);
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
