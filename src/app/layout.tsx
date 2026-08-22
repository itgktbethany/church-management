import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseForegroundHandler } from "@/components/firebase-foreground-handler";

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
      <body className="min-h-full flex flex-col">
        <FirebaseForegroundHandler />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors/>
        </ThemeProvider>
      </body>
    </html>
  );
}
