/**
 * AlmiWorld parent — Role-hub gateway page.
 *
 * Renders at world.almiworld.com/[role-slug] for any of the 519 package
 * roles. The page acts as a family gateway: 4 product cards link out to
 * AlmiCV, AlmiSalary, AlmiJob (real links), and AlmiPrep (placeholder).
 *
 * Below the fold: short role overview + related roles (by Industry) +
 * Schema.org Occupation JSON-LD.
 *
 * No per-role custom artwork — uses sector-based generic typography only.
 * This is the MVP scoped in the Phase 5 mission.
 */

import Link from "next/link";
import {
  getRoleBySlug,
  getRolesByCategory,
  type JobRole,
  Industry,
} from "@smnasiruz016-blip/job-roles";

/** Default country used to construct cross-product role-level deep links
 *  when the destination product requires a country segment. Chosen because
 *  US is the largest English-language market — the destination page can
 *  always redirect or surface country selectors. */
const DEFAULT_COUNTRY = "united-states";

/** Slug for Schema.org Occupation lookup — purely a string, not a real link. */
const SCHEMA_ROLE_BASE_URL = "https://world.almiworld.com";

/** Human-readable industry labels mirror lib/roles.ts SECTOR_LABEL but
 *  keyed by Industry directly so this component doesn't depend on the
 *  AlmiWorld Role shape. */
const INDUSTRY_LABEL: Record<Industry, string> = {
  [Industry.Healthcare]: "Healthcare & Medical",
  [Industry.Technology]: "Technology & IT",
  [Industry.Finance]: "Finance & Accounting",
  [Industry.Marketing]: "Sales & Marketing",
  [Industry.Education]: "Education & Training",
  [Industry.Legal]: "Legal",
  [Industry.Engineering]: "Engineering",
  [Industry.Trades]: "Construction & Skilled Trades",
  [Industry.Manufacturing]: "Manufacturing & Production",
  [Industry.Hospitality]: "Hospitality, Tourism & Food",
  [Industry.Beauty]: "Beauty & Personal Care",
  [Industry.ArtsMedia]: "Creative, Design & Media",
  [Industry.Government]: "Public Service",
  [Industry.Administration]: "Business, Office & Admin",
  [Industry.HumanResources]: "Human Resources",
  [Industry.Retail]: "Customer Service & Retail",
  [Industry.Science]: "Science & Research",
  [Industry.Agriculture]: "Agriculture",
  [Industry.Religious]: "Religious & Spiritual",
  [Industry.Security]: "Security",
  [Industry.Languages]: "Languages & Translation",
  [Industry.Automotive]: "Automotive",
  [Industry.RealEstate]: "Real Estate",
  [Industry.Sports]: "Sports & Athletics",
  [Industry.Executive]: "Executive Leadership",
};

type ProductCard = {
  key: "cv" | "salary" | "job" | "prep";
  title: string;
  description: string;
  href: string | null; // null = placeholder ("Coming Soon")
  cta: string;
  comingSoon?: boolean;
};

function buildCards(role: JobRole): ProductCard[] {
  return [
    {
      key: "cv",
      title: `Make Your ${role.name} CV`,
      description: "Free professional templates designed for this role",
      href: `https://almicv.almiworld.com/templates/role/${role.slug}`,
      cta: "Build CV →",
    },
    {
      key: "salary",
      title: `See ${role.name} Salaries Worldwide`,
      description: "Salary data across 193 countries",
      href: `https://almisalary.almiworld.com/salary/${DEFAULT_COUNTRY}/${role.slug}`,
      cta: "View Salaries →",
    },
    {
      key: "job",
      title: `Find ${role.name} Jobs`,
      description: "Open positions globally",
      href: `https://almijob.almiworld.com/jobs/${DEFAULT_COUNTRY}/${role.slug}`,
      cta: "See Jobs →",
    },
    {
      key: "prep",
      title: `IELTS Prep for ${role.name}`,
      description: "Coming soon — IELTS prep for your career path",
      href: null,
      cta: "Coming Soon",
      comingSoon: true,
    },
  ];
}

function buildSubtitle(role: JobRole): string {
  const industry = INDUSTRY_LABEL[role.industry];
  return `${role.name} is a ${industry.toLowerCase()} role. Use the AlmiWorld family below to build your CV, see global salary ranges, and find open positions.`;
}

function buildJsonLd(role: JobRole): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${role.name} — AlmiWorld`,
    url: `${SCHEMA_ROLE_BASE_URL}/${role.slug}`,
    mainEntity: {
      "@type": "Occupation",
      name: role.name,
      description: buildSubtitle(role),
      occupationalCategory: INDUSTRY_LABEL[role.industry],
    },
  });
}

export function RoleHub({ slug }: { slug: string }) {
  const role = getRoleBySlug(slug);
  if (!role) {
    // Caller is responsible for notFound() — this just guards against
    // accidental invocation with an unknown slug.
    return null;
  }

  const siblings: JobRole[] = getRolesByCategory(role.industry)
    .filter((r) => r.slug !== role.slug)
    .slice(0, 8);

  const cards = buildCards(role);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-12">
      <nav className="text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-neutral-500">
          <li>
            <Link href="/" className="hover:underline">AlmiWorld</Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-neutral-900">{role.name}</li>
        </ol>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{role.name}</h1>
        <p className="text-neutral-600">{buildSubtitle(role)}</p>
      </header>

      <section className="space-y-4" aria-labelledby="gateway-heading">
        <h2 id="gateway-heading" className="sr-only">AlmiWorld products for {role.name}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {cards.map((c) => (
            <li
              key={c.key}
              className={
                c.comingSoon
                  ? "rounded-lg border border-dashed border-neutral-200 bg-neutral-50/60 p-5"
                  : "rounded-lg border border-neutral-200 p-5 hover:border-neutral-300"
              }
            >
              {c.href ? (
                <a
                  href={c.href}
                  className="text-base font-semibold text-neutral-900 underline-offset-2 hover:underline"
                >
                  {c.title}
                </a>
              ) : (
                <span className="text-base font-semibold text-neutral-500">{c.title}</span>
              )}
              <p className="mt-1 text-sm text-neutral-600">{c.description}</p>
              <p
                className={
                  c.comingSoon
                    ? "mt-3 inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600"
                    : "mt-3 inline-block text-sm font-medium text-neutral-900"
                }
              >
                {c.cta}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {siblings.length > 0 && (
        <section className="space-y-4" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-medium">
            Related roles in {INDUSTRY_LABEL[role.industry]}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {siblings.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/${r.slug}`}
                  className="block rounded-md border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLd(role) }}
      />
    </main>
  );
}
