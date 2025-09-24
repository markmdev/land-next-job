import { masterResume } from "@/lib/db/schema";

export type MasterResumeDTO = typeof masterResume.$inferSelect;
export type MasterResumeUpdateDTO = typeof masterResume.$inferInsert;
