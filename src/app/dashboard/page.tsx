"use client";

import AddLink from "@/components/dashboard/AddLink";
import LinkHistory from "@/components/dashboard/LinkHistory";
import { LinksProvider } from "@/components/providers/LinksProvider";

export default function DashboardPage() {
  return (
    <LinksProvider>
      <AddLink />
      <LinkHistory />
    </LinksProvider>
  );
}
