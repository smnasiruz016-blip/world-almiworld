/**
 * Manual sitemap index — lists the chunk sitemaps that `generateSitemaps()`
 * emits but Next 16 does NOT auto-aggregate at /sitemap.xml.
 *
 * Lives at /sitemap-index.xml — NOT /sitemap.xml (which conflicts with
 * Next's metadata route at build time, per
 * almijob-v2/docs/SITEMAP_CHUNKING_FUTURE.md §"Pitfalls").
 *
 * Mirrors numSitemapChunks() from sitemap.ts so the advertised chunk count can
 * never drift from the chunks the route actually serves (drift = phantom 404
 * chunks in GSC).
 *
 * Submit /sitemap-index.xml to Google Search Console once after deploy.
 */

import { numSitemapChunks } from "@/app/sitemap";

const SITE_ORIGIN = "https://world.almiworld.com";

export function GET() {
  const now = new Date().toISOString();
  const entries = Array.from({ length: numSitemapChunks() }, (_, i) =>
    `  <sitemap>
    <loc>${SITE_ORIGIN}/sitemap/${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
  ).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
