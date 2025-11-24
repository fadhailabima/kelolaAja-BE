"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFileController = void 0;
const media_file_service_1 = require("../services/media-file.service");
const response_1 = require("../utils/response");
const file_util_1 = require("../utils/file.util");
class MediaFileController {
    static async listAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const filters = {
                fileType: req.query.fileType,
                mimeType: req.query.mimeType,
                isPublic: req.query.isPublic === 'true' ? true : req.query.isPublic === 'false' ? false : undefined,
                uploadedBy: req.query.uploadedBy ? parseInt(req.query.uploadedBy) : undefined,
            };
            const result = await media_file_service_1.MediaFileService.getAllFiles(page, limit, filters);
            const { data, pagination } = result;
            return response_1.ResponseUtil.success(res, 'Media files retrieved successfully', data, 200, pagination);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async getById(req, res) {
        try {
            const fileId = parseInt(req.params.id);
            const file = await media_file_service_1.MediaFileService.getFileById(fileId);
            return response_1.ResponseUtil.success(res, 'Media file retrieved successfully', file);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async upload(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return response_1.ResponseUtil.unauthorized(res, 'User not authenticated');
            }
            if (!req.file) {
                return response_1.ResponseUtil.error(res, 'No file uploaded', 400);
            }
            const uploadedFile = req.file;
            const fileType = file_util_1.FileUtil.getFileType(uploadedFile.mimetype);
            const relativePath = file_util_1.FileUtil.getRelativePath(uploadedFile.path);
            let width;
            let height;
            if (fileType === 'image') {
                const dimensions = await file_util_1.FileUtil.getImageDimensions(uploadedFile.path);
                if (dimensions) {
                    width = dimensions.width;
                    height = dimensions.height;
                }
                await file_util_1.FileUtil.optimizeImage(uploadedFile.path, {
                    maxWidth: 2000,
                    maxHeight: 2000,
                    quality: 85,
                });
            }
            const altText = req.body.altText || uploadedFile.originalname;
            const isPublic = req.body.isPublic !== undefined ? req.body.isPublic === 'true' : true;
            const file = await media_file_service_1.MediaFileService.createFile({
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
            return response_1.ResponseUtil.success(res, 'Media file uploaded successfully', file, 201);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async update(req, res) {
        try {
            const fileId = parseInt(req.params.id);
            const file = await media_file_service_1.MediaFileService.updateFile(fileId, req.body);
            return response_1.ResponseUtil.success(res, 'Media file updated successfully', file);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async delete(req, res) {
        try {
            const fileId = parseInt(req.params.id);
            const result = await media_file_service_1.MediaFileService.deleteFile(fileId);
            return response_1.ResponseUtil.success(res, result.message);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async getStats(_req, res) {
        try {
            const stats = await media_file_service_1.MediaFileService.getFileStats();
            const serializedStats = {
                ...stats,
                totalSize: stats.totalSize.toString(),
                totalSizeFormatted: file_util_1.FileUtil.formatFileSize(stats.totalSize),
            };
            return response_1.ResponseUtil.success(res, 'File statistics retrieved successfully', serializedStats);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async serveFile(req, res) {
        try {
            const fileId = parseInt(req.params.id);
            const file = await media_file_service_1.MediaFileService.getFileById(fileId);
            if (!file.isPublic && !req.user) {
                return response_1.ResponseUtil.unauthorized(res, 'This file is not public');
            }
            const absolutePath = file_util_1.FileUtil.getAbsolutePath(file.filePath);
            const fs = await Promise.resolve().then(() => __importStar(require('fs')));
            if (!fs.existsSync(absolutePath)) {
                return response_1.ResponseUtil.error(res, 'File not found on server', 404);
            }
            res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
            res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
            return res.sendFile(absolutePath);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
    static async downloadFile(req, res) {
        try {
            const fileId = parseInt(req.params.id);
            const file = await media_file_service_1.MediaFileService.getFileById(fileId);
            if (!file.isPublic && !req.user) {
                return response_1.ResponseUtil.unauthorized(res, 'This file is not public');
            }
            const absolutePath = file_util_1.FileUtil.getAbsolutePath(file.filePath);
            const fs = await Promise.resolve().then(() => __importStar(require('fs')));
            if (!fs.existsSync(absolutePath)) {
                return response_1.ResponseUtil.error(res, 'File not found on server', 404);
            }
            res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
            return res.sendFile(absolutePath);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
}
exports.MediaFileController = MediaFileController;
//# sourceMappingURL=media-file.controller.js.map