"use client";

import { MasterResumeDTO } from "@/types/master-resume";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useEffect } from "react";
import { FileText, Edit, Eye } from "lucide-react";
import { updateMasterResumeAction } from "@/lib/actions/master-resume";
import SaveChanges from "@/components/custom/save-changes";

export default function MasterResume({
  masterResume: resumeProp,
}: {
  masterResume: MasterResumeDTO;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [masterResume, setMasterResume] = useState(resumeProp);
  const [updateErrors, setUpdateErrors] = useState<string | null>(null);

  useEffect(() => {
    setMasterResume(resumeProp);
  }, [resumeProp]);

  const handleUpdateMasterResume = async () => {
    setUpdateErrors(null);
    const result = await updateMasterResumeAction(masterResume);
    if (result.error) {
      setUpdateErrors(result.error);
    }
  };

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">Master Resume</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Your comprehensive resume template
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Switch
              checked={isEditing}
              onCheckedChange={setIsEditing}
              className="data-[state=checked]:bg-blue-600"
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
              value={masterResume.markdownContent}
              onChange={(e) =>
                setMasterResume({ ...masterResume, markdownContent: e.target.value })
              }
              className="min-h-[300px] resize-none border-2 focus:border-blue-500 transition-colors"
              placeholder="Enter your resume content here..."
            />
          ) : (
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-950 min-h-[300px] whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {masterResume.markdownContent ||
                "No content yet. Switch to edit mode to add your resume content."}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <SaveChanges
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSaveChanges={handleUpdateMasterResume}
        />
        {updateErrors && <p className="text-red-500">{updateErrors}</p>}
      </CardFooter>
    </Card>
  );
}
