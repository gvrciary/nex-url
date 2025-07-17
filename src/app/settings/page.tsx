import Settings from "@/components/setting/settings";
import { LinksProvider } from "@/components/providers/links-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SettingsL",
};

export default function SettingsPage() {
  return (
    <LinksProvider>
      <Settings />
    </LinksProvider>
  );
}
