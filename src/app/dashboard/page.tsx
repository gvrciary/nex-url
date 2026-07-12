import LinkHistory from "@/components/dashboard/link-history";
import { LinksProvider } from "@/providers/links-provider";
import { getUserLinks } from "@/server/actions/user";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
    },
  },
};

export default async function DashboardPage() {
  const initialLinks = await getUserLinks();

  return (
    <LinksProvider initialLinks={initialLinks}>
      <section className="mx-auto max-w-7xl">
        <LinkHistory />
      </section>
    </LinksProvider>
  );
}
