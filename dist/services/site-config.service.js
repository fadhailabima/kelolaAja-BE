"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteConfigService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SiteConfigService {
    static async getPublicConfigs() {
        const configs = await prisma.siteConfig.findMany({
            where: {
                category: {
                    in: ["general", "contact", "social", "seo"]
                }
            },
            select: {
                configKey: true,
                configValue: true,
                valueType: true,
                category: true
            },
            orderBy: [{ category: "asc" }, { configKey: "asc" }]
        });
        const grouped = {};
        configs.forEach(config => {
            const category = config.category || "other";
            if (!grouped[category]) {
                grouped[category] = {};
            }
            let parsedValue = config.configValue;
            if (config.valueType === "json" && config.configValue) {
                try {
                    parsedValue = JSON.parse(config.configValue);
                }
                catch (e) {
                    parsedValue = config.configValue;
                }
            }
            else if (config.valueType === "boolean") {
                parsedValue = config.configValue === "true";
            }
            else if (config.valueType === "number") {
                parsedValue = parseFloat(config.configValue || "0");
            }
            grouped[category][config.configKey] = parsedValue;
        });
        return grouped;
    }
    static async getPublicConfigByKey(configKey) {
        const config = await prisma.siteConfig.findUnique({
            where: { configKey },
            select: {
                configKey: true,
                configValue: true,
                valueType: true,
                category: true
            }
        });
        if (!config) {
            throw new Error("Configuration not found");
        }
        let parsedValue = config.configValue;
        if (config.valueType === "json" && config.configValue) {
            try {
                parsedValue = JSON.parse(config.configValue);
            }
            catch (e) {
                parsedValue = config.configValue;
            }
        }
        else if (config.valueType === "boolean") {
            parsedValue = config.configValue === "true";
        }
        else if (config.valueType === "number") {
            parsedValue = parseFloat(config.configValue || "0");
        }
        return {
            configKey: config.configKey,
            configValue: parsedValue,
            category: config.category
        };
    }
    static async getAllConfigs(page = 1, limit = 20, category) {
        const skip = (page - 1) * limit;
        const [configs, total] = await Promise.all([
            prisma.siteConfig.findMany({
                where: category ? { category } : {},
                include: {
                    updater: {
                        select: {
                            userId: true,
                            username: true,
                            email: true
                        }
                    }
                },
                orderBy: [{ category: "asc" }, { configKey: "asc" }],
                skip,
                take: limit
            }),
            prisma.siteConfig.count({
                where: category ? { category } : {}
            })
        ]);
        return {
            data: configs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    static async createConfig(data) {
        const config = await prisma.siteConfig.create({
            data: {
                configKey: data.configKey,
                configValue: data.configValue,
                valueType: data.valueType || "string",
                category: data.category,
                description: data.description,
                updatedBy: data.updatedBy
            },
            include: {
                updater: {
                    select: {
                        userId: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        return config;
    }
    static async updateConfig(configId, data) {
        const config = await prisma.siteConfig.findUnique({
            where: { configId }
        });
        if (!config) {
            throw new Error("Configuration not found");
        }
        const updatedConfig = await prisma.siteConfig.update({
            where: { configId },
            data: {
                configValue: data.configValue,
                valueType: data.valueType,
                category: data.category,
                description: data.description,
                updatedBy: data.updatedBy
            },
            include: {
                updater: {
                    select: {
                        userId: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        return updatedConfig;
    }
    static async updateConfigByKey(configKey, data) {
        const config = await prisma.siteConfig.findUnique({
            where: { configKey }
        });
        if (!config) {
            throw new Error("Configuration not found");
        }
        const updatedConfig = await prisma.siteConfig.update({
            where: { configKey },
            data: {
                configValue: data.configValue,
                updatedBy: data.updatedBy
            },
            include: {
                updater: {
                    select: {
                        userId: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        return updatedConfig;
    }
    static async deleteConfig(configId) {
        const config = await prisma.siteConfig.findUnique({
            where: { configId }
        });
        if (!config) {
            throw new Error("Configuration not found");
        }
        await prisma.siteConfig.delete({
            where: { configId }
        });
        return { message: "Configuration deleted successfully" };
    }
    static async bulkUpdateConfigs(configs, updatedBy) {
        const updates = configs.map(config => prisma.siteConfig.update({
            where: { configKey: config.configKey },
            data: {
                configValue: config.configValue,
                updatedBy
            }
        }));
        await Promise.all(updates);
        return { message: "Configurations updated successfully", count: configs.length };
    }
}
exports.SiteConfigService = SiteConfigService;
//# sourceMappingURL=site-config.service.js.map