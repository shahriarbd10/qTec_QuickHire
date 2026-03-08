import { connectToDatabase } from "@/lib/db";
import { Application, Job, JobCategory } from "@/lib/types";
import { JobModel } from "@/models/job";
import { ApplicationModel } from "@/models/application";
import { CompanyModel } from "@/models/company";
import { slugifyCompanyName } from "@/lib/company";

type DatabaseJob = {
  _id: { toString(): string };
  companyId?: { toString(): string };
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  description: string;
  summary: string;
  logoText: string;
  logoUrl?: string;
  logoPublicId?: string;
  featured?: boolean;
  latest?: boolean;
  color: string;
  createdByUserId?: { toString(): string };
  createdAt: Date;
};

const seedJobs: Omit<Job, "id" | "createdAt">[] = [
  {
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    category: "Marketing",
    type: "Full-Time",
    summary: "Support startup storytelling and campaign execution across social channels.",
    description:
      "Own scheduling, campaign coordination, reporting, and creator support for a remote-first startup. You will work closely with design and product teams to keep the content pipeline healthy and measurable.",
    logoText: "N",
    latest: true,
    color: "#7cc9a5",
  },
  {
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Francisco, USA",
    category: "Design",
    type: "Full-Time",
    summary: "Shape product marketing visuals and brand systems for campaigns.",
    description:
      "Design launch visuals, campaign pages, social assets, and brand collateral while partnering with marketing and product teams. The role requires a strong eye for storytelling and systems thinking.",
    logoText: "D",
    featured: true,
    latest: true,
    color: "#3b82f6",
  },
  {
    title: "Interactive Developer",
    company: "Terraform",
    location: "Hamburg, Germany",
    category: "Engineering",
    type: "Full-Time",
    summary: "Build polished web experiences and high-performance interfaces.",
    description:
      "Collaborate with designers to transform concepts into accessible, production-grade web experiences. You will work on interaction-heavy campaigns and reusable frontend systems.",
    logoText: "T",
    latest: true,
    color: "#22c1dc",
  },
  {
    title: "HR Manager",
    company: "Packer",
    location: "Lucern, Switzerland",
    category: "Human Resource",
    type: "Full-Time",
    summary: "Lead hiring processes, people operations, and onboarding workflows.",
    description:
      "Own hiring coordination, policy communication, onboarding, and recruiting operations. You will partner directly with team leads to improve candidate experience and internal processes.",
    logoText: "P",
    latest: true,
    color: "#ff7557",
  },
  {
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    category: "Marketing",
    type: "Full-Time",
    summary: "Build lifecycle campaigns and performance-focused CRM journeys.",
    description:
      "Plan, write, and optimize lifecycle email campaigns with a strong testing culture. You will collaborate with analytics and brand to improve engagement and retention.",
    logoText: "R",
    featured: true,
    color: "#111827",
  },
  {
    title: "Visual Designer",
    company: "Blinklist",
    location: "Granada, Spain",
    category: "Design",
    type: "Full-Time",
    summary: "Create conversion-focused visuals across product and growth channels.",
    description:
      "Support product launches with visual concepts, promotional assets, and campaign systems. This role balances polish, speed, and consistency across a growing brand.",
    logoText: "B",
    featured: true,
    color: "#22c55e",
  },
  {
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    category: "Design",
    type: "Full-Time",
    summary: "Improve booking flows and product UX for a consumer platform.",
    description:
      "Partner with product managers and engineers to define user flows, wireframes, prototypes, and visual systems. You will be expected to think end-to-end from discovery to shipped UI.",
    logoText: "C",
    featured: true,
    color: "#1d4ed8",
  },
  {
    title: "Lead Designer",
    company: "Canva",
    location: "Ontario, Canada",
    category: "Design",
    type: "Full-Time",
    summary: "Lead a multidisciplinary team shaping campaign and brand outputs.",
    description:
      "Drive creative direction, critique design work, and mentor designers while remaining hands-on with key launches. Strong communication and visual craft are essential.",
    logoText: "Ca",
    featured: true,
    color: "#4ecdc4",
  },
  {
    title: "Brand Strategist",
    company: "GoDaddy",
    location: "Marseille, France",
    category: "Business",
    type: "Full-Time",
    summary: "Connect positioning, campaign planning, and messaging systems.",
    description:
      "Own strategic briefs, messaging frameworks, and brand planning across campaign launches. You will work cross-functionally with leadership, growth, and creative teams.",
    logoText: "G",
    featured: true,
    color: "#111111",
  },
  {
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    category: "Technology",
    type: "Full-Time",
    summary: "Analyze product and marketing datasets to surface actionable insights.",
    description:
      "Build dashboards, reporting layers, and decision support analyses for product and marketing stakeholders. Comfort with ambiguity and communication is critical.",
    logoText: "Tw",
    featured: true,
    color: "#38bdf8",
  },
  {
    title: "Social Media Assistant",
    company: "Netlify",
    location: "Paris, France",
    category: "Marketing",
    type: "Full-Time",
    summary: "Run creator partnerships and social operations for developer audiences.",
    description:
      "Manage campaign calendars, partner coordination, audience reporting, and launch support with a strong developer-first brand voice.",
    logoText: "Ne",
    latest: true,
    color: "#26c6da",
  },
  {
    title: "Brand Designer",
    company: "Maze",
    location: "San Francisco, USA",
    category: "Design",
    type: "Full-Time",
    summary: "Design launch visuals and brand systems for product storytelling.",
    description:
      "Help define the look and feel of campaigns, product education assets, and multi-channel launch materials for a high-growth SaaS company.",
    logoText: "M",
    latest: true,
    color: "#2563eb",
  },
  {
    title: "Interactive Developer",
    company: "Udacity",
    location: "Hamburg, Germany",
    category: "Engineering",
    type: "Full-Time",
    summary: "Build motion-rich web experiences with strong performance discipline.",
    description:
      "Translate product and marketing concepts into maintainable frontend interfaces. This role combines engineering fundamentals with strong interaction craft.",
    logoText: "U",
    latest: true,
    color: "#0ea5e9",
  },
  {
    title: "HR Manager",
    company: "Webflow",
    location: "Lucern, Switzerland",
    category: "Human Resource",
    type: "Full-Time",
    summary: "Scale people operations and recruiting processes for a growing team.",
    description:
      "Lead recruiting coordination, hiring process optimization, people policy communication, and onboarding across multiple departments.",
    logoText: "W",
    latest: true,
    color: "#6366f1",
  },
];

