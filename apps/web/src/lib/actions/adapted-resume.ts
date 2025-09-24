"use server";

import { updateAdaptedResume } from "@/lib/db/queries/adapted-resume";
import { AdaptedResumeUpdateDTO } from "@/types/adapted-resume";
import { adaptedResumeSchema } from "@/lib/schemas/adapted-resume";
import { z } from "zod";

export async function updateAdaptedResumeAction(newAdaptedResume: AdaptedResumeUpdateDTO) {
  try {
    console.log("newAdaptedResume", newAdaptedResume);
    const validatedAdaptedResume = adaptedResumeSchema.parse(newAdaptedResume);
    const result = await updateAdaptedResume(validatedAdaptedResume);
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
