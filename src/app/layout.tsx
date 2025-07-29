import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthModalProvider } from "@/providers/auth-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const generalSansVariable = localFont({
  variable: "--font-general-variable",
  src: "../fonts/GeneralSansVariable.woff2",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexurl.vercel.app"),
  title: {
    default: "Nex URL - Shorten your Links",
    template: "%s | Nex URL",
  },
  description:
    "Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.",
  manifest: "/manifest.json",
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "32x32",
      url: "/favicon.ico",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexurl.vercel.app",
    title: "Nex URL - Professional URL Shortener",
    description:
      "Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.",
    siteName: "Nex URL",
    images: [
      {
        url: "/images/og-image.png",
        width: 1024,
        height: 1024,
        alt: "Nex URL - URL Shortener Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nex URL - Professional URL Shortener",
    description:
      "Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.",
    creator: "@alexisgqrcia",
  },
  alternates: {
    canonical: "https://nexurl.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${generalSansVariable.variable} antialiased`}>
        <ThemeProvider>
          <AuthModalProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster />
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
