import AddLink from "@/components/dashboard/add-link";
import LinkHistory from "@/components/dashboard/link-history";
import { LinksProvider } from "@/providers/links-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <LinksProvider>
      <section className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="order-1">
            <AddLink />
          </div>
          <div className="order-2">
            <LinkHistory />
          </div>
        </div>
      </section>
    </LinksProvider>
  );
}
