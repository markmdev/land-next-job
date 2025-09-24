import { text, uuid, pgTable } from "drizzle-orm/pg-core";

export const masterResume = pgTable("masterResume", {
  id: uuid("id").primaryKey(),
  markdownContent: text("markdownContent").notNull(),
});

export const jobPosting = pgTable("jobPosting", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  postingText: text("postingText").notNull(),
});

export const adaptedResume = pgTable("adaptedResume", {
  id: uuid("id").primaryKey(),
  jobPostingId: uuid("jobPostingId")
    .references(() => jobPosting.id)
    .notNull(),
  markdownContent: text("markdownContent").notNull(),
});
