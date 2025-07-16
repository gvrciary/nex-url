import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthModalProvider } from "@/components/providers/AuthModalProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const geistMonoVariable = localFont({
  variable: "--font-geist-mono",
  src: "../fonts/GeistMonoVF.woff2",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexurl.com"),
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "32x32",
      url: "/images/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      url: "/images/icon-192.png",
    },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "180x180",
      url: "/images/apple-touch-icon.png",
    },
  ],
  title: "Nex URL - Shorten your Links",
  description: "Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          `font-sans ${geistMonoVariable.variable}`,
          "selection:bg-neutral-200 dark:selection:bg-neutral-700",
        )}>
        <ThemeProvider>
          <AuthModalProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
