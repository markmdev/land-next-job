import AdaptedResume from "@/components/custom/adapted-resume";
import JobPostingDetails from "@/components/custom/job-posting-details";
import { getAdaptedResumeByJobPostingId } from "@/lib/db/queries/adapted-resume";
import { getJobPostingById } from "@/lib/db/queries/job-postings";

export default async function ResumePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const jobPosting = await getJobPostingById(resolvedParams.id);
  const adaptedResume = await getAdaptedResumeByJobPostingId(resolvedParams.id);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full animate-in fade-in-50 duration-500">
      <JobPostingDetails jobPostingProp={jobPosting} />
      <AdaptedResume adaptedResumeProp={adaptedResume} />
    </div>
  );
}
