import db from "../db";
import { masterResume } from "../schema";
import { MasterResumeDTO, MasterResumeUpdateDTO } from "@/types/master-resume";
import { eq } from "drizzle-orm";

export const getMasterResume = async (): Promise<MasterResumeDTO> => {
  const result = await db.select().from(masterResume);
  if (!result[0]) {
    throw new Error("Master resume not found");
  }
  return result[0];
};

export const updateMasterResume = async (
  newMasterResume: MasterResumeUpdateDTO
): Promise<MasterResumeDTO> => {
  const result = await db
    .update(masterResume)
    .set(newMasterResume)
    .where(eq(masterResume.id, newMasterResume.id))
    .returning();
  if (!result[0]) {
    throw new Error("Master resume not found");
  }
  return result[0];
};
