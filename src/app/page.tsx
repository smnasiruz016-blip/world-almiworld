import type { Metadata } from "next";
import Link from "next/link";
import { COUNTRIES_SERVED } from "@/lib/countries";

// Layout sets a plain `title` (no template) so this fully replaces it — no
// double-brand.
const TITLE = "Study, Work & Move Abroad — One Honest Platform | AlmiWorld";
const DESC =
  "Everything to study, work & move abroad: find universities, pass IELTS/PTE, build a winning CV, search jobs, check real salaries. One platform, most free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: { title: TITLE, description: DESC, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const TOP_PICKS = [
  "united-states",
  "united-kingdom",
  "united-arab-emirates",
  "germany",
  "india",
  "pakistan",
];

const TRUST = [
  "One platform to study, work & move abroad",
  "Honest & verified — no agent commissions",
  "Most tools completely free",
  "Built for everyone, everywhere",
];

// The path abroad — each step is a product linking to its own domain.
// Coverage figures: "500+" is a safe floor (AlmiSalary has 519). The 3,197
// universities figure is AlmiStudy's current verified count; this hub can't
// live-read it, so it's a conservative floor (Study only grows) — review if
// AlmiStudy's count is ever reduced.
const STEPS = [
  {
    n: 1,
    title: "Find your university",
    body: "Search 3,197 verified universities abroad. Free.",
    links: [{ name: "AlmiStudy", href: "https://almistudy.almiworld.com" }],
  },
  {
    n: 2,
    title: "Pass your English test",
    body: "Honest AI band scores for IELTS, plus PTE practice. Know your real level before test day.",
    links: [
      { name: "AlmiPrep", href: "https://almiprep.almiworld.com" },
      { name: "AlmiPTE", href: "https://almipte.almiworld.com" },
    ],
  },
  {
    n: 3,
    title: "Build a CV that wins",
    body: "Beat the ATS filter with a real resume score and AI that keeps your voice.",
    links: [{ name: "AlmiCV", href: "https://almicv.almiworld.com" }],
  },
  {
    n: 4,
    title: "Find the right job",
    body: "Upload your CV, find jobs worldwide — your CV never stored.",
    links: [{ name: "AlmiJob", href: "https://almijob.almiworld.com" }],
  },
  {
    n: 5,
    title: "Know your worth",
    body: "Real salary ranges for 500+ roles, including what the same job pays abroad.",
    links: [{ name: "AlmiSalary", href: "https://almisalary.almiworld.com" }],
  },
];

const WHY = [
  {
    title: "Honest by design",
    body: "We verify, we don't hype. No paid placements, no fake promises, no agent commissions.",
  },
  {
    title: "Most of it is free",
    body: "The tools people pay agents thousands for — universities, salaries, job sources — are free here.",
  },
  {
    title: "One path, one place",
    body: "Every step connects: find the university, pass the test, build the CV, get the job, know your pay.",
  },
  {
    title: "Built for everyone, everywhere",
    body: "Multilingual, worldwide, made for the person doing this alone — from any country.",
  },
];

const FAQS = [
  {
    q: "How can I study abroad without an agent?",
    a: "AlmiWorld gives you the verified tools directly — find universities, pass IELTS/PTE, build your CV — so you can do it yourself, most of it free.",
  },
  {
    q: "What do I need to move abroad?",
    a: "Usually a university or job offer, an English test score, and a strong CV. AlmiWorld covers each step in one place.",
  },
  {
    q: "Is AlmiWorld really free?",
    a: "Most of it is — universities, salaries, and job tools are free. AlmiCV ($7/mo) and AlmiPrep ($12/mo) are the paid steps.",
  },
  {
    q: "Which English test should I take — IELTS or PTE?",
    a: "Both are widely accepted; AlmiWorld lets you practise honestly for each before you decide.",
  },
];

const CTA_CLASS =
  "inline-flex min-h-[44px] items-center justify-center rounded-md bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700";

export default function HomePage() {
  const picks = TOP_PICKS.map((slug) =>
    COUNTRIES_SERVED.find((c) => c.slug === slug),
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-16">
      {/* HERO */}
      <header className="space-y-5 text-center">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Everything You Need to Study, Work &amp; Move Abroad
        </h1>
        <p className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          One honest platform for the whole path — most of it free.
        </p>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Going abroad is the biggest move most people ever make — and almost
          everyone does it half-blind, handing thousands to agents who guess on
          their behalf. AlmiWorld is the honest alternative: find your
          university, pass your IELTS or PTE, build a CV that wins, search jobs
          worldwide, and know your real salary. One platform. Most of it free.
        </p>
        <div className="flex justify-center pt-2">
          <a href="#path" className={CTA_CLASS}>Start your path — free</a>
        </div>
        <p className="text-sm text-neutral-500">
          One platform. The whole path abroad. Built for people doing it alone,
          from anywhere in the world.
        </p>
      </header>

      {/* TRUST BAR */}
      <ul className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-lg bg-neutral-50 p-5 sm:grid-cols-2">
        {TRUST.map((t) => (
          <li key={t} className="flex items-start gap-2 text-sm text-neutral-700">
            <span aria-hidden className="font-bold text-neutral-900">✓</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      {/* PROBLEM (PAS) */}
      <section className="space-y-4">
        <h2 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl">
          Going abroad shouldn&apos;t mean guessing — or paying an agent thousands
          to guess for you.
        </h2>
        <p className="text-neutral-600">
          Which university will actually accept you? Can you pass IELTS or PTE?
          Why does your CV keep getting ignored? Where are the real jobs? Are you
          being underpaid? Every one of these questions sends people to expensive
          agents, scattered websites, and strangers on forums — and they still
          get it wrong, alone, after paying thousands for the privilege.
        </p>
        <p className="text-neutral-600">
          AlmiWorld puts the entire path in one honest place. No commissions, no
          hype, no one steering you toward what pays them. Just the tools and the
          truth — so you can do this yourself, and do it right, without being
          charged thousands for guesswork.
        </p>
      </section>

      {/* THE PATH — ecosystem as one path, each step a product */}
      <section id="path" className="space-y-5 scroll-mt-8">
        <h2 className="text-xl font-medium">Your path abroad, step by step</h2>
        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex gap-4 rounded-lg border border-neutral-200 p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                {s.n}
              </span>
              <div className="space-y-1">
                <h3 className="font-semibold text-neutral-900">{s.title}</h3>
                <p className="text-sm text-neutral-600">{s.body}</p>
                <p className="flex flex-wrap gap-x-3 pt-1 text-sm font-medium">
                  {s.links.map((l) => (
                    <a key={l.name} href={l.href} className="text-neutral-900 underline-offset-2 hover:underline">
                      {l.name} →
                    </a>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-sm text-neutral-500">
          Plus ebooks and more — free and low-cost — with new tools always coming.
        </p>
      </section>

      {/* START WITH A COUNTRY — functional routing (kept) */}
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

      {/* WHY ALMIWORLD */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Why AlmiWorld</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">{w.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ — search-query shaped questions (SEO) */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Questions, answered</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">{f.q}</h3>
              <p className="mt-1 text-sm text-neutral-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="space-y-5 rounded-xl bg-neutral-900 p-10 text-center text-white">
        <h2 className="text-balance text-2xl font-semibold sm:text-3xl">
          Your path abroad starts with one honest step.
        </h2>
        <p className="mx-auto max-w-2xl text-neutral-300">
          Find your university. Pass your test. Build your CV. Know your worth.
          Most of it free.
        </p>
        <div className="flex justify-center">
          <a
            href="#path"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Start your path — free
          </a>
        </div>
      </section>
    </main>
  );
}
