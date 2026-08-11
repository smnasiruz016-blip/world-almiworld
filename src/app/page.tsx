import type { Metadata } from "next";

// Layout sets a plain `title` (no template) so this fully replaces it — no
// double-brand. This meta is the single biggest CTR lever for the hub
// (~13.9k impressions): benefit-first, honest, no hype. (AlmiWorld_Hub_
// Perfect_Master.md, owner-approved 21–22 June 2026.)
const TITLE =
  "AlmiWorld — Study, Work & Move Abroad Without Paying Agents | Mostly Free";
const DESC =
  "Going abroad without handing thousands to agents who guess for you. AlmiWorld puts the whole path — universities, English tests, CV, jobs, salaries — in one honest place. Most of it free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: { title: TITLE, description: DESC, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

// The path abroad — each step is a product linking to its own domain.
// Figures confirmed by the owner (Doctrine #6 — only confirmed facts):
// 3,000+ universities, 512 roles, 193 countries. Every paid product is
// $12/mo with a 7-day trial; AlmiJob + AlmiSalary are free.
const STEPS = [
  {
    n: 1,
    title: "Find your university — AlmiStudy",
    body:
      "Search 3,000+ verified universities abroad and find out who will actually accept you — no paid placements, no fake promises. Free.",
    links: [{ name: "AlmiStudy", href: "https://almistudy.almiworld.com" }],
  },
  {
    n: 2,
    title: "Pass your English test — AlmiPrep / AlmiPTE / AlmiTOEFL",
    body:
      "Honest AI band scores for IELTS, PTE, and the new 2026 adaptive TOEFL. Know your real level before exam day, not after you've paid the fee. $12/mo.",
    links: [
      { name: "AlmiPrep", href: "https://almiprep.almiworld.com" },
      { name: "AlmiPTE", href: "https://almipte.almiworld.com" },
      { name: "AlmiTOEFL", href: "https://almitoefl.almiworld.com" },
      { name: "AlmiOET", href: "https://almioet.almiworld.com" },
      { name: "AlmiDET", href: "https://almidet.almiworld.com" },
      { name: "AlmiCELPIP", href: "https://almicelpip.almiworld.com" },
      { name: "AlmiGoethe", href: "https://almigoethe.almiworld.com" },
      { name: "AlmiFrench", href: "https://almifrench.almiworld.com" },
      { name: "AlmiSpanish", href: "https://almispanish.almiworld.com" },
      { name: "AlmiJapanese", href: "https://almijapanese.almiworld.com" },
      { name: "AlmiKorean", href: "https://almikorean.almiworld.com" },
    ],
  },
  {
    n: 3,
    title: "Build a CV that gets read — AlmiCV",
    body:
      "Get past the corporate tracking software (ATS) with a real resume score and AI that sharpens your words without erasing your own voice. $12/mo.",
    links: [{ name: "AlmiCV", href: "https://almicv.almiworld.com" }],
  },
  {
    n: 4,
    title: "Find the right job — AlmiJob",
    body:
      "Upload your CV in any language; we open the right local and global job sites with your search pre-filled. Your file is read once and erased — never stored. Free.",
    links: [{ name: "AlmiJob", href: "https://almijob.almiworld.com" }],
  },
  {
    n: 5,
    title: "Know your worth — AlmiSalary",
    body:
      "Check real pay ranges for 512 roles across 193 countries — including the allowances and bonuses agents don't mention, where they apply. Free.",
    links: [{ name: "AlmiSalary", href: "https://almisalary.almiworld.com" }],
  },
];

const FAQS = [
  {
    q: "How can I study or move abroad without an agent?",
    a: "AlmiWorld gives you the tools to do it yourself: look up universities, practise honestly for your English test, build your CV, search jobs, and check salaries — all in one place. Most of it is free.",
  },
  {
    q: "Is AlmiWorld really free?",
    a: "Most of it. AlmiStudy (universities), AlmiJob (jobs), and AlmiSalary (salaries) are free, no signup. The paid tools — AlmiCV and the test-prep apps (AlmiPrep / AlmiTOEFL / AlmiPTE) — are all $12/mo with a 7-day free trial.",
  },
  {
    q: "Which English test should I take — IELTS, PTE, or TOEFL?",
    a: "It depends on your university or visa route — each accepts different tests. AlmiWorld lets you practise honestly for all three before you spend a single exam fee, so you can pick the one that fits your route.",
  },
];

const CTA_CLASS =
  "inline-flex min-h-[44px] items-center justify-center rounded-md bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700";

