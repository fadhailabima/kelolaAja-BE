import { Locale } from "@prisma/client";
import { CreateJobPostingDTO, UpdateJobPostingDTO, JobPostingFilters } from "../types/job-posting.types";
export declare class JobPostingService {
    createJobPosting(data: CreateJobPostingDTO, createdBy: number): Promise<{
        translations: {
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            jobId: number;
            locale: import(".prisma/client").$Enums.Locale;
            translationId: number;
            shortDescription: string | null;
            qualifications: string | null;
            additionalInfo: string | null;
        }[];
        benefits: ({
            translations: {
                createdAt: Date;
                benefitId: number;
                description: string | null;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                benefit: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            benefitId: number;
            iconName: string | null;
            jobId: number;
        })[];
        requirements: ({
            translations: {
                createdAt: Date;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                requirementId: number;
                requirement: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            jobId: number;
            isRequired: boolean;
            requirementId: number;
        })[];
        responsibilities: ({
            translations: {
                createdAt: Date;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                responsibilityId: number;
                responsibility: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            jobId: number;
            responsibilityId: number;
        })[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number;
        deletedAt: Date | null;
        updatedBy: number;
        slug: string;
        isFeatured: boolean;
        jobId: number;
        jobCode: string;
        department: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        jobLevel: import(".prisma/client").$Enums.JobLevel;
        workLocation: import(".prisma/client").$Enums.WorkLocation;
        city: string | null;
        country: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        showSalary: boolean;
        positions: number;
        experienceYears: number | null;
        applicationDeadline: Date | null;
        viewCount: number;
        applicationCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }>;
    updateJobPosting(jobId: number, data: UpdateJobPostingDTO, updatedBy: number): Promise<{
        translations: {
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            jobId: number;
            locale: import(".prisma/client").$Enums.Locale;
            translationId: number;
            shortDescription: string | null;
            qualifications: string | null;
            additionalInfo: string | null;
        }[];
        benefits: ({
            translations: {
                createdAt: Date;
                benefitId: number;
                description: string | null;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                benefit: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            benefitId: number;
            iconName: string | null;
            jobId: number;
        })[];
        requirements: ({
            translations: {
                createdAt: Date;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                requirementId: number;
                requirement: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            jobId: number;
            isRequired: boolean;
            requirementId: number;
        })[];
        responsibilities: ({
            translations: {
                createdAt: Date;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                responsibilityId: number;
                responsibility: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            jobId: number;
            responsibilityId: number;
        })[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number;
        deletedAt: Date | null;
        updatedBy: number;
        slug: string;
        isFeatured: boolean;
        jobId: number;
        jobCode: string;
        department: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        jobLevel: import(".prisma/client").$Enums.JobLevel;
        workLocation: import(".prisma/client").$Enums.WorkLocation;
        city: string | null;
        country: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        showSalary: boolean;
        positions: number;
        experienceYears: number | null;
        applicationDeadline: Date | null;
        viewCount: number;
        applicationCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }>;
    getJobPostings(filters: JobPostingFilters, locale?: Locale, page?: number, limit?: number): Promise<{
        data: ({
            translations: {
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                jobId: number;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                shortDescription: string | null;
                qualifications: string | null;
                additionalInfo: string | null;
            }[];
            benefits: ({
                translations: {
                    createdAt: Date;
                    benefitId: number;
                    description: string | null;
                    locale: import(".prisma/client").$Enums.Locale;
                    translationId: number;
                    benefit: string;
                }[];
            } & {
                createdAt: Date;
                displayOrder: number;
                benefitId: number;
                iconName: string | null;
                jobId: number;
            })[];
            requirements: ({
                translations: {
                    createdAt: Date;
                    locale: import(".prisma/client").$Enums.Locale;
                    translationId: number;
                    requirementId: number;
                    requirement: string;
                }[];
            } & {
                createdAt: Date;
                displayOrder: number;
                jobId: number;
                isRequired: boolean;
                requirementId: number;
            })[];
            responsibilities: ({
                translations: {
                    createdAt: Date;
                    locale: import(".prisma/client").$Enums.Locale;
                    translationId: number;
                    responsibilityId: number;
                    responsibility: string;
                }[];
            } & {
                createdAt: Date;
                displayOrder: number;
                jobId: number;
                responsibilityId: number;
            })[];
        } & {
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            createdBy: number;
            deletedAt: Date | null;
            updatedBy: number;
            slug: string;
            isFeatured: boolean;
            jobId: number;
            jobCode: string;
            department: string | null;
            jobType: import(".prisma/client").$Enums.JobType;
            jobLevel: import(".prisma/client").$Enums.JobLevel;
            workLocation: import(".prisma/client").$Enums.WorkLocation;
            city: string | null;
            country: string | null;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string | null;
            salaryPeriod: string | null;
            showSalary: boolean;
            positions: number;
            experienceYears: number | null;
            applicationDeadline: Date | null;
            viewCount: number;
            applicationCount: number;
            publishedAt: Date | null;
            closedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getJobPostingById(jobId: number, locale?: Locale): Promise<({
        translations: {
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            jobId: number;
            locale: import(".prisma/client").$Enums.Locale;
            translationId: number;
            shortDescription: string | null;
            qualifications: string | null;
            additionalInfo: string | null;
        }[];
        benefits: ({
            translations: {
                createdAt: Date;
                benefitId: number;
                description: string | null;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                benefit: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            benefitId: number;
            iconName: string | null;
            jobId: number;
        })[];
        requirements: ({
            translations: {
                createdAt: Date;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                requirementId: number;
                requirement: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            jobId: number;
            isRequired: boolean;
            requirementId: number;
        })[];
        responsibilities: ({
            translations: {
                createdAt: Date;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                responsibilityId: number;
                responsibility: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            jobId: number;
            responsibilityId: number;
        })[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number;
        deletedAt: Date | null;
        updatedBy: number;
        slug: string;
        isFeatured: boolean;
        jobId: number;
        jobCode: string;
        department: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        jobLevel: import(".prisma/client").$Enums.JobLevel;
        workLocation: import(".prisma/client").$Enums.WorkLocation;
        city: string | null;
        country: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        showSalary: boolean;
        positions: number;
        experienceYears: number | null;
        applicationDeadline: Date | null;
        viewCount: number;
        applicationCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }) | null>;
    getJobPostingBySlug(slug: string, locale?: Locale): Promise<({
        translations: {
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            jobId: number;
            locale: import(".prisma/client").$Enums.Locale;
            translationId: number;
            shortDescription: string | null;
            qualifications: string | null;
            additionalInfo: string | null;
        }[];
        benefits: ({
            translations: {
                createdAt: Date;
                benefitId: number;
                description: string | null;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                benefit: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            benefitId: number;
            iconName: string | null;
            jobId: number;
        })[];
        requirements: ({
            translations: {
                createdAt: Date;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                requirementId: number;
                requirement: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            jobId: number;
            isRequired: boolean;
            requirementId: number;
        })[];
        responsibilities: ({
            translations: {
                createdAt: Date;
                locale: import(".prisma/client").$Enums.Locale;
                translationId: number;
                responsibilityId: number;
                responsibility: string;
            }[];
        } & {
            createdAt: Date;
            displayOrder: number;
            jobId: number;
            responsibilityId: number;
        })[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number;
        deletedAt: Date | null;
        updatedBy: number;
        slug: string;
        isFeatured: boolean;
        jobId: number;
        jobCode: string;
        department: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        jobLevel: import(".prisma/client").$Enums.JobLevel;
        workLocation: import(".prisma/client").$Enums.WorkLocation;
        city: string | null;
        country: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        showSalary: boolean;
        positions: number;
        experienceYears: number | null;
        applicationDeadline: Date | null;
        viewCount: number;
        applicationCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }) | null>;
    deleteJobPosting(jobId: number): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number;
        deletedAt: Date | null;
        updatedBy: number;
        slug: string;
        isFeatured: boolean;
        jobId: number;
        jobCode: string;
        department: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        jobLevel: import(".prisma/client").$Enums.JobLevel;
        workLocation: import(".prisma/client").$Enums.WorkLocation;
        city: string | null;
        country: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        showSalary: boolean;
        positions: number;
        experienceYears: number | null;
        applicationDeadline: Date | null;
        viewCount: number;
        applicationCount: number;
        publishedAt: Date | null;
        closedAt: Date | null;
    }>;
    getJobStats(): Promise<{
        totalJobs: number;
        activeJobs: number;
        totalApplications: number;
        pendingApplications: number;
        jobsByType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.JobPostingGroupByOutputType, "jobType"[]> & {
            _count: number;
        })[];
        jobsByLevel: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.JobPostingGroupByOutputType, "jobLevel"[]> & {
            _count: number;
        })[];
    }>;
}
//# sourceMappingURL=job-posting.service.d.ts.map