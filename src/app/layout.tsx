"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import AuthGuard from "@/components/auth/AuthGuard";
import { useEffect } from "react";
import { initializeNativeFeatures } from "@/utils/capacitor-utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize native features like hiding status bar on Android
    initializeNativeFeatures();
  }, []);

  return (
    <html lang="bg" suppressHydrationWarning>
      <head>
        <title>CashWise - Интелигентна Платформа за Финансово Обучение</title>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {/* Primary Meta Tags */}
        <meta
          name="title"
          content="CashWise - Интелигентна Платформа за Финансово Обучение"
        />
        <meta
          name="description"
          content="Подобрете финансовата грамотност с интерактивната платформа CashWise. Научете се да правите бюджет, да инвестирате и да управлявате парите си чрез забавни курсове и реални сценарии."
        />
        <meta
          name="keywords"
          content="финансова грамотност, управление на пари, бюджет, инвестиции, лични финанси, финансово образование, финансово планиране, изграждане на богатство, финансови курсове, парични умения, България"
        />
        <meta name="author" content="CashWise" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="bg" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://cash-wise.app" />

        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cash-wise.app" />
        <meta
          property="og:title"
          content="CashWise - Интелигентна Платформа за Финансово Обучение"
        />
        <meta
          property="og:description"
          content="Овладейте финансовата грамотност с интерактивната платформа CashWise. Научете се да правите бюджет, да инвестирате и да управлявате парите си чрез забавни курсове и реални сценарии."
        />
        <meta
          property="og:image"
          content="https://cash-wise.app/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CashWise" />
        <meta property="og:locale" content="bg_BG" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cash-wise.app" />
        <meta
          property="twitter:title"
          content="CashWise - Интелигентна Платформа за Финансово Обучение"
        />
        <meta
          property="twitter:description"
          content="Овладейте финансовата грамотност с интерактивната платформа CashWise. Научете се да правите бюджет, да инвестирате и да управлявате парите си чрез забавни курсове и реални сценарии."
        />
        <meta
          property="twitter:image"
          content="https://cash-wise.app/og-image.png"
        />
        <meta property="twitter:creator" content="@cashwise" />
        <meta property="twitter:site" content="@cashwise" />

        {/* App Meta */}
        <meta name="application-name" content="CashWise" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CashWise" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0d9488" />

        {/* Additional SEO Meta */}
        <meta name="msapplication-TileColor" content="#0d9488" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta
          name="theme-color"
          content="#0d9488"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0d9488"
          media="(prefers-color-scheme: dark)"
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CashWise",
              url: "https://cash-wise.app",
              logo: "https://cash-wise.app/logo.png",
              description:
                "Интелигентна платформа за финансово обучение, която трансформира образованието чрез модулни, интерактивни преживявания",
              foundingDate: "2024",
              address: {
                "@type": "PostalAddress",
                addressCountry: "BG",
              },
              sameAs: [
                "https://twitter.com/cashwise",
                "https://linkedin.com/company/cashwise",
              ],
            }),
          }}
        />

        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CashWise",
              url: "https://cash-wise.app",
              description:
                "Овладейте финансовата грамотност с интерактивни курсове за обучение",
              inLanguage: "bg",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://cash-wise.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Structured Data - EducationalOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "CashWise",
              url: "https://cash-wise.app",
              description: "Интерактивна платформа за финансово образование",
              inLanguage: "bg",
              address: {
                "@type": "PostalAddress",
                addressCountry: "BG",
              },
              educationalLevel: "Adult Education",
              teaches: [
                "Финансова грамотност",
                "Лични финанси",
                "Бюджетиране",
                "Инвестиции",
                "Управление на пари",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthGuard>
            <div className="min-h-screen bg-background text-foreground">
              <ConditionalHeader />
              <main className="flex-1">{children}</main>
              <ConditionalFooter />
            </div>
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
