function JobsCardSkeleton() {
  return (
    <div className="min-h-[283px] animate-pulse rounded-[1.5rem] border border-border bg-white p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="h-12 w-12 rounded-full bg-slate-200" />
        <div className="h-8 w-20 rounded-full bg-slate-200" />
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-6 w-3/4 rounded bg-slate-200" />
        <div className="h-5 w-2/3 rounded bg-slate-100" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-[92%] rounded bg-slate-100" />
          <div className="h-4 w-[68%] rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-8 w-24 rounded-full bg-slate-100" />
        <div className="h-8 w-28 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function JobsLoading() {
  return (
    <main>
      <section className="bg-surface">
        <div className="container-shell pb-16 pt-10">
          <div className="max-w-3xl animate-pulse">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="mt-4 h-12 w-[28rem] max-w-full rounded bg-slate-200" />
            <div className="mt-4 h-5 w-[36rem] max-w-full rounded bg-slate-100" />
          </div>
          <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-white p-5 shadow-card md:grid-cols-[1.5fr_1fr_1fr_auto]">
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-100" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <JobsCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
