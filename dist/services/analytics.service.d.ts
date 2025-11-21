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
export declare class AnalyticsService {
    static trackVisitor(data: TrackVisitorPayload): Promise<{
        ipAddress: string | null;
        userAgent: string | null;
        visitorId: number;
        referrer: string | null;
        countryCode: string | null;
        city: string | null;
        deviceType: string | null;
        browser: string | null;
        os: string | null;
        isBot: boolean;
        firstVisit: Date;
        lastVisit: Date;
        visitCount: number;
    }>;
    static trackPageView(data: TrackPageViewPayload): Promise<{
        events: {
            viewId: number;
            eventType: string;
            eventTarget: string | null;
            eventData: import("@prisma/client/runtime/library").JsonValue | null;
            eventTime: Date;
            eventId: number;
        }[];
    } & {
        visitorId: number;
        referrer: string | null;
        pagePath: string;
        pageTitle: string | null;
        durationSeconds: number | null;
        scrollDepth: number | null;
        viewedAt: Date;
        viewId: number;
    }>;
    static getOverview(rangeDays?: number): Promise<{
        rangeDays: number;
        totalPageViews: number;
        uniqueVisitors: number;
        newVisitors: number;
        totalEvents: number;
        averageDurationSeconds: number;
        topPages: {
            pagePath: string;
            views: number;
        }[];
        visitorsByDevice: {
            deviceType: string;
            count: number;
        }[];
    }>;
    static getVisitors(page: number, limit: number, search?: string): Promise<{
        data: {
            ipAddress: string | null;
            userAgent: string | null;
            visitorId: number;
            referrer: string | null;
            countryCode: string | null;
            city: string | null;
            deviceType: string | null;
            browser: string | null;
            os: string | null;
            isBot: boolean;
            firstVisit: Date;
            lastVisit: Date;
            visitCount: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getVisitorDetail(visitorId: number): Promise<{
        pageViews: {
            visitorId: number;
            referrer: string | null;
            pagePath: string;
            pageTitle: string | null;
            durationSeconds: number | null;
            scrollDepth: number | null;
            viewedAt: Date;
            viewId: number;
        }[];
        submissions: {
            name: string;
            email: string | null;
            createdAt: Date;
            deletedAt: Date | null;
            submissionId: number;
            visitorId: number | null;
            phone: string | null;
            message: string;
            source: string | null;
            status: string | null;
            adminNotes: string | null;
            assignedTo: number | null;
            contactedAt: Date | null;
            resolvedAt: Date | null;
        }[];
    } & {
        ipAddress: string | null;
        userAgent: string | null;
        visitorId: number;
        referrer: string | null;
        countryCode: string | null;
        city: string | null;
        deviceType: string | null;
        browser: string | null;
        os: string | null;
        isBot: boolean;
        firstVisit: Date;
        lastVisit: Date;
        visitCount: number;
    }>;
    static getPageViews(page: number, limit: number, filters?: {
        pagePath?: string;
        visitorId?: number;
    }): Promise<{
        data: ({
            visitor: {
                ipAddress: string | null;
                visitorId: number;
                city: string | null;
                deviceType: string | null;
                browser: string | null;
            };
            events: {
                viewId: number;
                eventType: string;
                eventTarget: string | null;
                eventData: import("@prisma/client/runtime/library").JsonValue | null;
                eventTime: Date;
                eventId: number;
            }[];
        } & {
            visitorId: number;
            referrer: string | null;
            pagePath: string;
            pageTitle: string | null;
            durationSeconds: number | null;
            scrollDepth: number | null;
            viewedAt: Date;
            viewId: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
export {};
//# sourceMappingURL=analytics.service.d.ts.map