import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { JobCard } from "@/components/job-card";
import { LatestJobRow } from "@/components/latest-job-row";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { PendingLink } from "@/components/ui/pending-link";
import { categories, getJobs, trustedCompanies } from "@/lib/data";

export async function HomePage() {
  const jobs = await getJobs();
  const sortedJobs = [...jobs].sort((left, right) => {
    const diff = new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    if (diff !== 0) return diff;
    return String(right.id).localeCompare(String(left.id));
  });

  const primaryFeaturedJobs = sortedJobs.filter((job) => job.featured);
  const fallbackFeaturedJobs = sortedJobs.filter(
    (job) => !primaryFeaturedJobs.some((featuredJob) => featuredJob.id === job.id),
  );
  const featuredJobs = [...primaryFeaturedJobs, ...fallbackFeaturedJobs].slice(0, 8);
  const latestJobs = sortedJobs.filter((job) => job.latest).slice(0, 8);

  return (
    <main>
      <section className="bg-white">
        <div className="relative mx-auto overflow-hidden bg-[#f8f8fd] max-w-[1240px]">
          <SiteHeader />
          <div className="pointer-events-none absolute bottom-0 right-0 z-50 h-[132px] w-[74%] sm:h-[168px] lg:h-[248px] lg:w-[468px]">
            <Image
              src="/images/hero/bottom-slope.png"
              alt=""
              fill
              className="object-contain object-right-bottom"
              sizes="468px"
            />
          </div>
          <div className="container-shell relative grid gap-6 pb-16 pt-0 lg:h-[640px] lg:min-h-0 lg:grid-cols-[629px_minmax(0,1fr)] lg:items-start lg:gap-0 lg:pb-0">
            <div className="relative z-40 max-w-[852px] py-2 md:py-8 lg:pt-[56px]">
            <h1 className="max-w-[470px] text-[3.2rem] font-semibold leading-[0.92] tracking-tightish text-ink sm:text-[5.15rem] lg:max-w-[533px] lg:text-[72px] lg:leading-[1.1] lg:tracking-normal">
              Discover more than <span className="text-accent">5000+ Jobs</span>
            </h1>
            <div className="relative mt-4 h-4 w-[250px] sm:w-[400px] lg:mt-6 lg:h-[18px] lg:w-[410px]">
              <Image
                src="/images/hero/underline.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="410px"
              />
            </div>
            <p
              className="mt-8 max-w-[470px] text-[1rem] leading-[1.65] tracking-snug text-muted lg:max-w-[521px] lg:text-[20px] lg:leading-[1.6] lg:tracking-normal lg:text-[#515b6f] lg:opacity-70"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              Great platform for the job seeker that searching for new career heights about startups.
            </p>
            <form action="/jobs" className="relative z-50 mt-8 max-w-[1120px] lg:mt-10 lg:w-[756px] lg:max-w-none">
              <div className="grid min-h-[60px] gap-0 border border-[#e7e8ee] bg-white shadow-[0_79px_128px_rgba(192,192,192,0.09),0_28.8363px_46.7221px_rgba(192,192,192,0.0598508),0_13.9995px_22.6827px_rgba(192,192,192,0.0475723),0_6.86281px_11.1195px_rgba(192,192,192,0.0380675),0_2.71357px_4.39666px_rgba(192,192,192,0.0270615)] sm:grid-cols-[1fr_1fr_193px] lg:h-[80px] lg:min-h-[80px] lg:p-3">
                <label className="flex h-[58px] items-center gap-3 border-b border-[#e7e8ee] px-5 text-sm text-muted sm:border-b-0 sm:border-r lg:h-[54px] lg:px-4">
                  <Search className="h-5 w-5 shrink-0 text-ink" />
                  <span className="flex w-full flex-col">
                    <input
                      name="q"
                      type="text"
                      placeholder="Job title or keyword"
                      className="w-full border-0 bg-transparent pb-2 text-[14px] font-medium tracking-snug text-ink outline-none placeholder:font-normal placeholder:text-[14px] placeholder:tracking-normal placeholder:text-[#7c8493] placeholder:opacity-50 lg:text-[16px]"
                      style={{ fontFamily: '"Epilogue", sans-serif' }}
                    />
                    <span className="block h-px w-full bg-[#dfe3ec]" />
                  </span>
                </label>
                <label className="relative flex h-[58px] items-center gap-3 border-b border-[#e7e8ee] px-5 text-sm text-ink sm:border-b-0 sm:border-r lg:h-[54px] lg:px-4 lg:pl-6">
                  <MapPin className="h-5 w-5 shrink-0 text-ink" />
                  <span className="flex w-full flex-col">
                    <select
                      name="location"
                      defaultValue="Florence, Italy"
                      className="w-full appearance-none border-0 bg-transparent pb-2 pr-8 text-[14px] font-medium tracking-snug text-ink outline-none lg:text-[16px] lg:font-normal lg:tracking-normal"
                      style={{ fontFamily: '"Epilogue", sans-serif' }}
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
                <div className="flex items-center p-[8px] lg:p-0 lg:pl-4">
                  <button
                    type="submit"
                    className="flex h-[42px] w-full items-center justify-center whitespace-nowrap bg-brand px-10 text-[14px] font-semibold tracking-snug leading-none text-white lg:h-[54px] lg:w-[193px] lg:px-6 lg:text-[16px] lg:font-bold lg:leading-[1.6] lg:tracking-normal"
                    style={{ fontFamily: '"Epilogue", sans-serif' }}
                  >
                    Search my job
                  </button>
                </div>
              </div>
            </form>
            <p
              className="mt-5 text-[14px] tracking-snug text-muted lg:text-[16px] lg:leading-[1.6] lg:tracking-normal lg:text-[#202430] lg:opacity-70"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              Popular: UI Designer, UX Researcher, Android, Admin
            </p>
            </div>
            <div className="relative z-10 mx-auto w-full max-w-[520px] self-end overflow-visible lg:h-[640px] lg:max-w-none">
              <div className="pointer-events-none absolute left-[-320px] top-[-28px] z-30 hidden h-[860px] w-[920px] lg:block">
                <Image
                  src="/images/hero/shape-lines.png"
                  alt=""
                  fill
                  className="object-contain object-left-top"
                  sizes="920px"
                />
              </div>
              <div className="relative z-40 mx-auto hidden h-[430px] w-[286px] sm:h-[590px] sm:w-[408px] lg:absolute lg:left-[0px] lg:top-[52px] lg:block lg:h-[640px] lg:w-[455px]">
                <Image
                  src="/images/hero/person.png"
                  alt="Confident job seeker"
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 286px, 500px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="companies" className="container-shell py-12 sm:py-12 lg:py-12">
        <p
          className="text-[18px] font-normal leading-[1.6] tracking-normal text-muted"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          Companies we helped grow
        </p>
        <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-5 lg:gap-x-14">
          {trustedCompanies.map((company) => (
            <div key={company.name} className="group relative h-10 w-full lg:h-12">
              <Image
                src={company.src}
                alt={company.name}
                fill
                className="object-contain object-left grayscale opacity-35 transition duration-300 ease-out group-hover:opacity-70 sm:object-center"
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
          <PendingLink href="/jobs" className="section-link hidden sm:inline-flex">
            Show all jobs &rarr;
          </PendingLink>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
        <PendingLink href="/jobs" className="section-link mt-5 sm:hidden">
          Show all jobs &rarr;
        </PendingLink>
      </section>

      <section className="container-shell py-8 sm:py-12">
        <div className="relative overflow-hidden text-white">
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/images/posting-section/background-shape.png"
              alt=""
              fill
              className="object-fill"
              sizes="1240px"
            />
          </div>
          <div className="relative grid gap-8 px-8 py-10 lg:grid-cols-[1fr_1.25fr] lg:px-12">
            <div className="self-center">
              <h2 className="max-w-[320px] text-[48px] font-semibold leading-[1.1] tracking-normal">
                Start posting jobs today
              </h2>
              <p
                className="mt-5 text-[16px] font-medium leading-[1.6] tracking-normal text-white/80"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
              >
                Start posting jobs for only $10.
              </p>
              <Link
                href="/admin"
                className="mt-8 inline-flex items-center justify-center bg-white px-5 py-3 text-[16px] font-bold leading-[1.6] tracking-normal text-brand"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
              >
                Sign Up For Free
              </Link>
            </div>
            <div className="relative min-h-[220px] self-end p-0 pt-8 lg:self-end lg:pt-0 lg:-mb-8">
              <div className="group relative h-full min-h-[300px] w-full lg:min-h-[390px] lg:translate-y-4">
                <Image
                  src="/images/posting-section/dashboard.png"
                  alt="QuickHire dashboard preview"
                  fill
                  className="object-contain object-bottom transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03]"
                  sizes="700px"
                />
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
          <PendingLink href="/jobs" className="section-link hidden sm:inline-flex">
            Show all jobs &rarr;
          </PendingLink>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pl-4 pr-6 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] sm:hidden [&::-webkit-scrollbar]:hidden">
          {featuredJobs.map((job) => (
            <div key={job.id} className="w-[286px] shrink-0 snap-start">
              <JobCard job={job} />
            </div>
          ))}
        </div>
        <div className="mt-10 hidden gap-4 md:grid-cols-2 xl:grid-cols-4 sm:grid">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <PendingLink href="/jobs" className="section-link mt-7 sm:hidden">
          Show all jobs &rarr;
        </PendingLink>
      </section>

      <section className="bg-white pt-8 sm:pt-16">
        <div className="relative mx-auto min-h-[720px] max-w-[1240px] overflow-hidden sm:min-h-[877px]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0">
              <Image
                src="/images/latest-jobs/background-base.png"
                alt=""
                fill
                className="object-fill"
                sizes="1440px"
              />
            </div>
            <div className="absolute bottom-0 right-0 hidden h-full w-[520px] xl:block [transform:scaleY(-1)]">
              <div
                className="absolute border-4 border-[#ccccf5]/60"
                style={{
                  width: "192.2px",
                  height: "416.47px",
                  top: "-84px",
                  right: "126px",
                  transform: "rotate(-64deg)",
                  transformOrigin: "center",
                }}
              />
              <div
                className="absolute border-4 border-[#ccccf5]/70"
                style={{
                  width: "319.78px",
                  height: "778.51px",
                  top: "154px",
                  right: "74px",
                  transform: "rotate(-64deg)",
                  transformOrigin: "center",
                }}
              />
              <div
                className="absolute border-4 border-[#ccccf5]/70"
                style={{
                  width: "283.38px",
                  height: "716.25px",
                  top: "542px",
                  right: "-58px",
                  transform: "rotate(-64deg)",
                  transformOrigin: "center",
                }}
              />
            </div>
          </div>
          <div className="relative px-4 py-8 sm:px-8 sm:py-16 lg:px-[96px]">
            <div className="flex items-center justify-between gap-6">
            <h2 className="section-title">
              Latest <span>jobs open</span>
            </h2>
            <PendingLink href="/jobs" className="section-link hidden sm:inline-flex">
              Show all jobs &rarr;
            </PendingLink>
            </div>
            <div className="mt-10 grid gap-4 xl:grid-cols-2">
            {latestJobs.map((job) => (
              <LatestJobRow key={job.id} job={job} />
            ))}
            </div>
            <PendingLink href="/jobs" className="section-link mt-5 sm:hidden">
              Show all jobs &rarr;
            </PendingLink>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
