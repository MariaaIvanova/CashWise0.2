import { createClient } from "./supabase/server";

export interface ServerAvatarUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadAvatarServer(
  file: File,
  userId: string,
): Promise<ServerAvatarUploadResult> {
  try {
    const supabase = await createClient();

    // Validate file type
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !["jpg", "jpeg", "png"].includes(fileExt)) {
      return {
        success: false,
        error: "Only JPG and PNG files are allowed",
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "File size must be less than 5MB",
      };
    }

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

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Avatar upload error:", error);
    return {
      success: false,
      error: "Upload failed. Please try again.",
    };
  }
}

export async function getAvatarUrlServer(
  userId: string,
): Promise<string | null> {
  try {
    const supabase = await createClient();

    // Try to get avatar URL for common extensions
    const extensions = ["jpg", "jpeg", "png"];

    for (const ext of extensions) {
      const filePath = `${userId}.${ext}`;
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Check if the file exists by trying to get its metadata
      const { data: metadata } = await supabase.storage
        .from("avatars")
        .list("", {
          search: filePath,
        });

      if (metadata && metadata.length > 0) {
        return data.publicUrl;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting avatar URL:", error);
    return null;
  }
}

export async function deleteAvatarServer(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Try to delete avatar for common extensions
    const extensions = ["jpg", "jpeg", "png"];

    for (const ext of extensions) {
      const filePath = `${userId}.${ext}`;
      const { error } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (!error) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return false;
  }
}
