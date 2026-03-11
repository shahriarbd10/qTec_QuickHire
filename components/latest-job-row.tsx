import Image from "next/image";
import { PendingLink } from "@/components/ui/pending-link";
import { Job } from "@/lib/types";

function getSecondaryTag(job: Job) {
  if (job.category === "Engineering" || job.category === "Technology") {
    return "Design";
  }

  if (job.category === "Human Resource" || job.category === "Business") {
    return "Operations";
  }

  return "Design";
}

export function LatestJobRow({ job }: { job: Job }) {
  return (
    <PendingLink
      href={`/jobs/${job.id}`}
      overlay
      className="flex flex-col gap-5 bg-white px-6 py-6 transition hover:-translate-y-1 hover:shadow-card sm:min-h-[149px] sm:flex-row sm:items-start sm:gap-6 sm:px-10 sm:py-6"
      pendingClassName="shadow-card ring-2 ring-brand/15"
    >
      {job.logoUrl ? (
        <Image
          src={job.logoUrl}
          alt={job.company}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full border border-border object-cover"
        />
      ) : (
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[24px] font-semibold text-white"
          style={{ backgroundColor: job.color }}
        >
          {job.logoText}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3
          className="line-clamp-1 text-[20px] font-semibold leading-[1.2] tracking-normal text-ink"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          {job.title}
        </h3>
        <p
          className="mt-2 text-[16px] font-normal leading-[1.6] tracking-normal text-[#515b6f]"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          {job.company} • {job.location}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
          <span
            className="inline-flex min-h-[34px] shrink-0 items-center justify-center whitespace-nowrap rounded-[80px] bg-[rgba(86,205,173,0.1)] px-[10px] text-[14px] font-semibold leading-[1.6] tracking-normal text-[#56cdad]"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {job.type}
          </span>
          <span className="hidden h-[34px] w-px shrink-0 bg-[#d6ddeb] sm:block" />
          <span
            className="inline-flex min-h-[34px] shrink-0 items-center justify-center whitespace-nowrap rounded-[80px] border border-[#ffb836] px-[10px] text-[14px] font-semibold leading-[1.6] tracking-normal text-[#ffb836]"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {job.category}
          </span>
          <span
            className="inline-flex min-h-[34px] shrink-0 items-center justify-center whitespace-nowrap rounded-[80px] border border-brand px-[10px] text-[14px] font-semibold leading-[1.6] tracking-normal text-brand"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {getSecondaryTag(job)}
          </span>
        </div>
      </div>
    </PendingLink>
  );
}
