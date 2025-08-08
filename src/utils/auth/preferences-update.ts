import { createClient } from "@/utils/supabase/client";

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: "en" | "es" | "fr" | "de";
  notifications: boolean;
}

export interface UserPreferencesWithoutTheme {
  language: "en" | "es" | "fr" | "de";
  notifications: boolean;
}

export interface PreferencesUpdateResult {
  success: boolean;
  error?: string;
  message?: string;
}

export function validatePreferences(preferences: UserPreferences): {
  isValid: boolean;
  error?: string;
} {
  const { theme, language, notifications } = preferences;

  // Validate theme
  const validThemes = ["light", "dark", "auto"];
  if (!validThemes.includes(theme)) {
    return {
      isValid: false,
      error: "Invalid theme selection",
    };
  }

  // Validate language
  const validLanguages = ["en", "es", "fr", "de"];
  if (!validLanguages.includes(language)) {
    return {
      isValid: false,
      error: "Invalid language selection",
    };
  }

  // Validate notifications (boolean)
  if (typeof notifications !== "boolean") {
    return {
      isValid: false,
      error: "Invalid notifications setting",
    };
  }

  return { isValid: true };
}

export function validatePreferencesWithoutTheme(
  preferences: UserPreferencesWithoutTheme,
): {
  isValid: boolean;
  error?: string;
} {
  const { language, notifications } = preferences;

  // Validate language
  const validLanguages = ["en", "es", "fr", "de"];
  if (!validLanguages.includes(language)) {
    return {
      isValid: false,
      error: "Invalid language selection",
    };
  }

  // Validate notifications (boolean)
  if (typeof notifications !== "boolean") {
    return {
      isValid: false,
      error: "Invalid notifications setting",
    };
  }

  return { isValid: true };
}

export async function updatePreferences(
  userId: string,
  preferences: UserPreferences,
): Promise<PreferencesUpdateResult> {
  try {
    const supabase = createClient();

    // Validate preferences
    const validation = validatePreferences(preferences);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "Invalid preferences data",
      };
    }

    // Update preferences in the database
    const { error } = await supabase
      .from("users")
      .update({
        preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating preferences:", error);
      return {
        success: false,
        error: error.message || "Failed to update preferences",
      };
    }

    return {
      success: true,
      message: "Preferences updated successfully",
    };
  } catch (error) {
    console.error("Unexpected error during preferences update:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating preferences",
    };
  }
}

export async function updatePreferencesWithoutTheme(
  userId: string,
  preferences: UserPreferencesWithoutTheme,
): Promise<PreferencesUpdateResult> {
  try {
    const supabase = createClient();

    // Validate preferences
    const validation = validatePreferencesWithoutTheme(preferences);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "Invalid preferences data",
      };
    }

    // Get current preferences to preserve theme
    const { data: currentData } = await supabase
      .from("users")
      .select("preferences")
      .eq("id", userId)
      .single();

    const currentPreferences = currentData?.preferences || {};
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
    };

    // Update preferences in the database
    const { error } = await supabase
      .from("users")
      .update({
        preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating preferences:", error);
      return {
        success: false,
        error: error.message || "Failed to update preferences",
      };
    }

    return {
      success: true,
      message: "Preferences updated successfully",
    };
  } catch (error) {
    console.error("Unexpected error during preferences update:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating preferences",
    };
  }
}

export async function getPreferences(userId: string): Promise<{
  success: boolean;
  preferences?: UserPreferences;
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .select("preferences")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching preferences:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch preferences",
      };
    }

    // Return default preferences if none exist
    const preferences: UserPreferences = data?.preferences || {
      theme: "dark",
      language: "en",
      notifications: true,
    };

    return {
      success: true,
      preferences,
    };
  } catch (error) {
    console.error("Unexpected error fetching preferences:", error);
    return {
      success: false,
      error: "An unexpected error occurred while fetching preferences",
    };
  }
}
