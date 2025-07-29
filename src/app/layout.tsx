import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthModalProvider } from "@/providers/auth-provider";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";
import { generalSansVariable } from "@/fonts";
import { BASE_URL } from "@/constants/url";

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL}`),
  title: {
    default: "Nex URL - Shorten your Links",
    template: "%s | Nex URL",
  },
  authors: [{ name: "Alexis Garcia", url: "gvrciary.dev" }],
  description:
    "Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", url: "/icon.svg", type: "image/svg+xml" },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `/`,
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
    creator: "@gvrciary",
  },
  alternates: {
    canonical: "/",
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
            <main className="h-[calc(100vh-4rem)]">{children}</main>
            <Toaster />
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
