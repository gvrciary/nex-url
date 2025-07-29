import Settings from "@/components/setting/settings";
import { LinksProvider } from "@/providers/links-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <LinksProvider>
      <Settings />
    </LinksProvider>
  );
}
