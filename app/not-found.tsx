import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="max-w-md rounded-[2rem] border border-border bg-white p-10 text-center shadow-card">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-ink">Job not found</h1>
        <p className="mt-4 text-base leading-8 text-muted">
          The role you are looking for is no longer available or the URL is incorrect.
        </p>
        <Link
          href="/jobs"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white"
        >
          Back to jobs
        </Link>
      </div>
    </main>
  );
}
