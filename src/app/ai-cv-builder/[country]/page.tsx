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
  const url = `${SITE_ORIGIN}/ai-cv-builder/${c.slug}`;
  const title = `AI CV Builder in ${c.name} (${YEAR}) — AI-Written, ATS-Ready ${term} · AlmiWorld`;
  const description = `Use AI to write, translate and tailor a ${c.name}-ready ${term} — AI drafts your bullet points, writes in ${c.primaryLanguage} and tunes keywords for ATS. AlmiWorld's AI CV builder, on AlmiCV.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: hasFreeCvContent(c.slug) ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: "website", siteName: "AlmiWorld" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HubAiCvBuilder({
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
  const isEnglish = c.primaryLanguage === "English";

  const url = `${SITE_ORIGIN}/ai-cv-builder/${c.slug}`;
  const buildUrl = CV.countryUrl(c.slug);

  const aiFeatures: { title: string; note: string }[] = [
    { title: "Drafts your bullet points", note: "Turn plain job duties into clear, results-focused lines — the AI sharpens your wording without erasing your own voice." },
    {
      title: isEnglish ? "Polishes your English" : `Writes in ${c.primaryLanguage}`,
      note: isEnglish
        ? `Tighten phrasing and fix tone so your ${term} reads cleanly for ${c.name} employers.`
        : `Draft or translate your ${term} into ${c.primaryLanguage}, so you can apply in the language ${c.name} employers expect.`,
    },
    { title: "Tailors to the job", note: `Paste a job ad and the AI aligns your wording and keywords so the ${term} fits that role and gets past ATS filters.` },
    {
      title: `Applies ${c.name} conventions`,
      note: `Keeps the ${term} to local norms — ${convention.pageLength}, photo ${convention.includePhoto}, ${convention.includeDOB === "common" ? "date of birth commonly included" : "no date of birth"}.`,
    },
    { title: "Scores your CV", note: "The resume score rates structure, keywords and formatting, and flags fixes before you apply." },
  ];

  const steps: string[] = [
    `Start from scratch or paste an old CV — the AI structures it into a ${c.name} ${term}.`,
    "Let the AI draft — it turns your experience into clear, results-focused bullet points.",
    isEnglish ? "Refine your wording — the AI sharpens phrasing while keeping your voice." : `Translate to ${c.primaryLanguage} — apply in the language ${c.name} employers expect.`,
    "Tailor to a job — paste the ad and the AI aligns your keywords for the ATS.",
    "Score and export — check the resume score, then download a clean PDF.",
  ];

  const faqs: { q: string; a: string }[] = [
    {
      q: isEnglish ? `Can AI help write my ${term} for ${c.name}?` : `Can AI write my ${term} in ${c.primaryLanguage}?`,
      a: isEnglish
        ? `Yes — on AlmiCV the AI drafts and sharpens your bullet points and summary, and you review and edit before you apply.`
        : `Yes — on AlmiCV the AI can draft your ${term} and translate it into ${c.primaryLanguage}. You review and edit everything before applying.`,
    },
    { q: `Will an AI-written ${term} pass the ATS?`, a: `The AI tunes your keywords to the job ad and keeps a clean, single-column-friendly structure ATS software can read, and the resume score checks both before you apply.` },
    { q: `Can the AI tailor my ${term} to a specific job?`, a: `Yes — paste the job description and the AI aligns your wording, skills and keywords to that role for ${c.name} employers.` },
    { q: `How much does the AI cost?`, a: `AlmiCV is $12/month with a 7-day free trial — unlimited AI and unlimited CVs. Cancel inside the trial and you pay nothing.` },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AlmiWorld", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: `AI CV Builder in ${c.name}`, item: url },
    ],
  };

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
            <li><span className="font-medium text-plum">AI CV Builder in {c.name}</span></li>
          </ol>
        </nav>

        {/* 2. Eyebrow + H1 + advertise intro + funnel CTA */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-coral">AlmiWorld · AI CV Builder</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-plum mb-4">
            AI CV Builder in {c.name}
          </h1>
          <p className="text-base sm:text-lg text-plum-soft leading-relaxed max-w-3xl">
            AlmiWorld&apos;s AI CV builder — on AlmiCV — helps write your {term} for {c.name}: it drafts your bullet points, {isEnglish ? "sharpens your English" : `writes in ${c.primaryLanguage}`}, tailors your keywords to the job, and keeps the structure ATS-ready. You stay in control and review every line.
          </p>
          <div className="mt-6">
            <a href={buildUrl} className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-coral px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-coral-deep">
              Build your {term} with AI on AlmiCV →
            </a>
            <p className="text-xs text-plum-soft mt-2">7-day free trial, then $12/month on AlmiCV. Cancel anytime.</p>
          </div>
        </header>

        {/* 3. What the AI does */}
        <section className="mb-12 rounded-xl border border-peach bg-white p-6 sm:p-8" aria-labelledby="ai-title">
          <h2 id="ai-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-4">
            What the AI does for your {c.name} {term}
          </h2>
          <ul className="space-y-3">
            {aiFeatures.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span aria-hidden="true" className="text-coral mt-0.5">✓</span>
                <span className="text-sm text-plum"><span className="font-semibold">{f.title}</span> — <span className="text-plum-soft">{f.note}</span></span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. How the AI builds it */}
        <section className="mb-12" aria-labelledby="how-title">
          <h2 id="how-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-5">
            How the AI builds your {term}
          </h2>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4 rounded-lg border border-peach bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white">{i + 1}</span>
                <p className="text-sm text-plum leading-relaxed self-center">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 5. Conventions the AI applies */}
        <section className="mb-12 rounded-xl border border-peach bg-white p-6 sm:p-8" aria-labelledby="norms-title">
          <h2 id="norms-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-4">
            {c.name} conventions the AI works to
            {!isVerified && (
              <span className="ml-3 align-middle text-[11px] uppercase tracking-wide text-plum-soft bg-cream-soft px-2 py-0.5 rounded-full">Regional default</span>
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
            These are common conventions, not rules — always review the AI&apos;s output and check the employer&apos;s expectations for each application.
          </p>
        </section>

        {/* 6. Job market */}
        {content && (
          <section className="mb-12" aria-labelledby="market-title">
            <h2 id="market-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-4">
              Where your {term} goes in {c.name}
            </h2>
            <p className="text-sm sm:text-base text-plum-soft leading-relaxed max-w-3xl mb-4">
              {content.jobMarket} Pay is quoted in {content.currency}, and the main hiring hubs include {content.cities.join(", ")}.
            </p>
            <p className="text-sm text-plum-soft leading-relaxed max-w-3xl">
              Once the AI has built your {term}, you can apply on {content.localJobSites.join(", ")}.
            </p>
          </section>
        )}

        {/* 7. FAQ */}
        <section className="mb-12" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-plum mb-5">
            Using AI to build a CV in {c.name}: common questions
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

        {/* 8. Cross-sell */}
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

        {/* 9. Final CTA */}
        <section className="mb-10 text-center">
          <a href={buildUrl} className="inline-block rounded-md bg-coral px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-coral-deep">
            Build your {c.name} CV with AI on AlmiCV →
          </a>
          <p className="text-xs text-plum-soft mt-3">7-day free trial, then $12/month. Cancel anytime.</p>
        </section>
      </div>
    </main>
  );
}
