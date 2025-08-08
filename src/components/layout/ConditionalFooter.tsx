"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isStagePage = pathname.includes("/stage/");

  // Hide Footer on stage/lesson pages
  if (isStagePage) {
    return null;
  }

  return <Footer />;
}
