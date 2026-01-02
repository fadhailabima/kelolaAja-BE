// src/validators/job-posting.validator.ts

import { z } from "zod";
import { JobType, JobLevel, WorkLocation, ApplicationStatus, Locale } from "@prisma/client";

const translationSchema = z.object({
  locale: z.nativeEnum(Locale),
  title: z
    .string()
    .min(1)
    .max(255),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  qualifications: z.string().optional(),
  additionalInfo: z.string().optional()
});

const requirementItemSchema = z.object({
  locale: z.nativeEnum(Locale),
  requirement: z.string().min(1),
  isRequired: z
    .boolean()
    .optional()
    .default(true),
  displayOrder: z
    .number()
    .int()
    .min(0)
});

const responsibilityItemSchema = z.object({
  locale: z.nativeEnum(Locale),
  responsibility: z.string().min(1),
  displayOrder: z
    .number()
    .int()
    .min(0)
});

const benefitItemSchema = z.object({
  locale: z.nativeEnum(Locale),
  benefit: z
    .string()
    .min(1)
    .max(255),
  description: z.string().optional(),
  iconName: z
    .string()
    .max(100)
    .optional(),
  displayOrder: z
    .number()
    .int()
    .min(0)
});

export const createJobPostingSchema = z.object({
  body: z.object({
    jobCode: z
      .string()
      .min(1)
      .max(100),
    slug: z
      .string()
      .min(1)
      .max(150),
    department: z
      .string()
      .max(100)
      .optional(),
    jobType: z.nativeEnum(JobType),
    jobLevel: z.nativeEnum(JobLevel),
    workLocation: z.nativeEnum(WorkLocation),
    city: z
      .string()
      .max(100)
      .optional(),
    country: z
      .string()
      .max(100)
      .optional(),
    salaryMin: z
      .number()
      .int()
      .min(0)
      .optional(),
    salaryMax: z
      .number()
      .int()
      .min(0)
      .optional(),
    salaryCurrency: z
      .string()
      .max(10)
      .optional()
      .default("IDR"),
    salaryPeriod: z
      .string()
      .max(20)
      .optional()
      .default("monthly"),
    showSalary: z
      .boolean()
      .optional()
      .default(false),
    positions: z
      .number()
      .int()
      .min(1)
      .optional()
      .default(1),
    experienceYears: z
      .number()
      .int()
      .min(0)
      .optional(),
    applicationDeadline: z
      .string()
      .datetime()
      .optional()
      .or(z.date().optional()),
    isActive: z
      .boolean()
      .optional()
      .default(true),
    isFeatured: z
      .boolean()
      .optional()
      .default(false),
    publishedAt: z
      .string()
      .datetime()
      .optional()
      .or(z.date().optional()),
    translations: z.array(translationSchema).min(1),
    requirements: z.array(requirementItemSchema).optional(),
    responsibilities: z.array(responsibilityItemSchema).optional(),
    benefits: z.array(benefitItemSchema).optional()
  })
});

export const updateJobPostingSchema = z.object({
  body: z.object({
    jobCode: z
      .string()
      .min(1)
      .max(100)
      .optional(),
    slug: z
      .string()
      .min(1)
      .max(150)
      .optional(),
    department: z
      .string()
      .max(100)
      .optional(),
    jobType: z.nativeEnum(JobType).optional(),
    jobLevel: z.nativeEnum(JobLevel).optional(),
    workLocation: z.nativeEnum(WorkLocation).optional(),
    city: z
      .string()
      .max(100)
      .optional(),
    country: z
      .string()
      .max(100)
      .optional(),
    salaryMin: z
      .number()
      .int()
      .min(0)
      .optional(),
    salaryMax: z
      .number()
      .int()
      .min(0)
      .optional(),
    salaryCurrency: z
      .string()
      .max(10)
      .optional(),
    salaryPeriod: z
      .string()
      .max(20)
      .optional(),
    showSalary: z.boolean().optional(),
    positions: z
      .number()
      .int()
      .min(1)
      .optional(),
    experienceYears: z
      .number()
      .int()
      .min(0)
      .optional(),
    applicationDeadline: z
      .string()
      .datetime()
      .optional()
      .or(z.date().optional()),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    publishedAt: z
      .string()
      .datetime()
      .optional()
      .or(z.date().optional()),
    closedAt: z
      .string()
      .datetime()
      .optional()
      .or(z.date().optional()),
    translations: z.array(translationSchema).optional(),
    requirements: z.array(requirementItemSchema).optional(),
    responsibilities: z.array(responsibilityItemSchema).optional(),
    benefits: z.array(benefitItemSchema).optional()
  })
});

export const createJobApplicationSchema = z.object({
  body: z.object({
    jobId: z
      .number()
      .int()
      .positive(),
    applicantName: z
      .string()
      .min(1)
      .max(255),
    applicantEmail: z
      .string()
      .email()
      .max(255),
    applicantPhone: z
      .string()
      .max(50)
      .optional(),
    currentCompany: z
      .string()
      .max(255)
      .optional(),
    currentPosition: z
      .string()
      .max(255)
      .optional(),
    yearsOfExperience: z
      .number()
      .int()
      .min(0)
      .optional(),
    expectedSalary: z
      .number()
      .int()
      .min(0)
      .optional(),
    salaryCurrency: z
      .string()
      .max(10)
      .optional()
      .default("IDR"),
    availableFrom: z
      .string()
      .date()
      .optional()
      .or(z.date().optional()),
    coverLetter: z.string().optional(),
    cvFileId: z
      .number()
      .int()
      .positive()
      .optional(),
    portfolioUrl: z
      .string()
      .url()
      .max(255)
      .optional(),
    linkedinUrl: z
      .string()
      .url()
      .max(255)
      .optional(),
    githubUrl: z
      .string()
      .url()
      .max(255)
      .optional(),
    referralSource: z
      .string()
      .max(100)
      .optional()
  })
});

export const updateJobApplicationSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ApplicationStatus).optional(),
    rating: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),
    adminNotes: z.string().optional(),
    rejectionReason: z.string().optional(),
    assignedTo: z
      .number()
      .int()
      .positive()
      .optional()
  })
});
