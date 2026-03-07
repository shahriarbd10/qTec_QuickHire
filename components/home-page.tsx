import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { JobCard } from "@/components/job-card";
import { LatestJobRow } from "@/components/latest-job-row";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { categories, getJobs, trustedCompanies } from "@/lib/data";

export async function HomePage() {
  const jobs = await getJobs();
  const featuredJobs = jobs.filter((job) => job.featured).slice(0, 8);
  const latestJobs = jobs.filter((job) => job.latest).slice(0, 8);

  return (
    <main>
      <section className="relative overflow-hidden bg-surface">
        <SiteHeader />
        <div className="container-shell relative grid gap-6 pb-16 pt-4 lg:grid-cols-[1fr_520px] lg:items-center lg:gap-10 lg:pb-0">
          <div className="relative z-30 max-w-[760px] py-4 md:py-10 lg:py-16">
            <h1 className="max-w-[470px] text-[3.2rem] font-semibold leading-[0.92] tracking-tightish text-ink sm:text-[5.15rem]">
              Discover more than <span className="text-accent">5000+ Jobs</span>
            </h1>
            <div className="relative mt-4 h-4 w-[250px] sm:w-[400px]">
              <Image
                src="/images/hero/underline.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="310px"
              />
            </div>
            <p className="mt-7 max-w-[470px] text-[1rem] leading-[1.65] tracking-snug text-muted">
              Great platform for the job seeker that searching for new career heights about startups.
            </p>
            <form action="/jobs" className="relative z-40 mt-8 max-w-[1120px] lg:w-[calc(100%+160px)] lg:max-w-none">
              <div className="grid min-h-[60px] gap-0 border border-[#e7e8ee] bg-white shadow-[0_18px_40px_rgba(31,41,64,0.08)] sm:grid-cols-[1.82fr_1.62fr_1.4fr]">
                <label className="flex h-[58px] items-center gap-3 border-b border-[#e7e8ee] px-5 text-sm text-muted sm:border-b-0 sm:border-r">
                  <Search className="h-5 w-5 shrink-0 text-ink" />
                  <span className="flex w-full flex-col">
                    <input
                      name="q"
                      type="text"
                      placeholder="Job title or keyword"
                      className="w-full border-0 bg-transparent pb-2 text-[14px] font-medium tracking-snug text-ink outline-none placeholder:font-medium placeholder:text-[14px] placeholder:tracking-snug placeholder:text-[#969ead] placeholder:opacity-100"
                    />
                    <span className="block h-px w-full bg-[#dfe3ec]" />
                  </span>
                </label>
                <label className="relative flex h-[58px] items-center gap-3 border-b border-[#e7e8ee] px-5 text-sm text-ink sm:border-b-0 sm:border-r">
                  <MapPin className="h-5 w-5 shrink-0 text-ink" />
                  <span className="flex w-full flex-col">
                    <select
                      name="location"
                      defaultValue="Florence, Italy"
                      className="w-full appearance-none border-0 bg-transparent pb-2 pr-8 text-[14px] font-medium tracking-snug text-ink outline-none"
                    >
                      <option>Florence, Italy</option>
                      <option>Paris, France</option>
                      <option>San Francisco, USA</option>
                      <option>Hamburg, Germany</option>
                      <option>Lucern, Switzerland</option>
                      <option>Ontario, Canada</option>
                    </select>
                    <span className="block h-px w-full bg-[#dfe3ec]" />
                  </span>
                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0ae]" />
                </label>
                <div className="flex items-center p-[8px]">
                  <button
                    type="submit"
                    className="flex h-[42px] w-full items-center justify-center whitespace-nowrap bg-brand px-10 text-[14px] font-semibold tracking-snug leading-none text-white"
                  >
                    Search my job
                  </button>
                </div>
              </div>
            </form>
            <p className="mt-4 text-[14px] tracking-snug text-muted">
              Popular: UI Designer, UX Researcher, Android, Admin
            </p>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[520px] self-end overflow-hidden lg:-ml-2">
            <div className="pointer-events-none absolute right-[-2%] top-[4%] hidden h-[72%] w-[108%] lg:block">
              <Image
                src="/images/hero/shape-lines.png"
                alt=""
                fill
                className="object-contain object-right"
                sizes="560px"
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-[132px] w-[74%] sm:h-[168px]">
              <Image
                src="/images/hero/bottom-slope.png"
                alt=""
                fill
                className="object-contain object-right-bottom"
                sizes="520px"
              />
            </div>
            <div className="relative z-10 mx-auto hidden h-[430px] w-[286px] sm:h-[590px] sm:w-[408px] lg:ml-2 lg:-mb-4 lg:block">
              <Image
                src="/images/hero/person.png"
                alt="Confident job seeker"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 768px) 286px, 408px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="companies" className="container-shell py-10 sm:py-16">
        <p className="text-sm text-muted">Companies we helped grow</p>
        <div className="mt-6 grid grid-cols-2 items-center gap-8 sm:grid-cols-5">
          {trustedCompanies.map((company) => (
            <div key={company.name} className="relative h-10 w-full grayscale opacity-60">
              <Image
                src={company.src}
                alt={company.name}
                fill
                className="object-contain object-left sm:object-center"
                sizes="(max-width: 640px) 120px, 180px"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-8 sm:py-16">
        <div className="flex items-center justify-between gap-6">
          <h2 className="section-title">
            Explore by <span>category</span>
          </h2>
          <Link href="/jobs" className="hidden text-sm font-medium text-brand sm:block">
            Show all jobs →
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
        <Link href="/jobs" className="mt-5 inline-block text-sm font-medium text-brand sm:hidden">
          Show all jobs →
        </Link>
      </section>

      <section className="container-shell py-8 sm:py-12">
        <div className="overflow-hidden bg-brand text-white">
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1fr_1.25fr] lg:px-12">
            <div className="self-center">
              <h2 className="max-w-xs text-4xl font-semibold leading-tight tracking-[-0.025em]">
                Start posting jobs today
              </h2>
              <p className="mt-5 text-[0.95rem] font-normal tracking-[-0.01em] text-white/80">
                Start posting jobs for only $10.
              </p>
              <Link
                href="/admin"
                className="mt-8 inline-block bg-white px-5 py-3 text-sm font-semibold text-brand"
              >
                Sign Up For Free
              </Link>
            </div>
            <div className="relative min-h-[220px] bg-white/10 p-4">
              <div className="h-full w-full bg-white p-4 shadow-card">
                <div className="grid h-full grid-cols-[180px_1fr] gap-4 text-ink">
                  <div className="border-r border-border pr-3 text-xs text-muted">
                    <div className="space-y-3">
                      <div className="h-5 w-24 rounded bg-brand/10" />
                      <div className="h-4 w-20 rounded bg-surface" />
                      <div className="h-4 w-16 rounded bg-surface" />
                      <div className="h-4 w-24 rounded bg-surface" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {["76", "3", "24"].map((value) => (
                        <div key={value} className="bg-surface p-3">
                          <div className="text-lg font-semibold">{value}</div>
                          <div className="mt-2 h-2 w-full rounded bg-brand/20" />
                        </div>
                      ))}
                    </div>
                    <div className="grid h-28 grid-cols-8 items-end gap-2">
                      {[65, 88, 72, 94, 60, 52, 79, 43].map((size, index) => (
                        <div
                          key={index}
                          className="rounded-t bg-[#f4b63d]"
                          style={{ height: `${size}%` }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[12, 67, 654].map((value) => (
                        <div key={value} className="bg-surface p-3">
                          <div className="text-lg font-semibold">{value}</div>
                          <div className="mt-2 h-2 w-2/3 rounded bg-accent/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-8 sm:py-16">
        <div className="flex items-center justify-between gap-6">
          <h2 className="section-title">
            Featured <span>jobs</span>
          </h2>
          <Link href="/jobs" className="hidden text-sm font-medium text-brand sm:block">
            Show all jobs →
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <Link href="/jobs" className="mt-5 inline-block text-sm font-medium text-brand sm:hidden">
          Show all jobs →
        </Link>
      </section>

      <section className="relative overflow-hidden py-8 sm:py-16">
        <div className="container-shell relative">
          <div className="flex items-center justify-between gap-6">
            <h2 className="section-title">
              Latest <span>jobs open</span>
            </h2>
            <Link href="/jobs" className="hidden text-sm font-medium text-brand sm:block">
              Show all jobs →
            </Link>
          </div>
          <div className="mt-10 grid gap-4 xl:grid-cols-2">
            {latestJobs.map((job) => (
              <LatestJobRow key={job.id} job={job} />
            ))}
          </div>
          <Link href="/jobs" className="mt-5 inline-block text-sm font-medium text-brand sm:hidden">
            Show all jobs →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
