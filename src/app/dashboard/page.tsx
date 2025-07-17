import AddLink from "@/components/dashboard/add-link";
import LinkHistory from "@/components/dashboard/link-history";
import { LinksProvider } from "@/components/providers/links-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DashboardL",
};

export default function DashboardPage() {
  return (
    <LinksProvider>
      <AddLink />
      <LinkHistory />
    </LinksProvider>
  );
}
