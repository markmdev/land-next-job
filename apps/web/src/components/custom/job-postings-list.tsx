"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { JobPostingDTO } from "@/types/job-postings";
import { FileText } from "lucide-react";
import Link from "next/link";

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

type JobPostingsListProps = {
  jobPostings: JobPostingDTO[];
  isLoading: boolean;
  error: string | null;
};

export function JobPostingsList({ jobPostings, isLoading, error }: JobPostingsListProps) {
  if (error) {
    return <div className="px-3 py-2 text-xs text-red-500 dark:text-red-400 italic">{error}</div>;
  }

  return (
    <SidebarMenu>
      {isLoading ? (
        <JobPostingsSkeleton />
      ) : (
        <>
          {jobPostings.map((item: JobPostingDTO) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                className="hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-200 hover:translate-x-1"
              >
                <Link href={"/postings/" + item.id} className="flex items-center gap-3 py-2 group">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-md group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-sm truncate" title={item.title}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {jobPostings.length === 0 && !isLoading && (
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 italic">
              No job postings yet
            </div>
          )}
        </>
      )}
    </SidebarMenu>
  );
}