export const categories: { name: JobCategory; jobsAvailable: number; highlighted?: boolean }[] = [
  { name: "Design", jobsAvailable: 235 },
  { name: "Sales", jobsAvailable: 756 },
  { name: "Marketing", jobsAvailable: 140 },
  { name: "Finance", jobsAvailable: 325 },
  { name: "Technology", jobsAvailable: 436 },
  { name: "Engineering", jobsAvailable: 542 },
  { name: "Business", jobsAvailable: 211 },
  { name: "Human Resource", jobsAvailable: 346 },
];

export const trustedCompanies = [
  { name: "Vodafone", src: "/icons/companies/icon1.png" },
  { name: "Intel", src: "/icons/companies/icon2.png" },
  { name: "Tesla", src: "/icons/companies/icon3.png" },
  { name: "AMD", src: "/icons/companies/icon4.png" },
  { name: "Talkit", src: "/icons/companies/icon5.png" },
];

function getSeededLocalJobs(): Job[] {
  return seedJobs.map((job, index) => ({
    id: `seed-${index + 1}`,
    ...job,
    createdAt: new Date("2026-03-07T10:00:00.000Z").toISOString(),
  }));
}

function serializeJob(job: DatabaseJob): Job {
  return {
    id: job._id.toString(),
    companyId: job.companyId?.toString() || "",
    title: job.title,
    company: job.company,
    location: job.location,
    category: job.category as JobCategory,
    type: job.type as Job["type"],
    description: job.description,
    summary: job.summary,
    logoText: job.logoText,
    logoUrl: job.logoUrl || "",
    logoPublicId: job.logoPublicId || "",
    featured: job.featured,
    latest: job.latest,
    color: job.color,
    createdAt: job.createdAt.toISOString(),
  };
}

