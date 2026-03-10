/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");
const dns = require("node:dns");

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (!key) continue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const mongoFile = path.resolve(process.cwd(), "mongoLink.txt");
  if (fs.existsSync(mongoFile)) {
    const value = fs.readFileSync(mongoFile, "utf8").trim();
    if (value) {
      process.env.DATABASE_URL = value;
      return value;
    }
  }
  throw new Error("DATABASE_URL is not configured. Set it in `.env.local` or `mongoLink.txt`.");
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

async function connectToDatabase() {
  const uri = resolveDatabaseUrl();
  const connect = () =>
    mongoose.connect(uri, {
      dbName: "quickhire",
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
    });

  try {
    return await connect();
  } catch (error) {
    const message = String(error && error.message ? error.message : error);
    const isSrvLookupError = message.includes("querySrv") || message.includes("ECONNREFUSED");

    if (uri.startsWith("mongodb+srv://") && isSrvLookupError) {
      const servers =
        (process.env.MONGODB_DNS_SERVERS || "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean) || ["8.8.8.8", "1.1.1.1"];
      dns.setServers(servers.length ? servers : ["8.8.8.8", "1.1.1.1"]);
      return connect();
    }
    throw error;
  }
}

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    location: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    logoUrl: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
  },
  { timestamps: true },
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "admin" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    company: { type: String, default: "", trim: true },
    avatarUrl: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationOtpHash: { type: String, default: null },
    emailVerificationOtpExpiresAt: { type: Date, default: null },
    emailVerificationSentAt: { type: Date, default: null },
    emailVerificationSendAttempts: { type: [Date], default: [] },
    passwordResetOtpHash: { type: String, default: null },
    passwordResetOtpExpiresAt: { type: Date, default: null },
    passwordResetSentAt: { type: Date, default: null },
    passwordResetSendAttempts: { type: [Date], default: [] },
  },
  { timestamps: true },
);

const JobSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    logoText: { type: String, required: true },
    logoUrl: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    latest: { type: Boolean, default: false },
    color: { type: String, required: true },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

const CompanyModel = mongoose.models.Company || mongoose.model("Company", CompanySchema);
const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
const JobModel = mongoose.models.Job || mongoose.model("Job", JobSchema);

