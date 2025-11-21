"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFileController = void 0;
const media_file_service_1 = require("../services/media-file.service");
const response_1 = require("../utils/response");
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
            const file = await media_file_service_1.MediaFileService.createFile({
                ...req.body,
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
            };
            return response_1.ResponseUtil.success(res, 'File statistics retrieved successfully', serializedStats);
        }
        catch (error) {
            return response_1.ResponseUtil.error(res, error.message);
        }
    }
}
exports.MediaFileController = MediaFileController;
//# sourceMappingURL=media-file.controller.js.map