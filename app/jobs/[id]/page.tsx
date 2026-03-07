import { notFound } from "next/navigation";
import { JobDetailPage } from "@/components/job-detail-page";
import { getJobById } from "@/lib/data";

export default async function JobDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return <JobDetailPage job={job} />;
}
