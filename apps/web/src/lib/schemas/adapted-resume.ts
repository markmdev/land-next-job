import { z } from "zod";

export const adaptedResumeSchema = z.object({
  id: z.uuid(),
  jobPostingId: z.uuid(),
  markdownContent: z.string().max(6000),
});
