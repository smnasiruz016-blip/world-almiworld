import { NextResponse, type NextRequest } from "next/server";
import { getCountryBySlug } from "@/lib/countries";
import { PACKAGE_ROLE_SLUGS, getRoleBySlug } from "@/lib/roles";

// COST FIX (Oct 2026): the old programmatic pages are removed (owner ruling,
// 17 Oct: deleted, no redirects). Exactly the URLs those routes served answer
// 410 Gone here, before any render or ISR write:
//   /{country}                 (country hub)        — known country slug
//   /{role}                    (role hub)           — known package role slug
//   /{country}/{role}          (country x role)     — known country + known role
//   /free-cv-maker/{x}, /cv-builder/{x}, /ai-cv-builder/{x}  (whole families)
// Everything else passes through untouched: the home page, /_next, /api,
// robots.txt, sitemaps, icons and any file with an extension are not even
// matched (see config.matcher), and an unknown slug falls through to the
// static 404.

const GONE_BUILDER_FAMILIES = new Set(["free-cv-maker", "cv-builder", "ai-cv-builder"]);

export function isGonePath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 1) {
    const [slug] = parts;
    return PACKAGE_ROLE_SLUGS.has(slug) || getCountryBySlug(slug) !== undefined;
  }
  if (parts.length === 2) {
    const [first, second] = parts;
    if (GONE_BUILDER_FAMILIES.has(first)) return true;
    return getCountryBySlug(first) !== undefined && getRoleBySlug(second) !== undefined;
  }
  return false;
}

export function proxy(request: NextRequest) {
  if (!isGonePath(request.nextUrl.pathname)) return NextResponse.next();
  return new NextResponse("410 Gone — this page has been removed.", {
    status: 410,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
      "x-robots-tag": "noindex",
    },
  });
}

export const config = {
  // One or two path segments, no dot in either (so no robots.txt, sitemap
  // XML, favicon or other asset), never under /_next or /api. "/" is not
  // matched.
  matcher: [
    "/((?!_next|api)[^/.]+)",
    "/((?!_next|api)[^/.]+)/([^/.]+)",
  ],
};
