"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtil = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileUtil {
    static getFileType(mimeType) {
        if (mimeType.startsWith("image/"))
            return "image";
        if (mimeType.startsWith("video/"))
            return "video";
        if (mimeType.startsWith("audio/"))
            return "audio";
        if (mimeType.includes("pdf") ||
            mimeType.includes("document") ||
            mimeType.includes("word") ||
            mimeType.includes("excel") ||
            mimeType.includes("powerpoint") ||
            mimeType.includes("spreadsheet") ||
            mimeType.includes("presentation")) {
            return "document";
        }
        return "other";
    }
    static async getImageDimensions(filePath) {
        try {
            const metadata = await (0, sharp_1.default)(filePath).metadata();
            return {
                width: metadata.width || 0,
                height: metadata.height || 0
            };
        }
        catch (error) {
            return null;
        }
    }
    static async optimizeImage(filePath, options) {
        const { maxWidth = 2000, maxHeight = 2000, quality = 85 } = options || {};
        try {
            const image = (0, sharp_1.default)(filePath);
            const metadata = await image.metadata();
            let resizeOptions;
            if (metadata.width && metadata.width > maxWidth) {
                resizeOptions = { width: maxWidth, withoutEnlargement: true };
            }
            else if (metadata.height && metadata.height > maxHeight) {
                resizeOptions = { height: maxHeight, withoutEnlargement: true };
            }
            let processedImage = image;
            if (resizeOptions) {
                processedImage = processedImage.resize(resizeOptions);
            }
            if (metadata.format === "jpeg" || metadata.format === "jpg") {
                processedImage = processedImage.jpeg({ quality });
            }
            else if (metadata.format === "png") {
                processedImage = processedImage.png({ quality });
            }
            else if (metadata.format === "webp") {
                processedImage = processedImage.webp({ quality });
            }
            await processedImage.toFile(filePath + ".tmp");
            fs_1.default.renameSync(filePath + ".tmp", filePath);
        }
        catch (error) {
            console.error("Image optimization failed:", error);
        }
    }
    static deleteFile(filePath) {
        try {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Error deleting file:", error);
            return false;
        }
    }
    static getRelativePath(absolutePath) {
        const uploadDir = path_1.default.join(process.cwd(), "uploads");
        return absolutePath.replace(uploadDir, "").replace(/\\/g, "/");
    }
    static getAbsolutePath(relativePath) {
        const uploadDir = path_1.default.join(process.cwd(), "uploads");
        return path_1.default.join(uploadDir, relativePath);
    }
    static formatFileSize(bytes) {
        const size = typeof bytes === "bigint" ? Number(bytes) : bytes;
        const units = ["B", "KB", "MB", "GB", "TB"];
        let unitIndex = 0;
        let fileSize = size;
        while (fileSize >= 1024 && unitIndex < units.length - 1) {
            fileSize /= 1024;
            unitIndex++;
        }
        return `${fileSize.toFixed(2)} ${units[unitIndex]}`;
    }
}
exports.FileUtil = FileUtil;
//# sourceMappingURL=file.util.js.map