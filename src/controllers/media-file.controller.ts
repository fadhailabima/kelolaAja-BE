import { Request, Response } from 'express';
import { MediaFileService } from '../services/media-file.service';
import { ResponseUtil } from '../utils/response';
import { FileUtil } from '../utils/file.util';

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

      // Check if file was uploaded
      if (!req.file) {
        return ResponseUtil.error(res, 'No file uploaded', 400);
      }

      const uploadedFile = req.file;
      const fileType = FileUtil.getFileType(uploadedFile.mimetype);
      const relativePath = FileUtil.getRelativePath(uploadedFile.path);

      // Get image dimensions if it's an image
      let width: number | undefined;
      let height: number | undefined;
      if (fileType === 'image') {
        const dimensions = await FileUtil.getImageDimensions(uploadedFile.path);
        if (dimensions) {
          width = dimensions.width;
          height = dimensions.height;
        }

        // Optimize image
        await FileUtil.optimizeImage(uploadedFile.path, {
          maxWidth: 2000,
          maxHeight: 2000,
          quality: 85,
        });
      }

      // Get alt text from request body or use filename
      const altText = req.body.altText || uploadedFile.originalname;
      const isPublic = req.body.isPublic !== undefined ? req.body.isPublic === 'true' : true;

      // Create database record
      const file = await MediaFileService.createFile({
        fileName: uploadedFile.originalname,
        filePath: relativePath,
        fileType,
        mimeType: uploadedFile.mimetype,
        fileSize: BigInt(uploadedFile.size),
        width,
        height,
        altText,
        storageType: 'local',
        isPublic,
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
        totalSizeFormatted: FileUtil.formatFileSize(stats.totalSize),
      };

      return ResponseUtil.success(res, 'File statistics retrieved successfully', serializedStats);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Serve/Download a file
   */
  static async serveFile(req: Request, res: Response) {
    try {
      const fileId = parseInt(req.params.id);
      const file = await MediaFileService.getFileById(fileId);

      // Check if file is public or user has access
      if (!file.isPublic && !req.user) {
        return ResponseUtil.unauthorized(res, 'This file is not public');
      }

      // Get absolute path
      const absolutePath = FileUtil.getAbsolutePath(file.filePath);

      // Check if file exists
      const fs = await import('fs');
      if (!fs.existsSync(absolutePath)) {
        return ResponseUtil.error(res, 'File not found on server', 404);
      }

      // Set headers
      res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);

      // Send file
      return res.sendFile(absolutePath);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }

  /**
   * Download a file (force download)
   */
  static async downloadFile(req: Request, res: Response) {
    try {
      const fileId = parseInt(req.params.id);
      const file = await MediaFileService.getFileById(fileId);

      // Check if file is public or user has access
      if (!file.isPublic && !req.user) {
        return ResponseUtil.unauthorized(res, 'This file is not public');
      }

      // Get absolute path
      const absolutePath = FileUtil.getAbsolutePath(file.filePath);

      // Check if file exists
      const fs = await import('fs');
      if (!fs.existsSync(absolutePath)) {
        return ResponseUtil.error(res, 'File not found on server', 404);
      }

      // Set headers for download
      res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);

      // Send file
      return res.sendFile(absolutePath);
    } catch (error: any) {
      return ResponseUtil.error(res, error.message);
    }
  }
}
