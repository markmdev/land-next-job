import { JobPostingUpdateDTO } from "@/types/job-postings";
import { desc, eq } from "drizzle-orm";
import db from "../db";
import { jobPosting } from "../schema";
import { JobPostingDTO } from "@/types/job-postings";

export const getJobPostingAll = async (): Promise<JobPostingDTO[]> => {
  const result = await db.select().from(jobPosting).orderBy(desc(jobPosting.id));
  return result;
};

export const getJobPostingById = async (id: string): Promise<JobPostingDTO> => {
  const result = await db.select().from(jobPosting).where(eq(jobPosting.id, id));
  if (!result[0]) {
    throw new Error("Job posting not found");
  }
  return result[0];
};

export const updateJobPosting = async (
  newJobPosting: JobPostingUpdateDTO
): Promise<JobPostingDTO> => {
  const result = await db
    .update(jobPosting)
    .set(newJobPosting)
    .where(eq(jobPosting.id, newJobPosting.id))
    .returning();
  if (!result[0]) {
    throw new Error("Job posting not found");
  }
  return result[0];
};
