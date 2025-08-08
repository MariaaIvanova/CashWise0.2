"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";
import AvatarUpload from "../../components/ui/AvatarUpload";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/utils/auth/profile";
import { getUserStatsClient } from "@/utils/progress-client";

import { generateAvatar } from "@/utils/avatar";
import {
  uploadAvatar,
  getAvatarUrl,
  deleteAvatar,
} from "@/utils/avatar-upload";
import {
  updateProfile,
  validateProfileData,
} from "@/utils/auth/profile-update";
import Notification from "@/components/ui/Notification";

// User profile type
interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface UserStats {
  total_courses: number;
  completed_courses: number;
  total_stages: number;
  completed_stages: number;
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAvatarCropperOpen, setIsAvatarCropperOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
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

  const [minLoadingTime, setMinLoadingTime] = useState(true);

  // Load profile and stats
  useEffect(() => {
    if (user?.id) {
      const loadProfileData = async () => {
        const startTime = Date.now();
        const MIN_LOADING_DURATION = 800; // Minimum 800ms loading time

        try {
          setIsLoading(true);
          setMinLoadingTime(true);

          // Fetch all data in parallel
          const [profileData, statsData, avatarData] = await Promise.all([
            getUserProfile(user.id),
            getUserStatsClient(),
            getAvatarUrl(user.id),
          ]);

          // Set all data together
          setProfile(profileData.profile);
          if (statsData) {
            setStats(statsData);
          }
          setAvatarUrl(avatarData);

          // Ensure minimum loading time to prevent flicker
          const elapsedTime = Date.now() - startTime;
          if (elapsedTime < MIN_LOADING_DURATION) {
            await new Promise((resolve) =>
              setTimeout(resolve, MIN_LOADING_DURATION - elapsedTime),
            );
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
        } finally {
          setIsLoading(false);
          // Small delay before hiding min loading time to ensure smooth transition
          setTimeout(() => setMinLoadingTime(false), 100);
        }
      };

      loadProfileData();
    } else {
      setIsLoading(false);
      setMinLoadingTime(false);
    }
  }, [user]);

  // Update formData and preferencesData when profile loads
  useEffect(() => {
    if (profile != null) {
      setFormData({
        fullName: profile.full_name ?? "",
        email: profile.email ?? ""
      });
    }
  }, [profile]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!user?.id) return;

    if (file) {
      setIsUploadingAvatar(true);
      try {
        const result = await uploadAvatar(file, user.id);
        if (result.success && result.url) {
          setAvatarUrl(result.url);
          setProfile((prev) =>
            prev ? { ...prev, avatar_url: result.url } : null,
          );
          setNotification({
            type: "success",
            title: "Аватар обновен",
            message: "Аватарът е обновен успешно",
            isVisible: true,
          });
          setTimeout(() => {
            refreshAvatarUrl();
          }, 1000);
        } else {
          setNotification({
            type: "error",
            title: "Грешка при Прикачване",
            message: result.error || "Грешка при Прикачване на аватара",
            isVisible: true,
          });
        }
      } catch (error) {
        console.error("Avatar upload error:", error);
        setNotification({
          type: "error",
          title: "Грешка при Прикачване",
          message: "Грешка при Прикачване на аватара. Моля, опитайте отново.",
          isVisible: true,
        });
      } finally {
        setIsUploadingAvatar(false);
      }
    } else {
      setIsUploadingAvatar(true);
      try {
        const success = await deleteAvatar(user.id);
        if (success) {
          setAvatarUrl(null);
          setProfile((prev) => (prev ? { ...prev, avatar_url: null } : null));
          setNotification({
            type: "success",
            title: "Аватар премахнат",
            message: "Аватарът е премахнат успешно",
            isVisible: true,
          });
          setTimeout(() => {
            refreshAvatarUrl();
          }, 1000);
        } else {
          setNotification({
            type: "error",
            title: "Грешка при премахване",
            message: "Грешка при премахване на аватара. Моля, опитайте отново.",
            isVisible: true,
          });
        }
      } catch (error) {
        console.error("Avatar removal error:", error);
        setNotification({
          type: "error",
          title: "Грешка при премахване",
          message: "Грешка при премахване на аватара. Моля, опитайте отново.",
          isVisible: true,
        });
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const refreshAvatarUrl = useCallback(async () => {
    if (user?.id) {
      const newUrl = await getAvatarUrl(user.id);
      setAvatarUrl(newUrl);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      refreshAvatarUrl();
    }
  }, [user?.id, refreshAvatarUrl]);

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSave = async () => {
    const validation = validateProfileData({
      fullName: formData.fullName,
      email: formData.email,
    });

    if (!validation.isValid) {
      setNotification({
        type: "error",
        title: "Грешка при валидация",
        message: validation.error || "Моля, проверете вашите входни данни",
        isVisible: true,
      });
      return;
    }

    setIsSavingProfile(true);

    // Fire and forget - don't wait for response
    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
    })
      .then((result) => {
        if (result.success) {
          setNotification({
            type: "success",
            title: "Профил обновен",
            message:
              result.message || "Профилът е обновен успешно",
            isVisible: true,
          });
        } else {
          setNotification({
            type: "error",
            title: "Грешка при обновяване",
            message: result.error || "Грешка при обновяване на профила",
            isVisible: true,
          });
        }
      })
      .catch(() => {
        setNotification({
          type: "error",
          title: "Грешка при запазване",
          message: "Възникна неочаквана грешка при запазване на профила",
          isVisible: true,
        });
      });

    // Update UI immediately
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            full_name: formData.fullName,
            email: formData.email,
          }
        : null,
    );

    // Reset editing state immediately
    setIsEditing(false);

    // Show success notification immediately
    const emailChanged = formData.email !== profile?.email;
    setNotification({
      type: emailChanged ? "info" : "success",
      title: emailChanged ? "Имейл обновен" : "Профил обновен",
      message: emailChanged
        ? "Моля, проверете двата си имейла за потвърждение."
        : "Профилът е обновен успешно",
      isVisible: true,
    });

    // Reset saving state immediately
    setIsSavingProfile(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.full_name ?? "",
      email: profile?.email ?? ""
    });
    setIsEditing(false);
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

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Header */}
        <div className="text-center mb-16">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Вашият профил
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Управлявайте своя акаунт и проследявайте прогреса си
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  Лични данни
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Редактиране
                  </Button>
                )}
              </div>

              {!isEditing ? (
                <div className="flex items-center space-x-6">
                  {isLoading || minLoadingTime || profile == null ? (
                    <Skeleton className="w-24 h-24 rounded-full" />
                  ) : (
                    <>
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={`${profile?.full_name || "User"} avatar`}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full shadow-lg"
                        />
                      ) : (
                        <div
                          className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                          style={{
                            backgroundColor: generateAvatar(profile?.full_name)
                              .bgColor,
                          }}
                        >
                          {generateAvatar(profile?.full_name).letter}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {profile?.full_name || "User"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                          {profile?.email}
                        </p>
                        <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Член от{" "}
                          {profile?.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : "Нещо не е наред"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <AvatarUpload
                    currentAvatarUrl={avatarUrl}
                    userName={profile?.full_name}
                    onAvatarChange={handleAvatarChange}
                    size="lg"
                    disabled={isUploadingAvatar}
                    onCropperOpenChange={setIsAvatarCropperOpen}
                  />

                  {isUploadingAvatar && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Прикачване на аватар...
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Име"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Имейл"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      disabled={isSavingProfile}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                    >
                      {isSavingProfile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Запазване...
                        </>
                      ) : (
                        "Запазване"
                      )}
                    </Button>
                    {!isAvatarCropperOpen && (
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSavingProfile}
                      >
                        Отказ
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>


          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Статистика
              </h2>

              <div className="space-y-6">
                {isLoading || minLoadingTime || profile == null ? (
                  <>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                      <Skeleton className="w-20 h-8 mx-auto mb-3" />
                      <Skeleton className="w-32 h-5 mx-auto" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <Skeleton className="w-16 h-6 mx-auto mb-2" />
                        <Skeleton className="w-20 h-4 mx-auto" />
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <Skeleton className="w-16 h-6 mx-auto mb-2" />
                        <Skeleton className="w-20 h-4 mx-auto" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {stats?.average_score || 0}%
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        Средна оценка
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                          {stats?.completed_courses || 0}
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                          Завършени
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <div className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {stats?.total_courses || 0}
                        </div>
                        <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                          Общо курсове
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Раздели
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {stats?.completed_stages || 0}/
                          {stats?.total_stages || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Тестове
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {stats?.completed_quizzes || 0}/
                          {stats?.total_quizzes || 0}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>



            {/* Account Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Акаунт
              </h2>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => router.push("/update-password")}
                >
                  <svg
                    className="w-5 h-5 mr-3"
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
                  Смяна на парола
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  onClick={() => alert("Demo: Delete account")}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Изтриване на акаунт
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
