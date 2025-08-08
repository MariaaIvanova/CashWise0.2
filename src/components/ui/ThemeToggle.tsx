"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  updatePreferences,
  getPreferences,
} from "@/utils/auth/preferences-update";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const hasLoadedTheme = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load user's saved theme preference when component mounts (only once)
  useEffect(() => {
    if (user?.id && mounted && !hasLoadedTheme.current) {
      const loadUserTheme = async () => {
        try {
          const result = await getPreferences(user.id);
          if (result.success && result.preferences?.theme) {
            const savedTheme = result.preferences.theme;

            // Only set theme if it's different from current and not auto
            if (savedTheme !== theme && savedTheme !== "auto") {
              setTheme(savedTheme);
            }
          }
          hasLoadedTheme.current = true;
        } catch (error) {
          console.error("Failed to load theme from database:", error);
          hasLoadedTheme.current = true;
        }
      };

      loadUserTheme();
    }
  }, [user?.id, mounted, theme, setTheme]); // Now we can safely include theme and setTheme

  const handleThemeToggle = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    // Update next-themes
    setTheme(newTheme);

    // Save to database if user is logged in
    if (user?.id) {
      try {
        // Get current preferences to preserve existing settings
        const currentPrefs = await getPreferences(user.id);
        const existingPrefs = currentPrefs.success
          ? currentPrefs.preferences
          : null;

        await updatePreferences(user.id, {
          theme: newTheme as "light" | "dark" | "auto",
          language: existingPrefs?.language || "en",
          notifications: existingPrefs?.notifications ?? true,
        });
      } catch (error) {
        console.error("Failed to save theme to database:", error);
      }
    }
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={handleThemeToggle}
      className="relative w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {/* Sun icon */}
      <svg
        className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-all duration-300 ${
          theme === "light"
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-75 -rotate-90"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>

      {/* Moon icon */}
      <svg
        className={`absolute h-4 w-4 text-gray-600 dark:text-gray-400 transition-all duration-300 ${
          theme === "dark"
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-75 rotate-90"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>

      {/* Hover effect ring */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-gray-300 dark:group-hover:ring-gray-600 transition-all duration-300" />
    </button>
  );
}
