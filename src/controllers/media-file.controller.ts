import { Request, Response } from 'express';
import { MediaFileService } from '../services/media-file.service';
import { ResponseUtil } from '../utils/response';

export class MediaFileController {
  /**
   * Get all media files (admin)
   */
  static async listAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const filters = {
        fileType: req.query.fileType as string | undefined,
        mimeType: req.query.mimeType as string | undefined,
        isPublic: req.query.isPublic === 'true' ? true : req.query.isPublic === 'false' ? false : undefined,
        uploadedBy: req.query.uploadedBy ? parseInt(req.query.uploadedBy as string) : undefined,
      };

      const result = await MediaFileService.getAllFiles(page, limit, filters);
      const { data, pagination } = result;

      return ResponseUtil.success(res, 'Media files retrieved successfully', data, 200, pagination);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get a single media file by ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const fileId = parseInt(req.params.id);
      const file = await MediaFileService.getFileById(fileId);

      return ResponseUtil.success(res, 'Media file retrieved successfully', file);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Upload a new media file
   */
  static async upload(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseUtil.unauthorized(res, 'User not authenticated');
      }

      const file = await MediaFileService.createFile({
        ...req.body,
        uploadedBy: userId,
      });

      return ResponseUtil.success(res, 'Media file uploaded successfully', file, 201);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Update media file metadata
   */
  static async update(req: Request, res: Response) {
    try {
      const fileId = parseInt(req.params.id);
      const file = await MediaFileService.updateFile(fileId, req.body);

      return ResponseUtil.success(res, 'Media file updated successfully', file);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Delete a media file
   */
  static async delete(req: Request, res: Response) {
    try {
      const fileId = parseInt(req.params.id);
      const result = await MediaFileService.deleteFile(fileId);

      return ResponseUtil.success(res, result.message);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Get file statistics
   */
  static async getStats(_req: Request, res: Response) {
    try {
      const stats = await MediaFileService.getFileStats();

      // Convert BigInt to string for JSON serialization
      const serializedStats = {
        ...stats,
        totalSize: stats.totalSize.toString(),
      };

      return ResponseUtil.success(res, 'File statistics retrieved successfully', serializedStats);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }
}
