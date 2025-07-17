import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthModalProvider } from "@/components/providers/auth-provider";
import Header from "@/components/layout/HeaderT";
import Footer from "@/components/layout/footerT";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const interVariable = localFont({
  variable: "--font-inter-variable",
  src: "../fonts/InterVariable.woff2",
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
  description:
    "Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interVariable.variable} antialiased`}>
        <ThemeProvider>
          <AuthModalProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster/>
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
