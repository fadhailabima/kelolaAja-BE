import sharp from "sharp";
import path from "path";
import fs from "fs";

export class FileUtil {
  /**
   * Get file type from mime type
   */
  static getFileType(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("word") ||
      mimeType.includes("excel") ||
      mimeType.includes("powerpoint") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("presentation")
    ) {
      return "document";
    }
    return "other";
  }

  /**
   * Get image dimensions
   */
  static async getImageDimensions(
    filePath: string
  ): Promise<{ width: number; height: number } | null> {
    try {
      const metadata = await sharp(filePath).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Optimize image (compress and resize if needed)
   */
  static async optimizeImage(
    filePath: string,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<void> {
    const { maxWidth = 2000, maxHeight = 2000, quality = 85 } = options || {};

    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      // Check if resize is needed
      let resizeOptions: sharp.ResizeOptions | undefined;
      if (metadata.width && metadata.width > maxWidth) {
        resizeOptions = { width: maxWidth, withoutEnlargement: true };
      } else if (metadata.height && metadata.height > maxHeight) {
        resizeOptions = { height: maxHeight, withoutEnlargement: true };
      }

      // Process based on format
      let processedImage = image;
      if (resizeOptions) {
        processedImage = processedImage.resize(resizeOptions);
      }

      // Apply format-specific optimization
      if (metadata.format === "jpeg" || metadata.format === "jpg") {
        processedImage = processedImage.jpeg({ quality });
      } else if (metadata.format === "png") {
        processedImage = processedImage.png({ quality });
      } else if (metadata.format === "webp") {
        processedImage = processedImage.webp({ quality });
      }

      // Save optimized image (overwrite original)
      await processedImage.toFile(filePath + ".tmp");
      fs.renameSync(filePath + ".tmp", filePath);
    } catch (error) {
      // If optimization fails, keep original file
      console.error("Image optimization failed:", error);
    }
  }

  /**
   * Delete file from filesystem
   */
  static deleteFile(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  /**
   * Get relative path from absolute path
   */
  static getRelativePath(absolutePath: string): string {
    const uploadDir = path.join(process.cwd(), "uploads");
    return absolutePath.replace(uploadDir, "").replace(/\\/g, "/");
  }

  /**
   * Get absolute path from relative path
   */
  static getAbsolutePath(relativePath: string): string {
    const uploadDir = path.join(process.cwd(), "uploads");
    return path.join(uploadDir, relativePath);
  }

  /**
   * Format file size to human readable
   */
  static formatFileSize(bytes: bigint | number): string {
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

  /**
   * Convert file path to full URL
   * Handles both local file paths and already complete URLs
   */
  static getFileUrl(filePath: string | null): string | null {
    if (!filePath) return null;

    // If it's already a full URL, return as is
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    // Get the base URL from environment or use default
    // Priorities: BASE_URL (explicit) > API_URL (fallback) > localhost
    let baseUrl =
      process.env.BASE_URL || process.env.API_URL || "http://localhost:8080";

    // Ensure baseUrl has protocol
    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }

    // Remove trailing slash from baseUrl if present
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    // Normalize path to ensure it starts with /uploads/
    let relativePath = filePath;

    // If it is an absolute path (starts with /), try to make it relative
    if (path.isAbsolute(filePath) || filePath.includes("uploads")) {
      // Check if it matches our upload directory structure
      const uploadDir = "uploads";
      const index = filePath.indexOf(uploadDir);

      if (index !== -1) {
        // Extract everything after uploads/ (including uploads/)
        relativePath = filePath.substring(index); // "uploads/2026/..."
      } else {
        // Fallback: assume it's just the filename or relative path
        relativePath = `uploads/${path.basename(filePath)}`;
      }
    } else if (!filePath.startsWith("uploads/")) {
      relativePath = `uploads/${filePath}`;
    }

    // Ensure it starts with /
    if (!relativePath.startsWith("/")) {
      relativePath = `/${relativePath}`;
    }

    // Combine base URL with file path
    return `${baseUrl}${relativePath}`;
  }
}
