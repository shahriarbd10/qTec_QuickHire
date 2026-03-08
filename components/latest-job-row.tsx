import Image from "next/image";
import Link from "next/link";
import { Job } from "@/lib/types";

export function LatestJobRow({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="flex flex-col gap-5 bg-white px-6 py-6 transition hover:-translate-y-1 hover:shadow-card sm:h-[149px] sm:flex-row sm:items-start sm:gap-6 sm:px-10 sm:py-6"
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
          className="flex h-16 w-16 items-center justify-center rounded-full text-[24px] font-semibold text-white"
          style={{ backgroundColor: job.color }}
        >
          {job.logoText}
        </div>
      )}
      <div className="flex-1">
        <h3
          className="text-[20px] font-semibold leading-[1.2] tracking-normal text-ink"
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
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className="inline-flex h-[34px] items-center justify-center rounded-[80px] bg-[rgba(86,205,173,0.1)] px-[10px] text-[14px] font-semibold leading-[1.6] tracking-normal text-[#56cdad]"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {job.type}
          </span>
          <span className="hidden h-[34px] w-px bg-[#d6ddeb] sm:block" />
          <span
            className="inline-flex h-[34px] items-center justify-center rounded-[80px] border border-[#ffb836] px-[10px] text-[14px] font-semibold leading-[1.6] tracking-normal text-[#ffb836]"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            Marketing
          </span>
          <span
            className="inline-flex h-[34px] items-center justify-center rounded-[80px] border border-brand px-[10px] text-[14px] font-semibold leading-[1.6] tracking-normal text-brand"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            Design
          </span>
        </div>
      </div>
    </Link>
  );
}
