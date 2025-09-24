import { eq } from "drizzle-orm";
import db from "../db";
import { adaptedResume } from "../schema";
import { AdaptedResumeDTO, AdaptedResumeUpdateDTO } from "@/types/adapted-resume";

export const getAdaptedResumeAll = async (): Promise<AdaptedResumeDTO[]> => {
  const result = await db.select().from(adaptedResume);
  return result;
};

export const getAdaptedResumeByJobPostingId = async (
  jobPostingId: string
): Promise<AdaptedResumeDTO> => {
  const result = await db
    .select()
    .from(adaptedResume)
    .where(eq(adaptedResume.jobPostingId, jobPostingId));
  console.log(result);
  if (result.length === 0 || !result[0]) {
    throw new Error("Adapted resume not found");
  }

  return result[0];
};

export const updateAdaptedResume = async (
  newAdaptedResume: AdaptedResumeUpdateDTO
): Promise<AdaptedResumeDTO> => {
  const result = await db
    .update(adaptedResume)
    .set(newAdaptedResume)
    .where(eq(adaptedResume.id, newAdaptedResume.id))
    .returning();

  if (!result[0]) {
    throw new Error("Adapted resume not found");
  }

  return result[0];
};

export const createAdaptedResume = async (
  newAdaptedResume: AdaptedResumeUpdateDTO
): Promise<AdaptedResumeDTO> => {
  const result = await db.insert(adaptedResume).values(newAdaptedResume).returning();
  if (!result[0]) {
    throw new Error("Adapted resume not created");
  }
  return result[0];
};
