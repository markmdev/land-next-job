"use client";

import { Switch } from "@/components/ui/switch";
import { AdaptedResumeDTO } from "@/types/adapted-resume";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { FileText, Edit, Eye } from "lucide-react";
import { updateAdaptedResumeAction } from "@/lib/actions/adapted-resume";
import SaveChanges from "./save-changes";

export default function AdaptedResume({
  adaptedResumeProp,
}: {
  adaptedResumeProp: AdaptedResumeDTO;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [adaptedResume, setAdaptedResume] = useState(adaptedResumeProp);
  const [updateErrors, setUpdateErrors] = useState<string | null>(null);

  useEffect(() => {
    setAdaptedResume(adaptedResumeProp);
  }, [adaptedResumeProp]);

  const handleUpdateAdaptedResume = async () => {
    setUpdateErrors(null);
    const result = await updateAdaptedResumeAction(adaptedResume);
    if (result.error) {
      setUpdateErrors(result.error);
    }
  };
  return (
    <Card className="w-full md:w-1/2 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">Adapted Resume</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Tailored for this position
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Switch
              checked={isEditing}
              onCheckedChange={setIsEditing}
              className="data-[state=checked]:bg-green-600"
            />
            <div className="flex items-center gap-2 text-sm font-medium">
              {isEditing ? (
                <>
                  <Edit className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-600">Edit</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">View</span>
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
              value={adaptedResume.markdownContent}
              onChange={(e) =>
                setAdaptedResume({ ...adaptedResume, markdownContent: e.target.value })
              }
              className="min-h-[300px] resize-none border-2 focus:border-green-500 transition-colors"
              placeholder="Enter your adapted resume content here..."
            />
          ) : (
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-950 min-h-[300px] whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {adaptedResume.markdownContent ||
                "No adapted resume content yet. Switch to edit mode to create a tailored version."}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <SaveChanges
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSaveChanges={handleUpdateAdaptedResume}
        />
        {updateErrors && <p className="text-red-500">{updateErrors}</p>}
      </CardFooter>
    </Card>
  );
}
