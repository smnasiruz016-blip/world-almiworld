/**
 * AlmiWorld parent — single-segment hub dispatcher.
 *
 * Next.js only allows ONE dynamic segment at this level, so this route
 * serves BOTH country hubs (e.g., /united-states) AND the new role hubs
 * (e.g., /software-engineer). The param name "country" is kept for
 * backward compatibility — the value is just a string slug that the
 * handler routes by data lookup.
 *
 * Dispatch priority (verified zero slug collisions between 193 country
 * slugs and 519 package role slugs as of 2026-05-28):
 *   1. Slug is a known package role → render RoleHub (Phase 5)
 *   2. Slug is a known country → render CountryHub (original)
 *   3. Else → notFound()
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCountryBySlug } from "@/lib/countries";
import {
  JOB_ROLES,
  BASE_ROLES,
  PACKAGE_ROLE_SLUGS,
  getRoleBySlug,
} from "@/lib/roles";
import { PRODUCTS } from "@/lib/products";
import { RoleHub } from "@/components/RoleHub";

type Params = { country: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country: slug } = await params;

  // Role-hub metadata (Phase 5 surface)
  if (PACKAGE_ROLE_SLUGS.has(slug)) {
    const role = getRoleBySlug(slug);
    if (role) {
      return {
        title: `${role.name} — Build career across AlmiCV, AlmiSalary, AlmiJob`,
        description: `Everything you need for a ${role.name} career — CV templates, global salary data, open jobs, and prep — all in one place from AlmiWorld.`,
        alternates: {
          canonical: `https://world.almiworld.com/${role.slug}`,
        },
        openGraph: {
          title: `${role.name} — AlmiWorld`,
          description: `Build your ${role.name} career across the AlmiWorld family.`,
          url: `https://world.almiworld.com/${role.slug}`,
          type: "website",
          siteName: "AlmiWorld",
        },
        twitter: {
          card: "summary",
          title: `${role.name} — AlmiWorld`,
          description: `Build your ${role.name} career across the AlmiWorld family.`,
        },
      };
    }
  }

  // Country-hub metadata (original behavior)
  const c = getCountryBySlug(slug);
  if (!c) return { title: "Not found" };
  return {
    title: `Build your career in ${c.name} — AlmiWorld`,
    description: `Jobs, salaries, universities, and CV guidance for ${c.name}, linked across the four AlmiWorld products.`,
    // Self-canonical so the country hub is the consolidation target for its
    // [country]/[role] grid pages (which canonicalise up to here). Without
    // this it would inherit the layout fallback (the homepage).
    alternates: { canonical: `https://world.almiworld.com/${c.slug}` },
  };
}

export default async function HubPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country: slug } = await params;

  // 1. Role hub — handles all 519 package roles
  if (PACKAGE_ROLE_SLUGS.has(slug)) {
    return <RoleHub slug={slug} />;
  }

  // 2. Country hub — original behavior preserved verbatim
  const c = getCountryBySlug(slug);
  if (!c) notFound();

  const featuredRoles = BASE_ROLES.map((s) =>
    JOB_ROLES.find((r) => r.slug === s),
  ).filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-12">
      <nav className="text-sm">
        <Link href="/" className="text-neutral-500 hover:underline">
          ← AlmiWorld
        </Link>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Build your career in {c.name}
        </h1>
        <p className="text-neutral-600">
          Applications in {c.name} are typically written in {c.primaryLanguage}.
          Use the four AlmiWorld products below for jobs, pay ranges,
          universities, and a CV tuned to local conventions.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">For {c.name}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <li
              key={p.key}
              className="rounded-lg border border-neutral-200 p-5 hover:border-neutral-300"
            >
              <a
                href={p.countryUrl(c.slug)}
                className="text-base font-semibold text-neutral-900 underline-offset-2 hover:underline"
              >
                {p.name}
              </a>
              <p className="mt-1 text-sm text-neutral-600">{p.tagline}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">
          Most-searched roles in {c.name}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {featuredRoles.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/${c.slug}/${r.slug}`}
                className="block rounded-md border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
              >
                {r.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-neutral-500">
          All {JOB_ROLES.length} roles in {c.name} have a page — every role you
          can think of is one URL away.
        </p>
      </section>
    </main>
  );
}
