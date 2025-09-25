import { z } from "zod";

export const masterResumeSchema = z.object({
  id: z.uuid(),
  markdownContent: z.string().max(6000),
});
