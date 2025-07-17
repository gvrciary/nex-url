"use client";

import AddLink from "@/components/dashboard/add-link";
import LinkHistory from "@/components/dashboard/link-history";
import { LinksProvider } from "@/components/providers/links-provider";

export default function DashboardPage() {
  return (
    <LinksProvider>
      <AddLink />
      <LinkHistory />
    </LinksProvider>
  );
}
