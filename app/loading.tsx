function HomeFeaturedCardSkeleton() {
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
          <div className="h-4 w-[90%] rounded bg-slate-100" />
          <div className="h-4 w-[62%] rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-8 w-24 rounded-full bg-slate-100" />
        <div className="h-8 w-28 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

function HomeLatestRowSkeleton() {
  return (
    <div className="animate-pulse bg-white px-6 py-6 sm:min-h-[149px] sm:px-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="h-16 w-16 rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-6 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-5 w-1/2 rounded bg-slate-100" />
          <div className="mt-4 flex gap-3">
            <div className="h-8 w-20 rounded-full bg-slate-100" />
            <div className="h-8 w-24 rounded-full bg-slate-100" />
            <div className="h-8 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <main>
      <section className="bg-white">
        <div className="relative mx-auto max-w-[1240px] overflow-hidden bg-[#f8f8fd]">
          <div className="container-shell py-6 lg:py-0">
            <div className="flex h-[78px] animate-pulse items-center justify-between">
              <div className="h-10 w-32 rounded bg-slate-200" />
              <div className="hidden gap-8 md:flex">
                <div className="h-5 w-20 rounded bg-slate-100" />
                <div className="h-5 w-36 rounded bg-slate-100" />
              </div>
              <div className="hidden items-center gap-4 md:flex">
                <div className="h-6 w-14 rounded bg-slate-100" />
                <div className="h-12 w-28 rounded bg-slate-200" />
              </div>
            </div>
            <div className="grid gap-8 pb-16 pt-4 lg:grid-cols-[629px_minmax(0,1fr)] lg:items-start lg:gap-0 lg:pb-0">
              <div className="max-w-[852px] py-2 md:py-8 lg:pt-[56px]">
                <div className="h-20 w-full max-w-[540px] animate-pulse rounded bg-slate-200 sm:h-28" />
                <div className="mt-6 h-4 w-48 animate-pulse rounded bg-slate-100" />
                <div className="mt-8 h-6 w-full max-w-[520px] animate-pulse rounded bg-slate-100" />
                <div className="mt-10 grid gap-0 border border-[#e7e8ee] bg-white p-3 shadow-card sm:grid-cols-[1fr_1fr_193px]">
                  <div className="h-[54px] animate-pulse rounded bg-slate-100" />
                  <div className="h-[54px] animate-pulse rounded bg-slate-100 sm:ml-3" />
                  <div className="h-[54px] animate-pulse rounded bg-slate-200 sm:ml-3" />
                </div>
                <div className="mt-5 h-4 w-72 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="hidden h-[640px] items-end justify-center lg:flex">
                <div className="h-[520px] w-[360px] animate-pulse rounded-[2rem] bg-slate-200/70" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="h-5 w-56 animate-pulse rounded bg-slate-100" />
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </section>

      <section className="container-shell py-8 sm:py-16">
        <div className="flex items-center justify-between gap-6">
          <div className="h-12 w-72 animate-pulse rounded bg-slate-200" />
          <div className="hidden h-5 w-28 animate-pulse rounded bg-slate-100 sm:block" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[214px] animate-pulse rounded-[1.5rem] border border-border bg-white" />
          ))}
        </div>
      </section>

      <section className="container-shell py-8 sm:py-16">
        <div className="flex items-center justify-between gap-6">
          <div className="h-12 w-72 animate-pulse rounded bg-slate-200" />
          <div className="hidden h-5 w-28 animate-pulse rounded bg-slate-100 sm:block" />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <HomeFeaturedCardSkeleton key={index} />
          ))}
        </div>
      </section>

      <section className="bg-white pt-8 sm:pt-16">
        <div className="relative mx-auto max-w-[1240px] overflow-hidden">
          <div className="px-4 py-8 sm:px-8 sm:py-16 lg:px-[96px]">
            <div className="flex items-center justify-between gap-6">
              <div className="h-12 w-72 animate-pulse rounded bg-slate-200" />
              <div className="hidden h-5 w-28 animate-pulse rounded bg-slate-100 sm:block" />
            </div>
            <div className="mt-10 grid gap-4 xl:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <HomeLatestRowSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
