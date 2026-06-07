import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCountryBySlug } from "@/lib/countries";
import { getRoleBySlug } from "@/lib/roles";

type Params = { country: string; role: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country, role } = await params;
  const c = getCountryBySlug(country);
  const r = getRoleBySlug(role);
  if (!c || !r) return { title: "Not found" };
  return {
    title: `${r.name} in ${c.name} — AlmiWorld`,
    description: `Jobs, salary ranges, CV guidance, and universities for ${r.name} in ${c.name}. The four AlmiWorld products, one page.`,
    // SEO consolidation: this role×country page is a thin cross-link doorway
    // (4 product links, no unique data) over the richer /[country] hub. It
    // canonicalises up to the country hub and is kept out of the sitemap, so
    // crawl budget concentrates on the country + role hub pages. The page
    // still renders for users and keeps all its cross-product links.
    alternates: { canonical: `https://world.almiworld.com/${c.slug}` },
  };
}

type Card = {
  label: string;
  href: string;
};

export default async function CountryRolePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country, role } = await params;
  const c = getCountryBySlug(country);
  const r = getRoleBySlug(role);
  if (!c || !r) notFound();

  const cards: Card[] = [
    {
      label: `View ${r.name} jobs in ${c.name}`,
      href: `https://almijob.almiworld.com/jobs/${c.slug}/${r.slug}`,
    },
    {
      label: `Check ${r.name} salary in ${c.name}`,
      href: `https://almisalary.almiworld.com/salary/${c.slug}/${r.slug}`,
    },
    {
      label: `Build your ${r.name} CV for ${c.name}`,
      href: `https://almicv.almiworld.com/cv-guide/${c.slug}/${r.slug}`,
    },
    {
      label: `Find universities in ${c.name}`,
      href: `https://almistudy.almiworld.com/universities/${c.slug}`,
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-12">
      <nav className="text-sm">
        <Link href="/" className="text-neutral-500 hover:underline">
          AlmiWorld
        </Link>
        <span className="text-neutral-400"> / </span>
        <Link
          href={`/${c.slug}`}
          className="text-neutral-500 hover:underline"
        >
          {c.name}
        </Link>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          {r.name} in {c.name}
        </h1>
        <p className="text-neutral-600">
          Four product links for {r.name} work in {c.name}, plus
          country-level universities. Application language: {c.primaryLanguage}.
          Sector: {r.sector}.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Go deeper</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.href}>
              <a
                href={card.href}
                className="block rounded-lg border border-neutral-200 p-5 hover:border-neutral-300"
              >
                <span className="text-base font-medium text-neutral-900 underline-offset-2 hover:underline">
                  {card.label}
                </span>
                <span className="mt-1 block truncate text-xs text-neutral-500">
                  {new URL(card.href).host}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
