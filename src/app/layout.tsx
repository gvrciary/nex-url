import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthModalProvider } from "@/providers/auth-provider";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";
import { generalSansVariable } from "@/fonts";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.deployUrl),
  title: {
    default: `${appConfig.title} - Professional URL Shortener`,
    template: `%s | ${appConfig.title}`,
  },
  creator: "gvrciary",
  authors: [{ name: "Alexis Garcia", url: "gvrciary.dev" }],
  description: appConfig.description,
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
    url: "/",
    title: `${appConfig.title} - Professional URL Shortener`,
    description: appConfig.description,
    siteName: appConfig.title,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${appConfig.title} - URL Shortener Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${appConfig.title} - Professional URL Shortener`,
    description: appConfig.description,
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
