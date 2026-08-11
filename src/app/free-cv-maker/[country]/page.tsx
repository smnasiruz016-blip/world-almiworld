import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryBySlug } from "@/lib/countries";
import { getConvention, hasVerifiedConvention } from "@/lib/cv-conventions";
import { getFreeCvContent, hasFreeCvContent } from "@/lib/free-cv-content";
import { PRODUCTS } from "@/lib/products";

export const revalidate = false; // render-once, cache until redeploy — static per-country data, no periodic ISR re-writes
export const dynamicParams = true;

const SITE_ORIGIN = "https://world.almiworld.com";
const CV = PRODUCTS.find((p) => p.key === "cv")!;

type Params = { country: string };

// Dynamic so the year-stamped title stays current each year (server-side).
const YEAR = new Date().getFullYear();

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = getCountryBySlug(country);
  if (!c) return {};
  const content = getFreeCvContent(c.slug);
  const term = content?.localTerm ?? "CV";
  const url = `${SITE_ORIGIN}/free-cv-maker/${c.slug}`;
  const title = `CV Maker in ${c.name} (${YEAR}) — ATS-Ready ${term} Builder · AlmiWorld`;
  const description = `CV maker for ${c.name}: an ATS-ready ${term} with local conventions and ${c.primaryLanguage} support — build it on AlmiCV. 7-day free trial, then $12/month.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: hasFreeCvContent(c.slug) ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: "website", siteName: "AlmiWorld" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HubFreeCvMaker({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country } = await params;
  const c = getCountryBySlug(country);
  if (!c) notFound();
  const convention = getConvention(c.slug);
  if (!convention) notFound();
  const content = getFreeCvContent(c.slug);
  const isVerified = hasVerifiedConvention(c.slug);
  const term = content?.localTerm ?? "CV";

  const url = `${SITE_ORIGIN}/free-cv-maker/${c.slug}`;
  const buildUrl = CV.countryUrl(c.slug); // → almicv.almiworld.com/cv-guide/{country}

  const faqs: { q: string; a: string }[] = [
    {
      q: `Where can I make a free CV for ${c.name}?`,
      a: `On AlmiCV, AlmiWorld's CV product. It builds a ${c.name}-ready ${term} with local conventions and ${c.primaryLanguage} support. 7-day free trial, then $12/month.`,
    },
    {
      q: `Is it really free?`,
      a: `AlmiCV is $12/month with a 7-day free trial — unlimited CVs, full AI and a clean PDF download. Cancel inside the trial and you pay nothing.`,
    },
    {
      q: `Do I need a photo on a ${c.name} CV?`,
      a: convention.includePhoto === "required"
        ? `In ${c.name} a photo is commonly expected — AlmiCV's templates leave room for one.`
        : convention.includePhoto === "optional"
          ? `A photo is optional in ${c.name}. AlmiCV's templates work with or without one.`
          : `A photo is usually left off in ${c.name}. AlmiCV's default templates are photo-free and recruiter-safe.`,
    },
    {
      q: `Will the CV pass the ATS (applicant tracking system)?`,
      a: `AlmiCV uses a clean, single-column-friendly structure ATS software can read, with a resume score that flags formatting and keyword gaps before you apply.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AlmiWorld", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: `Free CV Maker in ${c.name}`, item: url },
    ],
  };

  // The rest of AlmiWorld for this country — the hub's cross-sell.
  const others = PRODUCTS.filter((p) => p.key !== "cv");

  return (
    <main className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-plum-soft mb-5">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-coral transition-colors">AlmiWorld</Link></li>
            <li aria-hidden="true">·</li>
            <li><span className="font-medium text-plum">Free CV Maker in {c.name}</span></li>
          </ol>
        </nav>

        {/* 2. Eyebrow + H1 + advertise intro + funnel CTA */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-coral">AlmiWorld · Free CV Maker</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-plum mb-4">
            Free CV Maker for {c.name}
          </h1>
          <p className="text-base sm:text-lg text-plum-soft leading-relaxed max-w-3xl">
            {content
              ? content.searchContext
              : `Make an ATS-ready CV for ${c.name}.`}{" "}
            AlmiWorld&apos;s CV maker — built as AlmiCV — gets you a {c.name}-ready {term} to local conventions, with {c.primaryLanguage} support and a clean PDF. 7-day free trial, then $12/month.
          </p>
          <div className="mt-6">
            <a
              href={buildUrl}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-coral px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-coral-deep"
            >
              Build your {term} on AlmiCV →
            </a>
            <p className="text-xs text-plum-soft mt-2">7-day free trial, then $12/month on AlmiCV. Cancel anytime.</p>
          </div>
        </header>

        {/* 3. What AlmiWorld gives you (free), via AlmiCV */}
        <section className="mb-12 rounded-xl border border-peach bg-white p-6 sm:p-8" aria-labelledby="free-title">
          <h2 id="free-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-4">
            What you get
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-plum">
            <li className="flex gap-2"><span aria-hidden="true" className="text-coral">✓</span> Unlimited CVs and unlimited AI assists</li>
            <li className="flex gap-2"><span aria-hidden="true" className="text-coral">✓</span> ATS-ready templates recruiters can read</li>
            <li className="flex gap-2"><span aria-hidden="true" className="text-coral">✓</span> A resume score that flags gaps before you apply</li>
            <li className="flex gap-2"><span aria-hidden="true" className="text-coral">✓</span> Clean PDF download, no watermark</li>
            <li className="flex gap-2"><span aria-hidden="true" className="text-coral">✓</span> AI help in {c.primaryLanguage}</li>
            <li className="flex gap-2"><span aria-hidden="true" className="text-coral">✓</span> {c.name} CV conventions built in</li>
          </ul>
          <p className="text-sm text-plum-soft leading-relaxed mt-4">
            It runs on AlmiCV, AlmiWorld&apos;s CV product — $12/month with a 7-day free trial, for unlimited CVs and AI.
          </p>
        </section>

        {/* 4. Country CV conventions */}
        <section className="mb-12 rounded-xl border border-peach bg-white p-6 sm:p-8" aria-labelledby="norms-title">
          <h2 id="norms-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-4">
            {term} conventions in {c.name}
            {!isVerified && (
              <span className="ml-3 align-middle text-[11px] uppercase tracking-wide text-plum-soft bg-cream-soft px-2 py-0.5 rounded-full">
                Regional default
              </span>
            )}
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm">
            <div><dt className="text-xs uppercase tracking-wide text-plum-soft">Page length</dt><dd className="text-plum">{convention.pageLength}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-plum-soft">Photo</dt><dd className="text-plum">{convention.includePhoto}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-plum-soft">Address</dt><dd className="text-plum">{convention.includeAddress}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-plum-soft">Date of birth</dt><dd className="text-plum">{convention.includeDOB}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-plum-soft">GPA</dt><dd className="text-plum">{convention.includeGPA}</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-plum-soft">References</dt><dd className="text-plum">{convention.referenceSection}</dd></div>
          </dl>
          {content && content.formatNotes.length > 0 && (
            <ul className="space-y-2 text-sm text-plum-soft leading-relaxed">
              {content.formatNotes.map((note, i) => (
                <li key={i} className="flex gap-2"><span aria-hidden="true" className="text-coral">•</span> {note}</li>
              ))}
            </ul>
          )}
          <p className="text-xs text-plum-soft mt-4">
            These are common conventions, not rules — always check the specific employer&apos;s expectations for each application.
          </p>
        </section>

        {/* 5. Local job market */}
        {content && (
          <section className="mb-12" aria-labelledby="market-title">
            <h2 id="market-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-4">
              Looking for work in {c.name}
            </h2>
            <p className="text-sm sm:text-base text-plum-soft leading-relaxed max-w-3xl mb-4">
              {content.jobMarket} Pay is quoted in {content.currency}. The main hiring hubs include {content.cities.join(", ")}.
            </p>
            {content.workRouteNote && (
              <p className="text-sm sm:text-base text-plum-soft leading-relaxed max-w-3xl mb-4">
                {content.workRouteNote}
              </p>
            )}
            <p className="text-sm text-plum-soft leading-relaxed max-w-3xl">
              Once your {term} is ready, you can apply on {content.localJobSites.join(", ")}.
            </p>
          </section>
        )}

        {/* 6. FAQ */}
        <section className="mb-12" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-5">
            Making a free CV for {c.name}: common questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-lg border border-peach bg-white p-5">
                <h3 className="font-semibold text-plum">{f.q}</h3>
                <p className="mt-1.5 text-sm text-plum-soft leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. The rest of AlmiWorld for this country — cross-sell */}
        <section className="mb-12" aria-label="More from AlmiWorld">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-5">
            The rest of AlmiWorld for {c.name}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((p) => (
              <li key={p.key}>
                <a href={p.countryUrl(c.slug)} className="block rounded-lg border border-peach bg-white p-5 hover:border-coral transition-colors h-full">
                  <p className="font-semibold text-plum mb-1">{p.name} →</p>
                  <p className="text-sm text-plum-soft leading-relaxed">{p.tagline}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 8. Final funnel CTA */}
        <section className="mb-10 text-center">
          <a
            href={buildUrl}
            className="inline-block rounded-md bg-coral px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-coral-deep"
          >
            Build your {c.name} CV on AlmiCV →
          </a>
          <p className="text-xs text-plum-soft mt-3">No credit card required to start.</p>
        </section>
      </div>
    </main>
  );
}