export async function ensureSeedJobs() {
  await connectToDatabase();
  const count = await JobModel.countDocuments();

  if (count === 0) {
    const seededCompanies = await Promise.all(
      Array.from(new Set(seedJobs.map((job) => job.company))).map(async (companyName) => {
        const slug = slugifyCompanyName(companyName);
        const company = await CompanyModel.findOneAndUpdate(
          { slug },
          { name: companyName, slug },
          { new: true, upsert: true, setDefaultsOnInsert: true },
        );

        return [companyName, String(company._id)] as const;
      }),
    );

    const companyIdMap = new Map(seededCompanies);
    await JobModel.insertMany(
      seedJobs.map((job) => ({
        ...job,
        companyId: companyIdMap.get(job.company),
      })),
    );
  }
}

export async function getJobs() {
  try {
    await ensureSeedJobs();
    const jobs = (await JobModel.find().sort({ createdAt: -1 }).lean()) as DatabaseJob[];
    return jobs.map((job) => serializeJob(job));
  } catch {
    return getSeededLocalJobs();
  }
}

export async function getJobById(id: string) {
  try {
    await ensureSeedJobs();
    const job = (await JobModel.findById(id).lean()) as DatabaseJob | null;
    return job ? serializeJob(job) : null;
  } catch {
    return getSeededLocalJobs().find((job) => job.id === id) ?? null;
  }
}

export async function getJobsByCompanyId(companyId: string) {
  try {
    await ensureSeedJobs();
    const jobs = (await JobModel.find({ companyId }).sort({ createdAt: -1 }).lean()) as DatabaseJob[];
    return jobs.map((job) => serializeJob(job));
  } catch {
    return [];
  }
}

export async function addJob(
  job: Omit<Job, "id" | "createdAt"> & { companyId: string; createdByUserId?: string },
): Promise<Job> {
  await ensureSeedJobs();
  const created = await JobModel.create(job);
  return serializeJob(created.toObject() as DatabaseJob);
}

export async function deleteJob(id: string, companyId?: string) {
  await ensureSeedJobs();
  const removed = (await JobModel.findOneAndDelete(
    companyId ? { _id: id, companyId } : { _id: id },
  ).lean()) as DatabaseJob | null;
  if (removed) {
    await ApplicationModel.deleteMany({ jobId: removed._id });
  }
  return removed ? serializeJob(removed) : null;
}

export async function addApplication(
  application: Omit<Application, "id" | "createdAt"> & { companyId: string },
) {
  await connectToDatabase();
  const created = await ApplicationModel.create({
    ...application,
    jobId: application.jobId,
  });

  return {
    id: created._id.toString(),
    jobId: created.jobId.toString(),
    companyId: created.companyId.toString(),
    name: created.name,
    email: created.email,
    resumeLink: created.resumeLink,
    coverNote: created.coverNote,
    createdAt: created.createdAt.toISOString(),
  };
}

export async function ensureCompanyForAdmin(input: {
  companyName: string;
  location?: string;
  description?: string;
  logoUrl?: string;
  logoPublicId?: string;
}) {
  await connectToDatabase();
  const slug = slugifyCompanyName(input.companyName);
  return CompanyModel.findOneAndUpdate(
    { slug },
    {
      name: input.companyName,
      slug,
      location: input.location?.trim() || "",
      description: input.description?.trim() || "",
      logoUrl: input.logoUrl || "",
      logoPublicId: input.logoPublicId || "",
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}
