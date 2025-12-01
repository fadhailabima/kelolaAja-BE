// src/services/job-application.service.ts

import { prisma } from "../utils/prisma";
import { CreateJobApplicationDTO, UpdateJobApplicationDTO, JobApplicationFilters } from "../types/job-posting.types";

export class JobApplicationService {
  async createJobApplication(data: CreateJobApplicationDTO, ipAddress?: string, userAgent?: string) {
    const application = await prisma.jobApplication.create({
      data: {
        ...data,
        ipAddress,
        userAgent
      },
      include: {
        job: {
          include: {
            translations: true
          }
        },
        cvFile: true
      }
    });

    // Increment application count for the job
    await prisma.jobPosting.update({
      where: { jobId: data.jobId },
      data: { applicationCount: { increment: 1 } }
    });

    return application;
  }

  async updateJobApplication(applicationId: number, data: UpdateJobApplicationDTO) {
    const updateData: any = { ...data };

    if (data.status) {
      if (data.status === "Reviewed" && !updateData.reviewedAt) {
        updateData.reviewedAt = new Date();
      }
      if (data.status === "Interview" && !updateData.interviewedAt) {
        updateData.interviewedAt = new Date();
      }
    }

    return await prisma.jobApplication.update({
      where: { applicationId },
      data: updateData,
      include: {
        job: {
          include: {
            translations: true
          }
        },
        cvFile: true
      }
    });
  }

  async getJobApplications(filters: JobApplicationFilters, page: number = 1, limit: number = 10) {
    const where: any = {
      deletedAt: null
    };

    if (filters.jobId) where.jobId = filters.jobId;
    if (filters.status) where.status = filters.status;
    if (filters.ratingMin) where.rating = { gte: filters.ratingMin };

    if (filters.search) {
      where.OR = [
        { applicantName: { contains: filters.search, mode: "insensitive" } },
        { applicantEmail: { contains: filters.search, mode: "insensitive" } },
        { currentCompany: { contains: filters.search, mode: "insensitive" } },
        { currentPosition: { contains: filters.search, mode: "insensitive" } }
      ];
    }

    const [total, applications] = await Promise.all([
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            include: {
              translations: true
            }
          },
          cvFile: true
        }
      })
    ]);

    return {
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getJobApplicationById(applicationId: number) {
    return await prisma.jobApplication.findUnique({
      where: { applicationId },
      include: {
        job: {
          include: {
            translations: true
          }
        },
        cvFile: true
      }
    });
  }

  async getApplicationsByJob(jobId: number, page: number = 1, limit: number = 10) {
    return this.getJobApplications({ jobId }, page, limit);
  }

  async deleteJobApplication(applicationId: number) {
    const application = await prisma.jobApplication.findUnique({
      where: { applicationId },
      select: { jobId: true }
    });

    if (application) {
      // Decrement application count
      await prisma.jobPosting.update({
        where: { jobId: application.jobId },
        data: { applicationCount: { decrement: 1 } }
      });
    }

    return await prisma.jobApplication.update({
      where: { applicationId },
      data: { deletedAt: new Date() }
    });
  }

  async getApplicationStats(jobId?: number) {
    const where: any = { deletedAt: null };
    if (jobId) where.jobId = jobId;

    const [total, byStatus] = await Promise.all([
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.groupBy({
        by: ["status"],
        where,
        _count: true
      })
    ]);

    const avgRating = await prisma.jobApplication.aggregate({
      where: { ...where, rating: { not: null } },
      _avg: { rating: true }
    });

    return {
      total,
      byStatus,
      avgRating: avgRating._avg.rating
    };
  }
}
