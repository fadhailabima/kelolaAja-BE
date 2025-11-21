"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteConfigController = void 0;
const site_config_service_1 = require("../services/site-config.service");
const response_1 = require("../utils/response");
class SiteConfigController {
    static async listPublic(_req, res) {
        try {
            const configs = await site_config_service_1.SiteConfigService.getPublicConfigs();
            return response_1.ResponseUtil.success(res, 'Site configurations retrieved successfully', configs);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async getByKey(req, res) {
        try {
            const configKey = req.params.key;
            const config = await site_config_service_1.SiteConfigService.getPublicConfigByKey(configKey);
            return response_1.ResponseUtil.success(res, 'Site configuration retrieved successfully', config);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async listAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const category = req.query.category;
            const result = await site_config_service_1.SiteConfigService.getAllConfigs(page, limit, category);
            return response_1.ResponseUtil.success(res, 'Site configurations retrieved successfully', result.data, 200, result.pagination);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async create(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return response_1.ResponseUtil.unauthorized(res, 'User not authenticated');
            }
            const config = await site_config_service_1.SiteConfigService.createConfig({
                ...req.body,
                updatedBy: userId,
            });
            return response_1.ResponseUtil.success(res, 'Configuration created successfully', config, 201);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async update(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return response_1.ResponseUtil.unauthorized(res, 'User not authenticated');
            }
            const configId = parseInt(req.params.id);
            const config = await site_config_service_1.SiteConfigService.updateConfig(configId, {
                ...req.body,
                updatedBy: userId,
            });
            return response_1.ResponseUtil.success(res, 'Configuration updated successfully', config);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async updateByKey(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return response_1.ResponseUtil.unauthorized(res, 'User not authenticated');
            }
            const configKey = req.params.key;
            const config = await site_config_service_1.SiteConfigService.updateConfigByKey(configKey, {
                configValue: req.body.configValue,
                updatedBy: userId,
            });
            return response_1.ResponseUtil.success(res, 'Configuration updated successfully', config);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async delete(req, res) {
        try {
            const configId = parseInt(req.params.id);
            const result = await site_config_service_1.SiteConfigService.deleteConfig(configId);
            return response_1.ResponseUtil.success(res, result.message);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async bulkUpdate(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return response_1.ResponseUtil.unauthorized(res, 'User not authenticated');
            }
            const result = await site_config_service_1.SiteConfigService.bulkUpdateConfigs(req.body.configs, userId);
            return response_1.ResponseUtil.success(res, 'Configurations updated successfully', result);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
}
exports.SiteConfigController = SiteConfigController;
//# sourceMappingURL=site-config.controller.js.map