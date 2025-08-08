import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export default function Skeleton({
  className = "",
  width = "w-full",
  height = "h-4",
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${width} ${height} ${className}`}
    />
  );
}
