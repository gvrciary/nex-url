import type { MetadataRoute } from "next";
import { appConfig } from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: appConfig.deployUrl,
      lastModified: new Date(),
    },
  ];
}
