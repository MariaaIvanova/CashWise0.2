"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createClient } from "@/utils/supabase/client";
import { validateEmail } from "@/utils/validation";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if this page was accessed with reset tokens
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  // If tokens are present, redirect to update-password
  useEffect(() => {
    if (accessToken && refreshToken && type === "recovery") {
      setIsRedirecting(true);
      const updatePasswordUrl = `/update-password?access_token=${accessToken}&refresh_token=${refreshToken}&type=${type}`;
      router.replace(updatePasswordUrl);
    }
  }, [accessToken, refreshToken, type, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setMessage({ type: "error", message: emailValidation.error! });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setMessage({ type: "error", message: error.message });
      } else {
        setMessage({
          type: "success",
          message:
            "Имейлът за смяна на паролата е изпратен! Проверете вашия имейл и папката за спам.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage({
        type: "error",
          message: "Възникна неочаквана грешка. Моля, опитайте отново.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
              Пренасочване към обновяване на паролата...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Смяна на паролата
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed">
            Въведете вашия имейл адрес и ние ще ви изпратим сигурен линк за
            смяна на паролата
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Имейл адрес"
              placeholder="Въведете вашия имейл адрес"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {message && message.type === "error" && (
              <div className="p-4 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {message.message}
                </div>
              </div>
            )}

            {message && message.type === "success" && (
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                    Имейлът за смяна на паролата е изпратен! Проверете вашия имейл и папката за спам.
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Не сте получили имейла? Проверете папката за спам или{" "}
                    <button
                      type="button"
                      onClick={() => setMessage(null)}
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      опитайте отново
                    </button>
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 py-4 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Изпрати имейл...
                </>
              ) : ( 
                "Изпрати имейл"
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Забравена парола?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Влез
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
