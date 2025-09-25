"use client";

import { Briefcase, Edit, Eye, Pencil } from "lucide-react";
import { JobPostingDTO } from "@/types/job-postings";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { updateJobPostingAction } from "@/lib/actions/job-posting";
import SaveChanges from "@/components/custom/save-changes";
import { Input } from "@/components/ui/input";

export default function JobPostingDetails({ jobPostingProp }: { jobPostingProp: JobPostingDTO }) {
  const [isEditing, setIsEditing] = useState(false);
  const [jobPosting, setJobPosting] = useState(jobPostingProp);

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [updateErrors, setUpdateErrors] = useState<string | null>(null);

  const handleUpdateJobPosting = async () => {
    setUpdateErrors(null);
    const result = await updateJobPostingAction(jobPosting);
    if (result.error) {
      setUpdateErrors(result.error);
    }
  };

  return (
    <Card className="w-full md:w-1/2 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">Job Posting</CardTitle>
          </div>
        </div>
        <CardDescription className="mt-2">
          <div className="flex flex-row items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border">
            {isEditingTitle ? (
              <Input
                value={jobPosting.title}
                onChange={(e) => setJobPosting({ ...jobPosting, title: e.target.value })}
                onBlur={() => {
                  handleUpdateJobPosting();
                  setIsEditingTitle(false);
                }}
                className="border-0 bg-transparent font-medium"
              />
            ) : (
              <>
                <span className="font-medium text-gray-700 dark:text-gray-300 flex-1">
                  {jobPosting.title}
                </span>
                <Pencil
                  className="w-4 h-4 cursor-pointer text-purple-600 hover:text-purple-800 transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                />
              </>
            )}
          </div>
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mt-3">
            <Switch
              checked={isEditing}
              onCheckedChange={setIsEditing}
              className="data-[state=checked]:bg-purple-600"
            />
            <div className="flex items-center gap-2 text-sm font-medium">
              {isEditing ? (
                <>
                  <Edit className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-600">Edit</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-600">View</span>
                </>
              )}
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="transition-all duration-300">
          {isEditing ? (
            <Textarea
              value={jobPosting.postingText}
              onChange={(e) => setJobPosting({ ...jobPosting, postingText: e.target.value })}
              className="min-h-[300px] resize-none border-2 focus:border-purple-500 transition-colors"
              placeholder="Enter job posting details here..."
            />
          ) : (
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-950 min-h-[300px] whitespace-pre-wrap text-sm leading-relaxed">
              {jobPosting.postingText || "No job posting content available."}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <SaveChanges
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSaveChanges={handleUpdateJobPosting}
        />
        {updateErrors && <p className="text-red-500">{updateErrors}</p>}
      </CardFooter>
    </Card>
  );
}
