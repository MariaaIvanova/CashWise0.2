import { createClient } from "../supabase/client";

export interface ProfileUpdateData {
  fullName: string;
  email: string;
}

export interface ProfileUpdateResult {
  success: boolean;
  emailChanged?: boolean;
  error?: string;
  message?: string;
}

/**
 * Updates user profile with proper email change handling
 * @param updateData - The profile data to update
 * @returns Promise<ProfileUpdateResult> - Result of the update operation
 */
export async function updateProfile(
  updateData: ProfileUpdateData,
): Promise<ProfileUpdateResult> {
  try {
    const supabase = createClient();

    // Get current user to check for email changes
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting current user:", userError);
      return {
        success: false,
        error: "Failed to get current user information",
      };
    }

    if (!user) {
      return {
        success: false,
        error: "No authenticated user found",
      };
    }

    const { fullName, email } = updateData;
    const emailChanged = email !== user.email;

    // Prepare update object for Supabase auth
    const updateObject: {
      data: { full_name: string };
      email?: string;
    } = {
      data: {
        full_name: fullName, // Store in user_metadata
      },
    };

    // Only include email if it has changed
    if (emailChanged) {
      updateObject.email = email;
    }

    // Update user via Supabase auth
    const { error } = await supabase.auth.updateUser(updateObject);

    if (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        error: error.message || "Failed to update profile",
      };
    }

    // If email was changed, trigger confirmation flow
    if (emailChanged) {
      return {
        success: true,
        emailChanged: true,
        message:
          "Confirmation emails have been sent to both your old and new email addresses. Please confirm the new email FIRST, then confirm the old email to complete the change.",
      };
    }

    // If only name was changed, update was successful
    return {
      success: true,
      emailChanged: false,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Unexpected error during profile update:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating your profile",
    };
  }
}

/**
 * Gets the current user's profile data
 * @returns Promise<ProfileUpdateData | null> - Current profile data or null if error
 */
export async function getCurrentProfile(): Promise<ProfileUpdateData | null> {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting current user:", userError);
      return null;
    }

    return {
      fullName: user.user_metadata?.full_name || "",
      email: user.email || "",
    };
  } catch (error) {
    console.error("Error getting current profile:", error);
    return null;
  }
}

/**
 * Validates profile update data
 * @param data - The profile data to validate
 * @returns { isValid: boolean, error?: string } - Validation result
 */
export function validateProfileData(data: ProfileUpdateData): {
  isValid: boolean;
  error?: string;
} {
  const { fullName, email } = data;

  // Validate full name
  if (!fullName || fullName.trim().length === 0) {
    return {
      isValid: false,
      error: "Full name is required",
    };
  }

  if (fullName.trim().length < 2) {
    return {
      isValid: false,
      error: "Full name must be at least 2 characters long",
    };
  }

  // Validate email
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  return { isValid: true };
}
