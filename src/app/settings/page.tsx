"use client";

import Settings from "@/components/setting/settings";
import { LinksProvider } from "@/components/providers/links-provider";

export default function SettingsPage() {
  return (
    <LinksProvider>
      <Settings />
    </LinksProvider>
  );
}
