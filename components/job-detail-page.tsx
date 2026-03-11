// Copyright (c) Shahriar Hossain. All rights reserved. Contact: shahriarsgr@gmail.com
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Job } from "@/lib/types";

export function JobDetailPage({ job }: { job: Job }) {
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      jobId: job.id,
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      resumeLink: String(formData.get("resumeLink") || ""),
      coverNote: String(formData.get("coverNote") || ""),
    };

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Could not submit your application.");
      setSubmitting(false);
      return;
    }

    setStatus("Application submitted successfully.");
    event.currentTarget.reset();
    setSubmitting(false);
  }

  return (
    <main>
      <section className="bg-surface">
        <SiteHeader />
        <div className="container-shell pb-14 pt-6">
          <Link href="/jobs" className="text-sm font-medium text-brand">
            ← Back to jobs
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-border bg-white p-8 shadow-card">
              <div className="flex flex-wrap items-center gap-4">
                {job.logoUrl ? (
                  <Image src={job.logoUrl} alt={job.company} width={64} height={64} className="h-16 w-16 rounded-full border border-border object-cover" />
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-white"
                    style={{ backgroundColor: job.color }}
                  >
                    {job.logoText}
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold tracking-[-0.04em]">{job.title}</h1>
                  <p className="mt-2 text-base text-muted">
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="pill bg-[#e8faf0] text-[#5fbf86]">{job.type}</span>
                <span className="pill bg-[#fff4df] text-[#ef9a29]">{job.category}</span>
              </div>
              <div className="mt-10 space-y-5">
                <div>
                  <h2 className="text-xl font-semibold">Job summary</h2>
                  <p className="mt-3 text-base leading-8 text-muted">{job.summary}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Full description</h2>
                  <p className="mt-3 text-base leading-8 text-muted">{job.description}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-white p-8 shadow-card">
              <h2 className="text-3xl font-bold tracking-[-0.04em]">Apply now</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Fill in your basic information and attach a resume URL. Validation is enforced on the API.
              </p>
              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <input
                  name="name"
                  placeholder="Full name"
                  className="h-12 w-full rounded-xl border border-border px-4 outline-none"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="h-12 w-full rounded-xl border border-border px-4 outline-none"
                  required
                />
                <input
                  name="resumeLink"
                  type="url"
                  placeholder="Resume link"
                  className="h-12 w-full rounded-xl border border-border px-4 outline-none"
                  required
                />
                <textarea
                  name="coverNote"
                  placeholder="Cover note"
                  className="min-h-40 w-full rounded-xl border border-border px-4 py-3 outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-white disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit application"}
                </button>
                {status ? <p className="text-sm text-muted">{status}</p> : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
