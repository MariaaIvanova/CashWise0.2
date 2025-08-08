import React, { useEffect } from "react";

export interface NotificationProps {
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Auto-close duration in milliseconds
}

export default function Notification({
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 5000,
}: NotificationProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          container:
            "bg-green-50/90 dark:bg-green-900/50 backdrop-blur-sm border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
          icon: "text-green-400",
          closeButton:
            "text-green-400 hover:text-green-600 dark:hover:text-green-300",
        };
      case "error":
        return {
          container:
            "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
          icon: "text-red-400",
          closeButton:
            "text-red-400 hover:text-red-600 dark:hover:text-red-300",
        };
      case "warning":
        return {
          container:
            "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
          icon: "text-yellow-400",
          closeButton:
            "text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300",
        };
      case "info":
      default:
        return {
          container:
            "bg-blue-50/90 dark:bg-blue-900/50 backdrop-blur-sm border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
          icon: "text-blue-400",
          closeButton:
            "text-blue-400 hover:text-blue-600 dark:hover:text-blue-300",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <div className={`rounded-lg border p-4 shadow-lg ${styles.container}`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="mt-1 text-sm">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.closeButton}`}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
