"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Trash2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { AuthUser, Job, JobCategory, JobType } from "@/lib/types";

const defaultForm = {
  title: "",
  location: "",
  category: "Design" as JobCategory,
  type: "Full-Time" as JobType,
  summary: "",
  description: "",
  logoUrl: "",
  logoPublicId: "",
  featured: false,
  latest: false,
};

export function AdminPage({
  initialJobs,
  currentUser,
}: {
  initialJobs: Job[];
  currentUser: AuthUser;
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Could not create the job.");
      return;
    }

    setJobs((current) => [result.data, ...current]);
    setForm({ ...defaultForm });
    setStatus("Job created.");
  }

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const response = await fetch("/api/uploads/job-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUri: String(reader.result) }),
      });
      const result = await response.json();
      setUploading(false);

      if (!response.ok) {
        setStatus(result.message || "Logo upload failed.");
        return;
      }

      setForm((current) => ({
        ...current,
        logoUrl: result.url,
        logoPublicId: result.publicId,
      }));
      setStatus("Logo uploaded.");
    };

    reader.readAsDataURL(file);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Could not delete the job.");
      return;
    }

    setJobs((current) => current.filter((job) => job.id !== id));
    setStatus("Job deleted.");
  }

  return (
    <main>
      <section className="bg-surface">
        <SiteHeader />
        <div className="container-shell pb-14 pt-6">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand">Admin</p>
            <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em] text-ink">
              Manage QuickHire jobs
            </h1>
            <p className="mt-4 text-base leading-8 text-muted">
              Manage job listings for {currentUser.company} through the assessment API.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span>{currentUser.name}</span>
              <span>{currentUser.email}</span>
              <button type="button" onClick={handleLogout} className="font-semibold text-brand">
                Logout
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-border bg-white p-8 shadow-card"
            >
              <h2 className="text-2xl font-semibold">Create job</h2>
              <div className="mt-6 grid gap-4">
                {[
                  ["title", "Job title"],
                  ["location", "Location"],
                  ["summary", "Short summary"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    value={form[key as keyof typeof defaultForm] as string}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    placeholder={label}
                    className="h-12 rounded-xl border border-border px-4 outline-none"
                    required
                  />
                ))}

                <div className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-muted">
                  Posting as <span className="font-semibold text-ink">{currentUser.company}</span>
                </div>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value as JobCategory,
                    }))
                  }
                  className="h-12 rounded-xl border border-border px-4 outline-none"
                >
                  {[
                    "Design",
                    "Sales",
                    "Marketing",
                    "Finance",
                    "Technology",
                    "Engineering",
                    "Business",
                    "Human Resource",
                  ].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>

                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as JobType,
                    }))
                  }
                  className="h-12 rounded-xl border border-border px-4 outline-none"
                >
                  {["Full-Time", "Part-Time", "Remote"].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, featured: event.target.checked }))
                      }
                    />
                    Featured job
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.latest}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, latest: event.target.checked }))
                      }
                    />
                    Latest jobs section
                  </label>
                </div>

                <label className="rounded-xl border border-dashed border-border px-4 py-4 text-sm text-muted">
                  <span className="block font-medium text-ink">Company logo</span>
                  <span className="mt-1 block">Upload to Cloudinary for this project</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mt-3 block w-full text-sm"
                  />
                </label>

                {form.logoUrl ? (
                  <Image
                    src={form.logoUrl}
                    alt="Uploaded logo"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-xl border border-border object-cover"
                  />
                ) : null}

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Full description"
                  className="min-h-40 rounded-xl border border-border px-4 py-3 outline-none"
                  required
                />

                <button className="h-12 rounded-xl bg-brand text-sm font-semibold text-white">
                  {uploading ? "Uploading..." : "Create job"}
                </button>
                {status ? <p className="text-sm text-muted">{status}</p> : null}
              </div>
            </form>

            <div className="rounded-[2rem] border border-border bg-white p-8 shadow-card">
              <h2 className="text-2xl font-semibold">Current jobs</h2>
              <div className="mt-6 space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {job.company} {" • "} {job.location} {" • "} {job.category}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
