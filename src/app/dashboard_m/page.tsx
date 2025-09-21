import { readFile } from "node:fs/promises";
import path from "node:path";

import { DashboardClient } from "./dashboard-client";

async function loadFile(relativePath: string) {
  try {
    const filePath = path.join(process.cwd(), relativePath);
    return await readFile(filePath, "utf8");
  } catch (error) {
    console.error(`Failed to read ${relativePath}`, error);
    return "";
  }
}

export default async function DashboardPage() {
  const [initialResume, initialJobPosting] = await Promise.all([
    loadFile("data/resume.md"),
    loadFile("data/job-posting.md"),
  ]);

  return (
    <DashboardClient initialResume={initialResume} initialJobPosting={initialJobPosting} />
  );
}
