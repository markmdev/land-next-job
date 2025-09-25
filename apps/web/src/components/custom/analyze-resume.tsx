"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyzeResume({
  masterResume,
  jobPosting,
}: {
  masterResume: string;
  jobPosting: string;
}) {
  const handleAnalyzeResume = async () => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/optimize`, {
      method: "POST",
      body: JSON.stringify({
        masterResume,
        jobPosting,
      }),
    });
    console.log(result);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Resume</CardTitle>
        <CardDescription>
          Analyze your resume to see how it matches the job posting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <button
            onClick={() => {
              handleAnalyzeResume();
            }}
          >
            Analyze Resume
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
