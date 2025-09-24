"use client";

import { useState, useEffect } from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { JobPostingDTO } from "@/types/job-postings";
import { FileText } from "lucide-react";

function JobPostingsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <SidebarMenuItem key={`skeleton-${i}`}>
          <div className="flex items-center gap-3 py-2 px-3">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-4 flex-1" />
          </div>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export function JobPostingsList() {
  const [jobPostings, setJobPostings] = useState<JobPostingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await fetch("/api/postings");
        const data = await response.json();
        if (response.ok) {
          setJobPostings(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.error("Failed to fetch job postings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  if (error) {
    return <div className="px-3 py-2 text-xs text-red-500 dark:text-red-400 italic">{error}</div>;
  }

  return (
    <SidebarMenu>
      {isLoading ? (
        <JobPostingsSkeleton />
      ) : (
        <>
          {jobPostings.map((item: JobPostingDTO, index: number) => (
            <SidebarMenuItem key={`posting-${item.id}-${index}-${item.title}`}>
              <SidebarMenuButton
                asChild
                className="hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-200 hover:translate-x-1"
              >
                <a href={"/postings/" + item.id} className="flex items-center gap-3 py-2 group">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-md group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-sm truncate" title={item.title}>
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {jobPostings.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 italic">
              No job postings yet
            </div>
          )}
        </>
      )}
    </SidebarMenu>
  );
}
