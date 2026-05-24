/**
 * Chunked sitemap — async-id pattern from day one.
 *
 * Scale: home + 193 country hubs + 193 × 263 = 50,759 country×role pages
 * = 50,953 URLs. Past Google's 50,000-URL-per-sitemap cap, so chunking
 * is required from launch (not optional).
 *
 * Layout:
 *   - Chunk 0  = home + 193 country hubs (194 URLs)
 *   - Chunks 1..N = country×role grid, sliced at CHUNK URLs each
 *     (50,759 ÷ 25,000 = 3 chunks at current scale → 4 sitemaps total)
 *
 * Reference: docs/SITEMAP_CHUNKING_FUTURE.md in almijob-v2 — explains
 * the Next 16 async-id bug that ate 4 AlmiJob PRs. The fix is:
 *   • `id: Promise<string>` (NOT string)
 *   • `await id` before Number(...) coercion
 *   • return type `Promise<MetadataRoute.Sitemap>`
 *
 * Test discipline: NEVER smoke-test sitemap chunks via `npx tsx` — the
 * Promise wrapping only happens through Next's loader at runtime. Use
 * `npm run build && npx next start && curl /sitemap/N.xml`.
 */

import type { MetadataRoute } from "next";
import { COUNTRIES_SERVED } from "@/lib/countries";
import { JOB_ROLES } from "@/lib/roles";

const SITE_ORIGIN = "https://world.almiworld.com";
const CHUNK = 25000;

const TOTAL_ROLE_URLS = COUNTRIES_SERVED.length * JOB_ROLES.length;
const NUM_ROLE_CHUNKS = Math.ceil(TOTAL_ROLE_URLS / CHUNK);

let _allRoleUrlsCache: MetadataRoute.Sitemap | null = null;

function buildAllRoleUrls(): MetadataRoute.Sitemap {
  if (_allRoleUrlsCache) return _allRoleUrlsCache;
  const lastModified = new Date();
  const out: MetadataRoute.Sitemap = [];
  for (const c of COUNTRIES_SERVED) {
    for (const r of JOB_ROLES) {
      out.push({
        url: `${SITE_ORIGIN}/${c.slug}/${r.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }
  _allRoleUrlsCache = out;
  return out;
}

export async function generateSitemaps() {
  // Chunk 0 = home + 193 country hubs. Chunks 1..NUM_ROLE_CHUNKS = role grid.
  return Array.from({ length: 1 + NUM_ROLE_CHUNKS }, (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: {
  // NOTE: `id` is a Promise in Next 16. `Number(id)` without await returns NaN.
  // This is the bug documented in almijob-v2/docs/SITEMAP_CHUNKING_FUTURE.md.
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const n = Number(await id);
  const lastModified = new Date();

  if (n === 0) {
    const home: MetadataRoute.Sitemap[number] = {
      url: `${SITE_ORIGIN}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    };
    const hubs: MetadataRoute.Sitemap = COUNTRIES_SERVED.map((c) => ({
      url: `${SITE_ORIGIN}/${c.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [home, ...hubs];
  }

  const all = buildAllRoleUrls();
  const start = (n - 1) * CHUNK;
  return all.slice(start, start + CHUNK);
}
