"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogController = void 0;
const audit_log_service_1 = require("../services/audit-log.service");
const response_1 = require("../utils/response");
class AuditLogController {
    static async listAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const filters = {};
            if (req.query.userId)
                filters.userId = parseInt(req.query.userId);
            if (req.query.actionType)
                filters.actionType = req.query.actionType;
            if (req.query.entityType)
                filters.entityType = req.query.entityType;
            if (req.query.entityId)
                filters.entityId = parseInt(req.query.entityId);
            if (req.query.startDate)
                filters.startDate = new Date(req.query.startDate);
            if (req.query.endDate)
                filters.endDate = new Date(req.query.endDate);
            const result = await audit_log_service_1.AuditLogService.getAllLogs(page, limit, filters);
            const { data, pagination } = result;
            return response_1.ResponseUtil.success(res, 'Audit logs retrieved successfully', data, 200, pagination);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async getEntityLogs(req, res) {
        try {
            const { entityType, entityId } = req.params;
            if (!entityType || !entityId) {
                return response_1.ResponseUtil.error(res, 'entityType and entityId are required', null, 400);
            }
            const logs = await audit_log_service_1.AuditLogService.getEntityLogs(entityType, parseInt(entityId));
            return response_1.ResponseUtil.success(res, 'Entity audit logs retrieved successfully', logs);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async getUserLogs(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await audit_log_service_1.AuditLogService.getUserLogs(userId, page, limit);
            const { data, pagination } = result;
            return response_1.ResponseUtil.success(res, 'User audit logs retrieved successfully', data, 200, pagination);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async getStats(_req, res) {
        try {
            const stats = await audit_log_service_1.AuditLogService.getLogStats();
            return response_1.ResponseUtil.success(res, 'Audit log statistics retrieved successfully', stats);
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
            const log = await audit_log_service_1.AuditLogService.createLog({
                userId,
                actionType: req.body.actionType,
                entityType: req.body.entityType,
                entityId: req.body.entityId,
                oldValues: req.body.oldValues,
                newValues: req.body.newValues,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
            });
            return response_1.ResponseUtil.success(res, 'Audit log created successfully', log, 201);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
}
exports.AuditLogController = AuditLogController;
//# sourceMappingURL=audit-log.controller.js.map