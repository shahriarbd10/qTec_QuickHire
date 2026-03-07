import { JobsPage } from "@/components/jobs-page";
import { getJobs } from "@/lib/data";

export default async function JobsRoute() {
  const jobs = await getJobs();
  return <JobsPage jobs={jobs} />;
}
