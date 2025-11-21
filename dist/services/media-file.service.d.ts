export declare class MediaFileService {
    static getAllFiles(page?: number, limit?: number, filters?: {
        fileType?: string;
        mimeType?: string;
        isPublic?: boolean;
        uploadedBy?: number;
    }): Promise<{
        data: ({
            uploader: {
                userId: number;
                username: string;
                email: string;
            } | null;
        } & {
            createdAt: Date;
            deletedAt: Date | null;
            fileId: number;
            fileName: string;
            filePath: string;
            fileType: string | null;
            mimeType: string | null;
            fileSize: bigint | null;
            width: number | null;
            height: number | null;
            altText: string | null;
            storageType: string | null;
            storageUrl: string | null;
            isPublic: boolean;
            uploadedBy: number | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getFileById(fileId: number): Promise<{
        uploader: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
        createdAt: Date;
        deletedAt: Date | null;
        fileId: number;
        fileName: string;
        filePath: string;
        fileType: string | null;
        mimeType: string | null;
        fileSize: bigint | null;
        width: number | null;
        height: number | null;
        altText: string | null;
        storageType: string | null;
        storageUrl: string | null;
        isPublic: boolean;
        uploadedBy: number | null;
    }>;
    static createFile(data: {
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
    }): Promise<{
        uploader: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
        createdAt: Date;
        deletedAt: Date | null;
        fileId: number;
        fileName: string;
        filePath: string;
        fileType: string | null;
        mimeType: string | null;
        fileSize: bigint | null;
        width: number | null;
        height: number | null;
        altText: string | null;
        storageType: string | null;
        storageUrl: string | null;
        isPublic: boolean;
        uploadedBy: number | null;
    }>;
    static updateFile(fileId: number, data: {
        fileName?: string;
        altText?: string;
        isPublic?: boolean;
    }): Promise<{
        uploader: {
            userId: number;
            username: string;
            email: string;
        } | null;
    } & {
        createdAt: Date;
        deletedAt: Date | null;
        fileId: number;
        fileName: string;
        filePath: string;
        fileType: string | null;
        mimeType: string | null;
        fileSize: bigint | null;
        width: number | null;
        height: number | null;
        altText: string | null;
        storageType: string | null;
        storageUrl: string | null;
        isPublic: boolean;
        uploadedBy: number | null;
    }>;
    static deleteFile(fileId: number): Promise<{
        message: string;
    }>;
    static getFileStats(): Promise<{
        totalFiles: number;
        totalSize: bigint;
        filesByType: {
            fileType: string;
            count: number;
        }[];
    }>;
}
//# sourceMappingURL=media-file.service.d.ts.map