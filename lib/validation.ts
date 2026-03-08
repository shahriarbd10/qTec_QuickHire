import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  category: z.enum([
    "Design",
    "Sales",
    "Marketing",
    "Finance",
    "Technology",
    "Engineering",
    "Business",
    "Human Resource",
  ]),
  type: z.enum(["Full-Time", "Part-Time", "Remote"]),
  summary: z.string().min(10),
  description: z.string().min(40),
  logoUrl: z.string().url().optional().or(z.literal("")),
  logoPublicId: z.string().optional().or(z.literal("")),
  featured: z.boolean().optional().default(false),
  latest: z.boolean().optional().default(false),
});

export const applicationSchema = z.object({
  jobId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  resumeLink: z.string().url(),
  coverNote: z.string().min(20),
});
