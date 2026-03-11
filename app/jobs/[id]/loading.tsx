export default function JobDetailLoading() {
  return (
    <main>
      <section className="bg-surface">
        <div className="container-shell pb-14 pt-10">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-border bg-white p-8 shadow-card">
              <div className="flex items-center gap-4 animate-pulse">
                <div className="h-16 w-16 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-10 w-3/4 rounded bg-slate-200" />
                  <div className="h-5 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
              <div className="mt-8 flex gap-2">
                <div className="h-8 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-8 w-28 animate-pulse rounded-full bg-slate-100" />
              </div>
              <div className="mt-10 space-y-8">
                <div className="space-y-3 animate-pulse">
                  <div className="h-7 w-40 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-[95%] rounded bg-slate-100" />
                  <div className="h-4 w-[72%] rounded bg-slate-100" />
                </div>
                <div className="space-y-3 animate-pulse">
                  <div className="h-7 w-48 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-[94%] rounded bg-slate-100" />
                  <div className="h-4 w-[88%] rounded bg-slate-100" />
                  <div className="h-4 w-[67%] rounded bg-slate-100" />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-white p-8 shadow-card">
              <div className="space-y-3 animate-pulse">
                <div className="h-10 w-40 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-[84%] rounded bg-slate-100" />
              </div>
              <div className="mt-8 space-y-4">
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
