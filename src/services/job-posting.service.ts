// src/services/job-posting.service.ts

import { prisma } from "../utils/prisma";
import { Locale } from "@prisma/client";
import {
  CreateJobPostingDTO,
  UpdateJobPostingDTO,
  JobPostingFilters,
} from "../types/job-posting.types";

export class JobPostingService {
  async createJobPosting(data: CreateJobPostingDTO, createdBy: number) {
    const { translations, requirements, responsibilities, benefits, ...jobData } = data;

    const job = await prisma.jobPosting.create({
      data: {
        ...jobData,
        createdBy,
        updatedBy: createdBy,
        translations: {
          create: translations,
        },
        requirements: requirements?.length
          ? {
              create: requirements.map((req) => ({
                displayOrder: req.displayOrder,
                isRequired: req.isRequired ?? true,
                translations: {
                  create: {
                    locale: req.locale,
                    requirement: req.requirement,
                  },
                },
              })),
            }
          : undefined,
        responsibilities: responsibilities?.length
          ? {
              create: responsibilities.map((resp) => ({
                displayOrder: resp.displayOrder,
                translations: {
                  create: {
                    locale: resp.locale,
                    responsibility: resp.responsibility,
                  },
                },
              })),
            }
          : undefined,
        benefits: benefits?.length
          ? {
              create: benefits.map((ben) => ({
                displayOrder: ben.displayOrder,
                iconName: ben.iconName,
                translations: {
                  create: {
                    locale: ben.locale,
                    benefit: ben.benefit,
                    description: ben.description,
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
        requirements: {
          include: { translations: true },
        },
        responsibilities: {
          include: { translations: true },
        },
        benefits: {
          include: { translations: true },
        },
      },
    });

    return job;
  }

  async updateJobPosting(jobId: number, data: UpdateJobPostingDTO, updatedBy: number) {
    const { translations, requirements, responsibilities, benefits, ...jobData } = data;

    // Delete existing child records if new data is provided
    if (requirements !== undefined) {
      await prisma.jobRequirement.deleteMany({ where: { jobId } });
    }
    if (responsibilities !== undefined) {
      await prisma.jobResponsibility.deleteMany({ where: { jobId } });
    }
    if (benefits !== undefined) {
      await prisma.jobBenefit.deleteMany({ where: { jobId } });
    }
    if (translations !== undefined) {
      await prisma.jobPostingTranslation.deleteMany({ where: { jobId } });
    }

    const job = await prisma.jobPosting.update({
      where: { jobId },
      data: {
        ...jobData,
        updatedBy,
        translations: translations
          ? {
              deleteMany: {},
              create: translations.map(t => ({
                locale: t.locale,
                title: t.title || '',
                shortDescription: t.shortDescription,
                description: t.description,
                qualifications: t.qualifications,
                additionalInfo: t.additionalInfo,
              })),
            }
          : undefined,
        requirements: requirements?.length
          ? {
              create: requirements.map((req) => ({
                displayOrder: req.displayOrder,
                isRequired: req.isRequired ?? true,
                translations: {
                  create: {
                    locale: req.locale,
                    requirement: req.requirement,
                  },
                },
              })),
            }
          : undefined,
        responsibilities: responsibilities?.length
          ? {
              create: responsibilities.map((resp) => ({
                displayOrder: resp.displayOrder,
                translations: {
                  create: {
                    locale: resp.locale,
                    responsibility: resp.responsibility,
                  },
                },
              })),
            }
          : undefined,
        benefits: benefits?.length
          ? {
              create: benefits.map((ben) => ({
                displayOrder: ben.displayOrder,
                iconName: ben.iconName,
                translations: {
                  create: {
                    locale: ben.locale,
                    benefit: ben.benefit,
                    description: ben.description,
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
        requirements: {
          include: { translations: true },
        },
        responsibilities: {
          include: { translations: true },
        },
        benefits: {
          include: { translations: true },
        },
      },
    });

    return job;
  }

  async getJobPostings(
    filters: JobPostingFilters,
    locale?: Locale,
    page: number = 1,
    limit: number = 10
  ) {
    const where: any = {
      deletedAt: null,
    };

    if (filters.jobType) where.jobType = filters.jobType;
    if (filters.jobLevel) where.jobLevel = filters.jobLevel;
    if (filters.workLocation) where.workLocation = filters.workLocation;
    if (filters.city) where.city = { contains: filters.city, mode: "insensitive" };
    if (filters.department) where.department = { contains: filters.department, mode: "insensitive" };
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;

    if (filters.search) {
      where.OR = [
        { translations: { some: { title: { contains: filters.search, mode: "insensitive" } } } },
        { translations: { some: { description: { contains: filters.search, mode: "insensitive" } } } },
        { department: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [total, jobs] = await Promise.all([
      prisma.jobPosting.count({ where }),
      prisma.jobPosting.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        include: {
          translations: locale ? { where: { locale } } : true,
          requirements: {
            include: {
              translations: locale ? { where: { locale } } : true,
            },
            orderBy: { displayOrder: "asc" },
          },
          responsibilities: {
            include: {
              translations: locale ? { where: { locale } } : true,
            },
            orderBy: { displayOrder: "asc" },
          },
          benefits: {
            include: {
              translations: locale ? { where: { locale } } : true,
            },
            orderBy: { displayOrder: "asc" },
          },
        },
      }),
    ]);

    return {
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJobPostingById(jobId: number, locale?: Locale) {
    const job = await prisma.jobPosting.findUnique({
      where: { jobId },
      include: {
        translations: locale ? { where: { locale } } : true,
        requirements: {
          include: {
            translations: locale ? { where: { locale } } : true,
          },
          orderBy: { displayOrder: "asc" },
        },
        responsibilities: {
          include: {
            translations: locale ? { where: { locale } } : true,
          },
          orderBy: { displayOrder: "asc" },
        },
        benefits: {
          include: {
            translations: locale ? { where: { locale } } : true,
          },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    return job;
  }

  async getJobPostingBySlug(slug: string, locale?: Locale) {
    const job = await prisma.jobPosting.findUnique({
      where: { slug },
      include: {
        translations: locale ? { where: { locale } } : true,
        requirements: {
          include: {
            translations: locale ? { where: { locale } } : true,
          },
          orderBy: { displayOrder: "asc" },
        },
        responsibilities: {
          include: {
            translations: locale ? { where: { locale } } : true,
          },
          orderBy: { displayOrder: "asc" },
        },
        benefits: {
          include: {
            translations: locale ? { where: { locale } } : true,
          },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (job) {
      // Increment view count
      await prisma.jobPosting.update({
        where: { jobId: job.jobId },
        data: { viewCount: { increment: 1 } },
      });
    }

    return job;
  }

  async deleteJobPosting(jobId: number) {
    return await prisma.jobPosting.update({
      where: { jobId },
      data: { deletedAt: new Date() },
    });
  }

  async getJobStats() {
    const [totalJobs, activeJobs, totalApplications, pendingApplications] = await Promise.all([
      prisma.jobPosting.count({ where: { deletedAt: null } }),
      prisma.jobPosting.count({ where: { isActive: true, deletedAt: null } }),
      prisma.jobApplication.count({ where: { deletedAt: null } }),
      prisma.jobApplication.count({ where: { status: "Pending", deletedAt: null } }),
    ]);

    const jobsByType = await prisma.jobPosting.groupBy({
      by: ["jobType"],
      where: { deletedAt: null },
      _count: true,
    });

    const jobsByLevel = await prisma.jobPosting.groupBy({
      by: ["jobLevel"],
      where: { deletedAt: null },
      _count: true,
    });

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      jobsByType,
      jobsByLevel,
    };
  }
}
