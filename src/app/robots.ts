import type { MetadataRoute } from "next";

const SITE_ORIGIN = "https://world.almiworld.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // Point crawlers at the manual index handler, not /sitemap.xml
    // (which Next reserves for the chunked sitemap route).
    sitemap: `${SITE_ORIGIN}/sitemap-index.xml`,
  };
}
