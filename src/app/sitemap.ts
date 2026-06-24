/**
 * Chunked sitemap route — /sitemap/[id].xml, fronted by the manual
 * /sitemap-index.xml handler (robots.ts points there; /sitemap.xml is
 * reserved/conflicting per almijob-v2/docs/SITEMAP_CHUNKING_FUTURE.md).
 *
 * 2026 enrichment: the /[country]/[role] grid is no longer a thin doorway.
 * Each page is now a genuine whole-path aggregator (real job market, CV
 * conventions, real local job sites, sector-specific regulated-route note,
 * 5-step plan, FAQ — see app/[country]/[role]/page.tsx). So it is SELF-canonical
 * + indexable and is now included here.
 *
 *   BASE (~1,292): home + 193 country hubs + 519 role hubs + 579 CV-advertise.
 *   GRID (~100,167): rich-countries × 519 roles  (/[country]/[role]).
 *   TOTAL ~101,459 → 3 chunks at 45k.
 *
 * Real-data-or-canonical-up gate: only countries carrying localized
 * free-cv-content data are emitted; a country without it canonicalises up to
 * /[country] (today that's 0 — all 193 served countries have data — but the
 * gate stays honest, and keeps the grid uniform so the slice math is simple).
 *
 * MEMORY-SAFE: the ~100k grid is NEVER materialised as one array. Each chunk
 * computes its slice index-mathematically (ci = L / nRoles, ri = L % nRoles);
 * only BASE (~1.3k) is cached. app/sitemap-index.xml mirrors numSitemapChunks().
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
const CHUNK = 45_000;

// Countries that carry the localized data a real whole-path plan needs. The
// grid is uniform over these × ALL_ROLES, so the per-chunk slice math stays
// simple and honest: a country that ever loses data drops out of the grid (and
// its /[country]/[role] pages canonical-up via the page's own gate).
const RICH_COUNTRIES = COUNTRIES_SERVED.filter((c) => hasFreeCvContent(c.slug));

let _base: MetadataRoute.Sitemap | null = null;
function baseUrls(): MetadataRoute.Sitemap {
  if (_base) return _base;
  const lm = new Date();
  const out: MetadataRoute.Sitemap = [
    { url: `${SITE_ORIGIN}/`, lastModified: lm, changeFrequency: "weekly", priority: 1.0 },
  ];
  // 193 country hubs.
  for (const c of COUNTRIES_SERVED) {
    out.push({ url: `${SITE_ORIGIN}/${c.slug}`, lastModified: lm, changeFrequency: "weekly", priority: 0.8 });
  }
  // 519 role-hub gateway pages (shared package). Same URL shape as country
  // hubs (`/[slug]`); [country]/page.tsx dispatches by data lookup. No slug
  // collisions (verified at integration).
  for (const r of ALL_ROLES) {
    out.push({ url: `${SITE_ORIGIN}/${r.slug}`, lastModified: lm, changeFrequency: "weekly", priority: 0.75 });
  }
  // CV advertise-landing pages (shopfront → AlmiCV), real-data-gated.
  for (const c of RICH_COUNTRIES) {
    out.push({ url: `${SITE_ORIGIN}/free-cv-maker/${c.slug}`, lastModified: lm, changeFrequency: "weekly", priority: 0.8 });
    out.push({ url: `${SITE_ORIGIN}/cv-builder/${c.slug}`, lastModified: lm, changeFrequency: "weekly", priority: 0.8 });
    out.push({ url: `${SITE_ORIGIN}/ai-cv-builder/${c.slug}`, lastModified: lm, changeFrequency: "weekly", priority: 0.8 });
  }
  _base = out;
  return out;
}

// Size of the /[country]/[role] grid (rich-countries × roles), never built whole.
function gridSize(): number {
  return RICH_COUNTRIES.length * ALL_ROLES.length;
}

export function numSitemapChunks(): number {
  return Math.max(1, Math.ceil((baseUrls().length + gridSize()) / CHUNK));
}

export async function generateSitemaps() {
  return Array.from({ length: numSitemapChunks() }, (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: {
  // NOTE: `id` is a Promise in Next 16. `Number(id)` without await returns NaN.
  // This is the bug documented in almijob-v2/docs/SITEMAP_CHUNKING_FUTURE.md.
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const idNum = Number(await id);
  const start = (Number.isNaN(idNum) ? 0 : idNum) * CHUNK;
  const end = start + CHUNK;

  const base = baseUrls();
  const out: MetadataRoute.Sitemap = [];

  // Base portion of this chunk.
  for (let i = Math.max(0, start); i < Math.min(base.length, end); i++) {
    out.push(base[i]);
  }

  // Grid portion (/[country]/[role]) — computed per-chunk, never materialised
  // as a 100k array. Global grid index L maps to (country, role) by division.
  const oStart = Math.max(0, start - base.length);
  const oEnd = end - base.length;
  if (oEnd > 0) {
    const nRoles = ALL_ROLES.length;
    const lm = new Date();
    const cap = Math.min(gridSize(), oEnd);
    for (let L = oStart; L < cap; L++) {
      const c = RICH_COUNTRIES[Math.floor(L / nRoles)];
      const r = ALL_ROLES[L % nRoles];
      out.push({
        url: `${SITE_ORIGIN}/${c.slug}/${r.slug}`,
        lastModified: lm,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return out;
}
