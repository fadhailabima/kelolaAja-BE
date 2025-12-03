"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
class AnalyticsService {
    static async trackVisitor(data) {
        if (data.visitorId) {
            const existing = await prisma_1.prisma.visitor.findUnique({
                where: { visitorId: data.visitorId }
            });
            if (existing) {
                return prisma_1.prisma.visitor.update({
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
        return prisma_1.prisma.visitor.create({
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
    static async trackPageView(data) {
        if (!data.pagePath) {
            throw new errors_1.ValidationError("pagePath is required");
        }
        const visitor = await prisma_1.prisma.visitor.findUnique({
            where: { visitorId: data.visitorId }
        });
        if (!visitor) {
            throw new errors_1.NotFoundError("Visitor not found");
        }
        const pageView = await prisma_1.prisma.pageView.create({
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
    static async getOverview(rangeDays = 7) {
        const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);
        const [pageViewsCount, newVisitors, eventCount, durationAggregate, topPages, visitorsByDevice] = await Promise.all([
            prisma_1.prisma.pageView.count({
                where: {
                    viewedAt: {
                        gte: since
                    }
                }
            }),
            prisma_1.prisma.visitor.count({
                where: {
                    firstVisit: {
                        gte: since
                    }
                }
            }),
            prisma_1.prisma.pageViewEvent.count({
                where: {
                    eventTime: {
                        gte: since
                    }
                }
            }),
            prisma_1.prisma.pageView.aggregate({
                where: {
                    viewedAt: {
                        gte: since
                    }
                },
                _avg: {
                    durationSeconds: true
                }
            }),
            prisma_1.prisma.pageView.groupBy({
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
            prisma_1.prisma.visitor.groupBy({
                by: ["deviceType"],
                _count: {
                    visitorId: true
                }
            })
        ]);
        const uniqueVisitors = await prisma_1.prisma.pageView.groupBy({
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
    static async getVisitors(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { ipAddress: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
                { deviceType: { contains: search, mode: "insensitive" } },
                { browser: { contains: search, mode: "insensitive" } }
            ];
        }
        const [total, visitors] = await Promise.all([
            prisma_1.prisma.visitor.count({ where }),
            prisma_1.prisma.visitor.findMany({
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
    static async getVisitorDetail(visitorId) {
        const visitor = await prisma_1.prisma.visitor.findUnique({
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
            throw new errors_1.NotFoundError("Visitor not found");
        }
        return visitor;
    }
    static async getPageViews(page, limit, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.pagePath) {
            where.pagePath = { contains: filters.pagePath, mode: "insensitive" };
        }
        if (filters?.visitorId) {
            where.visitorId = filters.visitorId;
        }
        const [total, pageViews] = await Promise.all([
            prisma_1.prisma.pageView.count({ where }),
            prisma_1.prisma.pageView.findMany({
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
    static async getTopPages(startDate, endDate, limit = 10) {
        const where = {};
        if (startDate || endDate) {
            where.viewedAt = {};
            if (startDate) {
                where.viewedAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.viewedAt.lte = new Date(endDate);
            }
        }
        const topPages = await prisma_1.prisma.pageView.groupBy({
            by: ["pagePath"],
            where,
            _count: {
                viewId: true
            },
            orderBy: {
                _count: {
                    viewId: "desc"
                }
            },
            take: limit
        });
        return topPages.map(item => ({
            pagePath: item.pagePath,
            views: item._count?.viewId || 0
        }));
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map