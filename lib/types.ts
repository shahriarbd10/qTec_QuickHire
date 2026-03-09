export type JobCategory =
  | "Design"
  | "Sales"
  | "Marketing"
  | "Finance"
  | "Technology"
  | "Engineering"
  | "Business"
  | "Human Resource";

export const JOB_CATEGORIES: JobCategory[] = [
  "Design",
  "Sales",
  "Marketing",
  "Finance",
  "Technology",
  "Engineering",
  "Business",
  "Human Resource",
];

export type JobType =
  | "Full-Time"
  | "Half-Time"
  | "Part-Time"
  | "Contract"
  | "Internship"
  | "Remote"
  | "Hybrid";

export const JOB_TYPES: JobType[] = [
  "Full-Time",
  "Half-Time",
  "Part-Time",
  "Contract",
  "Internship",
  "Remote",
  "Hybrid",
];

export type Job = {
  id: string;
  companyId?: string;
  title: string;
  company: string;
  location: string;
  category: JobCategory;
  type: JobType;
  description: string;
  summary: string;
  logoText: string;
  logoUrl?: string;
  logoPublicId?: string;
  featured?: boolean;
  latest?: boolean;
  color: string;
  createdAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  companyId?: string;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
  createdAt: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatarUrl: string;
  companyId: string;
  company: string;
  emailVerified: boolean;
};

export type CompanyProfile = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  logoUrl: string;
  logoPublicId: string;
};
