"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { validateResetPasswordData } from "@/utils/validation";

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, loading } = useAuth();

  // Get tokens from URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  // Handle authentication from reset tokens
  useEffect(() => {
    if (accessToken && refreshToken && type === "recovery" && !isLoggedIn) {
      setIsAuthenticating(true);
      const authenticateWithTokens = async () => {
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Authentication error:", error);
            setMessage({
              type: "error",
              message:
                "Невалиден или изтекъл линк за смяна на паролата. Моля, поискайте нов линк.",
            });
            // Redirect back to reset-password after 3 seconds
            setTimeout(() => {
              router.push("/reset-password");
            }, 3000);
          }
        } catch (error) {
          console.error("Authentication error:", error);
          setMessage({
            type: "error",
            message: "Автентикацията не бе успешна. Моля, опитайте отново.",
          });
        } finally {
          setIsAuthenticating(false);
        }
      };

      authenticateWithTokens();
    }
  }, [accessToken, refreshToken, type, isLoggedIn, router]);

  // Redirect if not logged in and not authenticating
  useEffect(() => {
    if (!loading && !isLoggedIn && !isAuthenticating && !accessToken) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router, isAuthenticating, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateResetPasswordData({ password, confirmPassword });
    if (!validation.isValid) {
      setMessage({ type: "error", message: validation.error! });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage({ type: "error", message: error.message });
      } else {
        setMessage({
          type: "success",
          message: "Паролата е обновена успешно! Пренасочване към профила...",
        });

        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Update password error:", error);
      setMessage({
        type: "error",
        message: "Възникна неочаквана грешка. Моля, опитайте отново.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth status or authenticating
  if (loading || isAuthenticating) {
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            {isAuthenticating ? "Автентикация..." : "Зареждане..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not logged in and no tokens
  if (!isLoggedIn && !accessToken) {
    return null;
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Смяна на паролата
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed">
            Въведете новата си парола за да подсигурите вашия акаунт
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="password"
              label="Нова парола"
              placeholder="Въведете новата си парола"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              label="Потвърдете паролата"
              placeholder="Потвърдете новата си парола"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Паролата е обновена успешно! Пренасочване към профила...
                  </span>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                  >
                    Натиснете тук ако не се пренасочи автоматично
                  </button>
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
                  Обновяване на паролата...
                </>
              ) : (
                "Обновяване на паролата"
              )}
            </Button>
          </form>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Назад към профила
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
