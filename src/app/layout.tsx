import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { FontSizeProvider } from "@/components/font-size-provider";
import { FirebaseServiceWorkerRegistrar } from "@/components/firebase-service-worker-registrar";
import { FirebaseForegroundHandler } from "@/components/firebase-foreground-handler";
import Script from "next/script";

export const viewport: Viewport = {
  // Required for env(safe-area-inset-*) to work on iPhone
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GKT Bethany CHMS",
  description: "Church Management System for GKT Bethany",
  icons: {
    icon: "/gkt-logo.png",
    apple: "/gkt-logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GKT Bethany CHMS",
  },
};

import { LanguageProvider } from "@/components/language-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Runs before hydration to prevent font-size flash */}
        <Script
          id="font-size-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var size = localStorage.getItem('app-font-size');
                if (size === 'large') {
                  document.documentElement.style.fontSize = '112.5%';
                } else if (size === 'xlarge') {
                  document.documentElement.style.fontSize = '125%';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Registers firebase-messaging-sw.js on all platforms, required for iOS */}
        <FirebaseServiceWorkerRegistrar />
        <FirebaseForegroundHandler />
        <LanguageProvider>
          <FontSizeProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors/>
            </ThemeProvider>
          </FontSizeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
