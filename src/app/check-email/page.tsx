"use client";

import React from "react";
import Link from "next/link";
import Button from "../../components/ui/Button";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Проверете имейла си
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed">
              Изпратихме ви потвърдителен имейл за активиране на акаунта
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 mb-6">
            <div className="text-center space-y-6">
              {/* Email Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-teal-600 dark:text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Main Message */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Имейл изпратен успешно!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Моля, проверете вашата пощенска кутия и натиснете линка за потвърждение, за да активирате акаунта си.
              </p>
            </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200/50 dark:border-teal-700/50 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-teal-800 dark:text-teal-200 mb-1">
                      Не получихте имейл?
                    </p>
                    <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed">
                      Проверете папката за спам или се опитайте да се регистрирате отново.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                onClick={() => (window.location.href = "/login")}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                  Назад към вход
              </Button>
              <Button
                  variant="ghost"
                onClick={() => (window.location.href = "/")}
                  className="w-full text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 py-3"
              >
                  Към начална страница
              </Button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Нужна е помощ?{" "}
              <Link
                href="/register"
                className="text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 font-medium underline"
              >
                Опитайте отново регистрация
              </Link>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Може да отнеме няколко минути докато получите имейла
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
