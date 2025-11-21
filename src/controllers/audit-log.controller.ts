import { Request, Response } from 'express';
import { AuditLogService } from '../services/audit-log.service';
import { ResponseUtil } from '../utils/response';

export class AuditLogController {
  /**
   * Get all audit logs (admin)
   */
  static async listAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const filters: any = {};

      if (req.query.userId) filters.userId = parseInt(req.query.userId as string);
      if (req.query.actionType) filters.actionType = req.query.actionType as string;
      if (req.query.entityType) filters.entityType = req.query.entityType as string;
      if (req.query.entityId) filters.entityId = parseInt(req.query.entityId as string);
      if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

      const result = await AuditLogService.getAllLogs(page, limit, filters);
      const { data, pagination } = result;

      return ResponseUtil.success(res, 'Audit logs retrieved successfully', data, 200, pagination);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  static async getEntityLogs(req: Request, res: Response) {
    try {
      const { entityType, entityId } = req.params;

      if (!entityType || !entityId) {
        return ResponseUtil.error(res, 'entityType and entityId are required', null, 400);
      }

      const logs = await AuditLogService.getEntityLogs(entityType, parseInt(entityId));

      return ResponseUtil.success(res, 'Entity audit logs retrieved successfully', logs);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get audit logs for a specific user
   */
  static async getUserLogs(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await AuditLogService.getUserLogs(userId, page, limit);
      const { data, pagination } = result;

      return ResponseUtil.success(res, 'User audit logs retrieved successfully', data, 200, pagination);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get audit log statistics
   */
  static async getStats(_req: Request, res: Response) {
    try {
      const stats = await AuditLogService.getLogStats();

      return ResponseUtil.success(res, 'Audit log statistics retrieved successfully', stats);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Create a manual audit log entry (admin)
   */
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const log = await AuditLogService.createLog({
        userId,
        actionType: req.body.actionType,
        entityType: req.body.entityType,
        entityId: req.body.entityId,
        oldValues: req.body.oldValues,
        newValues: req.body.newValues,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      return ResponseUtil.success(res, 'Audit log created successfully', log, 201);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }
}
