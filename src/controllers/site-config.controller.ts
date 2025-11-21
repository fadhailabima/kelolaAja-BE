import { Request, Response } from 'express';
import { SiteConfigService } from '../services/site-config.service';
import { ResponseUtil } from '../utils/response';

export class SiteConfigController {
  /**
   * Get all public site configurations
   */
  static async listPublic(_req: Request, res: Response) {
    try {
      const configs = await SiteConfigService.getPublicConfigs();
      return ResponseUtil.success(res, 'Site configurations retrieved successfully', configs);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get a specific config by key (public)
   */
  static async getByKey(req: Request, res: Response) {
    try {
      const configKey = req.params.key;
      const config = await SiteConfigService.getPublicConfigByKey(configKey);
      return ResponseUtil.success(res, 'Site configuration retrieved successfully', config);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get all site configurations for admin (with pagination)
   */
  static async listAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string | undefined;

      const result = await SiteConfigService.getAllConfigs(page, limit, category);
      return ResponseUtil.success(res, 'Site configurations retrieved successfully', result.data, 200, result.pagination);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Create a new site configuration
   */
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const config = await SiteConfigService.createConfig({
        ...req.body,
        updatedBy: userId,
      });

      return ResponseUtil.success(res, 'Configuration created successfully', config, 201);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Update a site configuration
   */
  static async update(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const configId = parseInt(req.params.id);
      const config = await SiteConfigService.updateConfig(configId, {
        ...req.body,
        updatedBy: userId,
      });

      return ResponseUtil.success(res, 'Configuration updated successfully', config);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Update config by key
   */
  static async updateByKey(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const configKey = req.params.key;
      const config = await SiteConfigService.updateConfigByKey(configKey, {
        configValue: req.body.configValue,
        updatedBy: userId,
      });

      return ResponseUtil.success(res, 'Configuration updated successfully', config);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Delete a site configuration
   */
  static async delete(req: Request, res: Response) {
    try {
      const configId = parseInt(req.params.id);
      const result = await SiteConfigService.deleteConfig(configId);

      return ResponseUtil.success(res, result.message);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Bulk update configurations
   */
  static async bulkUpdate(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const result = await SiteConfigService.bulkUpdateConfigs(req.body.configs, userId);

      return ResponseUtil.success(res, 'Configurations updated successfully', result);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }
}
