import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

/**
 * Compresses an image file to reduce its size while maintaining quality
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<File> - The compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {},
): Promise<File> {
  try {
    // Default compression options optimized for avatars
    const defaultOptions = {
      maxSizeMB: 1, // Maximum 1MB file size
      maxWidthOrHeight: 512, // Maximum 512px width/height
      useWebWorker: true, // Use web worker for better performance
      fileType: "image/jpeg", // Convert to JPEG for better compression
      ...options,
    };

    console.log("🔄 [Image Compression] Starting compression...", {
      originalSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      originalType: file.type,
    });

    // Compress the image
    const compressedFile = await imageCompression(file, defaultOptions);

    console.log("✅ [Image Compression] Compression completed", {
      originalSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      compressedSize: `${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
      compressionRatio: `${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`,
    });

    return compressedFile;
  } catch (error) {
    console.error("❌ [Image Compression] Compression failed:", error);
    throw new Error("Failed to compress image. Please try again.");
  }
}

/**
 * Validates if a file is a valid image that can be processed
 * @param file - The file to validate
 * @returns boolean - True if the file is a valid image
 */
export function isValidImageFile(file: File): boolean {
  // Check file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return false;
  }

  // Check file size (max 10MB before compression)
  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return false;
  }

  return true;
}

/**
 * Gets the file extension from a file name or MIME type
 * @param file - The file to get extension for
 * @returns string - The file extension (e.g., 'jpg', 'png')
 */
export function getFileExtension(file: File): string {
  // Try to get extension from filename first
  const fileName = file.name;
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension && ["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return extension === "jpeg" ? "jpg" : extension;
  }

  // Fallback to MIME type
  switch (file.type) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg"; // Default to jpg
  }
}
