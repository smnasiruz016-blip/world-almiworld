import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCountryBySlug } from "@/lib/countries";
import { getRoleBySlug } from "@/lib/roles";
import { getFreeCvContent, hasFreeCvContent } from "@/lib/free-cv-content";
import { getConvention } from "@/lib/cv-conventions";

type Params = { country: string; role: string };

const SITE = "https://world.almiworld.com";
const YEAR = String(new Date().getFullYear());

// On-demand ISR — the grid is ~50k leaves; seed nothing, render on first request.
export const dynamicParams = true;
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

// ── Sector-driven role differentiation ──────────────────────────────────────
// The honest role-level signal the hub holds is the role's sector. This maps a
// sector to the path-specific reality (regulated profession? portfolio? licence?)
// so a nurse page reads genuinely differently from a driver or developer page —
// not the same country boilerplate with the name swapped.
function sectorPath(sector: string, role: string, country: string): string {
  const s = sector.toLowerCase();
  if (/health|medical|nurs|pharma|dental|clinic/.test(s))
    return `${role} is a regulated profession in most countries: you usually register with a national health or nursing council and have your credentials verified before you can practise — a step that is separate from your degree. Confirm the licensing body for ${country} early, because it often takes longer than the job search itself.`;
  if (/tech|software|\bit\b|data|comput|engineer.*soft|develop/.test(s))
    return `For ${role}, a portfolio frequently counts as much as the CV — a GitHub, live projects, or a case study. Many ${role} roles are also open to remote and freelance work, so your search isn't limited to employers physically in ${country}.`;
  if (/engineer/.test(s))
    return `Engineering is often a chartered or regulated field — check whether ${country} requires a professional engineering licence or chartership for ${role}, and whether your qualification needs local recognition.`;
  if (/educa|teach|academ/.test(s))
    return `Teaching roles like ${role} usually need a recognised qualification, and school positions often require local certification or a teaching licence in ${country}. Confirm which applies before you apply.`;
  if (/financ|account|bank|audit|insur/.test(s))
    return `For ${role}, professional certification (an ACCA/CPA-equivalent recognised in ${country}) is frequently expected alongside the degree. Check what ${country} recognises so your application isn't filtered out on credentials.`;
  if (/construct|trade|electric|plumb|weld|carpent|mechanic/.test(s))
    return `Trade roles like ${role} are usually gated on a skills test or trade certification rather than a degree, and many positions are filled through direct hiring and referrals. A recognised certificate plus proof of hours moves you to the front.`;
  if (/logist|transport|driv|supply|warehous|deliver/.test(s))
    return `For ${role}, a valid local licence or permit is normally the gating requirement, and hiring is often direct rather than through agencies. Make sure your licence is recognised in ${country} before you arrive.`;
  if (/hospital|tourism|chef|food|hotel|catering|culina/.test(s))
    return `For ${role}, experience and references weigh heavily, and some positions need a certificate (food-safety or similar). Seasonal demand in ${country} can change your timing, so apply ahead of the peak.`;
  if (/legal|law|paralegal/.test(s))
    return `Legal roles like ${role} are tightly regulated — practising usually requires admission to the bar or a locally recognised qualification in ${country}. A foreign law degree rarely transfers directly; confirm the route first.`;
  if (/sales|market|business|admin|hr|human/.test(s))
    return `For ${role}, the CV and a clear record of results carry most of the weight — there's rarely a licence, so a sharp, ATS-readable application and the right local job sites matter most in ${country}.`;
  return `Check whether ${role} is a regulated profession in ${country}: some roles need a licence or registration that is separate from your degree, and finding that out early saves months.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country, role } = await params;
  const c = getCountryBySlug(country);
  const r = getRoleBySlug(role);
  if (!c || !r) return { title: "Not found" };
  const rich = hasFreeCvContent(c.slug);
  // Real-data-or-canonical-up: a page is self-canonical + indexable only where the
  // country carries real localized data to build a substantive plan. Otherwise it
  // stays a cross-link page that canonicalises up to the /[country] hub.
  const canonical = rich ? `${SITE}/${c.slug}/${r.slug}` : `${SITE}/${c.slug}`;
  return {
    title: rich
      ? `${r.name} in ${c.name} (${YEAR}): Jobs, Salary, CV & Study Path`
      : `${r.name} in ${c.name} — AlmiWorld`,
    description: rich
      ? `The whole path to working as a ${r.name} in ${c.name}: the job market, where to study, which English test, the CV ${c.name} expects, the real local job sites, and where to check honest pay. One plan, ${YEAR}.`
      : `Jobs, salary, CV guidance and universities for ${r.name} in ${c.name}. The AlmiWorld products, one page.`,
    alternates: { canonical },
  };
}

function ProductCard({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <a href={href} className="block rounded-lg border border-neutral-200 p-4 hover:border-neutral-300">
      <span className="block text-sm font-medium text-neutral-900 underline-offset-2 hover:underline">{title}</span>
      <span className="mt-1 block text-xs text-neutral-500">{sub}</span>
    </a>
  );
}

export default async function CountryRolePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country, role } = await params;
  const c = getCountryBySlug(country);
  const r = getRoleBySlug(role);
  if (!c || !r) notFound();

  const fcc = getFreeCvContent(c.slug);
  const conv = getConvention(c.slug);
  const lower = r.name.toLowerCase();

  const jobsUrl = `https://almijob.almiworld.com/jobs/${c.slug}/${r.slug}`;
  const salaryUrl = `https://almisalary.almiworld.com/salary/${c.slug}/${r.slug}`;
  const cvUrl = `https://almicv.almiworld.com/cv-guide/${c.slug}/${r.slug}`;
  const studyUrl = `https://almistudy.almiworld.com/universities/${c.slug}`;
  const prepUrl = "https://almiprep.almiworld.com";

  // ── Thin / canonical-up fallback: country has no localized data to build a
  // real plan, so don't pad it — point to the richer country hub.
  if (!fcc) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">{r.name} in {c.name}</h1>
        <p className="text-neutral-600">
          We don&apos;t yet hold the localized job-market and CV data for {c.name} needed to build a full
          {" "}{r.name} plan. Start from the {c.name} hub, or go straight to a product below.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ProductCard href={jobsUrl} title={`${r.name} jobs in ${c.name}`} sub="almijob.almiworld.com" />
          <ProductCard href={salaryUrl} title={`${r.name} salary in ${c.name}`} sub="almisalary.almiworld.com" />
          <ProductCard href={cvUrl} title={`Build your ${r.name} CV`} sub="almicv.almiworld.com" />
          <ProductCard href={studyUrl} title={`Universities in ${c.name}`} sub="almistudy.almiworld.com" />
        </div>
        <p className="text-sm"><Link href={`/${c.slug}`} className="text-neutral-500 hover:underline">← Everything for {c.name}</Link></p>
      </main>
    );
  }

  const sectorNote = sectorPath(r.sector, r.name, c.name);
  const alsoCalled = (r.aliases ?? []).filter((a) => a.toLowerCase() !== lower);

  const faqs: { q: string; a: string }[] = [
    {
      q: `Can I work as a ${r.name} in ${c.name} from abroad?`,
      a: `Yes — international applications are normal. The path is: meet any registration or licence ${c.name} requires for ${r.name}, prove your English where the route needs it, prepare a ${c.name}-style CV, then apply on the real local job sites below. ${r.aliases && r.aliases.length ? `${c.name} listings may also use "${r.aliases[0]}".` : ""}`,
    },
    {
      q: `What does a ${r.name} CV need in ${c.name}?`,
      a: `In ${c.name} the document is the ${fcc.localTerm}${conv ? `, typically ${conv.pageLength}, photo ${conv.includePhoto}` : ""}. ${conv?.notes ?? ""} Tailor it to each posting — AlmiCV builds it free.`,
    },
    {
      q: `Do I need an English test to work as a ${r.name} in ${c.name}?`,
      a: `It depends on the employer and your visa route — some need IELTS, TOEFL or PTE, some accept your prior education. Check your specific route, and practise honestly before you pay the exam fee with AlmiPrep / AlmiTOEFL / AlmiPTE.`,
    },
    {
      q: `Where can I find ${r.name} jobs in ${c.name}?`,
      a: `Widely used in ${c.name}: ${fcc.localJobSites.join(", ")}. AlmiJob opens the right ones with your search pre-filled — your CV is read once and never stored.`,
    },
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-sm">
        <Link href="/" className="text-neutral-500 hover:underline">AlmiWorld</Link>
        <span className="text-neutral-400"> / </span>
        <Link href={`/${c.slug}`} className="text-neutral-500 hover:underline">{c.name}</Link>
        <span className="text-neutral-400"> / </span>
        <span className="text-neutral-700">{r.name}</span>
      </nav>

      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          The whole path · {r.sector} · {c.name} · {YEAR}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{r.name} in {c.name}: the whole path</h1>
        {alsoCalled.length > 0 && (
          <p className="text-sm text-neutral-500">Also called: {alsoCalled.join(" · ")}</p>
        )}
        <p className="text-neutral-700 leading-relaxed">
          Working as a {r.name} in {c.name} isn&apos;t one decision — it&apos;s a path: where to study,
          which English test (if any), the CV {c.name} expects, where the real jobs are, and what the
          role honestly pays. {fcc.jobMarket} This page pulls the whole path into one place — and links
          you to the free tool for each step. Application language: {c.primaryLanguage}.
        </p>
      </header>

      {/* Role-specific reality (sector-driven) */}
      <section className="space-y-2">
        <h2 className="text-xl font-medium">Is {r.name} a regulated route in {c.name}?</h2>
        <p className="text-neutral-700 leading-relaxed">{sectorNote}</p>
      </section>

      {/* The ordered plan */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Your {r.name} path, step by step</h2>
        <ol className="space-y-4">
          <li className="rounded-lg border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-900">1. Study (if your route needs a qualification)</p>
            <p className="mt-1 text-sm text-neutral-700">Find a verified university in {c.name} — accreditation you can check, no agent commissions.</p>
            <a href={studyUrl} className="mt-2 inline-block text-sm text-neutral-900 underline underline-offset-2 hover:no-underline">Universities in {c.name} (AlmiStudy) →</a>
          </li>
          <li className="rounded-lg border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-900">2. Prove your English (where the route needs it)</p>
            <p className="mt-1 text-sm text-neutral-700">Which test depends on the employer or visa — IELTS, TOEFL or PTE. Know your real level before you pay the exam fee.</p>
            <a href={prepUrl} className="mt-2 inline-block text-sm text-neutral-900 underline underline-offset-2 hover:no-underline">Honest test prep (AlmiPrep / AlmiTOEFL / AlmiPTE) →</a>
          </li>
          <li className="rounded-lg border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-900">3. Build a {c.name}-ready CV</p>
            <p className="mt-1 text-sm text-neutral-700">
              In {c.name} it&apos;s the {fcc.localTerm}{conv ? `, usually ${conv.pageLength}, photo ${conv.includePhoto}, references ${conv.referenceSection}` : ""}.
              {fcc.formatNotes.length > 0 ? ` ${fcc.formatNotes[0]}` : ""} Pay is quoted in {fcc.currency}.
            </p>
            <a href={cvUrl} className="mt-2 inline-block text-sm text-neutral-900 underline underline-offset-2 hover:no-underline">Build your {r.name} CV (AlmiCV) →</a>
          </li>
          <li className="rounded-lg border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-900">4. Find the job</p>
            <p className="mt-1 text-sm text-neutral-700">Real {c.name} job sites for {lower} work: {fcc.localJobSites.join(", ")}.{fcc.workRouteNote ? ` ${fcc.workRouteNote}` : ""}</p>
            <a href={jobsUrl} className="mt-2 inline-block text-sm text-neutral-900 underline underline-offset-2 hover:no-underline">{r.name} jobs in {c.name} (AlmiJob) →</a>
          </li>
          <li className="rounded-lg border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-900">5. Know what it pays</p>
            <p className="mt-1 text-sm text-neutral-700">Before you negotiate, see the real, government-sourced pay range for a {r.name} in {c.name} — we don&apos;t reprint the numbers here; AlmiSalary keeps them current.</p>
            <a href={salaryUrl} className="mt-2 inline-block text-sm text-neutral-900 underline underline-offset-2 hover:no-underline">{r.name} salary in {c.name} (AlmiSalary) →</a>
          </li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">{r.name} in {c.name} — questions answered</h2>
        <dl className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-lg border border-neutral-200 p-4">
              <dt className="text-sm font-medium text-neutral-900">{f.q}</dt>
              <dd className="mt-1.5 text-sm text-neutral-700 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