async function upsertCompany(input) {
  const baseSlug = slugify(input.name);
  const slug = input.slug || `${baseSlug}-${input.seedSuffix || "demo"}`.slice(0, 64);
  return CompanyModel.findOneAndUpdate(
    { slug },
    {
      name: input.name,
      slug,
      location: input.location || "",
      description: input.description || "",
      logoUrl: input.logoUrl || "",
      logoPublicId: input.logoPublicId || "",
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

async function upsertAdminUser(input) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(input.password, 12);
  return UserModel.findOneAndUpdate(
    { email: normalizedEmail },
    {
      name: input.name,
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      companyId: input.companyId,
      company: input.companyName,
      emailVerifiedAt: new Date(),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

async function upsertJob(input) {
  return JobModel.findOneAndUpdate(
    { companyId: input.companyId, title: input.title },
    {
      companyId: input.companyId,
      title: input.title,
      company: input.companyName,
      location: input.location,
      category: input.category,
      type: input.type,
      description: input.description,
      summary: input.summary,
      logoText: input.logoText,
      logoUrl: input.logoUrl || "",
      logoPublicId: input.logoPublicId || "",
      featured: Boolean(input.featured),
      latest: Boolean(input.latest),
      color: input.color,
      createdByUserId: input.createdByUserId,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

async function main() {
  readEnvFile(path.resolve(process.cwd(), ".env.local"));
  readEnvFile(path.resolve(process.cwd(), ".env"));

  await connectToDatabase();

  const password = "DemoAdmin!234";
  const demo = [
    {
      name: "Shahriar Admin",
      email: "admin1@quickhire.demo",
      companyName: "SoloCraft Studios",
      companyLogoUrl: "/images/demo/company-1.svg",
      job: {
        title: "Senior Product Designer",
        location: "Dhaka, Bangladesh",
        category: "Design",
        type: "Full-Time",
        summary: "Own design systems and ship polished product UI for a fast-moving team.",
        description:
          "You will lead product design for web experiences, collaborate with engineering, and iterate quickly using research, prototypes, and design systems. Strong Figma skills and attention to detail are required.",
        color: "#4f46e5",
      },
    },
    {
      name: "Nabila Admin",
      email: "admin2@quickhire.demo",
      companyName: "Nimbus Labs",
      companyLogoUrl: "/images/demo/company-2.svg",
      job: {
        title: "Full-Stack Engineer (Next.js)",
        location: "Remote",
        category: "Technology",
        type: "Remote",
        summary: "Build scalable dashboards and APIs powering a modern job platform.",
        description:
          "You will ship end-to-end features in Next.js, Node.js, and MongoDB. Expect ownership of performance, accessibility, and reliability. Experience with REST APIs and authentication is preferred.",
        color: "#26a4ff",
      },
    },
    {
      name: "Ayaan Admin",
      email: "admin3@quickhire.demo",
      companyName: "Harbor Health",
      companyLogoUrl: "/images/demo/company-3.svg",
      job: {
        title: "Growth Marketing Manager",
        location: "Singapore",
        category: "Marketing",
        type: "Full-Time",
        summary: "Scale acquisition with smart experiments across paid, SEO, and lifecycle.",
        description:
          "Own growth channels, run weekly experiments, and coordinate with product to improve conversion. You will create campaigns, measure CAC/LTV, and produce insights for leadership.",
        color: "#56cdad",
      },
    },
    {
      name: "Rafi Admin",
      email: "admin4@quickhire.demo",
      companyName: "Atlas Fintech",
      companyLogoUrl: "/images/demo/company-4.svg",
      job: {
        title: "Finance Analyst",
        location: "London, UK",
        category: "Finance",
        type: "Full-Time",
        summary: "Support forecasting, reporting, and decision-making for fintech teams.",
        description:
          "You will partner with stakeholders to build forecasts, track KPIs, and identify risks and opportunities. Strong Excel/Sheets skills and comfort with data are required.",
        color: "#f4b63a",
      },
    },
    {
      name: "Mim Admin",
      email: "admin5@quickhire.demo",
      companyName: "VerdeHR Solutions",
      companyLogoUrl: "/images/demo/company-5.svg",
      job: {
        title: "HR Operations Specialist",
        location: "Toronto, Canada",
        category: "Human Resource",
        type: "Full-Time",
        summary: "Improve HR processes, onboarding, and people operations for a growing team.",
        description:
          "You will manage onboarding workflows, handle HR documentation, and support policy rollout. Strong communication and process design skills are required.",
        color: "#7a5af8",
      },
    },
    {
      name: "Tanim Admin",
      email: "admin6@quickhire.demo",
      companyName: "PeakPixel Commerce",
      companyLogoUrl: "/images/demo/company-6.svg",
      job: {
        title: "Sales Development Representative",
        location: "Austin, TX, US",
        category: "Sales",
        type: "Full-Time",
        summary: "Qualify inbound leads and set meetings for the account executive team.",
        description:
          "You will research prospects, run outreach sequences, and book demos. Comfort with CRM tools and a high-energy communication style are essential.",
        color: "#141b34",
      },
    },
  ];

  const createdUsers = [];
  const createdJobs = [];

  for (let index = 0; index < demo.length; index += 1) {
    const item = demo[index];
    const company = await upsertCompany({
      name: item.companyName,
      slug: `${slugify(item.companyName)}-demo-${index + 1}`,
      logoUrl: item.companyLogoUrl,
      logoPublicId: "",
      seedSuffix: `demo-${index + 1}`,
    });

    const user = await upsertAdminUser({
      name: item.name,
      email: item.email,
      password,
      companyId: company._id,
      companyName: item.companyName,
    });

    const job = await upsertJob({
      companyId: company._id,
      companyName: item.companyName,
      title: item.job.title,
      location: item.job.location,
      category: item.job.category,
      type: item.job.type,
      summary: item.job.summary,
      description: item.job.description,
      logoText: item.companyName.slice(0, 2).toUpperCase(),
      logoUrl: item.companyLogoUrl,
      logoPublicId: "",
      featured: true,
      latest: true,
      color: item.job.color,
      createdByUserId: user._id,
    });

    createdUsers.push(user);
    createdJobs.push(job);
  }

  console.log("");
  console.log("Seed complete.");
  console.log(`Admins created/updated: ${createdUsers.length}`);
  console.log(`Jobs created/updated: ${createdJobs.length} (all featured + latest)`);
  console.log("");
  console.log("Login credentials:");
  console.log(`Password (all): ${password}`);
  for (const user of createdUsers) {
    console.log(`- ${user.email} (${user.name})`);
  }
  console.log("");
  console.log("Tip: visit `/` to see Featured jobs and Latest jobs open.");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exitCode = 1;
});

