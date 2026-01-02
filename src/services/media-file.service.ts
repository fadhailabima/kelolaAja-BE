import { PrismaClient } from "@prisma/client";
import { FileUtil } from "../utils/file.util";

const prisma = new PrismaClient();

export class MediaFileService {
  /**
   * Get all media files (with pagination and filtering)
   */
  static async getAllFiles(
    page: number = 1,
    limit: number = 20,
    filters?: {
      fileType?: string;
      mimeType?: string;
      isPublic?: boolean;
      uploadedBy?: number;
    }
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (filters?.fileType) where.fileType = filters.fileType;
    if (filters?.mimeType) where.mimeType = { contains: filters.mimeType };
    if (filters?.isPublic !== undefined) where.isPublic = filters.isPublic;
    if (filters?.uploadedBy) where.uploadedBy = filters.uploadedBy;

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
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.mediaFile.count({ where }),
    ]);

    // Convert BigInt to Number for JSON serialization and add file URLs
    const serializedFiles = files.map((file) => ({
      ...file,
      fileSize: file.fileSize ? Number(file.fileSize) : 0,
      fileUrl: FileUtil.getFileUrl(file.filePath),
    }));

    return {
      data: serializedFiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single media file by ID
   */
  static async getFileById(fileId: number) {
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
      throw new Error("Media file not found");
    }

    return {
      ...file,
      fileSize: file.fileSize ? Number(file.fileSize) : 0,
      fileUrl: FileUtil.getFileUrl(file.filePath),
    };
  }

  /**
   * Upload/Create a new media file
   */
  static async createFile(data: {
    fileName: string;
    filePath: string;
    fileType?: string;
    mimeType?: string;
    fileSize?: bigint;
    width?: number;
    height?: number;
    altText?: string;
    storageType?: string;
    storageUrl?: string;
    isPublic?: boolean;
    uploadedBy?: number;
  }) {
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
        storageType: data.storageType || "local",
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

    // Serialize BigInt and add fileUrl
    return {
      ...file,
      fileSize: file.fileSize ? Number(file.fileSize) : 0,
      fileUrl: FileUtil.getFileUrl(file.filePath),
    };
  }

  /**
   * Update media file metadata
   */
  static async updateFile(
    fileId: number,
    data: {
      fileName?: string;
      altText?: string;
      isPublic?: boolean;
    }
  ) {
    const file = await prisma.mediaFile.findUnique({
      where: { fileId },
    });

    if (!file || file.deletedAt) {
      throw new Error("Media file not found");
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

    // Serialize BigInt and add fileUrl
    return {
      ...updatedFile,
      fileSize: updatedFile.fileSize ? Number(updatedFile.fileSize) : 0,
      fileUrl: FileUtil.getFileUrl(updatedFile.filePath),
    };
  }

  /**
   * Delete a media file (soft delete)
   */
  static async deleteFile(fileId: number) {
    const file = await prisma.mediaFile.findUnique({
      where: { fileId },
    });

    if (!file || file.deletedAt) {
      throw new Error("Media file not found");
    }

    // Soft delete in database
    await prisma.mediaFile.update({
      where: { fileId },
      data: { deletedAt: new Date() },
    });

    // Optionally delete physical file (uncomment if you want hard delete)
    // const absolutePath = FileUtil.getAbsolutePath(file.filePath);
    // FileUtil.deleteFile(absolutePath);

    return { message: "Media file deleted successfully" };
  }

  /**
   * Permanently delete a media file (hard delete)
   */
  static async permanentlyDeleteFile(fileId: number) {
    const file = await prisma.mediaFile.findUnique({
      where: { fileId },
    });

    if (!file) {
      throw new Error("Media file not found");
    }

    // Delete physical file
    const absolutePath = FileUtil.getAbsolutePath(file.filePath);
    FileUtil.deleteFile(absolutePath);

    // Delete from database
    await prisma.mediaFile.delete({
      where: { fileId },
    });

    return { message: "Media file permanently deleted" };
  }

  /**
   * Get file statistics
   */
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
        by: ["fileType"],
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
        fileType: item.fileType || "unknown",
        count: item._count.fileId,
      })),
    };
  }
}
