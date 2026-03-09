import { z } from "zod";
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/types";

export const jobSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  category: z.enum(JOB_CATEGORIES as [typeof JOB_CATEGORIES[number], ...typeof JOB_CATEGORIES[number][]]),
  type: z.enum(JOB_TYPES as [typeof JOB_TYPES[number], ...typeof JOB_TYPES[number][]]),
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
