import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The app pages are a personal, browser-local workspace, not content.
      disallow: ["/dashboard", "/shifts", "/analytics", "/tax-summary", "/profile"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
