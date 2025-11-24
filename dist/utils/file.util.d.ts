export declare class FileUtil {
    static getFileType(mimeType: string): string;
    static getImageDimensions(filePath: string): Promise<{
        width: number;
        height: number;
    } | null>;
    static optimizeImage(filePath: string, options?: {
        maxWidth?: number;
        maxHeight?: number;
        quality?: number;
    }): Promise<void>;
    static deleteFile(filePath: string): boolean;
    static getRelativePath(absolutePath: string): string;
    static getAbsolutePath(relativePath: string): string;
    static formatFileSize(bytes: bigint | number): string;
}
//# sourceMappingURL=file.util.d.ts.map