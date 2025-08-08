"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/update-password',
    '/check-email',
    '/error',
    '/privacy-policy',
    '/terms-of-service'
  ];

  // Check if current path is public or an auth callback
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth');

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Don't do anything until mounted (hydration complete)
    if (!isMounted) return;
    // Don't redirect while auth is loading
    if (loading) return;

    // If user is not logged in and trying to access a protected route
    if (!isLoggedIn && !isPublicRoute) {
      // Store the intended destination for after login
      const currentPath = pathname + (typeof window !== 'undefined' ? window.location.search : '');
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirect to login
      router.push('/login');
      return;
    }

    // If user is logged in and on login/register page, redirect to intended destination or home
    if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
      return;
    }
  }, [isMounted, isLoggedIn, loading, pathname, router, isPublicRoute]);

  // Show children immediately during SSR/hydration to prevent mismatch
  if (!isMounted) {
    return <>{children}</>;
  }

  // Show loading state while checking auth (only after hydration)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in but on a public route, allow access
  if (!isLoggedIn && isPublicRoute) {
    return <>{children}</>;
  }

  // If user is logged in, allow access to all routes
  if (isLoggedIn) {
    return <>{children}</>;
  }

  // This should not be reached due to the useEffect redirect, but just in case
  return null;
} 