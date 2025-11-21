"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFileService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MediaFileService {
    static async getAllFiles(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (filters?.fileType)
            where.fileType = filters.fileType;
        if (filters?.mimeType)
            where.mimeType = { contains: filters.mimeType };
        if (filters?.isPublic !== undefined)
            where.isPublic = filters.isPublic;
        if (filters?.uploadedBy)
            where.uploadedBy = filters.uploadedBy;
        const [files, total] = await Promise.all([
            prisma.mediaFile.findMany({
                where,
                include: {
                    uploader: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.mediaFile.count({ where }),
        ]);
        return {
            data: files,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getFileById(fileId) {
        const file = await prisma.mediaFile.findUnique({
            where: { fileId },
            include: {
                uploader: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        if (!file || file.deletedAt) {
            throw new Error('Media file not found');
        }
        return file;
    }
    static async createFile(data) {
        const file = await prisma.mediaFile.create({
            data: {
                fileName: data.fileName,
                filePath: data.filePath,
                fileType: data.fileType,
                mimeType: data.mimeType,
                fileSize: data.fileSize,
                width: data.width,
                height: data.height,
                altText: data.altText,
                storageType: data.storageType || 'local',
                storageUrl: data.storageUrl,
                isPublic: data.isPublic ?? true,
                uploadedBy: data.uploadedBy,
            },
            include: {
                uploader: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        return file;
    }
    static async updateFile(fileId, data) {
        const file = await prisma.mediaFile.findUnique({
            where: { fileId },
        });
        if (!file || file.deletedAt) {
            throw new Error('Media file not found');
        }
        const updatedFile = await prisma.mediaFile.update({
            where: { fileId },
            data: {
                fileName: data.fileName,
                altText: data.altText,
                isPublic: data.isPublic,
            },
            include: {
                uploader: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        return updatedFile;
    }
    static async deleteFile(fileId) {
        const file = await prisma.mediaFile.findUnique({
            where: { fileId },
        });
        if (!file || file.deletedAt) {
            throw new Error('Media file not found');
        }
        await prisma.mediaFile.update({
            where: { fileId },
            data: { deletedAt: new Date() },
        });
        return { message: 'Media file deleted successfully' };
    }
    static async getFileStats() {
        const [totalFiles, totalSize, filesByType] = await Promise.all([
            prisma.mediaFile.count({
                where: { deletedAt: null },
            }),
            prisma.mediaFile.aggregate({
                where: { deletedAt: null },
                _sum: {
                    fileSize: true,
                },
            }),
            prisma.mediaFile.groupBy({
                by: ['fileType'],
                where: { deletedAt: null },
                _count: {
                    fileId: true,
                },
            }),
        ]);
        return {
            totalFiles,
            totalSize: totalSize._sum.fileSize || BigInt(0),
            filesByType: filesByType.map((item) => ({
                fileType: item.fileType || 'unknown',
                count: item._count.fileId,
            })),
        };
    }
}
exports.MediaFileService = MediaFileService;
//# sourceMappingURL=media-file.service.js.map