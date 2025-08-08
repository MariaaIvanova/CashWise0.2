import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  console.log("🔍 Email confirmation attempt:", {
    token_hash: !!token_hash,
    type,
    next,
  });

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log("📧 Email confirmation result:", {
      success: !error,
      error: error?.message,
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
    });

    if (!error) {
      console.log("✅ Email confirmed successfully, redirecting to:", next);
      // redirect user to specified redirect URL or root of app with success parameter
      const redirectUrl = new URL(next, request.url);
      redirectUrl.searchParams.set("emailConfirmed", "true");
      redirect(redirectUrl.toString());
    }
  }

  console.log("❌ Email confirmation failed, redirecting to error page");
  // redirect the user to an error page with some instructions
  redirect("/error");
}
