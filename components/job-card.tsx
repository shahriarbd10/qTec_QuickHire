import Image from "next/image";
import Link from "next/link";
import { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block h-full min-h-[283px] overflow-hidden border border-[#d6ddeb] bg-white p-6 transition hover:-translate-y-1 hover:shadow-card sm:w-full sm:max-w-[274px]"
    >
      <div className="flex items-start justify-between gap-6">
        {job.logoUrl ? (
          <Image
            src={job.logoUrl}
            alt={job.company}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border border-border object-cover"
          />
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white"
            style={{ backgroundColor: job.color }}
          >
            {job.logoText}
          </div>
        )}
        <span
          className="inline-flex h-[34px] shrink-0 items-center justify-center border border-brand px-3 text-[16px] font-normal leading-[1.6] tracking-normal text-brand"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          {job.type}
        </span>
      </div>
      <div className="mt-4">
        <h3
          className="text-[18px] font-semibold leading-[1.6] tracking-normal text-ink"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          {job.title}
        </h3>
        <p
          className="mt-0.5 line-clamp-1 text-[16px] font-normal leading-[1.6] tracking-normal text-[#515b6f]"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          {job.company} • {job.location}
        </p>
        <p
          className="mt-4 line-clamp-2 text-[16px] font-normal leading-[1.6] tracking-normal text-[#7c8493]"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          {job.summary}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className="inline-flex h-[30px] items-center justify-center rounded-[80px] bg-[rgba(86,205,173,0.1)] px-4 text-[14px] font-semibold leading-[1.6] tracking-normal text-[#56cdad]"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          Full-Time
        </span>
        <span
          className="inline-flex h-[30px] items-center justify-center rounded-[80px] bg-[#fff4df] px-4 text-[14px] font-semibold leading-[1.6] tracking-normal text-[#ef9a29]"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          {job.category}
        </span>
      </div>
    </Link>
  );
}
