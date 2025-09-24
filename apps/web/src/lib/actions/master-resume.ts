"use server";

import { updateMasterResume } from "@/lib/db/queries/master-resume";
import { MasterResumeUpdateDTO } from "@/types/master-resume";
import { masterResumeSchema } from "@/lib/schemas/master-resume";
import { z } from "zod";

export async function updateMasterResumeAction(newMasterResume: MasterResumeUpdateDTO) {
  try {
    const validatedMasterResume = masterResumeSchema.parse(newMasterResume);
    const result = await updateMasterResume(validatedMasterResume);
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
