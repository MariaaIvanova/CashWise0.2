import { createClient } from "@/utils/supabase/client";

export async function getUserProfile(userId: string) {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return { profile, error };
}
