"use server";

import { updateJobPosting } from "@/lib/db/queries/job-postings";
import { JobPostingUpdateDTO } from "@/types/job-postings";
import { jobPostingSchema } from "@/lib/schemas/job-posting";
import { z } from "zod";

export async function updateJobPostingAction(newJobPosting: JobPostingUpdateDTO) {
  try {
    const validatedJobPosting = jobPostingSchema.parse(newJobPosting);
    const result = await updateJobPosting(validatedJobPosting);
    return { data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("ZodError", error.issues);
      return { error: z.prettifyError(error) };
    }
    console.error(error);
    return { error: "Unknown error" };
  }
}
