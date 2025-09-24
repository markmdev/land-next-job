import { JobPostingUpdateDTO } from "@/types/job-postings";
import { desc, eq } from "drizzle-orm";
import db from "../db";
import { adaptedResume, jobPosting, masterResume } from "../schema";
import { JobPostingDTO } from "@/types/job-postings";
import { v4 as uuidv4 } from "uuid";

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

export const createJobPosting = async (
  newJobPosting: JobPostingUpdateDTO
): Promise<JobPostingDTO> => {
  const result = await db.transaction(async (tx) => {
    const result = await tx.insert(jobPosting).values(newJobPosting).returning();
    if (!result[0]) {
      throw new Error("Job posting not created");
    }
    // TODO - When we have multiple users, we will need to filter by user id
    const userMasterResume = await tx.select().from(masterResume);
    if (!userMasterResume[0]) {
      throw new Error("Master resume not found");
    }

    await tx
      .insert(adaptedResume)
      .values({
        id: uuidv4(),
        jobPostingId: result[0].id,
        markdownContent: userMasterResume[0].markdownContent,
      })
      .returning();
    return result[0];
  });
  return result;
};
