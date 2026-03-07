import Link from "next/link";
import { Job } from "@/lib/types";
import Image from "next/image";

export function LatestJobRow({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="flex flex-col gap-4 border border-border bg-white p-5 transition hover:-translate-y-1 hover:shadow-card sm:flex-row sm:items-center"
    >
      {job.logoUrl ? (
        <Image src={job.logoUrl} alt={job.company} width={48} height={48} className="h-12 w-12 rounded-full border border-border object-cover" />
      ) : (
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ backgroundColor: job.color }}
        >
          {job.logoText}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-[1.05rem] font-medium tracking-[-0.015em]">{job.title}</h3>
        <p className="mt-1 text-[0.84rem] font-normal tracking-[-0.005em] text-muted">
          {job.company} • {job.location}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="pill bg-[#e8faf0] text-[#5fbf86]">{job.type}</span>
          <span className="pill bg-[#fff4df] text-[#ef9a29]">Marketing</span>
          <span className="pill border border-brand bg-white text-brand">Design</span>
        </div>
      </div>
    </Link>
  );
}
