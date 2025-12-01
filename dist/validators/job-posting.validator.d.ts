import { z } from "zod";
export declare const createJobPostingSchema: z.ZodObject<{
    body: z.ZodObject<{
        jobCode: z.ZodString;
        slug: z.ZodString;
        department: z.ZodOptional<z.ZodString>;
        jobType: z.ZodEnum<{
            FullTime: "FullTime";
            PartTime: "PartTime";
            Contract: "Contract";
            Internship: "Internship";
            Freelance: "Freelance";
        }>;
        jobLevel: z.ZodEnum<{
            EntryLevel: "EntryLevel";
            Junior: "Junior";
            MidLevel: "MidLevel";
            Senior: "Senior";
            Lead: "Lead";
            Manager: "Manager";
            Director: "Director";
            Executive: "Executive";
        }>;
        workLocation: z.ZodEnum<{
            OnSite: "OnSite";
            Remote: "Remote";
            Hybrid: "Hybrid";
        }>;
        city: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        salaryMin: z.ZodOptional<z.ZodNumber>;
        salaryMax: z.ZodOptional<z.ZodNumber>;
        salaryCurrency: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        salaryPeriod: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        showSalary: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        positions: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        experienceYears: z.ZodOptional<z.ZodNumber>;
        applicationDeadline: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        isFeatured: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        publishedAt: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        translations: z.ZodArray<z.ZodObject<{
            locale: z.ZodEnum<{
                id: "id";
                en: "en";
            }>;
            title: z.ZodString;
            shortDescription: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            qualifications: z.ZodOptional<z.ZodString>;
            additionalInfo: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        requirements: z.ZodOptional<z.ZodArray<z.ZodObject<{
            locale: z.ZodEnum<{
                id: "id";
                en: "en";
            }>;
            requirement: z.ZodString;
            isRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            displayOrder: z.ZodNumber;
        }, z.core.$strip>>>;
        responsibilities: z.ZodOptional<z.ZodArray<z.ZodObject<{
            locale: z.ZodEnum<{
                id: "id";
                en: "en";
            }>;
            responsibility: z.ZodString;
            displayOrder: z.ZodNumber;
        }, z.core.$strip>>>;
        benefits: z.ZodOptional<z.ZodArray<z.ZodObject<{
            locale: z.ZodEnum<{
                id: "id";
                en: "en";
            }>;
            benefit: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            iconName: z.ZodOptional<z.ZodString>;
            displayOrder: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateJobPostingSchema: z.ZodObject<{
    body: z.ZodObject<{
        jobCode: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodString>;
        department: z.ZodOptional<z.ZodString>;
        jobType: z.ZodOptional<z.ZodEnum<{
            FullTime: "FullTime";
            PartTime: "PartTime";
            Contract: "Contract";
            Internship: "Internship";
            Freelance: "Freelance";
        }>>;
        jobLevel: z.ZodOptional<z.ZodEnum<{
            EntryLevel: "EntryLevel";
            Junior: "Junior";
            MidLevel: "MidLevel";
            Senior: "Senior";
            Lead: "Lead";
            Manager: "Manager";
            Director: "Director";
            Executive: "Executive";
        }>>;
        workLocation: z.ZodOptional<z.ZodEnum<{
            OnSite: "OnSite";
            Remote: "Remote";
            Hybrid: "Hybrid";
        }>>;
        city: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        salaryMin: z.ZodOptional<z.ZodNumber>;
        salaryMax: z.ZodOptional<z.ZodNumber>;
        salaryCurrency: z.ZodOptional<z.ZodString>;
        salaryPeriod: z.ZodOptional<z.ZodString>;
        showSalary: z.ZodOptional<z.ZodBoolean>;
        positions: z.ZodOptional<z.ZodNumber>;
        experienceYears: z.ZodOptional<z.ZodNumber>;
        applicationDeadline: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        isFeatured: z.ZodOptional<z.ZodBoolean>;
        publishedAt: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        closedAt: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        translations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            locale: z.ZodEnum<{
                id: "id";
                en: "en";
            }>;
            title: z.ZodString;
            shortDescription: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            qualifications: z.ZodOptional<z.ZodString>;
            additionalInfo: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        requirements: z.ZodOptional<z.ZodArray<z.ZodObject<{
            locale: z.ZodEnum<{
                id: "id";
                en: "en";
            }>;
            requirement: z.ZodString;
            isRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            displayOrder: z.ZodNumber;
        }, z.core.$strip>>>;
        responsibilities: z.ZodOptional<z.ZodArray<z.ZodObject<{
            locale: z.ZodEnum<{
                id: "id";
                en: "en";
            }>;
            responsibility: z.ZodString;
            displayOrder: z.ZodNumber;
        }, z.core.$strip>>>;
        benefits: z.ZodOptional<z.ZodArray<z.ZodObject<{
            locale: z.ZodEnum<{
                id: "id";
                en: "en";
            }>;
            benefit: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            iconName: z.ZodOptional<z.ZodString>;
            displayOrder: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const createJobApplicationSchema: z.ZodObject<{
    body: z.ZodObject<{
        jobId: z.ZodNumber;
        applicantName: z.ZodString;
        applicantEmail: z.ZodString;
        applicantPhone: z.ZodOptional<z.ZodString>;
        currentCompany: z.ZodOptional<z.ZodString>;
        currentPosition: z.ZodOptional<z.ZodString>;
        yearsOfExperience: z.ZodOptional<z.ZodNumber>;
        expectedSalary: z.ZodOptional<z.ZodNumber>;
        salaryCurrency: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        availableFrom: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        coverLetter: z.ZodOptional<z.ZodString>;
        cvFileId: z.ZodOptional<z.ZodNumber>;
        portfolioUrl: z.ZodOptional<z.ZodString>;
        linkedinUrl: z.ZodOptional<z.ZodString>;
        githubUrl: z.ZodOptional<z.ZodString>;
        referralSource: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateJobApplicationSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<{
            Pending: "Pending";
            Reviewed: "Reviewed";
            Shortlisted: "Shortlisted";
            Interview: "Interview";
            Offered: "Offered";
            Rejected: "Rejected";
            Accepted: "Accepted";
        }>>;
        rating: z.ZodOptional<z.ZodNumber>;
        adminNotes: z.ZodOptional<z.ZodString>;
        rejectionReason: z.ZodOptional<z.ZodString>;
        assignedTo: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=job-posting.validator.d.ts.map