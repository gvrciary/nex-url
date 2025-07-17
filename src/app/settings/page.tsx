"use client";

import Settings from "@/components/setting/settingsT";
import { LinksProvider } from "@/components/providers/links-provider";

export default function SettingsPage() {
  return (
    <LinksProvider>
      <Settings />
    </LinksProvider>
  );
}
