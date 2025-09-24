import { jobPosting } from "@/lib/db/schema";

export type JobPostingUpdateDTO = typeof jobPosting.$inferInsert;
export type JobPostingDTO = typeof jobPosting.$inferSelect;
