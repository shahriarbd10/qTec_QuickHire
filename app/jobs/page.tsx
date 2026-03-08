import { JobsPage } from "@/components/jobs-page";
import { getJobs } from "@/lib/data";

export default async function JobsRoute({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; q?: string; location?: string }>;
}) {
  const jobs = await getJobs();
  const params = (await searchParams) ?? {};
  return (
    <JobsPage
      jobs={jobs}
      initialCategory={params.category}
      initialQuery={params.q}
      initialLocation={params.location}
    />
  );
}
