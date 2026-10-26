/**
 * Sitemap route — /sitemap/[id].xml, fronted by the manual
 * /sitemap-index.xml handler (robots.ts points there; /sitemap.xml is
 * reserved/conflicting per almijob-v2/docs/SITEMAP_CHUNKING_FUTURE.md).
 *
 * COST FIX (Oct 2026): the programmatic pages — /[country] and role hubs,
 * the /[country]/[role] grid and the free-cv-maker / cv-builder /
 * ai-cv-builder country pages — were removed (owner ruling 17 Oct; they
 * answer 410 Gone from src/proxy.ts). The home page is the one page left,
 * so there is one chunk. The generateSitemaps() shape is kept so the URL
 * /sitemap/0.xml (and the index that lists it) does not move.
 *
 * Test discipline: NEVER smoke-test via `npx tsx` — the Promise wrapping of
 * `id` only happens through Next's loader at runtime.
 */

import type { MetadataRoute } from "next";

const SITE_ORIGIN = "https://world.almiworld.com";

// Constant data-snapshot date (a wall-clock date invites needless re-crawls).
const LM = new Date("2026-07-13");

export function numSitemapChunks(): number {
  return 1;
}

export async function generateSitemaps() {
  return Array.from({ length: numSitemapChunks() }, (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: {
  // NOTE: `id` is a Promise in Next 16. `Number(id)` without await returns NaN.
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const idNum = Number(await id);
  if (idNum !== 0 && !Number.isNaN(idNum)) return [];
  return [
    { url: `${SITE_ORIGIN}/`, lastModified: LM, changeFrequency: "weekly", priority: 1.0 },
  ];
}
