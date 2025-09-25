"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Briefcase } from "lucide-react";
import { JobPostingDTO } from "@/types/job-postings";
import { createJobPostingAction } from "@/lib/actions/job-posting";
import CreateNewPosting from "./create-new-posting";
import { JobPostingsList } from "./job-postings-list";

async function fetchJobPostings(): Promise<JobPostingDTO[]> {
  const response = await fetch("/api/postings", { cache: "no-store" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "Failed to load job postings" }));
    throw new Error(data.error ?? "Failed to load job postings");
  }
  return response.json();
}

export function JobPostingsSection() {
  const [jobPostings, setJobPostings] = useState<JobPostingDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobPostings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const postings = await fetchJobPostings();
      setJobPostings(postings);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load job postings";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobPostings();
  }, [loadJobPostings]);

  const handleCreate = useCallback(async () => {
    if (isCreating) {
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const result = await createJobPostingAction();
      if (result?.error) {
        throw new Error(result.error);
      }
      await loadJobPostings();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create job posting";
      setError(message);
    } finally {
      setIsCreating(false);
    }
  }, [isCreating, loadJobPostings]);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Job Postings
        </SidebarGroupLabel>
        <SidebarGroupAction asChild>
          <CreateNewPosting onCreate={handleCreate} isCreating={isCreating} />
        </SidebarGroupAction>
      </div>
      <SidebarGroupContent className="flex-1 overflow-y-auto">
        <JobPostingsList jobPostings={jobPostings} isLoading={isLoading} error={error} />
      </SidebarGroupContent>
    </>
  );
}
