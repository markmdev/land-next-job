"use client";

import { Plus } from "lucide-react";

type CreateNewPostingProps = {
  onCreate: () => Promise<void> | void;
  isCreating?: boolean;
};

export default function CreateNewPosting({ onCreate, isCreating = false }: CreateNewPostingProps) {
  return (
    <div
      onClick={() => {
        if (!isCreating) {
          void onCreate();
        }
      }}
      role="button"
      aria-label="Create new job posting"
      aria-busy={isCreating}
      className="cursor-pointer text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 disabled:cursor-not-allowed"
    >
      <Plus className={`h-4 w-4 ${isCreating ? "animate-pulse" : ""}`} />
    </div>
  );
}
