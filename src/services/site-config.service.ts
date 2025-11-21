import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SiteConfigService {
  /**
   * Get all site configurations (public - only essential configs)
   */
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

    // Group by category for easier frontend consumption
    const grouped: any = {};
    configs.forEach(config => {
      const category = config.category || "other";
      if (!grouped[category]) {
        grouped[category] = {};
      }

      // Parse value based on type
      let parsedValue: any = config.configValue;
      if (config.valueType === "json" && config.configValue) {
        try {
          parsedValue = JSON.parse(config.configValue);
        } catch (e) {
          parsedValue = config.configValue;
        }
      } else if (config.valueType === "boolean") {
        parsedValue = config.configValue === "true";
      } else if (config.valueType === "number") {
        parsedValue = parseFloat(config.configValue || "0");
      }

      grouped[category][config.configKey] = parsedValue;
    });

    return grouped;
  }

  /**
   * Get a specific config by key (public)
   */
  static async getPublicConfigByKey(configKey: string) {
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

    // Parse value based on type
    let parsedValue: any = config.configValue;
    if (config.valueType === "json" && config.configValue) {
      try {
        parsedValue = JSON.parse(config.configValue);
      } catch (e) {
        parsedValue = config.configValue;
      }
    } else if (config.valueType === "boolean") {
      parsedValue = config.configValue === "true";
    } else if (config.valueType === "number") {
      parsedValue = parseFloat(config.configValue || "0");
    }

    return {
      configKey: config.configKey,
      configValue: parsedValue,
      category: config.category
    };
  }

  /**
   * Get all site configurations for admin (with pagination and filtering)
   */
  static async getAllConfigs(page: number = 1, limit: number = 20, category?: string) {
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

  /**
   * Create a new site configuration
   */
  static async createConfig(data: {
    configKey: string;
    configValue: string;
    valueType?: string;
    category?: string;
    description?: string;
    updatedBy: number;
  }) {
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

  /**
   * Update a site configuration
   */
  static async updateConfig(
    configId: number,
    data: {
      configValue?: string;
      valueType?: string;
      category?: string;
      description?: string;
      updatedBy: number;
    }
  ) {
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

  /**
   * Update config by key (convenience method)
   */
  static async updateConfigByKey(
    configKey: string,
    data: {
      configValue: string;
      updatedBy: number;
    }
  ) {
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

  /**
   * Delete a site configuration
   */
  static async deleteConfig(configId: number) {
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

  /**
   * Bulk update configurations
   */
  static async bulkUpdateConfigs(
    configs: Array<{
      configKey: string;
      configValue: string;
    }>,
    updatedBy: number
  ) {
    const updates = configs.map(config =>
      prisma.siteConfig.update({
        where: { configKey: config.configKey },
        data: {
          configValue: config.configValue,
          updatedBy
        }
      })
    );

    await Promise.all(updates);

    return { message: "Configurations updated successfully", count: configs.length };
  }
}
