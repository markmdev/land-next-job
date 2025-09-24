import { z } from "zod";

export const jobPostingSchema = z.object({
  id: z.uuid(),
  title: z.string().max(70),
  url: z.string().max(70),
  postingText: z.string().max(2000),
});
