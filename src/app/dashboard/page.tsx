import LinkHistory from "@/components/dashboard/link-history";
import { LinksProvider } from "@/providers/links-provider";
import { getUserLinks } from "@/server/actions/user";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const initialLinks = await getUserLinks();

  return (
    <LinksProvider initialLinks={initialLinks}>
      <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LinkHistory />
      </section>
    </LinksProvider>
  );
}
