import MasterResume from "@/components/custom/master-resume";
import { getMasterResume } from "@/lib/db/queries/master-resume";

export default async function Home() {
  const masterResume = await getMasterResume();

  return (
    <div className="animate-in fade-in-50 duration-500">
      <MasterResume masterResume={masterResume} />
    </div>
  );
}
