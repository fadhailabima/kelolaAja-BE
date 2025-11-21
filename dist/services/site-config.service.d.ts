export declare class SiteConfigService {
    static getPublicConfigs(): Promise<any>;
    static getPublicConfigByKey(configKey: string): Promise<{
        configKey: string;
        configValue: any;
        category: string | null;
    }>;
    static getAllConfigs(page?: number, limit?: number, category?: string): Promise<{
        data: ({
            updater: {
                userId: number;
                username: string;
                email: string;
            } | null;
        } & {
            createdAt: Date;
            updatedAt: Date;
            updatedBy: number | null;
            category: string | null;
            configId: number;
            configKey: string;
            configValue: string | null;
            valueType: string | null;
            description: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static createConfig(data: {
        configKey: string;
        configValue: string;
        valueType?: string;
        category?: string;
        description?: string;
        updatedBy: number;
    }): Promise<{
        updater: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        updatedBy: number | null;
        category: string | null;
        configId: number;
        configKey: string;
        configValue: string | null;
        valueType: string | null;
        description: string | null;
    }>;
    static updateConfig(configId: number, data: {
        configValue?: string;
        valueType?: string;
        category?: string;
        description?: string;
        updatedBy: number;
    }): Promise<{
        updater: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        updatedBy: number | null;
        category: string | null;
        configId: number;
        configKey: string;
        configValue: string | null;
        valueType: string | null;
        description: string | null;
    }>;
    static updateConfigByKey(configKey: string, data: {
        configValue: string;
        updatedBy: number;
    }): Promise<{
        updater: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        updatedBy: number | null;
        category: string | null;
        configId: number;
        configKey: string;
        configValue: string | null;
        valueType: string | null;
        description: string | null;
    }>;
    static deleteConfig(configId: number): Promise<{
        message: string;
    }>;
    static bulkUpdateConfigs(configs: Array<{
        configKey: string;
        configValue: string;
    }>, updatedBy: number): Promise<{
        message: string;
        count: number;
    }>;
}
//# sourceMappingURL=site-config.service.d.ts.map