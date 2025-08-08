"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { signupUser } from "@/utils/auth-client";
import { logSessionInfo } from "@/utils/supabase/client-logger";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    logSessionInfo();
  }, []);

  // Redirect logged-in users to intended destination
  useEffect(() => {
    if (!loading && isLoggedIn) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || "/";
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }
  }, [isLoggedIn, loading, router]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Зареждане...
          </p>
        </div>
      </div>
    );
  }

  // Don't render register form if user is already logged in
  if (isLoggedIn) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrors({});

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const result = await signupUser(email, password, fullName);

    if (!result.success) {
      setErrors({ general: result.error || "Registration failed" });
      setIsLoading(false);
      return;
    }

    // Successful registration - redirect
    router.push(result.redirectTo || "/check-email");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Присъединете се към нашата общност
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed">
            Започнете обучението си с CashWise
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.general}
              </p>
            </div>
          )}
          <form className="space-y-6">
            <Input
              type="text"
              name="fullName"
              label="Име"
              placeholder="Въведете вашето име"
              onChange={handleChange}
              error={errors.fullName}
            />

            <Input
              type="email"
              name="email"
              label="Имейл адрес"
              placeholder="Въведете вашия имейл адрес"
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              type="password"
              name="password"
              label="Парола"
              placeholder="Създайте си силна парола"
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Потвърдете паролата"
              placeholder="Потвърдете вашата парола"
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded mt-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Съгласен съм с{" "}
                <Link
                  href="/terms-of-service"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Условия на ползване
                </Link>{" "}
                и{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Политика за поверителност
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 py-4 text-lg font-semibold"
              formAction={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Създаване на акаунт..." : "Създаване на акаунт"}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Вече имате акаунт?{" "}
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
