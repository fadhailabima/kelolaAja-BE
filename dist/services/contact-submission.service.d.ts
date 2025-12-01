export declare class ContactSubmissionService {
    static getAllSubmissions(page?: number, limit?: number, filters?: {
        status?: string;
        assignedTo?: number;
        source?: string;
    }): Promise<{
        data: ({
            visitor: {
                ipAddress: string | null;
                visitorId: number;
                city: string | null;
                countryCode: string | null;
                deviceType: string | null;
                browser: string | null;
            } | null;
            assignee: {
                userId: number;
                username: string;
                email: string;
            } | null;
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getSubmissionById(submissionId: number): Promise<{
        visitor: {
            ipAddress: string | null;
            userAgent: string | null;
            visitorId: number;
            city: string | null;
            referrer: string | null;
            countryCode: string | null;
            deviceType: string | null;
            browser: string | null;
            os: string | null;
            isBot: boolean;
            firstVisit: Date;
            lastVisit: Date;
            visitCount: number;
        } | null;
        assignee: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
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
    }>;
    static createSubmission(data: {
        name: string;
        email?: string;
        phone?: string;
        message: string;
        source?: string;
        visitorId?: number;
    }): Promise<{
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
    }>;
    static updateSubmission(submissionId: number, data: {
        status?: string;
        adminNotes?: string;
        assignedTo?: number;
    }): Promise<{
        visitor: {
            ipAddress: string | null;
            userAgent: string | null;
            visitorId: number;
            city: string | null;
            referrer: string | null;
            countryCode: string | null;
            deviceType: string | null;
            browser: string | null;
            os: string | null;
            isBot: boolean;
            firstVisit: Date;
            lastVisit: Date;
            visitCount: number;
        } | null;
        assignee: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
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
    }>;
    static assignSubmission(submissionId: number, assignedTo: number): Promise<{
        assignee: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
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
    }>;
    static deleteSubmission(submissionId: number): Promise<{
        message: string;
    }>;
    static getSubmissionStats(): Promise<{
        totalSubmissions: number;
        byStatus: {
            status: string;
            count: number;
        }[];
        recentSubmissions: number;
    }>;
}
//# sourceMappingURL=contact-submission.service.d.ts.map