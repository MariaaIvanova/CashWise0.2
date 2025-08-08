import { createClient } from "./client";

export async function logSessionInfo() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (user) {
    console.log("🔐 Client-side: User is logged in:", user.email);
    console.log("📋 Client-side: Full session object:", session);
  } else {
    console.log("❌ Client-side: User is not logged in");
  }
}
