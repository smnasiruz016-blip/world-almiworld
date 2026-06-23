/**
 * Chunked sitemap route — kept at /sitemap/[id].xml, fronted by the manual
 * /sitemap-index.xml handler (robots.ts points there; /sitemap.xml is
 * reserved/conflicting per almijob-v2/docs/SITEMAP_CHUNKING_FUTURE.md).
 *
 * Canonical surface now = home + 193 country hubs + 519 role hubs = ~713
 * URLs, which fits in a single chunk (chunk 0). The country×role grid
 * (/[country]/[role], ~50,759 URLs) is DELIBERATELY excluded: those pages
 * are thin cross-link doorways that canonicalise up to their /[country] hub
 * (see app/[country]/[role]/page.tsx), so they are not canonical URLs and
 * listing them would dilute crawl budget. The pages still render for users.
 *
 * The chunked routing (generateSitemaps + async id) is retained so the
 * sitemap URL shape and GSC submission stay unchanged, and so re-adding a
 * large canonical surface later is a one-line change. If that surface ever
 * crosses ~25k, raise CHUNK / restore the grid builder from git history.
 *
 * Test discipline: NEVER smoke-test via `npx tsx` — the Promise wrapping of
 * `id` only happens through Next's loader at runtime. Use
 * `npm run build && npx next start && curl /sitemap/0.xml`.
 */

import type { MetadataRoute } from "next";
import { COUNTRIES_SERVED } from "@/lib/countries";
import { ALL_ROLES } from "@/lib/roles";
import { hasFreeCvContent } from "@/lib/free-cv-content";

const SITE_ORIGIN = "https://world.almiworld.com";

export async function generateSitemaps() {
  // Single chunk — the canonical surface (~713 URLs) fits well within one.
  return [{ id: 0 }];
}

export default async function sitemap({
  id,
}: {
  // NOTE: `id` is a Promise in Next 16. `Number(id)` without await returns NaN.
  // This is the bug documented in almijob-v2/docs/SITEMAP_CHUNKING_FUTURE.md.
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  // Only chunk 0 is generated; any other id yields an empty sitemap.
  if (Number(await id) !== 0) return [];

  const lastModified = new Date();
  const home: MetadataRoute.Sitemap[number] = {
    url: `${SITE_ORIGIN}/`,
    lastModified,
    changeFrequency: "weekly",
    priority: 1.0,
  };
  const countryHubs: MetadataRoute.Sitemap = COUNTRIES_SERVED.map((c) => ({
    url: `${SITE_ORIGIN}/${c.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  // 519 role-hub gateway pages from the shared package. Same URL shape as
  // country hubs (`/[slug]`) — the [country]/page.tsx dispatcher routes by
  // data lookup. Zero collisions with country slugs verified at integration.
  const roleHubs: MetadataRoute.Sitemap = ALL_ROLES.map((r) => ({
    url: `${SITE_ORIGIN}/${r.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // CV advertise-landing pages (shopfront → AlmiCV). Self-canonical, listed only
  // where sourced per-country content exists (real-data-or-noindex gate).
  const cvAdvertise: MetadataRoute.Sitemap = [];
  for (const c of COUNTRIES_SERVED) {
    if (!hasFreeCvContent(c.slug)) continue;
    cvAdvertise.push({ url: `${SITE_ORIGIN}/free-cv-maker/${c.slug}`, lastModified, changeFrequency: "weekly", priority: 0.8 });
  }

  return [home, ...countryHubs, ...roleHubs, ...cvAdvertise];
}
