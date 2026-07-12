import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthModalProvider } from "@/providers/auth-modal-provider";
import Header from "@/components/layout/header";
import MainFrame from "@/components/layout/main-frame";
import { generalSansVariable, lastik } from "@/fonts";
import { appConfig } from "@/config";
import { ToasterComponent } from "@/components/ui/toast";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: appConfig.title,
  url: appConfig.deployUrl,
  creator: {
    "@type": "Person",
    name: "alexisgvrcia",
    url: "https://alexisgvrcia.dev",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: appConfig.title,
  url: appConfig.deployUrl,
  description: appConfig.description,
};

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.deployUrl),
  title: {
    default: `${appConfig.title} | Clean, Fast URL Shortener`,
    template: `%s | ${appConfig.title}`,
  },
  creator: "alexisgvrcia",
  authors: [{ name: "Alexis Garcia", url: "https://alexisgvrcia.dev" }],
  description: appConfig.description,
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
    title: `${appConfig.title} | Clean, Fast URL Shortener`,
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
    title: `${appConfig.title} | Clean, Fast URL Shortener`,
    description: appConfig.description,
    creator: "@alexisgvrcia",
    images: ["/og-image.png"],
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
      <body
        className={`${generalSansVariable.variable} ${lastik.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <ThemeProvider>
          <AuthModalProvider>
            <Header />
            <MainFrame>{children}</MainFrame>
            <ToasterComponent />
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
