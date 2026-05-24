import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCountryBySlug } from "@/lib/countries";
import { JOB_ROLES, BASE_ROLES } from "@/lib/roles";
import { PRODUCTS } from "@/lib/products";

type Params = { country: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = getCountryBySlug(country);
  if (!c) return { title: "Not found" };
  return {
    title: `Build your career in ${c.name} — AlmiWorld`,
    description: `Jobs, salaries, universities, and CV guidance for ${c.name}, linked across the four AlmiWorld products.`,
  };
}

export default async function CountryHubPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country } = await params;
  const c = getCountryBySlug(country);
  if (!c) notFound();

  const featuredRoles = BASE_ROLES.map((slug) =>
    JOB_ROLES.find((r) => r.slug === slug),
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
