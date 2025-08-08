import { createClient } from "@/utils/supabase/client";

export interface AvatarUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY_PREFIX = "cashwise_avatar_url_";

// Get cached avatar URL from localStorage
function getCachedAvatarUrl(userId: string): string | null {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { url, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log(
          "Avatar URL served from localStorage cache for user:",
          userId,
        );
        return url;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  } catch (error) {
    console.error("Error reading from localStorage cache:", error);
    return null;
  }
}

// Set cached avatar URL in localStorage
function setCachedAvatarUrl(userId: string, url: string): void {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    const cacheData = { url, timestamp: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log("Avatar URL cached in localStorage for user:", userId);
  } catch (error) {
    console.error("Error writing to localStorage cache:", error);
  }
}

// Clear cached avatar URL from localStorage
function clearCachedAvatarUrl(userId: string): void {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    localStorage.removeItem(cacheKey);
    console.log("Avatar URL cache cleared from localStorage for user:", userId);
  } catch (error) {
    console.error("Error clearing localStorage cache:", error);
  }
}

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<AvatarUploadResult> {
  try {
    const supabase = createClient();

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Please select a valid image file.",
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "File size must be less than 5MB.",
      };
    }

    // Determine file extension - compressed files are typically JPEG
    const fileExt =
      file.type === "image/jpeg" || file.type === "image/jpg" ? "jpg" : "png";
    const filePath = `${userId}.${fileExt}`;

    // Upload with upsert to replace old image
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error("Upload failed:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const url = `${urlData.publicUrl}?t=${Date.now()}`;

    // Clear cache and set new URL
    clearCachedAvatarUrl(userId);
    setCachedAvatarUrl(userId, url);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Avatar upload error:", error);
    return {
      success: false,
      error: "Upload failed. Please try again.",
    };
  }
}

export async function getAvatarUrl(userId: string): Promise<string | null> {
  try {
    // Check localStorage cache first
    const cachedUrl = getCachedAvatarUrl(userId);
    if (cachedUrl) {
      return cachedUrl;
    }

    const supabase = createClient();

    // Try to get avatar URL for common extensions
    const extensions = ["jpg", "jpeg", "png"];

    for (const ext of extensions) {
      const filePath = `${userId}.${ext}`;

      // Check if the file exists by trying to get its metadata
      const { data: metadata } = await supabase.storage
        .from("avatars")
        .list("", {
          search: filePath,
        });

      if (metadata && metadata.length > 0) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        const url = `${data.publicUrl}?t=${Date.now()}`;

        // Cache the URL in localStorage
        setCachedAvatarUrl(userId, url);
        console.log(
          "Avatar URL fetched from Supabase and cached for user:",
          userId,
        );

        return url;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting avatar URL:", error);
    return null;
  }
}

export async function deleteAvatar(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Try to delete avatar for common extensions
    const extensions = ["jpg", "jpeg", "png"];
    let deletedAny = false;

    for (const ext of extensions) {
      const filePath = `${userId}.${ext}`;

      const { error } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (!error) {
        deletedAny = true;
      }
    }

    // Clear cache if avatar was deleted
    if (deletedAny) {
      clearCachedAvatarUrl(userId);
    }

    return deletedAny;
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return false;
  }
}

// Export cache management functions for external use
export { clearCachedAvatarUrl, getCachedAvatarUrl };
