import Link from "next/link";
import { Job } from "@/lib/types";
import Image from "next/image";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="border border-border bg-white p-5 transition hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
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
        <span className="rounded-sm border border-brand px-3 py-1 text-xs font-medium tracking-normal text-brand">
          {job.type}
        </span>
      </div>
      <div className="mt-5">
        <h3 className="text-[1rem] font-medium tracking-[-0.015em]">{job.title}</h3>
        <p className="mt-1 text-[0.84rem] font-normal tracking-[-0.005em] text-muted">
          {job.company} • {job.location}
        </p>
        <p className="mt-5 line-clamp-3 text-[0.84rem] font-normal leading-6 tracking-[-0.005em] text-muted">
          {job.summary}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="pill bg-[#e8faf0] text-[#5fbf86]">Full-Time</span>
        <span className="pill bg-[#fff4df] text-[#ef9a29]">{job.category}</span>
        <span className="pill border border-brand bg-white text-brand">
          {job.category === "Technology" ? "Technology" : "Design"}
        </span>
      </div>
    </Link>
  );
}
