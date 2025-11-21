import { prisma } from "../utils/prisma";
import { NotFoundError, ValidationError } from "../utils/errors";

type TrackVisitorPayload = {
  visitorId?: number;
  ipAddress?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
  countryCode?: string | null;
  city?: string | null;
  deviceType?: string | null;
  browser?: string | null;
  os?: string | null;
  isBot?: boolean;
};

type TrackPageViewPayload = {
  visitorId: number;
  pagePath: string;
  pageTitle?: string | null;
  referrer?: string | null;
  durationSeconds?: number | null;
  scrollDepth?: number | null;
  events?: Array<{
    eventType: string;
    eventTarget?: string | null;
    eventData?: any;
  }>;
};

export class AnalyticsService {
  /**
   * Create or update visitor session
   */
  static async trackVisitor(data: TrackVisitorPayload) {
    if (data.visitorId) {
      const existing = await prisma.visitor.findUnique({
        where: { visitorId: data.visitorId }
      });

      if (existing) {
        return prisma.visitor.update({
          where: { visitorId: data.visitorId },
          data: {
            ipAddress: data.ipAddress ?? existing.ipAddress,
            userAgent: data.userAgent ?? existing.userAgent,
            referrer: data.referrer ?? existing.referrer,
            countryCode: data.countryCode ?? existing.countryCode,
            city: data.city ?? existing.city,
            deviceType: data.deviceType ?? existing.deviceType,
            browser: data.browser ?? existing.browser,
            os: data.os ?? existing.os,
            isBot: data.isBot ?? existing.isBot,
            lastVisit: new Date(),
            visitCount: {
              increment: 1
            }
          }
        });
      }
    }

    return prisma.visitor.create({
      data: {
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        referrer: data.referrer || null,
        countryCode: data.countryCode || null,
        city: data.city || null,
        deviceType: data.deviceType || null,
        browser: data.browser || null,
        os: data.os || null,
        isBot: data.isBot ?? false
      }
    });
  }

  /**
   * Track page view event
   */
  static async trackPageView(data: TrackPageViewPayload) {
    if (!data.pagePath) {
      throw new ValidationError("pagePath is required");
    }

    const visitor = await prisma.visitor.findUnique({
      where: { visitorId: data.visitorId }
    });

    if (!visitor) {
      throw new NotFoundError("Visitor not found");
    }

    const pageView = await prisma.pageView.create({
      data: {
        visitorId: data.visitorId,
        pagePath: data.pagePath,
        pageTitle: data.pageTitle || null,
        referrer: data.referrer || null,
        durationSeconds: data.durationSeconds ?? null,
        scrollDepth: data.scrollDepth ?? null,
        events: data.events && data.events.length > 0 ? { create: data.events.map(event => ({ ...event })) } : undefined
      },
      include: {
        events: true
      }
    });

    return pageView;
  }

  /**
   * Overview metrics for dashboard
   */
  static async getOverview(rangeDays: number = 7) {
    const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

    const [pageViewsCount, newVisitors, eventCount, durationAggregate, topPages, visitorsByDevice] = await Promise.all([
      prisma.pageView.count({
        where: {
          viewedAt: {
            gte: since
          }
        }
      }),
      prisma.visitor.count({
        where: {
          firstVisit: {
            gte: since
          }
        }
      }),
      prisma.pageViewEvent.count({
        where: {
          eventTime: {
            gte: since
          }
        }
      }),
      prisma.pageView.aggregate({
        where: {
          viewedAt: {
            gte: since
          }
        },
        _avg: {
          durationSeconds: true
        }
      }),
      prisma.pageView.groupBy({
        by: ["pagePath"],
        where: {
          viewedAt: {
            gte: since
          }
        },
        _count: {
          viewId: true
        },
        orderBy: {
          _count: {
            viewId: "desc"
          }
        },
        take: 5
      }),
      prisma.visitor.groupBy({
        by: ["deviceType"],
        _count: {
          visitorId: true
        }
      })
    ]);

    const uniqueVisitors = await prisma.pageView.groupBy({
      by: ["visitorId"],
      where: {
        viewedAt: {
          gte: since
        }
      }
    });

    return {
      rangeDays,
      totalPageViews: pageViewsCount,
      uniqueVisitors: uniqueVisitors.length,
      newVisitors,
      totalEvents: eventCount,
      averageDurationSeconds: durationAggregate._avg.durationSeconds || 0,
      topPages: topPages.map(item => ({
        pagePath: item.pagePath,
        views: item._count?.viewId || 0
      })),
      visitorsByDevice: visitorsByDevice.map(item => ({
        deviceType: item.deviceType || "unknown",
        count: item._count?.visitorId || 0
      }))
    };
  }

  /**
   * Paginated visitors
   */
  static async getVisitors(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { ipAddress: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { deviceType: { contains: search, mode: "insensitive" } },
        { browser: { contains: search, mode: "insensitive" } }
      ];
    }

    const [total, visitors] = await Promise.all([
      prisma.visitor.count({ where }),
      prisma.visitor.findMany({
        where,
        orderBy: { lastVisit: "desc" },
        skip,
        take: limit
      })
    ]);

    return {
      data: visitors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Visitor detail
   */
  static async getVisitorDetail(visitorId: number) {
    const visitor = await prisma.visitor.findUnique({
      where: { visitorId },
      include: {
        pageViews: {
          orderBy: { viewedAt: "desc" },
          take: 10
        },
        submissions: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });

    if (!visitor) {
      throw new NotFoundError("Visitor not found");
    }

    return visitor;
  }

  /**
   * Paginated page views
   */
  static async getPageViews(
    page: number,
    limit: number,
    filters?: {
      pagePath?: string;
      visitorId?: number;
    }
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.pagePath) {
      where.pagePath = { contains: filters.pagePath, mode: "insensitive" };
    }

    if (filters?.visitorId) {
      where.visitorId = filters.visitorId;
    }

    const [total, pageViews] = await Promise.all([
      prisma.pageView.count({ where }),
      prisma.pageView.findMany({
        where,
        include: {
          visitor: {
            select: {
              visitorId: true,
              ipAddress: true,
              deviceType: true,
              browser: true,
              city: true
            }
          },
          events: true
        },
        orderBy: { viewedAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return {
      data: pageViews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
