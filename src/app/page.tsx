import Link from "next/link";
import { COUNTRIES_SERVED } from "@/lib/countries";
import { PRODUCTS } from "@/lib/products";

const TOP_PICKS = [
  "united-states",
  "united-kingdom",
  "united-arab-emirates",
  "germany",
  "india",
  "pakistan",
];

export default function HomePage() {
  const picks = TOP_PICKS.map((slug) =>
    COUNTRIES_SERVED.find((c) => c.slug === slug),
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-14">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Your career, around the globe — powered by AI.
        </h1>
        <p className="text-lg text-neutral-600">
          AlmiWorld is one place for the four tools you need to work, study,
          and apply abroad. Pick a country, pick a role, and we&apos;ll send
          you to the right product.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">The four products</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <li
              key={p.key}
              className="rounded-lg border border-neutral-200 p-5 hover:border-neutral-300"
            >
              <a
                href={p.origin}
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
        <h2 className="text-xl font-medium">Start with a country</h2>
        <ul className="grid gap-2 sm:grid-cols-3">
          {picks.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                className="block rounded-md border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-neutral-500">
          {COUNTRIES_SERVED.length} countries covered in total.
        </p>
      </section>
    </main>
  );
}
