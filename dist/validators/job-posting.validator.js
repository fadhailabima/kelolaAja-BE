"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobApplicationSchema = exports.createJobApplicationSchema = exports.updateJobPostingSchema = exports.createJobPostingSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const translationSchema = zod_1.z.object({
    locale: zod_1.z.nativeEnum(client_1.Locale),
    title: zod_1.z
        .string()
        .min(1)
        .max(255),
    shortDescription: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    qualifications: zod_1.z.string().optional(),
    additionalInfo: zod_1.z.string().optional()
});
const requirementItemSchema = zod_1.z.object({
    locale: zod_1.z.nativeEnum(client_1.Locale),
    requirement: zod_1.z.string().min(1),
    isRequired: zod_1.z
        .boolean()
        .optional()
        .default(true),
    displayOrder: zod_1.z
        .number()
        .int()
        .min(0)
});
const responsibilityItemSchema = zod_1.z.object({
    locale: zod_1.z.nativeEnum(client_1.Locale),
    responsibility: zod_1.z.string().min(1),
    displayOrder: zod_1.z
        .number()
        .int()
        .min(0)
});
const benefitItemSchema = zod_1.z.object({
    locale: zod_1.z.nativeEnum(client_1.Locale),
    benefit: zod_1.z
        .string()
        .min(1)
        .max(255),
    description: zod_1.z.string().optional(),
    iconName: zod_1.z
        .string()
        .max(100)
        .optional(),
    displayOrder: zod_1.z
        .number()
        .int()
        .min(0)
});
exports.createJobPostingSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobCode: zod_1.z
            .string()
            .min(1)
            .max(100),
        slug: zod_1.z
            .string()
            .min(1)
            .max(150),
        department: zod_1.z
            .string()
            .max(100)
            .optional(),
        jobType: zod_1.z.nativeEnum(client_1.JobType),
        jobLevel: zod_1.z.nativeEnum(client_1.JobLevel),
        workLocation: zod_1.z.nativeEnum(client_1.WorkLocation),
        city: zod_1.z
            .string()
            .max(100)
            .optional(),
        country: zod_1.z
            .string()
            .max(100)
            .optional(),
        salaryMin: zod_1.z
            .number()
            .int()
            .min(0)
            .optional(),
        salaryMax: zod_1.z
            .number()
            .int()
            .min(0)
            .optional(),
        salaryCurrency: zod_1.z
            .string()
            .max(10)
            .optional()
            .default("IDR"),
        salaryPeriod: zod_1.z
            .string()
            .max(20)
            .optional()
            .default("monthly"),
        showSalary: zod_1.z
            .boolean()
            .optional()
            .default(false),
        positions: zod_1.z
            .number()
            .int()
            .min(1)
            .optional()
            .default(1),
        experienceYears: zod_1.z
            .number()
            .int()
            .min(0)
            .optional(),
        applicationDeadline: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.date().optional()),
        isActive: zod_1.z
            .boolean()
            .optional()
            .default(true),
        isFeatured: zod_1.z
            .boolean()
            .optional()
            .default(false),
        publishedAt: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.date().optional()),
        translations: zod_1.z.array(translationSchema).min(1),
        requirements: zod_1.z.array(requirementItemSchema).optional(),
        responsibilities: zod_1.z.array(responsibilityItemSchema).optional(),
        benefits: zod_1.z.array(benefitItemSchema).optional()
    })
});
exports.updateJobPostingSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobCode: zod_1.z
            .string()
            .min(1)
            .max(100)
            .optional(),
        slug: zod_1.z
            .string()
            .min(1)
            .max(150)
            .optional(),
        department: zod_1.z
            .string()
            .max(100)
            .optional(),
        jobType: zod_1.z.nativeEnum(client_1.JobType).optional(),
        jobLevel: zod_1.z.nativeEnum(client_1.JobLevel).optional(),
        workLocation: zod_1.z.nativeEnum(client_1.WorkLocation).optional(),
        city: zod_1.z
            .string()
            .max(100)
            .optional(),
        country: zod_1.z
            .string()
            .max(100)
            .optional(),
        salaryMin: zod_1.z
            .number()
            .int()
            .min(0)
            .optional(),
        salaryMax: zod_1.z
            .number()
            .int()
            .min(0)
            .optional(),
        salaryCurrency: zod_1.z
            .string()
            .max(10)
            .optional(),
        salaryPeriod: zod_1.z
            .string()
            .max(20)
            .optional(),
        showSalary: zod_1.z.boolean().optional(),
        positions: zod_1.z
            .number()
            .int()
            .min(1)
            .optional(),
        experienceYears: zod_1.z
            .number()
            .int()
            .min(0)
            .optional(),
        applicationDeadline: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.date().optional()),
        isActive: zod_1.z.boolean().optional(),
        isFeatured: zod_1.z.boolean().optional(),
        publishedAt: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.date().optional()),
        closedAt: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.date().optional()),
        translations: zod_1.z.array(translationSchema).optional(),
        requirements: zod_1.z.array(requirementItemSchema).optional(),
        responsibilities: zod_1.z.array(responsibilityItemSchema).optional(),
        benefits: zod_1.z.array(benefitItemSchema).optional()
    })
});
exports.createJobApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z
            .number()
            .int()
            .positive(),
        applicantName: zod_1.z
            .string()
            .min(1)
            .max(255),
        applicantEmail: zod_1.z
            .string()
            .email()
            .max(255),
        applicantPhone: zod_1.z
            .string()
            .max(50)
            .optional(),
        currentCompany: zod_1.z
            .string()
            .max(255)
            .optional(),
        currentPosition: zod_1.z
            .string()
            .max(255)
            .optional(),
        yearsOfExperience: zod_1.z
            .number()
            .int()
            .min(0)
            .optional(),
        expectedSalary: zod_1.z
            .number()
            .int()
            .min(0)
            .optional(),
        salaryCurrency: zod_1.z
            .string()
            .max(10)
            .optional()
            .default("IDR"),
        availableFrom: zod_1.z
            .string()
            .date()
            .optional()
            .or(zod_1.z.date().optional()),
        coverLetter: zod_1.z.string().optional(),
        cvFileId: zod_1.z
            .number()
            .int()
            .positive()
            .optional(),
        portfolioUrl: zod_1.z
            .string()
            .url()
            .max(255)
            .optional(),
        linkedinUrl: zod_1.z
            .string()
            .url()
            .max(255)
            .optional(),
        githubUrl: zod_1.z
            .string()
            .url()
            .max(255)
            .optional(),
        referralSource: zod_1.z
            .string()
            .max(100)
            .optional()
    })
});
exports.updateJobApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.ApplicationStatus).optional(),
        rating: zod_1.z
            .number()
            .int()
            .min(1)
            .max(5)
            .optional(),
        adminNotes: zod_1.z.string().optional(),
        rejectionReason: zod_1.z.string().optional(),
        assignedTo: zod_1.z
            .number()
            .int()
            .positive()
            .optional()
    })
});
//# sourceMappingURL=job-posting.validator.js.map