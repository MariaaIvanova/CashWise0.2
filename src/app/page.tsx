"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";
import Notification from "../components/ui/Notification";
import { logSessionInfo } from "@/utils/supabase/client-logger";
import { fetchCourses, Course } from "../utils/courses";
import { getAllCoursesProgress } from "@/utils/progress-client";
import { useAuth } from "@/hooks/useAuth";

// Define the CourseProgress type locally
interface CourseProgress {
  courseId: string;
  progress: number;
  completedStages: number;
  totalStages: number;
  completedQuizzes: number;
  totalQuizzes: number;
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    isVisible: boolean;
  }>({
    type: "info",
    title: "",
    message: "",
    isVisible: false,
  });

  useEffect(() => {
    // Log session info once on page load
    logSessionInfo();
  }, []);

  useEffect(() => {
    const loadCoursesAndProgress = async () => {
      try {
        setLoading(true);

        // Fetch both courses and progress data in parallel
        const [fetchedCourses, progressData] = await Promise.all([
          fetchCourses(),
          user?.id ? getAllCoursesProgress() : Promise.resolve([]),
        ]);

        // Limit to first 3 courses for home page
        setCourses(fetchedCourses.slice(0, 3));

        // Set progress data if we fetched it
        if (progressData) {
          setCourseProgress(progressData);
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCoursesAndProgress();
  }, [user]);

  useEffect(() => {
    // Check if user came from email confirmation
    const urlParams = new URLSearchParams(window.location.search);
    const emailConfirmed = urlParams.get("emailConfirmed");
    const message = urlParams.get("message");

    if (emailConfirmed === "true") {
      setNotification({
        type: "success",
        title: "Email Confirmed",
        message: "Your email address has been successfully confirmed!",
        isVisible: true,
      });

      // Clean up the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("emailConfirmed");
      window.history.replaceState({}, "", newUrl.toString());
    } else if (message) {
      // Handle the old email confirmation message
      setNotification({
        type: "info",
        title: "Email Confirmation",
        message: decodeURIComponent(message),
        isVisible: true,
      });

      // Clean up the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("message");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, []);

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Helper function to get progress for a specific course
  const getCourseProgress = (courseId: string): CourseProgress | undefined => {
    return courseProgress.find((p) => p.courseId === courseId);
  };

  // Helper function to get button text based on progress
  const getButtonText = (courseId: string): string => {
    const progress = getCourseProgress(courseId);
    if (!progress) return "Start Course";

    const isCompleted = progress.progress >= 100;
    const hasStarted = progress.progress > 0;

    if (isCompleted) return "Completed";
    if (hasStarted) return "Continue Learning";
    return "Start Course";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-700"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Добре дошли в
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                CashWise
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-4xl mx-auto leading-relaxed">
              CashWise е платформа за финансово образование, която ви помага да
              се научите да управлявате финансите си.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-teal-600! hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl"
                onClick={() => router.push("/courses")}
              >
                Разгледайте курсовете
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                50+ Урока
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Уроци за всички възрасти и нива на образование
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                500+ Потребители
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Активни потребители подобряващи финансовата си грамотност
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                95% Успех
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Среден процент успех на многобройните тестове в курсовете
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Courses Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {user ? "Продължете вашето приключение" : "Започнете вашето приключение"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {user
                ? "Продължете вашето приключение докато се развивате"
                : "Открийте нашите курсове и започнете вашето образователно приключение"}
            </p>
          </div>

          {loading ? (
            /* Loading skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  {/* Course Icon Skeleton */}
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 animate-pulse"></div>

                  {/* Course Title Skeleton */}
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>

                  {/* Course Description Skeleton */}
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  </div>

                  {/* Course Stats Skeleton */}
                  <div className="space-y-3 mb-6">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between"
                      >
                        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button Skeleton */}
                  <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => {
                const progress = getCourseProgress(course.id);
                const progressPercentage = progress?.progress || 0;
                const isCompleted = progressPercentage >= 100;

                return (
                  <div
                    key={course.id}
                    className={`group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                      isCompleted
                        ? "border-green-200 dark:border-green-600 bg-green-50/30 dark:bg-green-900/20"
                        : "border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600"
                    }`}
                    onClick={() => router.push(`/course/${course.slug}`)}
                  >
                    {/* Completion Badge */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        ✓ Completed
                      </div>
                    )}

                    {/* Course Icon */}
                    <div className="mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                          isCompleted ? "bg-green-100 dark:bg-green-900/50" : ""
                        }`}
                        style={{
                          backgroundColor: isCompleted
                            ? undefined
                            : course.color + "20",
                        }}
                      >
                        {course.icon}
                      </div>
                    </div>

                    {/* Course Title */}
                    <h3
                      className={`text-xl font-bold mb-3 transition-colors ${
                        isCompleted
                          ? "text-green-700 dark:text-green-300"
                          : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    >
                      {course.name}
                    </h3>

                    {/* Course Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress Display */}
                    {progressPercentage > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isCompleted
                                ? "bg-green-500"
                                : "bg-gradient-to-r from-blue-500 to-teal-600"
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Course Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Stages
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {progress?.completedStages || 0}/{course.totalStages}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Difficulty
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {course.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Duration
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant={isCompleted ? "ghost" : "primary"}
                      className={`w-full transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70"
                          : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                      }`}
                      disabled={isCompleted}
                    >
                      {getButtonText(course.id)}
                    </Button>

                    {/* Hover Effect */}
                    <div
                      className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-500/5 to-green-500/5"
                          : "bg-gradient-to-r from-blue-500/5 to-teal-500/5"
                      }`}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Courses Button */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => router.push("/courses")}
            >
              Разгледайте всички курсове
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
