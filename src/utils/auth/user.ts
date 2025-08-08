import { createClient } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";

export interface UserData {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  isLoggedIn: boolean;
  user: UserData | null;
  session: Session | null;
}

/**
 * Check if user is logged in and return user data
 * @returns Promise<AuthResult> - Object containing login status and user data
 */
export async function checkUserAuth(): Promise<AuthResult> {
  try {
    const supabase = createClient();

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return { isLoggedIn: false, user: null, session: null };
    }

    if (!session) {
      return { isLoggedIn: false, user: null, session: null };
    }

    // Get user data from auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User error:", userError);
      return { isLoggedIn: false, user: null, session: null };
    }

    // Get additional user data from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      // Return basic user data even if profile fetch fails
      return {
        isLoggedIn: true,
        user: {
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
        },
        session,
      };
    }

    return {
      isLoggedIn: true,
      user: profile as UserData,
      session,
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return { isLoggedIn: false, user: null, session: null };
  }
}

/**
 * Get current user data (shorthand for checkUserAuth)
 * @returns Promise<UserData | null> - User data or null if not logged in
 */
export async function getCurrentUser(): Promise<UserData | null> {
  const { user } = await checkUserAuth();
  return user;
}

/**
 * Check if user is logged in (shorthand)
 * @returns Promise<boolean> - True if logged in, false otherwise
 */
export async function isLoggedIn(): Promise<boolean> {
  const { isLoggedIn } = await checkUserAuth();
  return isLoggedIn;
}