// Footer product line (master §6). Shamool pledge line lives in the shared
// ShamoolFooter (rendered by the layout below this).
const FOOTER_LINK =
  "font-medium text-neutral-900 underline-offset-2 hover:underline";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-16">
      {/* HERO */}
      <header className="space-y-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          One honest platform · the whole path abroad · built for people doing
          it alone
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Everything you need to study, work, and move abroad
        </h1>
        <p className="text-xl font-medium text-neutral-800">
          The honest alternative to expensive agents. Most of it free.
        </p>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Going abroad is the biggest move most people ever make — and almost
          everyone does it half-blind, handing thousands to agents who guess on
          their behalf. AlmiWorld gives you the tools and the truth, so you can
          do this yourself and do it right, without paying thousands for
          guesswork.
        </p>
        <div className="flex justify-center pt-2">
          <a href="#path" className={CTA_CLASS}>
            Start your path — free
          </a>
        </div>
      </header>

      {/* WHY ALMIWORLD — honest by design */}
      <section className="space-y-4">
        <h2 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl">
          Why AlmiWorld: honest by design
        </h2>
        <p className="text-neutral-600">
          Going abroad shouldn&apos;t mean guessing — or paying an agent
          thousands to guess for you. Which university will actually accept you?
          Can you pass IELTS or PTE? Why does your CV keep getting ignored?
          Where are the real jobs? Are you being underpaid?
        </p>
        <p className="text-neutral-600">
          Every one of these questions sends people to expensive agents,
          scattered websites, and strangers on forums — and they still get it
          wrong, alone, after paying thousands for the privilege.
        </p>
        <p className="text-neutral-600">
          AlmiWorld puts the whole path in one honest place. No commissions, no
          hype, no one steering you toward what pays them. Just real tools, in
          your hands.
        </p>
      </section>

      {/* THE PATH — the ecosystem as one path, each step a product */}
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
                    <a
                      key={l.name}
                      href={l.href}
                      className="text-neutral-900 underline-offset-2 hover:underline"
                    >
                      {l.name} →
                    </a>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* BUILT FOR EVERY COUNTRY — replaces the old curated 6-country list */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Built for every country, from and to</h2>
        <p className="text-neutral-600">
          AlmiWorld is built for people moving{" "}
          <span className="font-medium">
            from and to any country in the world
          </span>{" "}
          — not a short &ldquo;curated&rdquo; list. Every product covers all
          origin countries, with destination coverage as deep as the real data
          allows. Wherever you&apos;re starting from, you&apos;re not left out.
        </p>
      </section>

      {/* FAQ — search-query shaped questions */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Questions answered</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">{f.q}</h3>
              <p className="mt-1 text-sm text-neutral-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER — product line (master §6); Shamool pledge below via layout */}
      <section className="border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600">
        <p>
          Study with{" "}
          <a href="https://almistudy.almiworld.com" className={FOOTER_LINK}>
            AlmiStudy
          </a>{" "}
          · Prep with{" "}
          <a href="https://almiprep.almiworld.com" className={FOOTER_LINK}>
            AlmiPrep
          </a>{" "}
          /{" "}
          <a href="https://almitoefl.almiworld.com" className={FOOTER_LINK}>
            AlmiTOEFL
          </a>{" "}
          /{" "}
          <a href="https://almioet.almiworld.com" className={FOOTER_LINK}>
            AlmiOET
          </a>{" "}
          /{" "}
          <a href="https://almipte.almiworld.com" className={FOOTER_LINK}>
            AlmiPTE
          </a>{" "}
          /{" "}
          <a href="https://almidet.almiworld.com" className={FOOTER_LINK}>
            AlmiDET
          </a>{" "}
          /{" "}
          <a href="https://almicelpip.almiworld.com" className={FOOTER_LINK}>
            AlmiCELPIP
          </a>{" "}
          /{" "}
          <a href="https://almigoethe.almiworld.com" className={FOOTER_LINK}>
            AlmiGoethe
          </a>{" "}
          /{" "}
          <a href="https://almifrench.almiworld.com" className={FOOTER_LINK}>
            AlmiFrench
          </a>{" "}
          /{" "}
          <a href="https://almispanish.almiworld.com" className={FOOTER_LINK}>
            AlmiSpanish
          </a>{" "}
          /{" "}
          <a href="https://almijapanese.almiworld.com" className={FOOTER_LINK}>
            AlmiJapanese
          </a>{" "}
          /{" "}
          <a href="https://almikorean.almiworld.com" className={FOOTER_LINK}>
            AlmiKorean
          </a>{" "}
          · Build your CV with{" "}
          <a href="https://almicv.almiworld.com" className={FOOTER_LINK}>
            AlmiCV
          </a>{" "}
          · Find jobs with{" "}
          <a href="https://almijob.almiworld.com" className={FOOTER_LINK}>
            AlmiJob
          </a>{" "}
          · Check pay with{" "}
          <a href="https://almisalary.almiworld.com" className={FOOTER_LINK}>
            AlmiSalary
          </a>
          .
        </p>
      </section>
    </main>
  );
}
