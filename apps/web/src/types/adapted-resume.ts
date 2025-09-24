import { adaptedResume } from "@/lib/db/schema";

export type AdaptedResumeDTO = typeof adaptedResume.$inferSelect;
export type AdaptedResumeUpdateDTO = typeof adaptedResume.$inferInsert;
