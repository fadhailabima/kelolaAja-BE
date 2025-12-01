import { JobType, JobLevel, WorkLocation, ApplicationStatus, Locale } from "@prisma/client";
export interface CreateJobPostingDTO {
    jobCode: string;
    slug: string;
    department?: string;
    jobType: JobType;
    jobLevel: JobLevel;
    workLocation: WorkLocation;
    city?: string;
    country?: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    salaryPeriod?: string;
    showSalary?: boolean;
    positions?: number;
    experienceYears?: number;
    applicationDeadline?: Date;
    isActive?: boolean;
    isFeatured?: boolean;
    publishedAt?: Date;
    translations: {
        locale: Locale;
        title: string;
        shortDescription?: string;
        description?: string;
        qualifications?: string;
        additionalInfo?: string;
    }[];
    requirements?: {
        locale: Locale;
        requirement: string;
        isRequired?: boolean;
        displayOrder: number;
    }[];
    responsibilities?: {
        locale: Locale;
        responsibility: string;
        displayOrder: number;
    }[];
    benefits?: {
        locale: Locale;
        benefit: string;
        description?: string;
        iconName?: string;
        displayOrder: number;
    }[];
}
export interface UpdateJobPostingDTO {
    jobCode?: string;
    slug?: string;
    department?: string;
    jobType?: JobType;
    jobLevel?: JobLevel;
    workLocation?: WorkLocation;
    city?: string;
    country?: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    salaryPeriod?: string;
    showSalary?: boolean;
    positions?: number;
    experienceYears?: number;
    applicationDeadline?: Date;
    isActive?: boolean;
    isFeatured?: boolean;
    publishedAt?: Date;
    closedAt?: Date;
    translations?: {
        locale: Locale;
        title?: string;
        shortDescription?: string;
        description?: string;
        qualifications?: string;
        additionalInfo?: string;
    }[];
    requirements?: {
        locale: Locale;
        requirement: string;
        isRequired?: boolean;
        displayOrder: number;
    }[];
    responsibilities?: {
        locale: Locale;
        responsibility: string;
        displayOrder: number;
    }[];
    benefits?: {
        locale: Locale;
        benefit: string;
        description?: string;
        iconName?: string;
        displayOrder: number;
    }[];
}
export interface JobPostingFilters {
    jobType?: JobType;
    jobLevel?: JobLevel;
    workLocation?: WorkLocation;
    city?: string;
    department?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    search?: string;
}
export interface CreateJobApplicationDTO {
    jobId: number;
    applicantName: string;
    applicantEmail: string;
    applicantPhone?: string;
    currentCompany?: string;
    currentPosition?: string;
    yearsOfExperience?: number;
    expectedSalary?: number;
    salaryCurrency?: string;
    availableFrom?: Date;
    coverLetter?: string;
    cvFileId?: number;
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    referralSource?: string;
}
export interface UpdateJobApplicationDTO {
    status?: ApplicationStatus;
    rating?: number;
    adminNotes?: string;
    rejectionReason?: string;
}
export interface JobApplicationFilters {
    jobId?: number;
    status?: ApplicationStatus;
    search?: string;
    ratingMin?: number;
}
//# sourceMappingURL=job-posting.types.d.ts.map