"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { JobCard } from "@/components/job-card";
import { Job } from "@/lib/types";

export function JobsPage({
  jobs,
  initialCategory,
  initialQuery,
  initialLocation,
}: {
  jobs: Job[];
  initialCategory?: string;
  initialQuery?: string;
  initialLocation?: string;
}) {
  const categories = ["All", ...new Set(jobs.map((job) => job.category))];
  const locations = ["All", ...new Set(jobs.map((job) => job.location))];

  const safeInitialCategory =
    initialCategory && categories.includes(initialCategory) ? initialCategory : "All";
  const safeInitialLocation =
    initialLocation && locations.includes(initialLocation) ? initialLocation : "All";

  const [query, setQuery] = useState(initialQuery ?? "");
  const [category, setCategory] = useState(safeInitialCategory);
  const [location, setLocation] = useState(safeInitialLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesQuery =
        !query ||
        `${job.title} ${job.company} ${job.summary}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || job.category === category;
      const matchesLocation = location === "All" || job.location === location;

      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [category, jobs, location, query]);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const matches = jobs
      .flatMap((job) => [job.title, job.company])
      .filter((value, index, array) => array.indexOf(value) === index)
      .filter((value) => value.toLowerCase().includes(normalized));

    return matches.slice(0, 6);
  }, [jobs, query]);

  return (
    <main>
      <section className="bg-surface">
        <SiteHeader />
        <div className="container-shell pb-16 pt-6">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand">QuickHire</p>
            <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em] text-ink">
              Browse open opportunities
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              Search, filter, and review jobs across design, engineering, marketing, and business roles.
            </p>
          </div>
          <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-white p-5 shadow-card md:grid-cols-[1.5fr_1fr_1fr_auto]">
            <div className="relative">
              <label className="flex items-center gap-3 rounded-xl border border-border px-4">
              <Search className="h-4 w-4 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search title or company"
                className="h-12 w-full border-0 outline-none"
              />
              </label>
              {showSuggestions && suggestions.length ? (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-border bg-white shadow-card">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left font-epilogue text-sm text-[#515b6f] transition hover:bg-[#f7f8fc]"
                    >
                      <span className="truncate">{suggestion}</span>
                      <Search className="h-4 w-4 shrink-0 text-[#a8adb7]" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 rounded-xl border border-border px-4 outline-none"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="h-12 rounded-xl border border-border px-4 outline-none"
            >
              {locations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Link
              href="/admin"
              className="flex h-12 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white"
            >
              Post a job
            </Link>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <p className="text-sm text-muted">
          Showing <span className="font-semibold text-ink">{filteredJobs.length}</span> jobs
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
