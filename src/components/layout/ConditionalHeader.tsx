"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isCoursePage = pathname.startsWith("/course/");

  // Show Header on all pages EXCEPT course detail pages
  if (!isCoursePage) {
    return <Header />;
  }

  return null;
}
